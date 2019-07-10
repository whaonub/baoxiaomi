<template>
  <div class="dt-pages celebrity">
    <div class="dt-header">
      <dtHeader title="大咖分享" rightIcon="shareb" :leftIcon="true" :leftBack="false" @headerLeft="goBack" @headerRight="handleAction"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div ref="celebrity"></div>
      <!-- video -->
      <movie v-if="detailData.bigShotShareType == 1" :detailData="detailData" :validityData="validityData" :flag="flag" :isPraise="isPraise" :likeNum="likeNum" @collect="collect" @praise="praise" @toggle="toggle">
      </movie>
      <!-- audio -->
      <audios v-if="detailData.bigShotShareType == 2" :detailData="detailData" :flag="flag" :isPraise="isPraise" :likeNum="likeNum" @collect="collect" @praise="praise">
      </audios>
      <!-- 图文 -->
      <image-text v-if="detailData.bigShotShareType == 3" @getSrc="getImgSrc" :flag="flag" :isPraise="isPraise" :likeNum="likeNum" @collect="collect" @praise="praise" :detailData="detailData">
      </image-text>
      <div class="active-banner" @click="gotoInviting">
        <img src="../../assets/imgs/active-banner.png" alt="">
      </div>
      <div class="recommend">
        <div>相关推荐</div>
        <div v-if="articlesData.length>0" @click="toLink">更多<icon name="right" class="dt-icon right"></icon>
        </div>
      </div>
      <!-- 文章列表 -->
      <articles :articlesData="articlesData" @toDetail="toDetail"></articles>
    </div>
    <!-- 图片弹窗 -->
    <x-dialog v-model="showImg" hide-on-blur>
      <img :src="imgSrc" alt="" class="active">
      <!-- <div class="screenBtn">
        点击横屏
      </div> -->
    </x-dialog>
    <networkTips></networkTips>
  </div>
</template>
<script>
import movie from "./movie";
import audios from "./audio";
import { XDialog } from "vux";
import api from "@/api/index";
import articles from "./article";
import imageText from "./imageText";
import dtHeader from "@/components/dtHeader";
import { wechatService } from "@/config/env";
import networkTips from "@/components/networkTips";
import { scrollToElement, getDevice } from "@/config/utils.js";
export default {
  name: "celebrity",
  components: {
    dtHeader,
    articles,
    movie,
    imageText,
    XDialog,
    audios,
    networkTips
  },
  data() {
    return {
      device: getDevice(),
      validityData: [
        {
          title: "内容简介",
          img: require("../../assets/imgs/content1.png"),
          text: "",
          show: false
        },
        {
          title: "大咖介绍",
          img: require("../../assets/imgs/content2.png"),
          text: "",
          show: false
        }
      ],
      articlesData: [],
      imgSrc: "",
      showImg: false,
      tipsText: "",
      idVo: "",
      detailData: {},
      flag: false,
      isPraise: false,
      likeNum: 0,
      pageFrom: null
    };
  },
  created() {
    this.$store.state.app_token = null;
    let from = this.$route.query.from;
    this.pageFrom = from;
    let $this = this;
    let device = this.device;
    let apptokenObj;
    let clientObj;
    if (device == "android") {
      clientObj = bmAndroid.getClientInfo();
      apptokenObj = bmAndroid.getToken();
      if (apptokenObj && apptokenObj != "null") {
        apptokenObj = JSON.parse(apptokenObj);
        $this.$store.state.app_token = apptokenObj.accessToken;
        $this.$store.state.refreshToken = apptokenObj.refreshToken;
        if (clientObj && clientObj != "null") {
          if (typeof clientObj === "string") {
            clientObj = JSON.parse(clientObj);
          }
          if (typeof clientObj.clientInfo === "string") {
            clientObj.clientInfo = JSON.parse(clientObj.clientInfo);
          }
          $this.$store.state.clientInfo = clientObj.clientInfo;
        }
      }
      this.initData();
    } else if (device == "ios" || device == "iPhoneX") {
      window.webkit.messageHandlers.getClientInfo.postMessage(null);
      window.getClientInfo = function(obj) {
        if (obj) {
          obj = JSON.parse(obj);
          $this.$store.state.clientInfo = obj.clientInfo;
        }
      };
      window.webkit.messageHandlers.getToken.postMessage(null);
      window.getToken = function(obj) {
        if (obj) {
          obj = JSON.parse(obj);
          $this.$store.state.app_token = obj.accessToken;
          $this.$store.state.refreshToken = obj.refreshToken;
        }
        $this.initData();
      };
    }
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  watch: {
    $route(to, from) {
      this.$store.state.app_token = null;
      var vueElement = this.$refs[`celebrity`];
      scrollToElement.call(this, vueElement, 200);
      this.initData();
    }
  },
  methods: {
    initData() {
      this.idVo = this.$route.query.paicheNo;
      this.getRecommend();
      this.getShotDetail(this.idVo);
    },
    goBack() {
      let device = this.device;
      let from = this.$route.query.from;
      let pageFrom = this.pageFrom;
      if (pageFrom == "home") {
        if (device == "android") {
          bmAndroid.goHomePage();
        } else if (device == "ios" || device == "iPhoneX") {
          let isPc = this.$store.state.isPc;
          if (!isPc) {
            window.webkit.messageHandlers.goHomePage.postMessage(null);
          } else {
            this.$router.go(-1);
          }
        }
        if (window.dtPlayer) {
          window.dtPlayer.j2s_pauseVideo();
        }
      } else if (pageFrom == "list") {
        this.$router.push({
          path: "/moreArticle",
          query: {
            from: "item"
          }
        });
      } else {
        this.$router.go(-1);
      }
    },
    // 查询大咖分享详情
    async getShotDetail(id) {
      let results = await api.getShotDetail({ id: id });
      if (results.status == 1) {
        if (results.data) {
          this.detailData = results.data;
          this.flag = results.data.collect;
          this.isPraise = results.data.praise;
          this.likeNum = results.data.likeNum;
          if (results.data.bigShotShareType == 1) {
            this.validityData[0].text = results.data.introduce;
            this.validityData[1].text = results.data.bigShotIntroduce;
          }
        } else {
          this.detailData = {};
        }
      } else {
        this.$alert(results.msg);
        return false;
      }
    },
    // 查询推荐
    async getRecommend() {
      let results = await api.getRecommend();
      if (results.status == 1) {
        if (results.data) {
          this.articlesData = results.data;
        } else {
          this.articlesData = [];
        }
      } else {
        this.$alert(results.msg);
        return false;
      }
    },
    // 点击收藏与取消
    async getCollect(id) {
      let results = await api.getCollect({ id: id });
      this.flag = results.data.flag;
      if (this.flag) {
        this.$toast("收藏成功");
      }
    },
    collect(id) {
      let idVo = id;
      this.getCollect(idVo);
    },
    // 点击点赞与取消
    async getPraise(id) {
      let results = await api.getPraise({ id: id });
      this.isPraise = results.data.flag;
      if (this.isPraise) {
        this.$toast("点赞成功");
      }
      this.likeNum = results.data.likeNum;
    },
    praise(id) {
      let idVo = id;
      this.getPraise(idVo);
      // this.getShotDetail(this.idVo)
    },
    // 显示隐藏好友分享底部栏
    handleAction() {
      let title = this.detailData.title;
      let bigShotIntroduce = this.detailData.bigShotIntroduce;
      let obj = {
        type: 3, //1小程序，2，图片，3连接
        userName: "",
        miniprogramType: 1,
        path: "",
        title: title,
        content: bigShotIntroduce,
        clickUrl: wechatService + "/celebrity?paicheNo=" + this.idVo,
        pictureBase64:
          "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjI2MkNEREY5ODZDMTFFOEE1MTlDQjM2ODkyQzdGRjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjI2MkNERTA5ODZDMTFFOEE1MTlDQjM2ODkyQzdGRjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMjYyQ0RERDk4NkMxMUU4QTUxOUNCMzY4OTJDN0ZGNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMjYyQ0RERTk4NkMxMUU4QTUxOUNCMzY4OTJDN0ZGNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi7MO2sAABGWSURBVHja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"
      };
      this.$share(obj);
    },
    // 获取点击对象
    getId(index) {
      console.log(index);
    },
    // 展开收起
    toggle(index) {
      this.validityData[index].show = !this.validityData[index].show;
    },
    // 获取src
    getImgSrc(src) {
      this.imgSrc = src;
      this.showImg = !this.showImg;
    },
    // 跳转文章列表
    toLink() {
      this.$router.push({
        path: "/moreArticle",
        query: {
          from: "celebrity"
        }
      });
    },
    // 跳转详情页面
    toDetail(id) {
      var vueElement = this.$refs[`celebrity`];
      scrollToElement.call(this, vueElement, 200);
      this.$router.push({ path: "/celebrity", query: { paicheNo: id } });
    },
    gotoInviting() {
      this.$router.push({
        path: "/inviting",
        query: {
          from: "celebrity"
        }
      });
    }
  }
};
</script>
<style lang="less">
.celebrity {
  .dt-content {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    .active-banner {
      padding: 10px 20px 16px;
      img {
        width: 100%;
      }
    }
    .recommend {
      display: flex;
      justify-content: space-between;
      padding: 0 30px;
      background: #fff;
      height: 80px;
      align-items: center;
      border-top: 2px solid #e8e8e8;
      border-bottom: 2px solid #e8e8e8;
      div:nth-child(1) {
        font-size: 30px;
        font-weight: 700;
        color: #000;
      }
      div:nth-child(2) {
        font-size: 24px;
        color: #666666;
        .dt-icon {
          width: 30px;
          height: 30px;
          position: relative;
          top: -2px;
        }
        svg {
          path {
            fill: #999;
          }
        }
      }
    }
  }
  .weui-dialog {
    background: none;
    width: 100%;
    max-width: 500px;
    img {
      width: 100%;
    }

    .screenBtn {
      background: #28c76a;
      line-height: 30px;
      border-radius: 15px;
      margin: 50px auto 0;
      height: 30px;
      width: 150px;
      color: #fff;
    }
  }
  // 底部遮罩
  .bottom_mark {
    background: #000;
    opacity: 0.7;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 99;
  }
}
</style>
