<template>
  <div class="dt-pages policy-total-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader
        title="全部保单"
        :titleIcon="titleIcon"
        @headerCenter="openTotalList"
        :leftBack="false"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div class="dt-content">
      <search-item
        @input="search"
        @clear="clear"
        placeholder="搜索投保人、被保人、险种名称"
        v-model="searchValue"
      ></search-item>
      <div class="total-list" id="vux_view_box_body">
        <div class="total-list-content">
          <dtScroll
            ref="wrap"
            class="wrapper"
            :pullup="isMore"
            :data="totalList"
            :pulldown="true"
            @scrollToEnd="scrollToEnd"
            @pulldown="pulldown"
          >
            <div class="total-list-wrap">
              <swipeout>
                <swipeout-item v-for="(item,index) in totalList" :key="index">
                  <div slot="right-menu">
                    <swipeout-button
                      :width="60"
                      @click.native="deletePolicy(item,index)"
                      type="warn"
                    >删除</swipeout-button>
                  </div>
                  <div slot="content">
                    <div class="total-item" @click="openDetails(item)">
                      <dl>
                        <dd class="tit">{{item.productName}}</dd>
                        <dd>总保费：{{item.premium}}元/{{item.chargePeriodType}}</dd>
                        <dd>生效日期：{{item.effectiveStartDate}}</dd>
                        <dd class="insured-content">
                          <span>投保人：</span>
                          <span class="insureName">{{item.insurerAlias}}</span>
                          <span class="insuredName">被保人：</span>
                          <span class="insuredList">{{item.insuredAliases}}</span>
                        </dd>
                        <dt>
                          <img
                            :src="item.companyLogoName"
                            :title="item.companyName"
                            :alt="item.companyName"
                          >
                        </dt>
                      </dl>
                      <p class="tags">
                        <span v-for="(tag,tindex) in item.labelNames" :key="tindex">
                          <i v-if="tindex%3 == 0" class="status1">{{tag}}</i>
                          <i v-if="tindex%3 == 1" class="status2">{{tag}}</i>
                          <i v-if="tindex%3 == 2" class="status3">{{tag}}</i>
                        </span>
                      </p>
                    </div>
                  </div>
                </swipeout-item>
              </swipeout>
            </div>
          </dtScroll>
        </div>
      </div>
      <Tips :tips="tipsText" @refresh="refresh" v-if="showTip"></Tips>
    </div>
    <div
      class="popupMenu"
      :class="menuListStatus ? 'upMenu':'downMenu'"
      :style="{'top':headerHeight+'px'}"
    >
      <div class="title">险种类别 (单选)</div>
      <div class="list">
        <span
          @click="selectPolicy(item.securityTypeCode)"
          :class="item.securityTypeCode == currentId ? 'current':''"
          v-for="(item,index) in menus"
          :key="index"
        >{{item.securityTypeName}}</span>
      </div>
    </div>
    <div class="dt-footer">
      <flexbox :gutter="0">
        <flexbox-item align="center">
          <div class="dt-btn-box fz30">
            <div class="add-policy" @click="addPolicy">添加保单</div>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
    <addPolicyPopup
      :totalStatus="totalDialog"
      :policyStatus="policyPrompt"
      @popupConfirm="confirm"
      @popupCancel="cancel"
    ></addPolicyPopup>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem,
  Swipeout,
  CheckIcon,
  SwipeoutItem,
  SwipeoutButton,
  XImg
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import SearchItem from "@/components/searchItem";
import dtScroll from "@/components/dtScroll";
import addPolicyPopup from "@/components/addPolicyPopup";
import Tips from "@/components/tips";
import { getDevice } from "@/config/utils";

export default {
  name: "trusteeshipTotal",
  components: {
    Flexbox,
    FlexboxItem,
    dtHeader,
    SearchItem,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    dtScroll,
    CheckIcon,
    addPolicyPopup,
    Tips,
    XImg
  },
  data() {
    return {
      device: getDevice(),
      searchValue: "",
      menuListStatus: false,
      totalDialog: false,
      titleIcon: "downarrow",
      headerHeight: "",
      currentId: "",
      page: 1,
      pageSize: 10,
      total: "",
      isMore: true, //是否还有更多
      scanning: false,
      entrypolicy: false,
      policyPrompt: false, //录入保单方式弹框
      menus: [],
      totalList: [],
      content: "",
      tipsText: "",
      showTip: false
    };
  },
  created() {
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  mounted() {
    this.headerHeight = this.$refs.topInfo.offsetHeight;
  },
  watch: {
    scanning() {
      if (this.scanning) {
        this.entrypolicy = false;
      }
    },
    entrypolicy() {
      if (this.entrypolicy) {
        this.scanning = false;
      }
    }
  },
  methods: {
    async initData() {
      this.showTip = false;
      this.tipsText = "";
      let insuranceTypeResult = await api.findInsuranceType();
      if (insuranceTypeResult.status == 1) {
        if (insuranceTypeResult.data) {
          this.menus = insuranceTypeResult.data;
        }
        this.menus;
      } else {
        this.$alert(insuranceTypeResult.msg);
        return false;
      }
      this.getList();
    },
    refresh() {
      this.initData();
    },
    goBack() {
      let device = this.device;
      let from = this.$route.query.from;
      if (from) {
        if (device == "android") {
          bmAndroid.goHomePage();
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.goHomePage.postMessage(null);
        }
      } else {
        this.$router.go(-1);
      }
    },
    search() {
      let searchValue = this.searchValue;
      this.page = 1;
      this.content = searchValue;
      if (searchValue) {
        this.getList("0");
      } else {
        this.page = 1;
        this.getList("0");
      }
    },
    addPolicy() {
      // this.totalDialog = true;
      // this.policyPrompt = true;
      this.confirm();
    },
    async deletePolicy(item, index) {
      let totalList = this.totalList;
      let $this = this;
      this.$confirm({
        title: "",
        content: "您确定要删除？",
        async onConfirm() {
          let result = await api.deletePolicyById({
            id: item.policyId
          });
          if (result.status == 1) {
            totalList.splice(index, 1);
          } else {
            $this.$alert(result.msg);
            return false;
          }
        }
      });
    },
    openDetails(item) {
      //清缓存
      this.$store.commit("clearCacheByName", "policyDetails");
      setTimeout(() => {
        this.$store.commit("setCacheByName", "policyDetails");
      }, 200);
      this.$store.state.policyMakeFrom = "tatalList";
      this.$router.push({
        path: "/policyDetails",
        query: {
          detailPolicyId: item.policyId,
          type: "tatalList"
        }
      });
    },
    openTotalList() {
      let menuListStatus = this.menuListStatus;
      let totalDialog = this.totalDialog;
      this.menuListStatus = !menuListStatus;
      this.totalDialog = !totalDialog;
      if (this.menuListStatus) {
        this.titleIcon = "uparrow";
      } else {
        this.titleIcon = "downarrow";
      }
    },
    selectPolicy(id) {
      let menuListStatus = this.menuListStatus;
      let totalDialog = this.totalDialog;
      this.menuListStatus = !menuListStatus;
      this.totalDialog = !totalDialog;
      if (this.currentId == id) {
        this.currentId = "";
      } else {
        this.currentId = id;
        this.getList("0");
      }
    },
    //下拉刷新加载
    pulldown() {
      this.page = 1;
      this.getList("0");
    },
    //触底加载更多
    scrollToEnd() {
      if (this.isMore == true) {
        //this.$vux.loading.show();
        this.page++;
        setTimeout(() => this.getList("1"), 200);
      }
    },
    async getList(status) {
      this.showTip = false;
      this.tipsText = "";
      let policyListResult = await api.findPolicyList({
        pageNum: this.page,
        pageSize: this.pageSize,
        content: this.content,
        productType: this.currentId
      });
      if (policyListResult.status == 1) {
        if (policyListResult.data) {
          if (status == "0") {
            this.totalList = policyListResult.data;
          } else {
            this.totalList = this.totalList.concat(policyListResult.data);
          }
          this.total = policyListResult.page.total;
          let total = Math.ceil(this.total / this.pageSize);
          if (this.page >= total) {
            this.isMore = false;
          }
        } else {
          this.totalList = [];
          this.tipsText = "tips2";
          this.showTip = true;
        }
      } else {
        if (policyListResult.type) {
          this.tipsText = "tips1";
          this.showTip = true;
        } else {
          this.$alert(policyListResult.msg);
          return false;
        }
      }
    },
    confirm(obj) {
      // let scanning = obj.scanning;
      // let entrypolicy = obj.entrypolicy;
      // if (entrypolicy) {
      //清缓存
      this.$store.commit("clearCacheArr");
      setTimeout(() => {
        this.$store.commit("setCacheArr");
      }, 200);
      this.$store.state.policyId = null;
      this.$store.state.entryMode = 0;
      this.$store.state.policyMakeFrom = "total";
      this.$router.push({
        path: "/policyMake",
        query: {
          from: "popup"
        }
      });
      // }
    },
    cancel() {
      let policyPrompt = this.policyPrompt;
      if (policyPrompt) {
        this.totalDialog = false;
        this.policyPrompt = false;
      }
    },
    // 搜索清除
    clear(v) {
      this.searchValue = v;
      if (this.searchValue) {
        this.showTip = false;
      } else {
        this.showTip = true;
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

.policy-total-page {
  background: #f8f8f8;
  .dt-header {
    z-index: 1001;
  }
  .dt-content {
    padding: 0 20px;
    overflow: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
    .searchItem {
      padding: 10px 20px 15px 20px;
      height: auto;
      .serarch-text-container {
        .search-text {
          background: #fff;
          font-size: 32px;
          height: 88px;
          padding-left: 50px;
        }
        .search-icon {
          width: 48px;
          height: 48px;
          margin: 16px 35px 0 0;
          background: url(../../assets/imgs/sousuo.png) no-repeat;
          background-size: 100% 100%;
        }
        .xIcon {
          display: none;
        }
      }
    }
    .total-list {
      padding-bottom: 170px;
      position: absolute;
      top: 130px;
      left: 0;
      bottom: 0;
      .total-list-content {
        position: relative;
        height: 100%;
        width: 100%;
      }
      .total-list-wrap {
        height: 100%;
        width: 100%;
        overflow: auto;
      }
      .vux-swipeout-item {
        margin-bottom: 10px;
      }
      .total-item {
        background: #fff;
        padding: 30px 20px;
        color: #666666;
        border-radius: 20px;
        font-size: 28px;
        dl {
          overflow: hidden;
          position: relative;
          dt {
            position: absolute;
            right: 0;
            top: 0;
            img {
              max-width: 250px;
              max-height: 100px;
            }
          }
          dd {
            float: left;
            text-align: left;
            margin-left: 20px;
            margin-top: 15px;
            height: 32px;
            line-height: 32px;
            width: 70%;
          }
          .insured-content {
            width: 100%;
            overflow: hidden;
            span {
              float: left;
            }
            .insuredName {
              margin-left: 20px;
            }
            .insuredList {
              max-width: 300px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
            .insureName {
              max-width: 150px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
        .tit {
          margin-top: 0;
          color: #000;
          font-size: 30px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          max-width: 430px;
        }
        .tags {
          margin-top: 25px;
          span {
            margin-bottom: 25px;
            display: inline-block;
          }
          i {
            padding: 5px 18px;
            border-radius: 35px;
            margin-right: 13px;
            font-style: normal;
          }
          .status1 {
            color: #5b8ce4;
            border: 2px #5b8ce4 solid;
          }
          .status2 {
            color: #fddb4e;
            border: 2px #fddb4e solid;
          }
          .status3 {
            color: #28c76a;
            border: 2px #28c76a solid;
          }
        }
      }
    }
  }
  .popupMenu {
    position: fixed;
    top: 0;
    background: #fff;
    width: 100%;
    left: 0;
    padding: 25px;
    display: none;
    font-size: 28px;
    z-index: 1001;
    padding-bottom: 80px;
    .list {
      width: 106%;
      span {
        display: inline-block;
        width: 166px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        border: 2px #28c76a solid;
        color: #28c76a;
        border-radius: 25px;
        margin-right: 12px;
        margin-top: 25px;
      }
      .current {
        background: #54d288;
        color: #fff;
      }
    }
  }
  .upMenu {
    display: block;
  }
  .downMenu {
    display: none;
  }
  .dt-footer {
    padding-top: 30px;
    padding-bottom: 35px;
    background: #f8f8f8;
    .add-policy {
      background: #28c76a;
      margin: 0 30px;
      border-radius: 80px;
      color: #fff;
    }
  }
  .weui-dialog {
    display: none;
  }
}
</style>
