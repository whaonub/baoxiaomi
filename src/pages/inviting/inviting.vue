<template>
  <div class="dt-pages inviting">
    <x-dialog v-model="showDialog">
      <div class="inviting-rules">
        <div class="detail">
          <!-- <div>奖励规则：</div> -->
          <div>一、活动时间</div>
          <div>本活动自2018年12月10日(含当日)开始生效。</div>
          <div>二、如何邀请</div>
          <div>1. 好友通过您分享的链接或二维码注册成功后，即可成为您的邀请好友（若好友自行下载APP注册则不算入您的邀请好友之列）</div>
          <div>2. 邀请好友仅限未注册过的新用户。</div>
          <div>三、邀请奖励</div>
          <div>1. 邀请好友注册成功后，即可绑定与您的邀请关系，邀请关系终身有效；</div>
          <div>2. 您可获得的奖励</div>
          <div>邀请好友注册成为【保小秘】APP新用户，好友下载APP并用手机登录，您即可获得80个金豆，每人每天可邀请的好友人数上不封顶；累计邀请3位好友可获得7天会员（注：7天会员只可获得1次）</div>
          <div>3. 好友可获得的奖励</div>
          <div>好友接受邀请注册成功并登录保小秘客户端APP，奖励288个金豆，每位新用户能且仅能享受1次新手奖励。</div>
          <div>四、恶意获取奖励惩罚</div>
          <div>同一登录账号、同一手机号、同一终端设备号等合理显示为同一用户的情形，均视为同一用户。若存在但不限于以下行为：恶意邀请、作弊等，一经发现立即取消资格、追回已获得奖励。</div>
          <div>五、本活动最终解释权归保小秘APP所有。</div>
        </div>
      </div>
      <div class="cancelBtn" @click="cancelClick">
        <icon name="cancel" class="dt-icon cancel"></icon>
      </div>
    </x-dialog>
    <div class="dt-header">
      <dtHeader
        title="邀请有礼"
        rightIcon="share"
        :leftBack="false"
        @headerLeft="goBack"
        @headerRight="handleAction"
      ></dtHeader>
    </div>
    <div class="dt-content">
      <base-scroll
        class="scroll"
        :probeType="3"
        :bounce="false"
        :listenScroll="true"
        @scroll="listenScroll"
        ref="scroll"
      >
        <div>
          <div class="inviting-top">
            <div class="float-right" @click="changeShow">活动规则
              <icon name="right" class="dt-icon right"></icon>
            </div>
            <img src="../../assets/imgs/inviting-top.png" alt>
          </div>
          <div class="inviting-strategy">
            <div class="inviting-strategy-good">
              <div>
                累计邀请3位好友获得
                <span>7天会员</span>
              </div>
              <div>
                邀请人可获得
                <span>80金豆</span>
              </div>
              <div>
                好友获得
                <span>288金豆</span>
              </div>
            </div>
            <div class="inviting-step">
              <img src="../../assets/imgs/inviting-strategy.png" alt>
            </div>
          </div>
          <div class="inviting-lists">
            <div ref="crunchiesBox" class="crunchies-box">
              <div ref="crunchies" class="crunchies">
                <div class="tab">
                  <div
                    class="tab-item"
                    :class="showActive == index? 'active':''"
                    v-for="(item,index) in tab"
                    @click="changeKey(index)"
                    :key="index"
                  >
                    <div>{{item.text}}</div>
                    <i></i>
                  </div>
                  <span></span>
                </div>

                <div class="tabList">
                  <div class="mine" v-if="showActive == 0">
                    <div v-if="listNumber">
                      <div class="list-title">
                        您已邀请{{inviteData.totalInviter}}人，共得{{inviteData.invitationPoint}}
                        <img
                          src="../../assets/imgs/inviting-doudou.png"
                          alt
                        >
                        相当于赚了{{inviteData.pointMoney}}元
                      </div>
                      <div class="list" v-for="(item,index) in inviteList" :key="index">
                        <img :src="item.imgUrl" alt>
                        <div>
                          <span>{{item.phoneNum | formatPhoneNums}}</span>
                          <span>{{item.createTime}}</span>
                          <span>注册</span>
                        </div>
                      </div>
                      <div @click="moreClickInvite" class="showMore">{{isMoreInvite?'显示更多':'没有更多了'}}</div>
                    </div>
                    <div class="noInviting" v-else>
                      <img src="../../assets/imgs/none.png" alt>
                    </div>
                  </div>
                  <div class="bole" v-else>
                    <div class="bole-list" v-for="(item,index) in boleList" :key="index">
                      <div class="list-left">
                        <div v-if="index == 0" class="me-box">
                          <img class="me" src="../../assets/imgs/bd-me.png" alt>
                        </div>
                        <img v-if="index == 1" class="pm" src="../../assets/imgs/bd-pm1.png" alt>
                        <img v-if="index == 2" class="pm" src="../../assets/imgs/bd-pm2.png" alt>
                        <img v-if="index == 3" class="pm" src="../../assets/imgs/bd-pm3.png" alt>
                        <div v-if="index > 3" class="me-box">{{index}}</div>
                        <img class="tx" :src="item.photoUrl" alt>
                        <div class="info">
                          <span>{{item.cardName}}</span>
                          <span>已获得{{item.invitationPoint}}金豆</span>
                        </div>
                      </div>
                      <span style="width:30%">
                        已邀
                        <font color="#ff950e">{{item.totalInviter}}</font>人
                      </span>
                    </div>
                    <div @click="moreClick" class="showMore">{{isMoreBole?'显示更多':'没有更多了'}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </base-scroll>
      <div class="inviting-btn">
        <div @click="handleAction">分享邀请好友</div>
        <div @click="handlePoster">立即生成邀请海报</div>
      </div>
    </div>
    <div class="bottom_mark" v-if="showAction"></div>
    <inviting-poster
      v-if="showInvitingPoster"
      :QRcode="QRcode"
      @savePic="savePic"
      @wechatFriends="wechatFriends"
      @friends="friends"
      @hideP="toHidePoster"
    ></inviting-poster>
  </div>
</template>

<script>
let CRUNCHIESDOM;
let CRUNCHIESBOXDOM;
import api from "@/api/index";
import { XDialog } from "vux";
import dtHeader from "@/components/dtHeader";
import BaseScroll from "@/components/baseScroll";
import invitingPoster from "./invitingPoster";
import { getDevice, Base64 } from "@/config/utils";
import { wechatService } from "@/config/env";

export default {
  name: "inviting",
  components: {
    dtHeader,
    XDialog,
    invitingPoster,
    BaseScroll
  },
  data() {
    return {
      device: getDevice(),
      tab: [{ text: "我的邀请" }, { text: "伯乐榜单" }],
      showActive: 0,
      showDialog: false,
      showInvitingPoster: false,
      listNumber: false,
      showAction: false,
      boleList: [],
      boleParam: {
        pageNum: 1,
        pageSize: 5
      },
      isMoreBole: true,
      inviteList: [],
      inviteParam: {
        pageNum: 1,
        pageSize: 5
      },
      isMoreInvite: true,
      inviteData: {},
      QRcode: ""
    };
  },
  created() {
    window.shareResult = function() {};
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    // 面对面邀请
    window.faceToFace = () => {
      this.$router.push("/invitingFace");
    };
    this.initData();
  },
  mounted() {
    this.$nextTick(() => {
      CRUNCHIESBOXDOM = this.$refs.crunchiesBox;
      CRUNCHIESDOM = this.$refs.crunchies;
      CRUNCHIESBOXDOM.style.height = CRUNCHIESDOM.offsetHeight + 14 + "px";
      setTimeout(() => {
        CRUNCHIESBOXDOM.style.height = CRUNCHIESDOM.offsetHeight + 14 + "px";
      }, 1000);
    });
  },
  filters: {
    // 手机号脱敏显示
    formatPhoneNums(val) {
      let pat = /(\d{3})\d*(\d{4})/;
      let phoneNum = val.replace(pat, "$1****$2");
      return phoneNum;
    }
  },
  methods: {
    initData() {
      this.getMyInvite();
      this.getBestInvitation();
    },
    // 我的邀请数据
    async getMyInvite() {
      let res = await api.getMyInvitationPage(this.inviteParam);
      if (res.status == 1) {
        if (res.data == null) {
          this.listNumber = false;
        } else {
          this.listNumber = true;
          this.inviteList = res.data;
        }
      } else {
        this.$alert(res.msg);
        return;
      }

      let result = await api.getMyInvitation();
      if (result.status == 1) {
        this.inviteData = result.data;
      } else {
        this.$alert(result.msg);
        return;
      }
    },
    // 伯乐榜单数据
    async getBestInvitation() {
      let res = await api.getBestInvitation(this.boleParam);
      if (res.status == 1) {
        this.boleList = res.data;
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    changeShow() {
      this.showDialog = !this.showDialog;
    },
    cancelClick() {
      this.showDialog = !this.showDialog;
    },
    // 切换选项卡
    changeKey(index) {
      this.showActive = index;
      this.$nextTick(() => {
        CRUNCHIESBOXDOM.style.height = CRUNCHIESDOM.offsetHeight + 14 + "px";
      });
    },
    // 分享给好友
    async handleAction() {
      let res = await api.getInvitationCode();
      if (res.status != 1) {
        this.$alert(res.msg);
        return;
      }
      let obj = {
        type: 3,
        shareChannel: "127",
        title: "我正在用保小秘APP帮客户整理保单，送你288个金豆手慢无!", //标题
        content:
          this.inviteData.cardName + "邀请你成为保小秘会员，轻松获客，展业无忧", //内容，副标题
        clickUrl:
          wechatService +
          "/invitee?id=" +
          res.data.str +
          "&name=" +
          this.inviteData.cardName, //链接
        pictureBase64:
          "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",
        pictureUrl: location.origin + "/static/img/invite.png"
      };
      this.$share(obj);
    },

    // 显示隐藏海报
    async handlePoster() {
      let res = await api.getQRCode();
      if (res.status == 1) {
        this.QRcode = res.data.str;
        this.showInvitingPoster = !this.showInvitingPoster;
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    toHidePoster() {
      this.showInvitingPoster = !this.showInvitingPoster;
    },
    // 分享-微信好友
    wechatFriends(img) {
      let obj = {
        type: 2,
        shareChannel: "1",
        pictureBase64: img
      };
      this.$share(obj);
    },
    // 分享-朋友圈
    async friends(img) {
      let res = await api.getInvitationCode();
      if (res.status != 1) {
        this.$alert(res.msg);
        return;
      }
      let obj = {
        type: 3,
        shareChannel: "2",
        title: "我正在用保小秘APP帮客户整理保单，送你288个金豆手慢无!", //标题
        content:
          this.inviteData.cardName + "邀请你成为保小秘会员，轻松获客，展业无忧", //内容，副标题
        clickUrl:
          wechatService +
          "/invitee?id=" +
          res.data.str +
          "&name=" +
          this.inviteData.cardName, //链接
        pictureBase64:
          "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",
        pictureUrl: location.origin + "/static/img/invite.png"
      };
      this.$share(obj);
    },
    // 保存图片
    savePic(img) {
      let device = this.device;
      if (device == "android") {
        bmAndroid.savePicture(img);
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.savePicture.postMessage(img);
      }
    },

    // 查看更多-我的邀请
    async moreClickInvite() {
      if (this.isMoreInvite) {
        this.inviteParam.pageNum++;
        let res = await api.getMyInvitationPage(this.inviteParam);
        if (res.status == 1) {
          if (res.data == null) {
            this.isMoreInvite = false;
          } else {
            this.inviteList.push(...res.data);
            this.$nextTick(() => {
              CRUNCHIESBOXDOM.style.height =
                CRUNCHIESDOM.offsetHeight + 14 + "px";
            });
          }
        } else {
          this.$alert(res.msg);
          return;
        }
      }
    },
    // 查看更多-伯乐
    async moreClick() {
      if (this.isMoreBole) {
        this.boleParam.pageNum++;
        let res = await api.getBestInvitation(this.boleParam);
        if (res.status == 1) {
          if (res.data == null) {
            this.isMoreBole = false;
          } else {
            this.boleList.push(...res.data);
            this.$nextTick(() => {
              CRUNCHIESBOXDOM.style.height =
                CRUNCHIESDOM.offsetHeight + 14 + "px";
            });
          }
        } else {
          this.$alert(res.msg);
          return;
        }
      }
    },
    // 监控滚动做出票动画
    listenScroll(axis) {
      let scrollTop = Math.abs(axis.y);
      let crunchiesTop = (CRUNCHIESDOM.offsetTop + 20) / 2;

      if (scrollTop >= crunchiesTop) {
        CRUNCHIESDOM.style.top = "0px";
      }
    },
    // 返回
    goBack() {
      if (
        this.$route.query.from == "task" ||
        this.$route.query.from == "celebrity"
      ) {
        this.$router.go(-1);
        return;
      }
      let device = this.device;
      if (device == "android") {
        bmAndroid.goHomePage();
      } else if (device == "ios" || device == "iPhoneX") {
        let isPc = this.$store.state.isPc;
        if (!isPc) {
          window.webkit.messageHandlers.goHomePage.postMessage(null);
        } else {
          this.$router.go(-1);
        }
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>
<style lang="less">
.ios .inviting {
  padding-top: 0.169rem !important;
  .dt-header {
    background: #4687f2 !important;
    .headerTop {
      background: #4687f2 !important;
    }
  }
  .dt-content {
    padding-bottom: 0.169rem !important;
  }
}
.iPhoneX .inviting {
  padding-top: 0.222rem !important;
  .dt-header {
    background: #4687f2 !important;
    .headerTop {
      background: #4687f2 !important;
    }
  }
  .dt-content {
    padding-bottom: 0.222rem !important;
  }
}
.inviting {
  // padding-top: 0 !important;
  background: #fff4cb;
  position: relative !important;
  .dt-header {
    background: #4687f2 !important;
    .headerTop {
      background: #4687f2 !important;
    }
  }
  .dt-content {
    margin-top: -1px;
    height: 100vh;
    padding-bottom: 230px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: static !important;

    .inviting-top {
      position: relative;
      .float-right {
        position: absolute;
        color: #fff;
        width: 200px;
        height: 70px;
        font-size: 28px;
        border-radius: 35px 0 0 35px;
        text-align: center;
        line-height: 70px;
        top: 20px;
        background: #000;
        opacity: 0.5;
        right: 0;
        text-indent: 20px;
        z-index: 99 !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        width: 100%;
      }
    }
    .inviting-strategy {
      padding: 0 30px;
      .inviting-strategy-good {
        height: 302px;
        background: url("../../assets/imgs/inviting-reward.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 30px 0 20px 210px;
        font-size: 30px;
        // font-weight: 600;
        letter-spacing: 2px;
        span {
          color: #ffb41d;
        }
      }
      .inviting-step {
        img {
          width: 100%;
          margin-top: 32px;
        }
      }
    }
    .inviting-lists {
      width: 700px;
      // min-height: 880px;
      padding: 32px 20px 0;
      margin: 32px auto 32px;
      background: url("../../assets/imgs/inviting-lists.png") no-repeat;
      background-size: 100%;
      overflow: hidden;
      position: relative;
      .crunchies-box {
        // min-height: 806px;
        position: relative;
        overflow: hidden;
        .crunchies {
          transition: top 3s;
          overflow: hidden;
          width: 662px;
          position: absolute;
          top: -880px;
        }
        .tab {
          display: flex;
          position: relative;
          text-align: center;
          span {
            position: absolute;
            left: 50%;
            height: 36px;
            width: 2px;
            background: #f99d40;
            margin-top: 32px;
          }
          .tab-item {
            width: 50%;
            height: 100px;
            background: #ffe9ad;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            color: #ffb41d;
            div {
              padding-top: 32px;
              font-size: 30px;
            }
          }
          .tab-item.active {
            font-weight: 900;
            i {
              display: block;
              width: 96px;
              height: 6px;
              background: #f95454;
            }
          }
        }
        .tabList {
          // background-color: #fff;
          .mine {
            text-align: center;
            font-size: 24px;
            color: #f67506;
            // background-color: #fff;
            background: url("../../assets/imgs/inviting-noting.png") no-repeat
              left bottom;
            background-size: 100%;
            > div {
              > div {
                background: #fff;
              }
            }
            img {
              width: 50px;
              height: 30px;
            }
            .list-title {
              height: 80px;
              line-height: 90px;
            }
            .list {
              display: flex;
              justify-content: center;
              height: 115px;
              align-items: center;
              img {
                width: 70px;
                height: 70px;
                border-radius: 35px;
                background: #ccc;
              }
              div {
                height: 115px;
                padding-left: 24px;
                line-height: 115px;
                border-bottom: 2px solid #ffe077;
                span {
                  margin-right: 20px;
                }
                span:nth-of-type(1) {
                  color: #000;
                }
                span:nth-of-type(2) {
                  color: #979797;
                }
                span:nth-of-type(3) {
                  color: #979797;
                }
              }
            }
            .noInviting {
              padding: 200px 0px;
              // background: url("../../assets/imgs/inviting-bottom.png") no-repeat
              //   left bottom;
              // background-size: 100%;
              img {
                width: 400px;
                height: 300px;
              }
            }
            .showMore {
              height: 104px;
              line-height: 104px;
              font-size: 28px;
              color: #b2b2b2;
              background: url("../../assets/imgs/inviting-bottom.png") no-repeat;
              background-size: 100% 100%;
            }
          }

          .bole {
            font-size: 26px;
            color: #000;
            // padding: 30px 36px;
            text-align: center;
            div {
              background: #fff;
            }
            .bole-list {
              display: flex;
              justify-content: space-around;
              align-items: center;
              height: 130px;
              border-bottom: 2px solid #ffe077;
              padding: 0 36px;
              .list-left {
                width: 70%;
                display: flex;
                align-items: center;
                .me-box {
                  width: 36px;
                  height: 48px;
                  line-height: 52px;
                  text-align: center;
                  font-size: 30px;
                  color: #908f8f;
                  .me {
                    width: 28px;
                    height: 28px;
                    background-color: transparent;
                  }
                }
                .pm {
                  width: 36px;
                  height: 48px;
                  background-color: transparent;
                }
                .tx {
                  width: 70px;
                  height: 70px;
                  border-radius: 50%;
                  margin-left: 25px;
                  margin-right: 20px;
                  align-self: flex-start;
                }
                .info {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: center;
                  width: 66%;
                  span {
                    width: 100%;
                    height: 40px;
                    color: #979797;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: left;
                  }
                  span:nth-of-type(1) {
                    color: #000;
                  }
                }
              }
            }
            .showMore {
              height: 104px;
              line-height: 104px;
              font-size: 28px;
              color: #b2b2b2;
              background: url("../../assets/imgs/inviting-bottom.png") no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
    .inviting-btn {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #ffe9ad;
      height: 140px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 99 !important;
      div {
        width: 330px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        background: url("../../assets/imgs/inviting-btn-bg.png") no-repeat;
        background-size: 100% 100%;
        font-size: 30px;
        color: #fff;
      }
    }
  }

  .weui-dialog {
    width: 100%;
    height: 1.0133333333333334rem;
    max-width: 1.3333333333333333rem;
    background: url("../../assets/imgs/inviting-deatil.png") no-repeat;
    background-size: 100%;
    background-position: bottom;
  }
  .inviting-rules {
    height: 740px;
    padding-top: 30px;
    .detail {
      background: #ffeed0;
      width: 490px;
      height: 600px;
      margin: 100px auto 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      text-align: left;
      padding: 10px;
      line-height: 46px;
      font-size: 24px;
      letter-spacing: 2px;
      color: #836e56;
    }
  }
  .bottom_mark {
    background: #000;
    opacity: 0.7;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 1001 !important;
  }
  .cancelBtn {
    width: 70px;
    height: 70px;
    position: absolute;
    right: 100px;
    top: 0;
  }
  .cancel {
    width: 50px;
    height: 50px;
  }
}
</style>
