<template>
  <div class="headerTop">
    <flexbox class="page-title" :gutter="0">
      <flexbox-item :span="2.5" align="left">
        <div v-if="leftIcon" @click="backs" class="back-icon">
          <span class="back-img"></span>
          <span class="back-text" v-if="leftText">关闭</span>
        </div>
      </flexbox-item>
      <flexbox-item class="title-name fz36" :span="7">
        <span @click="titleClick">
          {{title}}
          <icon v-if="titleIcon" class="dt-icon titleIcon" :name="titleIcon"></icon>
        </span>
      </flexbox-item>
      <flexbox-item :span="2.5" class="fz30" align="right">
        <span v-if="rightIcon" @click="rightClick">
          <icon class="dt-icon rightIcon" :class="rightIcon=='day'?'dayicon':''" :name="rightIcon"></icon>
        </span>
        <span
          v-if="rightText"
          @click="rightClick"
          :style="{color:textColor,fontWeight:textWeight}"
        >{{rightText}}</span>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from "vux";

export default {
  name: "dtHeader",
  props: {
    leftIcon: {
      type: Boolean,
      default: true
    },
    leftText: {
      type: Boolean,
      default: false
    },
    rightText: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    querys: {
      type: Boolean,
      default: false
    },
    leftBack: {
      type: Boolean,
      default: true
    },
    textColor: {
      type: String,
      default: "#fff"
    },
    rightIcon: {
      type: String,
      default: ""
    },
    textWeight: {
      type: String,
      default: ""
    },
    titleIcon: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      query: {}
    };
  },
  created() {
    if (this.querys) {
      this.query = this.$route.query;
    }
  },
  watch: {
    $route(to, from) {
      if (this.querys) {
        this.query = this.$route.query;
      }
    }
  },
  components: {
    FlexboxItem,
    Flexbox
  },
  methods: {
    backs() {
      if (this.leftBack) {
        // console.log(this.url)
        this.$router.push({ path: "/" + this.url, query: this.query });
      } else {
        this.leftClick();
      }
    },
    rightClick() {
      this.$emit("headerRight", true);
    },
    leftClick() {
      // console.log('headerLeft')
      this.$emit("headerLeft", true);
    },
    titleClick() {
      this.$emit("headerCenter", true);
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/mixin";

.headerTop {
  width: 100%;
  vertical-align: 88px;
  text-align: center;
  left: 0;
  top: 0;
  background: #28c76a;
  .title-name {
    text-align: center;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
  }
  .page-title {
    height: 88px;
    padding: 0 30px;
    vertical-align: 88px;
    text-align: center;
  }
  .back-icon {
    .back-img {
      margin-top: 10px;
      display: inline-block;
      width: 18px;
      height: 32px;
      .bg-image(icon_back, 18, 32);
      .active-op(0.7);
    }
    .back-text {
      height: 32px;
      line-height: 32px;
      color: #fff;
      display: inline-block;
      position: relative;
      top: -6px;
      font-size: 30px;
      margin-left: 8px;
    }
  }
  .rightIcon {
    color: #fff;
    font-size: 20px;
    width: 48px;
    height: 48px;
  }
  .dayicon {
    width: 38px;
    height: 38px;
  }
  .titleIcon {
    color: #fff;
    position: relative;
    top: -3px;
    margin-left: 10px;
  }
}

.headerTop + div {
  margin-top: 88px;
}
</style>
