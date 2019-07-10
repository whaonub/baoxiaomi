<template>
  <div class="dt-pages policy-make-page">
    <div class="dt-header">
      <dtHeader
        title="录入简版保单"
        :leftBack="false"
        rightIcon="sigh"
        @headerRight="goHelp"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div class="dt-content" id="dtcontent" ref="wrap">
      <div v-for="(pitem,pindex) in policyInfoTmp" :key="pindex" class="policyItem">
        <div class="bd_tit" :ref="`policy-${pindex}`" :class="pitem.type == 3 ? 'new-insured':''">
          {{pitem.title}}
          <span
            v-if="pitem.type != 0"
            @click="selectUser(pindex,pitem)"
            class="select-user"
          >
            <icon class="dt-icon icon-user" name="client"></icon>
          </span>
          <span v-if="pitem.type == 3" @click="deleteInsured(pindex)">
            <icon class="dt-icon icon-remove" name="remove"></icon>
          </span>
        </div>
        <group
          class="policyLi"
          :class="item.boolFlag ?'warn-title': ''"
          v-for="(item,index) in pitem.fields"
          :key="index"
        >
          <div v-if="item.type == 0 && item.id != 'customerAlias'" class="itemIpt">
            <x-input
              :ref="`${pindex}-${index}-${item.id}`"
              :type="item.id == 'premium'?'number':'text'"
              :title="item.name"
              v-model="item.value"
              :placeholder="item.tips"
              @on-blur="validateInput(pindex,index,item,...arguments)"
            ></x-input>
          </div>
          <div v-if="item.type == 0 && item.id == 'customerAlias'" class="itemIpt">
            <x-input
              :max="7"
              :ref="`${pindex}-${index}-${item.id}`"
              @keyup.native="validateCharacter(item,7,1)"
              :is-type="iptValidateVal"
              :type="item.id == 'premium'?'number':'text' "
              :title="item.name"
              v-model="item.value"
              :placeholder="item.tips"
              @on-blur="validateInput(pindex,index,item,...arguments)"
            ></x-input>
          </div>
          <div
            class="vux-x-input weui-cell pd10 policy-sex"
            :ref="`${pindex}-${index}-${item.id}`"
            v-if="item.type == 1"
          >
            <div class="weui-cell__hd">
              <label for="vux-x-input-sv5h0" class="weui-label">{{item.name}}</label>
            </div>
            <span
              class="man"
              :class="item.value == 1 ? 'active':'sex'"
              @click="validateInput(pindex,index,item,1)"
            >
              男
              <i class="icon-man"></i>
            </span>
            <span
              class="woman"
              :class="item.value == 2 ? 'active':'sex'"
              @click="validateInput(pindex,index,item,2)"
            >
              女
              <i class="icon-woman"></i>
            </span>
          </div>
          <div
            class="vux-x-input weui-cell pd10"
            :ref="`${pindex}-${index}-${item.id}`"
            v-if="item.type == 3"
          >
            <div class="weui-cell__hd">
              <label for="vux-x-input-sv5h0" class="weui-label">{{item.name}}</label>
            </div>
            <div class="companyname" :class="companyId?'compyId':''" @click="selectCompany(item)">
              <span v-html="item.tips"></span>
              <icon name="rightarrow" class="dt-icon companyname-icon"></icon>
            </div>
          </div>
          <div
            class="vux-x-input weui-cell sr_item"
            :ref="`${pindex}-${index}-${item.id}`"
            v-if="item.type == 2"
          >
            <div class="weui-cell__hd">
              <label for="vux-x-input-sv5h0" class="weui-label">{{item.name}}</label>
            </div>
            <calendar
              :item="item"
              :pindex="pindex"
              :index="index"
              @validateValue="validateValue"
              @transfervalue="conversionValue"
            ></calendar>
          </div>
          <div v-if="item.type == 4" class="itemIpt" :ref="`${pindex}-${index}-${item.id}`">
            <x-textarea
              v-model="item.value"
              :value="item.value"
              :placeholder="item.tips"
              :max="20"
              :title="item.name"
              :rows="1"
              :show-counter="false"
              @on-change="validateInput(pindex,index,item,...arguments)"
              autosize
            ></x-textarea>
          </div>
        </group>
        <div
          v-if="pindex ==  policyInfoTmp.length -1 && pindex < 7 "
          class="add-user"
          @click="addInsured"
        >
          <icon class="dt-icon icon-add2" name="add3"></icon>添加被保人
        </div>
      </div>
      <div class="death_bd" ref="death_bd">
        <div class="bd_tit">身故受益人信息</div>
        <div class="death_item" v-for="(dbitem,pindex) in deathBenefit.fields" :key="pindex">
          <div class="death_bt">
            <span
              v-if="deathBenefit.fields.length<3 && deathBenefit.status == 0"
              @click="addDeathItem()"
            >
              <icon class="dt-icon icon-add" name="add3"></icon>
            </span>
            <span v-if="pindex == 0">第一顺位</span>
            <span v-if="pindex == 1">第二顺位</span>
            <span v-if="pindex == 2">第三顺位</span>
          </div>
          <div class="death_li" v-for="(dbitemli,index) in dbitem.benefits" :key="index">
            <div class="death-user" v-if="dbitemli.type == 1">
              <span class="icon-user"></span>
              <span>
                <b>{{dbitemli.name}}</b>
              </span>
              <span @click="removeDeathli(dbitem,pindex,index,dbitemli)">
                <icon class="dt-icon icon-remove" name="remove"></icon>
              </span>
            </div>
            <div class="death-user" v-if="dbitemli.type == 2" @click="editDeathli(dbitemli)">
              <span class="icon-user"></span>
              <span class="icon-name">
                <label class="label-name">
                  <em>姓名:</em>
                  <b class="ml24 user-name">{{dbitemli.name}}</b>
                </label>
                <label>
                  <em>比例:</em>
                  <b class="ml24">{{dbitemli.proportion}}%</b>
                </label>
              </span>
              <span @click="removeDeathli(dbitem,pindex,index,dbitemli)">
                <icon class="dt-icon icon-remove" name="remove"></icon>
              </span>
            </div>
            <div
              class="select_death"
              v-if="deathBenefit.status == 0 && dbitemli.type == 3 && dbitem.status != 2"
            >
              <div class="select_death_user">
                <span class="icon-user"></span>
              </div>
              <div class="select_death_content">
                <group>
                  <selector
                    placeholder="请选择受益方式"
                    class="death_selector"
                    v-model="dbitemli.value"
                    :value="dbitemli.value"
                    :value-map="['id', 'name']"
                    :options="selectBenefitVal"
                    @on-change="selectDeath(dbitem,dbitemli,...arguments)"
                  ></selector>
                </group>
                <div class="appoint_death" v-if="dbitemli.value == 2">
                  <group>
                    <x-input
                      class="appoint_death_name"
                      :max="7"
                      title="姓名:"
                      @keyup.native="validateCharacter(dbitemli,14,0)"
                      :is-type="iptValidateVal"
                      v-model="dbitemli.name"
                      :placeholder="iptdefaultTips"
                      @on-blur="appointDeath(dbitem,dbitemli,0,...arguments)"
                    ></x-input>
                    <x-input
                      title="比例:"
                      type="tel"
                      :max="3"
                      v-model="dbitemli.proportion"
                      :placeholder="iptdefaultTips"
                      @on-blur="appointDeath(dbitem,dbitemli,1,...arguments)"
                    ></x-input>
                    <b>%</b>
                  </group>
                </div>
                <span @click="removeDeathli(dbitem,pindex,index,dbitemli)">
                  <icon class="dt-icon icon-remove" name="remove"></icon>
                </span>
              </div>
            </div>
            <div
              class="select_death"
              v-if="(deathBenefit.status == 1  || dbitem.status == 2) && dbitemli.type == 3 "
            >
              <div class="select_death_user">
                <span class="icon-user"></span>
              </div>
              <div class="select_death_content">
                <div class="appoint_death" v-if="dbitemli.value == 2">
                  <group>
                    <x-input
                      class="appoint_death_name"
                      :max="7"
                      title="姓名:"
                      @keyup.native="validateCharacter(dbitemli,7,0)"
                      :is-type="iptValidateVal"
                      v-model="dbitemli.name"
                      :placeholder="iptdefaultTips"
                      @on-blur="appointDeath(dbitem,dbitemli,0,...arguments)"
                    ></x-input>
                    <x-input
                      title="比例:"
                      type="tel"
                      :max="3"
                      v-model="dbitemli.proportion"
                      :placeholder="iptdefaultTips"
                      @on-blur="appointDeath(dbitem,dbitemli,1,...arguments)"
                    ></x-input>
                    <b>%</b>
                  </group>
                </div>
                <span @click="removeDeathli(dbitem,pindex,index,dbitemli)">
                  <icon class="dt-icon icon-remove" name="remove"></icon>
                </span>
              </div>
            </div>
          </div>
          <div
            class="add-user"
            v-if="dbitem.benefits.length<6 && (dbitem.status == 0 || dbitem.status == 2 )"
            @click="addDeathli(dbitem.benefits,dbitem)"
          >
            <icon class="dt-icon icon-add2" name="add3"></icon>添加受益人
          </div>
        </div>
      </div>
    </div>
    <div class="dt-footer">
      <flexbox :gutter="0">
        <flexbox-item align="center">
          <div class="dt-btn-box fz30">
            <div class="dt-btn-up" @click="goBack">退出</div>
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
import {
  XInput,
  Group,
  XButton,
  XTextarea,
  Checker,
  CheckerItem,
  Selector,
  Flexbox,
  FlexboxItem,
  Cell
} from "vux";
import api from "@/api/index";
import { scrollToElement, getDevice } from "@/config/utils.js";
import dtHeader from "@/components/dtHeader";
import calendar from "@/components/calendar";
import { setTimeout } from "timers";
export default {
  name: "policyMake",
  components: {
    XInput,
    Group,
    XButton,
    Checker,
    Selector,
    CheckerItem,
    XTextarea,
    dtHeader,
    Flexbox,
    FlexboxItem,
    calendar,
    Cell
  },
  data() {
    return {
      device: getDevice(),
      policyId: "",
      companyId: "",
      companyName: "",
      currentUserIndex: null,
      iptdefaultTips: "请输入",
      policyNoExist: null,
      insuredTmp: {
        title: "被保人信息",
        type: 3, //0基本信息，1投保人，2被保人，3新增被保人
        fields: [
          {
            id: "customerAlias",
            name: "姓名",
            type: 0,
            tips: "请输入姓名",
            value: ""
          },
          {
            id: "gender",
            name: "性别",
            type: 1,
            tips: "请输入性别",
            keys: [
              {
                id: 1,
                name: "男"
              },
              {
                id: 2,
                name: "女"
              }
            ],
            value: "1"
          },
          {
            id: "birthday",
            name: "生日",
            type: 2,
            tips: "请输入生日",
            value: "",
            year: "",
            month: "",
            day: ""
          },
          {
            id: "remark",
            name: "备注",
            type: 4,
            tips: "填写备注，方便您辨识客户",
            value: ""
          }
        ]
      },
      policyInfoTmp: [
        {
          title: "基本信息",
          type: 0,
          fields: [
            {
              id: "companyName",
              name: "保险公司",
              type: 3,
              tips: "请选择保险公司",
              value: ""
            },
            {
              id: "policyNo",
              name: "保单号",
              type: 0,
              tips: "请输入正确的保单号",
              ptips: "请输入保单号",
              value: ""
            },
            {
              id: "effectiveStartDate",
              name: "生效日期",
              tips: "请输入生效日期",
              type: 2,
              value: "",
              year: "",
              month: "",
              day: ""
            },
            {
              id: "premium",
              name: "合计保费",
              type: 0,
              tips: "请输入保单的合计保费",
              ptips: "请输入合计保费",
              value: ""
            }
          ]
        },
        {
          title: "投保人信息",
          type: 1,
          fields: [
            {
              id: "customerAlias",
              name: "姓名",
              type: 0,
              tips: "请输入姓名",
              value: ""
            },
            {
              id: "gender",
              name: "性别",
              type: 1,
              tips: "请输入性别",
              keys: [
                {
                  id: 1,
                  name: "男"
                },
                {
                  id: 2,
                  name: "女"
                }
              ],
              value: "1"
            },
            {
              id: "birthday",
              name: "生日",
              type: 2,
              tips: "请输入生日",
              value: "",
              year: "",
              month: "",
              day: ""
            },
            {
              id: "remark",
              name: "备注",
              type: 4,
              tips: "填写备注，方便您辨识客户",
              value: ""
            }
          ]
        },
        {
          title: "被保人信息",
          type: 2,
          fields: [
            {
              id: "customerAlias",
              name: "姓名",
              type: 0,
              tips: "请输入姓名",
              value: ""
            },
            {
              id: "gender",
              name: "性别",
              type: 1,
              tips: "请输入性别",
              keys: [
                {
                  id: 1,
                  name: "男"
                },
                {
                  id: 2,
                  name: "女"
                }
              ],
              value: "1"
            },
            {
              id: "birthday",
              name: "生日",
              type: 2,
              tips: "请输入生日",
              value: "",
              year: "",
              month: "",
              day: ""
            },
            {
              id: "remark",
              name: "备注",
              type: 4,
              tips: "填写备注，方便您辨识客户",
              value: ""
            }
          ]
        }
      ],
      selectBenefitVal: [
        {
          id: 1,
          name: "法定受益人"
        },
        {
          id: 2,
          name: "指定受益人"
        }
      ],
      deathBenefit: {
        status: 1,
        fields: [
          {
            id: 1,
            name: "第一顺位",
            status: 1,
            benefits: [
              {
                type: 1, //添加受益人
                name: "法定受益人",
                proportion: "100",
                value: "法定受益人"
              }
            ]
          }
        ]
      },
      iptValidateVal: val => {
        let reg = /^[\u4e00-\u9fa5a-zA-Z0-9\-_]+[\u4e00-\u9fa5a-zA-Z0-9\-_]*$/;
        return {
          valid: reg.test(val),
          msg: "请输入正确的姓名"
        };
      }
    };
  },
  created() {
    let policyId = this.$route.query.policyId || this.$store.state.policyId;
    if (policyId) {
      this.policyId = policyId;
    }
    let from = this.$route.query.from;
    if (from == "index") {
      this.$store.state.policyMakeFrom = "index";
    }
    let oldFamilyId = this.$route.query.oldFamilyId;
    if (oldFamilyId) {
      this.$store.state.oldFamilyId = oldFamilyId;
    }
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  activated() {
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
    let policyId = this.$route.query.policyId || this.$store.state.policyId;
    if (policyId) {
      this.policyId = policyId;
    }
    let companyInfo = this.$store.state.company;
    if (companyInfo) {
      let policybasicInfo = this.policyInfoTmp[0].fields;
      for (let i = 0; i < policybasicInfo.length; i++) {
        if (policybasicInfo[i].id == "companyName") {
          policybasicInfo[i].value = companyInfo.companyName;
          policybasicInfo[i].tips = companyInfo.companyName;
          policybasicInfo[i].boolFlag = false;
          break;
        }
      }
      this.companyId = companyInfo.companyId;
    }
    let customerData = this.$store.state.customerData;
    let currentUserIndex = this.currentUserIndex;
    if (JSON.stringify(customerData) != "{}" && currentUserIndex) {
      let policyInfo = this.policyInfoTmp;
      let policyUserInfo = policyInfo[currentUserIndex].fields;
      policyInfo[currentUserIndex].customerId = customerData.customerId;
      for (let i = 0; i < policyUserInfo.length; i++) {
        let objId = policyUserInfo[i].id;
        if (objId == "birthday") {
          policyUserInfo[i].value = customerData.birthday;
          policyUserInfo[i].boolFlag = false;
        } else if (objId == "customerAlias") {
          policyUserInfo[i].value = customerData.customerAlias;
          policyUserInfo[i].boolFlag = false;
        } else if (objId == "gender") {
          policyUserInfo[i].value = customerData.gender;
          policyUserInfo[i].boolFlag = false;
        } else if (objId == "remark") {
          policyUserInfo[i].value = customerData.remark;
          policyUserInfo[i].boolFlag = false;
        }
        var vueElement = this.$refs[`policy-${currentUserIndex}`][0];
        scrollToElement.call(this, vueElement, 200);
      }
      this.$store.state.customerData = {};
      this.currentUserIndex = null;
    }
  },
  methods: {
    async initData() {
      let policyId = this.policyId;
      if (policyId) {
        let result = await api.findPolicyBase({
          id: policyId
        });
        if (result.status == 1) {
          if (result.data == null) {
            this.$alert("保单id不存在");
          } else {
            let policyBaseInfo = result.data;
            let policyInfo = this.policyInfoTmp;
            this.policyId = policyBaseInfo.policyId;
            this.companyId = policyBaseInfo.companyId;
            this.$store.state.company = {
              companyName: policyBaseInfo.companyName,
              companyId: policyBaseInfo.companyId
            };
            this.$store.state.policyId = policyId;
            for (let i = 0; i < policyInfo.length; i++) {
              if (policyInfo[i].type == 2) {
                policyInfo.splice(i, 1);
              }
            }
            //基本信息
            for (let j = 0; j < policyInfo[0].fields.length; j++) {
              let objId = policyInfo[0].fields[j].id;
              if (objId == "companyName") {
                policyInfo[0].fields[j].value = policyBaseInfo.companyName;
                policyInfo[0].fields[j].tips = policyBaseInfo.companyName;
              } else if (objId == "policyNo") {
                policyInfo[0].fields[j].value = policyBaseInfo.policyNo;
              } else if (objId == "premium") {
                policyInfo[0].fields[j].value = parseFloat(
                  policyBaseInfo.premium
                ).toFixed(2);
              } else if (objId == "effectiveStartDate") {
                policyInfo[0].fields[j].value =
                  policyBaseInfo.effectiveStartDate;
              }
            }
            //投保人信息
            for (let j = 0; j < policyInfo[1].fields.length; j++) {
              let objId = policyInfo[1].fields[j].id;
              if (objId == "birthday") {
                policyInfo[1].fields[j].value = policyBaseInfo.insurer.birthday;
              } else if (objId == "customerAlias") {
                policyInfo[1].fields[j].value =
                  policyBaseInfo.insurer.customerAlias;
              } else if (objId == "gender") {
                policyInfo[1].fields[j].value = policyBaseInfo.insurer.gender;
              } else if (objId == "remark") {
                policyInfo[1].fields[j].value = policyBaseInfo.insurer.remark;
              }
            }
            //被保人信息
            let insureds = policyBaseInfo.insureds;
            for (let i = 0; i < insureds.length; i++) {
              let insuredTmp = this._.cloneDeep(this.insuredTmp);
              if (i > 0) {
                insuredTmp.type = 3;
              } else {
                insuredTmp.type = 2;
              }
              for (let j = 0; j < insuredTmp.fields.length; j++) {
                let objId = insuredTmp.fields[j].id;
                if (objId == "birthday") {
                  insuredTmp.fields[j].value = insureds[i].birthday;
                  var datetime = insureds[i].birthday.split("-");
                  insuredTmp.fields[j].year = datetime[0];
                  insuredTmp.fields[j].month = datetime[1];
                  insuredTmp.fields[j].day = datetime[2];
                } else if (objId == "customerAlias") {
                  insuredTmp.fields[j].value = insureds[i].customerAlias;
                } else if (objId == "gender") {
                  insuredTmp.fields[j].value = insureds[i].gender;
                } else if (objId == "remark") {
                  insuredTmp.fields[j].value = insureds[i].remark;
                }
              }
              policyInfo.push(insuredTmp);
            }
            //受益人
            let deathBenefit = this.deathBenefit;
            deathBenefit.status = 0;
            let deathBenefitFields = this.deathBenefit.fields;
            deathBenefitFields.length = 0;
            let arr1 = []; //第一顺位
            let arr2 = []; //第二顺位
            let arr3 = []; //第三顺位
            let obj1 = {};
            let obj2 = {};
            let obj3 = {};
            for (let i = 0; i < policyBaseInfo.benefitRelas.length; i++) {
              let benefitType;
              let benefitStatus = 0;
              if (policyBaseInfo.benefitRelas[i].benefitType == 1) {
                benefitType = 1;
                deathBenefit.status = 1;
                benefitStatus = 1;
              } else {
                benefitType = 2;
                benefitStatus = 2;
              }
              let benefitObj = {
                type: benefitType, //添加受益人
                name: policyBaseInfo.benefitRelas[i].benefitName,
                proportion: policyBaseInfo.benefitRelas[
                  i
                ].percentOfBenefit.toString(),
                value: ""
              };
              if (policyBaseInfo.benefitRelas[i].benefitLevel == 1) {
                obj1.status = benefitStatus;
                arr1.push(benefitObj);
              } else if (policyBaseInfo.benefitRelas[i].benefitLevel == 2) {
                obj2.status = benefitStatus;
                arr2.push(benefitObj);
              } else if (policyBaseInfo.benefitRelas[i].benefitLevel == 3) {
                obj3.status = benefitStatus;
                arr3.push(benefitObj);
              }
            }
            if (arr1.length > 0) {
              obj1.benefits = arr1;
              deathBenefit.fields.push(obj1);
            }
            if (arr2.length > 0) {
              obj2.benefits = arr2;
              deathBenefit.fields.push(obj2);
            }
            if (arr3.length > 0) {
              obj3.benefits = arr3;
              deathBenefit.fields.push(obj3);
            }
          }
        } else {
          this.$alert(result.msg);
        }
      }
    },
    goBack() {
      let device = this.device;
      let policyMakeFrom = this.$store.state.policyMakeFrom;
      let from = this.$route.query.from;
      if (
        policyMakeFrom == "popup" ||
        policyMakeFrom == "familyListIndex" ||
        policyMakeFrom == "total" ||
        from == "task"
      ) {
        if (policyMakeFrom == "popup") {
          this.$store.state.policyMakeFrom = null;
        }
        this.$router.go(-1);
      } else if (policyMakeFrom == "index") {
        if (device == "android") {
          bmAndroid.goHomePage();
        } else if (device == "ios" || device == "iPhoneX") {
          let isPc = this.$store.state.isPc;
          if (!isPc) {
            window.webkit.messageHandlers.goHomePage.postMessage(null);
          } else {
            this.$router.go(-1);
          }
        } else {
          this.$router.go(-1);
        }
      } else {
        this.$router.push({
          path: "/trusteeshipList"
        });
      }
      this.$store.state.policyId = null;
      this.$store.state.insurance = [];
      this.$store.state.company = null;
      this.$store.state.companyId = null;
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
    selectCompany(item) {
      let companyId;
      if (this.companyId) {
        companyId = this.companyId;
      }
      this.$router.push({
        path: "/companyList",
        query: {
          from: "policyMake",
          companyId: companyId
        }
      });
    },
    selectUser(index, pitem) {
      this.currentUserIndex = index;
      let customerId;
      if (pitem.customerId) {
        customerId = pitem.customerId;
      }
      this.$router.push({
        path: "/clientList",
        query: {
          customerId: customerId
        }
      });
    },
    addInsured() {
      let policyInfo = this.policyInfoTmp;
      let insured = this._.cloneDeep(this.insuredTmp);
      policyInfo.push(insured);
    },
    deleteInsured(pindex) {
      let policyInfo = this.policyInfoTmp;
      policyInfo.splice(pindex, 1);
    },
    //填写指定受益人参数
    appointDeath(dbitem, dbitemli, type, data) {
      if (type == 1) {
        let reg = /^[1-9]\d*$/;
        if (!reg.test(data)) {
          dbitemli.proportion = "";
          this.$toast("填写格式不对！");
          return false;
        }
        if (data) {
          if (parseInt(data) > 100) {
            data = "100";
          } else if (parseInt(data) <= 0) {
            data = "";
          }
          dbitemli.proportion = data;
          let benefits = dbitem.benefits;
          let sum = 0;
          for (let i = 0; i < benefits.length; i++) {
            sum += parseInt(benefits[i].proportion);
          }
          if (sum > 100) {
            this.$toast("每个顺位的受益人比例相加不能超过100");
            dbitemli.proportion = data;
            return false;
          } else if (sum == 100) {
            dbitem.status = 1; //比例等于100 不能添加受益人
          } else {
            dbitem.status = 0;
          }
          if (dbitemli.name && data != "") {
            dbitemli.type = 2;
          }
        } else {
          this.$toast("请填写小于等于100的整数");
          dbitemli.proportion = "";
        }
      } else if (type == 0) {
        if (data) {
          let reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
          if (!reg.test(data)) {
            dbitemli.boolFlag = true;
            this.$toast("请输入正确的姓名");
            return false;
          }
          if (dbitemli.proportion) {
            dbitemli.type = 2;
          }
        }
      }
    },
    //选择指定受益人或法定受益人
    selectDeath(dbitem, dbitemli, data) {
      let beneficiary = this.deathBenefit;
      if (data) {
        if (dbitemli.value == 1) {
          dbitemli.type = 1;
          dbitemli.name = "法定受益人";
          dbitemli.proportion = "100";
          beneficiary.status = 1; //不能添加顺位
          dbitem.status = 1; //不能添加受益人
        } else if (dbitemli.value == 2) {
          dbitem.status = 2; //只能添加指定
        }
      }
    },
    //新增顺位
    addDeathItem() {
      let deathBenefitSize = this.deathBenefit.fields.length;
      deathBenefitSize++;
      if (deathBenefitSize > 3) {
        this.$toast("只能添加三个顺位");
        return false;
      }
      let flag = true; //当前所有顺位的受益人信息都要填写完整
      let flag2 = true; //第一顺位没有受益人不可添加第二顺位
      let deathBenefitList = this.deathBenefit.fields;
      for (let i = 0; i < deathBenefitList.length; i++) {
        if (flag) {
          for (let j = 0; j < deathBenefitList[i].benefits.length; j++) {
            if (
              deathBenefitList[i].benefits[j].name == "" ||
              deathBenefitList[i].benefits[j].proportion == ""
            ) {
              flag = false;
              break;
            }
          }
        }
        if (deathBenefitList[0].benefits.length == 0) {
          flag2 = false;
        }
      }
      if (!flag2) {
        this.$toast("请填写第一顺位的受益人信息");
        return false;
      }
      if (flag) {
        let value = "";
        if (this.deathBenefit.fields.length >= 1) {
          value = "2";
        }
        this.deathBenefit.fields.push({
          status: 0,
          benefits: [
            {
              type: 3, //添加受益人
              name: "",
              proportion: "",
              value: value
            }
          ]
        });
        setTimeout(function() {
          var div = document.getElementById("dtcontent");
          div.scrollTop = div.scrollHeight;
        }, 300);
      } else {
        this.$toast("请填写完整已添加的受益人信息");
        return false;
      }
    },
    addDeathli(list, dbitem) {
      let value = "";
      let beneficiary = this.deathBenefit;
      if (beneficiary.status == 1 || dbitem.status == 2) {
        value = "2";
      }
      let noComplete = 0;
      for (let i = 0; i < dbitem.benefits.length; i++) {
        if (
          dbitem.benefits[i].name == "" ||
          dbitem.benefits[i].proportion == ""
        ) {
          noComplete++;
        }
        if (
          dbitem.benefits[i].name != "" &&
          dbitem.benefits[i].proportion != "" &&
          dbitem.benefits[i].type == 2
        ) {
          value = "2";
        }
      }
      if (dbitem.benefits.length >= noComplete && noComplete != 0) {
        this.$toast("请填写完整已添加的受益人信息再添加新的受益人");
        return false;
      }
      list.push({
        type: 3, //添加受益人
        name: "",
        proportion: "",
        value: value
      });
      setTimeout(function() {
        var div = document.getElementById("dtcontent");
        div.scrollTop = div.scrollHeight;
      }, 300);
    },
    //删除受益人
    removeDeathli(item, pindex, index, dbitemli) {
      item.benefits.splice(index, 1);
      if (pindex != 0) {
        if (item.benefits.length == 0) {
          let fields = this.deathBenefit.fields;
          fields.splice(pindex, 1);
        }
      }
      if (dbitemli.type == 1) {
        let beneficiary = this.deathBenefit;
        beneficiary.status = 0;
        item.status = 0;
      }
      if (item.benefits.length == 0) {
        item.status = 0;
      }
    },
    //编辑受益人
    editDeathli(item) {
      item.type = 3;
      item.value = 2;
    },
    validateValue(data) {
      this.validateInput(data.pindex, data.index, data.item, data.value);
    },
    async validateInput(pindex, index, item, data) {
      let policyInfo = this.policyInfoTmp;
      let validateObj = policyInfo[pindex].fields[index];
      if (data) {
        validateObj.boolFlag = false;
      } else {
        validateObj.boolFlag = true;
      }
      if (item.type == 2) {
        if (typeof data == "string") {
          var datetime = data.split("-");
          validateObj.year = datetime[0];
          validateObj.month = datetime[1];
          validateObj.day = datetime[2];
        }
      } else if (item.type == 1) {
        validateObj.value = data;
      } else {
        if (item.id == "premium") {
          let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
          if (data.length > 10) {
            data = data.substr(0, 10);
          }
          if (data == "") {
            validateObj.value = "";
            this.$toast("请输入合计保费!");
          }
          if (!reg.test(data)) {
            validateObj.boolFlag = true;
            this.$toast("请输入正确的合计保费！");
            validateObj.wxTips = "请输入正确的合计保费！";
          } else {
            validateObj.value = parseFloat(data).toFixed(2);
            validateObj.wxTips = null;
          }
        }
      }
      if (item.id == "customerAlias") {
        let reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        if (data) {
          if (!reg.test(data)) {
            validateObj.boolFlag = true;
            this.$toast("请输入正确的姓名");
            return false;
          } else {
            validateObj.boolFlag = false;
          }
        }
      }
      if (item.id == "remark") {
        validateObj.boolFlag = false;
      }
      if (item.id == "policyNo") {
        if (data) {
          let reg = /^[A-Za-z0-9]+$/;
          if (!reg.test(data)) {
            validateObj.boolFlag = true;
            this.policyNoExist = null;
            this.$toast("请输入正确的保单号");
            return false;
          }
          let result = await api.findPolicyNoExist({
            policyNo: data,
            companyId: this.companyId
          });
          if (result.status == 1) {
            if (result.data) {
              validateObj.boolFlag = true;
              this.policyNoExist = result.data.id;
              this.$alert("不可输入重复的保单号");
            } else {
              validateObj.boolFlag = false;
              this.policyNoExist = null;
            }
          } else {
            this.$alert(result.msg);
          }
        } else {
          this.$toast("请输入保单号");
          return false;
        }
      }
      let obj = policyInfo[pindex];
      this.$set(policyInfo, pindex, obj);
    },
    conversionValue(data) {
      let policyInfo = this.policyInfoTmp;
      let pindex = data.pindex;
      let index = data.index;
      let calendarObj = policyInfo[pindex].fields[index];
      if (data.type == 0) {
        calendarObj.year = data.year;
      } else if (data.type == 1) {
        calendarObj.month = data.month;
      } else if (data.type == 2) {
        calendarObj.day = data.day;
      }
      if (data.day) {
        calendarObj.day = data.day;
      }
      let obj = policyInfo[pindex];
      if (calendarObj.year && calendarObj.month && calendarObj.day) {
        calendarObj.value =
          calendarObj.year + "-" + calendarObj.month + "-" + calendarObj.day;
      }
      this.$nextTick(() => {
        this.$set(policyInfo, pindex, obj);
      });
    },
    // 校验输入框字数
    validateCharacter(item, maxLength, type) {
      let str;
      if (type == 0) {
        str = item.name;
      } else if (type == 1) {
        str = item.value;
      }
      function getLength(str) {
        str.length;
      }
      function limitMaxLength(str, maxLength) {
        let result = [];
        for (let i = 0; i < maxLength; i++) {
          let char = str[i];
          if (/[^ -~]/.test(char)) maxLength--;
          result.push(char);
        }
        return result.join("");
      }
      if (getLength(str) > maxLength) {
        if (type == 0) {
          item.name = limitMaxLength(str, maxLength);
        } else if (type == 1) {
          item.value = limitMaxLength(str, maxLength);
        }
      }
    },
    //保存受益人
    saveBeneficiaryInfo(item) {
      let beneficiary = item.fields;
      let flag = true;
      //过滤不完整的受益人信息
      for (let i = 0; i < beneficiary.length; i++) {
        for (let j = 0; j < beneficiary[i].benefits.length; j++) {
          if (
            beneficiary[i].benefits[j].name == "" ||
            beneficiary[i].benefits[j].proportion == 0 ||
            beneficiary[i].benefits[j].proportion == ""
          ) {
            if (i == 0 && j == 0) {
              flag = false;
              break;
            } else {
              beneficiary[i].benefits.splice(j, 1);
              j--;
            }
          } else if (beneficiary[i].benefits[j].name.length <= 1) {
            this.$toast("请输入正确的姓名");
            return false;
          } else if (beneficiary[i].benefits[j].boolFlag) {
            this.$toast("请输入正确的姓名");
            return false;
          }
        }
        if (i != 0) {
          if (beneficiary[i].benefits.length == 0) {
            beneficiary.splice(i, 1);
            i--;
          }
        }
      }
      if (!flag) {
        var inputElement = this.$refs[`death_bd`];
        scrollToElement.call(this, inputElement, 200);
        this.$toast("请填写完整受益人信息");
        return false;
      }
      //计算每个顺位的受益人的比例相加必须为100
      let sumStatus = true;
      for (let i = 0; i < beneficiary.length; i++) {
        let sum = 0;
        for (let j = 0; j < beneficiary[i].benefits.length; j++) {
          sum += parseInt(beneficiary[i].benefits[j].proportion);
        }
        if (sum != 100) {
          sumStatus = false;
          break;
        }
      }
      if (!sumStatus) {
        this.$toast("每个顺位的受益人比例相加必须为100");
        return false;
      }
      return true;
    },
    async nextstep() {
      if (this.policyNoExist) {
        this.$alert("不可输入重复的保单号");
        return false;
      }
      let policyInfo = this.policyInfoTmp;
      //填写的内容判断
      for (let i = 0; i < policyInfo.length; i++) {
        let obj = policyInfo[i];
        for (let j = 0; j < obj.fields.length; j++) {
          if (
            (obj.fields[j].value == "" && obj.fields[j].id != "remark") ||
            obj.fields[j].boolFlag ||
            (obj.fields[j].id == "customerAlias" &&
              obj.fields[j].value.length <= 1)
          ) {
            obj.fields[j].boolFlag = true;
            this.$set(this.policyInfoTmp, i, obj);
            var vueElement = this.$refs[`policy-${i}`][0];
            var refid = policyInfo[i].fields[j].id;
            var inputElement = this.$refs[`${i}-${j}-${refid}`][0];
            scrollToElement.call(this, vueElement, 200);
            if (inputElement && inputElement.focus) {
              setTimeout(function() {
                inputElement.focus();
              }, 100);
            }
            if (obj.fields[j].id == "customerAlias") {
              if (obj.fields[j].value == "") {
                this.$toast(obj.fields[j].tips);
              } else {
                this.$toast("请输入正确的姓名");
              }
            } else {
              if (obj.fields[j].id == "premium" && obj.fields[j].wxTips) {
                this.$toast(obj.fields[j].wxTips);
                return false;
              }
              if (obj.fields[j].value == "" && obj.fields[j].ptips) {
                this.$toast(obj.fields[j].ptips);
              } else {
                this.$toast(obj.fields[j].tips);
              }
            }
            return false;
          } else {
            obj.fields[j].boolFlag = false;
            this.$set(this.policyInfoTmp, i, obj);
          }
        }
      }
      let apiData = {
        companyId: this.companyId,
        inputType: 2,
        policyId: this.policyId,
        insurer: [],
        insureds: [],
        benefitRelas: []
      };
      //数据的整理
      for (let i = 0; i < policyInfo.length; i++) {
        if (policyInfo[i].type == 0) {
          //基本信息
          for (let j = 0; j < policyInfo[i].fields.length; j++) {
            let objId = policyInfo[i].fields[j].id;
            apiData[objId] = policyInfo[i].fields[j].value;
          }
        } else if (policyInfo[i].type == 1) {
          //投保人
          let obj = {};
          for (let j = 0; j < policyInfo[i].fields.length; j++) {
            obj[policyInfo[i].fields[j].id] = policyInfo[i].fields[j].value;
          }
          apiData.insurer = obj;
        } else {
          //被保人
          let obj = {};
          for (let j = 0; j < policyInfo[i].fields.length; j++) {
            obj[policyInfo[i].fields[j].id] = policyInfo[i].fields[j].value;
          }
          apiData.insureds.push(obj);
        }
      }
      //受益人
      let deathBenefitFields = this.deathBenefit.fields;
      let beneficiaryVerification = this.saveBeneficiaryInfo(this.deathBenefit);
      if (!beneficiaryVerification) {
        return false;
      }
      for (let i = 0; i < deathBenefitFields.length; i++) {
        for (let j = 0; j < deathBenefitFields[i].benefits.length; j++) {
          let obj = {
            benefitLevel: parseInt(i + 1)
          };
          obj.benefitName = deathBenefitFields[i].benefits[j].name;
          obj.percentOfBenefit = parseInt(
            deathBenefitFields[i].benefits[j].proportion
          );
          let benefitType;
          if (deathBenefitFields[i].benefits[j].type == 1) {
            benefitType = 1;
          } else if (deathBenefitFields[i].benefits[j].type == 2) {
            benefitType = 0;
          }
          obj.benefitType = benefitType;
          apiData.benefitRelas.push(obj);
        }
      }
      let result = await api.addPolicy(apiData);
      if (result.status == 1) {
        this.$store.state.policyId = result.data.id;
        this.$router.push({
          path: "/policyInsurance",
          query: {
            policyId: result.data.id,
            from: "policyMake"
          }
        });
        //清缓存
        this.$store.commit("clearCacheByName", "policyInsurance");
        setTimeout(() => {
          this.$store.commit("setCacheByName", "policyInsurance");
        }, 200);
      } else {
        this.$alert(result.msg);
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

.policy-make-page {
  background: #f8f8f8;
  color: #222222;
  .dt-content {
    overflow: auto;
    padding: 20px 20px 100px;
    -webkit-overflow-scrolling: touch;
  }
  .policyItem {
    background: #fff;
    border: 2px #dedede solid;
    border-radius: 10px;
    margin-bottom: 25px;
    .add-user {
      margin-bottom: 30px;
    }
    .bd_tit {
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
        right: 30px;
        top: 10px;
      }
    }
    .new-insured {
      .select-user {
        right: 100px;
      }
    }
    .companyname {
      font-size: 28px;
      width: 100%;
      position: relative;
      color: #959494;
      span {
        width: 0.515rem;
        display: inline-block;
      }
      em {
        font-style: normal;
      }
      .companyname-icon {
        position: absolute;
        top: 3px;
        right: 0;
      }
    }
    .compyId {
      color: #222;
    }
    .calendar-content .vux-datetime {
      top: 0.0275rem;
    }
  }
  .sr_item {
    padding: 23px 16px;
  }
  .ipt {
    width: 48px;
    height: 48px;
    padding-right: 20px;
    display: block;
  }
  .itemIpt {
    font-size: 28px;
    .weui-textarea {
      font-size: 0.03733rem;
      line-height: 1.5;
    }
    .weui-cell {
      padding: 10px 7px;
    }
    .weui-icon-warn {
      display: none;
    }
    .weui-cell_warn {
      color: inherit;
    }
  }
  .fm-text {
    border: 2px #ddd solid;
    margin-bottom: 25px;
    border-radius: 10px;
    background: #fff;
  }
  .weui-cells {
    background: transparent;
    margin-top: 0;
  }
  .policyLi:last-of-type .weui-cells:after {
    border-bottom: none;
  }
  .weui-cells:after {
    border-bottom: 1px #dedede solid;
  }
  .weui-cells:before {
    border-top: none;
  }
  .fm-login {
    background: #00c1de;
    color: #fff;
    border: none;
  }
  .weui-btn_plain-default:not(.weui-btn_plain-disabled):active {
    color: #fff;
  }
  .weui-input::-webkit-input-placeholder {
    color: #959494;
    font-size: 14px;
    text-align: left;
  }
  .checker-item {
    height: 60px;
    line-height: 60px;
    width: 80px;
    text-align: center;
    border-radius: 5px;
    margin-right: 40px;
    border: 2px #000 solid;
  }
  .checker-item-selected {
    border: 2px #00f solid;
    color: #00f;
  }
  .fm-btn {
    margin-top: 40px;
  }
  .warn-title .weui-cell__hd {
    color: #f00;
  }
  .weui-cell__hd {
    width: 83px;
  }
  .bd_tit {
    line-height: 60px;
    color: #000;
    font-size: 32px;
    font-weight: 600;
    background: #ebfdf2;
    padding: 15px 30px;
    border-radius: 10px 10px 0 0;
  }
  .policyLi {
    color: #222;
    font-size: 28px;
    padding: 0 20px;
    .weui-label {
      font-size: 14px;
    }
    .pd10 {
      padding: 23px 12px;
    }
    .sex {
      color: #999;
      font-size: 28px;
      position: relative;
      width: 100px;
    }
    .man {
      margin-right: 90px;
    }
    .icon-man {
      margin-left: 25px;
      margin-right: 90px;
      width: 34px;
      height: 34px;
      position: absolute;
      display: block;
      left: 25px;
      top: 1px;
      background-image: url("../../assets/imgs/man_c.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    .icon-woman {
      width: 36px;
      height: 34px;
      margin-left: 25px;
      position: absolute;
      display: block;
      left: 25px;
      top: 1px;
      background-image: url("../../assets/imgs/woman_c.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    .policy-sex {
      .active {
        font-size: 28px;
        position: relative;
        width: 100px;
      }
    }
    .active.man {
      color: #1a5ed9;
    }
    .active.woman {
      color: #ff4d94;
    }
    .active .icon-man {
      width: 44px;
      height: 44px;
      top: -3px;
      background-image: url("../../assets/imgs/man_d.png");
    }
    .active .icon-woman {
      width: 44px;
      height: 44px;
      top: -3px;
      background-image: url("../../assets/imgs/woman_d.png");
    }
  }
  .death_bd {
    margin-top: 30px;
    border: 2px #dedede solid;
    border-radius: 10px;
    margin-bottom: 20px;
    padding-bottom: 30px;
    background: #fff;
    .death_item {
      margin-top: 20px;
      padding: 0 20px;
    }
    .user-name {
      display: inline-block;
      max-width: 200px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
    }
    .weui-icon-warn {
      display: none;
    }
    .weui-cell_warn {
      color: inherit;
    }
    .death_bt {
      text-align: center;
      position: relative;
      line-height: 70px;
      font-size: 30px;
      background: #fbf1f0;
      padding: 10px;
      border-radius: 10px;
      .icon-add {
        position: absolute;
        left: 20px;
        top: 20px;
      }
    }
    .dt-icon {
      color: #fff;
      background: #28c76a;
      border-radius: 15px;
      padding: 5px;
      width: 36px;
      height: 36px;
    }
    .death_li {
      position: relative;
      margin-top: 15px;
      border-bottom: 1px #dedede solid;
      .icon-user {
        position: absolute;
        left: 0px;
        top: 22px;
        color: #252525;
        width: 44px;
        height: 44px;
        background-image: url("../../assets/imgs/user-syr.png");
        background-repeat: no-repeat;
        background-size: cover;
      }
      .icon-name {
        position: relative;
      }
      .icon-remove {
        position: absolute;
        top: 25px;
        right: 20px;
        border-radius: 50%;
      }
      .select_death {
        margin-left: 60px;
        .weui-cells:before {
          border: none;
        }
        .appoint_death {
          position: relative;
          b {
            position: absolute;
            right: 0.02rem;
            bottom: 30px;
            font-style: normal;
            font-weight: 100;
          }
          .weui-cell {
            padding: 10px 0;
          }
          .weui-cell:before {
            border: none;
          }
          .weui-cell__hd {
            width: 42px;
          }
          .weui-cell__bd {
            border: 1px #ddd solid;
            border-radius: 5px;
            flex: 0;
          }
          .weui-input {
            text-align: center;
          }
          .weui-input::-webkit-input-placeholder {
            font-size: 0.04rem;
            text-align: center;
          }
          .weui-icon-clear {
            position: relative;
            left: -0.08rem;
          }
          .appoint_death_name {
            .weui-icon-clear {
              left: 0;
            }
          }
        }
        .select_death_user {
          height: 85px;
        }
        .select_death_content {
          position: relative;
          padding-bottom: 30px;
          .weui-cells:after {
            border-bottom: none;
          }
          .icon-remove {
            top: 15px;
          }
        }
      }
      .death-user {
        padding-bottom: 30px;
        padding-left: 64px;
        font-size: 30px;
        padding-top: 30px;
        b {
          font-weight: normal;
          color: #5477e9;
          display: inline-block;
          overflow: hidden;
        }
        label {
          width: 40%;
          display: inline-block;
        }
        .label-name {
          width: 55%;
        }
        .ml24 {
          margin-left: 20px;
        }
        em {
          font-style: normal;
          display: inline-block;
          overflow: hidden;
        }
      }
    }
  }
  .add-user {
    padding-top: 30px;
    font-size: 30px;
    text-align: center;
    margin-bottom: 10px;
    .icon-add2 {
      margin-right: 15px;
      border-radius: 50%;
      color: #fff;
      background: #28c76a;
      border-radius: 50%;
      padding: 7px;
      width: 28px;
      height: 28px;
      position: relative;
      top: -4px;
    }
  }
}
</style>
