<template>
  <div class="dt-pages look-answers-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader  title="查看答案"  :leftBack="false"  @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
       <div class="title">
        <p class="tit" v-if="name"> {{name}}{{type == 2?'家':''}}的测需答案</p>
        <p>进一步了解客户需求 加保更加精准 <span>共{{list.length}}题</span></p>
       </div>
       <div class="list" :class="listType">
         <div class="list-content">
           <table class="table">
            <thead>
              <tr class="list-top">
                <th class="w15 bln">序号</th>
                <th class="w50">问题</th>
                <th class="w35 brn">答案</th>
              </tr>
            </thead>
            <tbody class="list-li">
              <tr  v-for="(item,index) in list" :key="index">
                <td class="w15 bln">{{index+1}}</td>
                <td class="w50 ">{{item.question}}</td>
                <td class="w35 answers brn"><span  v-html="item.answer"></span></td>
              </tr>
            </tbody>
          </table>
         </div>
       </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils.js";
export default {
  name: "lookAnswers",
  components: {
    dtHeader
  },
  data() {
    return {
      device: getDevice(),
      listType: "",
      list: [
        // {
        //   question: "1111",
        //   answer: "bb11111111111111111111"
        // },
        // {
        //   question: "1111",
        //   answer: "bb11111111111111111111"
        // },
        // {
        //   question: "1111",
        //   answer: "bb11111111111111111111"
        // }
      ],
      name: "",
      type: ""
    };
  },
  created() {
    this.name = this.$route.query.name;
    this.type = this.$route.query.type;
    let device = this.device;
    if (device == "iPhoneX") {
      this.listType = "ipx";
    }
    this.initData();
  },
  methods: {
    async initData() {
      let answerResultId = this.$route.query.answerResultId;
      let result = await api.getAnswerInfo({
        id: answerResultId
      });
      if (result.status == 1) {
        if (result.data) {
          let measureAnswerVos = result.data.measureAnswerVos;
          for (let i = 0; i < measureAnswerVos.length; i++) {
            let answerText = "";
            for (let j = 0; j < measureAnswerVos[i].answerVos.length; j++) {
              let obj = {
                value: measureAnswerVos[i].answerVos[j].value
              };
              let secondVal = "";
              if (
                measureAnswerVos[i].answerVos[j].second &&
                measureAnswerVos[i].answerVos[j].second.value
              ) {
                secondVal = measureAnswerVos[i].answerVos[j].second.value;
              }
              answerText +=
                "<em>" + obj.value + "<i>" + secondVal + "</i>" + "</em>";
            }
            measureAnswerVos[i].answer = answerText;
          }
          this.list = measureAnswerVos;
        }
      } else {
        this.$alert(result.msg);
      }
      let recordId = this.$route.query.recordId;
      api.updateMeasureStatus({
        id: recordId
      });
    },
    goBack() {
      this.$router.go(-1);
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

.look-answers-page {
  background-color: #ffffff;
  .dt-content {
    padding: 30px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .title {
    color: #666;
    font-size: 26px;
    .tit {
      color: #232323;
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    p {
      overflow: hidden;
    }
    span {
      color: #a7a7a7;
      float: right;
    }
  }
  .list {
    margin-top: 60px;
    border: 1px #bdbcbc solid;
    border-radius: 20px;
    overflow: hidden;
    .table {
      border-radius: 10px;
      border-collapse: collapse;
      letter-spacing: 0px;
      tr {
        text-align: center;
        line-height: 50px;
        th {
          border: 1px solid #dedede;
          border-top: none;
          font-weight: normal;
          line-height: 50px;
        }
        td {
          padding: 20px;
          border: 1px solid #dedede;
          border-collapse: collapse;
          letter-spacing: 0px;
          line-height: 50px;
        }
        &:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }
    .list-top {
      background-color: #f2fcf6;
      color: #232323;
      font-weight: bold;
      text-align: center;
      overflow: hidden;
      border-radius: 10px 10px 0 0;
      border-bottom: 1px #bdbcbc solid;
      th {
        padding: 15px;
        border-top: none;
      }
    }
    span {
      float: left;
      display: block;
      width: 100%;
      em {
        display: block;
        font-style: normal;
      }
      i {
        font-style: normal;
      }
    }
    .list-li {
      text-align: center;
      overflow: hidden;
      border-bottom: 1px #bdbcbc solid;
      &:last-child {
        border-bottom: none;
      }
    }
    .w15 {
      width: 15%;
    }
    .w35 {
      width: 35%;
    }
    .w50 {
      width: 50%;
    }
    .br {
      border-right: 1px #bdbcbc solid;
    }
    .bl {
      border-left: 1px #bdbcbc solid;
    }
    .brn {
      border-right: none !important;
    }
    .bln {
      border-left: none !important;
    }
    .answers {
      color: #28c76a;
    }
  }
  .ipx {
    border: 0.0019rem #bdbcbc solid;
    table {
      tr {
        th {
          border: 0.0019rem solid #dedede !important;
        }
        td {
          border: 0.0019rem solid #dedede !important;
        }
      }
    }
  }
}
</style>
