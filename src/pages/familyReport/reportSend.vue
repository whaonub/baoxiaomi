<template>
  <div class="dt-pages report-send-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader :title="title" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <div class="report-img">
        <img src="../../assets/imgs/report001.jpg">
      </div>
      <div class="report-text">
        <div class="tit">发送报告操作流程</div>
        <div class="text">
          <p>为确保报告的私密性和安全性，此报告仅供客户本人查询</p>
        </div>
        <div class="step-content">
          <div class="step01 step">
            <span>1</span>
            请您确认收件客户，点击“我要发送”转发至客户。
            <icon name="leftarrow" class="dt-icon"></icon>
          </div>
          <div class="step02 step">
            <span>2</span>
            客户识别海报中的二维码，关注公众号，通过验证，即可查看报告。
          </div>
        </div>
      </div>
      <div class="report-customer">
        <div class="title">主客户</div>
        <div class="customer-info">
          <div class="name fl com-style">
            <icon class="dt-icon beneficiary_user" name="beneficiary_user"></icon>
            <span class="text">{{name}}</span>
          </div>
          <div class="phone fl com-style">
            <x-input
              :disabled="isDisabled"
              :show-clear="false"
              ref="phoneNum"
              required
              is-type="china-mobile"
              v-model="phone"
              :placeholder="tips"
            ></x-input>
          </div>
          <div class="make fl" @click="makeFamilyReport">发送报告</div>
        </div>
      </div>
      <reportSendPoster
        v-if="modalStatus"
        :age="age"
        :gender="gender"
        :QRcode="QRcode"
        :name="name"
        :agentData="agentData"
        @getImgBase64="getImgBase64"
        @getPdf="getPdf"
      ></reportSendPoster>
    </div>
  </div>
</template>
<script>
import { XInput, TransferDom, Popup, Group, Cell } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import reportSendPoster from "./reportSendPoster";
import { getDevice } from "@/config/utils.js";
import html2Canvas from "html2canvas";
export default {
  name: "reportSend",
  directives: {
    TransferDom
  },
  components: {
    dtHeader,
    XInput,
    Popup,
    Group,
    Cell,
    reportSendPoster
  },
  data() {
    return {
      title: "发送报告",
      tips: "请输入手机号",
      name: "",
      phone: "",
      age: "",
      gender: "",
      // popupStatus: false,
      familyId: "",
      customerId: "",
      reportId: "",
      reportCode: "",
      QRcode: "",
      trusteeshipType: null,
      device: getDevice(),
      modalStatus: false,
      agentData: {},
      shareStatus: null,
      isDisabled: false,
      imgBase64: ""
    };
  },
  created() {
    this.shareStatusReturn();
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.familyId = this.$route.query.familyId;
    this.reportId = this.$route.query.reportId;
    this.initData();
  },
  methods: {
    // 拿到原生分享回调
    shareStatusReturn() {
      window.shareResult = status => {
        this.shareStatus = status;
        if (this.shareStatus == 1) {
          this.$router.push({
            path: "/reportSendSuccess"
          });
        }
      };
    },
    async initData() {
      let result = await api.getMaincustomer({
        id: this.familyId
      });
      if (result.status == 1) {
        if (result.data) {
          this.customerId = result.data.customerId;
          let customerObj = result.data;
          this.name = customerObj.customerAlias;
          this.phone = customerObj.phoneNumber;
          this.age = customerObj.age;
          this.gender = customerObj.gender;
          this.trusteeshipType = customerObj.trusteeshipType;
          if (result.data.trusteeshipType == 1) {
            this.isDisabled = true;
          } else {
            this.isDisabled = false;
          }
        }
      } else {
        this.$alert(result.msg);
        return false;
      }

      let res = await api.getByIdAgentCard();
      if (res.status == 1) {
        this.agentData = res.data;
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    async getQrcode() {
      let qrcode = await api.getQrcode({
        str: "bind_" + this.reportCode
      });
      if (qrcode.status == 1) {
        this.QRcode = "data:image/jpg;base64," + qrcode.data.base64;
        this.modalStatus = true;
      } else {
        this.$alert(qrcode.msg);
        return;
      }
    },
    // 发送报告
    async makeFamilyReport() {
      if (this.trusteeshipType == 1) {
        let result = await api.customerBindingSave({
          familyId: this.familyId,
          reportId: this.reportId,
          phoneNum: this.phone,
          custMainId: this.customerId,
          custId: this.customerId,
          custName: this.name,
          gender: this.gender
        });
        if (result.status == 1) {
          if (result.data == null) {
            this.$router.push({
              path: "/reportSendSuccess"
            });
          } else {
            this.reportCode = result.data.id;
          }
        } else {
          this.$alert(result.msg);
          return;
        }
      } else {
        let res = await api.getCantrusteeship({
          familyId: this.familyId,
          customerId: this.customerId,
          phoneNum: this.phone
        });
        if (res.status == 1) {
          if (res.data.id == 1) {
            this.$alert("该客户已建立托管关系，不能重复托管");
            return;
          }
        } else {
          this.$alert(res.msg);
          return;
        }

        let result = await api.customerBindingSave({
          familyId: this.familyId,
          reportId: this.reportId,
          phoneNum: this.phone,
          custMainId: this.customerId,
          custId: this.customerId,
          custName: this.name,
          gender: this.gender
        });
        if (result.status == 1) {
          if (result.data == null) {
            this.$router.push({
              path: "/reportSendSuccess"
            });
          } else {
            this.reportCode = result.data.id;
          }
        } else {
          this.$alert(result.msg);
          return;
        }
      }
      let elPhone = this.$refs.phoneNum;
      if (elPhone.valid) {
        this.getQrcode();
      } else {
        this.$toast(elPhone.firstError);
        return;
      }
    },
    getImgBase64(img) {
      this.imgBase64 = img;
    },
    // 分享图片
    getPdf(img) {
      if (!this.modalStatus) {
        this.$toast("请先发送报告再点击分享");
        return;
      }
      let obj = {
        type: 2,
        shareChannel: "12",
        pictureBase64: this.imgBase64
      };
      this.$share(obj);
    }
  }
};
</script>
<style lang="less">
.report-send-page {
  background: #fff;
  .dt-content {
    position: relative;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .report-img {
      background: #f8f8f8;
      text-align: center;
      padding: 25px 0;
      img {
        width: 692px;
        margin: 0 auto;
      }
    }
    .report-text {
      font-size: 26px;
      margin: 25px 30px 40px 48px;
      line-height: 1.5;
      color: #666666;
      .tit {
        font-size: 28px;
        font-weight: bold;
        color: #333333;
      }
      .text {
        color: #999;
        font-size: 25px;
        margin-top: 8px;
      }
      .step-content {
        overflow: hidden;
        padding-top: 45px;
      }
      .step {
        width: 280px;
        height: 178px;
        background-color: #f7fefb;
        border: 2px #35c782 solid;
        border-radius: 10px;
        padding: 23px 15px 10px 22px;
        color: #666;
        position: relative;
        font-size: 25px;
        float: left;
        span {
          width: 120px;
          height: 40px;
          text-align: center;
          background: #35c782;
          border-radius: 20px;
          display: block;
          position: absolute;
          left: 80px;
          top: -20px;
          color: #fff;
        }
      }
      .step01 {
        margin-right: 100px;
        .dt-icon {
          color: #35c782;
          position: absolute;
          top: 70px;
          right: -75px;
        }
      }
    }
    .report-customer {
      padding: 30px 25px;
      border-top: 1px #e8e8e8 solid;
      .title {
        font-size: 30px;
        font-weight: bold;
      }
      .customer-info {
        margin-top: 25px;
        overflow: hidden;
        .com-style {
          border: 2px #e8e8e8 solid;
          border-radius: 10px;
          height: 78px;
          line-height: 78px;
        }
        .name {
          width: 180px;
          padding-left: 10px;
          position: relative;
          .beneficiary_user {
            color: #28c76a;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 10px;
          }
          .text {
            margin-left: 50px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 110px;
            display: inline-block;
          }
          // .select {
          //   background: url("../../assets/imgs/report_add.png") no-repeat;
          //   background-size: cover;
          //   width: 39px;
          //   height: 39px;
          //   display: inline-block;
          //   position: absolute;
          //   right: 10px;
          //   top: 18px;
          // }
        }
        .fl {
          float: left;
        }
        .phone {
          width: 250px;
          text-align: center;
          margin-left: 25px;
          padding-left: 10px;
          .weui-cell {
            padding: 0;
          }
        }
        .make {
          margin-left: 25px;
          width: 220px;
          height: 78px;
          line-height: 78px;
          background: #28c76a;
          color: #fff;
          text-align: center;
          border-radius: 10px;
        }
      }
    }
  }
}
.vux-popup-dialog {
  background: #fff !important;
  .weui-cells {
    margin-top: 0;
  }
  .tit {
    font-size: 16px;
    color: #28c76a;
    padding: 10px 15px;
    margin-top: 5px;
  }
  .weui-cells:before {
    border-top: none;
  }
}
</style>
