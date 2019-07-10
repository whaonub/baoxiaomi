<template>
  <div class="dt-pages signIn">
    <div class="dt-header">
      <dtHeader title="签到获金豆" :leftIcon="true" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <div @click="gotoPersonalTask" class="myChest">
        <img src="../../assets/imgs/myChest.png" alt>
        我的金豆
      </div>
      <div class="padde"></div>
      <div class="signInTop">
        <div class="beanNum">{{registerData.pointSum}}</div>
        <div class="calendar">
          <div class="years">
            {{year}}
            <span>年</span>
            {{month}}
            <span>月</span>
          </div>
          <div class="weeks">
            <div class="week" v-for="(item,index) in weeks" :key="index">{{item}}</div>
          </div>
          <div class="days">
            <div class="preDay" v-for="(item,index) in week" :key="'d'+ index"></div>
            <div class="day" v-for="(item,index) in daysNum" :key="index">
              <img v-if="getTotal(index)" src="../../assets/imgs/ochest.png" alt>
              <img v-else-if="getTotaled(index)" src="../../assets/imgs/ochested.png" alt>
              <img
                class="lastday-img"
                v-else-if="index == lastDay - 1 && registerData.monthEnd"
                src="../../assets/imgs/signIn-bx.png"
                alt
              >
              <span
                v-else
                :class="[
                          {selected: index < day-1 },
                          {active:index == day-1 },
                          {actived:getSignIned(index)}
                        ]"
              >{{item}}</span>
            </div>
            <div class="preDay" v-for="(item,index) in lastPreDay" :key="'a' + index"></div>
          </div>
        </div>
        <div class="tip">{{registerData.msg}}</div>
        <div class="signBtn" @click="showDialog" :class="isSign?'btnActive':''">
          <span v-if="isSign">签到</span>
          <span v-else>已签到</span>
        </div>
      </div>
      <div class="bottom">
        <img src="../../assets/imgs/signIn-bottom.png" alt>
      </div>
    </div>
    <x-dialog v-model="showSDialog">
      <double
        v-if="showDoubling"
        :prizesList="prizesList"
        :msg="msg"
        :count="count"
        :flag="flag"
        @closeDialog="closeDialog"
        @getDoubleId="getDoubleId"
        :beforeLottery="beforeLottery"
        :lotteryBtn="lotteryBtn"
        :prize="prize"
        :afterLottery="afterLottery"
      ></double>
      <nomal v-else :count="count" :flag="flag" :msg="msg" :url="url" @closeDialog="closeDialog"></nomal>
    </x-dialog>
    <x-dialog v-model="showR">
      <img class="prizeImg" :src="prizeR[prize].img" alt>
      <div class="prizeCancel" @click="toHidePD"></div>
      <div
        @click="exchangePrize(prizeR[prize])"
        class="prizeTitle"
      >{{prizeR[prize].type==1?'我知道了':'立即兑换'}}</div>
    </x-dialog>
  </div>
</template>
<script>
import dtHeader from "@/components/dtHeader";
import api from "@/api/index";
import { XDialog } from "vux";
import { getDevice } from "@/config/utils.js";
import double from "./double";
import nomal from "./nomal";
import { wechatService } from "@/config/env";

export default {
  name: "signIn",
  components: {
    dtHeader,
    XDialog,
    double,
    nomal
  },
  data() {
    return {
      device: getDevice(),
      year: "", // 年
      month: "", //月
      day: "", //日
      week: "", //星期
      lastPreDay: "",
      weeks: ["日", "一", "二", "三", "四", "五", "六"],
      lastDay: "",
      daysNum: [], // 每个月的天数数组
      // 已签到数组
      signIned: [],
      rewardList: [],
      showSDialog: false,
      isSign: true,
      count: 0, //累计签到天数
      flag: 0, //类型  0 普通   1 翻倍   2 九宫格抽奖
      msg: "",
      url: "",
      shareImgBase64: "",
      redeemMsg: "",
      redeemUrl: "",
      showDoubling: false,
      showR: false,
      //抽奖转盘
      prizesList: [
        { img: require("../../assets/imgs/lottery/1.png"), font: "8元现金" },
        { img: require("../../assets/imgs/lottery/5.png"), font: "30元现金" },
        { img: require("../../assets/imgs/lottery/7.png"), font: "100元现金" },
        { img: require("../../assets/imgs/lottery/2.png"), font: "10元充值卡" },
        { img: require("../../assets/imgs/lottery/6.png"), font: "100M流量" },
        { img: require("../../assets/imgs/lottery/3.png"), font: "体检卡" },
        { img: require("../../assets/imgs/lottery/4.png"), font: "200金豆" },
        { img: require("../../assets/imgs/lottery/4.png"), font: "100金豆" }
      ],
      // 中奖后弹出图片
      prizeR: [
        { img: require("../../assets/imgs/1.png"), type: 1 },
        { img: require("../../assets/imgs/5.png"), type: 1 },
        { img: require("../../assets/imgs/7.png"), type: 1 },
        { img: require("../../assets/imgs/2.png"), type: 0 },
        { img: require("../../assets/imgs/6.png"), type: 0 },
        { img: require("../../assets/imgs/3.png"), type: 0 },
        { img: require("../../assets/imgs/4.png"), type: 1 },
        { img: require("../../assets/imgs/8.png"), type: 1 }
      ],
      prize: 0, //控制中奖项
      // 转盘抽奖按钮
      lotteryBtn: {
        img: require("../../assets/imgs/lottery/prizeBtn.png")
      },
      registerData: {}
    };
  },
  created() {
    window.shareResult = function() {};
    this.getYears();
    this.initData();
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  methods: {
    // 初始化数据
    async initData() {
      let res = await api.getRegisterLog();
      if (res.status == 1) {
        this.registerData = res.data;
        this.rewardList = this.registerData.rewardDate;
        this.signIned = this.registerData.registerDates;
        this.lastDay = this.daysNum.length;
        if (Number(this.week) + Number(this.daysNum.length) > 35) {
          this.lastPreDay = 42 - this.week - this.daysNum.length;
        } else {
          this.lastPreDay = 35 - this.week - this.daysNum.length;
        }

        this.count = this.signIned.length;
        if (res.data.isRegisted == 1) {
          this.isSign = false;
        } else {
          this.isSign = true;
        }
      } else {
        this.$alert(res.msg);
        return;
      }
    },

    // 初始化日历
    getYears() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.year = year;
      this.day = day;
      this.week = new Date(year, month - 1, 1).getDay();
      for (let i = 0; i < this.mGetDate(year, month); i++) {
        this.daysNum.push(i + 1);
      }

      if (month < 10) {
        month = "0" + month;
      }
      this.month = month;
    },
    // 获取当月有多少天
    mGetDate(year, month) {
      let d = new Date(year, month, 0);
      return d.getDate();
    },
    // 已签到的天数
    getSignIned(index) {
      for (let i = 0; i < this.signIned.length; i++) {
        if (index == this.signIned[i] - 1) {
          return true;
        }
      }
    },
    // 已签到翻倍
    getTotal(index) {
      if (this.registerData.rewardDateBefore) {
        for (let i = 0; i < this.registerData.rewardDateBefore.length; i++) {
          if (index == this.registerData.rewardDateBefore[i] - 1) {
            return true;
          }
        }
      }
    },
    // 未签到可翻倍
    getTotaled(index) {
      if (this.registerData.rewardDateAfter) {
        for (let i = 0; i < this.registerData.rewardDateAfter.length; i++) {
          if (index == this.registerData.rewardDateAfter[i] - 1) {
            return true;
          }
        }
      }
    },
    // 签到弹框
    async showDialog() {
      if (this.isSign) {
        let res = await api.register();
        if (res.status == 1) {
          this.isSign = false;
          this.count = res.data.registerNum;
          this.flag = res.data.isReward;
          this.msg = res.data.msg;
          this.url = res.data.url;
          this.shareImgBase64 = res.data.shareImg;
          if (this.flag == 0) {
            this.showDoubling = false;
          } else {
            this.showDoubling = true;
          }
          this.showSDialog = true;
        } else {
          this.$alert(res.msg);
          return;
        }
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.showSDialog = !this.showSDialog;
      this.initData();
    },
    // 点击分享
    async share() {
      // this.showSDialog = !this.showSDialog;
      let obj = {
        type: 2,
        shareChannel: "12",
        pictureBase64: this.shareImgBase64
      };
      this.$share(obj);

      let res = await api.shareRegister();
      if (res.status == 1) {
        console.log(res.data);
      } else {
        this.$alert(res.msg);
        return;
      }
      this.initData();
    },

    // 隐藏prizeDialog
    toHidePD() {
      this.showR = false;
    },
    //
    async getDoubleId(index) {
      console.log(index);
      setTimeout(async () => {
        let res = await api.doubling();
        if (res.status == 1) {
          this.flag = res.data.isReward;
          this.msg = res.data.msg;
          this.url = res.data.url;
        } else {
          this.$alert(res.msg);
          return;
        }
        this.showDoubling = false;
      }, 800);
    },
    // 调用接口获取prise，判断奖励
    async beforeLottery(resolve, reject) {
      let res = await api.getAward();
      if (res.status == 1) {
        this.prize = res.data.prizeCode - 1;
        this.redeemUrl = res.data.redeemUrl;
        this.redeemMsg = res.data.msg;
        resolve();
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    // 抽奖结束后执行
    afterLottery() {
      this.showSDialog = false;
      this.showR = true;
      this.initData();
    },
    // 去我的金豆页面
    gotoPersonalTask() {
      this.$router.push({
        path: "/personalTask",
        query: {
          from: "signIn"
        }
      });
    },
    //立即兑换
    exchangePrize(obj) {
      if (obj.type == 0) {
        let prizeInfo = this.prizeInfo;
        let device = this.device;
        let obj = {
          title: "奖品兑换",
          url: prizeInfo.redeemUrl,
          type: 0 //内部，1外部
        };
        if (device == "android") {
          obj = JSON.stringify(obj);
          bmAndroid.openSpecialPage(type);
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.openSpecialPage.postMessage(obj);
        }
      } else {
        this.toHidePD();
      }
    },
    // 返回
    goBack() {
      if (this.$route.query.from == "task") {
        this.$router.go(-1);
        return;
      }
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
      }
    }
  }
};
</script>
<style lang="less">
.signIn {
  .dt-content {
    background: #f7f7f7;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    .padde {
      height: 30px;
      background: #2bc86b;
    }
    .signInTop {
      text-align: center;
      background: url("../../assets/imgs/signIn.png") no-repeat;
      background-size: 100%;
      padding: 0 30px;
      .beanNum {
        padding-top: 120px;
        font-size: 56px;
        color: #fcb903;
      }
      .calendar {
        margin-top: 130px;
        background: #fff;
        color: #333333;
        border-radius: 20px;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.04);
        .years {
          padding: 30px 0 20px;
          span {
            margin: 0 10px;
          }
        }
        .weeks {
          display: flex;
          justify-content: space-around;
          height: 56px;
          background: #f7f7f7;
          line-height: 56px;
          color: #999999;
        }
        .days {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          div {
            height: 84px;
          }
          .preDay {
            width: 14%;
          }
          .day {
            width: 14%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            span {
              display: block;
              line-height: 50px;
              width: 50px;
              height: 50px;
            }
            img {
              // width: 50px;
              height: 50px;
              position: absolute;
              left: 30px;
              top: 4px;
            }
            .lastday-img {
              width: 100px;
              height: 50px;
            }
            .actived {
              background: #beedd2 !important;
              border-radius: 25px;
              color: #fff;
            }
            .active {
              border-radius: 25px;
              color: #fff;
              background: #2bc86b !important;
            }
            .selected {
              background: #ccc;
              border-radius: 25px;
              color: #fff;
            }
          }
          .nextDay {
            width: 14%;
          }
        }
      }
      .tip {
        margin-top: 30px;
        font-size: 22px;
        color: #b3b3b3;
      }
      .signBtn {
        width: 500px;
        height: 80px;
        color: #fff;
        font-size: 30px;
        margin: 22px auto 40px;
        background: #ccc;
        border-radius: 40px;
        line-height: 80px;
      }
      .btnActive {
        background: #fcb903;
      }
    }
    .bottom {
      margin-bottom: 30px;
      padding: 0 30px;
      img {
        width: 100%;
      }
    }
  }
  .myChest {
    background: #fff;
    position: absolute;
    width: 170px;
    height: 50px;
    border-radius: 25px 0 0 25px;
    right: 0;
    top: 50px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    font-size: 24px;
    color: #fda101;
    img {
      // width: 28px;
      height: 28px;
      margin-right: 10px;
    }
  }
  .weui-dialog {
    background: none;
    padding-top: 0;
    max-width: 80%;
    width: 100%;
    overflow: visible;
  }
  .prizeCancel {
    position: absolute;
    width: 39px;
    height: 38px;
    top: 20px;
    right: 15%;
    background-image: url("../../assets/imgs/prizeCancel.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .prizeImg {
    width: 600px;
  }
  .prizeTitle {
    width: 281px;
    height: 65px;
    line-height: 58px;
    background-image: url("../../assets/imgs/prizeTitle.png");
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 26px;
    color: #ffea97;
    margin: 15px auto 0;
  }
  .bottom_mark {
    background: #000;
    opacity: 0.7;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 99;
  }
  @media screen and (min-width: 1024px) {
    .weui-dialog {
      width: 80%;
    }
  }
}
</style>
