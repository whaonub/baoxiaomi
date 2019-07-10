<template>
  <div class="dt-pages policy-insurance-page">
    <div class="dt-header">
      <dtHeader title="录入简版保单" :leftBack="false" rightIcon="sigh" @headerRight="goHelp" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <div class="insurance-li">
        <div class="insurance-title">险种信息</div>
        <div class="insurance-content">
          <flexbox orient="vertical">
            <flexbox-item v-for="(item,index) in insurances" :key="index">
              <div class="flex-demo insurance-item">
                <span class="name" v-html="item.productName"></span>
                <span class="remove-insurance" @click="removeInsurance(item,index)">
                  <icon class="dt-icon icon-remove" name="remove"></icon>
                </span>
              </div>
            </flexbox-item>
            <flexbox-item v-if="insurances.length == 0">
              <group class="insurance-select">
                <cell title="请选择险种" link="/searchInsurance"></cell>
              </group>
            </flexbox-item>
            <flexbox-item v-if="insurances.length<15">
              <div class="add-insurance" @click="addInsurance">
                <icon class="dt-icon icon-add2" name="add3"></icon>添加险种
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
    <div class="dt-footer">
      <flexbox :gutter="0">
        <flexbox-item align="center">
          <div class="dt-btn-box fz30">
            <div class="dt-btn-up" @click="goBack">上一步</div>
          </div>
        </flexbox-item>
        <flexbox-item align="center">
          <div class="dt-btn-box fz30">
            <div class="dt-btn-down" @click="nextstep">下一步</div>
            <div class="dt-pos-btn" :style="{display:$store.state.maskView}">下一步</div>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>
<script>
import { XInput, Cell, Group, XButton, Flexbox, FlexboxItem } from "vux";
import api from "@/api/index";
import { uuid } from "@/config/utils.js";
import dtHeader from "@/components/dtHeader";
export default {
  name: "policyInsurance",
  components: {
    XInput,
    Group,
    XButton,
    Flexbox,
    Cell,
    FlexboxItem,
    dtHeader
  },
  data() {
    return {
      insurances: [],
      policyId: "",
      deleteProductIds: [],
      entryMode: 0 //1，0 不是 判断是否从编辑保单进来
    };
  },
  created() {
    let policyId = this.$route.query.policyId || this.$store.state.policyId;
    let companyId = this.$route.query.companyId;
    let entryMode = this.$route.query.entryMode || this.$store.state.entryMode;
    if (entryMode) {
      this.entryMode = entryMode;
      this.$store.state.entryMode = entryMode;
    }
    if (companyId) {
      this.$store.state.companyId = companyId;
    }
    if (policyId) {
      this.policyId = policyId;
      this.$store.state.policyId = policyId;
    }
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  activated() {
    let insurancesList = this.$store.state.insurance;
    if (insurancesList.length > 0) {
      this.insurances = insurancesList;
    }
  },
  methods: {
    async initData() {
      let policyId = this.policyId;
      let entryMode = this.entryMode;
      let insurancesList = this.$store.state.insurance;
      if (policyId && entryMode == 0) {
        let result = await api.findInputInsurance({
          id: policyId
        });
        if (result.status == 1) {
          if (result.data) {
            let insurances = result.data;
            this.insurances = insurances;
            this.$store.state.insurance = insurances;
          } else {
            this.insurances = insurancesList;
          }
        } else {
          this.$alert(result.msg);
          return false;
        }
      } else {
        this.insurances = insurancesList;
      }
    },
    goBack() {
      let entryMode = this.entryMode;
      this.$router.go(-1);
      //清缓存
      this.$store.commit("clearCacheByName", "policyMake");
      setTimeout(() => {
        this.$store.commit("setCacheByName", "policyMake");
      }, 200);
      this.$store.state.insurance = [];
    },
    async nextstep() {
      let policyId = this.policyId;
      let insurances = this.insurances;
      let newInsurances = [];
      let productNoIds = [];
      let entryMode = this.entryMode; //编辑订单详情添加险种信息
      for (let i = 0; i < insurances.length; i++) {
        let newName = insurances[i].productName.replace(/<[^>]+>/g, "");
        let obj = {
          productName: newName,
          productNo: insurances[i].productNo
        };
        if (insurances[i].productId) {
          obj.productId = insurances[i].productId;
        }
        if (entryMode == 1) {
          obj.productId = uuid(32, 36);
        }
        productNoIds.push(insurances[i].productNo);
        newInsurances.push(obj);
      }
      if (newInsurances.length == 0) {
        this.$alert("请添加险种");
        return false;
      }
      if (entryMode == 1) {
        this.$store.state.productNoIds = productNoIds;
        let result = await api.checkDutyExist({
          ids: productNoIds
        });
        if (result.status == 1) {
          let exist = result.data.exist;
          if (exist == "1") {
            this.$router.push({
              path: "/policyDuty",
              query: {
                entryMode: 1
              }
            });
          } else {
            let policyDetailsProducts = {
              policyId: this.policyId,
              productVos: newInsurances
            };
            this.$store.state.policyDetailsProducts = policyDetailsProducts;
            //清缓存
            this.$store.commit("clearCacheByName", "policyInsuranceInfo");
            setTimeout(() => {
              this.$store.commit("setCacheByName", "policyInsuranceInfo");
            }, 200);
            this.$router.push({
              path: "/policyInsuranceInfo",
              query: {
                entryMode: 1
              }
            });
          }
        } else {
          this.$alert(result.msg);
          return false;
        }
      } else {
        let result = await api.addInsuranceToPolicy({
          policyId: policyId,
          products: newInsurances,
          deleteProductIds: this.deleteProductIds
        });
        if (result.status == 1) {
          let exist = result.data.exist;
          this.$store.state.insurance = [];
          if (exist == "1") {
            this.$router.push({
              path: "/policyDuty"
            });
          } else {
            //清缓存
            this.$store.commit("clearCacheByName", "policyInsuranceInfo");
            setTimeout(() => {
              this.$store.commit("setCacheByName", "policyInsuranceInfo");
            }, 200);
            this.$router.push({
              path: "/policyInsuranceInfo"
            });
          }
        } else {
          this.$alert(result.msg);
          return false;
        }
      }
    },
    removeInsurance(item, index) {
      let insurances = this.insurances;
      let deleteProductIds = this.deleteProductIds;
      for (let i = 0; i < insurances.length; i++) {
        if (i == index) {
          insurances.splice(i, 1);
          if (item.productId) {
            deleteProductIds.push(item.productId);
          }
        }
      }
      this.$store.state.insurance = insurances;
    },
    addInsurance() {
      this.$router.push({
        path: "/searchInsurance"
      });
    },
    goHelp() {
      this.$router.push({
        path: "/course",
        query: {
          type: "2",
          from: "policyMake"
        }
      });
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

.policy-insurance-page {
  background: #f8f8f8;
  .dt-content {
    padding: 10px 20px 100px;
    -webkit-overflow-scrolling: touch;
  }
  .insurance-title {
    line-height: 60px;
    background: #ebfdf2;
    border-radius: 10px 10px 0 0;
    padding: 10px 10px 10px 32px;
    color: #000;
    font-size: 34px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .insurance-content {
    height: calc(100vh - 28rem);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .insurance-li {
    border: 2px #dedede solid;
    border-radius: 10px;
    background: #fff;
    margin-top: 10px;
  }
  .insurance-item {
    font-size: 30px;
    line-height: 60px;
    padding: 5px 0 5px 0;
    margin: 0 30px;
    font-weight: 600;
    color: #222222;
    border-bottom: 1px #dedede solid;
    position: relative;
    .remove-insurance {
      position: absolute;
      top: 3px;
      right: 30px;
    }
    .icon-remove {
      color: #fff;
      background: #28c76a;
      border-radius: 50%;
      padding: 5px;
      height: 33px;
      width: 33px;
    }
    em {
      font-style: normal;
    }
    .name {
      display: inline-block;
      width: 550px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .insurance-select {
    margin: 0 30px;
    .weui-cells {
      margin-top: 0;
      color: #959494;
    }
    .weui-cells:before {
      border: none;
    }
    .vux-label {
      font-size: 0.04267rem;
    }
    .weui-cell {
      padding: 10px 5px 10px 10px;
    }
  }
  .add-insurance {
    padding-top: 25px;
    font-size: 30px;
    padding-bottom: 25px;
    text-align: center;
    color: #222222;
    .icon-add2 {
      margin-right: 15px;
      width: 33px;
      height: 33px;
      padding: 5px;
      border-radius: 50%;
      color: #fff;
      background: #28c76a;
      position: relative;
      top: -3px;
    }
  }
}
</style>
