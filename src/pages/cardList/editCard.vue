<template>
  <div class="dt-pages card-editCard-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader
        title="编辑页面"
        rightText="保存"
        :leftBack="false"
        @headerRight="edit"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div class="dt-content">
      <div class="contten-edit">
        <div class="card-content">
          <div class="photo-data" @click="photoWall">
            <div class="photo">照片墙</div>
            <div class="photo-img">
              <img v-if="agentData.picWall" :src="agentData.picWall">
            </div>
            <div v-if="!agentData.picWall" class="photo-text">用于动态页背景</div>
            <icon class="dt-icon rightPhoto" @click="photoWall" name="goxia"></icon>
          </div>
          <div class="greed">
            <div class="portrait-data">
              <div class="portrait">头像</div>
              <div class="portrait-img" @click="porTraitLIst()">
                <img v-if="agentData.photoUrl" :src="agentData.photoUrl">
                <img v-if="!agentData.photoUrl" src="../../assets/imgs/name-my.jpg">
              </div>
              <icon class="dt-icon rightPhoto" name="goxia"></icon>
            </div>
            <div class="input-data">
              <x-input
                type="text"
                v-model="agentData.cardName"
                :max="11"
                title="姓名"
                @on-blur="inputBlur('name',...arguments)"
                :show-clear="false"
              ></x-input>
            </div>
            <div class="input-data">
              <x-input
                type="text"
                v-model="agentData.sign"
                :max="50"
                title="签名"
                @on-blur="inputBlur('sign',...arguments)"
                :show-clear="false"
              ></x-input>
            </div>
            <div class="portrait-data input-data-nb">
              <div class="portrait">从业年限</div>
              <div class="portrait-tltle">
                <div class="title">{{yeadr}}</div>
                <datetime
                  v-model="tiem"
                  :default-selected-value="agentData.workYears"
                  @on-confirm="tiemYears"
                  clear-text="入行时间"
                  style="opacity: 0;"
                  class="selec-tilte"
                  start-date="1900-01-01"
                  :end-date="endDate"
                  format="YYYY-MM-DD"
                  year-row="{value}年"
                  month-row="{value}月"
                  day-row="{value}日"
                ></datetime>
              </div>
              <icon class="dt-icon rightPhoto" name="goxia"></icon>
            </div>
          </div>
          <div class="greed">
            <div class="portrait-data" @click="companyData">
              <div class="portrait">保险公司</div>
              <div class="portrait-tltle">
                <div class="title">{{agentData.companyName}}</div>
              </div>
              <icon class="dt-icon rightPhoto" name="goxia"></icon>
            </div>
            <div class="input-data input-data-nb">
              <x-input
                type="text"
                :max="10"
                v-model="agentData.position"
                title="职位"
                @on-blur="inputBlur('position',...arguments)"
                :show-clear="false"
              ></x-input>
            </div>
          </div>
          <div class="greed">
            <div class="input-data">
              <x-input
                type="tel"
                :max="11"
                v-model="agentData.phoneNumber"
                title="手机号"
                @on-blur="inputBlur('tel',...arguments)"
                :show-clear="false"
              ></x-input>
            </div>
            <div class="input-data">
              <x-input
                type="text"
                :max="20"
                :value="agentData.wxNumber"
                title="微信号"
                @on-blur="inputBlur('wx',...arguments)"
                :show-clear="false"
              ></x-input>
            </div>
            <div class="input-data">
              <x-input
                type="text"
                v-model="agentData.address"
                title="地址"
                class="address"
                :show-clear="false"
              >
                <span slot="right" class="edit-address" @click="searchLocation">
                  <img src="../../assets/imgs/edit-address.png">
                </span>
              </x-input>
            </div>
            <div class="input-data input-data-nb">
              <x-input type="text" title="邮箱" v-model="agentData.agentEmail" :show-clear="false"></x-input>
            </div>
          </div>
          <div class="greed mar-butoom">
            <div class="portrait-data" @click="addHonor">
              <div class="portrait">标签展示</div>
              <div class="edit-label">
                <span
                  class="label"
                  v-for="(item,index) in agentData.tags"
                  :key="index"
                  :class="index==1?'label1':index==2?'label2':''"
                >{{item.tagLable}}</span>
              </div>
              <div class="portrait-auto">
                <icon class="dt-icon rightPhoto" name="goxia"></icon>
              </div>
            </div>
            <div class="honor-data" v-for="(item,index) in  agentData.honors" :key="index">
              <flexbox>
                <flexbox-item>
                  <div class="honor">
                    <span v-if="index == 0">所获荣誉</span>
                  </div>
                </flexbox-item>
                <flexbox-item>
                  <div class="edit-honor">
                    <input class="homor-input" maxlength="20" v-model="item.str">
                  </div>
                </flexbox-item>
                <flexbox>
                  <div @click="delHonor(index)">
                    <icon class="dt-icon rightdel" name="del"></icon>
                  </div>
                </flexbox>
              </flexbox>
            </div>
            <div class="honor-data">
              <div class="honor">
                <span v-if="honorsNum ==0">所获荣誉</span>
              </div>
              <div @click="addHonorList" :class="honorsNum !=0?'edit-honor':'edit-honor1'">
                <span class="honor">添加荣誉</span>
                <i class="add6"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  XInput,
  Group,
  Cell,
  Selector,
  Flexbox,
  FlexboxItem,
  Datetime,
  dateFormat,
  Actionsheet,
  TransferDom
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils";
import { constants } from "zlib";
export default {
  directives: {
    TransferDom
  },
  name: "editCard",
  components: {
    dtHeader,
    XInput,
    Group,
    Cell,
    Selector,
    Flexbox,
    FlexboxItem,
    Datetime,
    dateFormat,
    Actionsheet
  },
  data() {
    return {
      index: "",
      tiem: "",
      agentData: {
        honors: []
      },
      originalData: {},
      yeadr: "",
      honors: [],
      device: getDevice(),
      img: "",
      honorsNum: 0,
      baseImg: "data:image/jpeg;base64,",
      locationList: []
    };
  },
  created() {
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
    window.updatePolicyPage = function() {};
  },
  activated() {
    let _this = this;
    if (this.$store.state.positionData) {
      this.locationList = this.$store.state.position;
      this.agentData.address = this.$store.state.positionData.newPoiName;
      this.$store.state.positionData = null;
    }
    if (this.$store.state.company) {
      this.agentData = this.$store.state.agentData;
      this.agentData.companyId = this.$store.state.company.companyId;
      this.agentData.companyName = this.$store.state.company.companyFullName;
      this.agentData.companyShortName = this.$store.state.company.companyName;
    }
    //拍照回调
    window.upLoadCameraImage = function(base64Url) {
      let data;
      data = JSON.parse(base64Url);
      _this.saveImg(data);
    };
  },
  computed: {
    endDate() {
      let d = new Date();
      return dateFormat(d, "YYYY-MM-DD");
    }
  },
  mounted() {
    let _this = this;
    if (this.$store.state.agentData != null) {
      this.agentData = this.$store.state.agentData;
      this.originalData = JSON.parse(
        JSON.stringify(this.$store.state.agentData)
      );
      if (this.agentData.honors != null) {
        this.honorsNum = this.agentData.honors.length;
      } else {
        this.agentData.honors = [];
      }
      if (
        this.agentData.workYears != "" &&
        this.agentData.workYears != undefined
      ) {
        let now = new Date(this.agentData.workYears.replace(/-/g, "/"));
        let year = new Date().getFullYear() - now.getFullYear();
        let month = new Date().getMonth() - now.getMonth();
        let hours = new Date().getHours() - now.getHours();
        console.log(year);
        if (year < 1) {
          this.yeadr = 1 + "年内";
        } else if (month < 0 || hours < 0) {
          this.yeadr = year + 1 + "年";
        } else {
          this.yeadr = year + "年";
        }
      }
    } else {
      if (this.$store.state.app_token != "") {
        this.initData();
      }
    }
  },
  methods: {
    addHonorList() {
      if (this.agentData.honors.length < 10) {
        this.agentData.honors.push({ str: "" });
        if (this.agentData.honors) {
          this.honorsNum = this.agentData.honors.length;
        }
      } else {
        this.$toast("荣誉最多可以输入10条");
      }
    },
    inputBlur(type, data) {
      if (type == "wx") {
        this.agentData.wxNumber = data;
      }
    },
    async initData() {
      let results = await api.getAgentCard();
      if (results.status == 1) {
        this.agentData = results.data;
        this.originalData = JSON.parse(JSON.stringify(results.data));
        this.$store.commit("getAgentData", results.data);
        if (this.agentData.honors) {
          this.honorsNum = this.agentData.honors.length;
        }
        if (
          this.agentData.workYears != "" &&
          this.agentData.workYears != undefined
        ) {
          let now = new Date(this.agentData.workYears.replace(/-/g, "/"));
          let year = new Date().getFullYear() - now.getFullYear();
          let month = new Date().getMonth() - now.getMonth();
          let hours = new Date().getHours() - now.getHours();
          if (year < 1) {
            this.yeadr = 1 + "年内";
          } else if (month < 0 || hours < 0) {
            this.yeadr = year + 1 + "年";
          } else {
            this.yeadr = year + "年";
          }
        }
      }
    },
    async saveImg(val) {
      let results = await api.ossUploadBase64Public({
        base64Images: val,
        dir: "cardhead",
        name: "abc.jpg"
      });
      if (results.status == 1) {
        this.agentData.photoUrl = results.data[0];
        this.$store.state.agentData.photoUrl = results.data[0];
      }
    },
    addHonor() {
      this.$store.commit("getAgentData", this.agentData);
      this.$router.push({
        path: "/showHonor",
        query: {}
      });
    },
    companyData() {
      this.$store.commit("getAgentData", this.agentData);
      this.$router.push({
        path: "/companyList",
        query: {
          from: "card"
        }
      });
    },
    porTraitLIst() {
      let device = this.device;
      this.showCameraType = 1;
      if (device == "android") {
        bmAndroid.showCamera(2, -1);
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.showCamera.postMessage({
          type: 2,
          value: -1
        });
      }
    },
    async edit() {
      let regPhone = /^(0|86)?(13[0-9]|15[012356789]|17[01235678]|18[0-9]|14[579]|19[89]|16[6])[0-9]{8}$/; //手机
      if (
        this.agentData.phoneNumber != "" &&
        this.agentData.phoneNumber != null
      ) {
        if (!regPhone.test(this.agentData.phoneNumber)) {
          this.$toast("请输入正确的手机号");
          return false;
        }
      }
      if (
        this.agentData.agentEmail != "" &&
        this.agentData.agentEmail != null
      ) {
        if (
          !/^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/.test(
            this.agentData.agentEmail
          )
        ) {
          this.$toast("请输入正确的邮箱号码");
          return false;
        }
      }

      if (this.agentData.agentEmail == "") {
        this.agentData.agentEmail = null;
      }
      var reg = /[-_a-zA-Z0-9]{5,19}$/;
      if (this.agentData.wxNumber) {
        if (!reg.test(this.agentData.wxNumber)) {
          this.$toast("微信号只支持6—20个字母、数字、下划线和减号组成");
          return false;
        }
      }
      let agentData = this.agentData;
      for (var p in agentData) {
        if (typeof agentData[p] == "string") {
          agentData[p] = agentData[p].replace(/(^\s*)|(\s*$)/g, "");
        }
      }
      if (this.agentData.cardName == "") {
        this.$toast("请输入姓名");
        return false;
      }
      if (this.agentData.cardName && this.agentData.cardName.length <= 1) {
        this.$toast("请输入正确的姓名");
        return false;
      }
      if (this.agentData.phoneNumber == "") {
        this.agentData.phoneNumber = null;
        this.$toast("请输入手机号");
        return false;
      }
      let results = await api.getUpdateAgentCard(this.agentData);
      if (results.status == 1) {
        let device = this.device;
        let from = this.$route.query.from;
        if (from) {
          this.$router.go(-1);
        } else if (device == "android") {
          bmAndroid.goHomePage();
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.goHomePage.postMessage(null);
        }
      } else {
        this.$toast(results.msg);
      }
    },
    tiemYears(val) {
      this.agentData.workYears = val;
      if (val) {
        let years = val.split("-")[0];
        let month = val.split("-")[1];
        let date = new Date();
        let dateYears = date.getFullYear();
        let dateMonth = date.getMonth() + 1;
        let nYears = dateYears - years;
        let workYears;
        if (nYears == 0) {
          workYears = 1 + "年内";
        }
        if (nYears > 0 && dateMonth - month >= 0) {
          workYears = nYears + 1 + "年";
        } else if (nYears > 0) {
          workYears = nYears + "年";
        }
        this.yeadr = workYears;
      }
    },
    //删除荣誉
    delHonor(val) {
      if (this.agentData.honors) {
        this.agentData.honors.splice(val, 1);
        this.honorsNum = this.agentData.honors.length;
      }
    },
    photoWall() {
      this.$store.commit("getAgentData", this.agentData);
      this.$router.push({
        path: "/photoWall",
        query: {
          data: this.agentData
        }
      });
    },
    searchLocation() {
      this.$router.push({ path: "/searchLocation" });
    },
    goBack() {
      this.$store.commit("getAgentData", null);
      let device = this.device;
      let from = this.$route.query.from;
      let originalData = this.originalData;
      let agentData = this.agentData;
      let status = this._.isEqual(originalData, agentData);
      let $this = this;
      if (!status) {
        this.$confirm({
          title: "",
          content: "您已经修改了名片信息，是否要保存？",
          confirmText: "不保存",
          cancelText: "保存",
          onConfirm() {
            if (from) {
              $this.$router.go(-1);
            } else if (device == "android") {
              bmAndroid.goHomePage();
            } else if (device == "ios" || device == "iPhoneX") {
              window.webkit.messageHandlers.goHomePage.postMessage(null);
            }
          },
          onCancel() {
            $this.edit();
          }
        });
      } else {
        if (from) {
          this.$router.go(-1);
        } else if (device == "android") {
          bmAndroid.goHomePage();
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.goHomePage.postMessage(null);
        }
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

.card-editCard-page {
  .edit-address {
    margin-left: 10px;
    img {
      width: 38px;
    }
  }
  background: #f7f7f7;
  .contten-edit {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 100%;
    // margin-bottom: 40px;
  }
  .card-content {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 100%;
  }
  .photo-data {
    margin-top: 20px;
    height: 108px;
    padding-left: 32px;
    background: #ffffff;
    position: relative;
    border-top: 1px #e8e8e8 solid;
    border-bottom: 1px #e8e8e8 solid;
  }

  .photo {
    width: 194px;
    line-height: 108px;
    font-size: 30px;
    // position: relative;
    // float: left;
  }
  .photo-img {
    position: absolute;
    left: 224px;
    top: 10px;
    height: 90px;
    img {
      height: 90px;
      width: 78px;
    }
  }
  .photo-text {
    font-size: 26px;
    color: #999;
    position: absolute;
    right: 73px;
    top: 30px;
  }
  .rightPhoto {
    position: absolute;
    top: 40px;
    font-size: 28px;
    right: 32px;
  }
  .portrait-data {
    height: 90px;
    padding-left: 32px;
    background: #ffffff;
    position: relative;
  }

  .portrait-data:before {
    content: " ";
    position: absolute;
    bottom: 0;
    right: 0;
    height: 2px;
    border-bottom: 2px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 30px;
  }
  .honor-data {
    width: 100%;
    height: 90px;
    padding-left: 32px;
    background: #ffffff;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .add6 {
      position: relative;
      bottom: -8px;
      background-image: url("../../assets/imgs/add-honor.png");
      width: 38px;
      height: 38px;
      display: inline-block;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
  .portrait {
    width: 194px;
    line-height: 90px;
    font-size: 30px;
  }
  .portrait-img {
    position: absolute;
    left: 224px;
    top: 10px;
    // height: 174px;
    width: 100%;
    img {
      height: 70px;
      width: 70px;
      border-radius: 50%;
    }
  }
  .portrait-tltle {
    position: absolute;
    left: 224px;
    top: 0;
    width: 100%;
    height: 90px;
  }
  .portrait-auto {
    position: relative;
    top: -90px;
    width: 10%;
    height: 86px;
    background: #fff;
    left: 90%;
  }
  .title {
    line-height: 90px;
  }
  .rightPhoto {
    position: absolute;
    top: 31px;
    font-size: 28px;
    right: 32px;
    width: 30px;
    height: 36px;
  }
  .greed {
    margin-top: 20px;
    background: #ffffff;
    border-top: 1px #e8e8e8 solid;
    border-bottom: 1px #e8e8e8 solid;
  }
  .input-data {
    font-size: 30px;
    color: #333;
    position: relative;
    .weui-label {
      width: 0.25867rem !important;
      font-size: 0.04rem;
    }
  }
  .input-data:before {
    content: " ";
    position: absolute;
    bottom: 0;
    right: 0;
    height: 2px;
    border-bottom: 2px solid #e8e8e8;
    color: #e8e8e8;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 30px;
  }
  .input-data-nb::before {
    border-bottom: none;
  }
  .selec-tilte {
    position: absolute;
    top: 0;
    width: 100%;
    height: 90px;
  }
  .edit-label {
    position: absolute;
    top: 0;
    width: 100%;
    left: 224px;
    height: 90px;
    overflow: hidden;
    // overflow-x: auto;
  }
  .edit-honor {
    position: absolute;
    top: 0;
    width: 100%;
    left: 194px;
    padding-left: 30px;
    height: 90px;
    flex: 1;
  }
  .edit-honor:before {
    content: " ";
    position: absolute;
    bottom: 0;
    right: 0;
    height: 2px;
    border-bottom: 2px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    // left: 30px;
    left: 0;
  }
  .edit-honor1 {
    position: absolute;
    top: 0;
    // width: 100%;
    right: 32px;
    padding-left: 30px;
    height: 90px;
    flex: 1;
  }

  .honor {
    width: 164px;
    line-height: 90px;
    font-size: 30px;
    // position: relative;
  }
  .address {
    .weui-input {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 15px;
    }
  }
  .address-load {
    position: absolute;
    right: 84px;
    top: 23px;
    img {
      width: 30px;
      height: 30px;
    }
  }
  .label {
    padding: 4px 12px;
    line-height: 90px;
    margin-right: 4px;
    height: 40px;
    border-radius: 20px;
    border: solid 2px #f6c55a;
    color: #f6c55a;
  }
  .label1 {
    border: solid 2px #6aa8fe;
    color: #6aa8fe;
  }
  .label2 {
    border: solid 2px #a1e155;
    color: #a1e155;
  }
  .rightdel {
    position: absolute;
    top: 18px;
    font-size: 28px;
    right: 32px;
  }
  .homor-input {
    height: 100%;
    overflow: hidden;
    width: 430px;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 30px;
  }
}
</style>
