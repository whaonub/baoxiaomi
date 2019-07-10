<template>
  <div class="dt-dynam card-seeDynam-page">
    <div
      class="fixTop"
      :style="{paddingTop:top1}"
      style="background:#28c76a"
      v-show="searchBarFixed==true"
    ></div>
    <div class="fixHeaders" :style="{top:top}" :class="searchBarFixed==true?'fixHeaderStyle':''">
      <x-header class="beginning">
        <a slot="overwrite-left" @click="goBack">
          <span class="back-icon"></span>
        </a>
        <a slot="right" @click="seeRecord" style="color:#fff;">访客记录</a>
      </x-header>
    </div>
    <div class="dynam-content">
      <div
        class="dt-headers"
        v-if="zoneList.length == 0 "
        :style="picWall !=''&&picWall!=null?'background-image: url('+picWall+')':''"
      >
        <div class="content-icon">
          <flexbox :gutter="0" class="phone-icon">
            <flexbox-item align="center" :span="3">
              <div class="card-img">
                <img v-if="agentData.photoUrl" :src="agentData.photoUrl">
                <img v-if="!agentData.photoUrl" src="../../assets/imgs/name-my.jpg">
              </div>
            </flexbox-item>
            <flexbox-item align="left" :span="6">
              <div style="color:#fff">{{agentData.cardName}}</div>
            </flexbox-item>
            <flexbox-item align="right" :span="3">
              <div class="card-add-img" @click="addDynamic">
                <img src="../../assets/imgs/add-dynamic.png">
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <dt-scroll
        ref="listView"
        v-if="zoneList.length > 0 "
        :bounce="false"
        :listenScroll="true"
        :probeType="probeType"
        :pullup="isMore"
        @scroll="scrollSearch"
      >
        <div
          class="dt-headers"
          :style="picWall !=''&&picWall!=null?'background-image: url('+picWall+')':''"
        >
          <div class="content-icon">
            <flexbox :gutter="0" class="phone-icon">
              <flexbox-item align="center" :span="3">
                <div class="card-img">
                  <img v-if="agentData.photoUrl" :src="agentData.photoUrl">
                  <img v-if="!agentData.photoUrl" src="../../assets/imgs/name-my.jpg">
                </div>
              </flexbox-item>
              <flexbox-item align="left" :span="6">
                <div style="color:#fff">{{agentData.cardName}}</div>
              </flexbox-item>
              <flexbox-item align="right" :span="3">
                <div class="card-add-img" @click="addDynamic">
                  <img src="../../assets/imgs/add-dynamic.png">
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
        <div class="contents" v-for="(item,index) in zoneList" :key="index">
          <div class="contents-text" v-if="item.message !=''">{{item.message}}</div>
          <div class="photograph-box" v-if="item.images.length>0">
            <div
              class="photograph"
              v-for="(items,indexs) in item.images"
              :key="indexs"
              @click="imgEnlarge(item,indexs)"
            >
              <img :src="items" class="img-camera previewer-demo-img">
            </div>
          </div>
          <div v-if="item.location" class="location-text">
            <span>
              <img class="location" src="../../assets/imgs/adds.png">
            </span>
            <span>{{item.location}}</span>
          </div>
          <flexbox :gutter="0" class="item-style">
            <flexbox-item align="left" :span="6">
              <div class="ml20">
                <span>{{item.updateTime}}</span>
                <span>{{item.time}}</span>
                <span class="del-photograph" @click="delPhotograph(item,index)">删除</span>
              </div>
            </flexbox-item>
            <flexbox-item align="right" :span="5">
              <div>
                <span v-if="item.likeNum !=0">{{item.likeNum}}次</span>
                <span v-if="item.likeNum ==0">
                  <img class="zan-icon" src="../../assets/imgs/save.png">
                </span>
                <span v-if="item.likeNum >0">
                  <img
                    class="zan-icon"
                    src="../../assets/imgs/save.png"
                    @click="getPraise(item,index)"
                  >
                </span>
              </div>
            </flexbox-item>
          </flexbox>
          <div class="fabulous-box" v-if="item.showfabulous">
            <div class="fabulous-img">
              <div class="flex-demo" v-for="(items,data) in item.visitors" :key="data">
                <div class="flex-img">
                  <img :src="items.image">
                </div>
                <p class="name">{{items.nickName}}</p>
              </div>
            </div>
          </div>
        </div>
      </dt-scroll>
      <tips v-if="zoneList.length == 0" text="未更新动态" tips="tips10"></tips>
    </div>
    <div v-transfer-dom class="img-previewer">
      <previewer :list="list" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
    </div>
  </div>
</template>
<script>
import {
  Tab,
  TabItem,
  Flexbox,
  FlexboxItem,
  XHeader,
  TransferDom,
  Previewer
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils";
import DtScroll from "@/components/dtScroll";
import { setTimeout } from "timers";
import tips from "@/components/tips";
export default {
  directives: {
    TransferDom
  },
  name: "seeDynam",
  components: {
    dtHeader,
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem,
    XHeader,
    DtScroll,
    Previewer,
    tips
  },
  data() {
    return {
      isMore: true,
      zoneList: [],
      agentData: {},
      picWall: require("../../assets/imgs/bizhi.png"),
      device: getDevice(),
      queryObj: {
        endRow: 0,
        pageNum: 1,
        pageSize: 20,
        pages: 0,
        startRow: 0,
        total: 0
      },
      top: "0",
      top1: "0",
      searchBarFixed: false,
      visitors: [],
      list: [],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer-demo-img")[
            index
          ];

          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;

          let rect = thumbnail.getBoundingClientRect();

          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      }
    };
  },
  created() {
    this.probeType = 3;
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  mounted() {
    if (this.device == "android") {
      this.top = "0";
    } else if (this.device == "ios") {
      this.top = "0.055rem";
      this.top1 = "0.065rem";
    } else if (this.device == "iPhoneX") {
      this.top = "0.075rem";
      this.top1 = "0.085rem";
    }
    this.$store.commit("getPositionList", []);
    if (this.$store.state.app_token) {
      this.initData();
      this.cardData();
    }
    if (this.$store.state.agentData != null) {
      this.agentData = this.$store.state.agentData;
      if (this.agentData.picWall) {
        this.picWall = this.agentData.picWall;
      }
    } else {
      if (this.$store.state.app_token) {
        this.cardData();
      }
    }
  },
  methods: {
    scrollSearch(e) {
      if (e.y < 0) {
        this.searchBarFixed = true;
      } else {
        this.searchBarFixed = false;
      }
      if (this.isMore == true) {
        this.queryObj.pageNum++;
        this.initData();
      }
    },
    async initData() {
      let results = await api.getAgentZone(this.queryObj);
      if (results.status == 1) {
        if (results.data != null) {
          for (let i = 0; i < results.data.length; i++) {
            let now = new Date(results.data[i].updateTime.replace(/-/g, "/"));
            let month = now.getMonth() + 1;
            let date = now.getDate();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            results.data[i].updateTime = month + "-" + date;
            results.data[i].time = hours + ":" + minutes;
          }
          this.zoneList = this._.concat(this.zoneList, results.data);
          this.zoneList.forEach(item => {
            item.showfabulous = false;
          });
        } else {
          this.isMore = false;
        }
      }
    },
    async getPraise(item, index) {
      let zoneList = this.zoneList;
      if (!item.showfabulous) {
        let result = await api.getPriaserByZone({
          id: item.zoneId,
          pageNum: 1,
          pageSize: 100
        });
        let visitors = [];
        if (result.status == 1) {
          if (result.data) {
            visitors = result.data;
          }
        } else {
          this.$toast(result.msg);
        }
        if (visitors.length > 0) {
          item.showfabulous = !item.showfabulous;
          item.visitors = visitors;
        }
      } else {
        item.showfabulous = !item.showfabulous;
      }
      this.$set(zoneList, index, item);
    },
    //历史访问记录
    seeRecord() {
      this.$router.push({ path: "/seeRecord", query: {} });
    },
    addDynamic() {
      //清缓存
      this.$store.commit("clearCacheByName", "addDynam");
      setTimeout(() => {
        this.$store.commit("setCacheByName", "addDynam");
      }, 200);
      this.$router.push({
        path: "/addDynam"
      });
    },
    async cardData() {
      let results = await api.getAgentCard();
      if (results.status == 1) {
        this.agentData = results.data;
        if (this.agentData.picWall) {
          this.picWall = this.agentData.picWall;
        }
        this.$store.commit("getAgentData", this.agentData);
      }
    },
    async delPhotograph(item, index) {
      let $this = this;
      this.$confirm({
        title: "",
        content: "您确定要删除？",
        async onConfirm() {
          let results = await api.getDeleteById({ id: item.zoneId });
          if (results.status == 1) {
            $this.$toast("删除成功");
            $this.zoneList.splice(index, 1);
          } else {
            $this.$toast("删除失败");
          }
        }
      });
    },
    goBack() {
      let device = this.device;
      let from = this.$route.query.from;
      let flag = true;
      if (from && from != "home") {
        this.$router.go(-1);
      } else if (device == "android") {
        bmAndroid.goHomePage();
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.goHomePage.postMessage(null);
      }
    },
    imgEnlarge(val, index) {
      this.list = [];
      val.images.forEach(item => {
        this.list.push({ msrc: item, src: item, w: 600, h: 0 });
      });
      setTimeout(() => {
        this.$refs.previewer.show(index);
        // console.log(	this.$refs.previewer)
      }, 400);
    },
    logIndexChange(arg) {
      this.$toast();
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

.card-seeDynam-page {
  .dt-content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .fabulous {
    position: absolute;
    right: 50px;
    top: 0;
  }
  .fabulous-img {
    width: 530px;
    background-color: #f7f7f7;
    border-radius: 10px;
    margin: 0 50px;
  }
  .fabulous-box {
    position: relative;
    padding-bottom: 45px;
    background: #fff;
    top: -10px;
  }
  .del-photograph {
    padding-left: 20px;
    color: #6495ed;
  }
  .flex-demo {
    display: inline-block;
    margin-top: 20px;
    .flex-img {
      width: 70px;
      height: 70px;
      margin-left: 30px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #cccccc;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .name {
      text-align: center;
      margin-top: 12px;
      color: #333333;
      font-size: 24px;
      width: 90px;
      margin-left: 10px;
      height: 40px;
      line-height: 40px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .fixTop {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
  }
  // background: #f7f7f7;
  .fixHeaders {
    position: fixed !important;
    z-index: 100;
    width: 100%;
    top: 0;
    display: block;
    // background: #ff7565;
  }
  .fixHeaderStyle {
    animation: fade-in;
    animation-duration: 4s;
    -webkit-animation: fade-in 1.5s;
    background: #28c76a;
  }
  .dt-headers {
    // background-image: url('../../assets/imgs/backgoured-img.jpg');
  }
  .fixHeaderStyle {
    animation: fade-in;
    animation-duration: 4s;
    -webkit-animation: fade-in 1.5s;
    background: #28c76a;
  }
  .dt-headers {
    // background-image: url("../../assets/imgs/backgoured-img.jpg");
    background-size: 100% auto;
  }
  .content-icon {
    height: 440px;
  }
  .phone-icon {
    position: relative;
    top: 60%;
    .card-img {
      width: 140px;
      height: 140px;
      overflow: hidden;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .card-add-img {
      width: 50px;
      height: 50px;
      overflow: hidden;
      margin-top: 75px;
      margin-right: 30px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .record {
    line-height: 600px;
  }
  .photo {
    margin: 30px;
    width: 690px;
    height: 690px;
    background-color: #e4e3e3;
    border-radius: 20px;
  }
  .dt-btn-box {
    width: 690px;
    bottom: 62px;
    margin: 0 32px;
    background-color: #28c76a;
    border-radius: 40px;
  }
  .dt-btn-down {
    background-color: #28c76a;
    border-radius: 40px;
    font-size: 36px;
    color: #ffffff;
  }
  .contents-text {
    padding: 10px 40px 10px 40px;
    word-break: break-all;
  }
  .location-text {
    margin: 10px 40px;
    color: #4ed388;
    font-size: 26px;
  }
  .item-style {
    padding-bottom: 10px;
    font-size: 26px;
  }
  .zan-icon {
    width: 36px;
    position: relative;
    bottom: -1px;
  }
  .ml20 {
    margin-left: 40px;
  }
  .location {
    width: 28px;
    height: 28px;
    position: relative;
    bottom: -2px;
  }
  .photograph-box {
    margin: 0 30px;
    margin-bottom: 18px;
    border-radius: 10px;
    .photograph {
      width: 210px;
      height: 210px;
      background-color: #eeeeee;
      border-radius: 10px;
      margin: 0 10px;
      border-radius: 10px;
      display: inline-block;
      .img-camera {
        width: 100%;
        height: 100%;
      }
      .camera {
        width: 73px;
        height: 60px;
        padding: 85px 78px;
      }
    }
  }
  .contents {
    background-color: #fff;
    margin-top: 20px;
    padding-top: 20px;
  }

  .back-icon {
    margin-top: 6px;
    display: inline-block;
    width: 18px;
    height: 32px;
    .bg-image(icon_back, 18, 32);
    .active-op(0.7);
  }
}
</style>


