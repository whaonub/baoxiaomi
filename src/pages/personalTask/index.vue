<template>
  <div class="dt-pages personal-task">
    <div class="dt-header">
      <dtHeader
        title="任务中心"
        rightText="规则"
        :leftIcon="true"
        :leftBack="false"
        @headerRight="handleAction"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div class="dt-content">
      <div class="statistics-box">
        <div class="statistics">
          <div
            class="st-box"
            :class="item.border?'active-border':''"
            v-for="(item,index) in statisticsData"
            :key="index"
          >
            <div class="num">{{item.num}}</div>
            <div class="text" :class="item.bg?'active-bg':''" @click="linkTo(index)">{{item.text}}</div>
          </div>
        </div>
      </div>
      <tabbar :tabData="tabData" :showActive="showActive" :changeKey="changeKey"></tabbar>
      <novice :tabListData="tabListData" @getReward="getReward" @goToTask="toTask"></novice>
      <lottery-active
        v-if="showActive == 0 && tabListData.length>0"
        :beforeLottery="beforeLottery"
        :lotteryBtn="lotteryBtn"
        :prize="prize"
        :prizesList="prizesList"
        :debris="debris"
        :isPrized="isPrized"
        :afterLottery="afterLottery"
      ></lottery-active>
    </div>
    <toast v-model="showPositionValue" type="text" is-show-mask :text="point" position="middle"></toast>
    <x-dialog v-model="showSDialog">
      <div class="prizeContent">
        <img class="prizeImg" :src="prizeR[prize].img" alt>
        <div class="prizeText" v-if="redeemCode">
          <span class="t1">兑换码为:</span>
          <span class="t2">{{redeemCode}}</span>
          <span class="t3">
            <button @click="copyRedeemCode" ref="copy">复制</button>
          </span>
        </div>
      </div>
      <div class="prizeCancel" @click="toHidePD"></div>
      <div
        class="prizeTitle"
        @click="exchangePrize(prizeR[prize])"
      >{{prizeR[prize].type==1?'我知道了':'立即兑换'}}</div>
    </x-dialog>
  </div>
</template>
<script>
import dtHeader from "@/components/dtHeader";
import tabbar from "./tabbar";
import novice from "./novice";
import lotteryActive from "./lotteryActive";
import api from "@/api/index";
import { Toast } from "vux";
import { XDialog } from "vux";
import { getDevice } from "@/config/utils.js";
export default {
  name: "personalTask",
  components: {
    dtHeader,
    tabbar,
    novice,
    lotteryActive,
    Toast,
    XDialog
  },
  data() {
    return {
      device: getDevice(),
      statisticsData: [
        { num: 0, text: "我的金豆", bg: true },
        { num: 0, text: "已完成任务" },
        { num: 0, text: "待完成任务", border: true }
      ],
      tabData: [{ text: "新手任务" }, { text: "每日任务" }],
      showActive: 0,
      tabListData: [],
      //抽奖转盘
      prizesList: [
        { img: require("../../assets/imgs/lottery/1.png"), font: "8元现金" },
        { img: require("../../assets/imgs/lottery/5.png"), font: "30元现金" },
        { img: require("../../assets/imgs/lottery/7.png"), font: "100元现金" },
        { img: require("../../assets/imgs/lottery/2.png"), font: "10元话费" },
        { img: require("../../assets/imgs/lottery/6.png"), font: "100M流量" },
        { img: require("../../assets/imgs/lottery/33.png"), font: "10元现金" },
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
        { img: require("../../assets/imgs/33.png"), type: 1 },
        { img: require("../../assets/imgs/4.png"), type: 1 },
        { img: require("../../assets/imgs/8.png"), type: 1 }
      ],
      prize: 0, //控制中奖项
      // 转盘抽奖按钮
      lotteryBtn: {
        img: require("../../assets/imgs/lottery/prizeBtn.png")
      },
      //是否抽过奖
      isPrized: 0,
      // 已获取碎片
      debris: [],
      // 显示弹框
      showPositionValue: false,
      // 领取金豆数量
      point: "",
      showSDialog: false,
      dialogMsg: "",
      prizeInfo: {},
      redeemCode: null,
      copyBtn: null
    };
  },
  created() {
    let $this = this;
    this.initData();
    window.updatePolicyPage = function() {
      $this.initData();
    };
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  methods: {
    async initData() {
      await this.getTaskNum();
      await this.getNoviceTask(true);
    },
    goBack() {
      this.$store.state.record = null;
      if (this.$route.query.from == "signIn") {
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
    },
    // 获取新手任务
    async getNoviceTask(status) {
      let results = await api.getNoviceTask();
      if (results.status == 1) {
        if (results.data) {
          let list = results.data.list;
          for (let i = 0; i < list.length; i++) {
            this.setTaskIcon(list[i]);
          }
          this.tabListData = list;
          this.getDebris(status);
        }
      } else {
        this.$alert(results.msg);
      }
    },
    setTaskIcon(obj) {
      obj.taskIcon = require("../../assets/imgs/taskIcon/" +
        obj.taskId +
        ".png");
    },
    // 获取每日任务
    async getDailyTask() {
      let results = await api.getDailyTask();
      if (results.status == 1) {
        if (results.data) {
          let list = results.data.list;
          for (let i = 0; i < list.length; i++) {
            this.setTaskIcon(list[i]);
          }
          this.tabListData = list;
        }
      } else {
        this.$alert(results.msg);
      }
    },
    // 获取任务数量
    async getTaskNum() {
      let results = await api.getTaskNum();
      if (results.status == 1) {
        if (results.data) {
          this.statisticsData[0].num = results.data.point;
          this.statisticsData[1].num = results.data.complateNum;
          this.statisticsData[2].num = results.data.unComplateNum;
        }
      } else {
        this.$alert(results.msg);
      }
    },
    /**碎片奖励信息**/
    async getDebris(status) {
      let results = await api.getDebris();
      if (results.status) {
        if (results.data) {
          this.debris = results.data.debris1;
          this.isPrized = results.data.isPrized;
          if (status) {
            if (this.$store.state.record) {
              this.showActive = this.$store.state.record;
              if (this.showActive == 1) {
                this.getDailyTask();
              }
            } else if (this.isPrized == 1) {
              this.showActive = 1;
              this.getDailyTask();
            }
          }
        }
      } else {
        this.$alert(results.msg);
      }
    },
    // 去做任务
    async toTask(item) {
      if (item.taskType == 2) {
        this.$store.state.record = 1;
      } else {
        this.$store.state.record = 0;
      }
      let device = this.device;
      if (item.taskId == "1012" || item.taskId == "1010") {
        //APP评论
        //意见反馈
        let type = 1;
        if (item.taskId == "1012") {
          type = 2;
          await api.complateTask({
            id: "1012"
          });
        }
        if (device == "android") {
          bmAndroid.gotoAppPage(type);
        } else if (device == "ios" || device == "iPhoneX") {
          this.initData();
          window.webkit.messageHandlers.gotoAppPage.postMessage(type);
        }
      } else if (
        item.taskId == "1004" ||
        item.taskId == "1003" ||
        item.taskId == "1005" ||
        item.taskId == "2003" ||
        item.taskId == "2002"
      ) {
        //下载报告
        //分享报告
        //建立托管
        if (item.taskUrl) {
          this.$router.push(item.taskUrl);
        } else {
          this.$toast(item.unavailableMsg);
        }
      } else {
        if (item.taskUrl) {
          this.$router.push(item.taskUrl);
        } else {
          this.$toast("未知错误");
        }
      }
    },
    // 领取奖励
    async getReward(taskId, point) {
      let results = await api.getReward({ taskId: taskId });
      if (results.status == 1) {
        if (results.data) {
          let debris = results.data.debris;
          point = results.data.point;
          if (debris) {
            this.point = `<div>+${point}</div><div>金豆领取成功</div><div>同时获得${debris}号碎片</div>`;
          } else {
            this.point = `<div>+${point}</div><div>金豆领取成功</div>`;
          }
          this.getTaskNum();
          this.showPositionValue = true;
          if (this.showActive == 0) {
            this.getNoviceTask();
          }
          if (this.showActive == 1) {
            this.getDailyTask();
          }
        }
      } else {
        this.$toast("领取失败，请重试！");
      }
    },

    handleAction() {
      this.$router.push("/taskRules");
    },
    changeKey(index) {
      this.showActive = index;
      if (index == 0) {
        this.getNoviceTask();
      }
      if (index == 1) {
        this.getDailyTask();
      }
    },
    // 新手任务抽奖
    async getTaskReward() {
      let results = await api.getTaskReward();
      if (results.status == 1) {
        if (results.data) {
          this.prizeInfo = results.data;
          if (this.prizeInfo.redeemCode) {
            this.redeemCode = this.prizeInfo.redeemCode;
            this.$nextTick(() => {
              this.instantiation();
            });
          }
          this.isPrized = 1;
          if (results.data.prizeCode == 1009) {
            results.data.prizeCode = 1006;
          }
          let num = results.data.prizeCode + "";
          this.prize = Number(num.slice(3)) - 1;
          this.dialogMsg = results.data.msg;
          this.getTaskNum();
        }
      } else {
        this.$alert(results.msg);
      }
    },
    // 调用接口获取prise，判断奖励
    beforeLottery(resolve, reject) {
      /*
       * send ajax to get result and pass to child component
       **/
      // get result : this.prize
      setTimeout(() => {
        this.getTaskReward();
        resolve();
      }, 10);
    },
    // 抽奖结束后执行
    afterLottery() {
      this.showSDialog = true;
    },
    // 跳金豆详情页面
    linkTo(index) {
      if (index == 0) {
        this.$router.push("/beanDetail");
      }
    },
    // 隐藏prizeDialog
    toHidePD() {
      this.showSDialog = false;
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
          bmAndroid.openSpecialPage(obj);
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.openSpecialPage.postMessage(obj);
        }
      } else {
        this.toHidePD();
      }
    },
    // 一键复制兑换码
    copyRedeemCode() {
      let _this = this;
      let clipboard = _this.copyBtn;
      clipboard.on("success", function() {
        _this.$toast("复制成功，请点击立即领取");
      });
      clipboard.on("error", function() {
        _this.$toast("复制失败，请手动选择复制！");
      });
    },
    // 实例化复制组件
    instantiation() {
      this.copyBtn = new this.clipboard(this.$refs.copy, {
        text: trigger => {
          return this.redeemCode;
        }
      });
    }
  }
};
</script>
<style lang="less">
.personal-task {
  .dt-content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .statistics-box {
      padding: 20px;
      background: #ffffff;
      .statistics {
        width: 710px;
        height: 180px;
        background: url("../../assets/imgs/taskbg.png") no-repeat;
        background-size: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        text-align: center;
        color: #fff;
        .st-box {
          width: 236px;
          border-right: 2px solid #8bdbac;
          .num {
            font-size: 40px;
          }
          .text {
            font-size: 28px;
            height: 46px;
            line-height: 46px;
          }
        }
        .active-border {
          border: 0;
        }
        .active-bg {
          background: #7edda6;
          width: 196px;
          height: 46px;
          text-indent: 40px;
          border-radius: 0 23px 23px 0;
        }
      }
    }
  }
  .weui-dialog {
    background: none;
    width: 100%;
    max-width: 1000px;
    .rewardBox {
      background: #ffffff;
      img {
        position: relative;
        top: -30px;
      }
      div {
        line-height: 30px;
      }
    }
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
  .prizeText {
    text-align: left;
    font-size: 22px;
    width: 390px;
    position: absolute;
    left: 200px;
    bottom: 98px;
    letter-spacing: 0px;
    overflow: hidden;
    span {
      float: left;
      height: 46px;
      line-height: 46px;
    }
    .t1 {
      color: #d97c00;
    }
    .t2 {
      position: relative;
      margin-left: 10px;
      font-size: 20px;
      background: #f7f7f7;
      border: 1px #fbe238 solid;
      border-radius: 16px;
      color: #e19b3e;
      height: 38px;
      line-height: 38px;
      padding: 0 7px;
    }
    .t3 {
      position: relative;
      margin-left: 10px;
      color: #e95447;
      button {
        background: none;
        letter-spacing: 0px;
        font-size: 22px;
        color: #e95447;
      }
    }
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
}
</style>

