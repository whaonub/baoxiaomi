<template>
  <div class="dt-pages aboutUs-page">
    <div class="dt-header">
      <dtHeader title="平台介绍" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="header-logo">
        <img src="../../assets/imgs/aboutUsLogo.png" alt="">
        <p class="title">保小秘</p>
        <p class="title-desc">出单秘密，尽在保小秘</p>
      </div>
      <div class="main">
        <div class="main-title">
          <i class="icon"></i>
          <span>介绍</span>
        </div>
        <div class="main-content">
          <p class="content-desc">
            保小秘APP是一款服务于保险代理人的移动赋能应用，为保险代理人的需求而生，三大功能：专业名片、OCR保单托管、智能测评需求，帮助代理人轻松获客、签单，让工作更加便捷高效，旨在建立科学的、可持续发展的保险生态圈。 
          </p>
          <p class="content-info">【功能特点】</p>
          <div class="content-trait">
            <div class="trait-title">
              ① 轻松获客
            </div>
            <div class="trait-desc">
              <p>名片简讯结合，打造专业形象</p>
              <p>一键制作分享，个性获客神器</p>
            </div>
          </div>
          <div class="content-trait">
            <div class="trait-title">
              ② 无畏拜访
            </div>
            <div class="trait-desc">
              <p>保单托管服务帮助客户整理家庭保单，让服务成为拜访客户的“敲门砖”！</p>
            </div>
          </div>
          <div class="content-trait">
            <div class="trait-title">
              ③ 锁定客户
            </div>
            <div class="trait-desc">
              <p>一次拜访即刻锁定为专属保险管家，为客户提供终身的家庭保障规划！</p>
            </div>
          </div>
          <div class="content-trait">
            <div class="trait-title">
              ④ 高效展业
            </div>
            <div class="trait-desc">
              <p>手机扫描录入，5秒锁定客户</p>
              <p>自动生成报告，立刻上门拜访</p>
            </div>
          </div>
          <div class="content-trait">
            <div class="trait-title">
              ⑤ 精准营销
            </div>
            <div class="trait-desc">
              <p>1m智能测需，360º个性分析</p>
              <p>抓住客户需求，精准营销签单</p>
              <p>一键优化保障，客户主动加保</p>
            </div>
          </div>
          <div class="content-trait">
            <div class="trait-title">
              ⑥ 专业提升
            </div>
            <div class="trait-desc">
              <p>赚钱之余学习，名师大咖相伴</p>
              <p>更多实战经验，带你月入5万</p>
            </div>
          </div>
        </div>
      </div>
      <div class="main contactUs">
        <div class="main-title">
          <i class="icon"></i>
          <span>联系我们</span>
        </div>
        <div class="main-content">
          <div class="content-desc">
            <p class="query">若有疑问，可发邮件咨询。</p>
            <p class="email">保小秘官方邮箱：<font color="#28c76a">baoxiaomi@fancetech.com</font>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils";
export default {
  components: {
    dtHeader
  },
  data() {
    return {
      device: getDevice()
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    initData() {},
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
.aboutUs-page {
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #f5f5f5;
    // padding-bottom: 46px;
    .header-logo {
      height: 414px;
      text-align: center;
      padding: 60px 0 0;
      img {
        width: 200px;
        border-radius: 10px;
      }
      .title {
        margin-top: 10px;
        font-size: 32px;
        letter-spacing: 0px;
        color: #333333;
      }
      .title-desc {
        font-size: 26px;
        letter-spacing: 0px;
        color: #999999;
      }
    }
    .main {
      background-color: #fff;
      margin-bottom: 20px;
      border-top: 2px solid #e8e8e8;
      border-bottom: 2px solid #e8e8e8;
      .main-title {
        padding-left: 20px;
        height: 80px;
        line-height: 80px;
        border-bottom: 2px solid #e8e8e8;
        .icon {
          width: 10px;
          height: 28px;
          background-color: #28c76a;
          display: inline-block;
          vertical-align: -4px;
          margin-right: 14px;
        }
        span {
          font-size: 30px;
          letter-spacing: 0px;
          color: #333333;
        }
      }
      .main-content {
        padding: 30px 50px;
        .content-desc {
          font-size: 30px;
          line-height: 50px;
          letter-spacing: 1px;
          .query {
            font-size: 28px;
            line-height: 46px;
            letter-spacing: 1px;
            color: #666666;
          }
          .email {
            font-size: 28px;
            letter-spacing: 1px;
            color: #999999;
          }
        }
        .content-info {
          margin: 30px 0 30px -18px;
          font-size: 30px;
          letter-spacing: 1px;
          color: #28c76a;
        }
        .content-trait {
          margin-bottom: 28px;
          .trait-title {
            font-size: 28px;
            letter-spacing: 1px;
            color: #333333;
            margin-bottom: 6px;
          }
          .trait-desc {
            font-size: 28px;
            line-height: 40px;
            letter-spacing: 1px;
            color: #999999;
            margin-left: 40px;
          }
        }
      }
    }
    .contactUs {
      margin-bottom: 0;
    }
  }
}
</style>
