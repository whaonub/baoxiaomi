<template>
  <div class="dt-pages report-success-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader title="" :leftBack="false" rightText="完成" @headerRight="goBack" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <div class="report-tips">
        <div class="title">
          <span></span>报告已发送!
        </div>
        <div class="text">
          <p>请提醒客户及时查看报告，客户查收状态可从托管列表中查询。</p>
        </div>
      </div>
      <!-- <div class="report-ad01">
        <img src="../../assets/imgs/report-ad01.jpg">
      </div>
      <div class="report-bottom">
        <div class="report-bottom-ad mr30">
          <img src="../../assets/imgs/report-ad02.jpg">
        </div>
        <div class="report-bottom-ad">
          <img src="../../assets/imgs/reportad-03.jpg">
        </div>
        <div class="report-bottom-ad mr30">
          <img src="../../assets/imgs/report-ad02.jpg">
        </div>
        <div class="report-bottom-ad">
          <img src="../../assets/imgs/reportad-03.jpg">
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
export default {
  name: "reportSendSuccess",
  components: {
    dtHeader
  },
  data() {
    return {};
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  methods: {
    initData() {},
    goBack() {
      this.$router.go(-2);
    }
  }
};
</script>
<style lang="less">
.report-success-page {
  background: #f8f8f8;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .report-tips {
      background: #fff;
      padding: 35px 30px;
      margin-bottom: 20px;
      .title {
        padding-bottom: 30px;
        color: #28c76a;
        font-size: 35px;
        font-weight: bold;
        text-align: center;
        border-bottom: 2px #e8e8e8 solid;
        span {
          background: url("../../assets/imgs/report02.jpg") no-repeat;
          background-size: cover;
          display: inline-block;
          width: 46px;
          height: 48px;
          position: relative;
          bottom: -10px;
          margin-right: 23px;
        }
      }
      .text {
        color: #666;
        font-size: 26px;
        line-height: 1.5;
        padding-top: 20px;
        .p1 {
          margin-top: 25px;
          color: #797979;
          font-size: 24px;
          margin-bottom: 15px;
          em {
            font-style: normal;
            color: #28c76a;
          }
        }
      }
    }
    .report-insure {
      margin: 17px;
      background: #fff;
      border-radius: 10px;
      padding: 10px;
      .title {
        height: 80px;
        font-size: 28px;
        line-height: 80px;
        padding-left: 20px;
        position: relative;
        dt {
          width: 83px;
          height: 84px;
          img {
            width: 100%;
          }
        }
        dd {
          font-weight: bold;
        }
        span {
          position: absolute;
          right: 10px;
          top: 25px;
          width: 26px;
          height: 32px;
          background: url("../../assets/imgs/icon_arrow_right.png") no-repeat;
          background-size: cover;
          display: block;
        }
      }
      .pimg {
        img {
          width: 690px;
        }
      }
    }
    .report-ad01 {
      width: 710px;
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
    .report-bottom {
      width: 710px;
      margin: 30px auto;
    }
    .report-bottom-ad {
      width: 340px;
      float: left;
      margin-bottom: 20px;
      img {
        width: 100%;
      }
    }
    .mr30 {
      margin-right: 30px;
    }
  }
}
</style>
