<template>
  <div class="dt-pages activity">
    <div class="dt-header">
      <dtHeader title="邀好友 开宝箱" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <base-scroll class="scroll" :bounce="false">
        <div style="padding-bottom: 20px">
          <!-- 跑马灯和我的奖励 -->
          <div class="suspend">
            <div ref="message" class="message">
              <icon name="voiced" class="dt-icon voiced"></icon>
              <marquee :interval="2000">
                <marquee-item
                  v-for="(item,index) in marqueeList"
                  :key="index"
                  class="align-middle"
                >{{item}}</marquee-item>
              </marquee>
            </div>
            <div class="reward" @click="showReward">我的奖励</div>
          </div>
          <div class="top">
            <div class="inviter">
              <img :src="clientData.agentPhoto" alt>
              <span>邀请者</span>
            </div>
            <div class="invitee">
              <div class="list">
                <img
                  v-if="clientData.inviterPhotos.length >= 1"
                  :src="clientData.inviterPhotos[0]"
                  alt
                >
                <div v-else>?</div>
              </div>
              <div class="list">
                <img
                  v-if="clientData.inviterPhotos.length >= 2"
                  :src="clientData.inviterPhotos[1]"
                  alt
                >
                <div v-else>?</div>
              </div>
              <div class="list">
                <img
                  v-if="clientData.inviterPhotos.length >= 3"
                  :src="clientData.inviterPhotos[2]"
                  alt
                >
                <div v-else>?</div>
              </div>
            </div>
            <div class="inviterBtn">
              <div v-if="clientData.boxNumLeft == 0">开宝箱次数已用尽</div>
              <div v-else-if="clientData.canOpen == 0" @click="handleAction">邀请好友，不再等待</div>
              <div v-else @click="openChest">立即开启宝箱</div>
            </div>
            <div class="inviteeNum">{{clientData.boxMsg}}</div>
          </div>
          <div class="bottom">
            <div>1. 活动时间：2018年12月10日-2019年1月10日；</div>
            <div>2. 成功邀请3位保险人帮开宝箱，即可获得一次开宝箱机会；</div>
            <div>3. 每人每天仅限开3次宝箱；</div>
            <div>4. 开宝箱后就有机会获得苹果XS、优酷会员月卡、470元善诊免费体检卡、399元酒仙网红酒兑换券、保小秘7天会员卡、保小秘30天会员卡、10元话费、100M流量，100%中奖；</div>
            <div>5. 活动期间如有任何舞弊行为的用户，一经发现取消活动参与资格并追回奖励；</div>
            <div>6. 活动最终解释权归保小秘APP所有。</div>
          </div>
        </div>
      </base-scroll>
    </div>

    <!-- 我的奖励弹窗 -->
    <x-dialog v-model="showDialog">
      <div class="rewardTable">
        <div class="title">
          <img src="../../assets/imgs/reward.png" alt>
          <span>我的奖励</span>
          <img src="../../assets/imgs/reward.png" alt>
        </div>
        <table border="2" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <td>序号</td>
              <td>获取时间</td>
              <td>奖品</td>
            </tr>
          </thead>
          <tbody>
            <tr v-if="prizeList.length == 0">
              <td :colspan="3">暂未获得奖品</td>
            </tr>
            <tr v-else v-for="(item,index) in prizeList" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.createTime}}</td>
              <td>{{item.prizeName}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="cancle" @click="hideReward">
        <icon name="cancel" class="dt-icon cancel"></icon>
      </div>
    </x-dialog>
    <!-- 宝箱弹窗 -->
    <x-dialog v-model="showChest" hide-on-blur>
      <div class="chest">
        <img
          v-if="prizeBoxData.prizeCode == 1001"
          @click="exchangePrize(1)"
          src="../../assets/imgs/boxPrize1.png"
          alt
        >
        <img
          v-if="prizeBoxData.prizeCode == 1003"
          @click="exchangePrize(2)"
          src="../../assets/imgs/boxPrize3.png"
          alt
        >
        <img
          v-if="prizeBoxData.prizeCode == 1004"
          @click="exchangePrize(2)"
          src="../../assets/imgs/boxPrize4.png"
          alt
        >
        <img
          v-if="prizeBoxData.prizeCode == 1005"
          @click="exchangePrize(2)"
          src="../../assets/imgs/boxPrize5.png"
          alt
        >
        <div v-if="prizeBoxData.prizeCode == 1002" class="cdkey boxPrize2">
          <div class="text-desc">
            <span>兑换码为:</span>
            <div class="cdkey-text">{{prizeBoxData.redeemCode}}</div>
            <button @click="copyRedeemCode" ref="copy">一键复制</button>
          </div>
          <button @click="exchangePrize(1)">立即领取</button>
        </div>

        <div v-if="prizeBoxData.prizeCode == 1006" class="cdkey boxPrize6">
          <div class="text-desc">
            <span>兑换码为:</span>
            <div class="cdkey-text">{{prizeBoxData.redeemCode}}</div>
            <button @click="copyRedeemCode" ref="copy">一键复制</button>
          </div>
          <button @click="exchangePrize(1)">立即领取</button>
        </div>

        <div v-if="prizeBoxData.prizeCode == 1007" class="cdkey boxPrize7">
          <div class="text-desc">
            <span>兑换码为:</span>
            <div class="cdkey-text">{{prizeBoxData.redeemCode}}</div>
            <button @click="copyRedeemCode" ref="copy">一键复制</button>
          </div>
          <button @click="exchangePrize(1)">立即领取</button>
        </div>
        <img
          v-if="prizeBoxData.prizeCode == 1008"
          @click="exchangePrize(1)"
          src="../../assets/imgs/boxPrize8.png"
          alt
        >
        <img
          v-if="prizeBoxData.prizeCode == 1009"
          @click="exchangePrize(1)"
          src="../../assets/imgs/boxPrize9.png"
          alt
        >
      </div>
    </x-dialog>
  </div>
</template>
<script>
import api from "@/api/index";
import { XTable, XDialog, Marquee, MarqueeItem } from "vux";
import { wechatService } from "@/config/env";
import { getDevice } from "@/config/utils";
import DtHeader from "@/components/dtHeader";
import BaseScroll from "@/components/baseScroll";
export default {
  name: "activity",
  components: {
    XDialog,
    XTable,
    Marquee,
    MarqueeItem,
    DtHeader,
    BaseScroll
  },
  data() {
    return {
      copyBtn: null,
      device: getDevice(),
      clientData: {
        inviterPhotos: []
      },
      chest: true,
      showDialog: false,
      showChest: false,
      num: 0,
      id: "",
      prizeList: [],
      marqueeList: [],
      prizeBoxData: {}
    };
  },
  async created() {
    window.shareResult = function() {};
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    await this.initData();
    this.$nextTick(() => {
      this.showMarquee(this.num);
    });
  },
  methods: {
    // 初始化查询数据
    async initData() {
      let res = await api.myTreasure();
      if (res.status == 1) {
        this.clientData = res.data;
        this.marqueeList = res.data.rollMsg;
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    // get奖品数据
    async getPrizeData() {
      let result = await api.myPrize();
      if (result.status == 1) {
        if (result.data == null) {
          this.prizeList = [];
        } else {
          this.prizeList = result.data;
        }
      } else {
        this.$alert(result.msg);
        return;
      }
    },

    // 我的奖励
    showReward() {
      this.getPrizeData();
      this.showDialog = !this.showDialog;
    },
    hideReward() {
      this.showDialog = !this.showDialog;
    },
    // 跑马灯
    showMarquee(num) {
      let elHeight = this.$refs.message.offsetHeight;
      this.marqueeList.push(this.marqueeList[0]);
      var max = this.marqueeList.length;
      var that = this;
      let marqueetimer = setInterval(function() {
        num++;
        if (num >= max) {
          num = 0;
        }
        that.num = num * elHeight;
      }, 2000);
    },
    // 实例化复制组件
    instantiation() {
      this.copyBtn = new this.clipboard(this.$refs.copy, {
        text: trigger => {
          return this.prizeBoxData.redeemCode;
        }
      });
    },

    // 开启宝箱
    async openChest() {
      let res = await api.openBox();
      if (res.status == 1) {
        this.prizeBoxData = res.data;
        this.showChest = !this.showChest;
        this.$nextTick(() => {
          this.instantiation();
        });
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    //立即兑换
    exchangePrize(type) {
      console.log(this.prizeBoxData.prizeCode);
      if (type == 1) {
        let prizeBoxData = this.prizeBoxData;
        let device = this.device;
        let obj = {
          title: "奖品兑换",
          url: prizeBoxData.redeemUrl,
          type: 0 //内部，1外部
        };
        if (device == "android") {
          obj = JSON.stringify(obj);
          bmAndroid.openSpecialPage(obj);
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.openSpecialPage.postMessage(obj);
        }
      } else {
        this.showChest = !this.showChest;
      }
      this.initData();
    },
    // 邀请好友开宝箱
    async handleAction() {
      let res = await api.invitat();
      if (res.status == 1) {
        this.id = res.data.str;
      } else {
        this.$alert(res.msg);
        return;
      }
      let obj = {
        type: 3,
        title: "我正在保小秘开宝箱拿iPhone XS快来帮我~", //标题
        content: "送你288金豆，和我一起加入百万保险精英都在使用的获客神器吧！", //内容，副标题
        clickUrl: wechatService + "/activity?id=" + this.id, //链接
        pictureBase64:
          "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",
        pictureUrl: location.origin + "/static/img/activity.png"
      };
      this.$share(obj);
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
// .ios .activity {
//   padding-top: 0;
// }
// .iPhoneX .activity {
//   padding-top: 0;
// }
.activity {
  // padding-top: 0;
  // background: url("../../assets/imgs/activity-bg.png") no-repeat;
  background: url("../../assets/imgs/activity.png") no-repeat;
  background-size: 100%;

  .dt-header {
    background: none;
    .headerTop {
      background: none;
    }
  }

  .dt-content {
    // padding-bottom: 40px;
    position: relative;
    .scroll {
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0;
      width: 100%;
      overflow: hidden;
    }

    .suspend {
      width: 100%;
      position: absolute;
      top: 40px;
      display: flex;
      justify-content: space-between;
      color: #fff;
      .message {
        display: flex;
        align-items: center;
        overflow: hidden;
        width: 500px;
        padding-left: 10px;
        height: 60px;
        background: #8774e1;
        line-height: 60px;
        border-radius: 0 30px 30px 0;
        position: relative;
        .voiced {
          margin-right: 16px;
        }
        .vux-marquee {
          ul li {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .reward {
        margin-right: 30px;
        line-height: 60px;
        z-index: 100;
      }
    }
    .top {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 1334px;
      background: url("../../assets/imgs/activity-top.png") no-repeat;
      background-size: 100%;
      overflow: hidden;
      position: relative;
      z-index: 99;
      .inviter {
        text-align: center;
        position: absolute;
        top: 380px;
        left: 50%;
        transform: translateX(-50%);
        img {
          width: 76px;
          height: 76px;
          border-radius: 38px;
          background: #bbbbbb;
          border: 2px solid #ff9b53;
          position: relative;
          z-index: 9;
        }
        span {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 68px;
          width: 72px;
          height: 26px;
          line-height: 26px;
          background-color: #ece4d5;
          border-radius: 30px;
          font-size: 14px;
          letter-spacing: 0px;
          color: #7d6315;
        }
      }
      .invitee {
        display: flex;
        justify-content: center;
        position: absolute;
        top: 648px;
        left: 50%;
        transform: translateX(-50%);
        .list {
          div {
            width: 44px;
            height: 44px;
            border-radius: 22px;
            background: #e26c54;
            border: 2px dashed #fff;
            font-size: 18px;
            font-weight: 900;
            color: #fff;
            text-align: center;
            line-height: 44px;
            margin-right: 20px;
          }
          img {
            width: 44px;
            height: 44px;
            background: #bbbbbb;
            border-radius: 22px;
            margin-right: 20px;
          }
        }
      }
      .inviterBtn {
        position: absolute;
        top: 1128px;
        left: 50%;
        transform: translateX(-50%);
        width: 560px;
        text-align: center;
        font-size: 30px;
        font-weight: 900;
        color: #e13210;
        height: 86px;
        line-height: 100px;
      }
      .inviteeNum {
        position: absolute;
        top: 1240px;
        font-size: 24px;
        color: #fff;
        width: 100%;
        text-align: center;
      }
    }
    .bottom {
      // height: 800px;
      background: url("../../assets/imgs/activity-bottom.png") no-repeat;
      background-size: 100%;
      padding: 140px 58px 40px;
      font-size: 26px;
      line-height: 46px;
      color: #c6a9f4;
      z-index: 98;
    }
  }

  .weui-dialog {
    max-width: 0.96rem;
    width: 0.88rem;
    padding-top: 0.08rem;
    background: none;
    .cancle {
      position: absolute;
      top: 0;
      right: 0;
      .dt-icon {
        width: 30px;
        height: 30px;
      }
    }
  }
  .rewardTable {
    max-height: 814px;
    background: #372394;
    border-radius: 20px;
    color: #fff;
    padding: 0 30px 30px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .title {
      display: flex;
      justify-content: center;
      padding: 36px 0;
      span {
        margin: 0 30px;
      }
    }
    table tr td {
      border-color: #5d438b;
    }
    table {
      width: 100%;
      tr {
        height: 80px;
      }
      thead {
        background: #ebb239;
        color: #491a77;
      }
    }
  }
  .chest {
    margin: 0 auto;
    width: 500px;
    height: 710px;
    // background: url("../../assets/imgs/chest1.png") no-repeat;
    background-size: 100%;
    img {
      width: 100%;
    }
    .cdkey {
      width: 100%;
      height: 100%;
      background-color: red;
      position: relative;
      .text-desc {
        position: absolute;
        top: 510px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        font-size: 24px;
        letter-spacing: 0px;
        color: #fee94e;
        .cdkey-text {
          // width: 183px;
          padding: 0px 14px;
          height: 40px;
          line-height: 40px;
          margin: 0 10px;
          background-color: #f15c5c;
          border-radius: 20px;
          border: solid 2px #fbe238;
          font-size: 20px;
          letter-spacing: 0px;
          color: #fee94e;
        }
        button {
          background: none;
          font-size: 24px;
          letter-spacing: 0px;
          color: #ffffff;
        }
      }
      > button {
        width: 300px;
        height: 80px;
        line-height: 80px;
        background-color: #fbe238;
        border-radius: 40px;
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 0px;
        color: #f04b2a;
        position: absolute;
        top: 586px;
        left: 50%;
        transform: translateX(-50%);
        &:active {
          opacity: 0.7;
        }
      }
    }
    .boxPrize2 {
      background: url("../../assets/imgs/boxPrize2.png") no-repeat left top;
      background-size: 100%;
    }
    .boxPrize6 {
      background: url("../../assets/imgs/boxPrize6.png") no-repeat left top;
      background-size: 100%;
    }
    .boxPrize7 {
      background: url("../../assets/imgs/boxPrize7.png") no-repeat left top;
      background-size: 100%;
    }
  }
}
</style>
