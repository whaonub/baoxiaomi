<template>
  <div
    class="dt-cards card-cardDetails-page"
    :style="cardTemplate == 1?'background:#bdd4da':cardTemplate == 2?'background:#f6e7d7':cardTemplate==3?'background:#c0c0c0':''"
  >
    <div class="cards-content" id="dtcontent" @click="hideMaskOther">
      <div class="details-box">
        <div class="details-img">
          <img src="../../assets/imgs/pen.png" class="pen">
          <img src="../../assets/imgs/file.png" class="file">
          <img src="../../assets/imgs/share-nav.png" class="share-nav" @click="cardFamily">
        </div>
        <div class="details-content">
          <div
            class="details-info"
            :style="cardTemplate == 1?'background:#bdd4da':cardTemplate == 2?'background:#f6e7d7':cardTemplate==3?'background:#c0c0c0':'background: #c2d1ca'"
          >
            <div class="details-card" :class="showContent?'openCard':''">
              <div>
                <div class="delails-line" v-if="this.$store.state.app_token" @click="edit()">
                  <p @click="edit()"></p>
                  <p @click="edit()"></p>
                  <p @click="edit()"></p>
                </div>
                <div class="edit" v-show="showMaskOther">
                  <div @click="editcard" class="edit-template">编辑</div>
                  <div class="edit-template nbottom" @click="editTemplate">更换模板</div>
                  <div class="arrow"></div>
                </div>
                <div
                  class="cardTips editCardTips"
                  v-if="this.$store.state.app_token && guide && guide.cardEdit!=1 && guideStep==0"
                >
                  快去编辑您的名片吧
                  <span class="jttips"></span>
                  <span @click="clearTips('cardEdit')">
                    <icon name="tipdel" class="dt-icon"></icon>
                  </span>
                </div>
                <div
                  class="cardTips openCardTips"
                  v-if="this.$store.state.app_token && guide && guide.openCard!=1 && guideStep==1"
                >
                  展开查看更多信息
                  <span class="jttips"></span>
                  <span @click="clearTips('openCard')">
                    <icon name="tipdel" class="dt-icon"></icon>
                  </span>
                </div>
                <img src="../../assets/imgs/eye.png" class="img-eye">
                <img src="../../assets/imgs/wrist.png" class="img-wrist">
                <img src="../../assets/imgs/keyboard.png" class="img-keyboard">
                <div class="head-user-info">
                  <div
                    class="head-img"
                    :style="cardTemplate == 1?'border:solid 3px #a2d7dd':cardTemplate == 2?'border:solid 3px #fcc0c0':cardTemplate==3?'border:solid 3px #c3a769':''"
                  >
                    <img v-if="this.$store.state.app_token" :src="agentData.photoUrl">
                    <img
                      v-if="!this.$store.state.app_token"
                      src="../../assets/imgs/mr-touxiang.png"
                    >
                  </div>
                  <div
                    class="head-name"
                    v-if="this.$store.state.app_token"
                    v-html="agentData.cardName?agentData.cardName:'姓名'"
                  ></div>
                  <div class="head-name" v-if="!this.$store.state.app_token" v-html="'保小秘'"></div>
                  <div class="head-post">
                    <span
                      class="head-job"
                      v-if="this.$store.state.app_token"
                      v-html="agentData.position?agentData.position:'职位名称'"
                    ></span>
                    <span class="head-job" v-if="!this.$store.state.app_token" v-html="'专业顾问'"></span>
                    <span
                      class="head-year"
                      v-if="this.$store.state.app_token"
                      v-html="yeadr !=undefined && yeadr !=''?' 从业'+yeadr+'年':'从业年限'"
                    ></span>
                    <span class="head-year" v-if="!this.$store.state.app_token" v-html="'从业5年'"></span>
                  </div>
                  <div class="head-phone">
                    <img
                      src="../../assets/imgs/Telephone.png"
                      v-show="cardTemplate==0"
                      class="telephone"
                    >
                    <img
                      src="../../assets/imgs/Telephone01.png"
                      v-show="cardTemplate==1"
                      class="telephone"
                    >
                    <img
                      src="../../assets/imgs/Telephone02.png"
                      v-show="cardTemplate==2"
                      class="telephone"
                    >
                    <img
                      src="../../assets/imgs/Telephone03.png"
                      v-show="cardTemplate==3"
                      class="telephone"
                    >
                    <div
                      class="phone-num"
                      v-if="this.$store.state.app_token"
                      :style="cardTemplate == 1?'color:#6db3bb':cardTemplate == 2?'color:#d77567':cardTemplate==3?'color:#bfa05d':''"
                      v-html="agentData.phoneNumber?agentData.phoneNumber:'你的手机号'"
                    ></div>
                    <div
                      v-if="!this.$store.state.app_token"
                      class="phone-num"
                      :style="cardTemplate == 1?'color:#6db3bb':cardTemplate == 2?'color:#d77567':cardTemplate==3?'color:#bfa05d':''"
                      v-html="'010-57214105'"
                    ></div>
                  </div>
                </div>
                <div
                  class="open"
                  @click="dataList()"
                  :style="showContent?'border:1px solid #c2d1ca':''"
                >
                  <icon class="dt-icon openIcon" name="open" v-if="!showContent"></icon>
                  <icon class="dt-icon openIcon" name="takeup" v-if="showContent"></icon>
                </div>
                <div class="slide" :class="showContent?'animate':''">
                  <div>
                    <div
                      class="autograph"
                      v-if="this.$store.state.app_token"
                      v-html="agentData.sign?agentData.sign:'一句话座右铭'"
                    ></div>
                    <div
                      v-if="!this.$store.state.app_token"
                      class="autograph"
                      v-html="'每一场遇见都值得认真对待，保险让生活更美好！'"
                    ></div>
                    <div class="select">
                      <div
                        class="select-title"
                        v-for="(item,index) in agentData.tags"
                        :key="index"
                        :class="index==1?'label1':index==2?'label2':''"
                      >{{item.tagLable}}</div>
                      <div
                        class="select-title"
                        v-if="this.$store.state.app_token&&tagsNum == 0"
                        v-html="tagsNum ==0?'标签展示':''"
                      ></div>
                      <div class="select-title" v-if="!this.$store.state.app_token" v-html="'金牌管家'"></div>
                      <div
                        class="select-title label1"
                        v-if="!this.$store.state.app_token"
                        v-html="'认真负责'"
                      ></div>
                      <div
                        class="select-title label2"
                        v-if="!this.$store.state.app_token"
                        v-html="'执行力'"
                      ></div>
                    </div>
                    <div class="combination">
                      <div class="company">
                        <img src="../../assets/imgs/company01.png" class="company-img">
                        <span
                          v-if="this.$store.state.app_token"
                          @click="gotoCompany"
                          :style="cardTemplate == 1?'color:#6db3bb':cardTemplate == 2?'color:#d77567':cardTemplate==3?'color:#bfa05d':''"
                          class="company-title"
                          v-html="agentData.companyName?agentData.companyName:'公司名称' "
                        >{{agentData.companyName}}</span>
                        <span
                          v-if="!this.$store.state.app_token"
                          :style="cardTemplate == 1?'color:#6db3bb':cardTemplate == 2?'color:#d77567':cardTemplate==3?'color:#bfa05d':''"
                          class="company-title"
                        >凡适科技有限公司</span>
                      </div>
                      <div class="weChat">
                        <img src="../../assets/imgs/weChat01.png" class="weChat-img">
                        <span
                          v-if="this.$store.state.app_token"
                          class="weChat-title"
                          v-html="agentData.wxNumber?agentData.wxNumber:'你的微信号'"
                        >{{agentData.wxNumber}}</span>
                        <span class="weChat-title" v-if="!this.$store.state.app_token">baomiaomi123</span>
                      </div>
                      <div class="weChat address-title">
                        <img src="../../assets/imgs/address.png" class="address-img">
                        <span
                          class="weChat-title"
                          v-if="this.$store.state.app_token"
                          v-html="agentData.address?agentData.address:'你的地址'"
                        >{{agentData.address}}</span>
                        <span
                          class="weChat-title"
                          v-if="!this.$store.state.app_token"
                        >天津市武清区京津电子商务产业园</span>
                      </div>
                    </div>
                    <div class="honor">
                      <img src="../../assets/imgs/honor.png" class="honor-img">
                      <div class="honor-text">所获荣誉</div>
                    </div>
                    <div class="honor-conten">
                      <div
                        class="honor-positi"
                        v-for="(item,index) in agentData.honors"
                        :key="index"
                      >
                        <span class="honor-box"></span>
                        <p class="honor-title">{{item.str}}</p>
                      </div>
                      <!-- 当为登入或者没有荣誉的时候展示 -->
                      <div class="honor-positi" v-if="this.$store.state.app_token&&honors == 0">
                        <span class="honor-box"></span>
                        <p class="honor-title">你的荣誉展示</p>
                      </div>
                      <div class="honor-positi" v-if="!this.$store.state.app_token">
                        <span class="honor-box"></span>
                        <p class="honor-title">2017年北青报评选“二十大金牌保险人</p>
                      </div>
                      <div class="honor-positi" v-if="!this.$store.state.app_token">
                        <span class="honor-box"></span>
                        <p class="honor-title">2014年续缴保费2400万记录保持者</p>
                      </div>
                      <div class="honor-positi" v-if="!this.$store.state.app_token">
                        <span class="honor-box"></span>
                        <p class="honor-title">2016年MDRT会员</p>
                      </div>
                    </div>
                    <div class="lately-dynamic">
                      <div class="lately-mar">
                        <div class="lately-hear">
                          <h4 class="lately-left">近期动态</h4>
                          <p class="lately-right" @click="seeDynam">查看更多
                            <icon class="dt-icon nextIcon" name="next"></icon>
                          </p>
                        </div>
                        <div v-if="this.$store.state.app_token">
                          <div v-if="dynamicList">
                            <div class="lately-title" v-if="dynamicList.message">
                              <div :class="showTotal ? 'total-introduce' : 'detailed-introduce'">
                                <div class="intro-content" ref="desc">
                                  <span
                                    class="merchant-desc"
                                    v-if="dynamicList.message"
                                  >{{dynamicList.message}}</span>
                                </div>
                              </div>
                              <div
                                class="muiData"
                                @click="showTotalIntro"
                                v-if="showExchangeButton"
                              >
                                <p>{{exchangeButton ? '展开全部' : '收起全部'}}</p>
                              </div>
                            </div>
                            <div class="lately-img">
                              <div
                                class="lately-picture previewer-demo-img"
                                v-for="(item,index) in dynamicList.images"
                                :key="index"
                                @click="imgEnlarge(dynamicList.images,index)"
                              >
                                <img :src="item">
                              </div>
                            </div>
                            <div
                              class="lately-location"
                              v-if="dynamicList.location && dynamicList.location!='null'"
                            >
                              <img src="../../assets/imgs/adds.png" class="location-img">
                              <span>{{dynamicList.location}}</span>
                            </div>
                            <div class="lately-tiem" v-if="dynamicList.likeNum !=undefined">
                              <div class="tiem-box">
                                <p>
                                  <span>{{dynamicList.updateTime}}</span>
                                  <span>{{dynamicList.createTime}}</span>
                                </p>
                              </div>
                              <div class="tiem-right">
                                <span v-if="dynamicList.likeNum>0">{{dynamicList.likeNum}}</span>
                                <img src="../../assets/imgs/save.png">
                              </div>
                            </div>
                          </div>
                          <div class="no-style" v-if="dynamicList ==null">
                            <img src="../../assets/imgs/no-entry.png" class="no-entry">
                            <p class="lately-title1">建议您使用动态发布功能，让客户更了解你</p>
                          </div>
                        </div>
                        <div class="no-style" v-if="!this.$store.state.app_token">
                          <img src="../../assets/imgs/no-entry.png" class="no-entry">
                          <p class="no-entry-text">此功能需登录账户后使用</p>
                        </div>
                      </div>
                    </div>
                    <div class="bont-bottom"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="background:#fff">
          <div style="background:#fff;" class="spot">
            <img src="../../assets/imgs/spot.png" class="spot-img">
          </div>
          <img src="../../assets/imgs/wawa-5.png" class="wawaFont">
          <div class="consultation">
            <h3>当日简讯</h3>
            <p @click="newsletterDay">往日简讯
              <icon class="dt-icon nextIcon" name="next"></icon>
            </p>
          </div>
          <!-- 政治 -->
          <div
            class="journalism"
            v-for="(item,index) in politicsNews"
            :key="index"
            v-if="item.title !='新闻大事件'"
          >
            <flexbox :gutter="0">
              <flexbox-item :span="4.6" align="right">
                <img
                  v-if="cardTemplate == 0"
                  src="../../assets/imgs/gray-tit-bt.png"
                  class="title-img"
                >
                <img v-if="cardTemplate == 1" src="../../assets/imgs/title.png" class="title-img">
                <img
                  v-if="cardTemplate == 2"
                  src="../../assets/imgs/pink-tit-bt.png"
                  class="title-img"
                >
                <img
                  v-if="cardTemplate == 3"
                  src="../../assets/imgs/blue-tit-bt.png"
                  class="title-img"
                >
              </flexbox-item>
              <flexbox-item>
                <h3
                  class="tltle-text"
                  :style="cardTemplate == 1?'color:#6db3bb':cardTemplate == 2?'color:#efc29d':cardTemplate==3?'color:#7385aa':''"
                  align="center"
                >{{item.title}}</h3>
              </flexbox-item>
              <flexbox-item :span="4.6">
                <img
                  v-if="cardTemplate == 0"
                  src="../../assets/imgs/gray-tit-bt.png"
                  class="title-img"
                >
                <img v-if="cardTemplate == 1" src="../../assets/imgs/title.png" class="title-img">
                <img
                  v-if="cardTemplate == 2"
                  src="../../assets/imgs/pink-tit-bt.png"
                  class="title-img"
                >
                <img
                  v-if="cardTemplate == 3"
                  src="../../assets/imgs/blue-tit-bt.png"
                  class="title-img"
                >
              </flexbox-item>
            </flexbox>
            <div class="journalism-box">
              <div v-for="(items,indexs) in item.news" :key="indexs">
                <div class="journalism-text">
                  <span class="journalism-number">{{indexs+1}}</span>
                  <span class="journalism-title">{{items.content}}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 新闻 -->
          <div class="event">
            <div v-for="(item,index) in politicsNews" :key="index" v-if="item.title =='新闻大事件'">
              <div class="event-title">
                <div style="position:relative">
                  <flexbox :gutter="0">
                    <flexbox-item :span="3" align="right">
                      <img src="../../assets/imgs/newsevent-tit-bt.png" class="title-img">
                    </flexbox-item>
                    <flexbox-item>
                      <h3 class="tltle-text" align="center">{{item.title}}</h3>
                    </flexbox-item>
                    <flexbox-item :span="3">
                      <img src="../../assets/imgs/newsevent-tit-bt.png" class="title-img">
                    </flexbox-item>
                  </flexbox>
                </div>
              </div>
              <div class="event-box">
                <div class="event-img" v-for="(items,indexs) in item.news" :key="indexs">
                  <div class="event-tilte">
                    <p>{{items.title}}</p>
                    <p class="event-text">{{items.content}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <flexbox :gutter="0">
                  <flexbox-item :span="7.2"></flexbox-item>
                  <flexbox-item>
                    <div
                      class="event-share"
                      @click="cardFamily"
                      :style="cardTemplate == 1?'background:#7ca0d0':cardTemplate == 2?'background:#d77567':cardTemplate==3?'background:#c3a769':''"
                    >选择简讯并分享</div>
                  </flexbox-item>
                </flexbox>
              </div>
            </div>
            <div
              class="cardTips cardNewsTips"
              v-if="this.$store.state.app_token && guide && guide.cardNews!=1  && guideStep==2"
            >
              分享名片与简讯，专业又吸睛
              <span class="jttips2"></span>
              <span @click="clearTips('cardNews')">
                <icon name="tipdel" class="dt-icon"></icon>
              </span>
            </div>
          </div>
          <div class="browse">
            <div class="browse-box">
              <p class="see">有多少人看过我</p>
              <div v-if="this.$store.state.app_token">
                <flexbox :gutter="0" style="background:#c2d1ca;">
                  <flexbox-item :span="12">
                    <div class="evaluate">
                      <div class="flex-demo" v-for="(item,index) in seeAgentList" :key="index">
                        <div class="flex-border">
                          <img
                            v-if="!item.image"
                            src="../../assets/imgs/name-my.jpg"
                            style="border-radius: 50%"
                          >
                          <img v-if="item.image" :src="item.image" style="border-radius: 50%">
                          <img
                            src="../../assets/imgs/save2.png"
                            v-if="item.isPraised == 1"
                            class="flex-save"
                          >
                        </div>
                        <p class="name">{{item.nickName?item.nickName:'游客'}}</p>
                      </div>
                    </div>
                  </flexbox-item>
                </flexbox>
                <div class="default" v-if="seeAgentList.length >=12 && isMore">
                  <span @click="getShareVisitor(true)">展开更多
                    <icon class="dt-icon" name="open2"></icon>
                  </span>
                </div>
                <div v-if="shareStatus == 0">
                  <div class="no-style">
                    <img src="../../assets/imgs/no-entry.png" class="no-entry">
                    <p class="no-entry-text">分享给微信好友或群，就能看到谁看过了</p>
                  </div>
                </div>
                <div v-if="shareStatus == 1">
                  <div class="no-style">
                    <img src="../../assets/imgs/no-entry.png" class="no-entry">
                    <p class="no-entry-text">还未有微信好友点开阅览</p>
                  </div>
                </div>
              </div>
              <div v-if="!this.$store.state.app_token" class="no-style">
                <img src="../../assets/imgs/no-entry.png" class="no-entry">
                <p class="no-entry-text">此功能需登录账户后使用</p>
              </div>
            </div>
          </div>
          <div class="invitation">
            <Group :class="'sw-color'+cardTemplate">
              <x-switch
                title="托管获客"
                prevent-default
                :value="value"
                v-model="value"
                @on-click="saveById"
              ></x-switch>
            </Group>
            <div
              @click="gotoInvitations"
              class="invitation-img slide"
              :class="value==true?'animate':''"
            >
              <img src="../../assets/imgs/bg4.png">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="maskOther" :class="{'show-mask':showMaskOther}" @click="hideMaskOther"></div>  -->
    <div v-transfer-dom class="img-previewer">
      <previewer :list="list" ref="previewer" :options="options"></previewer>
    </div>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem,
  XSwitch,
  Group,
  TransferDom,
  Previewer
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils";
export default {
  directives: {
    TransferDom
  },
  name: "cardDetails",
  components: {
    dtHeader,
    Flexbox,
    FlexboxItem,
    XSwitch,
    Group,
    Previewer
  },
  data() {
    return {
      showContent: false,
      showContent1: false,
      showTotal: true,
      exchangeButton: true,
      showExchangeButton: false,
      value: false,
      showMaskOther: false,
      tagsNum: 0,
      honors: 0,
      agentData: {},
      yeadr: "",
      dynamicList: null,
      politicsNews: [],
      marketNews: [],
      outlandNews: [],
      jourNews: [],
      seeAgentList: [],
      device: getDevice(),
      shareStatus: "",
      app_token: "",
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
      },
      cardTemplate: 0,
      showMaskOtherNum: 1,
      pageNum: 1,
      isMore: true,
      guide: null,
      guideStep: 0
    };
  },
  created() {
    this.agentData = {};
    this.dynamicList = null;
    this.yeadr = "";
    this.tagsNum = 0;
    this.honors = 0;
    let $this = this;
    this.guide = $this.$store.state.guide;
    window.updatePolicyPage = function() {
      let apptokenObj;
      let device = $this.device;
      if (device == "android") {
        apptokenObj = bmAndroid.getToken();
        if (apptokenObj && apptokenObj != "null") {
          apptokenObj = JSON.parse(apptokenObj);
          $this.$store.state.app_token = apptokenObj.accessToken;
          $this.app_token = apptokenObj.accessToken;
          $this.$store.state.refreshToken = apptokenObj.refreshToken;
          $this.$store.commit("setToken", apptokenObj);
          $this.initData();
          $this.getSameNews(true);
          $this.agentZone();
        } else {
          $this.$store.commit("setToken", {
            accessToken: "",
            refreshToken: ""
          });
          $this.getSameNews(false);
          $this.agentData = {};
          $this.dynamicList = null;
          $this.yeadr = "";
          ($this.tagsNum = 0), ($this.honors = 0), ($this.value = false);
        }
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.getToken.postMessage(null);
        window.getToken = function(obj) {
          if (obj) {
            obj = JSON.parse(obj);
            $this.$store.state.app_token = obj.accessToken;
            $this.app_token = obj.accessToken;
            $this.$store.state.refreshToken = obj.refreshToken;
            $this.$store.commit("setToken", obj);
            $this.initData();
            $this.getSameNews(true);
            $this.agentZone();
          } else {
            $this.$store.commit("setToken", {
              accessToken: "",
              refreshToken: ""
            });
            $this.getSameNews(false);
            $this.agentData = {};
            $this.dynamicList = null;
            $this.yeadr = "";
            ($this.tagsNum = 0), ($this.honors = 0), ($this.value = false);
          }
        };
      }
    };
  },
  watch: {
    "dynamicList.message": function() {
      this.$nextTick(
        function() {
          let rem = parseFloat(this.getRem());
          if (!this.$refs.desc) {
            console.log(this.$refs.desc);
            return;
          }
          let descHeight = window
            .getComputedStyle(this.$refs.desc)
            .height.replace("px", "");
          if (descHeight * 2 > 5.25 * rem) {
            console.log("超过了三行");
            // 显示展开收起按钮
            this.showExchangeButton = true;
            this.exchangeButton = true;
            // 不是显示所有
            this.showTotal = false;
          } else {
            // 不显示展开收起按钮
            this.showExchangeButton = false;
            // 没有超过四行就显示所有
            this.showTotal = true;
          }
        }.bind(this)
      );
    }
  },
  mounted() {
    this.agentData = {};
    this.dynamicList = null;
    this.yeadr = "";
    (this.tagsNum = 0), (this.honors = 0);
    this.showMaskOtherNum = 1;
    this.$store.state.company = null;
    if (this.$store.state.app_token) {
      this.initData();
      this.getSameNews(true);
      this.agentZone();
      this.app_token = this.$store.state.app_token;
    } else {
      this.getSameNews(false);
      this.agentData = {};
      this.dynamicList = null;
      this.yeadr = "";
      (this.tagsNum = 0), (this.honors = 0), (this.value = false);
    }
  },
  methods: {
    getRem() {
      const defaultRem = 12;
      let winWidth = window.innerWidth;
      console.log("winWidth:" + winWidth);
      let rem = (winWidth / 375) * defaultRem;
      return rem;
    },
    showTotalIntro() {
      this.showTotal = !this.showTotal;
      this.exchangeButton = !this.exchangeButton;
    },
    async initData() {
      let results = await api.getAgentCard();
      if (results.status == 1) {
        this.agentData = results.data;
        this.cardTemplate = this.agentData.cardTemplate;
        if (results.data.tags == null) {
          this.tagsNum = 0;
        } else {
          this.tagsNum = results.data.tags.length;
        }
        if (results.data.honors != null) {
          this.honors = results.data.honors.length;
        }
        let workTime = this.agentData.workYears;
        if (workTime) {
          let years = workTime.split("-")[0];
          let month = workTime.split("-")[1];
          let date = new Date();
          let dateYears = date.getFullYear();
          let dateMonth = date.getMonth() + 1;
          let nYears = dateYears - years;
          let workYears;
          if (nYears == 0) {
            workYears = 1;
          }
          if (nYears > 0 && dateMonth - month >= 0) {
            workYears = nYears + 1;
          } else if (nYears > 0) {
            workYears = nYears;
          }
          this.yeadr = workYears;
        }
        if (this.agentData.isInvite == 0) {
          this.value = false;
        } else {
          this.value = true;
        }
        let guide = this.guide;
        if (guide.cardEdit && guide.cardEdit == 1) {
          this.guideStep = 1;
        }
        if (guide.openCard && guide.openCard == 1) {
          this.guideStep = 2;
        }
      }
    },
    //代理人获取最近动态
    async agentZone() {
      this.dynamicList = [];
      let results = await api.getAgentZoneRecentDynamic();
      if (results.status == 1) {
        if (results.data != null) {
          let now = new Date(results.data.updateTime.replace(/-/g, "/"));
          let month = now.getMonth() + 1;
          let date = now.getDate();
          let hours = now.getHours();
          let minutes = now.getMinutes();
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
          this.dynamicList = results.data;
          this.dynamicList.updateTime = month + "-" + date;
          this.dynamicList.createTime = hours + ":" + minutes;
        } else {
          this.dynamicList = null;
        }

        // this.dynamicList = null
      }
    },
    //当日简讯
    async getSameNews(status) {
      let results;
      if (status) {
        results = await api.getNewsByAuth();
        this.pageNum = 1;
        this.getShareVisitor(false);
      } else {
        results = await api.getNews();
      }
      if (results.status == 1) {
        //  let politicsNews= [] //政治
        //  let marketNews = [] //市场
        //  let outlandNews = [] //域外
        // let jourNews  = []  //新闻

        //先清空数据再进行数据渲染
        this.politicsNews = [];
        // this.marketNews = [],
        // this.outlandNews =[],
        // this.jourNews = [],
        this.shareStatus = results.data.shareStatus;
        this.politicsNews = results.data.newsContent;
        // this.marketNews = results.data.market
        // this.outlandNews =results.data.abroad
        // this.jourNews = results.data.bigNews
      }
    },
    //谁看了我
    async getShareVisitor(status) {
      let pageSize = 12;
      let results = await api.getShareVisitor({
        pageNum: this.pageNum,
        pageSize: pageSize
      });
      if (results.status == 1) {
        if (results.data) {
          if (status) {
            this.seeAgentList = this.seeAgentList.concat(results.data);
          } else {
            this.seeAgentList = results.data;
          }
          let total = results.page.total;
          let page = Math.ceil(total / pageSize);
          if (this.pageNum >= page) {
            this.isMore = false;
          }
          this.pageNum++;
        }
      }
    },
    hideMaskOther() {
      if (this.showMaskOtherNum == 1) {
        this.showMaskOtherNum = 2;
      } else {
        this.showMaskOther = false;
        this.showMaskOtherNum = 1;
      }
    },
    dataList() {
      this.showContent = !this.showContent;
      this.clearTips("openCard");
    },
    //代理人特邀开关
    async saveById() {
      if (this.value == true) {
        this.value = false;
        this.agentData.isInvite = 0;
      } else {
        this.value = true;
        this.agentData.isInvite = 1;
      }
      let results = await api.getAgentCardInvite({
        isInvite: this.agentData.isInvite
      });
    },
    cardFamily() {
      // this.$store.commit('getAgentData', this.agentData )
      let pageUrl = "/cardFamily";
      this.gotoPage(pageUrl);
      this.clearTips("cardNews");
      // this.$router.push({path:'/cardFamily',query:{agentName:this.agentData.cardName}})
    },
    //往日简讯
    newsletterDay() {
      let pageUrl = "/newsletterDay";
      //  this.$router.push({path:'/newsletterDay',query:{}})
      this.gotoPage(pageUrl);
    },
    seeDynam() {
      // this.$store.commit('getAgentData', this.agentData )
      let pageUrl = "/seeDynam";
      this.gotoPage(pageUrl);
      // this.$router.push({path:'/seeDynam',query:{}})
    },
    edit() {
      this.showMaskOther = true;
      this.clearTips("cardEdit");
    },
    //编辑页面
    editcard() {
      this.showMaskOther = false;
      // this.$store.commit('getAgentData',this.agentData)
      let pageUrl = "/editCard";
      this.gotoPage(pageUrl);
      // this.$router.push({ path: '/editCard', query: { } })
    },
    //邀约
    gotoInvitations() {
      let pageUrl = "/invitations";
      this.gotoPage(pageUrl);
    },
    //更换模板
    editTemplate() {
      this.showMaskOther = false;
      let pageUrl = "/editTemplate?id=" + this.agentData.cardTemplate;
      this.gotoPage(pageUrl);
    },
    //保险公司
    gotoCompany() {
      if (this.agentData.companyId) {
        let pageUrl = "/companyInfo?companyId=" + this.agentData.companyId;
        this.gotoPage(pageUrl);
      } else {
        this.$toast("暂无保险公司信息");
      }
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
    //图片放大
    imgEnlarge(val, index) {
      console.log(index);
      this.list = [];
      val.forEach(item => {
        this.list.push({ msrc: item, src: item, w: 600, h: 0 });
      });
      setTimeout(() => {
        this.$refs.previewer.show(index);
      }, 400);
    },
    //清除提示
    clearTips(key) {
      if (key == "cardEdit") {
        this.$store.state.guide.cardEdit = 1;
        this.guide.cardEdit = 1;
        this.guideStep = 1;
        this.$userGuide({
          cardEdit: 1
        });
      } else if (key == "cardNews") {
        this.$store.state.guide.cardNews = 1;
        this.guide.cardNews = 1;
        this.$userGuide({
          cardNews: 1
        });
      } else if (key == "openCard") {
        if (this.$store.state.guide.openCard != 1) {
          var div = document.getElementById("dtcontent");
          div.scrollTop = div.scrollHeight;
        }
        this.$store.state.guide.openCard = 1;
        this.guide.openCard = 1;
        this.$userGuide({
          openCard: 1
        });
        this.guideStep = 2;
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

.card-cardDetails-page {
  background: #c2d1ca;
  // padding-top:88px !important;
  .wawaFont {
    margin: 80px 151px;
    width: 374px;
    margin-bottom: 40px;
  }

  //未登录样式
  .no-entry {
    width: 260px;
    height: auto;
    margin: 20px auto 0;
  }
  .no-entry-text {
    text-align: center;
    color: #999;
    font-size: 28px;
    line-height: 54px;
    padding-bottom: 29px;
  }
  .no-style {
    background: #fff;
    text-align: center;
  }
  .muiData {
    padding-left: 14px;
    line-height: 22px;
    color: #7fbe87;
  }
  //已登录
  .dt-header {
    background: #c2d1ca;
    .headerTop {
      background: #c2d1ca;
    }
  }
  .cards-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .vux-1px-b:after {
    border: none;
  }
  .details-box {
    padding: 0 30px;
    position: relative;
    .details-img {
      position: relative;

      .pen {
        position: absolute;
        left: 327px;
        width: 62px;
        top: 18px;
        display: block;
      }
      .file {
        width: 151px;
        padding-left: 451px;
        display: block;
      }
      .share-nav {
        position: absolute;
        top: 15px;
        width: 47px;
        right: 20px;
      }
    }
  }
  .details-content {
    background: #ffffff;
    width: 100%;
    padding: 48px 40px;
    .details-info {
      border-radius: 12px;
    }
    .details-card {
      height: 240px;
      // width: 610px;
      padding-top: 40px;
      position: relative;
      width: 100%;
      // background: #c2d1ca;
      .img-eye {
        position: absolute;
        right: 0;

        top: 54px;
        width: 64px;
      }
      .edit {
        position: absolute;
        right: 14px;
        top: 40px;
        width: 200px;
        padding: 0 10px;
        background-color: #fff;
        position: absolute;
        z-index: 1000;
        text-align: center;
        border-radius: 10px;
        .edit-template {
          line-height: 68px;
          height: 68px;
          color: #666;
          text-align: center;
          border-bottom: 1px solid #e8e8e8;
        }
        .nbottom {
          border-bottom: none;
        }
        .arrow {
          border-width: 15px;
          border-style: solid;
          border-color: transparent transparent #fff;
          width: 0px;
          height: 0px;
          position: absolute;
          top: -25px;
          right: 20px;
        }
      }
      // .edit::before,.edit::after{
      //   width: 0;
      //   height: 0;
      //   border: solid transparent;
      //   position: absolute;
      //   left: 100%;
      //   /*该属性一定要有*/
      //   content:'';
      // }
      // .edit::before{
      //   border-width: 10px;
      //   border-left-color: #0cc;
      //   top:20px;
      // }
      // .edit::after{
      //   border-width: 8px;
      //   border-left-color: #fff;
      //   top:22px;
      // }
      .img-wrist {
        position: absolute;
        right: 87px;
        top: 37px;
        width: 133px;
      }
      .img-keyboard {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 165px;
      }
      .head-user-info {
        position: relative;
        height: 200px;
      }
      .head-img {
        margin: 0 23px 0 31px;
        width: 170px;
        height: 170px;
        background-color: #ffffff;
        border: solid 3px #a2d7dd;
        position: absolute;
        top: 0;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .head-name {
        position: absolute;
        left: 220px;
        top: 9px;
        font-size: 42px;
        font-family: PingFangSC-Medium;
        color: #000000;
      }
      .head-post {
        position: absolute;
        left: 220px;
        top: 75px;
        font-size: 26px;
        color: #000000;
        .head-job {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 180px;
          display: inline-block;
        }
      }
      .head-phone {
        position: absolute;
        left: 220px;
        top: 128px;
        width: 300px;
      }
      .head-year {
        display: inline-block;
        min-width: 100px;
        position: relative;
        bottom: 8px;
        background-color: #cedad5;
        border-radius: 15px 15px 15px 0px;
        font-size: 20px;
        color: #999999;
        line-height: 30px;
        text-align: center;
        padding: 3px;
        margin-left: 4px;
      }
      .telephone {
        width: 36px;
        display: inline-block;
      }
      .phone-num {
        color: #6db3bb;
        font-size: 30px;
        display: inline-block;
        position: relative;
        top: -8px;
      }
      .delails-line {
        position: absolute;
        left: 90%;
        width: 60px;
        top: 0;
        p {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #ffffff;
        }
      }
      .open {
        position: absolute;
        bottom: -20px;
        width: 49px;
        height: 49px;
        left: 280px;
        z-index: 1;
        background: #ffffff;
        border-radius: 50%;
        text-align: center;
        //  border: 1px solid;
        .openIcon {
          line-height: 49px;
          width: 28px;
          // height: 15px;
        }
      }
      .autograph {
        position: relative;
        margin-left: 34px;
        margin-right: 34px;
        font-size: 24px;
        color: #868686;
      }
      .select {
        padding: 5px 34px 15px;
        position: relative;
        border-bottom: 1px solid #d6e8e0;
        .select-title {
          background-color: #ffffff;
          font-size: 24px;
          color: #f6c55a;
          border: solid 2px #f6c55a;
          border-radius: 20px;
          padding: 6px 13px;
          margin-right: 9px;
          margin-top: 8px;
          display: inline-block;
        }
        .label1 {
          border: solid 2px #6aa8fe;
          color: #6aa8fe;
        }
        .label2 {
          border: solid 2px #a1e155;
          color: #a1e155;
        }
      }
      .company {
        position: relative;
        padding-left: 39px;
        padding-top: 14px;
        padding-bottom: 5px;
        .company-img {
          width: 29px;
          // height: 27px;
        }
        .company-title {
          position: absolute;
          left: 85px;
          top: 16px;
          font-size: 30px;
          color: #6db3bb;
        }
      }
      .address-title {
        padding-bottom: 18px;
        margin-right: 20px;
        .address-img {
          width: 31px;
          position: relative;
          top: 3px;
        }
      }
      .weChat {
        position: relative;
        padding-left: 39px;
        padding-top: 10px;
        .weChat-img {
          width: 31px;
          // height: 27px;
          // height: 100%;
          display: inline-block;
        }
        .weChat-title {
          margin-left: 10px;
          font-size: 26px;
          color: #58787c;
        }
      }
      .combination {
        border-bottom: 1px solid #d6e8e0;
        .company-img {
          position: relative;
          top: 5px;
        }
        .weChat-img {
          position: relative;
          top: 3px;
        }
      }
      .honor {
        position: relative;
        padding-left: 39px;
        padding-top: 15px;
        padding-bottom: 10px;
        .honor-img {
          position: absolute;
          top: 17px;
          width: 26px;
        }
        .honor-text {
          font-size: 30px;
          padding-left: 43px;
          color: #666666;
        }
      }
      .honor-conten {
        padding-bottom: 24px;
      }
      .honor-positi {
        position: relative;
        padding-left: 39px;
        .honor-box {
          width: 6px;
          height: 6px;
          background-color: #6a9094;
          border-radius: 50%;
          display: block;
          float: left;
          position: absolute;
          top: 15px;
          left: 50px;
        }
        .honor-title {
          font-size: 24px;
          color: #58787c;
          line-height: 36px;
          padding-left: 40px;
        }
      }
      .lately-dynamic {
        margin: 0 20px;
        // margin-bottom: 59px;
        background: #ffffff;
        box-shadow: 2px 4px 10px 0px rgba(0, 0, 0, 0.04);
        border-radius: 10px;
        position: relative;
        .lately-mar {
          padding: 5px 37px;
          .lately-hear {
            padding: 15px 8px;
            border-bottom: 1px solid #e8e8e8;
            font-size: 21px;

            .lately-left {
              color: #333333;
              // float: left;
              display: inline-block;
            }
            .lately-right {
              float: right;
              color: #999999;
              .nextIcon {
                width: 19px;
                height: 19px;
                // line-height: 28px;
                padding-bottom: 3px;
              }
            }
          }
          .lately-title {
            padding: 10px 8px;
            font-size: 20px;
            color: #333333;
          }
          .lately-title1 {
            text-align: center;
            color: #cccccc;
            font-size: 20px;
            line-height: 54px;
            padding-bottom: 39px;
          }
          .lately-img {
            padding: 0 8px;
            .lately-picture {
              width: 151px;
              height: 151px;
              display: inline-block;
              background: #a2d7dd;
              border-radius: 10px;
              margin-left: 3px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .lately-location {
            padding-left: 16px;
            padding-bottom: 15px;
            img {
              width: 23px;
              height: 23px;
              display: inline-block;
              position: relative;
              bottom: -3px;
            }
            span {
              color: #4ed388;
              font-size: 17px;
            }
          }
          .lately-tiem {
            padding-left: 16px;
            padding-bottom: 21px;
            font-size: 17px;
            color: #666666;
            position: relative;
            .tiem-box {
              display: inline-block;
            }
            .tiem-right {
              position: absolute;
              top: 0;
              right: 0;
              font-size: 17px;
              color: #333333;
              img {
                width: 28px;
              }
            }
          }
        }
      }
      .bont-bottom {
        padding-top: 59px;
      }
      .slide {
        display: none;
      }
    }
    .openCard {
      height: auto;
      .slide {
        display: block;
      }
    }
  }
  .spot {
    margin: 0 41px;
    .spot-img {
      display: block;
      width: 100%;
    }
  }

  .consultation {
    padding: 20px 41px;
    border-bottom: 1px solid #e8e8e8;
    h3 {
      font-size: 30px;
      color: #000000;
      display: inline-block;
    }
    p {
      float: right;
      font-size: 28px;
      color: #999999;
      .nextIcon {
        font-size: 28px;
        width: 28px;
      }
    }
  }
  .tltle-text {
    font-size: 30px;
    color: #46869b;
  }
  .title-img {
    width: 32px;
    height: 24px;
  }
  .journalism {
    padding-top: 26px;
    .journalism-number {
      width: 24px;
      height: 24px;
      background-color: #c2d1ca;
      font-size: 20px;
      border-radius: 50%;
      color: #333333;
      line-height: 24px;
      text-align: center;
      display: inline-block;
      margin-right: 10px;
    }

    .journalism-box {
      padding: 26px 41px 0 41px;
    }
    .journalism-text {
      font-size: 24px;
      color: #333333;
      line-height: 44px;
    }
    .title-img {
      position: relative;
      top: 3px;
    }
  }
  .event {
    padding: 0 40px;
    padding-top: 60px;
    padding-bottom: 29px;
    position: relative;
    .event-title {
      width: 45%;
      height: 70px;
      background-image: linear-gradient(0deg, #df9374 0%, #eebaa4 100%);
      border-radius: 35px;
      position: absolute;
      top: 35px;
      left: 27.5%;
      .tltle-text {
        font-size: 28px;
        color: #fff;
        line-height: 70px;
      }
      .title-img {
        width: 32px;
        height: 26px;
        position: relative;
        top: 3px;
        margin-left: 8px;
        margin-right: 8px;
        //  line-height: 90px;
      }
    }
    .event-box {
      width: 100%;
      border: 4px solid #df9374;
      border-radius: 40px;
      padding: 30px 0 20px;
      .event-img {
        width: 100%;
        height: 100%;
        background-image: url(../../assets/imgs/background.png);
        background-size: 100% 100%;
        .event-tilte {
          padding: 25px 34px 8px;
          color: #df9374;
          line-height: 44px;
          .event-text {
            font-size: 24px;
            color: #333333;
          }
        }
      }
    }
    .event-share {
      width: 240px;
      height: 61px;
      background-color: #6db3bb;
      border-radius: 30px;
      line-height: 61px;
      // padding-top: 30px;
      margin-top: 30px;
      font-size: 26px;
      color: #ffffff;
      text-align: center;
    }
  }
  .browse {
    padding: 10px 40px;
    .browse-box {
      background-color: #c2d1ca;
      border-radius: 12px;
      width: 610px;
      .browse-title {
        text-align: center;
        line-height: 40px;
        font-size: 30px;
        padding-bottom: 20px;
      }
      .line {
        margin: 0 24px;
        border: solid 2px #c2d1ca;
      }
      .see {
        padding-left: 12px;
        background: #c2d1ca;
        font-size: 24px;
        padding-top: 20px;
        padding-bottom: 20px;
      }
      .flex-demo {
        display: inline-block;
        padding: 4px 15px;
        .flex-border {
          width: 70px;
          border-radius: 50%;
          position: relative;
          img {
            width: 100%;
          }
          .flex-save {
            width: 27px;
            position: absolute;
            top: -6px;
            right: -7px;
          }
        }
        p {
          padding: 10px 0;
        }
      }
      .evaluate {
        background: #c2d1ca;
        overflow: hidden;
        .name {
          text-align: center;
          width: 70px;
          overflow: hidden;
          height: 50px;
          line-height: 50px;
          margin-bottom: 10px;
          font-size: 24px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .flex-demo {
          float: left;
        }
      }
      .default {
        text-align: center;
        padding-top: 24px;
        padding-bottom: 30px;
        font-size: 26px;
        color: #999999;
        .dt-icon {
          position: relative;
          top: -4px;
        }
      }
    }
  }
  .invitation {
    padding: 20px 31px 40px 43px;
    .weui-cell {
      padding: 10px 7px 10px 0;
    }
    .weui-cells:before {
      border-top: 0.5px solid #fff;
    }
    .weui-cells:after {
      border-top: 0.5px solid #fff;
      border-bottom: 0.5px solid #fff;
    }
    .invitation-img {
      overflow: hidden;
      padding-top: 20px;
      width: 100%;
      img {
        width: 100%;
        border-radius: 10px;
      }
    }
    .weui-label {
      font-size: 0.03733rem;
      font-weight: bold;
    }
  }
  .slide {
    // padding-left: .5rem;
    max-height: 0px;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
  }
  .animate {
    max-height: 9999px !important;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
  .slideSize {
    max-height: 95px;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
  }
  .animateSize {
    max-height: 9999px !important;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
  .maskOther {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    opacity: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    z-index: -1;
    transition: opacity 400ms;
  }
  .show-mask {
    opacity: 1;
    z-index: 500;
  }

  .total-introduce {
    height: auto;
    overflow: hidden;
    color: #434343;
    margin: 10px;
    .intro-content {
      // overflow: hidden;
      // -webkit-line-clamp: 3;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-box-orient: vertical;
      .merchant-desc {
        width: 100%;
        word-break: break-all;
        line-height: 22px;
      }
    }
    .unfold {
      display: block;
      z-index: 11;
      float: right;
      width: 80px;
      height: 22px;
      p {
        margin: 0;
        line-height: 22px;
        color: #7fbe87;
      }
    }
  }
  .detailed-introduce {
    font-size: 14px;
    color: #434343;
    position: relative;
    overflow: hidden;
    margin: 10px;
    .intro-content {
      overflow: hidden;
      -webkit-line-clamp: 3;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      .merchant-desc {
        width: 100%;
        line-height: 22px;
      }
      &:after,
      // 这是展开前实际显示的内容
      &:before {
        content: attr(title);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        color: #434343;
        // overflow: hidden;
      }
      // 把最后最后一行自身的上面两行遮住
      &:before {
        display: block;
        overflow: hidden;
        z-index: 1;
        max-height: 44px;
        background: #ffffff;
      }
      &:after {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 81px;
        /*截取行数*/
        -webkit-line-clamp: 3;
        text-overflow: ellipsis;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        /*行首缩进字符数，值为[(截取行数-1)*尾部留空字符数]*/
        // text-indent: -12em;
        /*尾部留空字符数*/
        // padding-right: 4em;
        display: none;
      }
      .unfold {
        z-index: 11;
        width: 80px;
        height: 22px;
        outline: 0;
        position: absolute;
        right: 0;
        bottom: 0;
        p {
          margin: 0;
          line-height: 22px;
          color: #7fbe87;
        }
      }
    }
  }
  .bottom-prove {
    height: 100px;
    width: 100%;
    background: #dddddd;
    text-align: center;
    line-height: 100px;
  }
  .change-buttom {
    font-size: 14px;
    color: #2371be;
    .long {
      text-align: 22px;
      text-align: center;
      height: 22px;
    }
    .short {
      text-align: 22px;
      text-align: center;
      height: 22px;
    }
  }
  .cardTips {
    background-color: #28c76a;
    border-radius: 10px;
    color: #fff;
    width: 280px;
    height: 55px;
    line-height: 55px;
    padding: 0 28px;
    position: absolute;
    z-index: 999;
    font-size: 22px;
    .jttips {
      width: 20px;
      height: 10px;
      position: absolute;
      right: 54px;
      top: -10px;
      background-image: url(../../assets/imgs/jttips.png);
      background-size: cover;
    }
    .jttips2 {
      width: 20px;
      height: 10px;
      position: absolute;
      right: 104px;
      bottom: -10px;
      background-image: url(../../assets/imgs/jttips2.png);
      background-size: cover;
    }
    .dt-icon {
      width: 24px;
      height: 24px;
      position: absolute;
      right: 5px;
      top: 5px;
      color: #fff;
    }
  }
  .editCardTips {
    right: -24px;
    top: 40px;
  }
  .openCardTips {
    left: 110px;
    bottom: -90px;
    width: 260px;
  }
  .cardNewsTips {
    right: 60px;
    bottom: 106px;
    width: 390px;
  }
  .weui-switch:after,
  .weui-switch-cp__box:after {
    width: 23px;
    height: 23px;
  }
  .weui-switch:before,
  .weui-switch-cp__box:before {
    height: 23px;
    width: 46px !important;
  }
  .weui-switch,
  .weui-switch-cp__box,
  .vux-x-switch-overlay {
    width: 48px !important;
    height: 25px;
  }

  .sw-color0 {
    .weui-switch:checked,
    .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
      border-color: #46869b !important;
      background-color: #46869b !important;
    }
  }
  .sw-color1 {
    .weui-switch:checked,
    .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
      border-color: #6db3bb !important;
      background-color: #6db3bb !important;
    }
  }
  .sw-color2 {
    .weui-switch:checked,
    .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
      border-color: #efc29d !important;
      background-color: #efc29d !important;
    }
  }
  .sw-color3 {
    .weui-switch:checked,
    .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
      border-color: #7385aa !important;
      background-color: #7385aa !important;
    }
  }
}
.ios,
.iPhoneX {
  .card-cardDetails-page .details-box .details-img .share-nav {
    top: 8px;
  }
}
</style>
