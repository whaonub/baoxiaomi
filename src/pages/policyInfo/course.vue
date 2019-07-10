<template>
  <div class="dt-pages course-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader  title="保单托管新手教程"  :leftBack="false" rightText="开通会员" @headerRight="openMember" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
       <div class="course-content">
         <div class="title">使用说明</div>
         <div class="tit">
          <span><em>保单托管是什么？</em><b  class="color"></b></span>
         </div>
         <div class="text">
           帮助客户进行保单整理，与客户建立托管关系，客户即可在手机里随时查看电子保单。让你成为客户的专属保险管家，全面掌握客户需求，科学配置保障方案，用专业赢得客户！
         </div>
         <div class="tit">
           <span><em>如何帮客户托管保单？</em><b class="color"></b></span>
         </div>
         <div class="course-btn">
           <span :class="!status?'active':'sm'">扫描保单</span>
           <span @click="changeStatus('2')" :class="status?'active':''">录入保单</span>
         </div>
         <div class="course-img" v-show="status">
          <img src="../../assets/imgs/course01.jpg"/>
          <img src="../../assets/imgs/course02.jpg"/>
          <img src="../../assets/imgs/course03.jpg"/>
         </div>
         <div class="course-img" v-show="!status">
          <img src="../../assets/imgs/course04.jpg"/>
          <img src="../../assets/imgs/course05.jpg"/>
         </div>
       </div>
       <div class="course-tips">
         <p><icon name="love" class="dt-icon"></icon>温馨提示：</p>
         <p class="tindent">百万保险代理人的选择——使用保单托管功能一对一绑定客户，快速诊断缺口，合理配置方案，赶快去体验吧~</p>
       </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils.js";
export default {
  name: "course",
  components: {
    dtHeader
  },
  data() {
    return {
      status: false,
      device: getDevice()
    };
  },
  created() {
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
    let type = this.$route.query.type;
    if (type) {
      this.changeStatus(type);
    } else {
      this.changeStatus("2");
    }
    this.initData();
  },
  methods: {
    async initData() {
      let result = await api.complateTask({
        id: "1002"
      });
    },
    goBack() {
      let from = this.$route.query.from;
      let device = this.device;
      if (from) {
        this.$router.go(-1);
      } else {
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
    },
    openMember() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.gotoAppPage(4);
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.gotoAppPage.postMessage(4);
      }
    },
    changeStatus(key) {
      if (key == "1") {
        this.status = false;
      } else {
        this.status = true;
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

.course-page {
  background: #28c76a;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .course-content {
    background-color: #ffffff;
    border-radius: 10px;
    margin: 30px 20px;
    padding-bottom: 80px;
    .title {
      background-image: url("../../assets/imgs/course-titlebg.png");
      background-repeat: no-repeat;
      background-size: cover;
      width: 408px;
      height: 65px;
      margin: 0 auto;
      position: relative;
      top: -10px;
      text-align: center;
      color: #fff;
      font-weight: bold;
      font-size: 30px;
      line-height: 65px;
    }
    .tit {
      font-size: 30px;
      color: #000;
      font-weight: bold;
      margin: 15px 30px 5px;
      span {
        display: inline-block;
      }
      em {
        position: relative;
        left: 0;
        z-index: 2;
        font-style: normal;
      }
    }
    .color {
      background: #c7f1d8;
      height: 26px;
      width: 100%;
      display: block;
      position: relative;
      top: -22px;
      left: 0;
      z-index: 1;
    }
    .text {
      margin: 0 30px;
      color: #999;
      font-size: 26px;
      line-height: 1.5;
    }
    .course-btn {
      text-align: center;
      margin-bottom: 70px;
      span {
        width: 290px;
        height: 80px;
        line-height: 80px;
        font-size: 29px;
        border: 2px #bababa solid;
        border-radius: 22px;
        text-align: center;
        display: inline-block;
        margin-right: 25px;
        margin-left: 25px;
        color: #bababa;
        font-weight: 600;
      }
      .sm {
        background: #ddd;
      }
      .active {
        color: #fff;
        background-color: #28c76a;
        border: 2px #28c76a solid;
      }
    }
    .course-img {
      img {
        width: 100%;
        border: none;
      }
    }
  }
  .course-tips {
    font-size: 26px;
    color: #fff;
    line-height: 1.8;
    margin: 30px 20px;
    .dt-icon {
      color: #f05a6c;
      margin-right: 10px;
    }
    .tindent {
      padding-left: 10px;
    }
  }
}
</style>
