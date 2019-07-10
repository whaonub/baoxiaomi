<template>
  <div class="dt-pages policy-insuranceinfo-page">
    <div class="dt-header">
      <dtHeader title="录入简版保单" :leftBack="false" rightIcon="sigh" @headerRight="goHelp" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="insurance-item" v-for="(pitem,pindex) in insurances" :key="pindex">
          <div class="insurance-title">{{pitem.productName}}</div>
          <div class="insurance-item-content">
            <group v-if="!item.display" :class="item.boolFlag ?'warn-title': ''"  v-for="(item,index) in pitem.productParamList" :key="index">
                <div v-if="item.paramList.length==1" v-for="(citem,cindex) in item.paramList" :key="cindex">
                  <div v-if="citem.element == 'input'" class="itemIpt" :ref="`${pindex}-${index}`">
                    <x-input  :ref="`${pindex}-${index}-${cindex}`" :type="citem.type == 'number' || citem.type == 'int' ?'number':'text' " :placeholder="citem.placeholder?citem.placeholder:'请输入'" :title="item.rowsName" v-model="citem.value"   @on-blur="validateInput(pindex,item,citem,...arguments)"></x-input>
                    <span class="unit" v-if="citem.unit">{{citem.unit}}</span>
                  </div>
                  <div v-if="citem.element == 'select'" :ref="`${pindex}-${index}`">
                    <selector :ref="`${pindex}-${index}-${cindex}`" :placeholder="citem.placeholder?citem.placeholder:'请选择'"  v-model="citem.value"  :title="item.rowsName"  :value-map="['key', 'value']" :options="citem.selectDataList" @on-change="validateInput(pindex,item,citem,...arguments)"></selector>
                  </div>
                  <div v-if="citem.element == 'textarea'" :ref="`${pindex}-${index}`">
                    <x-textarea :ref="`${pindex}-${index}-${cindex}`" v-model="citem.value" :value="citem.value"  :placeholder="citem.placeholder" :title="item.rowsName" :rows="4" :show-counter='false' @on-change="validateInput(pindex,item,citem,...arguments)" autosize></x-textarea>
                  </div>
                </div>
                <div class="specialfield" v-if="item.paramList.length>1">
                  <div class="field-name">{{item.rowsName}}</div>
                  <div class="field-content">
                      <div class="field-item" v-for="(citem,cindex) in item.paramList" :key="cindex">
                        <div v-if="citem.element == 'input'" :ref="`${pindex}-${index}`" :title="citem.bbb">
                          <x-input :type="citem.type == 'number' || citem.type == 'int' ?'number':'text' " :ref="`${pindex}-${index}-${cindex}`" :disabled="citem.required == 'norequired' || citem.iptStatus == 'norequired' ? true : false" :placeholder="citem.placeholder?citem.placeholder:'请输入'" v-model="citem.value"  @on-blur="validateInput(pindex,item,citem,...arguments)"></x-input>
                          <span class="unit" v-if="citem.unit">{{citem.unit}}</span>
                        </div>
                        <div v-if="citem.element == 'select'" :ref="`${pindex}-${index}`">
                          <selector :ref="`${pindex}-${index}-${cindex}`" :placeholder="citem.placeholder?citem.placeholder:'请选择'" :readonly="citem.iptStatus == 'norequired' ? true : false" v-model="citem.value" :value-map="['key', 'value']" :options="citem.selectDataList" @on-change="validateInput(pindex,item,citem,...arguments)"></selector>
                        </div>
                      </div>
                  </div>
                </div>
            </group>
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
            <div class="dt-btn-down" @click="complete">完成</div>
            <div class="dt-pos-btn" :style="{display:$store.state.maskView}">完成</div>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
    <div v-if="totalStatus" class="policy-dialog" @scroll.prevent  @touchmove.prevent></div>
    <div class="policyPopup" v-if="totalStatus">
        <p class="color1" @click="goPolicyDetails">查看保单</p>
        <p class="color2" @click="goBackHome">返回托管列表</p>
    </div>
    <familysPopup :showDialog="showDialog" :initData="familyListVoList" @closePopup="closePopup" @enter="selectfamily"></familysPopup>
  </div>
</template>
<script>
import {
  XInput,
  Group,
  XButton,
  Flexbox,
  FlexboxItem,
  XTextarea,
  Checker,
  CheckerItem,
  Datetime,
  Selector
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { scrollToElement, getDevice } from "@/config/utils.js";
import familysPopup from "@/components/familysPopup";
import calendar from "@/components/calendar";
export default {
  name: "policyInsuranceInfo",
  components: {
    XInput,
    Group,
    XButton,
    Flexbox,
    FlexboxItem,
    dtHeader,
    Selector,
    Checker,
    Datetime,
    CheckerItem,
    XTextarea,
    familysPopup,
    calendar
  },
  data() {
    return {
      device: getDevice(),
      policyId: "",
      familyId: "",
      uuid: "",
      code: "",
      familyListVoList: [],
      showDialog: false,
      familys: [],
      insured: [],
      insurances: [],
      customerSaveVoList: [],
      customerId: null,
      customerName: null,
      entryMode: 0,
      insuranceIndex: "",
      totalStatus: false,
      oldFamilyId: ""
    };
  },
  created() {
    this.policyId = this.$route.query.policyId || this.$store.state.policyId;
    this.oldFamilyId = this.$store.state.oldFamilyId;
    let entryMode = this.$store.state.entryMode || this.$route.query.entryMode;
    if (entryMode) {
      this.entryMode = entryMode;
    }
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  activated() {
    this.customerId = this.$route.query.customerId;
    let insuredCustomer = this.$store.state.insuredCustomer;
    let productDetails = this.insurances;
    let customerName = this.customerName;
    let customerId = this.customerId;
    let insuranceIndex = this.insuranceIndex;
    if (insuredCustomer) {
      this.customerSaveVoList.push(insuredCustomer);
    }
    for (let i = 0; i < productDetails.length; i++) {
      for (let j = 0; j < productDetails[i].productParamList.length; j++) {
        let paramList = productDetails[i].productParamList[j].paramList[0];
        if (productDetails[i].productParamList[j].type == 0) {
          if (insuredCustomer) {
            paramList.selectDataList.unshift({
              key: customerId,
              value: insuredCustomer.customerAlias
            });
          }
          let selectDataListSize = paramList.selectDataList.length;
          if (selectDataListSize == 7) {
            for (let k = 0; k < paramList.selectDataList.length; k++) {
              if (paramList.selectDataList[k].key == "add") {
                paramList.selectDataList.splice(k, 1);
              }
            }
          }
        }
        if (paramList.name == customerName) {
          if (insuranceIndex == i) {
            if (
              customerId &&
              customerName &&
              insuredCustomer &&
              insuredCustomer.customerAlias
            ) {
              paramList.value = customerId;
            } else if (insuredCustomer == null) {
              paramList.value = "";
            }
          }
        }
      }
      let obj = productDetails[i];
      this.$set(this.insurances, i, obj);
    }
    this.customerId = null;
    this.customerName = null;
    this.insuranceIndex = null;
    this.$store.state.insuredCustomer = null;
  },
  methods: {
    async initData() {
      let policyDetailsProducts = this.$store.state.policyDetailsProducts;
      let entryMode = this.entryMode;
      let policyId = this.policyId;
      let result;
      if (entryMode == 1) {
        result = await api.findInsuranceByAddition(policyDetailsProducts);
      } else {
        result = await api.findInputInsuranceDetail({
          id: policyId
        });
      }
      if (result.status == 1) {
        if (result.data && JSON.stringify(result.data) != "{}") {
          this.$store.state.policyId = policyId;
          let productDetails = [];
          if (entryMode == 1) {
            productDetails = result.data;
          } else {
            productDetails = result.data.productDetails;
          }
          this.customerSaveVoList = result.data.customers;
          for (let i = 0; i < productDetails.length; i++) {
            let insured = [];
            for (
              let j = 0;
              j < productDetails[i].insuredParamList.length;
              j++
            ) {
              let insuredParamList = productDetails[i].insuredParamList[j];
              let selectDataListSize =
                insuredParamList.param.selectDataList.length;
              if (selectDataListSize < 6 && entryMode != 1) {
                insuredParamList.param.selectDataList.push({
                  value: "新增被保人",
                  key: "add"
                });
              }
              var obj = {
                rowsName: insuredParamList.rowsName,
                type: 0,
                paramList: [insuredParamList.param]
              };

              if (insuredParamList.rowsName == "投保人") {
                obj.display = true;
              }
              insuredParamList.param.required = "required";
              insured.push(obj);
            }
            let newArray = insured.concat(productDetails[i].productParamList);
            productDetails[i].productParamList = newArray;
            for (
              let k = 0;
              k < productDetails[i].productParamList.length;
              k++
            ) {
              let productParamList = productDetails[i].productParamList[k];
              let paramListSize = productParamList.paramList.length;
              if (paramListSize == 1 && productParamList.paramList[0].value) {
                productParamList.value = productParamList.paramList[0].value;
              }
              for (let c = 0; c < productParamList.paramList.length; c++) {
                if (!productParamList.paramList[c].value) {
                  productParamList.paramList[c].value = "";
                }
              }
            }
            productDetails[i].productParamList.push({
              rowsName: "备注",
              paramList: [
                {
                  name: "remark",
                  element: "textarea",
                  max: 200,
                  value: "",
                  placeholder: "可填写备注如身故和重疾共用保额等等"
                }
              ]
            });
          }
          this.insurances = productDetails;
        }
      } else {
        this.$alert(result.msg);
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
    goHelp() {
      this.$router.push({
        path: "/course",
        query: {
          type: "2",
          from: "policyMake"
        }
      });
    },
    selectfamily(obj) {
      if (obj.familyId) {
        this.familyId = obj.familyId;
      } else {
        this.familyId = "";
      }
      this.showDialog = false;
      this.addPolicyInsured(1);
    },
    closePopup() {
      this.showDialog = false;
    },
    //字段校验
    validateInput(pindex, item, citem, data) {
      let insurances = this.insurances;
      let rowsName = item.rowsName;
      let insuranceObj = insurances[pindex];
      if (
        citem.element == "select" &&
        ((data == false && data != "0") || data == undefined)
      ) {
        return false;
      }
      if (data != "") {
        //判断特殊选项，如果选择终身，那么就不用输入值
        if (
          citem.name == "payYearsFlag" ||
          citem.name == "coverYearsFlag" ||
          citem.name == "annPeriodFlag"
        ) {
          let paramlist = item.paramList;
          let requiredText = "required";
          if (data == "3" || data == "6") {
            requiredText = "norequired";
          }
          for (let i = 0; i < paramlist.length; i++) {
            if (paramlist[i].element == "input") {
              if (requiredText == "norequired") {
                paramlist[i].value = "";
                paramlist[i].placeholder = " ";
              }
              paramlist[i].required = requiredText;
            }
          }
        }
        //判断交费方式为 趸交
        if (citem.name == "chargePeriodType") {
          let paramValue = "";
          let paramRequiredText = "required";
          if (data == "0") {
            paramValue = "1";
            paramRequiredText = "norequired";
          }
          let productParamList = insuranceObj.productParamList;
          for (let i = 0; i < productParamList.length; i++) {
            let paramList = productParamList[i].paramList;
            for (let j = 0; j < paramList.length; j++) {
              let paramObj = paramList[j];
              if (paramObj.name == "payYearsFlag") {
                if (data == "0") {
                  paramObj.value = paramValue;
                  paramObj.iptStatus = "norequired";
                } else {
                  paramObj.iptStatus = "required";
                }
              } else if (
                paramObj.name == "payYears" &&
                paramObj.element == "input"
              ) {
                if (data == "0") {
                  paramObj.value = paramValue;
                  paramObj.iptStatus = "norequired";
                } else {
                  paramObj.iptStatus = "required";
                }
              }
            }
          }
        }
        //判断是否新增被保人
        if (item.rowsName == "被保险人") {
          if (data == "add") {
            this.insuranceIndex = pindex;
            this.customerName = citem.name;
            this.$router.push({
              path: "/policyInsured"
            });
          }
        }
        let inputStatus = false;
        if (citem.element == "input") {
          if (citem.type == "int") {
            let reg = /^[0-9]*$/;
            if (!reg.test(data)) {
              inputStatus = true;
              this.$toast("填写格式不对！");
            }
          } else if (citem.type == "number") {
            let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
            if (!reg.test(data)) {
              if (data == "0") {
                if (citem.name == "insNum") {
                  inputStatus = true;
                  this.$toast("填写格式不对！");
                }
              } else {
                inputStatus = true;
                this.$toast("填写格式不对！");
              }
            } else {
              citem.value = parseFloat(data).toFixed(2);
            }
          }
          if (parseInt(data) > citem.max || parseInt(data) < citem.min) {
            inputStatus = true;
            this.$toast(
              rowsName + "必须大于" + citem.min + "且小于等于" + citem.max
            );
          }
        } else {
          if (item.value) {
            item.boolFlag = false;
          }
        }
        if (inputStatus) {
          item.boolFlag = true;
        } else {
          item.boolFlag = false;
        }
      } else {
        if (citem.required) {
          item.boolFlag = true;
          this.$toast("请输入正确的" + rowsName);
        } else {
          item.boolFlag = false;
          citem.value = data;
        }
      }
      this.$nextTick(() => {
        this.$set(this.insurances, pindex, insuranceObj);
      });
    },
    async complete() {
      let insurances = this.insurances;
      let status = true;
      for (let i = 0; i < insurances.length; i++) {
        if (status) {
          for (let j = 0; j < insurances[i].productParamList.length; j++) {
            if (status) {
              let productParamList = insurances[i].productParamList[j];
              for (let k = 0; k < productParamList.paramList.length; k++) {
                let citem = productParamList.paramList[k];
                let citemValue = citem.value;
                let citemRequired = citem.required;
                let citemElement = citem.element;
                let citemBoolFlag = productParamList.boolFlag;
                let rowsName = productParamList.rowsName;
                let citemError = false;
                if (citemValue == "") {
                  if (citemRequired == "required" || citemBoolFlag) {
                    productParamList.boolFlag = true;
                    citemError = true;
                    this.$toast("请输入正确的" + rowsName);
                  }
                } else {
                  if (citemElement == "input") {
                    if (
                      parseInt(citemValue) > citem.max ||
                      parseInt(citemValue) < citem.min
                    ) {
                      productParamList.boolFlag = true;
                      citemError = true;
                      this.$toast(
                        rowsName + "必须大于" + citem.min + "且小于" + citem.max
                      );
                    }
                  }
                  let obj = insurances[i];
                  this.$set(this.insurances, i, obj);
                  if (citemBoolFlag) {
                    citemError = true;
                    this.$toast("请输入正确的" + rowsName);
                  }
                }
                let obj = insurances[i];
                this.$set(this.insurances, i, obj);
                if (citemError) {
                  status = false;
                  var vueElement = this.$refs[`${i}-${j}`][0];
                  scrollToElement.call(this, vueElement, 200);
                  var inputElement = this.$refs[`${i}-${j}-${k}`][0];
                  if (inputElement && inputElement.focus) {
                    setTimeout(function() {
                      inputElement.focus();
                    }, 100);
                  }
                  return false;
                }
              }
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }
      if (!status) {
        return false;
      }
      let entryMode = this.entryMode;
      if (entryMode == 1) {
        this.addPolicyInsured(0);
      } else {
        //先处理客户信息
        let customerSaveVoList = this.customerSaveVoList;
        for (let i = 0; i < customerSaveVoList.length; i++) {
          if (i == 0) {
            customerSaveVoList[i].isMain = 1;
          } else {
            customerSaveVoList[i].isMain = 0;
          }
        }
        let customerResult = await api.familyFindByInfo({
          inputType: 3,
          policyId: this.policyId,
          familyId: this.oldFamilyId,
          customerSaveVoList: customerSaveVoList
        });
        if (customerResult.status == 1) {
          this.uuid = customerResult.data.uuid;
          this.familyListVoList = customerResult.data.familyListVoList;
          if (this.familyListVoList) {
            //有重复客户
            this.showDialog = true;
          } else {
            //无重复客户
            this.familyId = customerResult.data.familyId;
            this.code = customerResult.data.code;
            this.addPolicyInsured(0);
          }
        } else {
          this.$alert(customerResult.msg);
          return false;
        }
      }
    },
    async addPolicyInsured(type) {
      let products = [];
      let insurances = this.insurances;
      let entryMode = this.entryMode;
      let policyDetailsProducts = this.$store.state.policyDetailsProducts;
      let liabilities = [];
      if (policyDetailsProducts) {
        liabilities = policyDetailsProducts.productVos;
      }
      for (let i = 0; i < insurances.length; i++) {
        let insuranceObj = {
          productId: insurances[i].productId,
          productName: insurances[i].productName,
          productNo: insurances[i].productNo
        };
        if (entryMode == 1) {
          for (let l = 0; l < liabilities.length; l++) {
            if (liabilities[l].productId == insurances[i].productId) {
              insuranceObj.liabilityIds = liabilities[l].liabilityIds;
            }
          }
        }
        let insuredObj = {};
        let productParam = {};
        for (let j = 0; j < insurances[i].productParamList.length; j++) {
          let productParamList = insurances[i].productParamList[j];
          if (productParamList.type == 0) {
            let insuredRowsName = productParamList.rowsName;
            let insuredValue = productParamList.paramList[0].value;
            if (j == 0) {
              insuredObj.insured1Id = insuredValue;
              insuredObj.insured1RowsName = insuredRowsName;
            } else if (j == 1) {
              insuredObj.insured2Id = insuredValue;
              insuredObj.insured2RowsName = insuredRowsName;
            } else if (j == 2) {
              insuredObj.insured3Id = insuredValue;
              insuredObj.insured3RowsName = insuredRowsName;
            }
          } else {
            for (let k = 0; k < productParamList.paramList.length; k++) {
              let paramObj = productParamList.paramList[k];
              productParam[paramObj.name] = paramObj.value;
              if (paramObj.name == "remark") {
                insuranceObj.remark = paramObj.value;
              }
            }
          }
        }
        insuranceObj.insuredParam = insuredObj; //被保险人
        insuranceObj.productParam = productParam; //险种参数
        products.push(insuranceObj);
      }
      let result;
      if (entryMode == 1) {
        result = await api.addPolicyInsurance({
          policyId: this.policyId,
          products: products
        });
      } else {
        result = await api.addPolicyInsuredParam({
          policyId: this.policyId,
          familyId: this.familyId,
          uuid: this.uuid,
          products: products,
          type: type,
          code: this.code
        });
      }
      if (result.status == 1) {
        this.$store.state.policyId = null;
        this.$store.state.insurance = [];
        this.$store.state.company = null;
        this.$store.state.companyId = null;
        //清缓存
        this.$store.commit("clearCacheByName", "policyDetails");
        setTimeout(() => {
          this.$store.commit("setCacheByName", "policyDetails");
        }, 200);
        this.totalStatus = true;
      } else {
        this.$alert(result.msg);
      }
    },
    goPolicyDetails() {
      this.$store.state.policyMakeFrom = null;
      this.$router.push({
        path: "/policyDetails",
        query: {
          detailPolicyId: this.policyId,
          from: "policyMake"
        }
      });
      this.totalStatus = false;
    },
    goBackHome() {
      this.$router.push({
        path: "/trusteeshipList"
      });
      this.totalStatus = false;
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

.policy-insuranceinfo-page {
  background: #f8f8f8;
  color: #222;
  .dt-content {
    padding: 0 20px;
    padding-bottom: 120px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .insurance-title {
    line-height: 60px;
    background: #ebfdf2;
    padding: 10px 30px;
    font-size: 34px;
    font-weight: 600;
    border-radius: 10px 10px 0 0;
    position: relative;
    .icon-remove {
      position: absolute;
      right: 30px;
      top: 23px;
      color: #fff;
      background: #28c76a;
      border-radius: 50%;
      padding: 5px;
      width: 30px;
      height: 30px;
    }
    .select-user {
      color: #28c76a;
      text-align: center;
      display: block;
      position: absolute;
      right: 100px;
      top: 20px;
    }
  }
  .insurance-item {
    border: 2px #dedede solid;
    border-radius: 10px;
    margin-top: 20px;
    background: #ffffff;
    .insurance-item-content {
      padding: 0 20px;
      .weui-cells {
        border-bottom: 1px #dedede solid;
      }
      .weui-cells:before {
        border: none;
      }
      .weui-cells:after {
        border: none;
      }
      :last-child .weui-cells {
        border: none;
      }
      .weui-textarea {
        border: 1px #dedede solid;
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 10px;
      }
      .vux-x-textarea {
        padding-top: 15px;
      }
      .itemIpt {
        position: relative;
        overflow: hidden;
        font-size: 28px;
        .weui-cell {
          float: left;
          width: 90%;
        }
        .unit {
          position: absolute;
          top: 50%;
          margin-top: -16px;
          right: 25px;
        }
      }
      .specialfield {
        overflow: hidden;
        padding: 0 10px;
        align-items: center;
        display: flex;
        .field-name {
          float: left;
          width: 0.29467rem;
          margin-right: 0.055rem;
          font-size: 0.0445rem;
        }
        .field-content {
          float: left;
          width: 436px;
        }
        .field-item {
          float: left;
          width: 50%;
          .weui-cell__hd {
            display: none;
          }
          .weui-select {
            padding-left: 0;
          }
          .vux-x-input {
            padding: 10px 5px;
          }
          .vux-selector {
            padding: 0 5px;
          }
        }
        .itemIpt {
          float: left;
        }
        .vux-selector-readonly {
          text-align: left;
          padding: 12px 0;
          color: #000;
          font-size: 0.0445rem;
        }
        .vux-x-input.disabled .weui-input {
          color: #000;
          -webkit-text-fill-color: #000;
        }
      }
    }
  }
  .checker-item {
    height: 60px;
    line-height: 60px;
    width: 80px;
    text-align: center;
    border-radius: 5px;
    margin-left: 40px;
    border: 2px #000 solid;
  }
  .checker-item-selected {
    border: 2px #00f solid;
    color: #00f;
  }
  .weui-cells {
    margin-top: 0;
  }
  .warn-title {
    .weui-label,
    .field-name {
      color: #f00;
    }
  }
  .weui-cell__hd {
    width: 0.29467rem !important;
    margin-right: 0.03rem;
  }
  .weui-label {
    width: 0.29467rem !important;
    font-size: 0.0445rem;
  }
  .weui-cell__bd {
    font-size: 0.0445rem;
  }
  .weui-cell {
    padding: 10px 5px;
  }
  .vux-selector {
    padding: 0 5px;
  }
  .vux-selector.weui-cell_select-after {
    padding-left: 5px;
  }
  .weui-select {
    font-size: 0.0445rem;
  }
  .policy-dialog {
    position: fixed;
    height: 100vh;
    width: 100%;
    background: #000;
    left: 0;
    top: 0;
    opacity: 0.5;
    z-index: 1000;
    bottom: 0;
  }
  .policyPopup {
    padding: 50px 20px;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 540px;
    height: 300px;
    margin: -150px -270px;
    z-index: 1001;
    border-radius: 10px;
    p {
      height: 80px;
      line-height: 80px;
      color: #fff;
      font-size: 30px;
      text-align: center;
      border-radius: 10px;
      margin-bottom: 35px;
    }
    .color1 {
      background-color: #28c76a;
    }
    .color2 {
      background-color: #7edda6;
    }
  }
}
@media screen and (max-width: 320px) {
  .policy-insuranceinfo-page
    .insurance-item
    .insurance-item-content
    .specialfield
    .field-item
    .vux-selector {
    padding: 0 5px;
  }
}
</style>
