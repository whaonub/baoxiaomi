<template>
  <div class="dt-pages edit-family-peoples">
    <div class="dt-header">
      <dtHeader
        :title="headerTitle"
        textColor="#fff"
        textWeight="bold"
        @headerRight="saveBtn"
        rightText="保存"
        :leftBack="false"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div>
      <x-dialog v-model="showDialog1" class="dialog-demo">
        <div class="dialog-save">
          <h5>是否将保单添加至已有家庭？</h5>
          <flexbox :gutter="0">
            <flexbox-item>
              <x-button @click.native="addFamilyBtn(1)" type="primary">新建家庭</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button @click.native="addFamilyBtn(2)" type="primary">
                添加至
                <span class="name-weight">{{familyName}}</span>
              </x-button>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="close-icon" @click="showDialog1=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
      <x-dialog v-model="showDialog2" class="dialog-demo">
        <div class="dialog-save">
          <h5>
            是否将成员
            <span style="color: #feb028">{{repeatPeoples}}</span>
            添加到该家庭？
          </h5>
          <flexbox :gutter="0">
            <flexbox-item>
              <x-button type="primary" class="cancel" @click.native="cancelBtn">取消</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button @click.native="repeatPeoplesEnter" type="primary">确定</x-button>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="close-icon" @click="showDialog2=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
      <x-dialog v-model="showDialogDelMain" class="dialog-demo dialog-dels">
        <div class="dialog-save">
          <div class="del-select">
            <h5>若删除家庭主联系人，请重新指定家庭主联系人：</h5>
            <ul class="radio">
              <li
                v-if="index != 0 && item.customerAlias != ''"
                v-for="(item,index) in customerSaveVoList"
                :key="index"
                @click="radioChange(index)"
              >
                <span>{{item.customerAlias}}</span>
                <icon class="dt-icon round" :name="radioIndex == index?'select3':'round'"></icon>
              </li>
            </ul>
          </div>
          <flexbox :gutter="0">
            <flexbox-item>
              <x-button type="primary" class="cancel" @click.native="showDialogDelMain=false">取消</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button
                @click.native="showDialogunbind = true,showDialogDelMain=false"
                type="primary"
              >删除</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </x-dialog>
      <x-dialog v-model="showDialogunbind" class="dialog-demo dialog-dels">
        <div class="dialog-save">
          <h5>如果更换新的主联系人，将解除已绑定的托管关系。</h5>
          <flexbox :gutter="0">
            <flexbox-item>
              <x-button type="primary" class="cancel" @click.native="showDialogunbind=false">取消</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button @click.native="delPeopleMainBtn" type="primary">确定</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </x-dialog>
      <x-dialog v-model="showDialogDel" class="dialog-demo dialog-dels">
        <div class="dialog-save">
          <h5>若删除家庭成员将删除其保单，是否删除该家庭成员？</h5>
          <flexbox :gutter="0">
            <flexbox-item>
              <x-button type="primary" class="cancel" @click.native="showDialogDel=false">取消</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button @click.native="delPeopleBtn" type="primary">删除</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </x-dialog>
      <x-dialog v-model="showDialogDelFamily" class="dialog-demo dialog-dels">
        <div class="dialog-save">
          <h5>家庭成员不能为空，您是否想删除整个家庭？</h5>
          <flexbox :gutter="0">
            <flexbox-item>
              <x-button type="primary" class="cancel" @click.native="consider">考虑一下</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button @click.native="delFamilyBtn" type="primary">删除家庭</x-button>
            </flexbox-item>
          </flexbox>
        </div>
      </x-dialog>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="policyItem" v-for="(item,index) in customerSaveVoList" :key="index">
        <group class="policyLi">
          <div class="main-title">
            <span>{{item.isMain?'家庭主联系人':'家庭成员'}}</span>
            <icon @click.native="clientBtn(index,item)" class="dt-icon client" name="client"></icon>
            <!-- <span @click="clientBtn" class="client-list">从客户列表中选择</span> -->
          </div>
          <div :ref="`${index}-customerAlias`">
            <x-input
              :ref="`${index}-customerAliasIp`"
              :max="7"
              :is-type="validateVal"
              title="姓名"
              placeholder="请输入姓名"
              @on-blur="validateStyle(index,...arguments)"
              v-model="item.customerAlias"
              class="lh-100 name"
              required
            ></x-input>
          </div>
          <div class="vux-x-input weui-cell lh-100">
            <div class="weui-cell__hd">
              <label for="vux-x-input-sv5h0" class="weui-label">性别</label>
            </div>
            <span
              class="man"
              :class="item.gender == 1 ? 'active':'sex'"
              @click="sexChoose(1,index)"
            >
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
            <span
              class="woman"
              :class="item.gender == 2 ? 'active':'sex'"
              @click="sexChoose(2,index)"
            >
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
          <div :ref="`${index}-birthday`" class="vux-x-input weui-cell sr_item lh-100">
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
              v-model="item.phoneNumber"
              :max="11"
              is-type="china-mobile"
              type="tel"
              :ref="`${index}-mobileNum`"
              title="手机号"
              placeholder="请填写手机号"
              class="lh-100"
            ></x-input>
          </div>
          <div class="phone-num-border-top" :ref="`${index}-elRemark`">
            <x-input
              :ref="`${index}-remark`"
              title="备注"
              :max="20"
              :is-type="validateVal"
              @on-blur="validateStyle(index)"
              v-model="item.remark"
              placeholder="填写备注，方便您辨识客户"
              class="lh-100"
            ></x-input>
          </div>
          <div class="handle-remove weui-cell">
            <p @click="removePeople(index)">
              <span>删除</span>
              <icon class="dt-icon remove1" name="remove1"></icon>
            </p>
          </div>
        </group>
      </div>
      <familys-popup
        :showDialog="showDialog3"
        :initData="familysPopupData"
        @closePopup="closePopup"
        @enter="enterPopup"
      ></familys-popup>
      <x-button @click.native="addPeoplesBtn" class="policyItem add-people">
        <icon class="dt-icon add2" name="add2"></icon>新增成员
      </x-button>
    </div>
  </div>
</template>
<script>
import {
  XInput,
  Group,
  XButton,
  Datetime,
  XTextarea,
  Flexbox,
  FlexboxItem,
  XDialog
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import familysPopup from "@/components/familysPopup";
import { scrollToElement, getDevice } from "@/config/utils.js";
import calendarAlone from "@/components/calendarAlone";
export default {
  name: "editFamilyPeoples",
  components: {
    XInput,
    Group,
    XButton,
    Datetime,
    XTextarea,
    Flexbox,
    FlexboxItem,
    dtHeader,
    XDialog,
    familysPopup,
    calendarAlone
  },
  data() {
    return {
      device: getDevice(),
      customerSaveVoList: [],
      familysPopupData: [],
      familyName: "",
      familyId: "",
      headerTitle: "",
      showDialog1: false,
      showDialogDelFamily: false,
      showDialogDelMain: false,
      showDialogunbind: false,
      showDialog2: false,
      showDialog3: false,
      showDialogDel: false,
      delIndex: null,
      radioIndex: null,
      familyUUID: null,
      listIndex: null,
      repeatPeoples: "",
      deleteCustomerList: [],
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
  activated() {
    if (Object.keys(this.customerData).length > 0) {
      this.customerSaveVoList[
        this.listIndex
      ].customerAlias = this.customerData.customerAlias;
      this.customerSaveVoList[this.listIndex].gender = this.customerData.gender;
      this.customerSaveVoList[
        this.listIndex
      ].birthday = this.customerData.birthday;
      this.customerSaveVoList[
        this.listIndex
      ].phoneNumber = this.customerData.phoneNumber;
      this.customerSaveVoList[this.listIndex].remark = this.customerData.remark;
      this.customerSaveVoList[
        this.listIndex
      ].customerListId = this.customerData.customerId;
    }
  },
  computed: {
    customerData() {
      return this.$store.state.customerData;
    }
  },
  methods: {
    // 初始化
    async initData() {
      if (this.$route.query.type == "add") {
        this.headerTitle = "新建家庭";
        this.resetData();
      } else {
        await this.getListData();
        this.headerTitle = "编辑家庭成员";
        this.dateInit();
        this.deleteCustomerList = [];
      }
    },
    // 初始化获取数据
    async getListData() {
      let res = await api.familyFindById({
        id: this.$route.query.id
      });
      this.familyId = res.data.familyId;
      this.customerSaveVoList = res.data.customerList;
    },
    // 重置表单数据
    resetData() {
      this.customerSaveVoList = [
        {
          birthday: "",
          customerAlias: "",
          customerId: "",
          gender: 1,
          isMain: 1,
          phoneNumber: "",
          year: "",
          month: "",
          day: "",
          remark: ""
        }
      ];
    },
    // 初始化时间
    dateInit() {
      for (let item of this.customerSaveVoList) {
        item.year = item.birthday.split("-")[0];
        item.month = item.birthday.split("-")[1];
        item.day = item.birthday.split("-")[2];
      }
    },
    // 性别切换
    sexChoose(v, i) {
      this.customerSaveVoList[i].gender = v;
    },
    // 返回
    goBack() {
      this.$router.go(-1);
      this.$store.commit("saveCustomerData", {});
    },
    // 保存校验
    async saveBtn(val) {
      /** ----------------校验start----------------- */
      let temp = this.customerSaveVoList;
      for (let i = 0; i < temp.length; i++) {
        let elName = this.$refs[`${i}-customerAlias`][0];
        let name = this.$refs[`${i}-customerAliasIp`][0];
        let elBirthday = this.$refs[`${i}-birthday`][0];
        let elMobileNum = this.$refs[`${i}-elMobileNum`][0];
        let mobileNum = this.$refs[`${i}-mobileNum`][0];
        let elRemark = this.$refs[`${i}-elRemark`][0];
        let remark = this.$refs[`${i}-remark`][0];
        elName.className = "";
        elBirthday.className = "vux-x-input weui-cell sr_item lh-100";
        if (name.valid == false || temp[i].customerAlias == "") {
          elName.className = "warn-title";
          name.focus();
          scrollToElement.call(this, elName, 200);
          this.$toast(name.firstError);
          return false;
        }
        if (temp[i].year == "" || temp[i].month == "" || temp[i].day == "") {
          elBirthday.className =
            "warn-title vux-x-input weui-cell sr_item lh-100";
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
      }
      /** ----------------校验end----------------- */
      if (this.$route.query.type == "add") {
        let res = await api.saveByFamilyList({
          inputType: 1,
          customerSaveVoList: this.customerSaveVoList
        });
        if (res.status == 1) {
          this.$toast(res.msg);
          setTimeout(() => {
            this.$router.go(-1);
          }, 900);
        } else {
          this.$alert(res.msg);
          return;
        }
      } else if (this.$route.query.type == "edit") {
        let resData = await api.editCheckFamilyMen({
          familyId: this.$route.query.id,
          familyVos: this.customerSaveVoList,
          deleteIds: this.deleteCustomerList
        });
        if (resData.status == 1) {
          if (resData.data == null) {
            this.$toast("保存成功");
            setTimeout(() => {
              this.$router.go(-1);
            }, 900);
          } else {
            this.familyUUID = resData.data.uuid;
            this.repeatPeoples = resData.data.name;
            this.showDialog2 = true;
          }
        } else {
          this.$alert(resData.msg);
          return;
        }
      }
    },
    radioChange(index) {
      this.radioIndex = index;
    },
    // 删除成员操作
    removePeople(i) {
      if (i == 0) {
        if (this.customerSaveVoList.length == 1) {
          if (this.$route.query.type == "add") {
            this.showDialogDel = true;
          } else {
            this.showDialogDelFamily = true;
          }
        } else {
          this.radioIndex = 1;
          this.showDialogDelMain = true;
        }
      } else {
        this.showDialogDel = true;
      }
      this.delIndex = i;
    },
    // 删除成员paramList
    deleteLogic() {
      let cusId = this.customerSaveVoList[this.delIndex].customerId;
      if (cusId) {
        this.deleteCustomerList.push(cusId);
      }
    },
    // 删除成员
    delPeopleBtn() {
      this.deleteLogic();
      this.customerSaveVoList.splice(this.delIndex, 1);
      this.showDialogDel = false;
    },
    // 删除家庭主联系人操作
    delPeopleMainBtn() {
      this.deleteLogic();
      this.customerSaveVoList[this.radioIndex].isMain = 1;
      this.customerSaveVoList.splice(
        this.delIndex,
        1,
        this.customerSaveVoList[this.radioIndex]
      );
      this.customerSaveVoList.splice(this.radioIndex, 1);
      this.showDialogunbind = false;
    },
    // 关闭弹窗
    closePopup(v) {
      this.showDialog3 = v;
    },
    // pop组件确认
    async enterPopup(v) {
      let paramObj = {
        uuid: this.familyUUID
      };
      if (v.familyId) {
        paramObj.familyId = v.familyId;
      }
      let res = await api.familySave(paramObj);
      this.showDialog3 = false;
      this.$router.go(-1);
    },
    // 进入客户列表
    clientBtn(i, v) {
      this.listIndex = i;
      this.$store.commit("saveCustomerData", {});
      this.$router.push({
        path: "/clientList",
        query: {
          customerId: v.customerListId || v.customerId
        }
      });
    },
    // 新增成员
    addPeoplesBtn() {
      if (this.customerSaveVoList.length == 0) {
        this.customerSaveVoList.push({
          birthday: "",
          customerAlias: "",
          customerId: "",
          gender: 1,
          isMain: 1,
          phoneNumber: "",
          // year: "",
          // month: "",
          // day: "",
          remark: "",
          customerListId: ""
        });
      } else {
        this.customerSaveVoList.push({
          birthday: "",
          customerAlias: "",
          customerId: "",
          gender: 1,
          isMain: 0,
          phoneNumber: "",
          year: "",
          month: "",
          day: "",
          remark: "",
          customerListId: ""
        });
      }
    },
    // 日期组件所需方法start----------------
    validateValue(i, data) {
      this.validateInput(data.index, data.item, data.value);
      let elBirthday = this.$refs[`${i}-birthday`][0];
      elBirthday.className = "vux-x-input weui-cell sr_item lh-100";
    },
    validateInput(index, item, data) {
      let policyInfo = this.customerSaveVoList;
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
      let policyInfo = this.customerSaveVoList;
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
    // 日期组件所需方法end--------------------
    // 有重复成员时新建\添加至 操作
    async addFamilyBtn(v) {
      let res;
      if (v == 1) {
        res = await api.familySave({
          uuid: this.familyUUID
        });
        this.showDialog1 = false;
      } else if (v == 2) {
        res = await api.familySave({
          familyId: this.familyId,
          uuid: this.familyUUID
        });
        this.showDialog1 = false;
      }
      if (res.status == 1) {
        this.$router.go(-1);
      } else {
        this.$alert(res.msg);
        return false;
      }
    },
    // 取消删除缓存
    async cancelBtn() {
      this.showDialog2 = false;
      await api.deleteRedis({ id: this.familyUUID });
    },
    // 有重复成员时确认
    async repeatPeoplesEnter() {
      let res = await api.updateFamilyPeoples({ id: this.familyUUID });
      this.showDialog2 = false;
      this.$router.go(-1);
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
    // 考虑一下
    consider() {
      this.showDialogDelFamily = false;
      this.$router.go(-1);
    },
    // 删除整个家庭
    async delFamilyBtn() {
      this.showDialogDelFamily = false;
      let res = await api.familyDelete({
        id: this.familyId
      });
      if (res.status == 1) {
        this.$router.push({
          path: "/familyListIndex",
          query: {
            from: "editFamilyPeoples"
          }
        });
      } else {
        this.$alert(res.msg);
        return;
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

.edit-family-peoples {
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
  .warn-title .weui-cell__hd {
    color: #f00;
  }
  .dialog-dels {
    h5 {
      text-align: left;
      font-size: 30px !important;
      margin-bottom: 40px !important;
    }
  }
  .cancel {
    background-color: #bfbfbf !important;
  }
  .weui-dialog {
    border-radius: 8px;
  }
  .dialog-save {
    padding: 30px 20px;
    .name-weight {
      font-size: 36px;
    }
    h5 {
      margin-top: 30px;
      margin-bottom: 70px;
      color: #333;
      font-size: 34px;
      padding: 0 16px;
    }
    button {
      width: 240px;
      height: 80px;
      font-size: 30px;
    }
    .weui-btn_primary {
      background-color: #28c76a;
      font-weight: bold;
    }
    .del-select {
      margin-top: 30px;
      margin-bottom: 30px;
      > h5 {
        margin-bottom: 0px !important;
      }
      .radio {
        text-align: left;
        width: 490px;
        margin: 10px auto;
        overflow: auto;
        max-height: 50vh;
        > li {
          padding: 0 30px;
          line-height: 80px;
        }
        span {
          font-size: 30px;
          color: #666;
        }
        .round {
          width: 28px;
          height: 28px;
          float: right;
          margin-top: 26px;
        }
      }
      button {
        width: 100%;
      }
    }
  }
  .close-icon {
    display: inline-block;
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .dt-content {
    padding: 20px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .policyItem {
      background: #fff;
      border: 2px #dedede solid;
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: 0px 3px 13px 0px rgba(0, 0, 0, 0.03);
    }
    .add-people {
      border: none;
      line-height: 110px;
      text-align: center;
      font-size: 30px;
      color: #222;
      .add2 {
        width: 44px;
        height: 44px;
        color: #28c76a;
      }
    }
  }
  .lh-100 {
    line-height: 100px;
    box-sizing: border-box;
  }
  .lh-100.weui-cell {
    padding-top: 0;
    padding-bottom: 0;
  }
  .weui-cells {
    background: transparent;
    margin-top: 0;
  }
  .weui-cell:before {
    left: 10px;
    right: 10px;
  }
  .sr_item {
    font-size: 28px;
    padding: 12px 26px;
    line-height: 84px;

    .sr_fr {
      padding-left: 0 !important;
    }
    .weui-cell {
      padding: 5px;
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
      top: 10px;
    }
    .calendar-content {
      > a {
        padding-right: 0;
        right: 26px;
      }
    }
  }
  .weui-cell__hd {
    width: 83px;
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
    .name::before {
      border: none;
    }
    .main-title {
      line-height: 100px;
      background-color: #ebfdf2;
      font-size: 32px;
      color: #333;
      padding: 0 30px;
      .client {
        width: 40px;
        height: 40px;
        float: right;
        margin-top: 28px;
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
      }
    }
    .handle-remove.weui-cell {
      display: inherit;
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
  }
}
</style>
