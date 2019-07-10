<template>
  <div class="dt-pages exam-result-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader  title="智能测需"  :leftBack="false"  @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <div class="exam-result-tips">
        {{type == 2?'根据您的家庭结构、已有保障和自身情况综合分析如下:':'根据您所处的人生阶段和自身情况综合分析如下:'}}
      </div>
      <div class="exam-result-content">
        <div class="exam-result-item">
          <div class="score-content">
            <div class="title">{{type == 2?'家庭':''}}保障指数为{{totalScore}}分</div>
            <div class="score-category-content">
              <div class="category"  v-for="(item,index) in scores" :key="index">
                <div class="category-img">
                  <x-circle
                  :percent="item.mark"
                  :stroke-width="5"
                  :trail-width="2"
                  :trail-color="item.trailcolor"
                  :stroke-color="item.strokecolor">
                  <span><em :style="{'color':item.strokecolor}">{{item.mark}}</em><i>分</i></span>
                </x-circle>
                </div>
                <div class="category-text">{{item.name}}</div>
                <div class="category-star">
                  <span class="residual4" v-for="n in item.star" :key="n"></span>
                  <span v-if="item.residual>0" :class="'residual'+item.residual"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="exam-tags">
            <div class="exam-tags-list" :class="tagsStatus?'active':''">
              <span v-for="(item,index) in tags" :key="index">{{item}}</span>
            </div>
            <div class="exam-tags-btn" v-if="tags.length>8">
              <span v-if="!tagsStatus" @click="changeTagsStatus">更多 <icon name="spread" class="dt-icon "></icon></span>
              <span v-if="tagsStatus" @click="changeTagsStatus">收起 <icon name="retract" class="dt-icon "></icon></span>
            </div>
          </div>
          <div class="exam-text">
           {{explain}}
          </div>
        </div>
        <div class="exam-result-item">
          <div class="risk-top">
            <div class="tit">需要关注的风险</div>
            <div class="level">风险等级 <span>
              <i class="low">低</i>
              <i class="middle">中</i>
              <i class="high">高</i>
              </span>
            </div> 
          </div>
          <div class="risk-title">
            <span @click="showDataChart(0)" :class="chartId==0?'active':''"><i v-if="healthLevel" :class="healthLevel"></i>健康风险 <em></em></span>
            <span @click="showDataChart(1)" :class="chartId==1?'active':''"><i v-if="accidentLevel" :class="accidentLevel"></i>意外风险 <em></em></span>
            <span @click="showDataChart(2)" :class="chartId==2?'active':''"><i v-if="lifeLevel" :class="lifeLevel"></i>人寿风险 <em></em></span>
            <span @click="showDataChart(3)" class="bn" :class="chartId==3?'active':''"><i v-if="wealthLevel" :class="wealthLevel"></i>财富风险 <em></em></span>
          </div>
          <div class="risk-text">
           {{examText[chartId]}}
            <p v-if="chartId==0"><img src="../../assets/imgs/examimg-01.png"/><img src="../../assets/imgs/examimg-02.png"/></p>
            <p v-if="chartId==1"><img src="../../assets/imgs/examimg-03.png"/></p>
            <p v-if="chartId==2"><img src="../../assets/imgs/examimg-04.png"/></p>
            <p v-if="chartId==3"><img src="../../assets/imgs/examimg-05.png"/></p>
          </div>
        </div>
        <div class="exam-result-item" v-if="positionType && positionType!=5 && positionType!=8 && positionType!=12">
          <div class="exam-img-tit">特殊风险</div>
          <div class="exam-img">
            <img  v-if="positionType == 1" src="../../assets/imgs/userPortrait/user1.png"/>
            <img  v-if="positionType == 2" src="../../assets/imgs/userPortrait/user2.png"/>
            <img  v-if="positionType == 3" src="../../assets/imgs/userPortrait/user3.png"/>
            <img  v-if="positionType == 4" src="../../assets/imgs/userPortrait/user4.png"/>
            <img  v-if="positionType == 6" src="../../assets/imgs/userPortrait/user6.png"/>
            <img  v-if="positionType == 7" src="../../assets/imgs/userPortrait/user7.png"/>
            <img  v-if="positionType == 9" src="../../assets/imgs/userPortrait/user9.png"/>
            <img  v-if="positionType == 10" src="../../assets/imgs/userPortrait/user10.png"/>
            <img  v-if="positionType == 11" src="../../assets/imgs/userPortrait/user11.png"/>
          </div>
          <div class="exam-map" v-if="proviceTipVo && proviceTipVo.code!=4 && diseaseObj && diseaseObj.status">
            <div class="area-style" :class="'area'+diseaseObj.id">
              <div class="city-list">
                <div class="tit">{{diseaseObj.area}}{{diseaseObj.disease}}发病比例</div>
                <p :class="item.status?'active':''" v-for="(item,index) in diseaseObj.list" :key="index">
                  <i></i>
                  <span>{{item.name}}</span>
                  <span class="ml20">{{item.proportion}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div @click="gotoExamOpt" class="exam-foot-btn">查看优化结果</div>
      </div>
    </div>
  </div>
</template>
<script>
import { XCircle } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { diseaseList } from "@/utils/index";
export default {
  name: "optimizeResult",
  components: {
    dtHeader,
    XCircle
  },
  data() {
    return {
      healthLevel: null,
      accidentLevel: null,
      lifeLevel: null,
      wealthLevel: null,
      chartId: 0,
      tagsStatus: false,
      tags: [],
      explain: null,
      totalScore: 0,
      scores: [
        {
          id: "1",
          name: "健康保障",
          mark: 0,
          value: 0,
          strokecolor: "#7bc0fa",
          trailcolor: "#c8e5fe",
          star: 0,
          residual: 0
        },
        {
          id: "2",
          name: "意外保障",
          mark: 0,
          value: 0,
          strokecolor: "#51c634",
          trailcolor: "#c8fec2",
          star: 0,
          residual: 0
        },
        {
          id: "3",
          name: "人寿保障",
          mark: 0,
          value: 0,
          strokecolor: "#ff8300",
          trailcolor: "#feebc8",
          star: 0,
          residual: 0
        },
        {
          id: "4",
          name: "财富保障",
          mark: 0,
          value: 0,
          strokecolor: "#f97abb",
          trailcolor: "#f2ccfe",
          star: 0,
          residual: 0
        }
      ],
      shareId: null,
      type: null,
      examText: [
        "如今环境污染日益严重，加上生活节奏快、压力大等因素，重疾的发生率越来越高。听说身边某朋友查出了癌症，眼看着从幸福之家到卖房治病。重疾保障必不可少，让我们多一些保障，少一些后悔。",
        "幸福安康是我们共同的期望，但意外的来临总让我们猝不及防。我们总是习惯存有侥幸心理，总觉得自己会是那个幸运的人，那么如果、假如、万一、maybe当意外发生，你一定会追悔莫及。",
        "如今大家都背负着很大的经济压力，包括房贷、子女教育和老人赡养等。这种情况下，一旦家庭经济支柱发生不幸，整个家庭都会陷入风雨飘摇的境地。储备足额的保障，是对家人爱的体现！",
        "根据第六次全国人口普查数据显示，我国人口平均预期寿命达到74.83岁，比2000年的71.40岁提高3.43岁。随着人口老龄化日益严重，年金险可以有效转嫁老龄风险是您长期的保障规划，为您幸福晚年增添保障。"
      ],
      positionType: null, //用户职业
      proviceTipVo: {},
      diseaseObj: {},
      shareType: null,
      openId: null
    };
  },
  created() {
    this.scordId = this.$route.query.scordId;
    this.type = this.$route.query.type;
    this.initData();
  },
  mounted() {},
  methods: {
    async initData() {
      let $this = this;
      let result = await api.findMeasureResult({
        id: this.scordId
      });
      if (result.status == 1) {
        if (result.data) {
          let resultData = result.data;
          this.tags = resultData.tip;
          this.explain = resultData.explain;
          this.positionType = resultData.positionType;
          this.proviceTipVo = resultData.proviceTipVo;
          this.shareId = resultData.shareId;
          this.openId = resultData.openId;
          this.diseaseObj = diseaseList(this.proviceTipVo);
          if (resultData.totalScore >= 100) {
            this.totalScore = 99;
          } else {
            this.totalScore = resultData.totalScore;
          }
          let scores = this.scores;
          let time = 0;
          let animation = setInterval(function() {
            for (let i = 0; i < scores.length; i++) {
              if (scores[i].id == "1") {
                scores[i].value = resultData.healthScore;
                $this.healthLevel = $this.countLevel(resultData.healthScore);
              } else if (scores[i].id == "2") {
                scores[i].value = resultData.accidentScore;
                $this.accidentLevel = $this.countLevel(
                  resultData.accidentScore
                );
              } else if (scores[i].id == "3") {
                scores[i].value = resultData.lifeScore;
                $this.lifeLevel = $this.countLevel(resultData.lifeScore);
              } else if (scores[i].id == "4") {
                scores[i].value = resultData.wealthScore;
                $this.wealthLevel = $this.countLevel(resultData.wealthScore);
              }
              scores[i].mark += 20;
              if (scores[i].mark >= scores[i].value) {
                if (scores[i].value >= 100) {
                  scores[i].value = 99;
                }
                scores[i].mark = scores[i].value;
              }
              $this.countStars(scores[i]);
            }
            time++;
            if (time >= 5) {
              clearInterval(animation);
            }
          }, 400);
        }
      } else {
        this.$alert(result.msg);
      }
      let recordId = this.$route.query.recordId;
      api.updateMeasureStatus({
        id: recordId
      });
    },
    countLevel(value) {
      if (value <= 40) {
        return "high";
      } else if (69 >= value && value >= 41) {
        return "middle";
      } else if (100 >= value && value >= 70) {
        return "low";
      }
    },
    countStars(item) {
      if (item.mark == 0) {
      } else {
        let whole = parseInt(item.mark / 20);
        item.star = whole;
        let residual = item.mark - whole * 20;
        let residualStyle = 0;
        if (9 >= residual && residual >= 1) {
          residualStyle = 1;
        } else if (residual == 10) {
          residualStyle = 2;
        } else if (19 >= residual && residual >= 11) {
          residualStyle = 3;
        }
        item.residual = residualStyle;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    changeTagsStatus() {
      this.tagsStatus = !this.tagsStatus;
    },
    showDataChart(type) {
      this.chartId = type;
    },
    async gotoExamOpt() {
      let pageUrl = "/optimizecomplete";
      let type = this.type;
      if (type == 2) {
        pageUrl = "/optimizefamilyComplete";
      }
      let result = await api.optimizeMeasure({
        shareId: this.shareId,
        openId: this.openId
      });
      if (result.status == 1) {
        if (result.data) {
          this.$router.push({
            path: pageUrl,
            query: {
              shareType: this.type,
              shareId: this.shareId,
              openId: this.openId
            }
          });
        } else {
          this.$toast("用户暂未优化");
        }
      } else {
        this.$toast(result.msg);
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

.exam-result-page {
  background-color: #f5f5f5;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .exam-result-tips {
    height: 97px;
    text-align: center;
    line-height: 97px;
    color: #666;
    font-size: 30px;
  }
  .score-content {
    background: #fff;
    border-radius: 10px;
    .title {
      position: relative;
      margin: 0 auto;
      top: -7px;
      color: #fff;
      font-weight: bold;
      font-size: 26px;
      width: 406px;
      height: 63px;
      text-align: center;
      line-height: 63px;
      background-image: url("../../assets/imgs/opt-titlebg.png");
      background-size: cover;
      background-repeat: no-repeat;
    }
    .score-category-content {
      overflow: hidden;
      background-image: url("../../assets/imgs/opt-boxbg.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: left bottom;
    }
    .category {
      width: 25%;
      float: left;
      .category-text {
        text-align: center;
        margin-bottom: 10px;
      }
      .category-img {
        width: 120px;
        height: 120px;
        margin: 50px auto 20px;
        em {
          font-style: normal;
          font-size: 46px;
          font-weight: 500;
        }
        i {
          font-style: normal;
          color: #9ea7b3;
          font-size: 16px;
        }
      }
      .category-star {
        text-align: center;
        margin-bottom: 80px;
        span {
          width: 26px;
          height: 26px;
          display: inline-block;
          background-size: cover;
        }
        .residual1 {
          background-image: url("../../assets/imgs/star1.png");
        }
        .residual2 {
          background-image: url("../../assets/imgs/star2.png");
        }
        .residual3 {
          background-image: url("../../assets/imgs/star3.png");
        }
        .residual4 {
          background-image: url("../../assets/imgs/star4.png");
        }
      }
    }
  }
  .exam-result-content {
    padding: 0 20px;
    .exam-result-item {
      background-color: #fff;
      border-radius: 10px;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .exam-tags {
      padding: 10px;
      overflow: hidden;
      .exam-tags-list {
        width: 105%;
        max-height: 160px;
        overflow: hidden;
        span {
          float: left;
          height: 60px;
          width: 154px;
          border-radius: 14px;
          color: #28c76a;
          line-height: 60px;
          text-align: center;
          border: 1px #28c76a solid;
          margin-left: 15px;
          margin-top: 20px;
          overflow: hidden;
        }
      }
      .active {
        max-height: 800px;
        height: auto;
      }
      .exam-tags-btn {
        text-align: center;
        font-size: 24px;
        color: #666;
        margin-top: 10px;
        .dt-icon {
          width: 20px;
          color: #999;
          height: 28px;
        }
      }
    }
    .exam-text {
      margin-top: 12px;
      border-top: 1px #e8e8e8 solid;
      font-size: 26px;
      line-height: 50px;
      color: #232323;
      padding: 24px 28px 0 34px;
    }
    .chartData {
      height: 300px;
      width: 700px;
    }
    .risk-top {
      padding: 23px;
      overflow: hidden;
      .tit {
        font-size: 30px;
        color: #333333;
        font-weight: bold;
        float: left;
      }
      .level {
        color: #666666;
        float: right;
        position: relative;
        bottom: 6px;
        span {
          background: #eeeeee;
          padding: 5px 10px 8px;
          display: inline-block;
          border-radius: 25px;
          i {
            display: inline-block;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            color: #fff;
            font-style: normal;
            font-size: 20px;
            text-align: center;
            line-height: 40px;
          }
        }
      }
    }
    .risk-title {
      margin-bottom: 50px;
      span {
        padding: 0 20px;
        color: #666;
        font-size: 26px;
        border-right: 1px #e8e8e8 solid;
        i {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          position: relative;
          bottom: 6px;
          margin-right: 10px;
        }
        em {
          display: none;
          position: absolute;
          width: 100px;
          left: 40px;
          top: 45px;
          height: 4px;
          background-color: #28c76a;
        }
      }
      .active {
        color: #333;
        position: relative;
        em {
          display: block;
        }
      }
      .bn {
        border-right: none;
      }
    }
    .low {
      background-color: #28c76a;
    }
    .middle {
      background-color: #fea733;
    }
    .high {
      background-color: #ef1717;
    }
    .risk-bt {
      padding: 25px 0;
      text-align: center;
      font-size: 26px;
      color: #333;
    }
    .risk-text {
      color: #666;
      padding: 27px;
      line-height: 1.5;
      font-size: 24px;
      border-top: 1px #e8e8e8 solid;
      p {
        img {
          width: 100%;
          margin-top: 20px;
          display: block;
        }
      }
    }
    .exam-img-tit {
      font-size: 30px;
      color: #333333;
      font-weight: bold;
      padding: 20px;
    }
    .exam-img {
      text-align: center;
      img {
        width: 670px;
        margin: 0 auto;
      }
    }
    .exam-map {
      .area-style {
        width: 680px;
        height: 582px;
        margin: 0 auto;
        background-size: cover;
        background-repeat: no-repeat;
      }
      .city-list {
        .tit {
          font-size: 18px;
          color: #232323;
        }
        position: relative;
        top: 400px;
        left: 0;
        padding: 0 35px;
        overflow: hidden;
        p {
          float: left;
          font-size: 16px;
          width: 150px;
          margin-top: 13px;
          position: relative;
          padding-left: 20px;
          i {
            width: 7px;
            height: 7px;
            display: block;
            border-radius: 50%;
            position: absolute;
            left: 0;
            top: 8px;
            background-color: #616cd6;
          }
        }
        .active {
          color: #ff0a32;
          i {
            background-color: #ff0a32;
          }
        }
        .ml20 {
          margin-left: 20px;
        }
      }
      .area1 {
        background-image: url("../../assets/imgs/mapImg/west/sc.png");
      }
      .area2 {
        background-image: url("../../assets/imgs/mapImg/west/cq.png");
      }
      .area3 {
        background-image: url("../../assets/imgs/mapImg/west/gz.png");
      }
      .area4 {
        background-image: url("../../assets/imgs/mapImg/west/yn.png");
      }
      .area8 {
        background-image: url("../../assets/imgs/mapImg/west/qh.png");
      }
      .area10 {
        background-image: url("../../assets/imgs/mapImg/west/xj.png");
      }
      .area11 {
        background-image: url("../../assets/imgs/mapImg/west/gx.png");
      }
      .area13 {
        background-image: url("../../assets/imgs/mapImg/central/sx.png");
      }
      .area14 {
        background-image: url("../../assets/imgs/mapImg/central/jl.png");
      }
      .area15 {
        background-image: url("../../assets/imgs/mapImg/central/hlj.png");
      }
      .area16 {
        background-image: url("../../assets/imgs/mapImg/central/ah.png");
      }
      .area17 {
        background-image: url("../../assets/imgs/mapImg/central/jx.png");
      }
      .area18 {
        background-image: url("../../assets/imgs/mapImg/central/hn.png");
      }
      .area19 {
        background-image: url("../../assets/imgs/mapImg/central/hb.png");
      }
      .area21 {
        background-image: url("../../assets/imgs/mapImg/east/bj.png");
      }
      .area22 {
        background-image: url("../../assets/imgs/mapImg/east/tj.png");
      }
      .area23 {
        background-image: url("../../assets/imgs/mapImg/east/hb.png");
      }
      .area25 {
        background-image: url("../../assets/imgs/mapImg/east/sh.png");
      }
      .area26 {
        background-image: url("../../assets/imgs/mapImg/east/js.png");
      }
      .area27 {
        background-image: url("../../assets/imgs/mapImg/east/zj.png");
      }
      .area30 {
        background-image: url("../../assets/imgs/mapImg/east/gd.png");
      }
      .area31 {
        background-image: url("../../assets/imgs/mapImg/east/hn.png");
      }
    }
    .exam-foot-btn {
      margin: 30px;
      height: 80px;
      border-radius: 38px;
      line-height: 80px;
      text-align: center;
      font-size: 28px;
      color: #fff;
      background-color: #28c76a;
    }
  }
}
</style>
