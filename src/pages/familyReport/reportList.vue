<template>
  <div class="dt-pages fixed-bottom family-reports-page">
    <div class="dt-header">
      <dt-header :title="familyName" :leftBack="false" @headerLeft="goBack"></dt-header>
    </div>
    <div class="dt-content has-footer">
      <base-scroll :data="list" class="scroll">
        <swipeout class="policy-list">
          <swipeout-item ref="item" :auto-close-on-button-click="true" @click.native="gotoHistoryReport(policy, index)" :key="index" class="policy-list-item" v-for="(policy, index) in list">
            <div slot="right-menu" class="swipeDelBtn">
              <swipeout-button @click.native.stop.prevent="handleDetailListItem(policy)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="content-wrapper">
              <div class="policy-info-item">
                <div class="item-main">
                  生成日期：
                  <span class="minor">{{policy.creatDate}}</span>
                </div>
              </div>
              <div class="policy-info-item">
                <div class="item-main">
                  保单数量： {{policy.policyNumber}}张
                  <span class="minor">保单</span>
                </div>
              </div>
              <div class="policy-info-item">
                <div class="item-main">
                  成员数量： {{policy.familyNumber}}位
                  <span class="minor">家庭成员</span>
                </div>
                <div :class="policy.readFlag? 'readed': 'noRead'" class="item-minor">{{policy.readFlag? `已阅读${policy.readMany}次`: '未阅读'}}</div>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
      </base-scroll>
      <Tips :tips="tipsText" @refresh="refresh" v-if="showTip"></Tips>
    </div>
    <div class="dt-footer">
      <dt-button :disabled="this.$route.query.policyNum == 0" :style="{'opacity': this.$route.query.policyNum == 0?'0.6':'1'}" :text="btnText" @click="reBuildReport"></dt-button>
    </div>
  </div>
</template>

<script>
import { XButton, Swipeout, SwipeoutItem, SwipeoutButton } from "vux";
import DtHeader from "@/components/dtHeader";
import BaseScroll from "@/components/baseScroll";
import DtButton from "@/components/dtButton";
import api from "@/api";
import { formartDate, getDevice } from "@/config/utils";
import Tips from "@/components/tips";
export default {
  components: {
    XButton,
    DtHeader,
    BaseScroll,
    DtButton,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Tips
  },
  data() {
    return {
      device: getDevice(),
      familyId: null,
      list: [],
      btnText: "重新生成报告",
      pageNum: 1,
      pageSize: 10,
      familyName: "",
      tipsText: "",
      showTip: false
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.familyName = this.$route.query.familyName + "的家庭报告";
    this.familyId = this.$route.query.familyId;
    if (!this.familyId) {
      this.$alert("家庭id不存在");
      return false;
    }
    this.initData();
  },
  activated() {},
  methods: {
    initData() {
      // this.getFamilyInfo();
      this.getFamilyReportList();
    },
    refresh() {
      this.initData();
    },
    async getFamilyReportList() {
      const res = await api.getFamilyReportList({
        familyId: this.familyId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      if (res.status === 1) {
        if (res.data) {
          this.list = [];
          res.data.forEach((item, index) => {
            this.list.push({
              // creatDate: formartDate(item.creatDate),
              creatDate: item.creatDate,
              policyNumber: item.policyNumber,
              familyNumber: item.familyNumber,
              readFlag: item.readFlag === "Y" ? true : false,
              readMany: item.readMany,
              familyId: item.familyId,
              reportId: item.reportId
            });
          });
        } else {
          this.list = [];
          this.tipsText = "tips2";
          this.showTip = true;
        }
      } else {
        this.$toast(res.msg);
        return;
      }
    },
    /**
     * 跳转详情
     * @param item 详情
     */
    gotoHistoryReport(item, index) {
      this.$router.push({
        path: "/reportSimpleHistory",
        query: {
          reportId: item.reportId
        }
      });
    },
    // 重新生成报告
    async reBuildReport() {
      let res = await api.shortReportUpdate({
        familyId: this.familyId,
        flag: "Y"
      });
      if (res.status == 1) {
        let result = await api.saveFamilyReport({
          familyId: this.familyId
        });
        if (result.status == 1) {
          this.$router.push({
            path: "/reportSimple",
            query: {
              familyId: this.familyId
            }
          });
        } else if (result.status == 4) {
          this.$confirm({
            content: "此功能需要开通会员",
            confirmText: "购买",
            onConfirm: () => {
              this.buyMembers();
            }
          });
        } else {
          this.$alert(result.msg);
        }
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    async handleDetailListItem(v) {
      this.$confirm({
        content: "确定删除此条报告记录吗？",
        onConfirm: async () => {
          let res = await api.familyReportListDelete({
            familyId: this.familyId,
            reportId: v.reportId
          });
          if (res.status == 1) {
            this.initData();
          } else {
            this.$alert(res.msg);
            return;
          }
        }
      });
    },
    // 去购买会员
    buyMembers() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.gotoAppPage(4);
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.gotoAppPage.postMessage(4);
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="less">
@import "../../styles/mixin";

.family-reports-page {
  .dt-content {
    position: relative;
    .scroll {
      position: absolute;
      top: 0;
      bottom: 120px;
      left: 0;
      width: 100%;
      overflow: hidden;
    }
  }
  .policy-list {
    /*height: calc(100% - 140px);*/
    padding: 0 20px 20px;
    .policy-list-item {
      box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.06);
      margin: 20px 0;
      background: #fff;
      /*padding: 20px;*/
      .active-bg(0.7);
      &:active {
        background: #eee;
      }
      /*opacity: .7;*/
      .policy-info-item {
        display: flex;
        margin-top: 18px;
        .item-main {
          font-size: 30px;
          color: #333;
          flex: 1;
          .minor {
            color: #666;
            font-size: 28px;
          }
        }
        .item-minor {
          font-size: 28px;
          &.readed {
            color: #999;
          }
          &.noRead {
            color: #666;
          }
        }
      }
      .content-wrapper {
        padding: 20px;
      }
    }
  }
  .dt-footer {
    background: #f5f5f5;
    padding: 20px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
