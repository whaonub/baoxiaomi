<template>
  <div class="dt-pages policy-insured-page">
    <div class="dt-header">
      <dtHeader title="录入简版保单" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="insurance-item" v-for="(pitem,pindex) in insured" :key="pindex">
        <div class="insurance-title">
          {{pitem.name}}
          <span @click="selectUser(pindex)" v-if="pitem.type==0">
            <icon class="dt-icon select-user" name="client"></icon>
          </span>
        </div>
        <div class="insurance-item-content">
          <group
            :class="item.boolFlag ?'warn-title': ''"
            v-for="(item,index) in pitem.fields"
            :key="index"
          >
            <div v-if="item.type == 0" class="itemIpt" :class="item.id=='name' ? 'user-name':''">
              <x-input
                :ref="`${pindex}-${index}-${item.id}`"
                :title="item.name"
                v-model="item.value"
                :placeholder="item.tips"
                @on-change="validateInput(pindex,index,item,...arguments)"
                required
              ></x-input>
            </div>
            <div class="vux-x-input weui-cell sex-content" v-if="item.type == 1">
              <div class="weui-cell__hd" :ref="`${pindex}-${index}-${item.id}`">
                <label for="vux-x-input-sv5h0" class="weui-label">{{item.name}}</label>
              </div>
              <span
                class="man"
                :class="item.value == 1 ? 'active':'sex'"
                @click="validateInput(pindex,index,item,1)"
              >男
                <icon class="dt-icon icon-man" name="man"></icon>
              </span>
              <span
                class="woman"
                :class="item.value == 2 ? 'active':'sex'"
                @click="validateInput(pindex,index,item,2)"
              >女
                <icon class="dt-icon icon-woman" name="woman"></icon>
              </span>
            </div>
            <div class="vux-x-input weui-cell sr_item" v-if="item.type == 2">
              <div class="weui-cell__hd" :ref="`${pindex}-${index}-${item.id}`">
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
import { scrollToElement } from "@/config/utils.js";
import calendar from "@/components/calendar";
export default {
  name: "policyInsured",
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
    calendar
  },
  data() {
    return {
      policyId: "",
      insured: [
        {
          name: "被保人信息",
          type: 0,
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
              value: ""
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
              type: 0,
              tips: "请输入备注",
              value: ""
            }
          ]
        }
      ]
    };
  },
  activated() {
    this.policyId = this.$route.query.policyId || this.$store.state.policyId;
    if (this.policyId) {
      this.$store.state.policyId = this.policyId;
    }
    let customerData = this.$store.state.customerData;
    let currentUserIndex = this.currentUserIndex;
    if (JSON.stringify(customerData) != "{}") {
      let policyInfo = this.insured;
      let policyUserInfo = policyInfo[currentUserIndex].fields;
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
      }
      this.$store.state.customerData = {};
    }
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  methods: {
    async initData() {},
    goBack() {
      this.$router.go(-1);
    },
    selectUser(index) {
      this.currentUserIndex = index;
      this.$router.push({
        path: "/clientList"
      });
    },
    //日历选择
    conversionValue(data) {
      let policyInfo = this.insured;
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
    //字段校验
    validateValue(data) {
      this.validateInput(data.pindex, data.index, data.item, data.value);
    },
    validateInput(pindex, index, item, data) {
      if (
        (item.type == 3 || item.type == 4) &&
        (data == false || data == undefined)
      ) {
        return false;
      }
      let insured = this.insured;
      if (data) {
        insured[pindex].fields[index].boolFlag = false;
      } else {
        insured[pindex].fields[index].boolFlag = true;
      }
      if (item.type == 2) {
        var datetime = data.split("-");
        insured[pindex].fields[index].year = datetime[0];
        insured[pindex].fields[index].month = datetime[1];
        insured[pindex].fields[index].day = datetime[2];
      } else if (item.type == 3) {
        insured[pindex].fields[index].value = data;
      } else if (item.type == 1) {
        insured[pindex].fields[index].value = data;
      }
      let obj = insured[pindex];
      this.$set(insured, pindex, obj);
    },
    async complete() {
      let insured = this.insured;
      for (let i = 0; i < insured.length; i++) {
        for (let j = 0; j < insured[i].fields.length; j++) {
          if (
            insured[i].fields[j].value == "" &&
            insured[i].fields[j].id != "remark"
          ) {
            let obj = insured[i];
            insured[i].fields[j].boolFlag = true;
            this.$set(this.insured, i, obj);
            var refid = insured[i].fields[j].id;
            var vueElement = this.$refs[`${i}-${j}-${refid}`][0];
            scrollToElement.call(this, vueElement, 200);
            this.$alert(insured[i].fields[j].tips);
            return false;
          } else {
            insured[i].fields[j].boolFlag = false;
            let obj = insured[i];
            this.$set(this.insured, i, obj);
          }
        }
      }
      let policyId = this.policyId;
      if (policyId == null) {
        this.$alert("保单id不存在");
      }
      let apiData = {
        policyId: policyId
      };
      for (let i = 0; i < insured.length; i++) {
        //被保人
        for (let j = 0; j < insured[i].fields.length; j++) {
          apiData[insured[i].fields[j].id] = insured[i].fields[j].value;
        }
      }
      let result = await api.addPolicyInsured(apiData);
      if (result.status == 1) {
        if (result.data) {
          let insuredCustomer = result.data;
          insuredCustomer.isMain = 0;
          this.$store.state.insuredCustomer = insuredCustomer;
          //清缓存
          this.$store.commit("clearCacheByName", "policyInsured");
          setTimeout(() => {
            this.$store.commit("setCacheByName", "policyInsured");
          }, 200);
          this.$router.push({
            path: "/policyInsuranceInfo",
            query: {
              policyId: policyId,
              customerId: result.data.customerId
            }
          });
        }
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

.policy-insured-page {
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
      right: 28px;
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
        border: 2px #dedede solid;
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 10px;
      }
      .vux-x-textarea {
        padding-top: 15px;
      }
      .sex-content {
        .sex {
          color: #999;
          font-size: 28px;
        }
        .icon-man {
          color: #999;
          margin-left: 25px;
          margin-right: 90px;
        }
        .icon-woman {
          color: #999;
          margin-left: 25px;
        }
        .active {
          font-size: 28px;
        }
        .active.man {
          color: #1a5ed9;
        }
        .active.woman {
          color: #ff4d94;
        }
        .active .icon-man {
          color: #fff;
          background: #1a5ed9;
          border-radius: 50%;
        }
        .active .icon-woman {
          color: #fff;
          background: #ff4d94;
          border-radius: 50%;
        }
      }
      .calendar-content {
        .vux-datetime {
          top: 8px;
        }
      }
      .user-name {
        position: relative;
        .weui-cell {
          float: left;
          width: 80%;
        }
        .icon-user {
          position: absolute;
          top: 0.04rem;
          right: 0;
        }
      }
    }
    .itemIpt {
      font-size: 28px;
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
  .warn-title .weui-label {
    color: #f00;
  }
  .weui-cell__hd {
    width: 85px;
  }
  .weui-label {
    width: 120px;
  }
  .weui-cell {
    padding: 10px 5px;
  }
  .vux-selector.weui-cell_select-after {
    padding-left: 5px;
  }
  .weui-select {
    font-size: 16px;
  }
  @media screen and (max-width: 320px) {
    .calendar-content .sr_ipt .weui-cell__bd {
      width: 25px;
    }
  }
}
</style>
