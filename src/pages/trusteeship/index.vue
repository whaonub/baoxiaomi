<template>
  <div class="dt-pages policy-index-page">
    <div class="dt-header">
      <dtHeader
        title="保单托管"
        rightIcon="sigh"
        @headerRight="goHelp"
        :leftIcon="false"
        :leftBack="false"
      ></dtHeader>
    </div>
    <div class="dt-content">
      <div class="policy-index-tips" v-if="cachePolicyId">
        <icon name="horn" class="dt-icon"></icon>您还有未完成的保单，点击
        <span @click="gotoPolicy('1')" class="edit">继续填写</span>
        <span @click="deletePolicy" class="vux-close"></span>
      </div>
      <div class="user-list" v-if="count">
        <p class="imgs">
          <span
            class="avatar"
            v-for="(item,index) in userlist"
            :key="index"
            :style="{'z-index':index}"
          >
            <img :src="item" onerror="this.src='../../assets/imgs/name-my.jpg'">
          </span>
        </p>
        <p v-if="count" class="text">
          <i>{{count}}</i>用户都做了保单托管
        </p>
      </div>
      <div class="video-list">
        <div class="trusteeship-top">
          <img src="../../assets/imgs/trusteeship-top.png">
        </div>
        <div class="video-content" style="height:140px" v-if="videoId">
          <div class="tips" v-if="videoStatus">保单托管示例报告</div>
          <div class="video-style" id="player"></div>
        </div>
      </div>
      <div class="menu-content">
        <div class="menu-list">
          <div class="menu-list-content">
            <div class="menu-btn" @click="gotoPolicy">
              <p class="menu-icon">
                <span class="dt-icon policy"></span>
              </p>
              <p>录入保单</p>
            </div>
            <div class="menu-btn" @click="gotoOCR">
              <p class="menu-icon">
                <span class="dt-icon scanning"></span>
              </p>
              <p>扫描保单</p>
            </div>
            <div class="menu-btn mrn" @click="gotoTrusteeshipList">
              <p class="menu-icon">
                <span class="dt-icon list"></span>
              </p>
              <p>托管列表</p>
            </div>
          </div>
        </div>
        <!-- <div class="ocr-tips" v-if="guide && guide.ocrTip!=1" @click="clearTips()"></div> -->
      </div>
      <div class="invitation" @click="gotoInvitations">
        <dl>
          <dt></dt>
          <dd class="mt">让老朋友主动帮你推荐新朋友，</dd>
          <dd>人脉裂变，轻松拓客！</dd>
        </dl>
      </div>
      <div class="records">
        <div class="title">谁预约做托管服务</div>
        <div class="record-item" v-for="(item,index) in records" :key="index">
          <p class="title">
            {{item.custName}}
            <icon name="xin" class="dt-icon xin" v-if="item.isNew == 1"></icon>
          </p>
          <p class="date">{{item.createTime}}</p>
          <span @click="readAppointment(item)">
            <icon name="phone" class="dt-icon phone"></icon>
          </span>
        </div>
        <div v-if="isMore" class="showMore" @click="showMore">点击加载更多 ~</div>
        <div v-if="norecords" class="norecords">
          <p class="t-img"></p>
          <p>暂时还没有客户预约~</p>
        </div>
      </div>
      <networkTips @change="changeVideo"></networkTips>
      <!-- <div class="ocr-mask" v-if="guide && guide.ocrTip!=1"></div> -->
    </div>
  </div>
</template>
<script>
import { XImg } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice, AppendJs } from "@/config/utils";
import networkTips from "@/components/networkTips";

export default {
  name: "trusteeshipIndex",
  components: {
    dtHeader,
    XImg,
    networkTips
  },
  data() {
    return {
      page: 0,
      pageSize: 2,
      device: getDevice(),
      count: "",
      userlist: [],
      records: [],
      cachePolicyId: null,
      isMore: false,
      norecords: false,
      guide: null,
      videoId: null,
      videoStatus: true
    };
  },
  created() {
    let $this = this;
    let device = this.device;
    this.guide = this.$store.state.guide;
  },
  mounted() {},
  activated() {
    this.initData();
    let $this = this;
    window.updatePolicyPage = function() {
      let apptokenObj;
      let device = $this.device;
      if (device == "android") {
        apptokenObj = bmAndroid.getToken();
        if (apptokenObj && apptokenObj != "null") {
          apptokenObj = JSON.parse(apptokenObj);
          $this.$store.state.app_token = apptokenObj.accessToken;
          $this.$store.state.refreshToken = apptokenObj.refreshToken;
          $this.$store.commit("setToken", apptokenObj);
          $this.initData();
        }
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.getToken.postMessage(null);
        window.getToken = function(obj) {
          if (obj) {
            obj = JSON.parse(obj);
            $this.$store.state.app_token = obj.accessToken;
            $this.$store.state.refreshToken = obj.refreshToken;
            $this.$store.commit("setToken", obj);
            $this.initData();
          }
        };
      }
    };
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };

    window.onVideoPause = function() {
      if (window.dtPlayer) {
        window.dtPlayer.j2s_resumeVideo();
        window.dtPlayer.j2s_pauseVideo();
      }
    };
  },
  methods: {
    async initData() {
      let result = await api.findPolicyCache();
      if (result.status == 1) {
        if (result.data) {
          this.cachePolicyId = result.data.id;
        } else {
          this.cachePolicyId = null;
        }
      } else {
        this.$toast(result.msg);
      }
      let trusteeship = await api.getTrusteeshipcusts();
      if (trusteeship.status == 1) {
        if (trusteeship.data) {
          this.count = trusteeship.data.count;
          let images = trusteeship.data.photoUrls;
          if (images.length >= 6) {
            this.userlist = images;
          } else {
            let userlist = [];
            userlist = userlist.concat(images);
            let count = 6 - images.length;
            let index = Math.ceil(Math.random() * 14);
            for (let i = 0; i < count; i++) {
              if (index == 0) {
                index = 1 + i;
              } else {
                index = index + 1;
              }
              userlist.push(
                require("../../assets/imgs/userlist/" + index + ".jpg")
              );
            }
            userlist.sort(function() {
              return Math.random() - 0.5;
            });
            this.userlist = userlist;
          }
        }
      }
      let videoResult = await api.getVideoId({
        str: "policy"
      });
      if (videoResult.status == 1) {
        if (videoResult.data) {
          this.videoId = videoResult.data.vid;
          this.playVideo();
        }
      }
      this.page = 0;
      this.pageSize = 2;
      this.getList("0");
    },
    async getList(status) {
      let reuslt = await api.getAppointment({
        pageNum: this.page,
        pageSize: this.pageSize
      });
      if (reuslt.status == 1) {
        if (reuslt.data) {
          if (status == "0") {
            this.records = reuslt.data;
          } else {
            this.records = this.records.concat(reuslt.data);
          }
          this.total = reuslt.page.total;
          let total = Math.ceil((this.total - 2) / 10);
          if (this.page >= total) {
            this.isMore = false;
          } else {
            this.isMore = true;
          }
        }
        if (this.records.length == 0) {
          this.norecords = true;
        } else {
          this.norecords = false;
        }
      } else {
        this.$toast(reuslt.msg);
      }
    },
    goHelp() {
      let pageUrl = "/course?type=2";
      this.gotoPage(pageUrl);
    },
    gotoPage(pageUrl) {
      let device = this.device;
      if (device == "android") {
        bmAndroid.gotoPage(pageUrl);
      } else if (device == "ios" || device == "iPhoneX") {
        let isPc = this.$store.state.isPc;
        if (!isPc) {
          window.webkit.messageHandlers.gotoPage.postMessage(pageUrl);
        } else {
          this.$router.push({
            path: pageUrl
          });
        }
      } else {
        this.$router.push({
          path: pageUrl
        });
      }
    },
    gotoPolicy(type) {
      let pageUrl = "/policyMake?from=index";
      if (type == "1") {
        pageUrl = "/policyMake?policyId=" + this.cachePolicyId + "&from=index";
      }
      this.$store.state.policyId = null;
      this.$store.state.policyMakeFrom = "index";
      //清缓存
      this.$store.commit("clearCacheArr");
      setTimeout(() => {
        this.$store.commit("setCacheArr");
      }, 200);
      this.gotoPage(pageUrl);
    },
    gotoTrusteeshipList() {
      let pageUrl = "/trusteeshipList";
      this.gotoPage(pageUrl);
    },
    gotoOCR() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.gotoAppPage(3);
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.gotoAppPage.postMessage(3);
      }
    },
    gotoInvitations() {
      let pageUrl = "/invitations";
      this.gotoPage(pageUrl);
    },
    deletePolicy() {
      let $this = this;
      this.$confirm({
        title: "",
        content: "删除未完成的保单",
        async onConfirm() {
          let result = await api.deletePolicyCache({
            id: $this.cachePolicyId
          });
          if (result.status == 1) {
            $this.cachePolicyId = null;
          } else {
            $this.$toast(result.msg);
          }
        }
      });
    },
    async readAppointment(item) {
      let result = await api.readAppointment({
        id: item.custAppointId
      });
      if (result.status == 1) {
        let records = this.records;
        for (let i = 0; i < records.length; i++) {
          if (records[i].custAppointId == item.custAppointId) {
            records[i].isNew = 0;
          }
        }
      }
      window.location.href = `tel:${item.custPhone}`;
    },
    showMore() {
      this.page++;
      this.pageSize = 10;
      this.getList("1");
    },
    clearTips() {
      this.$store.state.guide.ocrTip = 1;
      this.guide.ocrTip = 1;
      this.$userGuide({
        ocrTip: 1
      });
    },
    playVideo() {
      if (window.polyvObject && this.videoId) {
        var dtPlayer = polyvObject("#player").videoPlayer({
          width: "100%",
          height: 140,
          forceH5: true,
          df: 3,
          vid: this.videoId
        });
        window.dtPlayer = dtPlayer;
      } else {
        AppendJs(this.playVideo);
      }
    },
    changeVideo() {
      this.videoStatus = false;
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

.policy-index-page {
  .dt-content {
    overflow: auto;
    background: #f7f7f7;
    -webkit-overflow-scrolling: touch;
    .policy-index-tips {
      background: #fff;
      padding: 12px;
      margin-bottom: 20px;
      position: relative;
      color: #545454;
      font-size: 22px;
      .edit {
        color: #3d99d5;
      }
      .vux-close {
        position: absolute;
        right: 10px;
        top: 3px;
        width: 0.03rem;
        height: 0.03rem;
        color: #545454;
      }
      .vux-close:before,
      .vux-close:after {
        width: 0.03rem;
      }
      .dt-icon {
        color: #969898;
        height: 30px;
        width: 30px;
        margin-left: 15px;
        margin-right: 8px;
        position: relative;
        top: -3px;
      }
    }
    .user-list {
      padding: 20px 28px;
      background: #fff;
      font-size: 28px;
      color: #333;
      i {
        color: #28c76a;
        font-weight: 600;
        font-style: normal;
        margin-right: 5px;
      }
      .imgs {
        padding-left: 10px;
      }
      .avatar {
        margin-left: -10px;
        img {
          height: 58px;
          width: 58px;
          border: 2px #dedede solid;
          border-radius: 50%;
        }
      }
      .text {
        margin-top: 10px;
      }
    }
    .video-list {
      margin-top: 20px;
      background-color: #fff;
      overflow: hidden;
      margin-bottom: 20px;
      padding-bottom: 25px;
      .trusteeship-top {
        width: 690px;
        margin: 0 auto;
        img {
          width: 100%;
        }
      }
      .title {
        font-size: 34px;
        font-weight: bold;
        color: #fff;
        text-align: center;
        margin-top: 25px;
        margin-bottom: 65px;
      }
      .list-item {
        height: 100px;
        border: 0.003rem #28c76a solid;
        background-color: #f3fef5;
        border-radius: 50px;
        margin: 0 60px 20px;
        position: relative;
        overflow: hidden;
        span {
          width: 100px;
          height: 100px;
          text-align: center;
          line-height: 100px;
          border-radius: 50%;
          display: block;
          position: absolute;
          left: -2px;
          top: -2px;
          color: #28c76a;
          font-size: 34px;
          font-weight: bold;
          font-style: oblique;
          border: 0.003rem #28c76a solid;
        }
        p {
          margin-left: 120px;
        }
        .tit {
          font-size: 26px;
          color: #333;
          margin-top: 14px;
          margin-bottom: 3px;
        }
        .text {
          color: #999;
          font-size: 24px;
        }
      }
      .video-content {
        position: relative;
        margin: 15px 40px 0;
        height: 280px;
        border-radius: 20px;
        overflow: hidden;
        .tips {
          color: #fff;
          font-size: 30px;
          font-weight: bold;
          position: absolute;
          left: 0;
          top: 6px;
          text-align: center;
          display: block;
          width: 100%;
          z-index: 9999;
        }
        .video-style {
          border-radius: 20px;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
      }
    }
    .menu-content {
      position: relative;
    }
    .menu-list {
      margin: 0 20px 20px;
      .menu-btn {
        width: 31.4%;
        height: 160px;
        background: #fff;
        border-radius: 10px;
        font-size: 30px;
        text-align: center;
        display: inline-block;
        margin-right: 1.5%;
        box-shadow: 2px 2px 17px #ddd;
      }
      .mrn {
        margin-right: 0;
      }
      .menu-icon {
        margin-top: 25px;
        margin-bottom: 20px;
      }
      .dt-icon {
        color: #28c76a;
        width: 62px;
        height: 56px;
        background-size: cover;
        display: block;
        margin: 0 auto;
      }
      .policy {
        background-image: url("../../assets/imgs/entry-policy.png");
      }
      .scanning {
        background-image: url("../../assets/imgs/scanning.png");
      }
      .list {
        background-image: url("../../assets/imgs/list.png");
      }
    }
    .invitation {
      overflow: hidden;
      background: #e0f1fe;
      padding: 25px;
      border-top: 1px #ffffff solid;
      border-bottom: 1px #ffffff solid;
      dt {
        float: left;
        width: 146px;
        height: 114px;
        background-image: url("../../assets/imgs/invitation.png");
        background-size: cover;
        margin-left: 30px;
      }
      dd {
        color: #333333;
        font-size: 30px;
        line-height: 45px;
        float: left;
        margin-left: 68px;
      }
      .mt {
        margin-top: 10px;
      }
      .title {
        color: #333;
        font-weight: bold;
        font-size: 28px;
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }
    .records {
      border-top: 1px #e8e8e8 solid;
      background: #fff;
      padding: 20px 30px;
      margin-top: 20px;
      .title {
        color: #666;
        font-size: 30px;
        font-weight: bold;
      }
    }
    .record-item {
      background: #fff;
      margin-top: 20px;
      padding: 15px 20px;
      position: relative;
      border-radius: 10px;
      border: 2px #e8e8e8 solid;
      .title {
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 10px;
        width: 80%;
        .xin {
          color: #ffb618;
          font-style: normal;
          height: 30px;
          width: 30px;
          position: relative;
          top: -16px;
          right: 15px;
        }
      }
      .date {
        color: #666666;
        font-size: 24px;
      }
      .phone {
        background: #54a8dd;
        color: #fff;
        padding: 18px;
        border-radius: 50%;
        position: absolute;
        right: 30px;
        top: 20px;
      }
    }
    .showMore {
      text-align: center;
      color: #999;
      font-size: 26px;
      margin-top: 30px;
    }
    .norecords {
      color: #999;
      font-size: 22px;
      text-align: center;
      .t-img {
        width: 350px;
        height: 300px;
        margin: 0 auto;
        background-image: url("../../assets/imgs/noBaozhang.png");
        background-size: cover;
      }
    }
  }
  .ocr-mask {
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    left: 0;
    top: 0;
    z-index: 99;
    bottom: 0;
    opacity: 0.9;
  }
  .ocr-tips {
    position: absolute;
    width: 270px;
    height: 603px;
    top: -415px;
    //top: 430px;
    left: 31.5%;
    z-index: 1001;
    background-image: url("../../assets/imgs/ocr-tips.png");
    background-size: cover;
  }
}
</style>
