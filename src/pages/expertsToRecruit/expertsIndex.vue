<template>
  <div class="dt-pages experts-index">
    <div class="dt-header">
      <dtHeader
        title="推荐好友成为大咖"
        @headerRight="shareBtn"
        rightIcon="share"
        :leftBack="false"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="top">
        <div @click="gotoRecommendedStrategy" class="recommended-strategy">推荐攻略</div>
      </div>
      <div class="solicitation-for"></div>
      <div class="honorary-privilege"></div>
      <div class="how-recommended"></div>
      <div class="footer">
        <button @click="shareBtn">我要推荐</button>
        <button @click="iWantToCover">我要自荐</button>
      </div>
      <div class="cover-dialog" v-transfer-dom>
        <x-dialog v-model="showCover">
          <div class="cover-container">
            <div class="header">
              <div @click="showCover = false,enterBtn()" class="arrow-box">
                <icon class="dt-icon arrow-left" name="arrow-left"></icon>
              </div>
              <span>信息填写</span>
            </div>
            <div class="info">
              <div class="info-item">
                <span>
                  <span style="margin-right: 1em">姓</span>名：
                </span>
                <group>
                  <x-input
                    title
                    placeholder="请输入姓名"
                    :min="2"
                    :max="15"
                    ref="fullName"
                    v-model.trim="formData.fullName"
                  ></x-input>
                </group>
              </div>
              <div class="info-item">
                <span>
                  <span style="margin-right: 1em">性</span>别：
                </span>
                <group>
                  <!-- <icon class="dt-icon arrowsDown" name="arrowsDown"></icon> -->
                  <selector
                    class="header"
                    :options="options"
                    placeholder="请选择性别"
                    title
                    v-model="formData.gender"
                  ></selector>
                </group>
              </div>
              <div class="info-item">
                <span>手机号：</span>
                <group>
                  <x-input
                    title
                    placeholder="请输入手机号"
                    type="tel"
                    :max="11"
                    ref="phoneNumber"
                    v-model.trim="formData.phoneNumber"
                    is-type="china-mobile"
                  ></x-input>
                </group>
              </div>
              <div class="info-item">
                <span>微信号：</span>
                <group>
                  <x-input
                    :min="6"
                    :max="20"
                    :is-type="validateVal"
                    ref="wxNumber"
                    title
                    placeholder="请输入微信号"
                    v-model.trim="formData.wxNumber"
                  ></x-input>
                </group>
              </div>
              <div class="info-item">
                <span>擅长的领域：</span>
                <group>
                  <x-textarea :max="100" placeholder="例如：保险/理财/法商" v-model.trim="formData.goodAt"></x-textarea>
                </group>
              </div>
              <div class="info-item">
                <span style="margin-right: 1em">个人简介：</span>
                <group>
                  <x-textarea
                    :max="500"
                    placeholder="例如：个人公众号、知乎专栏、头条号等"
                    v-model.trim="formData.note"
                  ></x-textarea>
                </group>
              </div>
            </div>
            <div class="btn-box">
              <button @click="submit" :class="{'disabled-btn':btnStatus}" class="submit-btn">提交</button>
            </div>
            <div
              class="annotation"
            >注：提交成功后，保小秘相关工作人员会添加您的微信或电话与您沟通，审核您的大咖资质，您也可以主动添加工作人员微信：baoxiaomi123进行沟通。</div>
          </div>
        </x-dialog>
      </div>
      <div class="cate-dialog" v-transfer-dom>
        <x-dialog v-model="dialogSuccess">
          <div class="cate-box">
            <img src="../../assets/imgs/cate-success.png" alt>
            <h4>恭喜您，报名成功！</h4>
            <p>
              我们将在2个工作日内与您联系，您也可以主动添加微信:
              <font
                @click="copyWechatId"
                color="#fea767"
                ref="copy"
              >baoxiaomi123</font>就入驻保小秘成为大咖相关事宜进行沟通。
            </p>
            <button @click="enterBtn">确定</button>
          </div>
        </x-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { XDialog, TransferDom, XInput, Group, XTextarea, Selector } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils.js";
import { wechatService } from "@/config/env";
export default {
  components: {
    dtHeader,
    XDialog,
    XInput,
    Group,
    XTextarea,
    Selector
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      device: getDevice(),
      showCover: false,
      dialogSuccess: false,
      options: [
        {
          key: "1",
          value: "男"
        },
        {
          key: "2",
          value: "女"
        }
      ],
      formData: {
        fullName: "",
        gender: "",
        goodAt: "",
        note: "",
        phoneNumber: "",
        wxNumber: ""
      },
      shareId: "",
      validateVal: val => {
        let reg = /(^[a-zA-Z][a-zA-Z0-9_-]{5,19}$)|(^((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$)/;
        return {
          valid: reg.test(val),
          msg: "微信号码格式不对哦~"
        };
      },
      copyBtn: null
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
  mounted() {},
  watch: {},
  computed: {
    btnStatus() {
      let formData = this.formData;
      if (
        !formData.fullName ||
        !formData.gender ||
        !formData.phoneNumber ||
        !formData.wxNumber
      ) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    initData() {},
    // 我要自荐
    iWantToCover() {
      this.showCover = true;
    },
    // 自荐个人提交信息
    async submit() {
      if (!this.btnStatus) {
        this.$toast("请填写相关信息");
        return;
      }
      let elFullName = this.$refs.fullName;
      let elPhoneNumber = this.$refs.phoneNumber;
      let elWxNumber = this.$refs.wxNumber;
      if (!elFullName.valid) {
        this.$toast(elFullName.firstError);
        return;
      }
      if (!elPhoneNumber.valid) {
        this.$toast(elPhoneNumber.firstError);
        return;
      }
      if (!elWxNumber.valid) {
        this.$toast(elWxNumber.firstError);
        return;
      }
      let res = await api.selfRecommend(this.formData);
      if (res.status == 1) {
        this.showCover = false;
        this.dialogSuccess = true;
        this.$nextTick(() => {
          this.instantiation();
        });
      } else {
        this.showCover = false;
        let that = this;
        this.$alert({
          content: res.msg,
          onHide() {
            that.enterBtn();
          }
        });
        return;
      }
    },
    // 分享
    async shareBtn() {
      let res = await api.createCode();
      if (res.status == 1) {
        this.shareId = res.data.id;
      } else {
        this.$alert(res.msg);
        return;
      }

      let obj = {
        type: 3,
        shareChannel: "12",
        title: "我推荐你入驻保小秘成为大咖，多重奖励领不停，快来看看～", //标题
        content:
          "如果您是保险、理财、律师、法商等领域大咖，快来入驻保小秘，入驻可享多重好礼，更有丰厚佣金在等你哦！", //内容，副标题
        clickUrl: wechatService + "/expertsToRecruit?id=" + this.shareId, //链接
        pictureBase64:
          "iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAADeGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjIyMDg4NGVkLWUyODYtNDFhYS1iMGNmLTIxNDBmNWJmYWVkZCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowODMzNkRCN0QwNUQxMUU4QjhFMUUyNEQ5RUFFMjE0MSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowODMzNkRCNkQwNUQxMUU4QjhFMUUyNEQ5RUFFMjE0MSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmQzMTMxZTUxLWM2ODktNGMwMy1iNTI5LTZlYzlhMDBmZTA5MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjA4ODRlZC1lMjg2LTQxYWEtYjBjZi0yMTQwZjViZmFlZGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94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",
        pictureUrl: location.origin + "/static/img/higher-ups.png"
      };
      this.$share(obj);
    },
    // 实例化复制组件
    instantiation() {
      this.copyBtn = new this.clipboard(this.$refs.copy, {
        text: trigger => {
          return "baoxiaomi123";
        }
      });
    },
    // 一键复制微信号
    copyWechatId() {
      let _this = this;
      let clipboard = _this.copyBtn;
      clipboard.on("success", function() {
        _this.$toast("微信号已成功复制到剪切板");
      });
      clipboard.on("error", function() {
        _this.$toast("复制失败，请手动选择复制！");
      });
    },
    // 跳转推荐攻略
    gotoRecommendedStrategy() {
      this.$router.push({
        path: "/recommendedStrategy"
      });
    },
    // 确定后清空
    enterBtn() {
      this.dialogSuccess = false;
      this.formData.fullName = "";
      this.formData.gender = "";
      this.formData.goodAt = "";
      this.formData.note = "";
      this.formData.phoneNumber = "";
      this.formData.wxNumber = "";
    },
    // 返回
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
.cover-dialog {
  .weui-dialog {
    width: 0.8rem;
    max-width: none !important;
    height: 1.3066666666666666rem;
    background-color: #ffffff;
    border-radius: 0.02666666666666667rem;
    display: block;
    .weui-cells {
      margin-top: 0;
      position: relative;
      .arrowsDown {
        position: absolute;
        right: 0.016rem;
        top: 50%;
        transform: translateY(-50%);
        height: 16px;
        color: #999;
      }
      &::before {
        display: none;
      }
      &::after {
        display: none;
      }
    }
    .cover-container {
      width: 100%;
      height: 100%;
      .header {
        height: 0.10666666666666667rem;
        font-size: 0.048rem;
        font-weight: bold;
        line-height: 0.10666666666666667rem;
        letter-spacing: 0.0013333333333333333rem;
        color: #fea767;
        text-align: center;
        position: relative;
        .arrow-box {
          width: 0.1rem;
          height: 0.10666666666666667rem;
          position: absolute;
          top: 0;
          left: 0;
          .arrow-left {
            position: absolute;
            top: 0.03rem;
            left: 0.024rem;
            color: #999;
            height: 0.037333333333333336rem;
          }
        }
      }
      .info {
        input::-webkit-input-placeholder {
          font-size: 0.037333333333333336rem;
        }
        textarea::-webkit-input-placeholder {
          font-size: 0.037333333333333336rem;
        }
        .info-item {
          margin-top: 0.013333333333333334rem;
          font-size: 0.04rem;
          line-height: 0.05333333333333334rem;
          letter-spacing: 0rem;
          color: #333333;
          display: flex;
          align-items: center;
          justify-content: center;
          .vux-x-input,
          .vux-selector {
            width: 0.56rem;
            height: 0.10666666666666667rem;
            border-radius: 0.013333333333333334rem;
            border: solid 1px #e8e8e8;
            font-size: 0.037333333333333336rem;
          }
          .vux-x-textarea {
            width: 0.48rem;
            height: 0.16rem;
            padding: 0;
            .weui-cell__bd {
              width: 100%;
              height: 100%;
              textarea {
                width: 100%;
                height: 100%;
                padding: 0.016rem;
                border-radius: 0.013333333333333334rem;
                border: solid 1px #e8e8e8;
                font-size: 0.037333333333333336rem;
              }
            }
          }
        }
      }
      .btn-box {
        width: 100%;
        height: 0.10666666666666667rem;
        margin: 0.05333333333333334rem auto;
        .submit-btn {
          display: block;
          width: 0.6666666666666666rem;
          height: 0.10666666666666667rem;
          background-color: #ddd;
          border-radius: 0.05333333333333334rem;
          font-size: 0.048rem;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0.0013333333333333333rem;
          color: #ffffff;
          margin: 0 auto;
          &:active {
            opacity: 0.65;
          }
        }
        .disabled-btn {
          background-color: #fea767;
        }
      }
      .annotation {
        width: 0.688rem;
        font-size: 0.029333333333333333rem;
        line-height: 0.04rem;
        color: #999999;
        margin: 0 auto;
        text-align: left;
      }
    }
  }
}
.cate-dialog {
  .weui-dialog {
    width: 0.72rem;
    height: 0.552rem;
    display: block;
    background-color: #ffffff;
    border-radius: 0.013333333333333334rem;
    .cate-box {
      width: 100%;
      height: 100%;
      padding: 0.04rem 0.04933333333333333rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 0.152rem;
        height: 0.136rem;
      }
      h4 {
        font-size: 0.048rem;
        font-weight: normal;
        letter-spacing: 0.0013333333333333333rem;
        color: #333333;
      }
      p {
        font-size: 0.029333333333333333rem;
        letter-spacing: 0.0013333333333333333rem;
        color: #999999;
        text-align: left;
        line-height: 1.4;
        margin: 0.02666666666666667rem 0 0.01666666666666667rem;
      }
      button {
        width: 0.6rem;
        height: 0.09333333333333334rem;
        background-color: #fea767;
        border-radius: 0.04666666666666667rem;
        font-size: 0.042666666666666665rem;
        letter-spacing: 0.0013333333333333333rem;
        color: #ffffff;
        &:active {
          opacity: 0.65;
        }
      }
    }
  }
}
.experts-index {
  background-color: #fea767;
  .dt-header {
    background: none;
    .headerTop {
      background: none;
    }
  }
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 174px;
    .top {
      height: 980px;
      background: url("../../assets/imgs/experts-top-bg.png") no-repeat left
        bottom;
      background-size: 100%;
      position: relative;
      .recommended-strategy {
        width: 70px;
        height: 80px;
        background-color: #fed101;
        box-shadow: 0px 4px 4px 0px rgba(160, 107, 102, 0.2);
        border-radius: 10px 0px 0px 10px;
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 1px;
        color: #f95c4c;
        position: absolute;
        right: 0;
        top: 340px;
        display: flex;
        align-items: center;
        text-align: center;
      }
    }
    .solicitation-for {
      width: 680px;
      height: 740px;
      // background-color: #f95c4c;
      background: url("../../assets/imgs/solicitation-for.png") no-repeat left
        bottom;
      background-size: 100%;
      border-radius: 20px;
      margin: 40px auto;
    }
    .honorary-privilege {
      width: 680px;
      height: 1040px;
      // background-color: #ffffff;
      background: url("../../assets/imgs/honorary-privilege.png") no-repeat left
        bottom;
      background-size: 100%;
      border-radius: 20px;
      margin: 0 auto;
    }
    .how-recommended {
      width: 680px;
      height: 510px;
      // background-color: #f95c4c;
      background: url("../../assets/imgs/how-recommended.png") no-repeat left
        bottom;
      background-size: 100%;
      border-radius: 20px;
      margin: 40px auto 20px;
    }
    .footer {
      width: 100%;
      height: 174px;
      background-color: #fea767;
      // background-color: red;
      position: fixed;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      button {
        width: 300px;
        height: 90px;
        background-image: linear-gradient(0deg, #fed40e 0%, #feee68 100%);
        box-shadow: 0px 10px 10px 0px rgba(186, 44, 30, 0.1);
        border-radius: 45px;
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 1px;
        color: #f95c4c;
        &:first-of-type {
          margin-right: 40px;
        }
        &:active {
          opacity: 0.65;
        }
      }
    }
  }
}
</style>
