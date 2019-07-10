<template>
  <div class="dt-pages company-list-page">
    <div class="dt-header">
      <dtHeader title="保险公司" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <search-item placeholder="请输入保险公司名称搜索" @clear="clear" @input="changeValue" v-model.trim="searchValue"></search-item>

      <div class="insurance-list" v-show="!searchStatus">
        <div class="index-list">
          <ul class="index-list-wrap" ref="indexWrap" @scroll="onListWrapScroll">
            <li v-for="(group,index) in companyList" :key="index" class="index-group" ref="indexGroup">
              <h3 class="index-group-title">{{group.companyFirstPin}}</h3>
              <ul>
                <li :style="item.companyId == companyId? 'background: #f2fff7': ''" @click="clickItem(item)" v-for="(item,index) in group.companyDetailMoList" :key="index" class="index-group-item">
                  <!-- <img :src="item.avatar" class="avatar" alt=""> -->
                  <span class="name">{{item.companyName}}</span>
                </li>
              </ul>
            </li>
          </ul>
          <div ref="navBox" class="index-nav">
            <ul>
              <li v-for="(item,index) in indexList" :key="index" @touchmove.stop="onTouchMoveIndex" @touchend="onTouchEnd" @click="onTouchStartIndex(index)" :data-index="index" class="nav-item" :class="{'active':currentIndex===index}">{{item}}</li>
            </ul>
          </div>
          <transition name="fade">
            <div class="index-indicator" v-show="moving">{{currentIndicator}}</div>
          </transition>
        </div>

      </div>
      <div class="search-list" v-show="searchStatus">
        <flexbox orient="vertical">
          <flexbox-item v-html="item.companyName" :style="item.companyId == companyId? 'background: #f2fff7': ''" @click.native="clickItem(item)" :span='12' v-for="(item,index) in searchList" :key="index">
          </flexbox-item>
          <tips v-if="searchList.length == 0" text="未找到相关保险公司" tips="tips10"></tips>
        </flexbox>
      </div>
    </div>
  </div>
</template>
<script>
const INDICATOR_INDURATION = 1000;
const TITLE_HEIGHT = 30;
import { Flexbox, FlexboxItem } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import tips from "@/components/tips";
import SearchItem from "@/components/searchItem";
export default {
  name: "companyList",
  components: {
    Flexbox,
    FlexboxItem,
    dtHeader,
    SearchItem,
    tips
  },
  data() {
    return {
      searchValue: "",
      searchStatus: false,
      companyList: [],
      currentIndex: 0,
      moving: false,
      currentIndicator: "",
      listHeight: [],
      companyNameList: [],
      searchList: [],
      companyId: ""
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.listHeight = [];
    this.timer = null;
    this.scrollTimer = null;
    this.initData();
  },
  activated() {
    this.companyId = this.$route.query.companyId;
  },
  mounted() {},
  watch: {
    currentIndex(newVal) {
      clearTimeout(this.timer);
      this.currentIndicator = this.indexList[this.currentIndex];
      this.moving = true;
      this.timer = setTimeout(() => {
        this.moving = false;
      }, INDICATOR_INDURATION);
    }
  },
  computed: {
    indexList() {
      return this.companyList.map(group => {
        return group.companyFirstPin.substring(0, 1);
      });
    }
  },

  methods: {
    async initData() {
      await this.getCompanyList();
      this.companyId = this.$route.query.companyId;
      this.regroup();
      this._calculateHeight();
    },
    async getCompanyList() {
      let from = this.$route.query.from;
      let res;
      if (from == "card") {
        res = await api.getCompanyAgentAll();
      } else {
        res = await api.companyList();
      }
      if (res.status == 1) {
        this.companyList = res.data;
      } else {
        this.$alert(res.msg);
      }
    },
    regroup() {
      for (let item of this.companyList) {
        for (let temp of item.companyDetailMoList) {
          this.companyNameList.push(temp);
        }
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    async search() {
      this.searchList = [];
      let searchValue = this.searchValue;
      if (searchValue) {
        this.searchStatus = true;
      } else {
        this.searchStatus = false;
      }
      let from = this.$route.query.from;
      if (searchValue != "") {
        let res;
        if (from == "card") {
          res = await api.searchCompanyAgent({
            name: searchValue
          });
        } else {
          res = await api.companyListSearch({
            name: searchValue
          });
        }
        if (res.status == 1) {
          if (res.data == null) {
            this.searchList = [];
          } else {
            this.searchList = res.data;
          }
        } else {
          this.$alert(res.msg);
          return;
        }
      }
    },
    changeValue() {
      let searchValue = this.searchValue;
      this.search();
      if (searchValue == "") {
        this.searchStatus = false;
      }
    },
    onListWrapScroll(e) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        let scrollTop = this.$refs.indexWrap.scrollTop;
        const listHeight = this.listHeight;
        for (let i = 0; i < listHeight.length - 1; i++) {
          if (
            scrollTop <= listHeight[i + 1] - TITLE_HEIGHT &&
            scrollTop >= listHeight[i]
          ) {
            this.currentIndex = i;
            return;
          }
        }
      }, 20);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.indexGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    onTouchStartIndex(index) {
      //   console.log(index);
      this.currentIndex = index;
      this.$refs.indexWrap.scrollTop = this.listHeight[index];
    },
    onTouchMoveIndex(e) {
      let navBox = this.$refs.navBox;
      navBox.className = "index-nav index-nav-move";
      let x = e.changedTouches[0].clientX;
      let y = e.changedTouches[0].clientY;
      let target = window.document.elementFromPoint(x, y);
      let index = Number(target.getAttribute("data-index"));
      this.currentIndex = index;
      this.$refs.indexWrap.scrollTop = this.listHeight[index];
    },
    onTouchEnd() {
      let navBox = this.$refs.navBox;
      navBox.className = "index-nav";
    },
    clickItem(item) {
      this.$store.state.company = item;
      let from = this.$route.query.from;
      if (from == "policyMake") {
        this.$router.go(-1);
      } else if (from == "card") {
        this.$router.go(-1);
      }
    },
    // 搜索清除
    clear(v) {
      this.searchValue = v;
      if (this.searchValue) {
        this.searchStatus = true;
      } else {
        this.searchStatus = false;
      }
    }
  }
};
</script>
<style lang="less">
@import "../../styles/mixin";
// 注意：在rootValue = 750px的设计稿中
// 现在 title cell 的高度为125
// 普通cell的高度为100
@dt-bbbbbb: #bbbbbb;
@dt-f9545: #f95454;
@dt-ffffff: #ffffff;
@dt-iconcolor: #dedede;

.company-list-page {
  background: #fff;
  color: #222;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    em {
      color: #f00;
      font-style: normal;
    }
    .searchItem {
      padding: 15px 25px 25px 25px;
      background: #f2f2f2;
      height: auto;
      .serarch-text-container {
        .search-text {
          background: #fff;
          font-size: 32px;
          height: 88px;
          border-radius: 50px;
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

    .insurance-list {
      // margin: 0 30px;
      // padding-top: 15px;
      position: absolute;
      top: 120px;
      bottom: 0;
      width: 100%;

      .index-list {
        position: relative;
        width: 100%;
        height: 100%;
        background: #fff;
        .index-list-wrap {
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          .index-group {
            h3 {
              font-size: 32px;
              color: #222;
              background-color: #f2f2f2;
              line-height: 58px;
              font-weight: normal;
              padding-left: 22px;
            }
            > ul {
              // padding: 0 30px;
              font-size: 32px;
              line-height: 36px;
              color: #222;
              > li {
                // padding: 0 30px;
                margin: 0 30px;
                height: 100px;
                line-height: 100px;
                border-bottom: 2px solid #dedede;
                &:last-of-type {
                  border-bottom: none;
                }
                &:active {
                  background-color: rgba(0, 0, 0, 0.1);
                }
              }
            }
          }
        }
      }
    }
    .search-list {
      position: absolute;
      top: 120px;
      bottom: 0;
      width: 100%;
      padding: 30px 0 0;
      box-sizing: border-box;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      font-size: 32px;
      .vux-flexbox {
        padding: 0 15px;
        .vux-flexbox-item {
          height: 50px;
          line-height: 50px;
          // font-size: 16px;
          // padding: 0px 15px;
          margin-top: 0 !important;
          color: #222;
          border-bottom: 1px #dedede solid;
          &:active {
            background-color: rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }

  .index-nav {
    position: absolute;
    right: 0px;
    top: 50%;
    z-index: 100;
    width: 50px;
    padding: 20px 0;
    text-align: center;
    border-radius: 10;
    background: transparent;
    transform: translateY(-50%);
    &:active {
      background: rgba(0, 0, 0, 0.2);
    }

    .nav-item {
      padding: 3px;
      font-size: 32px;
      color: #555;
      list-style: none;

      &.active {
        color: #0cc30e;
      }
    }
  }

  .index-nav-move {
    background: rgba(0, 0, 0, 0.2);
  }

  .index-indicator {
    position: absolute;
    width: 80px;
    height: 80px;
    line-height: 80px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 40px;
    border-radius: 14px;
    pointer-events: none;
  }

  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
