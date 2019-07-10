<template>
  <div class="dt-pages safeguard-details-page">
    <div class="dt-header">
      <dtHeader :title="`${this.$route.query.name}的保障详情`" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="wrapper">
        <div class="box">
          <h3 class="title">
            <i class="title-icon"></i>
            <font color="#28c76a">{{this.$route.query.type}}</font> &nbsp;&nbsp;{{manys}}张保单
          </h3>
          <div v-for="(v,i) in initListData" :key="i" class="box-item">
            <h3 class="item-title">
              <span class="insuranceName">
                <span class="circle">{{i + 1}}</span>
                {{v.productName}}
              </span>
              <p>
                <span class="insured">投保人:{{v.insurerName}}</span>
                <span class="year-baofei">年交保费:{{v.prem}}元</span>
              </p>
            </h3>

            <div>
              <table class="table">
                <thead>
                  <tr>
                    <th>保单号</th>
                    <th>保险公司</th>
                    <th>基本保额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="white-bg">
                    <td>
                      <span class="policyNo">{{v.policyNo}}</span>
                    </td>
                    <td>{{v.companyId}}</td>
                    <td>{{v.basicAmount}}</td>
                  </tr>
                  <tr>
                    <td>有效期</td>
                    <td class="white-bg" colspan="3">{{v.securityYear}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Group, XTable } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { scrollToElement } from "@/config/utils.js";
export default {
  components: {
    Group,
    dtHeader,
    XTable
  },
  data() {
    return {
      initListData: [],
      manys: ""
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  activated() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    async initData() {
      if (this.$route.query.from == "reportDetailHistory") {
        let res = await api.securityDetailHistory({
          reportId: this.$route.query.reportId,
          customerId: this.$route.query.customerId,
          type: this.$route.query.type
        });
        this.initListData = res.data.securityDetailsList;
        this.manys = res.data.manys;
      } else {
        let res = await api.getSecurityDetail({
          familyId: this.$route.query.familyId,
          customerId: this.$route.query.customerId,
          type: this.$route.query.type
        });
        this.initListData = res.data.securityDetailsList;
        this.manys = res.data.manys;
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
.safeguard-details-page {
  .dt-content {
    // padding: 0 2%;
    // padding-bottom: 100px;
    background-color: #fff;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .wrapper {
    padding: 25px;
    .box {
      h3 {
        font-weight: normal;
      }
      .title {
        font-size: 30px;
        line-height: 35px;
        letter-spacing: 0px;
        color: #666;
        .title-icon {
          display: inline-block;
          vertical-align: -4px;
          width: 8px;
          height: 28px;
          background-color: #28c76a;
          margin-right: 16px;
        }
      }
      .box-item {
        width: 700px;
        // height: 364px;
        background-color: #f7f7f7;
        border-radius: 8px;
        margin: 20px 0;
        position: relative;
        padding: 25px;
        color: #222;
        .item-title {
          font-size: 32px;
          letter-spacing: 0px;
          color: #222222;
          padding-bottom: 14px;
          position: relative;
          .insuranceName {
            .circle {
              display: inline-block;
              vertical-align: 4px;
              width: 36px;
              height: 36px;
              line-height: 36px;
              font-size: 26px;
              border: 2px solid #222;
              border-radius: 50%;
              text-align: center;
            }
          }
          p {
            font-size: 24px;
            color: #666;
            .insured {
              // position: absolute;
              // top: 0;
              // right: 0;
            }
            .year-baofei {
              float: right;
            }
          }
        }

        .table {
          box-sizing: border-box;
          width: 650px;
          height: 240px;
          background-color: #f2fcf6;
          border-collapse: collapse;
          border: 2px solid #bdbcbc;
          font-size: 28px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #222222;
          tr {
            height: 80px;
            line-height: 80px;
            text-align: center;
            th {
              border: 2px solid #dedede;
              font-weight: normal;
              height: 80px;
              line-height: 80px;
            }
            td {
              border: 2px solid #dedede;
              height: 80px;
              line-height: 80px;
            }
          }

          .white-bg {
            background-color: #fff;
            .policyNo {
              width: 160px;
              display: block;
              word-break: break-all;
              line-height: 30px;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
}
</style>
