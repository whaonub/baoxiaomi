<template>
  <div class="dt-pages new-strategy-page">
    <div class="dt-header">
      <dtHeader title="新手攻略" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="video-content" v-if="videoId">
        <div class="video-style" id="player"></div>
        <p class="advice">建议在Wi-Fi环境下观看</p>
      </div>
      <div class="main"></div>
    </div>
    <networkTips @change="changeVideo"></networkTips>
  </div>
</template>
<script>
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import networkTips from "@/components/networkTips";
import { getDevice, AppendJs } from "@/config/utils.js";
export default {
  components: {
    dtHeader,
    networkTips
  },
  data() {
    return {
      device: getDevice(),
      videoId: null,
      videoStatus: true
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  mounted() {
    this.playVideo();
  },
  watch: {},
  computed: {},
  methods: {
    async initData() {
      let videoResult = await api.getVideoId({
        str: "novice"
      });
      if (videoResult.status == 1) {
        if (videoResult.data) {
          this.videoId = videoResult.data.vid;
        }
      }
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
      if (window.dtPlayer) {
        window.dtPlayer.j2s_pauseVideo();
      }
    },
    playVideo() {
      if (window.polyvObject && this.videoId) {
        var dtPlayer = polyvObject("#player").videoPlayer({
          width: "100%",
          height: 184,
          forceH5: true,
          df: 3,
          vid: this.videoId
        });
        window.dtPlayer = dtPlayer;
      } else {
        AppendJs(this.playVideo);
      }
    },
    changeVideo() {
      this.videoStatus = false;
    }
  }
};
</script>
<style lang="less">
.new-strategy-page {
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .video-content {
      position: relative;
      margin: 20px 40px 0;
      .tips {
        color: #fff;
        font-size: 30px;
        font-weight: bold;
        position: absolute;
        left: 0;
        top: 6px;
        text-align: center;
        display: block;
        width: 100%;
        z-index: 9999;
      }
      .video-style {
        border-radius: 20px;
        width: 100%;
      }
      .advice {
        font-size: 24px;
        line-height: 44px;
        letter-spacing: 0px;
        color: #666666;
        opacity: 0.8;
        text-align: center;
      }
    }
    .main {
      margin: 10px auto 34px;
      width: 650px;
      height: 780px;
      background-color: #ffffff;
      box-shadow: 0px 10px 30px 0px rgba(40, 199, 106, 0.2);
      border-radius: 20px;
      border: solid 1px #ddfae9;
      background: url("../../assets/imgs/new-strategy.png") no-repeat;
      background-position: left top;
      background-size: 100%;
      font-size: 32px;
      line-height: 48px;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }
}
</style>
