<template>
  <div class="dt-pages exam-family-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader title="智能测需" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <div class="optimize-finally">
        <div class="title">优化后保障指数</div>
        <div class="optimize-score">
          <span>
            <em>100</em>
            <i>分</i>
          </span>
        </div>
      </div>
      <div class="proposal">
        <div class="title">建议提升保障</div>
        <div class="optimize-members">
          <tab :animate="false" :line-width="2">
            <tab-item
              v-for="(item,index) in members"
              :key="index"
              @on-item-click="selectMember(index)"
              :selected="index===0"
            >{{item.name}}</tab-item>
          </tab>
        </div>
        <div class="proposal-item" v-for="(item,index) in list" :key="index">
          <div class="item-top">
            <span class="tit color1">{{item.name}}保障</span>
            <span>{{item.secondExplain}}</span>
          </div>
          <div class="item-content">
            <div class="item-target">
              <div class="item-target-li target">
                <div class="tit">保障目标</div>
                <div class="progress">
                  <p class="progressBar">
                    <span
                      class="progressBarValue"
                      :style="{width:(100-((item.targetMin/item.targetMax))*100)+'%'}"
                    ></span>
                  </p>
                  <span class="gray start">0万</span>
                  <span
                    class="min"
                    :style="{width:(100-((item.targetMin/item.targetMax)*100))+'%'}"
                  >
                    <i>{{item.targetMin}}万</i>
                  </span>
                  <span class="end">
                    <i>{{item.targetMax}}万</i>
                  </span>
                </div>
              </div>
              <div class="item-target-li exist">
                <div class="tit">已有保障</div>
                <div class="progress" v-if="item.exist>0">
                  <p class="progressBar" v-if="item.exist>0 && item.exist <= item.targetMax ">
                    <span
                      class="progressBarValue"
                      :style="{width:(item.exist/item.targetMax)*100+'%'}"
                    ></span>
                  </p>
                  <p
                    class="progressBar"
                    v-if="item.exist>item.targetMax"
                    :class="item.exist>item.targetMax?'flow':''"
                  >
                    <span
                      class="progressBarValue"
                      :style="{width:(item.targetMax/item.exist)*100+'%'}"
                    ></span>
                  </p>
                  <span class="gray start">0万</span>
                  <span
                    class="min"
                    v-if="item.exist<item.targetMax"
                    :style="{width:(item.exist/item.targetMax)*100+'%'}"
                  >
                    <i>{{item.exist}}万</i>
                  </span>
                  <span class="end">
                    <i>{{item.exist>item.targetMax?item.exist:item.targetMax}}万</i>
                  </span>
                </div>
                <div class="progress" v-if="item.exist == 0">
                  <p class="progressBar">
                    <em>需注意，{{item.name}}保障一点都没有哦~</em>
                  </p>
                </div>
              </div>
              <div class="item-target-li" :class="item.exist==0?'graveNeed':'need'">
                <div class="tit">保障缺口</div>
                <div class="progress" v-if="item.exist<item.targetMin && item.exist!=0">
                  <p class="progressBar">
                    <span
                      class="progressBarValue"
                      :style="{width:(((item.targetMax - item.exist)-(item.targetMin -item.exist))/item.targetMax)*100+'%',left:(item.targetMin -item.exist)/item.targetMax*100+'%'}"
                    ></span>
                  </p>
                  <span class="gray start">0万</span>
                  <span
                    class="min"
                    :style="{left:(item.targetMin -item.exist)/item.targetMax*100+'%'}"
                  >
                    <i>{{item.targetMin-item.exist}}万</i>
                  </span>
                  <span
                    class="section"
                    :style="{width:(item.targetMax - item.exist)/item.targetMax*100+'%'}"
                  >
                    <i>{{item.targetMax-item.exist}}万</i>
                  </span>
                  <span class="end">
                    <i>{{item.targetMax}}万</i>
                  </span>
                </div>
                <div class="progress" v-if="item.exist>=item.targetMin">
                  <p class="progressBar">
                    <em>{{item.name}}保障{{item.exist>item.targetMax?'非常充足':'充足'}}{{item.exist>item.targetMax?'，很赞':''}}</em>
                  </p>
                </div>
                <div class="progress" v-if="item.exist==0">
                  <p class="progressBar">
                    <span
                      class="progressBarValue"
                      :style="{width:(100-((item.targetMin/item.targetMax))*100)+'%'}"
                    ></span>
                  </p>
                  <span class="gray start">0万</span>
                  <span
                    class="min"
                    :style="{width:(100-((item.targetMin/item.targetMax)*100))+'%'}"
                  >
                    <i>{{item.targetMin}}万</i>
                  </span>
                  <span class="end">
                    <i>{{item.targetMax}}万</i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="item-text">
            <span class="status low" v-if="item.level == 1">保障:低</span>
            <span class="status middle" v-if="item.level == 2">保障:中</span>
            <span class="status high" v-if="item.level == 3">保障:高</span>
            {{item.levelTip}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tab, TabItem } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
export default {
  name: "optimizefamilyComplete",
  components: {
    dtHeader,
    Tab,
    TabItem
  },
  data() {
    return {
      members: [],
      shareId: null,
      shareType: null,
      list: [],
      isusefulStatus: null,
      familySecondTypeVos: []
    };
  },
  created() {
    this.shareId = this.$route.query.shareId;
    this.shareType = this.$route.query.shareType;
    this.openId = this.$route.query.openId;
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      //托管 家庭
      let result = await api.optimizeMeasure({
        shareId: this.shareId,
        openId: this.openId
      });
      if (result.status == 1) {
        if (result.data) {
          let familySecondTypeVos = result.data.familySecondTypeVos;
          this.familySecondTypeVos = familySecondTypeVos;
          for (let i = 0; i < familySecondTypeVos.length; i++) {
            this.members.push({
              id: familySecondTypeVos[i].customerId,
              name: familySecondTypeVos[i].customerName
            });
          }
          let list = familySecondTypeVos[0].custSecondTypeVos;
          for (let i = 0; i < list.length; i++) {
            list[i].targetMax = parseInt(list[i].aimMax / 10000);
            list[i].targetMin = parseInt(list[i].aimMin / 10000);
            list[i].exist = parseInt(list[i].valueMax / 10000);
          }
          this.list = list;
        }
      } else {
        this.$alert(result.msg);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    selectMember(index) {
      let familySecondTypeVos = this.familySecondTypeVos;
      let list = familySecondTypeVos[index].custSecondTypeVos;
      for (let i = 0; i < list.length; i++) {
        list[i].targetMax = parseInt(list[i].aimMax / 10000);
        list[i].targetMin = parseInt(list[i].aimMin / 10000);
        list[i].exist = parseInt(list[i].valueMax / 10000);
      }
      this.list = list;
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

.exam-family-page {
  background: #28c76a;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 130px;
  }
  .pdt160 {
    padding-bottom: 160px;
  }
  .vux-1px-b:after {
    border: none;
  }
  .optimize-members {
    background: #28c76a;
    color: #fff;
    font-size: 28px;
    padding: 0 30px 15px;
    overflow: auto;
    .vux-tab-container {
      overflow: auto;
    }
    .vux-tab {
      background: #28c76a;
      padding-bottom: 3px;
    }
    .active {
      color: #fff;
    }
    .vux-tab .vux-tab-item.vux-tab-selected {
      color: #fff;
      border-bottom: 2px #fff solid;
      background-image: url("../../assets/imgs/tab_family_bg.png");
      background-position: 0 50%;
      background-repeat: no-repeat;
    }
    .vux-tab .vux-tab-item {
      color: #fff;
      text-align: center;
      background: transparent;
      background-image: url("../../assets/imgs/tab_family_bg.png");
      background-position: 0 50%;
      background-repeat: no-repeat;
      border-width: 1px !important;
      width: 100px !important;
      float: left;
      flex: none;
      overflow: hidden;
      &:first-child {
        background: transparent;
      }
    }
    .scrollable .vux-tab-ink-bar {
      background-color: #fff;
      bottom: 0;
    }
  }
  .optimize-finally {
    background: #28c76a;
    padding: 25px 30px 0;
    .title {
      color: #fff;
      text-align: center;
      letter-spacing: 5px;
    }
    .optimize-score {
      width: 690px;
      height: 400px;
      background: url("../../assets/imgs/optimize.png");
      background-size: cover;
      margin: 30px auto 0;
      color: #6d5b12;
      font-weight: bold;
      overflow: hidden;
      span {
        text-align: center;
        display: block;
        margin-top: 280px;
      }
      em {
        font-size: 60px;
        font-style: normal;
      }
      i {
        font-size: 33px;
        font-style: normal;
        margin-left: 5px;
      }
    }
  }
  .proposal {
    background: #28c76a;
    padding: 20px;
    color: #333;
    .title {
      font-size: 30px;
      font-weight: 600;
      margin: 15px 0 5px;
    }
    .proposal-item {
      background: #fff;
      border-radius: 10px;
      padding: 20px 0;
      margin-bottom: 20px;
      .item-top {
        position: relative;
        .tit {
          height: 60px;
          border-radius: 0 25px 25px 0;
          color: #fff;
          display: inline-block;
          line-height: 60px;
          padding-left: 15px;
          padding-right: 25px;
          margin-right: 15px;
        }
        .txt {
          margin: 0 30px 0 10px;
        }
        .status {
          color: #dd2828;
          border: 2px #dd2828 solid;
          border-radius: 18px;
          padding: 5px 20px;
          font-size: 28px;
        }
        .color1 {
          background: #3bd088;
        }
        .color2 {
          background: #5aa1e3;
        }
        .color3 {
          background: #df3636;
        }
        .color4 {
          background: #fcbb4b;
        }
        .dt-icon {
          color: #a3a3a3;
          height: 30px;
          width: 30px;
          margin-left: 10px;
          position: absolute;
          top: 10px;
          right: 20px;
        }
      }
      .item-content {
        margin: 15px 20px 20px 20px;
        overflow: hidden;
        .item-target {
          margin: 0 10px;
          .item-target-li {
            overflow: hidden;
            margin-top: 15px;
            padding-bottom: 10px;
            .tit {
              color: #333;
              font-size: 26px;
              float: left;
              width: 150px;
              height: 60px;
            }
            .progress {
              float: left;
              position: relative;
              margin-top: 8px;
              margin-left: 22px;
              .progressBar {
                height: 20px;
                width: 400px;
                border-radius: 8px;
                background-color: #eeeeee;
                em {
                  font-style: normal;
                  display: block;
                  text-align: center;
                  font-size: 20px;
                  height: 20px;
                  line-height: 20px;
                }
              }
              .progressBarValue {
                height: 20px;
                top: 0;
                border-radius: 8px;
              }
              span {
                font-size: 20px;
                position: absolute;
              }
              .gray {
                color: #999;
              }
              .green {
                color: #28c76a;
              }
              .start {
                left: -45px;
                top: -8px;
              }
              .min {
                top: 25px;
                i {
                  display: inline-block;
                  width: 70px;
                }
              }
              .end {
                right: -45px;
                top: -8px;
                i {
                  right: -35px;
                }
              }
              i {
                font-style: normal;
                position: relative;
              }
            }
          }
          .target {
            .progressBarValue {
              background-color: #28c76a;
              right: 0;
            }
            .min {
              right: 0;
              text-align: left;
              i {
                left: -30px;
                color: #28c76a;
              }
            }
            .end {
              color: #28c76a;
            }
          }
          .exist {
            .progressBarValue {
              background-color: #fcbb4b;
              left: 0;
            }
            .progress {
              .flow {
                background-color: #fea201;
                .progressBarValue {
                  border-radius: 8px 0 0 8px;
                }
              }
            }
            .min {
              left: 0;
              color: #fcbb4b;
              text-align: right;
              i {
                right: -20px;
              }
            }
            .end {
              color: #fcbb4b;
            }
            em {
              color: #fcbb4b;
            }
          }
          .need {
            .progressBarValue {
              background-color: #758efe;
            }
            .min {
              text-align: left;
              i {
                left: 0;
              }
            }
            .section,
            .end,
            .min {
              color: #758efe;
            }
            .section {
              top: 25px;
              text-align: right;
              i {
                right: -20px;
              }
            }
            em {
              color: #758efe;
            }
          }
          .graveNeed {
            .progressBarValue {
              background-color: #758efe;
              right: 0;
            }
            .min {
              right: 0;
              text-align: left;
              i {
                left: -30px;
                color: #758efe;
              }
            }
            .end {
              color: #758efe;
            }
          }
        }
        .tip {
          color: #999999;
          font-size: 24px;
          text-align: right;
          margin-top: 20px;
        }
      }
      .item-text {
        border-top: 2px #e8e8e8 solid;
        padding-top: 18px;
        margin: 0 20px;
        line-height: 42px;
        font-size: 24px;
        color: #666;
        .status {
          height: 33px;
          width: 115px;
          display: inline-block;
          text-align: center;
          line-height: 33px;
          border-radius: 15px;
          margin-right: 20px;
        }
        .low {
          color: #f41d1d;
          border: 1px #f41d1d solid;
        }
        .middle {
          color: #f4ce1d;
          border: 1px #f4ce1d solid;
        }
        .high {
          color: #28c76a;
          border: 1px #28c76a solid;
        }
      }
    }
    .proposal-other {
      margin-bottom: 40px;
      background: #fff;
      border-radius: 10px;
      padding: 30px 20px 20px;
      .tit {
        color: #333;
        font-size: 28px;
        overflow: hidden;
        .dt-icon {
          color: #999;
          float: right;
        }
      }
      .txt {
        span {
          color: #999;
          float: right;
          margin-left: 40px;
          margin-right: 20px;
        }
        .icon {
          height: 30px;
          width: 30px;
          display: inline-block;
          background-size: cover;
          background-repeat: no-repeat;
          background-size: cover;
          position: relative;
          top: 5px;
          margin-right: 13px;
        }
        .smilingface {
          background-image: url("../../assets/imgs/smilingface1.png");
        }
        .cryingface {
          background-image: url("../../assets/imgs/cryingface1.png");
        }
        .current {
          color: #fdc14b;
          .smilingface {
            background-image: url("../../assets/imgs/smilingface.png");
          }
          .cryingface {
            background-image: url("../../assets/imgs/cryingface.png");
          }
        }
      }
      .ceshi {
        margin-top: 25px;
        text-align: right;
        color: #28c76a;
        font-size: 28px;
        .dt-icon {
          color: #cccccc;
          position: relative;
          bottom: 2px;
        }
      }
    }
    .proposal-share {
      margin: 20px 30px;
      height: 80px;
      text-align: center;
      color: #fff;
      font-size: 28px;
      line-height: 80px;
      background-color: #fcd222;
      border-radius: 38px;
    }
    .proposal-popup {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 164px;
      background: rgba(16, 80, 42, 0.8);
      font-size: 28px;
      color: #fff;
      .proposal-popup-content {
        position: relative;
      }
      dl {
        overflow: hidden;
        margin: 25px 30px;
      }
      dt {
        float: left;
        width: 125px;
        img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      }
      dd {
        float: left;
        height: 50px;
        line-height: 50px;
      }
      .ml20 {
        margin-left: 20px;
      }
      .ml45 {
        margin-left: 45px;
      }
      .phone {
        position: absolute;
        color: #28c569;
        width: 35px;
        height: 35px;
        padding: 8px;
        border: 2px #28c569 solid;
        right: 40px;
        bottom: 10px;
        border-radius: 50%;
      }
    }
    .pie-style {
      width: 200px;
      margin: 10px 15px 15px;
      height: 200px;
    }
  }
}
</style>
