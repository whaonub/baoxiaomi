<template>
  <div class="invitingPoster">
    <div class="shareTotal">
      <div class="sharePopup">
        <div class="title">客户查看报告后参与评价与分享，即可获得价值200元豪礼。保单托管帮您获客，别忘记提醒用户完成评价哟~</div>
        <div class="share-content" @click="getPdf" id="imagesDom">
          <div class="name w520">
            尊敬的{{name}}
            <b>{{gender == 1?'先生':'女士'}}</b>:
          </div>
          <div class="text w520">
            专属保险管家
            <font color="#2937fe">{{agentData.cardName}}</font>已根据您的已有保障献上一份强大家庭保障分析报告，请扫描下方的二维码接收。
          </div>
          <div class="share-text" v-if="age < 40">
            <p>
              <i>_</i>这份报告
            </p>
            <p>
              <i>_</i>没有华丽的包装，
            </p>
            <p>
              <i>_</i>没有精美的图片，
            </p>
            <p>
              <i>_</i>没有扣人心弦的语言，
            </p>
            <p>
              <i>_</i>但是注重内涵的你
            </p>
            <p>
              <i>_</i>终究会恋上我的态度
            </p>
            <p>
              <i>_</i>只因
            </p>
            <p class="tit"></p>
          </div>
          <div class="share-text2" v-if="age >= 40">
            <p>纸质保单损坏遗失，找不到！怎么办？</p>
            <p>保险条款复杂难懂，不理解！去问谁？</p>
            <p>保单忘缴费失效了，不能赔！咋避免？</p>
            <p>保险有疑问要咨询，无人管！谁服务？</p>
          </div>
          <div class="share-title">专属家庭保险管家做您的守护侠！</div>
          <div class="share-user">
            <div class="user-content">
              <p class="pimg">
                <img :src="QRcode">
              </p>
              <p class="name">
                保险管家:
                <span>{{agentData.cardName}}</span>
              </p>
              <p class="phone">
                电话:
                <b>{{agentData.phoneNumber}}</b>
              </p>
            </div>
            <p class="discern">识别二维码，查看报告</p>
          </div>
        </div>
        <div class="share-bottom">点击图片,转发至客户</div>
      </div>
    </div>
  </div>
</template>
<script>
import html2Canvas from "html2canvas";

export default {
  name: "invitingPoster",
  props: {
    age: {
      default: ""
    },
    gender: {
      default: ""
    },
    QRcode: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    agentData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      img: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initImg();
    });
  },
  methods: {
    initImg() {
      let that = this;
      html2Canvas(document.querySelector("#imagesDom"), {
        allowTaint: true,
        background: undefined
      }).then(function(canvas) {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageData = canvas.toDataURL("image/png", 1.0);
        pageData = pageData.split("base64,")[1];
        that.img = pageData;
        that.getImgBase64();
      });
    },
    hidePoster() {
      this.$emit("hideP");
    },
    getImgBase64() {
      this.$emit("getImgBase64", this.img);
    },
    getPdf() {
      this.$emit("getPdf", this.img);
    }
  }
};
</script>
<style lang="less" scoped>
.invitingPoster {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;

  .shareTotal {
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .sharePopup {
      overflow: hidden;
      .title {
        font-size: 26px;
        color: #fff;
        width: 600px;
        margin: 20px auto;
      }
      .share-content {
        background-image: url("../../assets/imgs/report-share-bg.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: left bottom;
        width: 600px;
        // height: 980px;
        border-radius: 20px;
        margin: 0 auto;
        color: #fff;
        padding-top: 20px;
        .share-text {
          background-image: url("../../assets/imgs/report-share-textbg2.png");
          background-size: cover;
          background-repeat: no-repeat;
          width: 524px;
          height: 318px;
          margin: 24px auto 0;
          padding: 20px 0 0 40px;
          font-size: 22px;
          p {
            line-height: 1.6;
            i {
              color: #99c4fe;
              margin-right: 10px;
              position: relative;
              bottom: 5px;
            }
          }
          .tit {
            margin-left: 20px;
            position: relative;
            background-image: url("../../assets/imgs/report-share-text2.png");
            background-size: cover;
            background-repeat: no-repeat;
            width: 398px;
            height: 32px;
            margin-top: 5px;
          }
        }
        .w520 {
          width: 530px;
          margin: 0 auto;
        }
        .text {
          font-size: 22px;
        }
        .name {
          font-size: 38px;
          b {
            font-size: 44px;
            font-style: normal;
          }
        }
        .share-text2 {
          background-image: url("../../assets/imgs/report-share-text2bg.png");
          background-size: cover;
          background-repeat: no-repeat;
          width: 550px;
          height: 339px;
          margin: 10px auto 0;
          padding: 150px 0 0 55px;
          font-size: 26px;
          p {
            line-height: 1.65;
          }
        }
        .share-user {
          border-radius: 0 0 20px 20px;
          // background-image: url("../../assets/imgs/report-share-userbg.png");
          // background-size: cover;
          // background-repeat: no-repeat;
          background: url("../../assets/imgs/report-share-userbg.png") no-repeat
            center bottom;
          background-size: contain;
          height: 400px;
          overflow: hidden;
          position: relative;
          .user-content {
            margin: 50px auto 0;
            font-size: 20px;
            width: 190px;
            p {
              img {
                width: 120px;
                height: 120px;
                margin: 0 auto;
                padding-left: 6px;
              }
            }
            .pimg {
              margin: 0 auto;
              padding-top: 16px;
              text-align: center;
            }
            .name {
              text-align: center;
              width: 194px;
              margin: 0 auto;
              font-size: 20px;
              margin-top: 30px;
            }
            .phone {
              text-align: center;
              width: 194px;
              margin: 0 auto;
              font-size: 20px;
              b {
                font-size: 18px;
                font-style: normal;
              }
            }
          }
          .discern {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 16px;
          }
        }
        .share-title {
          text-align: center;
          font-size: 22px;
          margin: 20px auto;
        }
      }
      .share-bottom {
        text-align: center;
        color: #fff;
        font-size: 24px;
        margin-top: 15px;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
