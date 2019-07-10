<template>
  <div class="dt-pages invitations-page">
    <div class="dt-header">
      <dtHeader title="推荐保险管家" rightIcon="share" :leftIcon="true" :leftBack="false" @headerLeft="goBack" @headerRight="handleAction"></dtHeader>
    </div>
    <div class="dt-content">
      <div class="housekeeper">
        <div class="title">
          愿做您的专属保险管家给你带来不一样的保险服务体验
        </div>
        <div class="photo">
          <img :src="agentData.imgUrl" alt="">
        </div>
        <div class="name">
          {{agentData.agentName}}
        </div>
      </div>
      <!-- 有客户 -->
      <div class="count" v-if="agentData.custNum != 0 || agentData.familyNum != 0">
        <div>
          累计托管<span>{{agentData.familyNum}}</span>位客户
        </div>
        <div>
          累计服务<span>{{agentData.familyNum}}</span>个家庭
        </div>
      </div>
      <!-- 没有客户 -->
      <div class="countZ" v-else>
        <img src="../../assets/imgs/invitation-006.png" alt="">
      </div>
      <!-- c端评价 -->
      <div v-if="false" style="height:40px;">
        此次评价：
        <span style="margin:0 20px;">
          <icon name="stars" class="dt-icon stars" v-for="item in 5" :key="item"></icon>
        </span>
        比较满意
      </div>
      <div class="details">
        <div class="title">
          <div class="top-cricle">
            <span v-for="(item,index) in 5" :key="index"></span>
          </div>
          <div class="title-content">
            <div>
              愿做您的专属保险管家
            </div>
            <div>
              给你带来不一样的保险服务体验
            </div>
          </div>
          <div class="bottom-cricle">
            <span v-for="(item,index) in 5" :key="index"></span>
          </div>
        </div>
        <div class="defect">
          <div class="circle">
            <span v-for="(item,index) in defectLists.length*2-1" :key="index"></span>
          </div>
          <div class="defect-content">
            <div class="defect-title">
              您的保险真的“保险”吗？
            </div>
            <div class="defectLists">
              <div v-for="(item,index) in defectLists" :key="index">
                <span>{{index+1}}</span>{{item}}
              </div>
            </div>
          </div>
          <div class="circle">
            <span v-for="(item,index) in defectLists.length*2-1" :key="index"></span>
          </div>
        </div>
        <div class="virtue">
          <div class="circle">
            <span v-for="(item,index) in defectLists.length*2-1" :key="index"></span>
          </div>
          <div class="virtue-content">
            <div class="virtue-title">
              保单托管，让您的保险更加放心
            </div>
            <div class="virtueLists">
              <div v-for="(item,index) in virtueLists" :key="index">
                <span>{{index+1}}</span>{{item}}
              </div>
            </div>
          </div>
          <div class="circle">
            <span v-for="(item,index) in virtueLists.length*2-1" :key="index"></span>
          </div>
        </div>
        <div class="btn" @click="handleAction">
          立即邀请
        </div>
        <div class="more">
          拒绝稀里糊涂的保险，保单托管了解一下~
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dtHeader from "@/components/dtHeader";
import { wechatService } from "@/config/env";
import api from "@/api/index";
import { getDevice } from "@/config/utils.js";
export default {
  name: "invitations",
  components: {
    dtHeader
  },
  data() {
    return {
      device: getDevice(),
      defectLists: [
        "纸质保存容易丢失",
        "到期容易忘记交费",
        "条款复杂堪比天书",
        "保单越多越难管理",
        "保障不清无人服务"
      ],
      virtueLists: [
        "电子保单整理 一目了然",
        "防止保单失效 贴心提醒",
        "家庭多张保单 统一管理",
        "绑定专属管家 省心省力"
      ],
      id: "",
      agentData: {}
    };
  },
  created() {
    window.shareResult = function() {};
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  methods: {
    async initData() {
      let result = await api.beforeAppointA();
      if (result.status == 1) {
        this.agentData = result.data;
      } else {
        let _self = this;
        this.$alert({
          content: result.msg,
          onHide() {
            _self.goBack();
          }
        });
        return;
      }
    },
    handleAction() {
      let obj = {
        type: 3,
        title: "不整理不知道，原来我们家的保险有这么多的保障，速来围观~", //标题
        content:
          this.agentData.agentName + "邀请你来做保单托管，让你的保障更清晰", //内容，副标题
        clickUrl: wechatService + "/invite?id=" + this.agentData.appointId, //链接
        pictureBase64:
          "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",
        pictureUrl: location.origin + "/static/img/baozhang.png"
      };
      this.$share(obj);
    },
    goBack() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.goHomePage();
      } else if (device == "ios" || device == "iPhoneX") {
        let isPc = this.$store.state.isPc;
        if (!isPc) {
          window.webkit.messageHandlers.goHomePage.postMessage(null);
        } else {
          this.$router.go(-1);
        }
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="less">
// 注意：在rootValue = 750px的设计稿中
// 现在 title cell 的高度为125
// 普通cell的高度为100
@dt-bbbbbb: #bbbbbb;
@dt-f9545: #f95454;
@dt-ffffff: #ffffff;
@dt-iconcolor: #dedede;

.invitations-page {
  background: #ffffff;
  text-align: center;
  .dt-content {
    margin-top: -1px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .housekeeper {
      height: 526px;
      background: url("../../assets/imgs/invitations-001.png") no-repeat;
      background-size: 100%;
      position: relative;
      .title {
        font-size: 26px;
        color: #fe7551;
        line-height: 80px;
      }
      .photo {
        width: 240px;
        height: 240px;
        border-radius: 120px;
        overflow: hidden;
        margin: 0 auto;
        margin-top: 94px;
        img {
          width: 100%;
        }
      }
      .name {
        width: 300px;
        height: 90px;
        background: #ffffff;
        border-radius: 45px;
        box-shadow: 0px 3px 10px #fef2e7;
        font-size: 40px;
        line-height: 90px;
        letter-spacing: 4px;
        font-weight: 900;
        color: #fa8728;
        position: absolute;
        left: 50%;
        margin-left: -150px;
        bottom: 30px;
      }
    }
    .count {
      height: 230px;
      background: url("../../assets/imgs/invitations-002.png") no-repeat;
      background-size: 690px;
      background-position: top center;
      font-size: 30px;
      font-weight: 900;
      div {
        width: 600px;
        margin: 0 auto;
        height: 90px;
        line-height: 90px;
        border-bottom: 2px solid #fed59f;
      }
      span {
        color: #f45c19;
        margin: 0 10px;
      }
    }
    .countZ {
      width: 100%;
      padding: 20px;
      img {
        width: 100%;
      }
    }

    .details {
      background: url("../../assets/imgs/invitations-003.png") no-repeat;
      background-size: 100%;
      padding: 40px 20px;
      .title {
        .top-cricle {
          text-align: right;
          height: 30px;
          line-height: 20px;
          span {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background: #feb452;
            margin-right: 18px;
          }
        }
        .title-content {
          height: 180px;
          background: #ffb547;
          border-radius: 30px;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 26px 34px;
          box-shadow: 5px -5px 5px #f99a2e inset;
          div:nth-child(1) {
            font-size: 32px;
            color: #ffffff;
          }
          div:nth-child(2) {
            font-size: 44px;
            color: #ffffff;
            font-weight: 900;
          }
        }
        .bottom-cricle {
          text-align: left;
          height: 30px;
          line-height: 20px;
          span {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background: #feb452;
            margin-right: 18px;
          }
        }
      }
      .defect {
        padding: 20px 10px;
        background: #fef1e5;
        border-radius: 30px;
        margin-top: 60px;
        position: relative;
        display: flex;
        justify-content: space-around;
        .circle {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          span {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background: #fea676;
          }
        }
        .defect-content {
          width: 80%;
          margin-top: 32px;
          .defect-title {
            width: 470px;
            position: absolute;
            height: 90px;
            line-height: 90px;
            color: #fff;
            font-weight: 900;
            font-size: 36px;
            font-style: italic;
            text-align: center;
            top: -45px;
            left: 50%;
            transform: translateX(-50%);
            background: url("../../assets/imgs/invitations-004.png") no-repeat;
            background-size: 100% 100%;
          }
          .defectLists {
            div {
              background: #fee3c1;
              height: 70px;
              border-radius: 35px;
              margin: 20px auto;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              font-weight: 900;
              padding-left: 120px;
              span {
                width: 40px;
                height: 40px;
                border-radius: 20px;
                background: #f6b44d;
                color: #fff;
                margin-right: 30px;
                line-height: 40px;
              }
            }
          }
        }
      }
      .virtue {
        padding: 20px 10px;
        background: #fef1e5;
        border-radius: 30px;
        margin-top: 100px;
        position: relative;
        display: flex;
        justify-content: space-around;
        .circle {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          span {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background: #fea676;
          }
        }
        .virtue-content {
          width: 80%;
          margin-top: 32px;
          .virtue-title {
            width: 100%;
            position: absolute;
            height: 90px;
            line-height: 90px;
            color: #fff;
            font-weight: 900;
            font-size: 40px;
            font-style: italic;
            top: -60px;
            left: 0;
            background: url("../../assets/imgs/invitations-005.png") no-repeat;
            background-size: 100% 100%;
          }
          .virtueLists {
            div {
              background: #fee3c1;
              height: 70px;
              border-radius: 35px;
              margin: 20px auto;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              font-weight: 900;
              padding-left: 120px;
              span {
                width: 40px;
                height: 40px;
                border-radius: 20px;
                background: #f6b44d;
                color: #fff;
                margin-right: 30px;
                line-height: 40px;
              }
            }
          }
        }
      }
      .btn {
        height: 80px;
        background: #fff;
        line-height: 80px;
        border-radius: 40px;
        margin-top: 60px;
        color: #f99a2e;
        font-size: 32px;
        letter-spacing: 6px;
      }
      .more {
        color: #feead3;
        margin-top: 30px;
        font-size: 28px;
        letter-spacing: 2px;
      }
    }
  }
}
</style>


