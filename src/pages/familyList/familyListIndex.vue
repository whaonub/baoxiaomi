<template>
  <div class="dt-pages family-List-Index">
    <div class="dt-header">
      <div class="headerTop">
        <div class="page-title vux-1px-b">
          <div @click="backs" class="back-icon head-item">
            <span class="back-img"></span>
          </div>
          <div class="head-item search-item">
            <form action=".">
              <input
                class="search-input"
                @input="searchChange"
                ref="searchDom"
                type="search"
                v-model="familyListParam.inputValue"
                placeholder="请输入姓名或手机号"
              >
              <!-- 添加隐藏域，阻止移动端搜索刷新页面bug -->
              <input type="text" style="display:none;">
            </form>
            <icon @click.native="initData" class="dt-icon search" name="search"></icon>
          </div>
          <span class="head-item add-family" @click="addFamily">
            <icon class="dt-icon peoples" name="peoples"></icon>
            <span class="add-family-text">添加家庭</span>
          </span>
        </div>
      </div>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="index-list index-list-content">
        <div v-if="noSearchData" class="all-wrap">
          <div class="tips">
            <img src="../../assets/imgs/noData.png" alt>
            <p class="noData">暂无数据</p>
          </div>
        </div>
        <dtScroll
          v-if="!noSearchData"
          ref="wrap"
          class="wrapper"
          :pullup="isMore"
          :data="familyList"
          :scrollX="true"
          :pulldown="true"
          @scrollToEnd="scrollToEnd"
          @pulldown="pulldown"
        >
          <ul class="index-list-wrap" ref="indexWrap">
            <li
              v-for="(item,index) in familyList"
              :key="index"
              class="index-group"
              ref="indexGroup"
            >
              <ul>
                <li class="index-group-item">
                  <ul style="width: 100%">
                    <li @click="familyBtn(item)">
                      <!-- <icon class="dt-icon house" name="house"></icon> -->
                      <img class="house" src="../../assets/imgs/icon-house.png" alt>
                      <div class="familys-parent">
                        <swiper class="swiper-box" :options="swiperOption" ref="mySwiper">
                          <swiper-slide
                            @click.native.stop="jumpFamilyCus(item,i)"
                            v-for="(v,i) in item.customerVoList"
                            :key="i"
                            class="swiper-item"
                            :class="v.trusteeshipType == 1?'family-main':'family-others'"
                          >{{v.customerAlias | formatName}}</swiper-slide>
                          <swiper-slide
                            @click.native.stop="addFamilyPeopleBtn(item)"
                            class="family-add"
                          >
                            <!-- <icon class="dt-icon add4" name="add4"></icon> -->
                            <img src="../../assets/imgs/icon-add-family.png" alt>
                          </swiper-slide>
                        </swiper>
                      </div>
                    </li>
                    <li class="two-data" @click="familyBtn(item)">
                      <span style="font-weight: 600">{{item.familyName}}的家庭</span>
                      <span class="guarantee">
                        <icon class="dt-icon file3" name="file3"></icon>
                        {{item.policyNum}}张保单
                      </span>
                    </li>
                    <li class="arrows-up-down">
                      <group class="drop-down-menu">
                        <p class="slide" :class="index == showIndex?'animate':''">
                          <flexbox>
                            <flexbox-item :class="{'no-policy':item.policyNum == 0}">
                              <div @click.stop="gotoFamilyReportList(item)" class="flex-demo">
                                <span>
                                  <!-- <icon class="dt-icon file1" name="file1"></icon> -->
                                  <img
                                    v-if="item.policyNum == 0"
                                    src="../../assets/imgs/familyList-report-icon2.png"
                                    alt
                                  >
                                  <img
                                    v-else
                                    src="../../assets/imgs/familyList-report-icon1.png"
                                    alt
                                  >
                                </span>
                                家庭报告
                              </div>
                            </flexbox-item>
                            <flexbox-item>
                              <div @click="gotoPolicyMake(item)" class="flex-demo">
                                <span>
                                  <!-- <icon class="dt-icon file2" name="file2"></icon> -->
                                  <img src="../../assets/imgs/familyList-policy-icon.png" alt>
                                </span>
                                添加保单
                              </div>
                            </flexbox-item>
                          </flexbox>
                        </p>
                      </group>
                      <ul id="navlist">
                        <li class="list1"></li>
                        <li class="list2">
                          <icon
                            @click.native.stop="arrowBtn(index)"
                            class="dt-icon arrows"
                            :name="index == showIndex?'arrows-up1':'arrows-down1'"
                          ></icon>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </dtScroll>
      </div>
    </div>
    <addPolicyPopup
      :totalStatus="totalDialog"
      :policyStatus="policyPrompt"
      @popupConfirm="confirmAddPolicy"
      @popupCancel="cancelAddPolicy"
    ></addPolicyPopup>
  </div>
</template>
<script>
import { Group, Flexbox, FlexboxItem, Datetime } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import dtScroll from "@/components/dtScroll";
import addPolicyPopup from "@/components/addPolicyPopup";
import { getDevice } from "@/config/utils";
export default {
  components: {
    Group,
    Flexbox,
    FlexboxItem,
    dtHeader,
    Datetime,
    dtScroll,
    addPolicyPopup
  },
  data() {
    return {
      device: getDevice(),
      swiperOption: {
        freeMode: false,
        spaceBetween: 10,
        slidesPerView: "auto",
        preventClicks: true,
        preventLinksPropagation: true
      },
      isMore: true, //是否还有更多
      select: null,
      familyList: [],
      searchValue: "",
      showContent: false,
      showIndex: null,
      familyListParam: {
        inputValue: "",
        pageNum: 1,
        pageSize: 10
      },
      noSearchData: false,
      totalDialog: false,
      policyPrompt: false,
      oldFamilyId: "",
      inputFlag: true
    };
  },
  created() {
    window.buttonReturn = () => {
      this.backs();
      return "buttonReturn";
    };
    this.initData();
  },
  mounted() {
    // 解决onInput事件中文输入法下多次触发事件
    this.$nextTick(() => {
      let searchDom = this.$refs.searchDom;
      searchDom.addEventListener("compositionstart", () => {
        this.inputFlag = false;
      });
      searchDom.addEventListener("compositionend", () => {
        this.inputFlag = true;
      });
    });
  },
  filters: {
    formatName(val) {
      if (val) {
        if (val.length > 2) {
          return val.substring(val.length - 2, val.length);
        } else {
          return val;
        }
      }
    }
  },
  methods: {
    // 初始化数据
    async initData() {
      this.familyListParam.pageNum = 1;
      let res = await api.familyList(this.familyListParam);
      this.familyList = res.data;
      if (res.data == null) {
        this.noSearchData = true;
      } else {
        this.noSearchData = false;
      }
    },
    // 返回
    backs() {
      if (
        this.$route.query.from == "reportSimple" ||
        this.$route.query.from == "editFamilyPeoples"
      ) {
        this.$router.push({
          path: "/trusteeshipList"
        });
      } else {
        this.$router.go(-1);
      }
    },
    // 添加家庭
    addFamily() {
      //清缓存
      this.$store.commit("clearCacheByName", "editFamilyPeoples");
      setTimeout(() => {
        this.$store.commit("setCacheByName", "editFamilyPeoples");
      }, 200);
      this.$router.push({
        path: "/editFamilyPeoples",
        query: {
          type: "add"
        }
      });
    },
    // 跳转家庭详情页
    familyBtn(v) {
      this.$router.push({
        path: "/familyDetails",
        query: {
          familyId: v.familyId,
          policyNum: v.policyNum
        }
      });
    },
    //下拉刷新加载
    pulldown() {
      this.familyList = [];
      this.isMore = true;
      this.initData();
    },
    //触底加载更多
    async scrollToEnd() {
      if (this.isMore) {
        // this.$vux.loading.show();
        this.familyListParam.pageNum++;
        let res = await api.familyList(this.familyListParam);
        if (res.data == null) {
          this.isMore = false;
          return;
        }
        this.familyList.push(...res.data);
      }
    },
    // 上下箭头展开更多
    arrowBtn(v) {
      // this.checkArr[v].check = !this.checkArr[v].check;
      if (this.showIndex == v) {
        this.showIndex = null;
        return;
      }
      this.showIndex = v;
    },
    // 跳转到点击的家庭成员
    jumpFamilyCus(v, i) {
      this.$router.push({
        path: "/familyDetails",
        query: {
          familyId: v.familyId,
          policyNum: v.policyNum,
          index: i
        }
      });
    },
    // 跳转编辑家庭成员页
    addFamilyPeopleBtn(v) {
      //清缓存
      this.$store.commit("clearCacheByName", "editFamilyPeoples");
      setTimeout(() => {
        this.$store.commit("setCacheByName", "editFamilyPeoples");
      }, 200);
      this.$router.push({
        path: "/editFamilyPeoples",
        query: {
          type: "edit",
          id: v.familyId
        }
      });
    },
    // 跳转报告列表页
    async gotoFamilyReportList(v) {
      if (v.policyNum == 0) {
        return;
      }
      let res = await api.effectiveFamily({
        id: v.familyId
      });
      if (res.status == 1) {
        if (res.data.number == 0) {
          this.$alert("该家庭无有效保单");
          return;
        }
      } else {
        this.$alert(res.msg);
        return;
      }
      this.reBuildReport(v);
    },
    // 重新生成报告
    async reBuildReport(v) {
      let res = await api.shortReportUpdate({
        familyId: v.familyId,
        flag: "Y"
      });
      if (res.status == 1) {
        let result = await api.saveFamilyReport({
          familyId: v.familyId
        });
        if (result.status == 1) {
          this.$router.push({
            path: "/reportSimple",
            query: {
              familyId: v.familyId
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
    // 去购买会员
    buyMembers() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.gotoAppPage(4);
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.gotoAppPage.postMessage(4);
      }
    },

    gotoPolicyMake(v) {
      this.oldFamilyId = v.familyId;
      this.confirmAddPolicy();
      // this.totalDialog = true;
      // this.policyPrompt = true;
    },
    cancelAddPolicy() {
      let policyPrompt = this.policyPrompt;
      if (policyPrompt) {
        this.totalDialog = false;
        this.policyPrompt = false;
      }
    },
    confirmAddPolicy(obj) {
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
      this.$store.state.policyMakeFrom = "familyListIndex";
      this.$router.push({
        path: "/policyMake",
        query: {
          from: "popup",
          oldFamilyId: this.oldFamilyId
        }
      });
      // }
    },
    // 搜索
    searchChange() {
      setTimeout(() => {
        if (this.inputFlag) {
          this.initData();
        }
      }, 0);
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

.family-List-Index {
  .all-wrap {
    overflow: hidden;
    text-align: center;
    padding-top: 50%;
    img {
      width: 260px;
    }
    .tips {
      margin-top: -120px;
    }
    p {
      font-size: 30px;
      color: #999;
    }
  }

  .dt-header {
    .headerTop {
      width: 100%;
      vertical-align: 88px;
      text-align: center;
      left: 0;
      top: 0;
      background: #28c76a;
      .title-name {
        text-align: center;
        font-weight: 700;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #fff;
      }
      .search-item {
        position: relative;
        .search-input {
          padding: 0 30px;
          padding-right: 60px;
          width: 540px;
          height: 60px;
          line-height: 58px;
          background-color: #ffffff;
          border-radius: 30px;
          border: 2px solid #ffffff;
          font-size: 28px;
        }
        .search {
          width: 37px;
          height: 38px;
          position: absolute;
          top: 12px;
          right: 20px;
          color: #bdbdbd;
          &:active {
            opacity: 0.7;
          }
        }
        // 重置search框内清除图标样式
        input[type="search"]::-webkit-search-cancel-button {
          -webkit-appearance: none;
          position: relative;
          height: 44px;
          width: 44px;
          border-radius: 50%;
          background: url("../../assets/imgs/clear.png") no-repeat;
          background-size: 100%;
          background-position: left bottom;
        }
      }
      .page-title {
        height: 88px;
        padding: 14px 0px;
        vertical-align: 88px;
        text-align: left;
        .head-item {
          display: inline-block;
        }
        .add-family {
          width: 100px;
          height: 56px;
          position: relative;
          text-align: center;
          vertical-align: middle;
          .peoples {
            color: #fff;
          }
          .add-family-text {
            line-height: 10px;
            display: block;
            font-size: 18px;
            letter-spacing: 1px;
            color: #fff;
          }
        }
      }
      .back-icon {
        margin-left: 30px;
        margin-right: 30px;
        vertical-align: middle;
        .back-img {
          margin-top: 10px;
          display: inline-block;
          width: 18px;
          height: 32px;
          background: url(../../assets/imgs/back.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      .rightIcon {
        color: #fff;
      }
    }
    .headerTop + div {
      margin-top: 88px;
    }
  }
  .index-list-content {
    // padding-top: 20px;
  }
  .dt-content {
    // padding: 0 2%;
    // padding-bottom: 100px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .weui-cells:before {
    border-top: none !important;
  }
  .weui-cells:after {
    border-bottom: none !important;
  }

  .index-list {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;

    .index-list-wrap {
      height: 100%;
      overflow: auto;
    }

    .index-group {
      padding-bottom: 30px;
      &:last-child {
        padding-bottom: 80px;
      }
    }
  }

  .index-group-item {
    display: flex;
    align-items: center;
    padding: 20px 0px 0 0px;
    list-style: none;
    > ul {
      > li:nth-child(1) {
        padding: 0 20px 0 46px;
        display: flex;
        align-items: center;
      }
      > li:nth-child(2) {
        padding: 0 20px 0 46px;
      }
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .name {
      margin-left: 20px;
      color: #555;
      font-size: 14px;
    }
  }

  .arrows-up-down {
    margin-top: -20px;
    .drop-down-menu {
      transform: translateY(8px);
      .no-policy {
        color: #ccc;
        span {
          background-color: #ccc;
        }
      }
    }
  }

  .house {
    width: 120px;
    height: 120px;
    vertical-align: middle;
    margin-right: 40px;
  }

  .familys-parent {
    vertical-align: middle;
    display: inline-block;
    width: 500px;
    overflow-x: auto;
    // padding-left: 5px;
    .swiper-box {
      width: 100%;
      height: 86px;
      .swiper-item {
        overflow: hidden;
        font-size: 28px;
        text-align: center;
        display: inline-block;
        width: 82px;
        height: 82px;
        line-height: 82px;
        border-radius: 50%;
        text-align: center;
      }
    }
  }

  .family-main {
    border: 2px solid #5bd48e;
    background-color: #5bd48e;
    color: #fff;
  }

  .family-others {
    border: 2px solid #5bd48e;
    background-color: transparent;
    color: #5bd48e;
  }

  .family-add {
    width: 82px;
    height: 82px;
    line-height: 82px;
    // border-radius: 50%;
    text-align: center;
    // border: 2px solid #ccc;
    background-color: transparent;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .two-data {
    margin-left: -10px;
    font-size: 30px;
    color: #333;
    .guarantee {
      padding-left: 20px;
      font-size: 28px;
      color: #232323;
      .file3 {
        vertical-align: sub;
        color: #232323;
      }
    }
  }

  .vux-no-group-title {
    background-color: transparent;
  }

  .slide {
    background-color: transparent;
    font-weight: 600;
    font-size: 30px;
    color: #666;
    padding: 0 20px;
    // overflow: hidden;
    max-height: 0;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
    .flex-demo {
      text-align: center;
      display: flex;
      justify-content: center;
      > span {
        margin-right: 6px;
      }
    }
    span {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background-color: #6881dd;
      img {
        width: 100%;
      }
      .dt-icon {
        width: 28px;
        height: 28px;
      }
    }
  }
  .animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }

  ul#navlist {
    font: 20px verdana;
    padding-bottom: 13px;
    position: relative;
  }

  ul#navlist li {
    float: left;
    height: 30px;
    border: 0px solid #e8e8e8;
    width: 100%;
  }
  ul#navlist .list1 {
    border-bottom: 2px solid #e8e8e8;
    width: 100%;
    margin-bottom: -15px;
  }

  ul#navlist .list2 {
    width: 60px;
    height: 60px;
    line-height: 60px;
    border: 2px solid #e8e8e8;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    box-shadow: 0px 3px 5px 0px rgba(103, 101, 101, 0.35);
    border: solid 2px #ffffff;
    .arrows {
      width: 70%;
      height: 70%;
      color: #999;
    }
  }
}
</style>
