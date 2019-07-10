<template>
  <div class="dt-pages exam-send-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader  title="智能测需"  :leftBack="false"  @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
       <div class="exam-animate"></div>
       <div class="exam-footer">
          <div class="cxTips" v-if="guide && guide.examSend!=1">
            保险，买什么？给谁买？买多少？60秒内解你困惑！也可以发给自己测一测哦
              <span class="cxjttips"></span>
              <span @click="clearTips('examSend')"><icon name="tipdel" class="dt-icon"></icon></span>
          </div>
         <p class="btn" @click="share">发给用户测一测</p>
         <p>建立家庭的风险认知很重要，智能保小秘</p>
         <p>帮您了解客户更多需求，给客户提供最适合TA的方案。</p>
       </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { wechatService } from "@/config/env";
import { getDevice } from "@/config/utils.js";
export default {
  name: "examSend",
  components: {
    dtHeader
  },
  data() {
    return {
      shareId: null,
      device: getDevice(),
      guide: null
    };
  },
  created() {
    this.guide = this.$store.state.guide;
    this.initData();
    window.shareResult = function() {};
  },
  methods: {
    initData() {},
    goBack() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.goHomePage();
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.goHomePage.postMessage(null);
      }
    },
    clearTips() {
      this.$store.state.guide.examSend = 1;
      this.guide.examSend = 1;
      this.$userGuide({
        examSend: 1
      });
    },
    async share() {
      this.clearTips();
      let result = await api.createMeasureRecord();
      if (result.status == 1) {
        if (result.data) {
          this.shareId = result.data.id;
          let obj = {
            type: 3, //1小程序，2，图片，3连接
            userName: "",
            miniprogramType: 1,
            path: "",
            title: "保险黑科技—AI智能测试，一分钟制定个性化方案。",
            content: "全国保民大数据分析，快来测一测您的保障水平达标吗？",
            clickUrl:
              wechatService +
              "/examStart?shareId=" +
              this.shareId +
              "&shareType=0",
            pictureBase64:
              "iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMjA4ODRlZC1lMjg2LTQxYWEtYjBjZi0yMTQwZjViZmFlZGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REE1OEEzM0VCMDJDMTFFODhBRDlFMUNCRDJEMERDQzYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REE1OEEzM0RCMDJDMTFFODhBRDlFMUNCRDJEMERDQzYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMmQ4MDUzNi1kZDdiLTQ3YTgtOGU0NC1jMTViYjQyMGUyNDEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwODg0ZWQtZTI4Ni00MWFhLWIwY2YtMjE0MGY1YmZhZWRk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",
            pictureUrl: location.origin + "/static/img/cexu.png"
          };
          this.$share(obj);
        }
      } else {
        this.$alert(result.msg);
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

.exam-send-page {
  background: #fff;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .exam-animate {
    width: 750px;
    height: 961px;
    margin-top: 30px;
    background-image: url("../../assets/imgs/exam-animate.gif");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .exam-footer {
    margin: 60px 30px;
    font-size: 22px;
    color: #999;
    text-align: center;
    line-height: 40px;
    position: relative;
    .btn {
      background: #28c76a;
      height: 80px;
      font-size: 30px;
      font-weight: bold;
      line-height: 80px;
      color: #fff;
      border-radius: 36px;
      margin-bottom: 20px;
    }
    .cxTips {
      background-color: #ffbd0b;
      border-radius: 10px;
      color: #fff;
      width: 415px;
      line-height: 45px;
      padding: 25px 15px 15px;
      position: absolute;
      left: 45px;
      top: -190px;
      z-index: 999;
      font-size: 24px;
      text-align: left;
      .cxjttips {
        width: 30px;
        height: 11px;
        position: absolute;
        right: 54px;
        bottom: -11px;
        background-image: url(../../assets/imgs/cxjttips.png);
        background-size: cover;
      }
      .dt-icon {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 10px;
        top: 10px;
        color: #fff;
      }
    }
  }
}
</style>
