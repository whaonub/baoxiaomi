<template>
  <div class="dt-pages family-edit-userinfo">
    <div class="dt-header">
      <dtHeader
        :title="`${userName}的基本信息`"
        :leftBack="false"
        textWeight="bold"
        @headerRight="saveBtn"
        rightText="保存"
        textColor="#fff"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div class="dt-content" ref="wrap" v-for="(item,index) in userinfoList" :key="index">
      <div class="policyItem">
        <group class="policyLi">
          <div :ref="`${index}-customerAlias`">
            <x-input
              :max="7"
              :is-type="validateVal"
              :ref="`${index}-customerAliasIp`"
              title="姓名"
              placeholder="请填写姓名"
              @on-blur="validateStyle(index,...arguments)"
              v-model="item.customerAlias"
              required
            ></x-input>
          </div>
          <div class="vux-x-input weui-cell">
            <div class="weui-cell__hd">
              <label for="vux-x-input-sv5h0" class="weui-label">性别</label>
            </div>
            <span class="man" :class="item.gender == 1 ? 'active':'sex'" @click="sexChoose(1)">
              男
              <!-- <icon class="dt-icon icon-man" name="man"></icon> -->
              <img
                v-show="item.gender != 1"
                class="gender-icon"
                src="../../assets/imgs/man_c.png"
                alt
              >
              <img
                v-show="item.gender == 1"
                class="gender-icon"
                src="../../assets/imgs/man_d.png"
                alt
              >
            </span>
            <span class="woman" :class="item.gender == 2 ? 'active':'sex'" @click="sexChoose(2)">
              女
              <!-- <icon class="dt-icon icon-woman" name="woman"></icon> -->
              <img
                v-show="item.gender != 2"
                class="gender-icon"
                src="../../assets/imgs/woman_c.png"
                alt
              >
              <img
                v-show="item.gender == 2"
                class="gender-icon"
                src="../../assets/imgs/woman_d.png"
                alt
              >
            </span>
          </div>
          <div :ref="`${index}-birthday`" class="vux-x-input weui-cell ig-sr_item">
            <div class="weui-cell__hd">
              <label for="vux-x-input-sv5h0" class="weui-label">生日</label>
            </div>
            <calendarAlone
              :item="item"
              :index="index"
              @validateValue="validateValue(index,...arguments)"
              @transfervalue="conversionValue"
            ></calendarAlone>
          </div>
          <div class="phone-num-border-top" :ref="`${index}-elMobileNum`">
            <x-input
              :max="11"
              type="tel"
              :ref="`${index}-mobileNum`"
              title="手机号"
              placeholder="请输入手机号"
              is-type="china-mobile"
              v-model="item.phoneNumber"
            ></x-input>
          </div>
          <div class="phone-num-border-top" :ref="`${index}-elRemark`">
            <x-input
              :ref="`${index}-remark`"
              :max="20"
              :is-type="validateVal"
              @on-blur="validateStyle(index)"
              title="备注"
              placeholder="填写备注，方便您辨识客户"
              v-model="item.remark"
            ></x-input>
          </div>
        </group>
      </div>
      <div class="policyItem">
        <group class="policyLi">
          <popup-picker
            title="职业"
            show-name
            :data="vcardList"
            v-model="occupation"
            placeholder="请选择职业"
            value-text-align="left"
          ></popup-picker>
          <div v-for="(v,i) in item.customerAddressMoList" :key="i">
            <!-- <x-address class="address-select" :title="titleAddress" v-model="addressValue" raw-value :list="addressData" value-text-align="left" label-align="justify"></x-address> -->
            <div :ref="`${i}-address`">
              <x-address
                @on-hide="addressEnter(v,i,...arguments)"
                placeholder="请选择地址"
                class="address-select"
                :title="i == 0?'联系地址':'联系地址' + i"
                v-model="v.addressValue"
                :raw-value="false"
                :list="addressData"
                value-text-align="left"
                label-align="justify"
              ></x-address>
            </div>
            <div :ref="`${i}-addressDetailBox`">
              <x-textarea
                :ref="`${i}-addressDetail`"
                :max="30"
                @on-blur="addressDetailBlur(i,v.detailAddr)"
                class="address-textarea"
                :title="i == 0?'详细地址':'详细地址' + i"
                v-model="v.detailAddr"
                placeholder="填写详细地址，方便联系客户"
                :show-counter="false"
                :rows="3"
              ></x-textarea>
            </div>
            <div v-if="i != 0" class="handle-remove">
              <p @click="removeAddress(i)">
                <span>删除</span>
                <icon class="dt-icon remove1" name="remove1"></icon>
              </p>
            </div>
          </div>
        </group>
        <div @click="addAddressBtn" class="address-add">
          <icon class="dt-icon add2" name="add2"></icon>
          <span>新增地址</span>
        </div>
      </div>
    </div>
    <confirm v-model="comfirmShow" @on-confirm="delAddressBtn" title="提示">
      <p style="text-align:center">确认删除该地址吗？</p>
    </confirm>
    <confirm
      v-model="comfirmShowRepeat"
      confirm-text="是"
      cancel-text="否"
      @on-confirm="repeatEnter"
      title="已存在该客户"
    >
      <p style="text-align:center">是否将该客户加入到此家庭？</p>
    </confirm>
  </div>
</template>
<script>
import {
  XInput,
  Group,
  Datetime,
  XTextarea,
  Flexbox,
  FlexboxItem,
  ChinaAddressData,
  PopupPicker,
  XAddress,
  Confirm
} from "vux";
import api from "@/api/index";
import { scrollToElement, getDevice } from "@/config/utils.js";
import dtHeader from "@/components/dtHeader";
import calendarAlone from "@/components/calendarAlone";
export default {
  components: {
    XInput,
    Group,
    Datetime,
    XTextarea,
    dtHeader,
    Flexbox,
    FlexboxItem,
    PopupPicker,
    XAddress,
    calendarAlone,
    Confirm
  },
  data() {
    return {
      device: getDevice(),
      delAddressIndex: null,
      comfirmShow: false,
      comfirmShowRepeat: false,
      showDialogDel: false,
      userinfoList: [],
      repeatParam: {},
      userName: "",
      addressData: ChinaAddressData,
      vcardTempList: [],
      occupation: [],
      validateVal: val => {
        let reg = /^[\u4e00-\u9fa5a-zA-Z0-9\-_]+[\u4e00-\u9fa5a-zA-Z0-9\-_]*$/;
        return {
          valid: reg.test(val),
          msg: "只支持中英文、数字、下划线"
        };
      }
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
  computed: {
    // 格式化职业字典数据
    vcardList() {
      let tempArr = [[]];
      for (let item of this.vcardTempList) {
        tempArr[0].push({
          name: item.dictName,
          value: item.dictCode
        });
      }
      return tempArr;
    }
  },
  methods: {
    // 初始化数据
    async initData() {
      let vcardData = await api.occupationList({ parentCode: "1001" });
      this.vcardTempList = vcardData.data;
      let res = await api.customerFindByCustId({
        id: this.$route.query.id
      });
      this.userName = res.data.customerAlias;
      this.$set(this.userinfoList, 0, res.data);
      this.userinfoList[0].familyId = this.$route.query.familyId;
      if (this.userinfoList[0].birthday) {
        this.userinfoList[0].year = this.userinfoList[0].birthday.split("-")[0];
        this.userinfoList[0].month = this.userinfoList[0].birthday.split(
          "-"
        )[1];
        this.userinfoList[0].day = this.userinfoList[0].birthday.split("-")[2];
      }
      if (this.userinfoList[0].customerAddressMoList == null) {
        this.userinfoList[0].customerAddressMoList = [];
        this.$set(this.userinfoList[0].customerAddressMoList, 0, {
          addressValue: [],
          area: "",
          areaCode: "",
          city: "",
          cityCode: "",
          province: "",
          provinceCode: "",
          customerId: this.$route.query.id,
          detailAddr: ""
        });
      } else {
        for (let item of this.userinfoList[0].customerAddressMoList) {
          item.addressValue = [];
          if (
            !(
              item.provinceCode == "" ||
              item.cityCode == "" ||
              item.areaCode == ""
            )
          ) {
            item.addressValue.push(
              item.provinceCode,
              item.cityCode,
              item.areaCode
            );
          }
        }
      }
      if (this.userinfoList[0].occupation != null) {
        this.$set(this.occupation, 0, this.userinfoList[0].occupation);
        // this.occupation[0] = this.userinfoList[0].occupation;
      } else {
        this.occupation = [];
      }
      this.userinfoList[0].isCheck = 0;
    },
    // 性别选择切换
    sexChoose(v) {
      this.userinfoList[0].gender = v;
    },
    // 返回
    goBack() {
      let device = this.device;
      let from = this.$route.query.from;
      if (from == "home") {
        if (device == "android") {
          bmAndroid.goHomePage();
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.goHomePage.postMessage(null);
        }
      } else {
        this.$router.go(-1);
      }
    },
    /** 日期组件methods组件start */
    validateValue(i, data) {
      this.validateInput(data.index, data.item, data.value);
      let elBirthday = this.$refs[`${i}-birthday`][0];
      elBirthday.className = "vux-x-input weui-cell ig-sr_item";
    },
    validateInput(index, item, data) {
      let policyInfo = this.userinfoList;
      let validateObj = policyInfo[index];
      if (data) {
        validateObj.boolFlag = false;
      } else {
        validateObj.boolFlag = true;
      }
      var datetime = data.split("-");
      validateObj.year = datetime[0];
      validateObj.month = datetime[1];
      validateObj.day = datetime[2];
      if (validateObj.year && validateObj.month && validateObj.day) {
        validateObj.birthday =
          validateObj.year + "-" + validateObj.month + "-" + validateObj.day;
      }
      let obj = policyInfo[index];
      this.$set(policyInfo, index, obj);
    },
    conversionValue(data) {
      let policyInfo = this.userinfoList;
      let index = data.index;
      let calendarObj = policyInfo[index];
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
      let obj = policyInfo[index];
      if (calendarObj.year && calendarObj.month && calendarObj.day) {
        calendarObj.birthday =
          calendarObj.year + "-" + calendarObj.month + "-" + calendarObj.day;
      }
      this.$nextTick(() => {
        this.$set(policyInfo, index, obj);
      });
    },
    /** 日期组件methods组件end */
    // 新增地址
    addAddressBtn() {
      if (this.userinfoList[0].customerAddressMoList.length <= 6) {
        this.userinfoList[0].customerAddressMoList.push({
          addressValue: [],
          area: "",
          areaCode: "",
          city: "",
          cityCode: "",
          province: "",
          provinceCode: "",
          customerId: this.$route.query.id,
          detailAddr: ""
        });
      }
    },
    // 删除地址
    removeAddress(v) {
      this.delAddressIndex = v;
      this.comfirmShow = true;
    },
    // 删除地址
    delAddressBtn() {
      let addressId = this.userinfoList[0].customerAddressMoList[
        this.delAddressIndex
      ].customerAddressId;
      if (addressId) {
        this.userinfoList[0].deleteList = [];
        this.userinfoList[0].deleteList.push(addressId);
      }
      this.userinfoList[0].customerAddressMoList.splice(
        this.delAddressIndex,
        1
      );
      this.comfirmShow = false;
    },
    // 地址确认事件
    addressEnter(item, i, v) {
      if (v) {
        let elAddress = this.$refs[`${i}-address`][0];
        elAddress.className = "";
        item.provinceCode = item.addressValue[0];
        item.cityCode = item.addressValue[1];
        item.areaCode = item.addressValue[2];
        for (let temp of this.addressData) {
          if (item.provinceCode == temp.value) {
            item.province = temp.name;
          }
          if (item.cityCode == temp.value) {
            item.city = temp.name;
          }
          if (item.areaCode == temp.value) {
            item.area = temp.name;
          }
        }
      }
    },
    async saveBtn() {
      /** ----------------校验start----------------- */
      let temp = this.userinfoList;
      let addressList = temp[0].customerAddressMoList;
      for (let i = 0; i < temp.length; i++) {
        let elName = this.$refs[`${i}-customerAlias`][0];
        let name = this.$refs[`${i}-customerAliasIp`][0];
        let elBirthday = this.$refs[`${i}-birthday`][0];
        let elMobileNum = this.$refs[`${i}-elMobileNum`][0];
        let mobileNum = this.$refs[`${i}-mobileNum`][0];
        let elRemark = this.$refs[`${i}-elRemark`][0];
        let remark = this.$refs[`${i}-remark`][0];
        elName.className = "";
        elBirthday.className = "vux-x-input weui-cell ig-sr_item";

        if (name.valid == false || temp[i].customerAlias == "") {
          elName.className = "warn-title";
          name.focus();
          scrollToElement.call(this, elName, 200);
          this.$toast(name.firstError);
          return false;
        }

        if (temp[i].year == "" || temp[i].month == "" || temp[i].day == "") {
          elBirthday.className = "warn-title vux-x-input weui-cell ig-sr_item";
          // elBirthday.focus();
          scrollToElement.call(this, elBirthday, 200);
          this.$toast("请填写生日信息");
          return false;
        }

        if (mobileNum.valid == false) {
          mobileNum.focus();
          scrollToElement.call(this, elMobileNum, 200);
          this.$toast(mobileNum.firstError);
          return false;
        }

        if (remark.valid == false) {
          elRemark.className = "warn-title";
          remark.focus();
          scrollToElement.call(this, elRemark, 200);
          this.$toast(remark.firstError);
          return false;
        }

        for (let n = 0; n < addressList.length; n++) {
          let reg = /^[\u4e00-\u9fa5a-zA-Z0-9\-_]+[\u4e00-\u9fa5a-zA-Z0-9\-_]*$/;
          let elAddress = this.$refs[`${n}-address`][0];
          let elAddressDetail = this.$refs[`${n}-addressDetailBox`][0];
          let AddressDetail = this.$refs[`${n}-addressDetail`][0];
          if (
            addressList[n].detailAddr != "" &&
            addressList[n].provinceCode == ""
          ) {
            elAddress.className = "warn-title";
            scrollToElement.call(this, elAddress, 200);
            this.$toast("请选择省市区");
            return false;
          }
          if (
            reg.test(addressList[n].detailAddr) == false &&
            addressList[n].detailAddr != ""
          ) {
            elAddressDetail.className = "warn-title";
            AddressDetail.focus();
            scrollToElement.call(this, elAddressDetail, 200);
            this.$toast("只支持中英文、数字、下划线");
            return false;
          }
        }
      }
      /** ----------------校验end----------------- */

      this.userinfoList[0].occupation = this.occupation[0];
      let res = await api.updateCustomer(this.userinfoList[0]);
      if (res.status == 6666) {
        this.repeatParam = res.data;
        this.comfirmShowRepeat = true;
        return;
      } else {
        if (res.status == 1) {
          this.$toast("保存成功");
          setTimeout(() => {
            this.goBack();
          }, 900);
        } else {
          this.$alert(res.msg);
          return false;
        }
      }
    },
    // 保存时重复确认
    async repeatEnter() {
      let res = await api.updateCustomer(this.repeatParam);
      if (res.status == 1) {
        this.$toast("保存成功");
        // this.$router.go(-1);
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    // 校验样式切换
    validateStyle(i, v) {
      let elName = this.$refs[`${i}-customerAlias`][0];
      let elRemark = this.$refs[`${i}-elRemark`][0];
      let remark = this.$refs[`${i}-remark`][0];
      if (v != "") {
        elName.className = "";
      }
      if (remark.valid) {
        elRemark.className = "";
      }
    },

    // 地址详情样式校验切换
    addressDetailBlur(i, v) {
      let el = this.$refs[`${i}-addressDetailBox`][0];
      let reg = /^[\u4e00-\u9fa5a-zA-Z0-9\-_]+[\u4e00-\u9fa5a-zA-Z0-9\-_]*$/;
      if (reg.test(v) || v == "") {
        el.className = "";
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

.family-edit-userinfo {
  background: #f8f8f8;
  color: #222222;
  .vux-popup-picker-placeholder {
    font-size: 14px;
  }

  .weui-cell__bd {
    input::-webkit-input-placeholder {
      font-size: 14px;
    }
    textarea::-webkit-input-placeholder {
      font-size: 14px;
    }
  }
  .vux-cell-value {
    color: #333;
  }
  .weui-dialog__btn_primary {
    color: #0bb20c !important;
  }
  .weui-dialog__btn_default {
    color: #353535 !important;
  }
  .dt-content {
    overflow: auto;
    padding: 20px;
    -webkit-overflow-scrolling: touch;
  }

  .weui-cell:before {
    left: 10px;
    right: 10px;
  }

  .vux-cell-box:not(:first-child):before {
    width: 93%;
  }
  .policyItem {
    background: #fff;
    border: 2px #dedede solid;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0px 3px 13px 0px rgba(0, 0, 0, 0.03);
    .address-add {
      text-align: center;
      font-size: 30px;
      padding: 10px 0 50px 0;
      .add2 {
        width: 44px;
        height: 44px;
        color: #28c76a;
        vertical-align: bottom;
      }
    }
  }
  .ipt {
    width: 48px;
    height: 48px;
    padding-right: 20px;
    display: block;
  }
  .itemIpt .weui-cell {
    padding: 10px 8px;
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
    border-bottom: 0px #dedede solid;
  }
  .weui-cells:before {
    border-top: none;
  }

  .weui-btn_plain-default:not(.weui-btn_plain-disabled):active {
    color: #fff;
  }
  .weui-input::-webkit-input-placeholder {
    color: #959494;
    font-size: 14px;
  }

  .fm-btn {
    margin-top: 40px;
  }
  .warn-title .weui-cell__hd {
    color: #f00;
  }
  .ig-sr_item {
    padding: 10px 15px;
    .weui-cell {
      padding: 0px;
    }
    .weui-cell:before {
      border: none;
    }
    .weui-cell__bd .weui-input {
      text-align: center;
    }
    .calendar {
      padding-right: 20px;
      color: #28c76a;
    }
    .vux-datetime {
      position: absolute;
      right: 0;
      top: 5px;
    }
    .calendar-content {
      > a {
        padding: 5px;
        right: 8px;
      }
    }
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
    font-size: 30px;
    .man {
      margin-right: 100px;
    }
    .gender-icon {
      margin-left: 20px;
      width: 40px;
      // height: 40px;
      vertical-align: -10px;
    }
    .pd10 {
      padding: 10px 12px;
    }
    .sex {
      color: #999;
      font-size: 28px;
    }
    .icon-man {
      color: #999;
      margin-left: 35px;
      margin-right: 90px;
    }
    .icon-woman {
      color: #999;
      margin-left: 35px;
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
    .address-select {
      .weui-cell {
        border-top: 1px solid #eee;
        padding: 10px 5px !important;
        margin: 0px 10px;
      }
    }
    .address-textarea {
      textarea {
        box-sizing: border-box;
        padding: 22px 20px;
        border: 2px solid #dedede;
        border-radius: 20px;
      }
    }
    .handle-remove {
      height: 100px;
      line-height: 100px;
      font-size: 32px;
      color: #333;
      padding: 0 30px;
      p {
        float: right;
      }
      .remove1 {
        width: 46px;
        height: 46px;
        color: #28c76a;
        vertical-align: -12px;
      }
    }
    .handle-remove.weui-cell {
      display: inherit;
    }
  }
}
//

</style>
