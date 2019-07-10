<template>
  <div class="dt-pages trusteeship-list-page">
    <div class="dt-header">
      <dtHeader title="托管列表" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <div class="trusteeship-count">
        <div class="policy-n" @click="gotoPolicyList">
          <p>累计托管保单</p>
          <p class="number">
            <icon class="dt-icon icon-policy" name="policy"></icon>
            <countup :start-val="0" :end-val="policyCount" :duration="2"></countup>张
          </p>
        </div>
        <div class="family-n" @click="gotoFamilyList">
          <p>累计服务家庭</p>
          <p class="number">
            <icon class="dt-icon icon-family" name="family"></icon>
            <countup :start-val="0" :end-val="familyCount" :duration="2"></countup>个
          </p>
        </div>
      </div>
      <div class="trusteeship-list">
        <div class="list-top">
          <datetime format="YYYY-MM" :end-date="endDate" @on-change="selectDate">
            <span class="date">
              {{year}}年{{month}}月
              <icon name="downarrow" class="dt-icon"></icon>
            </span>
          </datetime>
          <span class="rank">{{agentSort}}</span>
        </div>
        <div class="list-item" :class="item.status" v-for="(item,index) in familyList" :key="index">
          <p>
            <span @click="gotoFamilyDetails(item)" class="tit">
              {{item.familyName}}的家庭
              <badge v-if="item.isNew == 1" class="badge"></badge>
            </span>
            <span>
              <icon name="leftarrow" class="dt-icon left-arrow"></icon>
            </span>
            <span v-if="item.text" class="family-status">{{item.text}}</span>
          </p>
          <p class="text">
            <span>
              <icon
                class="dt-icon icon-policy"
                name="policy"
                v-if="item.familyActionMo.actionType == 1"
              ></icon>
              <icon
                class="dt-icon icon-select"
                name="select1"
                v-if="item.familyActionMo.actionType == 2"
              ></icon>
              <icon class="dt-icon icon-del" name="del" v-if="item.familyActionMo.actionType == 3"></icon>
              {{item.familyActionMo.action}}
            </span>
            <span class="date">{{item.familyActionMo.actionTime}}</span>
          </p>
        </div>
        <Tips :tips="tipsText" @refresh="refresh" v-if="showTip"></Tips>
      </div>
    </div>
  </div>
</template>
<script>
import { Badge, Datetime, Countup } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import Tips from "@/components/tips";
import { getDevice } from "@/config/utils";
export default {
  name: "trusteeshipist",
  components: {
    dtHeader,
    Badge,
    Datetime,
    Countup,
    Tips
  },
  data() {
    return {
      device: getDevice(),
      year: "",
      month: "",
      monthText: "",
      endDate: "",
      familyCount: 0,
      policyCount: 0,
      familyList: [],
      agentSort: "",
      agentPolicyCount: 0,
      tipsText: "tips2",
      showTip: true
    };
  },
  created() {
    this.calendarEndDate();
    this.initData();
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  methods: {
    async initData() {
      let result = await api.findFamilyCount();
      if (result.status == 1) {
        if (result.data) {
          this.familyCount = result.data.number;
        }
      }
      this.getList();
      let agentSortResult = await api.findAgentSort();
      if (agentSortResult.status == 1) {
        if (agentSortResult.data) {
          this.agentSort = agentSortResult.data.agentSort;
        }
      }
      let policyCountResult = await api.findAgentPolicyCount();
      if (policyCountResult.status == 1) {
        if (policyCountResult.data) {
          this.policyCount = policyCountResult.data.number;
        }
      }
    },
    refresh() {
      this.initData();
    },
    async getList() {
      this.tipsText = "";
      this.showTip = false;
      let listResult = await api.findTrusteeshipList({
        date: this.year + "-" + this.monthText
      });
      if (listResult.status == 1) {
        if (listResult.data) {
          let familyList = listResult.data;
          for (let i = 0; i < familyList.length; i++) {
            if (familyList[i].familyActionMo.trusteeshipType == 1) {
              familyList[i].status = "status1";
              familyList[i].text = "客户已托管";
            } else if (familyList[i].familyActionMo.trusteeshipType == 2) {
              familyList[i].status = "status2";
              familyList[i].text = "托管失败";
            } else if (familyList[i].familyActionMo.trusteeshipType == 3) {
              familyList[i].status = "status3";
              familyList[i].text = "托管等待中";
            } else if (familyList[i].familyActionMo.trusteeshipType == 4) {
              familyList.splice(i, 1);
              i--;
            }
          }
          if (familyList.length == 0) {
            this.tipsText = "tips2";
            this.showTip = true;
          }
          this.familyList = familyList;
        } else {
          this.familyList = [];
          this.tipsText = "tips2";
          this.showTip = true;
        }
      } else {
        if (listResult.type) {
          this.tipsText = "tips1";
          this.showTip = true;
        }
        this.$alert(listResult.msg);
        return false;
      }
    },
    gotoPolicyList() {
      this.$router.push({
        path: "/policyTotal",
        query: {
          orderId: this.orderId,
          companyId: this.companyId
        }
      });
    },
    calendarEndDate() {
      var date = new Date();
      var month = parseInt(date.getMonth()) + 1;
      var day = date.getDate();
      var monthText = month;
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var newdate = date.getFullYear() + "-" + month + "-" + day;
      this.year = date.getFullYear();
      this.month = monthText;
      this.monthText = month;
      this.endDate = newdate;
    },
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
    },
    selectDate(value) {
      let date = value.split("-");
      let month = date[1];
      this.year = date[0];
      if (month < 10) {
        this.month = month.substring(1, 2);
      } else {
        this.month = month;
      }
      this.monthText = month;
      this.getList();
    },
    gotoFamilyList() {
      this.$router.push({
        path: "/familyListIndex"
      });
    },
    async gotoFamilyDetails(item) {
      let result = await api.updatefamilyReadStatus({
        familyId: item.familyActionMo.familyId,
        isRead: 1
      });
      this.$router.push({
        path: "/familyDetails",
        query: {
          familyId: item.familyActionMo.familyId,
          actionType: item.familyActionMo.actionType,
          policyNum: item.policyNum
        }
      });
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

.trusteeship-list-page {
  background: #f8f8f8;
  color: #222;
  font-size: 28px;
  .dt-content {
    overflow: auto;
    padding-bottom: 30px;
    -webkit-overflow-scrolling: touch;
  }
  .trusteeship-count {
    margin-top: 22px;
    font-size: 34px;
    font-weight: 400;
    padding: 0 2.8%;
    overflow: hidden;
    .family-n,
    .policy-n {
      height: 150px;
      padding: 20px 0;
      width: 48.5%;
      float: left;
      background: #fff;
      border-radius: 10px;
      p {
        width: 220px;
        margin: 0 auto;
        line-height: 55px;
      }
    }
    .family-n {
      margin-left: 3%;
    }
    .dt-icon {
      color: #28c76a;
      position: relative;
      top: -5px;
      margin-right: 10px;
    }
    .number {
      color: #28c76a;
    }
    .icon-family {
      width: 52px;
      height: 52px;
    }
    .icon-policy {
      width: 46px;
      height: 46px;
    }
  }
  .trusteeship-list {
    margin-top: 20px;
    .list-top {
      border-top: 2px #dfdfdf solid;
      height: 88px;
      line-height: 88px;
      border-bottom: 2px #dfdfdf solid;
      background: #fff;
      padding: 0 26px;
      font-size: 30px;
      overflow: hidden;
      .weui-cell {
        float: left;
        padding: 0;
      }
      .date {
        float: left;
        color: #000;
        .dt-icon {
          color: #a5a3a3;
          position: relative;
          top: -4px;
          margin-left: 15px;
        }
      }
      .rank {
        float: right;
        color: #919090;
      }
    }
    .list-item {
      margin: 20px 2.8% 0;
      background: #ffffff;
      border-radius: 10px;
      padding: 20px 9px;
      position: relative;
      p {
        padding: 0 10px;
      }
      .text {
        border-top: 2px #dedede solid;
        margin-top: 30px;
        padding-top: 30px;
        color: #666;
        overflow: hidden;
        .date {
          color: #999;
          float: right;
        }
        .dt-icon {
          margin-right: 10px;
          color: #666;
          position: relative;
          left: -2px;
          top: -4px;
        }
        .icon-del {
          width: 32px;
          height: 32px;
          padding-right: 2px;
          left: 0;
          top: -4px;
        }
      }
      .tit {
        font-size: 36px;
        font-weight: 600;
        line-height: 70px;
        position: relative;
      }
      .family-status {
        position: absolute;
        right: 0;
        top: 23px;
        width: 180px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-radius: 25px 0 0 25px;
        color: #fff;
      }
      .left-arrow {
        color: #a5a3a3;
        position: relative;
        top: -4px;
      }
      .badge {
        position: absolute;
        top: -3px;
        right: 2px;
        width: 14px;
        height: 14px;
        padding: 0;
      }
      .icon-select {
        position: relative;
        top: -1px;
      }
      .icon-policy {
        top: -1px;
      }
      .icon-select {
        width: 30px;
        height: 30px;
        margin-left: 6px;
      }
    }
    .status1 {
      background: #effef5;
      border: 2px #d1fde3 solid;
      .family-status {
        background: #28c76a;
      }
    }
    .status2 {
      background: #fff;
      border: 2px #fff solid;
      .family-status {
        background: #cccccc;
      }
    }
    .status3 {
      background: #fef7ef;
      border: 2px #feefcb solid;
      .family-status {
        background: #feb200;
        width: 190px;
      }
    }
  }
}
</style>
