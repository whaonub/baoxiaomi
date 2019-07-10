<template>
  <div class="dt-pages pay-remind-page">
    <div class="dt-header">
      <dtHeader :title="`${this.$route.query.name}的家庭交费提醒`" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div v-if="remindData.securityDetailsList.length > 0" class="wrapper">
        <div v-if="monthDayInside.length != 0" class="box">
          <h3 class="title">
            <i class="title-icon"></i>30天内需要交费
          </h3>
          <div v-for="(v,i) in monthDayInside" :key="i" class="box-item">
            <div class="box-item-header">
              <h3 class="item-title">
                <span class="circle">{{i + 1}}</span>
                {{v.productName}}
              </h3>
              <p class="day">距离下次交费{{v.payYear}}天</p>
            </div>
            <div class="box-item-content">
              <div class="box-item-left">
                <p class="info-text">保险公司：{{v.companyId}}</p>
                <p class="info-text">保单号：{{v.policyNo}}</p>
                <p class="info-text">生效日期：{{v.securityPeriod}}</p>
                <p class="info-text">交费银行：{{v.bankName}}</p>
              </div>
              <div class="box-item-right">
                <div class="right-header">
                  <span class="type">投保人</span>
                  <span class="name">{{v.insurerName}}</span>
                </div>
                <h3 class="money">保费：<font color="#f39d21">{{v.prem}}元</font>
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div v-if="monthDayOutside.length != 0" class="box">
          <h3 class="title">
            <i class="title-icon"></i>30天后需要交费
          </h3>
          <div v-for="(v,i) in monthDayOutside" :key="i" class="box-item">
            <div class="box-item-header">
              <h3 class="item-title">
                <span class="circle">{{i + 1}}</span>
                {{v.productName}}
              </h3>
              <p class="day">距离下次交费{{v.payYear}}天</p>
            </div>
            <div class="box-item-content">
              <div class="box-item-left">
                <p class="info-text">保险公司：{{v.companyId}}</p>
                <p class="info-text">保单号：{{v.policyNo}}</p>
                <p class="info-text">生效日期：{{v.securityPeriod}}</p>
                <p class="info-text">交费银行：{{v.bankName}}</p>
              </div>
              <div class="box-item-right">
                <div class="right-header">
                  <span class="type">投保人</span>
                  <span class="name">{{v.insurerName}}</span>
                </div>
                <h3 class="money">保费：<font color="#f39d21">{{v.prem}}元</font>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <tips v-if="remindData.securityDetailsList.length == 0" text="暂无数据" tips="tips10"></tips>
    </div>
  </div>
</template>
<script>
import { Group } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { scrollToElement } from "@/config/utils.js";
import tips from "@/components/tips";
export default {
  components: {
    Group,
    dtHeader,
    tips
  },
  data() {
    return {
      remindData: "",
      monthDayInside: [],
      monthDayOutside: []
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  activated() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    async initData() {
      this.monthDayInside = [];
      this.monthDayOutside = [];
      if (this.$route.query.from == "reportSimpleHistory") {
        let res = await api.premDetailHistory({
          reportId: this.$route.query.reportId,
          customerId: this.$route.query.customerId
        });
        this.remindData = res.data;
      } else {
        let res = await api.premDetailList({
          familyId: this.$route.query.familyId,
          customerId: this.$route.query.customerId
        });
        this.remindData = res.data;
      }
      for (let item of this.remindData.securityDetailsList) {
        if (item.isMonthDay == "Y") {
          this.monthDayInside.push(item);
        } else {
          this.monthDayOutside.push(item);
        }
      }
    },
    goBack() {
      this.$router.go(-1);
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

.pay-remind-page {
  .dt-content {
    // padding: 0 2%;
    // padding-bottom: 100px;
    background-color: #f7f7f7;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .wrapper {
    padding: 20px;
    .box {
      h3 {
        font-weight: normal;
      }
      .title {
        font-size: 30px;
        line-height: 35px;
        letter-spacing: 0px;
        color: #28c76a;
        .title-icon {
          display: inline-block;
          vertical-align: -4px;
          width: 8px;
          height: 28px;
          background-color: #28c76a;
          margin-right: 20px;
        }
      }
      .box-item {
        width: 710px;
        background-color: #ffffff;
        box-shadow: 2px 4px 10px 0px rgba(38, 125, 74, 0.1);
        border-radius: 8px;
        border: solid 2px #eeeeee;
        padding-bottom: 30px;
        margin: 26px 0;
        position: relative;
        .box-item-header {
          position: relative;
          .item-title {
            font-size: 32px;
            letter-spacing: 0px;
            color: #222222;
            padding: 30px 0 20px 20px;
            width: 460px;
            .circle {
              display: inline-block;
              vertical-align: 4px;
              width: 36px;
              height: 36px;
              line-height: 36px;
              font-size: 26px;
              border: 2px solid #222;
              border-radius: 50%;
              text-align: center;
            }
          }
          .day {
            font-size: 24px;
            letter-spacing: 0px;
            color: #28c76a;
            padding: 38px 0 10px;
            position: absolute;
            top: 0;
            right: 20px;
          }
        }
        .box-item-content {
          width: 670px;
          // height: 200px;
          background-color: #f9f9f9;
          border-radius: 8px;
          border: solid 2px #eeeeee;
          margin: 0 auto;
          padding: 20px;
          position: relative;
          .box-item-left {
            width: 400px;
            .info-text {
              font-size: 28px;
              line-height: 44px;
              letter-spacing: 0px;
              color: #999999;
            }
          }
          .box-item-right {
            position: absolute;
            top: 20px;
            right: 20px;
            .right-header {
              .name {
                display: inline-block;
                width: 100px;
                height: 100px;
                line-height: 100px;
                background-color: #6edd9c;
                border-radius: 50px;
                border: solid 2px #eeeeee;
                margin: 0 auto;
                text-align: center;
                color: #fff;
                font-size: 28px;
              }
              .type {
                font-size: 26px;
                line-height: 36px;
                letter-spacing: 0px;
                color: #666666;
                padding: 6px 0 10px;
              }
            }

            .money {
              margin-top: 26px;
              font-size: 30px;
              line-height: 36px;
              letter-spacing: 0px;
              color: #333333;
            }
          }
        }
      }
    }
  }
}
</style>
