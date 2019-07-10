<template>
  <div class="dt-pages more-article">
    <div class="dt-header">
      <dtHeader title="更多文章" rightIcon="more1" :leftIcon="true" :leftBack="false" @headerLeft="goBack" @headerRight="showFilter"></dtHeader>
    </div>
    <div class="dt-content">
      <!-- 文章列表 -->
      <dtScroll ref="wrap" class="wrapper" :pullup="isMore" :data="articlesData" :pulldown="true" @scrollToEnd='scrollToEnd' @pulldown="pulldown">
        <articles :articlesData="articlesData" @toDetail="toDetail"></articles>
        <div class="bottom" v-if="!isMore">
          没有更多了~
        </div>
      </dtScroll>
      <Tips :tips="tipsText" @refresh="refresh" v-if="showTip"></Tips>
      <div class="total-dialog" v-if="show" @click="showFilter" @scroll.prevent  @touchmove.prevent></div>
      <div class="sort-dialog" v-if="show">
        <div class="sort">
            <div v-for="(item,index) in sortData" :class="sortId==item.id?'active':''" :id="item.id" :key="index" @click="getSort(item.id)">{{item.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dtHeader from "@/components/dtHeader";
import articles from "./article";
import { XDialog } from "vux";
import dtScroll from "@/components/dtScroll";
import Tips from "@/components/tips";
import api from "@/api/index";
import { getDevice } from "@/config/utils.js";
export default {
  name: "moreArticle",
  components: {
    dtHeader,
    articles,
    XDialog,
    Tips,
    dtScroll
  },
  data() {
    return {
      device: getDevice(),
      articlesData: [],
      show: false,
      sortData: [
        { id: 0, text: "最新" },
        { id: 1, text: "最热" },
        { id: 2, text: "默认排序" }
      ],
      showTip: false,
      tipsText: "",
      sortObj: {
        pageNum: 1,
        pageSize: 10,
        sort: ""
      },
      isMore: true,
      sortId: 2
    };
  },
  created() {
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
    this.getShotList(this.sortObj);
  },
  methods: {
    goBack() {
      let device = this.device;
      let from = this.$route.query.from;
      if (from) {
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
      } else {
        this.$router.go(-1);
      }
    },
    // 导航右侧更多按钮
    showFilter() {
      this.show = !this.show;
    },
    // 获取排序方式
    getSort(id) {
      let data = {};
      if (id == 0) {
        this.sortObj.sort = "createTime";
      }
      if (id == 1) {
        this.sortObj.sort = "visitNum";
      }
      if (id == 2) {
        this.sortObj.sort = "";
      }
      this.show = false;
      this.sortId = id;
      this.sortObj.pageNum = 1;
      this.getShotList(this.sortObj, "0");
    },
    //下拉刷新加载
    pulldown() {
      this.sortObj.pageNum = 0;
      this.getShotList(this.sortObj, "0");
    },
    //触底加载更多
    scrollToEnd() {
      if (this.isMore == true) {
        //this.$vux.loading.show();
        this.sortObj.pageNum++;
        setTimeout(() => this.getShotList(this.sortObj, "1"), 200);
      }
    },
    // 查询大咖分享列表
    async getShotList(data, status) {
      this.showTip = false;
      this.tips = "";
      let results = await api.getShotList(data);
      if (results.status == 1) {
        if (results.data) {
          if (status == "0") {
            this.articlesData = results.data;
          } else {
            this.articlesData = this.articlesData.concat(results.data);
          }
          let total = Math.ceil(results.page.total / data.pageSize);
          if (data.pageNum >= total) {
            this.isMore = false;
          }
          this.show = false;
        } else {
          this.tipsText = "tips2";
          this.showTip = true;
        }
      } else {
        this.$alert(results.msg);
        return false;
      }
    },
    refresh() {
      this.getShotList();
    },
    // 跳转详情页面
    toDetail(id) {
      this.$router.push({
        path: "/celebrity",
        query: { paicheNo: id, from: "list" }
      });
    }
  }
};
</script>
<style lang="less">
.more-article {
  .dt-content {
    position: relative;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .bottom {
      text-align: center;
      line-height: 60px;
      font-size: 22px;
      color: #999999;
    }
  }
  .iPhoneX {
    .weui-dialog {
      top: -1.35rem;
    }
  }
  .total-dialog {
    position: fixed;
    height: 100vh;
    width: 100%;
    background: #000;
    left: 0;
    top: 0;
    opacity: 0.5;
    z-index: 1000;
    bottom: 0;
  }
  .sort-dialog {
    position: absolute;
    right: 20px;
    top: 10px;
    width: 220px;
    height: 250px;
    background: url("../../assets/imgs/more.png") no-repeat;
    background-size: 100%;
    z-index: 9999;
    display: block;
    text-align: center;
  }
  .sort {
    padding: 10px 10px;
    color: #666;
    div {
      border-bottom: 1px solid #e8e8e8;
      line-height: 80px;
      height: 80px;
    }
    .active {
      color: #28c76a;
    }
    div:nth-child(3) {
      border: 0;
    }
  }
}
</style>

