<template>
  <div id="app" class='dt-app fz28' :class="{ios:$store.state.device=='ios',iPhoneX:$store.state.device=='iPhoneX'}">
    <transition :name="popStack">
      <keep-alive :include="$store.state.cacheArr">
        <router-view v-if="isRouterAlive"></router-view>
      </keep-alive>
    </transition>
    <loading v-if="$store.state.isLoading"></loading>
    <div class="app-mask" :class="displayStauts"></div>
  </div>
</template>

<script>
import { Loading } from "vux";
import { getDevice, getQueryString } from "@/config/utils";

export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  },
  components: {
    Loading
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  created() {
    // 首次进入这个页面的时候需要将数据存放到 store 中
    let token = getQueryString("token");
    let refreshToken = getQueryString("refreshToken");
    let agentId = getQueryString("agentId");
    let isPc = getQueryString("isPc");
    if (token) {
      this.$store.commit("setToken", {
        accessToken: token,
        refreshToken: refreshToken
      });
    }
    if (agentId) {
      this.$store.state.agentId = agentId;
    }
    if (isPc) {
      this.$store.state.isPc = true;
    }
  },
  mounted() {
    window.touchJS = function() {
      return "1";
    };
  },
  computed: {
    popStack() {
      if (this.$route.name === "trusteeship") {
        return "";
      }
      if (this.$store.state.direction === "forward") {
        if (this.$route.name === "home") {
          return "vux-pop-in";
        } else {
          return "vux-pop-in";
        }
      } else {
        return "vux-pop-out";
      }
      // return 'vux-pop-' + (this.$store.state.direction === 'forward' ? 'in' : 'out')
    },
    displayStauts() {
      return this.$store.state.maskView === "block" ? "show-mask" : "hide-mask";
    }
  }
};
</script>

<style lang="less">
@import "styles/reset";
@import "styles/main";
@import "~vux/src/styles/1px.less";
@import "~vux/src/styles/close.less";
@import "styles/add.css";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  /*position: relative;*/
  .app-mask {
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: none;
    &.show-mask {
      display: block;
    }
    &.hide-mask {
      display: none;
    }
  }
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 0.3s;
    height: 100%;
    top: 0;
    position: absolute;
    width: 100%;
    backface-visibility: hidden;
    perspective: 1000;
  }

  .vux-pop-out-enter {
    opacity: 0.7;
    transform: translate3d(-100%, 0, 0);
  }

  .vux-pop-out-leave-active {
    opacity: 0.7;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-enter {
    opacity: 0.7;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-leave-active {
    opacity: 0.7;
    transform: translate3d(-100%, 0, 0);
  }
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  /* iPhone X 独有样式写在这里*/
}
</style>
