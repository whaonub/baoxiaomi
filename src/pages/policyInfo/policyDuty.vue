<template>
  <div class="dt-pages policy-duty-page">
    <div class="dt-header">
      <dtHeader title="录入简版保单" :leftBack="false"  @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
        <div class="insurance-content">
          <div class="insurance-title">可选责任</div>
          <flexbox class="duty-item" orient="vertical" v-for="(pitem,pindex) in duties" :key="pindex">
            <div class="duty-title">{{pitem.productName}}</div>
            <flexbox-item v-for="(item,index) in pitem.liabilityVoList" :key="index">
                <div class="flex-demo insurance-item">
                  <span class="disc"></span>
                  <span class="title">{{item.liabLabel}}</span>
                  <span class="remove-insurance" @click="selectDuty(item)">
                    <icon class="dt-icon" :class="item.isSelect == 1 ? 'icon-current' :'icon-select'" name="select1"></icon>
                  </span>
                </div>
            </flexbox-item>
          </flexbox>
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
import { XInput, Group, XButton, Flexbox, FlexboxItem } from "vux";
import api from "@/api/index";
import { uuid } from "@/config/utils.js";
import dtHeader from "@/components/dtHeader";
export default {
  name: "policyDuty",
  components: {
    XInput,
    Group,
    XButton,
    Flexbox,
    FlexboxItem,
    dtHeader
  },
  data() {
    return {
      policyId: "",
      duties: [],
      entryMode: 0
    };
  },
  created() {
    this.policyId = this.$route.query.policyId || this.$store.state.policyId;
    let entryMode = this.$store.state.entryMode || this.$route.query.entryMode;
    if (entryMode) {
      this.entryMode = entryMode;
    }
    this.initData();
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  methods: {
    async initData() {
      let policyId = this.policyId;
      let entryMode = this.entryMode;
      if (policyId && entryMode == 0) {
        let result = await api.findPolicyLiability({
          id: policyId
        });
        if (result.status == 1) {
          this.$store.state.policyId = policyId;
          if (result.data) {
            this.duties = result.data;
          }
        } else {
          this.$alert(result.msg);
          return false;
        }
      }
      if (entryMode == 1) {
        let productNoIds = this.$store.state.productNoIds;
        let result = await api.findLiabilityByNo({
          ids: productNoIds
        });
        if (result.status == 1) {
          if (result.data) {
            this.duties = result.data;
          }
        } else {
          this.$alert(result.msg);
          return false;
        }
      }
    },
    goBack() {
      this.$router.go(-1);
      //清缓存
      this.$store.commit("clearCacheByName", "policyInsurance");
      setTimeout(() => {
        this.$store.commit("setCacheByName", "policyInsurance");
      }, 200);
    },
    async nextstep() {
      let dutyInfo = this.duties;
      let products = [];
      for (let i = 0; i < dutyInfo.length; i++) {
        let productId = dutyInfo[i].productId;
        let obj = {
          productName: dutyInfo[i].productName,
          liabilityIds: [],
          productNo: dutyInfo[i].productNo
        };
        if (productId) {
          obj.productId = productId;
        } else {
          obj.productId = uuid(32, 36);
        }
        for (let j = 0; j < dutyInfo[i].liabilityVoList.length; j++) {
          if (dutyInfo[i].liabilityVoList[j].isSelect == 1) {
            obj.liabilityIds.push(dutyInfo[i].liabilityVoList[j].liabilityId);
          }
        }
        products.push(obj);
      }
      let entryMode = this.entryMode;
      if (entryMode == 1) {
        let policyDetailsProducts = {
          policyId: this.policyId,
          productVos: products
        };
        this.$store.state.policyDetailsProducts = policyDetailsProducts;
        //清缓存
        this.$store.commit("clearCacheByName", "policyInsuranceInfo");
        setTimeout(() => {
          this.$store.commit("setCacheByName", "policyInsuranceInfo");
        }, 200);
        this.$router.push({
          path: "/policyInsuranceInfo"
        });
      } else {
        let result = await api.addPolicyLiability({
          products: products
        });
        if (result.status == 1) {
          //清缓存
          this.$store.commit("clearCacheByName", "policyInsuranceInfo");
          setTimeout(() => {
            this.$store.commit("setCacheByName", "policyInsuranceInfo");
          }, 200);
          this.$router.push({
            path: "/policyInsuranceInfo"
          });
        } else {
          this.$alert(result.msg);
        }
      }
    },
    selectDuty(item) {
      if (item.isSelect) {
        item.isSelect = 0;
      } else {
        item.isSelect = 1;
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

.policy-duty-page {
  .dt-content {
    padding: 0 20px;
    padding-bottom: 100px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .insurance-content {
    border: 2px #dedede solid;
    border-radius: 10px;
    margin-top: 20px;
    background: #fff;
    .duty-item {
      margin: 30px 20px 0 20px;
      border-bottom: 1px #dedede solid;
      width: auto;
      padding-bottom: 25px;
    }
    .duty-item:last-child {
      border: none;
    }
    .duty-title {
      font-size: 36px;
      padding-left: 20px;
      display: block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin-top: 10px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-left: 13px #28c76a solid;
    }
  }
  .insurance-title {
    line-height: 60px;
    background: #ebfdf2;
    padding: 10px 30px;
    font-size: 34px;
    font-weight: 600;
    border-radius: 10px 10px 0 0;
  }
  .insurance-item {
    font-size: 34px;
    line-height: 60px;
    padding: 10px 0;
    color: #666;
    position: relative;
    padding-left: 35px;
    .disc {
      display: inline-block;
      background: url("../../assets/imgs/dutyliicon.png") no-repeat;
      background-size: cover;
      height: 12px;
      width: 12px;
      position: absolute;
      left: 0;
      top: 35px;
    }
    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      width: 0.73333rem;
    }
    .remove-insurance {
      position: absolute;
      top: 5px;
      right: 30px;
    }
    .icon-remove {
      color: #000;
    }
    .icon-select {
      color: #999;
    }
    .icon-current {
      color: #28c76a;
    }
  }
}
</style>
