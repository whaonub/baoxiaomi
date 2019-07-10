<template>
  <div class="invitingPoster">
    <div class="content">
      <div class="cancel-box" @click="hidePoster">
        <icon name="cancel" class="dt-icon cancel"></icon>
      </div>
      <div id="imagesDom" class="backgroundImg">
        <div class="header">
          <p>智能扫描保单，5秒快速录入</p>
          <p>风险评估报告，保障缺口一目了然</p>
          <p>智能测需黑科技，挖掘客户潜在需求</p>
          <p>专业名片分享，打造专业形象</p>
          <p>名师大咖入驻，随时随地想学就学</p>
        </div>
        <div class="main">
          <p>一对一绑定托管关系，你的客户别人不能碰，做他的专属管家!</p>
        </div>
        <img :src="QRcode" alt="">
        <div class="footer">
          <p>长按识别二维码，更多奖品等你拿</p>
        </div>
        <!-- <img src="../../assets/imgs/bd-share-bg.png" alt=""> -->
      </div>
      <div class="btnGroup">
        <div @click="friends" class="menu">
          <img src="../../assets/imgs/friends.png" alt="">
          <div>朋友圈</div>
        </div>
        <div @click="wechatFriends" class="menu">
          <img src="../../assets/imgs/wechat.png" alt="">
          <div>微信好友</div>
        </div>
        <div @click="savePic" class="menu">
          <img src="../../assets/imgs/keep.png" alt="">
          <div>保存图片</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import html2Canvas from "html2canvas";

export default {
  name: "invitingPoster",
  props: {
    QRcode: {
      type: String,
      default: ""
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
      });
    },
    hidePoster() {
      this.$emit("hideP");
    },
    savePic() {
      this.$emit("savePic", this.img);
    },
    friends() {
      this.$emit("friends", this.img);
    },
    wechatFriends() {
      this.$emit("wechatFriends", this.img);
    }
  }
};
</script>
<style lang="less" scoped>
.invitingPoster {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  .content {
    width: 70%;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);

    .backgroundImg {
      // margin-top: 200px;
      width: 100%;
      height: 930px;
      border-radius: 20px;
      background: url("../../assets/imgs/bd-share-bg.png") no-repeat;
      background-size: 100%;
      position: relative;
      .header {
        position: absolute;
        left: 50%;
        top: 336px;
        transform: translateX(-50%);
        font-size: 22px;
        width: 80%;
        overflow: hidden;
        line-height: 42px;
        letter-spacing: 1px;
        color: #ffffff;
      }
      .main {
        width: 80%;
        font-size: 22px;
        font-weight: bold;
        line-height: 30px;
        letter-spacing: 0px;
        color: #ffffff;
        position: absolute;
        left: 50%;
        top: 600px;
        transform: translateX(-50%);
      }
      .footer {
        width: 100%;
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 0px;
        color: #000000;
        position: absolute;
        bottom: 25px;
        text-align: center;
      }

      img {
        width: 134px;
        height: 134px;
        position: absolute;
        bottom: 64px;
        left: 50%;
        transform: translateX(-50%);
        // background-color: #fff;
        // padding: 6px;
      }
    }
    .cancel-box {
      overflow: hidden;
      .cancel {
        width: 60px;
        height: 60px;
        float: right;
        width: 60px;
        height: 60px;
      }
    }

    .btnGroup {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
      padding-top: 20px;
      width: 100%;
      .menu {
        width: 33.33%;
        height: 160px;
        font-size: 28px;
        color: #fff;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 80px;
          height: 80px;
        }
      }
    }
  }
}
</style>
