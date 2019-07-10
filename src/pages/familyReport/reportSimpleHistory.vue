<template>
  <div class="dt-pages family-reports-simpleHistory-page">
    <div class="dt-header" ref="topInfo">
      <dt-header title="家庭版" rightText="个人详版" @headerRight="gotoReportDetail" :leftBack="false" @headerLeft="goBack" textColor="#fff"></dt-header>
    </div>
    <div class="current-content" :style="{'top':headerHeight+'px'}">
      <div class="bs-wrapper">
        <base-scroll :pullup="true" @scrollToEnd="scrollToEnd" :listenScroll="true" @scroll="listenScroll" :scrollStart="true" @scrollStart="scrollStart" :probeType="3" :bounce="false" ref="scroll" class="scroll">
          <div class="report-wrapper">
            <!-- background: #28c76a; -->
            <div class="report-content">
              <div class="pc-wrapper">
                <div class="t-head-top">
                  <div class="t-ht-round"></div>
                  <div class="ht-round">
                  </div>
                </div>
                <div class="type-content pc-content">
                  <p class="dashed"></p>
                  <p class="ht-round-little"></p>
                  <div class="head-top">
                    {{reportData.familyName}}的家庭保障测评得分
                  </div>

                  <div class="pc-chart">
                    <!--综合保障指数-柱状图-->
                    <div id="pingceChart"></div>
                    <p class="pingce-text">保障级别
                      <font :color="riskRatingColor">{{reportData.riskRating}}</font>
                    </p>
                  </div>
                </div>
                <div class="data-group">
                  <div class="data-group-box one-item">
                    <p>
                      <icon class="dt-icon client002" name="client002"></icon>保障对象
                    </p>
                    <p>{{reportData.insureNum}}</p>
                  </div>
                  <div class="data-group-box ml-30 two-item">
                    <p>
                      <icon class="dt-icon text101" name="text101"></icon>保单合计
                    </p>
                    <p>{{reportData.policyNum}}</p>
                  </div>
                  <div class="data-group-box three-item">
                    <p>
                      <icon class="dt-icon money102" name="money102"></icon>年交保费
                    </p>
                    <p>{{reportData.prem}}</p>
                  </div>
                  <div class="data-group-box ml-30 four-item">
                    <p>
                      <icon class="dt-icon money101" name="money101"></icon>累计保额
                    </p>
                    <p>{{reportData.basicAmnt | formatMoney}}</p>
                  </div>
                </div>
              </div>
              <div class="type-content family-info">
                <div class="widget">
                  <i class="widget-first"></i>
                  <i class="widget-second"></i>
                  <i class="widget-third"></i>
                  <i class="widget-four"></i>
                </div>
                <h3 class="title">
                  <icon class="dt-icon bias-01" name="bias"></icon>
                  <icon class="dt-icon bias-02" name="bias"></icon>
                  <span>家庭成员</span>
                  <icon class="dt-icon bias-03" name="bias"></icon>
                  <icon class="dt-icon bias-04" name="bias"></icon>
                  <img src="../../assets/imgs/doubt.png" @click="doubtBtn" class="doubt">
                  <div v-transfer-dom>
                    <alert v-model="doubtShow" title="提示" button-text="知道了" content="测试内容">
                      <p class="alert-text"><img src="../../assets/imgs/smile.png">&nbsp;此保障已拥有</p>
                      <p class="alert-text"><img src="../../assets/imgs/cry.png">&nbsp;此保障缺失</p>
                    </alert>
                  </div>
                </h3>
                <div v-for="(item,index) in reportData.familReportList" :key="index" class="family-info-content">
                  <div style="font-size: 0">
                    <div class="family-info-item first-item">{{item.customerName}}</div>
                    <!-- <div class="family-info-item"></div> -->
                    <div class="family-info-item bdhj">
                      <p>保单合计</p>
                      <p class="num">{{item.policyNumber}}</p>
                    </div>
                    <div class="family-info-item bdhj">
                      <p>基本保额</p>
                      <p class="num">{{item.prem | formatMoney}}</p>
                    </div>
                  </div>
                  <div class="health">
                    <ul>
                      <!-- <li>健康&nbsp;<img :src="`../../assets/imgs/${item.securityName.includes('健康')?'smile':'cry'}.png`" class="face"></li>
                      <li>意外&nbsp;<img :src="`../../assets/imgs/${item.securityName.includes('意外')?'smile':'cry'}.png`" class="face"></li> -->
                      <li v-if="item.securityName.includes('健康')">健康&nbsp;<img src="../../assets/imgs/smile.png" class="face"></li>
                      <li v-if="!item.securityName.includes('健康')">健康&nbsp;<img src="../../assets/imgs/cry.png" class="face"></li>
                      <li v-if="item.securityName.includes('意外')">意外&nbsp;<img src="../../assets/imgs/smile.png" class="face"></li>
                      <li v-if="!item.securityName.includes('意外')">意外&nbsp;<img src="../../assets/imgs/cry.png" class="face"></li>
                      <li v-if="item.securityName.includes('人寿')">人寿&nbsp;<img src="../../assets/imgs/smile.png" class="face"></li>
                      <li v-if="!item.securityName.includes('人寿')">人寿&nbsp;<img src="../../assets/imgs/cry.png" class="face"></li>
                      <li v-if="item.securityName.includes('财富')">财富&nbsp;<img src="../../assets/imgs/smile.png" class="face"></li>
                      <li v-if="!item.securityName.includes('财富')">财富&nbsp;<img src="../../assets/imgs/cry.png" class="face"></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="type-content family-info exponent">
                <!-- <div class="title">保障评级</div> -->
                <div class="swiper">
                  <swiper :options="swiperOption">
                    <swiper-slide v-for="(item,index) in reportData.custSynthesisListHtml" :key="index" class="slide-item">
                      <h3 class="title">
                        <icon class="dt-icon bias-01" name="bias"></icon>
                        <icon class="dt-icon bias-02" name="bias"></icon>
                        <span>{{item.name}}保障指数</span>
                        <icon class="dt-icon bias-03" name="bias"></icon>
                        <icon class="dt-icon bias-04" name="bias"></icon>
                      </h3>
                      <div class="baozhangChart" :id="`baozhangChart-${index}`"></div>
                      <div class="baozhangChart-bg"></div>
                    </swiper-slide>
                  </swiper>
                </div>
              </div>
              <div class="type-content family-info">
                <div class="jiaofeitixing">
                  <h3 class="title">
                    <icon class="dt-icon bias-01" name="bias"></icon>
                    <icon class="dt-icon bias-02" name="bias"></icon>
                    <span>交费提醒</span>
                    <icon class="dt-icon bias-03" name="bias"></icon>
                    <icon class="dt-icon bias-04" name="bias"></icon>
                  </h3>
                  <!--交费提醒折线渐变图-->
                  <div id="jiaofeiChart"></div>
                  <div class="m-baofei fz30">
                    <i class="little-round"></i> 当月保费:
                    <font color="#28c76a">{{jiaofeiData.nowMonth.key || '0'}}</font>元
                  </div>
                  <div class="m-baofei-right fz30">
                    年交保费:{{reportData.prem}}元
                  </div>
                  <div @click="gotoPayRemind" class="baozhang-detail fz32">
                    查看交费详情
                    <i></i>
                  </div>
                </div>
                <p class="text-info">提示：以上报告所载内容均为本平台对上述产品的理解，便于您了解学习保险条款所用，我们不承担给付保险金的责任，具体保险责任、责任免除、合同解除及其他内容以保险公司实际合同为准。
                </p>
              </div>
            </div>
          </div>
        </base-scroll>
      </div>
      <div ref="footer" class="dt-footers dt-footers-animation">
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
        <dt-button disabled class="sendInfo" :text="btnText" :radius="10" @click="sendCustomer"></dt-button>
      </div>
    </div>

  </div>
</template>

<script>
import {
  XButton,
  XCircle,
  Tab,
  TabItem,
  Swiper,
  SwiperItem,
  Alert,
  TransferDom
} from "vux";
import { policyService } from "@/config/env";
import DtHeader from "@/components/dtHeader";
import BaseScroll from "@/components/baseScroll";
import api from "@/api/index";
import DtButton from "@/components/dtButton";
import { getDevice } from "@/config/utils.js";
// import reportDetailVue from "./reportDetail.vue";

export default {
  components: {
    XButton,
    DtHeader,
    BaseScroll,
    DtButton,
    XCircle,
    Tab,
    TabItem,
    Alert
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      policyService: policyService,
      device: getDevice(),
      doubtShow: false,
      headerHeight: "",
      swiperOption: {
        // loop: true,
        initialSlide: 1, // 设置初始化索引
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
          rotate: 0,
          stretch: -130, // slide左右距离
          depth: 400, // slide前后距离
          modifier: 0.5, //
          slideShadows: false // 滑块遮罩层
        }
      },
      btnText: "传送给客户",
      wordTotalSize: 0,
      wordDownloadSize: 0,
      wordDownloadStatus: 0,
      reportData: {},
      riskRatingColor: "",
      histogramNameData: [],
      histogramValueData: [],
      jiaofeiData: {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        nowMonth: {
          label: "",
          key: ""
        }
      },
      baozhangData: {
        label: [],
        value: []
      },
      downloadWordUrl: ""
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
    await this.initData();
    this.headerHeight = this.$refs.topInfo.offsetHeight - 3;
    this.$nextTick(() => {
      this.loadSimpleCharts();
    });
  },
  activated() {},
  filters: {
    // 过滤金额显示
    formatMoney(val) {
      if (!val) return "0";
      let money = Number(val).toFixed(0);
      if (money.length <= 4) {
        return `${val}`;
      }
      if (money.length > 4) {
        // let temp = Math.round(money / 10000);
        let temp = (money / 10000).toFixed(2);
        return `${temp}万`;
      }
    }
  },
  methods: {
    async initData() {
      this.histogramNameData = [];
      this.histogramValueData = [];
      let res = await api.shortReportListHistory({
        shortReportId: this.$route.query.reportId
      });

      if (res.status == 1) {
        this.reportData = res.data;
      } else {
        this.$alert(res.msg);
        return;
      }

      if (this.reportData.custSynthesisListHtml == null) {
        this.reportData.custSynthesisListHtml = [];
      }

      for (let item of this.reportData.custSynthesisList) {
        this.histogramNameData.push(item.securityName);
        this.histogramValueData.push(item.userIndex);
      }
      for (let i = 0; i < this.reportData.custSynthesisListHtml.length; i++) {
        this.baozhangData.label[i] = [];
        this.baozhangData.value[i] = [];
        for (let temp of this.reportData.custSynthesisListHtml[i]
          .custListHtml) {
          this.baozhangData.label[i].push(temp.name);
          this.baozhangData.value[i].push(temp.value);
        }
      }
      for (let temp of this.reportData.familyYearPayList) {
        this.jiaofeiData.data[temp.lable - 1] = temp.key;
        if (temp.flag == "Y") {
          this.jiaofeiData.nowMonth.label = temp.lable;
          this.jiaofeiData.nowMonth.key = temp.key;
        }
      }
      switch (this.reportData.riskRating) {
        case "极低":
          this.riskRatingColor = "#f41d1d";
          break;
        case "较低":
          this.riskRatingColor = "#f77210";
          break;
        case "一般":
          this.riskRatingColor = "#f4ce1d";
          break;
        case "正常":
          this.riskRatingColor = "#28c76a";
          break;
        case "较高":
          this.riskRatingColor = "#1d7df4";
          break;
        case "极高":
          this.riskRatingColor = "#8e47de";
          break;
        default:
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
          // this.wordDownloadEnd = true;
        }
      };
    },
    // 持续滚动监听
    listenScroll(axis) {
      let el = this.$refs.footer;
      let scrollTop = Math.abs(axis.y);
      if (scrollTop == 0) {
        el.style.height = "250px";
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
        case 0:
          console.log("无操作");
          break;
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
    doubtBtn() {
      this.doubtShow = true;
    },
    gotoReportDetail() {
      this.$router.push({
        path: "/reportDetailHistory",
        query: {
          reportId: this.$route.query.reportId
          // customerId: this.reportData.custId
        }
      });
    },
    loadSimpleCharts() {
      // 保障评测评分
      this.loadPingceChart();
      // 综合保障指数柱状图
      this.loadBaozhangChart();
      // 交费折线渐变图
      this.loadJiaofeiChart();
    },
    loadPingceChart() {
      let pingceChart = echarts.init(document.getElementById("pingceChart"));
      let option = {
        tooltip: {
          formatter: "{a} : {c}分"
        },
        series: [
          {
            name: "测评得分",
            type: "gauge",
            data: [{ value: this.reportData.securityRating, name: "" }],
            // 轴线
            axisLine: {
              show: true,
              lineStyle: {
                width: 12
              }
            },
            // 刻度样式
            axisTick: {
              show: true,
              length: 4
            },
            // 分割线
            splitLine: {
              length: 12
            },
            axisLabel: {
              distance: 2
            },
            // 仪表盘详情
            detail: {
              show: true
            },
            // 指针
            pointer: {
              length: "84%",
              width: 4
            },
            animationThreshold: 4000,
            animationDuration: 3000
          }
        ]
      };
      pingceChart.setOption(option);
    },
    loadBaozhangChart() {
      let _self = this;
      function option(i) {
        return {
          color: ["#f7bf49"],
          grid: {
            left: "30px",
            right: "30px",
            bottom: "20%",
            top: "10%",
            width: "80%",
            backgroundColor: "transparent"
          },
          xAxis: {
            axisLine: {
              lineStyle: {
                color: "#666"
              }
            },
            axisTick: {
              show: false
            },
            // data: ["老铁", "徐力", "侯哥", "翔哥"]
            data: _self.baozhangData.label[i]
          },
          yAxis: {
            show: false
          },
          series: [
            {
              name: "销量",
              type: "bar",
              data: _self.baozhangData.value[i],
              barWidth: "26%",
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: "top",
                    textStyle: {
                      color: "#333333"
                    }
                    // formatter: function(params) {
                    //   if (params.value == 0) {
                    //     return "";
                    //   } else {
                    //     return params.value;
                    //   }
                    // }
                  }
                }
              }
            }
          ]
        };
      }
      for (let i = 0; i < this.reportData.custSynthesisListHtml.length; i++) {
        echarts
          .init(document.getElementById(`baozhangChart-${i}`))
          .setOption(option(i));
      }
    },
    loadJiaofeiChart() {
      let jiaofeiChart = echarts.init(document.getElementById("jiaofeiChart"));
      let option = {
        tooltip: {
          trigger: "axis",
          hideDelay: "300",
          backgroundColor: "rgba(50,50,50,0.5)",
          formatter: obj => {
            let year = new Date().getFullYear();
            let month = obj[0].axisValueLabel;
            let val = obj[0].data.value;
            let marker = obj[0].marker;
            if (val < 10000) {
              val = val + "元";
            } else if (val >= 10000 && val < 10000000) {
              val = val / 10000 + "万";
            } else if (val >= 10000000) {
              val = val / 10000000 + "千万";
            }
            return `${year}-${month}<br/>${marker}${val}`;
          }
        },
        grid: {
          left: "12%",
          right: "10px",
          bottom: "10%",
          top: "5%"
        },
        xAxis: {
          type: "category",
          // 刻度标签设置
          // axisLabel: {
          //   interval: 0
          // },
          // 刻度设置
          axisTick: {
            length: 7,
            alignWithLabel: true,
            lineStyle: {
              color: "#ccc"
            }
          },
          data: [
            {
              value: "1月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 1 ? "#feaf25" : ""
              }
            },
            {
              value: "2月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 2 ? "#feaf25" : ""
              }
            },
            {
              value: "3月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 3 ? "#feaf25" : ""
              }
            },
            {
              value: "4月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 4 ? "#feaf25" : ""
              }
            },
            {
              value: "5月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 5 ? "#feaf25" : ""
              }
            },
            {
              value: "6月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 6 ? "#feaf25" : ""
              }
            },
            {
              value: "7月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 7 ? "#feaf25" : ""
              }
            },
            {
              value: "8月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 8 ? "#feaf25" : ""
              }
            },
            {
              value: "9月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 9 ? "#feaf25" : ""
              }
            },
            {
              value: "10月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 10 ? "#feaf25" : ""
              }
            },
            {
              value: "11月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 11 ? "#feaf25" : ""
              }
            },
            {
              value: "12月",
              textStyle: {
                color: this.jiaofeiData.nowMonth.label == 12 ? "#feaf25" : ""
              }
            }
          ]
        },
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 4,
              formatter: function(value, index) {
                if (value >= 10000 && value < 10000000) {
                  value = value / 10000 + "万";
                } else if (value >= 10000000) {
                  value = value / 10000000 + "千万";
                }
                return value;
              }
            },
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            type: "line",
            // itemStyle: {
            //   normal: {
            //     color: "#326bfd"
            //   }
            // },
            data: [
              {
                value: this.jiaofeiData.data[0],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[0] === this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[1],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[1] === this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[2],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[2] === this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[3],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[3] === this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[4],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[4] === this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[5],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[5] === this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[6],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[6] === this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[7],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[7] === this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[8],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[8] === this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[9],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[9] === this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[10],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[10] ===
                      this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              },
              {
                value: this.jiaofeiData.data[11],
                itemStyle: {
                  normal: {
                    color:
                      this.jiaofeiData.data[11] ===
                      this.jiaofeiData.nowMonth.key
                        ? "#feaf25"
                        : "#326bfd"
                  }
                }
              }
            ],
            symbol: "emptyCircle",
            symbolSize: 6,
            showAllSymbol: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#326bfd"
                  },
                  {
                    offset: 0.8,
                    color: "#fff"
                  }
                ])
              }
            },
            lineStyle: {
              normal: {
                color: "#326bfd"
              }
            }
          }
        ]
      };
      jiaofeiChart.setOption(option);
    },

    async getWordUrl() {
      let res = await api.familyReportSave({
        familyId: this.$route.query.familyId
      });
      if (res.status == 1) {
        if (res.data != null) {
          this.downloadWordUrl = res.data;
        } else {
          this.$alert("系统错误：下载地址为空");
        }
      } else {
        this.$alert(res.msg);
        return false;
      }
    },

    // 下载word
    async downloadWordBtn() {
      let device = this.device;
      if (this.wordDownloadStatus == 2) {
        let fileName = this.downloadWordUrl.substring(
          this.downloadWordUrl.lastIndexOf("/") + 1
        );
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
      let token = this.$store.state.app_token;
      let downUrl =
        `${policyService}` + this.downloadWordUrl + "?token=" + token;
      console.log(downUrl);
      let fileName = this.downloadWordUrl.substring(
        this.downloadWordUrl.lastIndexOf("/") + 1
      );
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
    // 查看交费详情
    gotoPayRemind() {
      this.$router.push({
        path: "/payRemind",
        query: {
          from: "reportSimpleHistory",
          reportId: this.reportData.reportId,
          customerId: this.reportData.custSynthesisList[0].customerId,
          name: this.reportData.custName
        }
      });
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
    // 返回
    goBack() {
      this.$router.go(-1);
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
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
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
    }
  }
};
</script>

<style lang="less">
@import "../../styles/mixin";
.alert-text {
  text-align: left;
  letter-spacing: 2px;
  color: #333;
  margin: 0 auto;
  width: 60%;
  line-height: 60px;
  img {
    width: 40px;
    vertical-align: sub;
  }
}
.family-reports-simpleHistory-page {
  .current-content {
    position: absolute;
    top: 125px;
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
      .scroll {
        background: #28c76a;
        overflow: hidden;
        .report-content {
          padding-bottom: 270px;
          background: #f5f5f5;
        }
      }
    }
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
      background-color: #d0cbcb;
      border-radius: 10px;
    }
    .weui-btn_default {
      background-color: #d0cbcb;
    }
    .guanjia {
      .phone101 {
        width: 48px;
        height: 48px;
        color: #28c569;
        position: absolute;
        top: 72px;
        right: 40px;
        &:active {
          opacity: 0.6;
        }
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

  .pc-wrapper {
    overflow: hidden;
    background-image: linear-gradient(0deg, #ffffff 20%, #28c76a 100%);
    position: relative;
    .t-head-top {
      width: 434px;
      height: 80px;
      background-color: #76dba0;
      border-radius: 45px 45px 0 0;
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
      .t-ht-round {
        width: 110px;
        height: 44px;
        background-color: #76dba0;
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 45px 45px 0 0;
      }
      .ht-round {
        width: 100px;
        height: 44px;
        background-color: #fff;
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 45px 45px 0 0;
        background-color: #fff;
      }
    }
    .pc-content {
      margin-left: 30px;
      margin-right: 30px;
      height: 470px;
      position: relative;
      margin-top: 70px !important;
      background: url("../../assets/imgs/bg005.png") no-repeat;
      background-size: contain;
      background-position: left bottom;
      z-index: 2;
      .dashed {
        width: 662px;
        height: 1px;
        border: 2px dashed #76dba0;
        position: absolute;
        top: 28px;
        left: 14px;
      }
      .ht-round-little {
        width: 20px;
        height: 20px;
        background-color: #7bd6a0;
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
        z-index: 99;
      }

      .head-top {
        z-index: 9;
        text-align: center;
        width: 420px;
        height: 80px;
        line-height: 100px;
        background-image: linear-gradient(0deg, #76dba0 0%, #ffffff 64%);
        font-size: 30px;
        font-weight: 600;
        font-stretch: normal;
        letter-spacing: 1px;
        color: #333333;
        border-radius: 45px 45px 0 0;
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .ml-30 {
    margin-left: 30px;
  }
  .data-group {
    padding-bottom: 36px;
    margin: 0 30px 0;
    overflow: hidden;
    .one-item {
      background: url("../../assets/imgs/bg001.png") no-repeat;
      margin-bottom: 25px;
      margin-top: 20px;
    }
    .two-item {
      background: url("../../assets/imgs/bg002.png") no-repeat;
      margin-bottom: 25px;
      margin-top: 20px;
    }
    .three-item {
      background: url("../../assets/imgs/bg003.png") no-repeat;
    }
    .four-item {
      background: url("../../assets/imgs/bg004.png") no-repeat;
    }
    .data-group-box {
      background-size: contain;
      background-position: left bottom;
      text-align: center;
      // display: inline-block;
      float: left;
      width: 330px;
      height: 160px;
      background-color: #ffffff;
      box-shadow: 0px 0px 20px 0px rgba(70, 101, 83, 0.1);
      border-radius: 10px;
      .dt-icon {
        color: #232323;
        vertical-align: bottom;
      }
      p:first-child {
        font-size: 28px;
        letter-spacing: 0px;
        color: #232323;
        margin-top: 38px;
      }
      p:last-child {
        font-size: 28px;
        color: #28c76a;
      }
    }
  }
  .exponent {
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-bottom: 0 !important;
    background-color: transparent !important;
    .swiper-slide {
      width: 640px;
      height: 500px;
      background-color: #ffffff;
      box-shadow: 0px 0px 20px 0px rgba(70, 101, 83, 0.1);
      border-radius: 20px;
      position: relative;
      .baozhangChart {
        height: 410px;
      }
      .baozhangChart-bg {
        width: 516px;
        height: 330px;
        position: absolute;
        top: 110px;
        // right: 120px;
        left: 56px;
        background-color: #f1fef6;
        z-index: -1;
      }
    }
  }
  .family-info {
    // overflow: hidden;
    padding-bottom: 20px;
    .widget {
      position: relative;
      i {
        position: absolute;
        top: -36px;
        width: 11px;
        height: 50px;
        background-image: linear-gradient(
          0deg,
          #e8e8e8 0%,
          #f4f4f4 26%,
          #ffffff 52%,
          #e8e8e8 100%
        );
        border-radius: 6px;
      }
      .widget-first {
        left: 36px;
      }
      .widget-second {
        left: 60px;
      }
      .widget-third {
        right: 36px;
      }
      .widget-four {
        right: 60px;
      }
    }
    .title {
      font-size: 32px;
      letter-spacing: 1px;
      color: #333333;
      position: relative;
      > span {
        margin: 0 8px;
      }
      .doubt {
        width: 40px;
        position: absolute;
        top: 30px;
        right: 80px;
      }
      .dt-icon {
        color: #28c76a;
        opacity: 0.5;
        vertical-align: -8px;
      }
      .bias-01 {
        margin: 0 -30px;
      }
      .bias-02 {
        opacity: 0.8;
        margin-right: -10px;
      }
      .bias-03 {
        opacity: 0.8;
        margin-left: -10px;
      }
      .bias-04 {
        margin: 0 -30px;
      }
    }
    .family-info-content {
      width: 649px;
      height: 210px;
      background-color: #f9f9f9;
      border-radius: 10px;
      margin: 0 auto 20px;
      padding: 20px 0 20px 20px;
      .health {
        margin-top: 14px;
        ul {
          li {
            float: left;
            font-size: 28px;
            letter-spacing: 1px;
            color: #333333;
            padding-right: 32px;
            .face {
              width: 40px;
              height: 40px;
              vertical-align: bottom;
            }
          }
        }
      }
      .family-info-item {
        width: 25%;
        height: 100px;
        display: inline-block;
        font-size: 30px;
        letter-spacing: 1px;
        color: #333333;
        text-align: center;
        font-weight: bold;
        vertical-align: middle;
      }
      .first-item {
        text-align: left;
        width: 50%;
      }
      .bdhj {
        font-size: 28px;
        letter-spacing: 1px;
        color: #28c76a;
        font-weight: normal;
        .num {
          font-size: 30px;
          line-height: 42px;
          letter-spacing: 1px;
          color: #666666;
        }
      }
    }
  }
  .type-content {
    background: #fff;
    margin: 20px 20px 0;
    border-radius: 10px;
    &.current {
      margin-top: 10px;
    }
    .pc-chart {
      position: relative;
      padding-top: 30px;
      #pingceChart {
        height: 400px;
        /*background: teal;*/
      }
      .pingce-text {
        font-size: 32px;
        font-weight: 600;
        color: #333;
        position: absolute;
        bottom: -24px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .title {
      padding: 30px 0;
      text-align: center;
      font-size: 32px;
      color: #232323;
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
        background: url("../../assets/imgs/icon_download.png") no-repeat center;
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

  .baozhang-detail {
    position: absolute;
    bottom: -56px;
    right: 20px;
    width: 252px;
    height: 61px;
    border-radius: 30px;
    border: solid 2px #28c76a;
    text-align: center;
    line-height: 60px;
    color: #28c76a;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    .active-op(0.6);
    &:before {
      border-radius: 60px;
      border-color: #28c76a;
    }
    i {
      width: 26px;
      height: 26px;
      display: block;
      background: url("../../assets/imgs/arrow-right@2x.png");
      background-size: 26px;
      margin-left: 4px;
    }
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
    #jiaofeiChart {
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
    margin-top: 60px;
    padding: 30px;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: 1px;
    color: #999999;
  }
}
</style>
