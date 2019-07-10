<template>
  <div class="dt-pages exam-list-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader title="智能测需列表" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <search-item @input="search" @clear="clear" placeholder="请输入姓名" v-model="searchValue"></search-item>
      <div class="exam-list">
        <div class="exam-list-content">
          <dtScroll ref="wrap" class="wrapper" :pullup="isMore" :data="list" :pulldown="true" @scrollToEnd='scrollToEnd' @pulldown="pulldown">
            <div class="exam-list-wrap">
              <swipeout>
                <swipeout-item v-for="(item,index) in list" :key="index">
                  <div slot="right-menu">
                    <swipeout-button :width="60" @click.native="deleteItem(item,index)" type="warn">删除</swipeout-button>
                  </div>
                  <div slot="content">
                    <div class="exam-item">
                      <div class="exam-item-left">
                        <icon v-if="!item.photoUrl" class="dt-icon house" name="house"></icon>
                        <img v-if="item.photoUrl" class="exam-img" :src="item.photoUrl" />
                      </div>
                      <div class="exam-item-right">
                        <div class="info">
                          <p class="tit">
                            <span class="name">{{item.name}}{{!item.photoUrl?'的家庭':''}} <badge v-if="item.isRead == 0" class="badge"></badge></span>
                          </p>
                          <p>测需时间:{{item.updateTime}}</p>
                        </div>
                        <div class="operation">
                          <span @click="gotAnswer(item)" class="answer">查看答案</span>
                          <span @click="gotoFinally(item)" class="finally">测算结果</span>
                        </div>
                      </div>
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
  </div>
</template>
<script>
import { Badge, Swipeout, SwipeoutItem, SwipeoutButton } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import SearchItem from "@/components/searchItem";
import dtScroll from "@/components/dtScroll";
import Tips from "@/components/tips";
import { getDevice } from "@/config/utils";
export default {
  name: "examlist",
  components: {
    dtHeader,
    Badge,
    SearchItem,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    dtScroll,
    Tips
  },
  data() {
    return {
      device: getDevice(),
      searchValue: "",
      page: 0,
      pageSize: 10,
      isMore: true, //是否还有更多
      list: [],
      tipsText: "",
      showTip: false,
      total: ""
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.showTip = false;
      this.tipsText = "";
      this.getList("0");
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
      this.page = 0;
      this.searchValue = searchValue;
      if (searchValue) {
        this.getList("0");
      } else {
        this.page = 0;
        this.getList("0");
      }
    },
    gotAnswer(item) {
      let type = item.answerType;
      this.$router.push({
        path: "/lookAnswers",
        query: {
          answerResultId: item.answerResultId,
          recordId: item.recordId,
          name: item.name,
          type: type
        }
      });
    },
    gotoFinally(item) {
      let type = item.answerType;
      this.$router.push({
        path: "/optimizeResult",
        query: {
          scordId: item.scordId,
          type: type,
          recordId: item.recordId,
          name: item.name,
          shareId: item.shareId
        }
      });
    },
    async deleteItem(item, index) {
      let list = this.list;
      let $this = this;
      this.$confirm({
        title: "",
        content: "您确定要删除？",
        async onConfirm() {
          let reuslt = await api.deleteMeasureById({
            shareId: item.shareId,
            openId: item.openId
          });
          if (reuslt.status == 1) {
            list.splice(index, 1);
          } else {
            this.$alert(reuslt.msg);
            return false;
          }
        }
      });
    },
    //下拉刷新加载
    pulldown() {
      this.page = 0;
      this.getList("0");
    },
    // 搜索清除
    clear(v) {
      this.searchValue = v;
      if (this.searchValue) {
        this.showTip = false;
      } else {
        this.showTip = true;
      }
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
      this.tips = "";
      let reuslt = await api.getMeasureList({
        name: this.searchValue,
        pageNum: this.page,
        pageSize: this.pageSize
      });
      if (reuslt.status == 1) {
        if (reuslt.data) {
          if (status == "0") {
            this.list = reuslt.data;
          } else {
            this.list = this.list.concat(reuslt.data);
          }
          this.total = reuslt.page.total;
          let total = Math.ceil(this.total / this.pageSize);
          if (this.page + 1 >= total) {
            this.isMore = false;
          }
        } else {
          this.list = [];
          this.tipsText = "tips2";
          this.showTip = true;
        }
      } else {
        if (reuslt.type) {
          this.tipsText = "tips1";
          this.showTip = true;
        } else {
          this.$alert(reuslt.msg);
          return false;
        }
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

.exam-list-page {
  .dt-content {
    overflow: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
    .searchItem {
      padding: 15px 20px 25px 20px;
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
    .exam-list {
      position: absolute;
      top: 120px;
      left: 0;
      width: 100%;
      bottom: 0;
      .exam-list-content {
        position: relative;
        height: 100%;
        width: 100%;
        .exam-list-wrap {
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }
      }
    }
    .exam-item {
      padding: 28px 40px;
      background: #ffffff;
      overflow: hidden;
      border-bottom: 2px #e8e8e8 solid;
      margin-bottom: 20px;
      .exam-item-left {
        float: left;
        width: 150px;
        height: 160px;
        margin-right: 50px;
        text-align: center;
        .house {
          width: 150px;
          height: 150px;
          position: relative;
          top: 8px;
        }
        .exam-img {
          width: 120px;
          height: 120px;
          border: 1px #efefef solid;
          border-radius: 50%;
          margin-top: 20px;
        }
      }
      .exam-item-right {
        float: left;
        width: 450px;
      }
      .info {
        float: left;
        font-size: 26px;
        color: #999;
        .tit {
          font-weight: bold;
          font-size: 28px;
          color: #333;
          margin-bottom: 10px;
        }
        .name {
          position: relative;
        }
        .badge {
          position: absolute;
          top: 2px;
          right: -8px;
          width: 14px;
          height: 14px;
          padding: 0;
        }
      }
      .operation {
        float: left;
        margin-top: 16px;
        span {
          width: 150px;
          height: 60px;
          display: inline-block;
          text-align: center;
          line-height: 60px;
          border-radius: 10px;
          margin-right: 20px;
        }
        .answer {
          border: 2px #28c76a solid;
          color: #28c76a;
        }
        .finally {
          color: #fdae31;
          border: 2px #fdae31 solid;
        }
      }
    }
  }
}
</style>
