<template>
  <div class="dt-pages card-cardFamily-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader title="简讯分享" :leftBack="false" rightText="收藏" @headerRight="collection" @headerLeft="goBack"></dtHeader>
      <div class="check">
        <div class="check-img">
          <img src="../../assets/imgs/Check.png" @click="checkList()" v-if="showCheak == false" />
          <img src="../../assets/imgs/Check01.png" @click="checkList()" v-if="showCheak == true" />
          <p class="text-check">一键勾选 </p>
          <p class="strip" :style="this.listdata.length>0&&this.listdata.length<10?'color:red':this.showCheak == true?'':''">最低不少于10条</p>
        </div>
      </div>
    </div>
    <div class="dt-content">
      <div class="dynamic-content">
        <div v-for="(item,index) in list" :key="index">
          <h4 class="head-nav">{{item.title}}</h4>
          <div class="head-cont" v-for="(items,data) in item.news" :key="data">
            <ul>
              <li class="head-whole">
                <img src="../../assets/imgs/cheak-box.png" @click="cheakBox(items)" class="title-dynamic" v-if="items.showSave == false" />
                <img src="../../assets/imgs/cheak-box01.png" @click="cheakBox(items)" class="title-dynamic" v-if="items.showSave == true" />
                <span class="title-content">{{data+1}}、{{items.content}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="dt-footer">
      <div class="dt-btn-box fz30">
        <div class="dt-btn-down" @click="getSave">分享</div>
        <div class="dt-pos-btn" :style="{display:$store.state.maskView}">分享</div>
      </div>
    </div>
  </div>
</template>
<script>
import { TransferDom, Popup } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils.js";
import html2Canvas from "html2canvas";

export default {
  directives: {
    TransferDom
  },
  name: "cardFamily",
  components: {
    dtHeader,
    Popup
  },
  data() {
    return {
      title: "",
      show: false,
      showCheak: false,
      baseImg: "data:image/jpeg;base64,",
      queryObj: {
        endRow: 0,
        pageNum: 1,
        pageSize: 20,
        pages: 0,
        startRow: 0,
        total: 0
      },
      pageData: "",
      agentData: {},
      yeadr: "",
      listdata: [],
      showCheak1: true,
      list: {},
      listNum: 0,
      //分享 数据接口入参
      requestShare: {
        newsIds: []
      },
      device: getDevice(),
      //收藏 数据接口入参
      requestCollect: {
        ids: []
      }
    };
  },
  created() {
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
    window.shareResult = function() {};
  },
  mounted() {
    if (this.$store.state.app_token != "") {
      this.cardData();
      this.initData();
    }
  },
  methods: {
    //获取当日简讯
    async initData() {
      let results = await api.getTodayNewsWithShare();
      if (results.status == 1) {
        this.list = results.data.newsContent;
        this.listNum = 0;
        let sharedNews = results.data.sharedNews;
        let listdata = this.listdata;
        this.list.forEach(item => {
          this.listNum += item.news.length;
          item.news.forEach(data => {
            data.showSave = false;
            if (sharedNews) {
              sharedNews.forEach(item => {
                if (data.newsId == item) {
                  data.showSave = true;
                  listdata.push(data);
                }
              });
            }
          });
        });
        if (this.listNum == listdata.length) {
          this.showCheak = true;
        } else {
          this.showCheak = false;
        }
        if (!sharedNews) {
          this.checkList();
        }
      }
    },
    //选中当前简讯
    cheakBox(item) {
      let listNum = [];
      this.listdata = [];
      item.showSave = !item.showSave;
      this.list = JSON.parse(JSON.stringify(this.list));
      console.log(this.list);
      this.list.forEach(data => {
        data.news.forEach(datas => {
          listNum.push(datas);
          if (datas.showSave == true) {
            this.listdata.push(datas);
          }
        });
      });
      if (this.listdata.length > 1 && this.listdata.length < 10) {
        this.listdata = JSON.parse(JSON.stringify(this.listdata));
      } else {
        this.listdata = JSON.parse(JSON.stringify(this.listdata));
      }
      if (listNum.length == this.listdata.length) {
        this.showCheak = true;
      } else {
        this.showCheak = false;
      }
    },
    //选择全部简讯
    checkList() {
      if (this.listNum >= 0) {
        if (this.showCheak == false) {
          this.list.forEach(item => {
            item.news.forEach(items => {
              items.showSave = true;
            });
          });
          this.showCheak = true;
        } else if (this.showCheak == true) {
          this.showCheak = false;
          this.list.forEach(item => {
            item.news.forEach(items => {
              items.showSave = false;
            });
          });
        }
        this.list = JSON.parse(JSON.stringify(this.list));
        console.log(this.showCheak);
        this.list.forEach(data => {
          data.news.forEach(datas => {
            if (datas.showSave == true) {
              this.listdata.push(datas);
            }
          });
        });
        if (this.listdata.length > 1 && this.listdata.length < 10) {
          this.listdata = JSON.parse(JSON.stringify(this.listdata));
        } else {
          this.listdata = JSON.parse(JSON.stringify(this.listdata));
        }
      }
    },
    //canvas生成图片
    getPdf() {
      let _this = this;
      var title = this.htmlTitle;
      let device = this.device;
      this.show = true;
      html2Canvas(document.querySelector("#imagesDom"), {
        allowTaint: true,
        background: undefined,
        crossOrigin: ""
      }).then(function(canvas) {
        console.log(canvas);
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;

        let pageData = canvas.toDataURL("image/png", 1.0);
        _this.pageData = pageData.split("base64,")[1];
      });
    },
    goBack() {
      let device = this.device;
      let from = this.$route.query.from;
      if (from) {
        this.$router.go(-1);
      } else if (device == "android") {
        bmAndroid.goHomePage();
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.goHomePage.postMessage(null);
      }
    },
    //收藏
    async collection() {
      let list = [];
      this.list.forEach(item => {
        item.news.forEach(items => {
          if (items.showSave == true) {
            console.log(items);
            list.push(items.newsId);
          }
        });
      });
      if (list.length > 0) {
        let results = await api.getNewsCollection({ ids: list });
        if (results.status == 1) {
          this.$toast("收藏成功");
        } else {
          this.$toast("收藏失败");
        }
      } else {
        this.$toast("未选择收藏简讯");
      }
    },
    //获取名片
    async cardData() {
      let results = await api.getAgentCard();
      if (results.status == 1) {
        this.agentData = results.data;
        this.title = this.agentData.cardName;
        if (this.agentData.workYears != "") {
          let now = new Date(this.agentData.workYears.replace(/-/g, "/"));
          let year = new Date().getFullYear() - now.getFullYear();
          console.log(year);
          let month = new Date().getMonth() - now.getMonth();
          let hours = new Date().getHours() - now.getHours();
          if (year < 1) {
            this.yeadr = 1;
          } else if (month < 0 || hours < 0) {
            this.yeadr = year + 1;
          } else {
            this.yeadr = year;
          }
        }
      }
    },
    //分享
    async getSave() {
      let list = [];
      this.list.forEach(item => {
        item.news.forEach(items => {
          if (items.showSave == true) {
            list.push(items.newsId);
          }
        });
      });
      if (this.showCheak == true) {
        this.shareContent(list);
      } else if (this.listdata.length >= 10) {
        if (list.length > 0) {
          this.shareContent(list);
        }
      } else {
        this.$toast("分享简讯必须最少10条");
      }
    },
    showBack() {
      this.show = false;
    },
    async shareContent(list) {
      let results = await api.getAddShare({ ids: list });
      if (results.status == 1) {
        let shareId = results.data.str;
        let obj = {
          type: 1, //1小程序，2，图片，3连接
          userName: "gh_16600ce93d45",
          path: "pages/custAgentInfo?id=" + shareId,
          title: this.title + "的名片",
          content: "分享简讯",
          clickUrl: "uuu",
          shareChannel: "1",
          pictureBase64:
            "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"
        };
        this.$share(obj);
      } else {
        this.$alert(results.msg);
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

.card-cardFamily-page {
  background: #fff;

  .check {
    width: 100%;
    height: 80px;
    background: #f7f7f7;
    line-height: 80px;

    position: fixed;
    .check-img {
      position: relative;
      img {
        position: absolute;
        left: 30px;
        top: 23px;
        width: 38px;
      }
      .text-check {
        font-size: 30px;
        color: #333333;
        position: absolute;
        left: 83px;
      }
      .strip {
        font-size: 22px;
        color: #fb9a28;
        position: absolute;
        right: 41px;
      }
    }
  }
  .dt-content {
    margin-top: 80px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 81px;
  }
  .dynamic-content {
    width: 100%;
    padding: 31px 30px 26px 31px;
    margin-bottom: 200px;
    .head-nav {
      text-align: center;
      font-size: 30px;
      color: #333333;
    }
    .head-cont {
      .head-whole {
        position: relative;
        line-height: 42px;
        padding: 7px 0;
      }
      .title-dynamic {
        width: 28px;
        position: relative;
        display: inline-block;
        top: 4px;
      }
      .title-content {
        font-size: 26px;
        color: #333333;
        margin-left: 10px;
      }
    }
  }
  .dt-btn-box {
    width: 690px;
    height: 81px !important;
    bottom: 62px;
    margin: 0 32px;
    background-color: #28c76a;
    border-radius: 40px;
    font-size: 36px;
    color: #ffffff;
  }
  .dt-btn-down,
  .dt-pos-btn {
    height: 81px !important;
    line-height: 81px;
    border-radius: 40px;
  }
}

.popup-content {
  .vux-popup-dialog {
    background: rgba(0, 0, 0, 0.5) !important;
    .popup0 {
      padding-bottom: 15px;
      height: 465px;
      .show-box {
        position: relative;
      }
      .show-goback {
        padding: 15px 16px;
        font-size: 15px;
        position: absolute;
        color: #ffffff;
      }
      .show-top {
        color: #ffffff;
        font-size: 16px;
        text-align: center;
        padding: 15px 0px;
      }
      .show-img {
        width: 143px;
        height: 300px;
        margin: 25px 0px 25px 118px;
        background-color: #ffffff;
        border-radius: 5px;
        font-size: 15px;
        img {
          width: 100%;
          height: auto;
        }
      }
      .show-btn {
        margin-left: 118px;
        width: 143px;
        height: 30px;
        background-color: #ff8a18;
        border-radius: 30px;
        position: relative;
        .weChat {
          position: absolute;
          top: 4px;
          font-size: 15px;
          color: #ffffff;
          text-align: center;
          left: 26.5px;
        }
        img {
          width: 18px;
          height: 14px;
          position: absolute;
          top: 8px;
          left: 105.5px;
        }
      }
    }
  }
}
.maskOther1 {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  z-index: -1;
  transition: opacity 400ms;
}
.show-mask1 {
  opacity: 0;
  z-index: 10;
}
</style>
