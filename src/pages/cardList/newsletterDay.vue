<template>
  <div class="dt-pages card-newsletterDay-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader
        title="往日简讯"
        :leftBack="false"
        @headerRight="showPlugin"
        rightIcon="day"
        @headerLeft="goBack"
      ></dtHeader>
      <div class="text">
        您的简讯已被浏览
        <span class="text-num">{{visitsum}}</span> 次，请及时关注
      </div>
    </div>
    <div class="dt-content" id="dtcontent" @scroll="scrollHandler">
      <Tips :tips="tipsText" @refresh="refresh" v-if="showTip"></Tips>
      <div>
        <div class="dynamic" v-for="(item,index) in list" :key="index">
          <div class="politics-list">
            <div class="dynamic-day">{{item.date}}</div>
            <div style="background: #ffffff;">
              <div class="dynamic-content" v-for="(itemd,indexs) in item.newsContent" :key="indexs">
                <div class="politics">
                  <img src="../../assets/imgs/title.png" class="title-img">
                  {{itemd.title}}
                  <img
                    src="../../assets/imgs/title.png"
                    class="title-img"
                  >
                </div>
                <div class="politics-list" v-for="(items,data) in itemd.news" :key="data">
                  <div class="politics-num">{{data+1}}</div>
                  <div class="politics-text">{{items.content}}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="line"></div>
            <p class="see">
              有多少人看过我
              <span @click="changeVisitors(item,index)" class="change">
                {{item.showSee?'点击收起':'点击查看'}}
                <icon class="dt-icon" v-if="!item.showSee" name="spread"></icon>
                <icon class="dt-icon" v-if="item.showSee" name="retract"></icon>
              </span>
            </p>
            <div v-if="item.showSee">
              <flexbox :gutter="0" style="background:#fff;">
                <flexbox-item :span="12">
                  <div class="evaluate">
                    <div class="flex-demo" v-for="(items,data) in item.visitors" :key="data">
                      <div class="flex-img">
                        <img v-if="items.image" class="fiex-photoUrl" :src="items.image">
                        <img
                          v-if="!items.image"
                          class="fiex-photoUrl"
                          src="../../assets/imgs/name-my.jpg"
                        >
                        <img
                          src="../../assets/imgs/save2.png"
                          v-if="items.isPraised == 1"
                          class="flex-save"
                        >
                      </div>
                      <p class="name">{{items.nickName?items.nickName:'游客'}}</p>
                    </div>
                  </div>
                </flexbox-item>
              </flexbox>
              <div
                class="default"
                v-if="item.visitors&&item.visitors.length>=12 && item.isMore"
                @click="getShareVisitor(item,index,true)"
              >
                <span>展开更多
                  <icon class="dt-icon" name="open2"></icon>
                </span>
              </div>
              <div class="no-style" v-if="!item.visitors||item.visitors.length==0">
                <img src="../../assets/imgs/no-entry.png" class="no-entry">
                <p class="no-entry-text">还未有微信好友点开阅览</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tab, TabItem, Flexbox, FlexboxItem, Datetime } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import DtScroll from "@/components/dtScroll";
import { getDevice } from "@/config/utils.js";
import Tips from "@/components/tips";
export default {
  name: "newsletterDay",
  components: {
    dtHeader,
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem,
    Datetime,
    DtScroll,
    Tips
  },
  data() {
    return {
      isMore: true,
      queryObj: {
        endRow: 0,
        pageNum: 1,
        pageSize: 100,
        pages: 0,
        startRow: 0,
        total: 0
      },
      showSee: false,
      dateStr: "",
      visitsum: 0,
      list: [],
      showContent: false,
      device: getDevice(),
      tipsText: "",
      showTip: false,
      moreStatus: true
    };
  },
  created() {
    this.probeType = 3;
  },
  mounted() {
    if (this.$store.state.app_token) {
      this.initData();
      this.getVisitCountList();
    }
    let dateStr = new Date(new Date() - 24 * 60 * 60 * 1000);
    let year = dateStr.getFullYear();
    let month = dateStr.getMonth() + 1;
    let date = dateStr.getDate();
    this.dateStr = year + "-" + month + "-" + date;
  },
  methods: {
    refresh() {
      this.initData();
      this.getVisitCountList();
    },
    //选择指定日期的简讯
    showPlugin() {
      let _this = this;
      this.$vux.datetime.show({
        cancelText: "取消",
        confirmText: "确定",
        clearText: "选择日期",
        format: "YYYY-MM-DD",
        endDate: new Date(new Date() - 24 * 60 * 60 * 1000),
        value: _this.dateStr,
        yearRow: "{value}年",
        monthRow: "{value}月",
        dayRow: "{value}日",
        onConfirm(val) {
          _this.getByDateList(val);
          _this.dateStr = val;
        },
        onShow() {
          console.log("plugin show");
        }
      });
    },
    async getByDateList(val) {
      this.tipsText = "tips2";
      this.showTip = false;
      let results = await api.getByDate({ dateStr: val });
      if (results.status == 1) {
        if (results.data && results.data.newsContent.length > 0) {
          this.isMore = true;
          this.list = [results.data];
        } else {
          this.list = [];
          this.tipsText = "tips2";
          this.showTip = true;
        }
      }
    },
    //查询往日简讯
    async initData() {
      let results = await api.getOldNews(this.queryObj);
      if (results.status == 1) {
        if (results.data) {
          this.list.forEach(item => {
            item.showSee = false;
          });
          this.list = this._.concat(this.list, results.data);
        } else {
          this.isMore = false;
        }
        this.moreStatus = true;
      }
    },
    //有多少人浏览过
    async getVisitCountList() {
      let results = await api.getVisitCount(this.agentId);
      if (results.status == 1) {
        this.visitsum = results.data.number;
      }
    },
    selectMember(item, val) {
      val.showSee = !item;
      this.list = JSON.parse(JSON.stringify(this.list));
    },
    changeVisitors(item, pindex) {
      item.showSee = !item.showSee;
      item.pageNum = 1;
      item.isMore = true;
      let list = this.list;
      if (item.showSee) {
        this.getShareVisitor(item, pindex, false);
      } else {
        item.visitors = [];
      }
      this.$set(list, pindex, item);
    },
    async getShareVisitor(item, pindex, status) {
      let list = this.list;
      let pageSize = 12;
      let results = await api.getShareVisitor({
        pageNum: item.pageNum,
        pageSize: pageSize,
        date: item.date
      });
      if (results.status == 1) {
        if (results.data) {
          if (status) {
            item.visitors = item.visitors.concat(results.data);
          } else {
            item.visitors = results.data;
          }
          let total = results.page.total;
          let page = Math.ceil(total / pageSize);
          if (item.pageNum >= page) {
            item.isMore = false;
          }
          item.pageNum++;
        }
      }
      this.$set(list, pindex, item);
      if (pindex + 1 == list.length) {
        var div = document.getElementById("dtcontent");
        div.scrollTop = div.scrollHeight;
      }
    },
    seeRecord() {
      this.$router.push({
        path: "/seeRecord",
        query: {
          orderId: 1,
          companyId: 2
        }
      });
    },
    goBack() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.goHomePage();
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.goHomePage.postMessage(null);
      }
    },
    scrollHandler(el) {
      let obj = el.srcElement;
      if (obj.offsetHeight + obj.scrollTop + 10 >= obj.scrollHeight) {
        if (this.isMore && this.moreStatus) {
          this.queryObj.pageNum++;
          this.moreStatus = false;
          this.initData();
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

.card-newsletterDay-page {
  background: #f7f7f7;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-top: 80px;
  }
  .vux-1px-b:after {
    border: none;
  }
  .text {
    text-align: center;
    width: 100%;
    height: 80px;
    background: #ffffff;
    line-height: 80px;
    font-size: 26px;
    position: fixed;
    .text-num {
      color: #28c76a;
    }
  }
  .dynamic {
    width: 100%;
    background: #fff;
    .dynamic-day {
      padding-left: 32px;
      height: 78px;
      line-height: 80px;
      font-size: 26px;
      background: #f7f7f7;
    }
    .dynamic-content {
      padding: 0px 60px;
      background: #ffffff;
    }
    .politics {
      text-align: center;
      font-size: 30px;
      padding: 26px 0;
      color: #46869b;
      .title-img {
        width: 32px;
        height: 24px;
        margin-right: 5px;
      }
    }
    .politics-list {
      padding-bottom: 16px;
    }
    .politics-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #c2d1ca;
      display: block;
      float: left;
      font-size: 20px;
      line-height: 24px;
      text-align: center;
      margin-top: 8px;
      margin-right: 18px;
      color: #333333;
    }
    .politics-text {
      line-height: 1.5;
      // text-align: center;
      color: #333333;
    }
    .market {
      text-align: center;
      font-size: 28px;
      padding: 26px 0;
      color: #28c76a;
    }
    .market-text {
      font-size: 16px;
      line-height: 36px;
      // text-align: center;
      color: #333333;
      padding-bottom: 16px;
    }
    .line {
      margin: 20px 24px 0;
      border: solid 1px #e8e8e8;
    }
    .see {
      padding-left: 36px;
      background: #ffffff;
      font-size: 24px;
      padding-top: 20px;
      padding-bottom: 20px;
      position: relative;
      .change {
        position: absolute;
        right: 30px;
        top: 15px;
        .dt-icon {
          position: relative;
          top: -3px;
          width: 32px;
          height: 32px;
        }
      }
    }

    .flex-demo {
      margin: 10px 0;
      float: left;
      .flex-img {
        width: 80px;
        height: 80px;
        margin: 0 15px;
        border-radius: 50%;
        border: 1px solid #cccccc;
        position: relative;
        .fiex-photoUrl {
          margin-left: 10%;
          margin-top: 10%;
          width: 80%;
          height: auto;
          border-radius: 50%;
        }
      }
      p {
        padding: 10px 0;
      }
    }
    .vux-flexbox {
      padding: 0 20.5px;
    }
    .evaluate {
      background: #fff;
      overflow: hidden;
      .name {
        margin: 0 15px;
        text-align: center;
        width: 80px;
        overflow: hidden;
        height: 60px;
        line-height: 60px;
        text-overflow: ellipsis;
      }
      .flex-save {
        width: 27px;
        position: absolute;
        top: -6px;
        right: -7px;
      }
    }
    .slide {
      overflow: hidden;
      max-height: 340px;
      transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
    }
    .animate {
      max-height: 9999px !important;
      transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
      transition-delay: 0s;
    }
    .default {
      text-align: center;
      padding-top: 24px;
      padding-bottom: 38px;
      font-size: 26px;
      color: #999999;
      background: #fff;
    }
    .no-style {
      text-align: center;
      padding-bottom: 30px;
      img {
        width: 150px;
        height: 140px;
      }
      .no-entry-text {
        color: #ccc;
        font-size: 22px;
      }
    }
  }
  .slide {
    // padding-left: .5rem;
    max-height: 360px;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
  }
  .animate {
    max-height: 9999px !important;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
}
</style>
