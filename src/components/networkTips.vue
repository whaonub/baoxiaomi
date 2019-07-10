<template>
  <div></div>
</template>
<script>
import { getDevice } from "@/config/utils.js";
export default {
  data() {
    return {
      device: getDevice(),
      playStatus: false,
      networkType: false
    };
  },
  props: {},
  watch: {},
  created() {
    let $this = this;
    let device = this.device;
    if (device == "android") {
      let networkType = bmAndroid.getNetworkType();
      if (networkType == 0) {
        this.networkType = true;
      } else {
        this.networkType = false;
      }
    } else if (device == "ios" || device == "iPhoneX") {
      window.webkit.messageHandlers.getNetworkType.postMessage(null);
    }
    window.getNetworkType = function(type) {
      if (type == 0) {
        $this.networkType = true;
      } else {
        $this.networkType = false;
      }
    };
  },
  mounted() {
    let $this = this;
    window.s2j_onVideoPlay = function() {
      $this.$emit("change");
      if ($this.networkType && !$this.playStatus) {
        window.dtPlayer.j2s_stopVideo();
        $this.$confirm({
          title: "",
          content: "您正在使用非WiFi网络，播放将会产生流量费用",
          confirmText: "仍要播放",
          cancelText: "取消播放",
          onConfirm() {
            window.dtPlayer.j2s_resumeVideo();
            $this.$confirm.hide();
          },
          onCancel() {
            window.dtPlayer.j2s_pauseVideo();
            $this.$confirm.hide();
          }
        });
        $this.playStatus = true;
      }
    };
  },
  destroyed() {
    if (window.dtPlayer) {
      window.dtPlayer.j2s_stopVideo();
    }
  },
  methods: {}
};
</script>
<style  lang="less">
</style>