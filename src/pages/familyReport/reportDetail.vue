<template>
  <div class="dt-pages family-reports-detail-page">
    <div class="dt-header" ref="topInfo">
      <dt-header
        title="个人详版"
        rightText="家庭版"
        @headerRight="goBack"
        :leftBack="false"
        @headerLeft="goBack"
        textColor="#fff"
      ></dt-header>
    </div>
    <div class="current-content" :style="{'top':headerHeight - 2 +'px'}">
      <div class="bs-wrapper">
        <base-scroll
          :pullup="true"
          @scrollToEnd="scrollToEnd"
          :scrollStart="true"
          @scrollStart="scrollStart"
          :probeType="3"
          :bounce="false"
          :listenScroll="true"
          @scroll="listenScroll"
          ref="scroll"
          class="scroll"
        >
          <div class="report-wrapper">
            <div class="report-s report-content" style="padding-bottom: 0">
              <div class="type-content current swiper-box">
                <div class="swiper">
                  <swiper :options="swiperOption" @slideChange="swiperChange" ref="mySwiper">
                    <swiper-slide
                      v-for="(item,index) in familyCusList"
                      :key="index"
                      class="slide-item"
                    >
                      <div class="circle">
                        <div class="circle-box">
                          <x-circle
                            :percent="Number(reportData.securityRating)"
                            :stroke-width="2.5"
                            trail-color="#94e3bf"
                            stroke-color="#fff"
                          >
                            <div class="circle-wrapper">
                              <div v-if="reportData.isPolicy == 0" class="percent">
                                {{reportData.securityRating}}
                                <span>分</span>
                              </div>
                              <div v-if="reportData.isPolicy == 1" class="percent percent-noData">暂无</div>
                              <div class="baozhang">
                                <span>{{reportData.customerName}}</span>的
                                <br>保障指数
                              </div>
                            </div>
                          </x-circle>
                        </div>
                        <div
                          v-if="reportData.isPolicy == 0"
                          class="then"
                        >已超过{{reportData.overManyUser}}%的用户</div>
                      </div>
                      <div class="risk-rating">
                        <div v-if="reportData.isPolicy == 0" class="rating">风险评级：
                          <!-- <span :style="{color:reportData.riskRating == '低'?'#28c76a':(reportData.riskRating == '中'?'#f4ce1d':(reportData.riskRating == '高'?'f41d1d':''))}" class="fz34">{{reportData.riskRating}}</span> -->
                          <span :style="{color: textColor}" class="fz34">{{reportData.riskRating}}</span>
                        </div>
                        <div v-if="reportData.isPolicy == 0" class="risk-tips">{{riskRateDescText}}</div>
                      </div>
                    </swiper-slide>
                  </swiper>
                </div>
              </div>
            </div>
            <div v-show="!showTip" ref="target" class="report-d report-content">
              <div class="xiangxi-list">
                <div class="xiangxi-item">
                  <div class="item-title">
                    <i class="title-icon"></i>
                    <span class="title-icon-text">指标分析</span>
                    <i class="title-icon"></i>
                  </div>
                  <div
                    v-for="(item,index) in reportData.securityAnalysisList"
                    :key="index"
                    style="padding-top: 0"
                    class="item-content vux-1px-b"
                  >
                    <div
                      @click="gotoSafeguardDetail(item)"
                      style="padding-top: 0"
                      class="item-link-wrapper"
                    >
                      <i class="block-fisrt"></i>
                      <h4 class="fz32">
                        您的{{item.key}}指数为：
                        <span>{{item.value}}</span>
                        <em
                          class="vux-1px"
                          :style="{color:item.riskRating == '极低'?'#f41d1d':(item.riskRating == '较低'?'#f77210':(item.riskRating == '一般'?'#f4ce1d':(item.riskRating == '正常'?'#28c76a':(item.riskRating == '较高'?'#1d7df4':(item.riskRating == '极高'?'#8e47de':'')))))}"
                        >{{item.riskRating}}</em>
                      </h4>
                      <i class="arrow-right"></i>
                    </div>
                    <ul class="zhishu-show">
                      <li>
                        <div class="range-scale">
                          <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                          </ul>
                        </div>
                        <range class="dt-range" :value="Number(item.value)" disabled></range>
                        <div class="range-list">
                          <div class="list">
                            <span>极低</span>
                            <span>较低</span>
                            <span>正常</span>
                            <span>较好</span>
                            <span>极好</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div ref="suggest" class="xiangxi-item" style="overflow: initial">
                  <div class="item-title">
                    <i class="title-icon"></i>
                    <span class="title-icon-text">保障建议</span>
                    <i class="title-icon"></i>
                  </div>
                  <div class="item-content baozhangjianyi">
                    <div class="img-baozhangjianyi">
                      <img src="../../assets/imgs/baozhangjianyi-xiangxi.png" alt="">
                    </div>
                    <h4 class="fz28">根据标准普尔定律，您的保险管家给出的保障建议:</h4>
                    <div class="loudou-tips">
                      <ul>
                        <li>保障级别</li>
                        <li>已有保障</li>
                        <li>目标保额</li>
                        <li>缺口保额</li>
                      </ul>
                    </div>
                    <!--保障漏斗图-->
                    <div class="loudou">
                      <div id="loudouChart"></div>
                      <ul class="explain-line">
                        <li v-for="(item,index) in securityAdviceList" :key="index">
                          <span
                            v-clickoutside="explainHandleClose"
                            @click.stop="explainBtn(item,index)"
                            :class="explainIndex == index?'explain-item-active':''"
                            class="explain-item"
                          >{{item.securityType}}</span>
                          <div
                            v-if="item.startTarget == '' || item.endTarget == ''"
                            @click="openTargetModal(item,index)"
                            class="target-box"
                          >
                            <input
                              type="text"
                              ref="textarea1"
                              @on-focus="textareaBlur"
                              readonly
                              v-model="item.startTarget"
                              class="target-input"
                            >
                            <input
                              type="text"
                              ref="textarea2"
                              @on-focus="textareaBlur"
                              readonly
                              v-model="item.endTarget"
                              class="target-input"
                            >万
                          </div>
                          <div
                            v-if="item.startTarget != '' && item.endTarget != ''"
                            @click="openTargetModal(item,index)"
                            class="target-box"
                          >
                            <span>{{item.startTarget}}</span>-
                            <span>{{item.endTarget}}</span>万
                          </div>
                          <div
                            v-if="item.startBreach != '' && item.endBreach != ''"
                            class="gap-box target-span"
                          >
                            <span>{{item.startBreach}}</span>-
                            <span>{{item.endBreach}}</span>
                          </div>
                          <div
                            v-show="explainIndex == index"
                            class="explain-modal"
                            :class="{'explain-modal-left':explainIndex == 7}"
                          >
                            <span class="before-icon"></span>
                            <p>{{item.desc}}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="xiangxi-item check-baozhang" style="position: relative">
                  <div class="title-link">
                    <h2>哪些风险需要重视？</h2>
                    <div>
                      <div @click.stop="checkSafeguardBtn" class="check-safeguard">
                        <span>请选择保障</span>
                        <icon
                          class="dt-icon arrows-up1"
                          :name="checkListShow?'arrows-up1':'arrows-down1'"
                        ></icon>
                      </div>
                    </div>
                  </div>
                  <div v-clickoutside="checkHandleClose" v-show="checkListShow" class="checks">
                    <checklist
                      :label-position="labelPosition"
                      :options="commonList"
                      v-model="checklist"
                      @on-change="change"
                    ></checklist>
                  </div>
                  <div class="baozhang-item" v-show="checklist.includes('重疾保障')">
                    <p
                      class="link-info"
                    >重疾：重疾保障必不可少，由于生活环境和工作压力等因素，忙碌而紧张的现代人随时都要迎接疾病的挑战，巨额医疗费超出了家庭承受范围。</p>
                    <div class="link-banner">
                      <img src="../../assets/imgs/reportImg-zj.jpg">
                    </div>
                  </div>
                  <div class="baozhang-item" v-show="checklist.includes('意外保障')">
                    <p
                      class="link-info"
                    >意外：意外的来临总是让我们猝不及防，我们每天看到无数事故新闻，却权当是看个故事，殊不知事情万一发生在自己身上时就是悲痛的事故。</p>
                    <div class="link-banner">
                      <img src="../../assets/imgs/reportImg-yw.jpg">
                    </div>
                  </div>
                  <div class="baozhang-item" v-show="checklist.includes('人寿保障')">
                    <p
                      class="link-info"
                    >人寿：人不一定会得病，但一定会“远行”，对于家庭而言，如果自己不在了，父母养老、孩子教育、巨额贷款都会压得家人喘不过气，寿险是一份家庭的责任。</p>
                    <div class="link-banner">
                      <img src="../../assets/imgs/reportImg-rs.jpg">
                    </div>
                  </div>
                  <div class="baozhang-item" v-show="checklist.includes('财富保障')">
                    <p class="link-info">财富：年金险是为未来做准备，创富容易守富难，年金险可以为您打理财富、守护财富，年金险让您尽情享受财富自由。</p>
                    <div class="link-banner">
                      <img src="../../assets/imgs/reportImg-cf.jpg">
                    </div>
                  </div>
                </div>
                <div v-if="reportData.isMain == 1" class="xiangxi-item">
                  <div class="item-title">
                    <i class="title-icon"></i>
                    <span class="title-icon-text">保险管家对您说</span>
                    <i class="title-icon"></i>
                  </div>
                  <div class="text-area">
                    <group>
                      <x-textarea
                        @on-blur="updateDetailReport(1)"
                        :max="500"
                        v-model="textareaVal"
                        placeholder="      请输入您的专业建议，比如：尊敬的xx客户您好，根据您的年龄和家庭情况，您应该是一家之主，您最应该关注的保障是“重疾保障”和“人寿保障”，重疾保建议为5倍年收入加上治疗费和康复费。"
                        :height="110"
                      ></x-textarea>
                    </group>
                  </div>
                </div>
              </div>
              <div ref="download" @click="downloadWordBtn" class="download-word">
                <div class="info">
                  <div class="info-title">
                    <i></i>
                    <span>{{downloadText}}</span>
                  </div>
                  <div
                    v-if="wordTotalSize || wordTotalSize"
                    class="info-size"
                  >{{wordDownloadSize}}M/{{wordTotalSize}}M</div>
                </div>
                <div class="icon">
                  <img src="../../assets/imgs/icon_word.png" alt="">
                </div>
              </div>
            </div>
            <Tips tips="tips9" v-if="showTip"></Tips>
          </div>
        </base-scroll>
        <div ref="nav" class="dt-nav">
          <ul class="dt-nav-box">
            <li :class="navIndex == 1?'nav-active':''" @click="navGoto(1)" class="nav-item">指标分析</li>
            <li :class="navIndex == 2?'nav-active':''" @click="navGoto(2)" class="nav-item">保障建议</li>
            <!-- <li :class="navIndex == 3?'nav-active':''" @click="navGoto(3)" class="nav-item">交费提醒</li> -->
            <li :class="navIndex == 4?'nav-active':''" @click="navGoto(4)" class="nav-item">下载报告</li>
          </ul>
        </div>
      </div>
      <div @click="backTopBtn" v-show="navIndex >= 2" class="back-top">
        <icon class="dt-icon arrows-up1" name="arrows-up1"></icon>
      </div>
      <div v-show="!showTip" ref="footer" class="dt-footers dt-footers-animation">
        <div class="guanjia">
          <div class="avatar">
            <img :src="reportData.photoUrl" alt="">
          </div>
          <div class="guanjia-info">
            <h3 class="fz30">您的专属保险管家</h3>
            <p class="fz30">
              <span>{{reportData.cardName}}</span>
              <span>{{reportData.phoneNumber}}</span>
            </p>
          </div>
          <icon @click.native="callPhone" class="dt-icon phone101" name="phone101"></icon>
        </div>
        <dt-button class="sendInfo" :text="btnText" :radius="10" @click="sendCustomer"></dt-button>
      </div>
      <confirm
        v-if="!showTip"
        v-model="targetShow"
        :show-input="false"
        :title="tipsArr[targetModalIndex].title"
        @on-confirm="onConfirm"
      >
        <div class="modal-slot-input">
          <span>目标保额(万)</span>
          <input v-model.trim="number1" class="number" :maxlength="5" type="tel">--
          <input v-model.trim="number2" class="number" :maxlength="5" type="tel">
        </div>
      </confirm>
    </div>
  </div>
</template>

<script>
let scrollTop;
let elNav;
let target;
let suggest;
// let remind;
let download;
import {
  XButton,
  XCircle,
  Range,
  Tab,
  TabItem,
  Swiper,
  SwiperItem,
  XTextarea,
  Group,
  Confirm,
  Checklist
} from "vux";
import { policyService } from "@/config/env";
import DtHeader from "@/components/dtHeader";
import BaseScroll from "@/components/baseScroll";
import api from "@/api/index";
import DtButton from "@/components/dtButton";
import Tips from "@/components/tips";
import { getDevice } from "@/config/utils.js";
import { riskRateDesc } from "@/utils/index";

export default {
  name: "reportDetail",
  components: {
    XButton,
    DtHeader,
    BaseScroll,
    DtButton,
    XCircle,
    Range,
    Tab,
    TabItem,
    XTextarea,
    Group,
    Confirm,
    Checklist,
    Tips
  },
  data() {
    return {
      showTip: false,
      downloadWordUrl: "",
      device: getDevice(),
      policyService: policyService,
      securityAdviceList: [],
      familyCusList: [],
      wordTotalSize: 0,
      wordDownloadSize: 0,
      wordDownloadStatus: 0,
      labelPosition: "",
      commonList: ["重疾保障", "意外保障", "人寿保障", "财富保障"],
      checklist: [],
      targetModalIndex: 0,
      number1: "",
      number2: "",
      textareaVal: "",
      swiperOption: {
        initialSlide: 0, //设定初始化时slide的索引
        // loop: true,
        slidesPerView: "auto",
        spaceBetween: 10,
        centeredSlides: true, //设定为true时，活动块会居中，而不是默认状态下的居左。
        speed: 300 //滑动速度
      },
      btnText: "传送给客户",
      headerHeight: "",
      checkListShow: false,
      navIndex: 0,
      tipsArr: [
        {
          id: 1,
          title: "意外",
          number1: "",
          number2: "",
          gapNumber1: "",
          gapNumber2: "",
          desc:
            "根据保监会[2012]6号 中国保监会关于合理购买人身险产品的公告， 保障型产品可以用相对较低的保费获得较高的保额，通常建议重大疾病保险金额设定为年收入的5~10倍"
        },
        {
          id: 2,
          title: "医疗",
          number1: "12",
          number2: "100",
          gapNumber1: "23",
          gapNumber2: "104",
          desc:
            "根据保监会[2012]6号 中国保监会关于合理购买人身险产品的公告， 保障型产品可以用相对较低的保费获得较高的保额，通常建议投保人将意外伤害保险金额设定为自身年收入的10-20倍。"
        },
        {
          id: 3,
          title: "疾病",
          number1: "",
          number2: "",
          gapNumber1: "",
          gapNumber2: "",
          desc:
            "根据保监会[2012]6号 中国保监会关于合理购买人身险产品的公告， 保障型产品可以用相对较低的保费获得较高的保额，通常建议投保人将意外伤害保险金额设定为自身年收入的10-20倍。"
        },
        {
          id: 4,
          title: "防癌",
          number1: "",
          number2: "",
          gapNumber1: "",
          gapNumber2: "",
          desc:
            "根据保监会[2012]6号 中国保监会关于合理购买人身险产品的公告， 保障型产品可以用相对较低的保费获得较高的保额，通常建议投保人将意外伤害保险金额设定为自身年收入的10-20倍。"
        },
        {
          id: 5,
          title: "人寿",
          number1: "",
          number2: "",
          gapNumber1: "",
          gapNumber2: "",
          desc:
            "根据保监会[2012]6号 中国保监会关于合理购买人身险产品的公告， 保障型产品可以用相对较低的保费获得较高的保额，通常建议投保人将意外伤害保险金额设定为自身年收入的10-20倍。"
        },
        {
          id: 6,
          title: "理财",
          number1: "",
          number2: "",
          gapNumber1: "",
          gapNumber2: "",
          desc:
            "根据保监会[2012]6号 中国保监会关于合理购买人身险产品的公告， 保障型产品可以用相对较低的保费获得较高的保额，通常建议投保人将意外伤害保险金额设定为自身年收入的10-20倍。"
        },
        {
          id: 7,
          title: "养老",
          number1: "",
          number2: "",
          gapNumber1: "",
          gapNumber2: "",
          desc:
            "根据保监会[2012]6号 中国保监会关于合理购买人身险产品的公告， 保障型产品可以用相对较低的保费获得较高的保额，通常建议投保人将意外伤害保险金额设定为自身年收入的10-20倍。"
        },
        {
          id: 8,
          title: "终身寿",
          number1: "",
          number2: "",
          gapNumber1: "",
          gapNumber2: "",
          desc:
            "根据保监会[2012]6号 中国保监会关于合理购买人身险产品的公告， 保障型产品可以用相对较低的保费获得较高的保额，通常建议投保人将意外伤害保险金额设定为自身年收入的10-20倍。"
        }
      ],
      explainIndex: null,
      targetShow: false,
      reportData: "",
      jiaofeiData: {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        nowMonth: {
          label: "",
          key: ""
        }
      },
      reportDetailParam: {
        customerId: "",
        familyId: ""
      },
      range: 56
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    // 向window对象注入一个方法供native调用
    this.downloadWord();
  },
  async mounted() {
    this.headerHeight = this.$refs.topInfo.offsetHeight;
    await this.initData();
    this.$nextTick(() => {});
  },
  computed: {
    scrollVue() {
      return this.$refs.scroll;
    },
    hasAll() {
      return "";
    },
    downloadText() {
      if (this.wordDownloadStatus == -1) {
        return "下载失败，请重新点击下载";
      }
      if (this.wordDownloadStatus == 1) {
        return "正在下载";
      }
      if (this.wordDownloadStatus == 0) {
        return "点击下载Word报告";
      }
      if (this.wordDownloadStatus == 2) {
        return "下载已完成，点击分享";
      }
    },
    textColor() {
      if (this.reportData.riskRating == "低") {
        return "#28c76a";
      }
      if (this.reportData.riskRating == "中") {
        return "#f4ce1d";
      }
      if (this.reportData.riskRating == "高") {
        return "#f41d1d";
      }
    },
    riskRateDescText() {
      return riskRateDesc(
        this.reportData.riskRating,
        this.reportData.custAge || 0
      );
    }
  },
  methods: {
    async initData() {
      let peoplesIndex = this.$store.state.reportDetailsPeoplesIndex;
      this.reportDetailParam.familyId = this.$route.query.familyId;
      // this.reportDetailParam.customerId = this.$route.query.customerId;
      let result = await api.custListSelect({
        familyId: this.reportDetailParam.familyId
      });
      if (result.status == 1) {
        this.familyCusList = result.data.list;
        this.reportDetailParam.customerId = this.familyCusList[0].customerId;
        if (peoplesIndex != null) {
          this.$refs.mySwiper.swiper.activeIndex = peoplesIndex;
          this.reportInitData();
        } else {
          let res = await api.detailReportList({
            familyId: this.reportDetailParam.familyId,
            customerId: this.reportDetailParam.customerId
          });
          if (res.status == 1) {
            this.changeSwipeData(res);
          } else {
            this.$alert(res.msg);
            return;
          }
        }
      } else {
        this.$alert(result.msg);
        return;
      }
    },

    async changeSwipeData(res) {
      if (res.data.isPolicy == "0") {
        await this.getDom();
      }
      this.jiaofeiData.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.jiaofeiData.nowMonth.label = "";
      this.jiaofeiData.nowMonth.key = "";
      this.reportData = res.data;
      if (this.reportData.mustFocus != null) {
        this.checklist = this.reportData.mustFocus;
      } else {
        this.checklist = [];
      }
      if (this.reportData.desc != null) {
        this.textareaVal = this.reportData.desc;
      }
      if (this.reportData.isPolicy == "1") {
        this.showTip = true;
      } else if (this.reportData.isPolicy == "0") {
        this.showTip = false;
      }
      let securityAdviceData = await api.securityAdviceSelect({
        familyId: this.reportDetailParam.familyId,
        customerId: this.reportData.customerId
      });
      if (securityAdviceData.status == 1) {
        if (securityAdviceData.data != null) {
          this.securityAdviceList = securityAdviceData.data;
        }
      } else {
        this.$alert(securityAdviceData.msg);
        return;
      }
      if (this.reportData.yearPayList) {
        // alert("进来了");
        for (let item of this.reportData.yearPayList) {
          this.jiaofeiData.data[item.lable - 1] = item.key;
          if (item.flag == "Y") {
            this.jiaofeiData.nowMonth.label = item.lable;
            this.jiaofeiData.nowMonth.key = item.key;
          }
        }
      }
      if (this.reportData.isPolicy == "0") {
        this.loadDetailCharts();
      }
    },
    // 个人详版报告数据初始化
    async reportInitData() {
      let index = this.$refs.mySwiper.swiper.activeIndex;
      this.reportDetailParam.customerId = this.familyCusList[index].customerId;
      this.reportDetailParam.familyId = this.$route.query.familyId;
      let res = await api.detailReportList(this.reportDetailParam);
      if (res.status == 1) {
        if (res.data != null) {
          this.changeSwipeData(res);
        }
      } else {
        this.$toast(res.msg);
        return;
      }
    },
    // 向window对象注入一个方法供native调用
    downloadWord() {
      window.downloadWord = (downloadSize, totalSize, status) => {
        this.wordDownloadStatus = status;
        if (status == -1) {
          this.$alert("下载失败！");
        } else if (status == 1) {
          this.wordDownloadSize = (downloadSize / 1024 / 1024).toFixed(2);
          this.wordTotalSize = (totalSize / 1024 / 1024).toFixed(2);
        } else if (status == 2) {
          this.wordDownloadSize = (downloadSize / 1024 / 1024).toFixed(2);
          this.wordTotalSize = (totalSize / 1024 / 1024).toFixed(2);
        }
      };
    },
    explainHandleClose(e) {
      this.explainIndex = null;
    },
    checkHandleClose(e) {
      if (this.checkListShow) {
        this.updateDetailReport();
      }
      this.checkListShow = false;
    },
    getDom() {
      elNav = this.$refs.nav;
      target = this.$refs.target;
      suggest = this.$refs.suggest;
      // remind = this.$refs.remind;
      download = this.$refs.download;
    },
    listenScroll(axis) {
      let el = this.$refs.footer;
      if (this.reportData.isPolicy == "0") {
        let targetTop = target.offsetTop - 50;
        let suggestTop = suggest.offsetTop - 50;
        // let remindTop = remind.offsetTop - 50;
        let downloadTop = download.offsetTop - 50;
        elNav.style.display = "block";
        scrollTop = Math.abs(axis.y);
        if (scrollTop == 0) {
          el.style.height = "250px";
        }
        if (scrollTop >= targetTop && scrollTop < suggestTop) {
          elNav.style.display = "block";
          this.navIndex = 1;
        } else if (
          scrollTop >= suggestTop &&
          scrollTop < downloadTop &&
          this.navIndex != 4
        ) {
          this.navIndex = 2;
        } else if (scrollTop >= downloadTop || this.navIndex == 4) {
          this.navIndex = 4;
        } else {
          this.navIndex = 0;
          elNav.style.display = "none";
        }
      }
    },
    // 是否滑动到了最底部
    scrollToEnd(v) {
      let el = this.$refs.footer;
      el.style.height = "250px";
    },
    // 检测向上还是向下滑动
    scrollStart(v) {
      let el = this.$refs.footer;
      switch (v) {
        case 1:
          // 向上
          el.style.height = "0px";
          break;
        case -1:
          // 向下
          el.style.height = "0px";
          break;
        default:
      }
    },
    // 顶部导航点击定位
    navGoto(v) {
      this.navIndex = v;
      switch (v) {
        case 1:
          this.scrollVue.scrollToElement(target, 1000, 0, -50);
          break;
        case 2:
          this.scrollVue.scrollToElement(suggest, 1000, 0, -50);
          break;
        // case 3:
        //   this.scrollVue.scrollToElement(remind, 1000, 0, -50);
        //   break;
        case 4:
          this.scrollVue.scrollToElement(download, 1000, 0, -50);
          break;
        default:
      }
    },
    // 点击返回顶部
    backTopBtn() {
      this.scrollVue.scrollTo(0, 0, 1000);
    },

    loadDetailCharts() {
      this.$nextTick(() => {
        // 保障漏斗图
        this.loadLoudouChart();
      });
    },

    loadLoudouChart() {
      let _seft = this;
      let loudouChart = echarts.init(document.getElementById("loudouChart"));
      let option = {
        color: [
          "#46439a",
          "#005aa9",
          "#46c0be",
          "#8ab53f",
          "#f5c53d",
          "#f17b31",
          "#ed3b2d",
          "#f50505"
        ],
        series: [
          {
            type: "funnel",
            left: "-2%",
            silent: true,
            top: 0,
            bottom: 0,
            width: "80%",
            min: 0,
            max: 100,
            minSize: "0%",
            maxSize: "60%",
            sort: "ascending",
            gap: 0,
            itemStyle: {
              normal: {
                borderWidth: 0
              }
            },
            label: {
              normal: {
                show: false,
                position: "right"
              },
              emphasis: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            data: [
              { value: 10, name: "意外(100W)" },
              { value: 20, name: "医疗(90W)" },
              { value: 30, name: "疾病(80W)" },
              { value: 40, name: "防癌(88W)" },
              { value: 50, name: "人寿(280W)" },
              { value: 60, name: "理财(20W)" },
              { value: 70, name: "养老(80W)" },
              { value: 80, name: "终身寿(80W)" }
            ]
          },
          {
            type: "funnel",
            silent: true,
            left: "-7%",
            top: 0,
            bottom: 0,
            width: "70%",
            min: 0,
            max: 0,
            minSize: "0%",
            maxSize: "60%",
            sort: "ascending",
            gap: 10,
            label: {
              normal: {
                show: true,
                position: "center"
              },
              emphasis: {
                textStyle: {
                  fontSize: 8
                }
              }
            },
            labelLine: {
              normal: {
                length: 10,
                lineStyle: {
                  width: 1,
                  type: "solid"
                }
              }
            },
            itemStyle: {
              normal: {
                // borderColor: "#fff",
                borderWidth: 0
              }
            },
            data: [
              {
                value: 30,
                name: `${_seft.securityAdviceList[0].manys}份\n保额${
                  _seft.securityAdviceList[0].coverage
                }`,
                itemStyle: {
                  normal: {
                    color: "#6d6bbe"
                  }
                }
              },
              {
                value: 30,
                // name: "三份\n保额40",
                name: `${_seft.securityAdviceList[1].manys}份\n保额${
                  _seft.securityAdviceList[1].coverage
                }`,
                itemStyle: {
                  normal: {
                    color: "#1974c3"
                  }
                }
              },
              {
                value: 30,
                // name: "三份\n保额40",
                name: `${_seft.securityAdviceList[2].manys}份\n保额${
                  _seft.securityAdviceList[2].coverage
                }`,
                itemStyle: {
                  normal: {
                    color: "#51decf"
                  }
                }
              },
              {
                value: 30,
                // name: "三份\n保额20",
                name: `${_seft.securityAdviceList[3].manys}份\n保额${
                  _seft.securityAdviceList[3].coverage
                }`,
                itemStyle: {
                  normal: {
                    color: "#9fc856"
                  }
                }
              },
              {
                value: 30,
                // name: "三份\n保额90",
                name: `${_seft.securityAdviceList[4].manys}份\n保额${
                  _seft.securityAdviceList[4].coverage
                }`,
                itemStyle: {
                  normal: {
                    color: "#fed45e"
                  }
                }
              },
              {
                value: 30,
                // name: "三份\n保额15",
                name: `${_seft.securityAdviceList[5].manys}份\n保额${
                  _seft.securityAdviceList[5].coverage
                }`,
                itemStyle: {
                  normal: {
                    color: "#fd8d46"
                  }
                }
              },
              {
                value: 30,
                // name: "三份\n保额60W",
                name: `${_seft.securityAdviceList[6].manys}份\n保额${
                  _seft.securityAdviceList[6].coverage
                }`,
                itemStyle: {
                  normal: {
                    color: "#fc4e40"
                  }
                }
              },
              {
                value: 30,
                // name: "三份\n保额60W",
                name: `${_seft.securityAdviceList[7].manys}份\n保额${
                  _seft.securityAdviceList[7].coverage
                }`,
                itemStyle: {
                  normal: {
                    color: "#fc4e40"
                  }
                }
              }
            ]
          }
        ]
      };
      loudouChart.setOption(option);
    },
    // 传送给客户
    sendCustomer() {
      this.$router.push({
        path: "/reportSend",
        query: {
          familyId: this.reportData.familyId,
          reportId: this.reportData.reportId
        }
      });
    },
    explainBtn(v, i) {
      this.explainIndex = i;
    },
    async onConfirm() {
      if (this.number1 == "") {
        this.number1 = this.number2;
      }
      if (this.number2 == "") {
        this.number2 = this.number1;
      }
      this.securityAdviceList[this.targetModalIndex].startTarget = this.number1;
      this.securityAdviceList[this.targetModalIndex].endTarget = this.number2;
      let res = await api.securityAdviceUpdate(
        this.securityAdviceList[this.targetModalIndex]
      );
      if (res.status == 1) {
        this.securityAdviceList[this.targetModalIndex].startBreach =
          res.data.startBreach;
        this.securityAdviceList[this.targetModalIndex].endBreach =
          res.data.endBreach;
      } else {
        this.$alert(res.msg);
        this.securityAdviceList[this.targetModalIndex].startTarget = "";
        this.securityAdviceList[this.targetModalIndex].endTarget = "";
        return;
      }
    },
    openTargetModal(v, i) {
      this.targetModalIndex = i;
      this.targetShow = true;
      this.number1 = v.startTarget;
      this.number2 = v.endTarget;
    },
    checkSafeguardBtn() {
      this.checkListShow = !this.checkListShow;
      if (!this.checkListShow) {
        this.updateDetailReport();
      }
    },
    goBack() {
      this.$router.go(-1);
      this.$store.commit("setReportDetailsPeoplesIndex", null);
    },
    change(v) {
      console.log(v);
    },
    gotoSafeguardDetail(v) {
      this.$router.push({
        path: "/safeguardDetail",
        query: {
          familyId: this.reportDetailParam.familyId,
          customerId: this.reportDetailParam.customerId,
          type: v.key,
          name: this.reportData.customerName
        }
      });
      this.$store.commit(
        "setReportDetailsPeoplesIndex",
        this.$refs.mySwiper.swiper.activeIndex
      );
    },
    // 切换家庭成员联动保单list
    swiperChange() {
      this.reportInitData();
    },
    // 拨打代理人电话
    callPhone() {
      if (
        this.reportData.phoneNumber == null ||
        this.reportData.phoneNumber == ""
      ) {
        this.$toast("暂无手机号");
        return;
      } else {
        window.location.href = `tel:${this.reportData.phoneNumber}`;
      }
    },
    // 获取word下载地址
    async getWordUrl() {
      let res = await api.familyReportSave({
        familyId: this.$route.query.familyId
      });
      if (res.status == 1) {
        if (res.data != null) {
          this.downloadWordUrl = res.data;
        } else {
          this.$alert("系统错误：下载地址为空");
          return false;
        }
      } else if (res.status == 4) {
        this.$confirm({
          content: "此功能需要开通会员",
          confirmText: "购买",
          onConfirm: () => {
            this.buyMembers();
          }
        });
      } else {
        this.$alert(res.msg);
        return false;
      }
    },

    // 下载word
    async downloadWordBtn() {
      let device = this.device;
      if (this.wordDownloadStatus == 2) {
        let startName = this.downloadWordUrl.substring(
          this.downloadWordUrl.indexOf("familyReport") + 13,
          this.downloadWordUrl.lastIndexOf("/")
        );
        let endName = this.downloadWordUrl.substring(
          this.downloadWordUrl.lastIndexOf(".")
        );
        let fileName = decodeURI(startName) + endName;
        if (device == "android") {
          bmAndroid.openNativeFileShare(fileName);
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.openNativeFileShare.postMessage(
            fileName
          );
        }
        return;
      }
      await this.getWordUrl();
      if (!this.downloadWordUrl) return;
      let token = this.$store.state.app_token;
      let downUrl =
        `${policyService}` + this.downloadWordUrl + "?token=" + token;
      let startName = this.downloadWordUrl.substring(
        this.downloadWordUrl.indexOf("familyReport") + 13,
        this.downloadWordUrl.lastIndexOf("/")
      );
      let endName = this.downloadWordUrl.substring(
        this.downloadWordUrl.lastIndexOf(".")
      );
      let fileName = decodeURI(startName) + endName;
      if (this.wordDownloadStatus == 0 || this.wordDownloadStatus == -1) {
        if (device == "android") {
          location.href = downUrl;
          this.$toast("开始下载...");
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.startDownload.postMessage(downUrl);
          this.$toast("开始下载...");
        }
      } else if (this.wordDownloadStatus == 1) {
        this.$toast("正在下载中，请勿重复点击!");
        return false;
      } else if (this.wordDownloadStatus == 2) {
        if (device == "android") {
          bmAndroid.openNativeFileShare(fileName);
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.openNativeFileShare.postMessage(
            fileName
          );
        }
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
    // 报告保存
    async updateDetailReport(v) {
      let param = {
        familyId: this.reportData.familyId,
        customerId: this.reportData.customerId,
        mustFocus: this.checklist,
        desc: this.textareaVal
      };
      if (v == 1) {
        param.isMain = 1;
      }
      let res = await api.detailReportUpdate(param);
      if (res.status != 1) {
        this.$alert(res.msg);
      }
      // this.getWordUrl();
    },
    // IOS下readonly属性兼容性处理
    textareaBlur() {
      let el1 = this.$refs.textarea1;
      let el2 = this.$refs.textarea2;
      el1.blur();
      el2.blur();
    }
  }
};
</script>

<style lang="less">
@import "../../styles/mixin";

.family-reports-detail-page {
  .modal-slot-input {
    text-align: center;
    height: 100px;
    line-height: 100px;
    span {
      font-size: 30px;
    }
    .number {
      width: 120px;
      height: 60px;
      border-radius: 10px;
      border: solid 2px #cccccc;
      padding: 6px 10px 0;
    }
  }
  .fz28 {
    font-size: 28px;
    color: #333333;
    margin: 50px 0 30px 20px !important;
  }
  .text-area {
    .vux-x-textarea {
      padding: 0 0 30px;
    }
    .weui-cells {
      margin-top: 0 !important;
    }
    .weui-cells:before {
      border: none;
    }
    textarea {
      width: 630px;
      height: 220px;
      border-radius: 10px;
      border: solid 2px #cccccc;
      margin: 0 auto;
      padding: 20px;
      font-size: 26px;
      letter-spacing: 1px;
    }
  }

  .item-title {
    height: 114px;
    line-height: 114px;
    text-align: center;
    font-size: 32px;
    color: #333;
    font-weight: bold;
    position: relative;
    span {
      position: relative;
    }
    .title-icon {
      display: inline-block;
      width: 143px;
      height: 2px;
      background-color: #28c76a;
      vertical-align: 10px;
    }
    .title-icon-text {
      margin: 0 22px;
    }
  }

  .upMenu {
    display: block !important;
  }
  .downMenu {
    display: none !important;
  }

  .current-content {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    .bs-wrapper {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding-bottom: 20px;
      .scroll {
        overflow: hidden;
        .report-content {
          padding-bottom: 270px;
        }
        .all-wrap {
          padding-top: 50% !important;
          transform: translateY(-25%);
        }
      }
      .report-d {
        .xiangxi-list {
          margin: 20px 20px 0;
          margin-top: 0;
          .xiangxi-item {
            margin-bottom: 20px;
            background: #fff;
            border-radius: 10px;
            box-shadow: -3px 0 13px 0 rgba(0, 0, 0, 0.03);
            overflow: hidden;
            position: relative;
            &:after {
              content: "";
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: #f5f5f5;
              position: absolute;
              left: -15px;
              top: 76px;
              box-shadow: -5px -5px 50px rgba(0, 0, 0, 0.03) inset;
            }
            &:before {
              content: "";
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: #f5f5f5;
              position: absolute;
              right: -15px;
              top: 76px;
              box-shadow: -5px -5px 50px rgba(0, 0, 0, 0.03) inset;
            }

            .item-content {
              padding: 40px 0px 50px;
              position: relative;
              .item-link-wrapper {
                display: flex;
                align-items: center;
                padding: 25px 0;
                margin-bottom: 20px;
                margin-left: 30px;
                margin-right: 30px;
                .active-bg(#f1f1f1);
                border-radius: 4px;
                .block-fisrt {
                  width: 8px;
                  height: 30px;
                  background: #28c76a;
                  margin-right: 14px;
                }
                .arrow-right {
                  width: 25px;
                  height: 36px;
                  background: url("../../assets/imgs/icon_arrow_right.png")
                    right no-repeat;
                  // background-size: 20px 28px;
                  background-size: contain;
                  flex: 1;
                }
                .fz32 {
                  display: flex;
                  align-items: center;
                  span {
                    color: #28c76a;
                  }
                  .vux-1px:before {
                    border-width: 0;
                  }
                  em {
                    font-style: normal;
                    font-weight: normal;
                    color: #f4ce1d;
                    font-size: 24px;
                    width: 80px;
                    height: 30px;
                    display: block;
                    border-radius: 15px;
                    text-align: center;
                    line-height: 34px;
                    margin-left: 26px;
                    border-width: 2px;
                    border-style: solid;
                  }
                }
              }
              .zhishu-show {
                background: #fbfbfb;
                margin-left: 30px;
                margin-right: 30px;
                border-radius: 10px;
                padding: 0 20px;
                li {
                  height: 164px;
                  display: flex;
                  align-items: center;
                  position: relative;
                  .range-scale {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 100%;
                    height: 30px;
                    z-index: 9;
                    ul {
                      width: 96%;
                      margin-top: 20px;
                      margin-left: 50%;
                      transform: translateX(-50%);
                      // display: flex;
                      // justify-content: space-evenly;
                      li {
                        float: left;
                        width: 2px;
                        height: 11px;
                        background-color: #fff;
                      }
                      li:nth-of-type(1) {
                        margin-left: 20%;
                      }
                      li:nth-of-type(2) {
                        margin-left: 20%;
                      }
                      li:nth-of-type(3) {
                        margin-left: 20%;
                      }
                      li:nth-of-type(4) {
                        margin-left: 19%;
                      }
                    }
                  }
                  .range-list {
                    position: absolute;
                    left: 0;
                    top: 90px;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    justify-content: space-between;
                    .font-block {
                      font-weight: bold;
                      visibility: hidden;
                      width: 124px;
                    }
                    .list {
                      flex: 1;
                      display: flex;
                      justify-content: space-around;
                      padding: 0;
                      margin-top: 20px;
                    }
                    span {
                      font-size: 26px;
                      color: #666;
                      text-align: center;
                    }
                  }
                  .dt-range {
                    flex: 1;
                    margin: 0 !important;
                    .range-bar {
                      width: 100% !important;
                      height: 30px !important;
                      background: linear-gradient(
                        90deg,
                        rgba(40, 199, 106, 0.3) 0%,
                        #28c76a 100%
                      );
                      border-radius: 15px;
                      opacity: 1;
                      .range-quantity {
                        display: none;
                      }
                      .range-handle {
                        z-index: 9;
                        width: 30px;
                        height: 30px;
                        background: url("../../assets/imgs/rande-handle-d.png")
                          no-repeat center;
                        background-size: 30px 30px;
                        border: none;
                        box-shadow: none;
                        top: -18px !important;
                      }
                      .range-min,
                      .range-max {
                        display: none;
                      }
                    }
                  }
                  .title {
                    color: #333;
                    font-weight: bold;
                    width: 124px;
                  }
                }
              }
              .line-fenge {
                width: 690px;
                height: 1px;
                background-color: #e8e8e8;
                position: absolute;
                top: -24px;
                left: 10px;
                // margin-top: 10px;
                // margin-left: 11px;
              }
              &.baozhangjianyi {
                padding-top: 0;
                .img-baozhangjianyi {
                  padding: 0 40px;
                  img {
                    width: 100%;
                  }
                }
                h4 {
                  color: #666;
                  font-weight: normal;
                  margin: 54px 0 34px;
                }
                .loudou-tips {
                  overflow: hidden;
                  margin-bottom: 50px;
                  margin-left: 20px;
                  margin-right: 20px;
                  ul {
                    li {
                      // width: 25%;
                      float: left;
                      font-size: 26px;
                      letter-spacing: 1px;
                      color: #666666;
                    }
                    li:nth-child(2) {
                      margin: 0 82px 0 100px;
                    }
                    li:nth-child(3) {
                      margin-right: 40px;
                    }
                  }
                }
                #loudouChart {
                  height: 600px;
                }
                .loudou {
                  position: relative;
                  .explain-line {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 20px;
                    right: 0;
                    display: flex;
                    flex-direction: column;
                    &:before {
                      border-right: none;
                      border-top: none;
                    }
                    li {
                      font-size: 20px;
                      flex: 1;
                      display: flex;
                      align-items: center;
                      padding-left: 4px;
                      position: relative;
                      .explain-item {
                        height: 50px;
                        line-height: 50px;
                        padding: 0 14px;
                        // background-color: #28c76a;
                        border-radius: 10px;
                        border: solid 2px #cccccc;
                      }
                      .explain-item-active {
                        background-color: #28c76a;
                        border: 2px solid #28c76a;
                        color: #fff;
                      }

                      .explain-modal-left {
                        left: 110px !important;
                      }

                      .explain-modal {
                        z-index: 999;
                        color: #828282;
                        letter-spacing: 1px;
                        background-color: #eee;
                        position: absolute;
                        top: 0;
                        left: 90px;
                        width: 70%;
                        font-size: 26px;
                        padding: 30px 20px;
                        border-radius: 10px;
                        .before-icon {
                          border-width: 15px;
                          border-style: solid;
                          border-color: transparent #eee transparent transparent;
                          width: 0px;
                          height: 0px;
                          position: absolute;
                          top: 30px;
                          left: -24px;
                        }
                      }
                      .target-box {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        left: 400px;
                        font-size: 26px;
                        width: 140px;
                        .target-input {
                          width: 50px;
                          height: 40px;
                          border-radius: 10px;
                          border: solid 2px #cccccc;
                          text-align: center;
                          vertical-align: 4px;
                        }
                      }
                      .target-span {
                        font-size: 26px;
                        span {
                          color: #28c76a;
                        }
                      }
                      .gap-box {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        left: 550px;
                      }
                    }
                  }
                }
              }
            }
            .checks {
              position: absolute;
              top: 74px;
              right: 30px;
              width: 222px;
              z-index: 999;
              .weui-cell:before {
                left: 0 !important;
              }
              .weui-cells_checkbox {
                background-color: #ffffff;
                border-radius: 8px;
                border: solid 1px #cccccc;
              }
              .weui-check_label {
                padding: 0 !important;
                height: 30px;
                line-height: 30px;
              }
              .weui-cell__hd {
                padding-left: 10px !important;
              }
              .weui-cell__bd {
                font-size: 14px !important;
                color: #333;
              }
              .vux-checklist-icon-checked:before {
                font-size: 14px;
              }
            }
            .title-link {
              display: flex;
              margin: 16px 20px 32px;
              padding: 30px 10px 10px;
              .active-bg(#f1f1f1);
              border-radius: 4px;
              h2 {
                font-size: 32px;
                color: #28c76a;
                letter-spacing: 1px;
                padding-top: 8px;
              }
              > div {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                span {
                  font-size: 28px;
                  color: #999;
                }
              }
              .check-safeguard {
                padding: 0 14px;
                height: 60px;
                line-height: 60px;
                border-radius: 10px;
                border: solid 2px #cccccc;
                position: relative;
                .arrows-up1 {
                  color: #999;
                  vertical-align: -10px;
                }
              }
            }
            .link-info {
              margin: 0 30px 20px;
              // width: 637px;
              // height: 63px;
              font-size: 26px;
              line-height: 36px;
              letter-spacing: 1px;
              color: #999999;
            }
            .link-banner {
              width: 640px;
              // height: 255px;
              // background-color: #eeeeee;
              margin: 0 auto 40px;
              img {
                width: 100%;
                border-radius: 20px;
              }
            }
          }
          .check-baozhang {
            overflow: visible;
            min-height: 108px;
            &::before {
              display: none;
            }
            &::after {
              display: none;
            }
            .baozhang-item {
              overflow: hidden;
            }
          }
          .family-info {
            margin-left: 0;
            margin-right: 0;
          }
        }
        .download-word {
          margin: 20px 20px 0;
          background: #fff;
          border-radius: 10px;
          box-shadow: -3px 0 13px 0 rgba(0, 0, 0, 0.03);
          padding: 20px 20px 20px 30px;
          display: flex;
          justify-content: space-between;
          .active-bg(#d1d1d1);
          .info {
            padding-top: 36px;
            font-size: 30px;
            .info-title {
              display: flex;
              align-items: center;
            }
            .info-size {
              padding-left: 50px;
              font-size: 30px;
              color: #666;
              margin-top: 10px;
            }
            i {
              width: 30px;
              height: 30px;
              display: inline-block;
              background: url("../../assets/imgs/icon_download.png") no-repeat
                center;
              background-size: 30px;
              margin-right: 20px;
            }
          }
          .icon {
            img {
              width: 140px;
              height: 140px;
            }
          }
        }
      }
    }
  }

  .back-top {
    width: 120px;
    height: 120px;
    background-color: #333333;
    box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.3);
    opacity: 0.5;
    line-height: 120px;
    text-align: center;
    border-radius: 50%;
    position: absolute;
    right: 20px;
    bottom: 270px;
    .arrows-up1 {
      width: 52px;
      vertical-align: middle;
    }
  }

  .wrapper-show {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 600px;
    background-color: red;
    z-index: 999999 !important;
  }

  .dt-footers {
    opacity: 0;
    overflow: hidden;
    transition: height 1s;
    width: 100%;
    height: 250px;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    bottom: 0;
    left: 0;
    .sendInfo {
      width: 690px;
      height: 80px;
      background-color: #28c76a;
      border-radius: 10px;
    }
    .guanjia {
      .phone101 {
        width: 48px;
        height: 48px;
        color: #28c569;
        position: absolute;
        top: 72px;
        right: 40px;
      }
      .avatar {
        width: 100px;
        height: 100px;
        background: #e8e8e8;
        border-radius: 50%;
        margin-left: 30px;
        margin-top: 22px;
        margin-bottom: 22px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .guanjia-info {
        position: absolute;
        top: 30px;
        left: 170px;
        h3 {
          color: #fff;
          font-size: 28px;
          margin: 6px 0;
        }
        span {
          margin-right: 20px;
          letter-spacing: 0px;
          font-size: 28px;
          color: #fff;
        }
      }
    }
  }

  .dt-footers-animation {
    opacity: 1;
    max-height: 250px;
    transition: height 1s;
  }

  .type-content {
    background: #fff;
    margin: 20px 20px 0;
    border-radius: 10px;
    &.current {
      margin-top: 24px;
    }
    .vh {
      position: relative;
      padding-bottom: 90px;
      #baozhangChart {
        height: 600px;
        /*background: teal;*/
      }
    }
    .title {
      height: 90px;
      line-height: 90px;
      text-align: center;
      font-size: 32px;
      color: #232323;
    }
    .bt-line {
      height: 100px;
      &:after {
        border-color: #e8e8e8;
      }
    }
    .swiper-slide {
      width: 660px;
      height: 650px;
      background-color: #ffffff;
      box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      .circle {
        border-radius: 20px 20px 0px 0px;
        width: 660px;
        height: 460px;
        background: url("../../assets/imgs/bg006.png") no-repeat;
        background-size: cover;
        background-position: left bottom;
        overflow: hidden;
        .circle-box {
          width: 280px;
          height: 280px;
          margin: 60px auto 0;
          .circle-wrapper {
            .percent {
              font-size: 88px;
              color: #fff;
              position: relative;
              margin: 20px 0 10px;
              span {
                font-size: 36px;
                position: absolute;
              }
            }
            .percent-noData {
              font-size: 66px;
            }
            .baozhang {
              font-size: 28px;
              color: #fff;
              line-height: 34px;
              opacity: 0.8;
            }
          }
        }
      }
      .then {
        font-size: 38px;
        color: #fff;
        text-align: center;
        margin-top: 40px;
      }

      .risk-rating {
        padding: 14px 20px;
        background: #fff;
        .rating {
          font-size: 32px;
          margin-bottom: 6px;
          span {
            font-weight: bold;
            // color: #28c76a;
          }
        }
        .risk-tips {
          font-size: 26px;
          line-height: 37px;
          letter-spacing: 0px;
          color: #666666;
        }
      }
    }
  }

  .swiper-box {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 20px;
    background-color: #f5f5f5;
  }

  .jiaofeitixing {
    position: relative;
    padding-bottom: 100px;
    .m-baofei {
      position: absolute;
      bottom: 30px;
      left: 20px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      .active-op(0.6);
      .little-round {
        display: inline-block;
        width: 13px;
        height: 13px;
        background-color: #feaf25;
        border-radius: 50%;
        vertical-align: 5px;
      }
    }
    .m-baofei-right {
      position: absolute;
      bottom: 30px;
      right: 20px;
      height: 60px;
      text-align: center;
      line-height: 60px;
    }
    #jiaofeiChartDetail {
      height: 500px;
    }
    &.jiaofeitixing2 {
      background: #fff;
      padding-top: 0 !important;
      padding-bottom: 100px !important;
      .baofei-show-wrapper {
        display: flex;
        padding: 20px 0;
        .fz30 {
          flex: 1;
          padding-left: 10px;
          display: flex;
          align-items: center;
          &:before {
            content: "";
            width: 12px;
            height: 12px;
            display: block;
            background: teal;
            border-radius: 50%;
            margin-right: 9px;
          }
        }
      }
    }
  }
  .text-info {
    margin-top: -40px;
    padding: 30px;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: 1px;
    color: #999999;
  }

  .dt-nav {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 750px;
    height: 90px;
    background-color: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(99, 141, 117, 0.2);
    .dt-nav-box {
      text-align: center;
      .nav-item {
        float: left;
        // width: 25%;
        width: 33.33%;
        line-height: 90px;
        font-size: 30px;
        letter-spacing: 1px;
        color: #333;
      }
    }
  }

  .nav-active {
    color: #28c76a !important;
  }
}
</style>
