<template>
  <div class="dt-pages family-details">
    <div class="dt-header" ref="topInfo">
      <dtHeader
        :title="`${familyName}的家庭`"
        rightIcon="more"
        @headerRight="moreClick"
        :leftBack="false"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <swiper :options="swiperOption" @slideChange="swiperChange" ref="mySwiper">
        <swiper-slide v-for="(item,index) in memberList" :key="index" class="family-head">
          <div class="edit-data" @click="editData(item.customerId)">
            <span>去完善信息</span>
            <icon class="dt-icon edit" name="edit"></icon>
          </div>
          <div class="cust-box">
            <h3 class="title-name">{{item.customerAlias}}</h3>
            <p class="remark" v-if="item.remark != ''">{{item.remark}}</p>
            <div class="sexAge">
              <icon class="dt-icon woman2" :name="item.gender == 1?'man2':'woman2'"></icon>
              &nbsp; {{item.gender == 1?'男':'女'}}&nbsp;&nbsp; | &nbsp;&nbsp;{{item.age}}岁
            </div>
            <div class="profession-tg">
              <icon v-if="item.occupation" class="dt-icon profession" name="profession"></icon>
              <span v-if="item.occupation" class="productManager">职业：{{item.occupation}}</span>
              <span v-if="item.trusteeshipType == 1" style="color:#28c76a">已托管客户</span>
            </div>
            <div class="icon">
              <span class="span-phone" @click="callPhone(item.phoneNumber)">
                <img src="../../assets/imgs/icon-phone.png" alt="">
              </span>
              <span class="span-map" @click="addressBtn(item.customerId)">
                <img src="../../assets/imgs/icon-map.png" alt="">
              </span>
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <div class="main">
        <tab
          @scroll.prevent
          @touchmove.prevent
          active-color="#28c76a"
          default-color="#999999"
          bar-active-color="#28c76a"
          :line-width="2"
          v-model="tabIndex"
          custom-bar-width="75px"
        >
          <tab-item class="tab-one" @on-item-click="tabChange" selected>托管的保单</tab-item>
          <tab-item class="tab-two" @on-item-click="tabChange">托管记事本</tab-item>
        </tab>
        <div>
          <div
            class="all-wrap"
            style="text-align: center;"
            v-if="!policyDataStatus && tabIndex == 0"
          >
            <img src="../../assets/imgs/noReport.png" alt="">
            <p style="color: #28c76a">暂无保单</p>
          </div>
          <swiper v-if="policyDataStatus && tabIndex == 0" :options="swiperOptionBottom">
            <swiper-slide v-for="(item,index) in policyList" :key="index" class="main-swiper">
              <div class="tg-info">
                <flexbox :gutter="0" class="head-tsbr">
                  <flexbox-item class="flexbox-item">
                    <div class="flex-demo">
                      <p>投保人</p>
                      <div>{{item.insurerAlias}}</div>
                    </div>
                  </flexbox-item>
                  <flexbox-item class="flexbox-item">
                    <div class="flex-demo">
                      <p>被保人</p>
                      <div>{{item.insuredAliases}}</div>
                    </div>
                  </flexbox-item>
                </flexbox>
                <div class="main-data">
                  <h3 class="title-info">基本信息</h3>
                  <p>保单号：{{item.policyNo}}</p>
                  <p>保险公司：{{item.companyName}}</p>
                  <h3 class="title-info">险种信息</h3>
                  <x-table :full-bordered="true" :content-bordered="true" :cell-bordered="true">
                    <thead>
                      <tr>
                        <th>险种名称</th>
                        <th class="coverage">基本保额</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(v,i) in item.productList" :key="i">
                        <td class="insurance">{{v.productName}}</td>
                        <td class="money">¥{{v.basicAmnt}}</td>
                      </tr>
                    </tbody>
                  </x-table>
                  <h3 class="title-info">身故受益人</h3>
                  <p>
                    {{item.benefitRelas[0].benefitType == 1?"法定受益人":"指定受益人"}}
                    <x-button
                      @click.native.stop="gotoPolicyDetails(item)"
                      class="click-preview"
                    >点击查看详情</x-button>
                  </p>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev swiper-button-black" slot="button-prev"></div>
            <div class="swiper-button-next swiper-button-black" slot="button-next"></div>
          </swiper>
          <div v-if="tabIndex == 1" class="tg-notepad">
            <div class="tg-notepad-item">
              <p>
                <i class="icon-note"></i>
                <span>备忘录</span>
              </p>
              <group class="notepad-group">
                <x-textarea
                  ref="textarea1"
                  @on-focus="textareaBlur"
                  v-model="memoNote"
                  :readonly="true"
                  :placeholder="placeholderValue1"
                  :show-counter="false"
                ></x-textarea>
              </group>
              <icon class="dt-icon voice" @click.native="openNativeVoice(1)" name="voice"></icon>
            </div>
            <div class="tg-notepad-item">
              <p>
                <i class="icon-note"></i>
                <span>购买理由</span>
              </p>
              <group class="notepad-group">
                <x-textarea
                  ref="textarea2"
                  @on-focus="textareaBlur"
                  v-model="reasonNote"
                  :readonly="true"
                  :placeholder="placeholderValue2"
                  :show-counter="false"
                ></x-textarea>
              </group>
              <icon class="dt-icon voice" @click.native="openNativeVoice(2)" name="voice"></icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="popupMenu"
      :class="menuListStatus ? 'upMenu':'downMenu'"
      :style="{'top':headerHeight+'px'}"
    >
      <ul>
        <li
          class="menu-list"
          @click="selectPolicy(item.id)"
          v-for="(item,index) in menus"
          :key="index"
        >{{item.name}}</li>
      </ul>
      <div class="arrow"></div>
    </div>
    <div
      v-if="menuListStatus"
      class="total-dialog"
      @click="moreClick"
      @scroll.prevent
      @touchmove.prevent
    ></div>
    <confirm v-model="comfirmShow" @on-confirm="delFamily" title="确认删除？">
      <p style="text-align:center">删除后，所有保单将一并删除</p>
    </confirm>
  </div>
</template>
<script>
import {
  Group,
  Flexbox,
  FlexboxItem,
  Tab,
  TabItem,
  XTable,
  XTextarea,
  Confirm,
  XButton
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { scrollToElement, getDevice } from "@/config/utils.js";
export default {
  components: {
    Group,
    Flexbox,
    FlexboxItem,
    dtHeader,
    Tab,
    TabItem,
    XTable,
    XTextarea,
    Confirm,
    XButton
  },
  data() {
    return {
      device: getDevice(),
      policyDataStatus: false,
      familyName: "",
      familyId: "",
      placeholderValue1:
        "暂无记录。\n快来记录每一次与客户沟通的事情吧，方便后期跟进。",
      placeholderValue2:
        "暂无记录。\n快来记录每一次与客户沟通的事情吧，把握客户需求是关键。",
      swiperIndex: 0,
      memoNote: "",
      reasonNote: "",
      tabIndex: 0,
      swiperOption: {
        initialSlide: 0, //设定初始化时slide的索引
        // loop: true,
        slidesPerView: "auto",
        spaceBetween: 10,
        centeredSlides: true, //设定为true时，活动块会居中，而不是默认状态下的居左。
        speed: 300 //滑动速度
      },
      swiperOptionBottom: {
        spaceBetween: 60,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      menus: [],
      policyList: [],
      menuListStatus: false,
      headerHeight: "",
      comfirmShow: false,
      memberList: [],
      policyParam: {
        customerId: "",
        familyId: ""
      },
      noteId1: null,
      noteId2: null
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.initData();
    /** 注入方法供native调用 */
    this.updateNote();
  },
  mounted() {
    this.headerHeight = this.$refs.topInfo.offsetHeight - 10;
  },
  activated() {},
  watch: {
    // watch路由变化
    $route(to, from) {
      if (
        to.path == "/familyDetails" &&
        from.path == "/familyListIndex" &&
        this.$route.query.index == false
      ) {
        this.$refs.mySwiper.swiper.activeIndex = 0;
        this.tabIndex = 0;
      }
    }
  },
  computed: {},
  methods: {
    // 家庭成员数据初始化
    async initData() {
      this.familyId = this.$route.query.familyId;
      let res = await api.familyFindById({
        id: this.familyId
      });
      if (res.status == 1) {
        if (res.data != null) {
          this.memberList = res.data.customerList;
          this.familyName = res.data.familyName;
          if (this.$route.query.index) {
            this.$refs.mySwiper.swiper.activeIndex = this.$route.query.index;
          }
          if (
            this.$route.query.policyNum > 0 ||
            this.$route.query.actionType == 2
          ) {
            this.menus = [
              {
                id: "1",
                name: "编辑成员"
              },
              {
                id: "2",
                name: "删除家庭"
              },
              {
                id: "3",
                name: "生成家庭报告"
              },
              {
                id: "4",
                name: "修改家庭昵称"
              }
            ];
          } else {
            this.menus = [
              {
                id: "1",
                name: "编辑成员"
              },
              {
                id: "2",
                name: "删除家庭"
              },
              // {
              //   id: "3",
              //   name: "生成家庭报告"
              // },
              {
                id: "4",
                name: "修改家庭昵称"
              }
            ];
          }
          this.getOccupationData();
          this.policyInitData();
          this.noteInitData();
        }
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    // 取职业字典转中文
    async getOccupationData() {
      let res = await api.occupationList({ parentCode: "1001" });
      if (res.status == 1) {
        for (let temp of this.memberList) {
          for (let item of res.data) {
            if (temp.occupation == item.dictCode) {
              temp.occupation = item.dictName;
            }
          }
        }
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    // 保单数据初始化
    async policyInitData() {
      let index = this.$refs.mySwiper.swiper.activeIndex;
      this.policyParam.customerId = this.memberList[index].customerId;
      this.policyParam.familyId = this.$route.query.familyId;
      let policyData = await api.customerPolicyList(this.policyParam);
      if (policyData.status == 1) {
        if (policyData.data == null) {
          this.policyDataStatus = false;
        } else {
          this.policyList = policyData.data;
          this.policyDataStatus = true;
        }
      } else {
        this.$alert(policyData.msg);
        return;
      }
    },
    // 托管记事本数据初始化
    async noteInitData() {
      let index = this.$refs.mySwiper.swiper.activeIndex;
      let paramObj = {
        familyId: this.familyId,
        customerId: this.memberList[index].customerId
      };
      let res = await api.findNote(paramObj);
      if (res.data != null) {
        for (let item of res.data) {
          if (item.noteType == 1) {
            this.memoNote = item.noteContent;
            if (item.noteId) {
              this.noteId1 = item.noteId;
            }
          } else if (item.noteType == 2) {
            this.reasonNote = item.noteContent;
            if (item.noteId) {
              this.noteId2 = item.noteId;
            }
          }
        }
      } else {
        this.memoNote = "";
        this.reasonNote = "";
        this.noteId1 = null;
        this.noteId2 = null;
      }
    },
    // 向window对象注入一个方法供native调用
    updateNote() {
      window.updateNoteContent = async (val, type) => {
        let index = this.$refs.mySwiper.swiper.activeIndex;
        let saveNoteParam = {
          familyId: this.familyId,
          customerId: this.memberList[index].customerId,
          noteContent: val
        };
        if (type == 1) {
          saveNoteParam.noteType = 1;
          saveNoteParam.noteId = this.noteId1;
          let res = await api.saveNote(saveNoteParam);
          if (res.status == 1) {
            this.memoNote = val;
            this.noteId1 = res.data.noteId;
          } else {
            this.$alert(res.msg);
            return;
          }
        } else if (type == 2) {
          saveNoteParam.noteType = 2;
          saveNoteParam.noteId = this.noteId2;
          let res = await api.saveNote(saveNoteParam);
          if (res.status == 1) {
            this.reasonNote = val;
            this.noteId2 = res.data.noteId;
          }
        }
      };
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 更多
    moreClick(val) {
      this.menuListStatus = !this.menuListStatus;
    },
    // 完善个人信息
    editData(v) {
      this.$router.push({
        path: "/familyEditUserinfo",
        query: {
          id: v,
          familyId: this.familyId
        }
      });
    },
    tabChange(v) {
      console.log(v);
    },
    // 拨打电话
    callPhone(v) {
      if (v == null || v == "") {
        this.$toast("暂无手机号，请完善信息");
        return;
      } else {
        window.location.href = `tel:${v}`;
      }
    },
    // 地址列表
    addressBtn(v) {
      this.$router.push({
        path: "/familyAddress",
        query: {
          id: v
        }
      });
    },
    // 切换家庭成员联动保单list
    swiperChange() {
      this.policyInitData();
      this.noteInitData();
    },
    // 更多选项跳转
    async selectPolicy(id) {
      if (id == "1") {
        // 编辑家庭成员
        //清缓存
        this.$store.commit("clearCacheByName", "editFamilyPeoples");
        setTimeout(() => {
          this.$store.commit("setCacheByName", "editFamilyPeoples");
        }, 200);
        this.$router.push({
          path: "/editFamilyPeoples",
          query: {
            type: "edit",
            id: this.familyId
          }
        });
      } else if (id == "2") {
        // 删除家庭
        this.comfirmShow = true;
      } else if (id == "3") {
        let res = await api.effectiveFamily({
          id: this.familyId
        });
        if (res.status == 1) {
          if (res.data.number == 0) {
            this.$alert("该家庭无有效保单");
            return;
          }
        } else {
          this.$alert(res.msg);
          return;
        }
        // 跳转报告页
        let result = await api.saveFamilyReport({
          familyId: this.familyId
        });
        if (result.status == 1) {
          this.$router.push({
            path: "/reportSimple",
            query: {
              familyId: this.familyId
            }
          });
        } else if (result.status == 4) {
          this.$confirm({
            content: "此功能需要开通会员",
            confirmText: "购买",
            onConfirm: () => {
              this.buyMembers();
            }
          });
        } else {
          this.$alert(result.msg);
        }
      } else if (id == "4") {
        // 修改家庭昵称
        this.$router.push({
          path: "/editFamilyName",
          query: {
            familyId: this.familyId,
            name: this.familyName
          }
        });
      }
      this.moreClick();
    },
    // 删除家庭
    async delFamily() {
      let res = await api.familyDelete({
        id: this.familyId
      });
      if (res.status == 1) {
        this.$router.go(-1);
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    // 点击详情跳转保单详情页
    gotoPolicyDetails(v) {
      //清缓存
      this.$store.commit("clearCacheByName", "policyDetails");
      setTimeout(() => {
        this.$store.commit("setCacheByName", "policyDetails");
      }, 200);
      this.$store.state.policyMakeFrom = "family";
      this.$router.push({
        path: "/policyDetails",
        query: {
          detailPolicyId: v.policyId,
          type: "family"
        }
      });
    },
    // 打开原生语音录入窗口
    openNativeVoice(v) {
      let device = this.device;
      if (device == "android") {
        if (v == 1) {
          bmAndroid.openNativeVoice(this.memoNote, 1);
        } else {
          bmAndroid.openNativeVoice(this.reasonNote, 2);
        }
      } else if (device == "ios" || device == "iPhoneX") {
        if (v == 1) {
          window.webkit.messageHandlers.openNativeVoice.postMessage({
            val: this.memoNote,
            type: 1
          });
        } else {
          window.webkit.messageHandlers.openNativeVoice.postMessage({
            val: this.reasonNote,
            type: 2
          });
        }
      }
    },
    // 去购买会员
    buyMembers() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.gotoAppPage(4);
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.gotoAppPage.postMessage(4);
      }
    },
    // IOS下readonly属性兼容性处理
    textareaBlur() {
      let el1 = this.$refs.textarea1.$el.children[1].children[0];
      let el2 = this.$refs.textarea2.$el.children[1].children[0];
      el1.blur();
      el2.blur();
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

.family-details {
  .vux-tab .vux-tab-item {
    background-size: 100% 0px;
  }
  .weui-dialog__btn_primary {
    color: #0bb20c !important;
  }
  .weui-dialog__btn_default {
    color: #353535 !important;
  }
  .dt-header {
    z-index: 1001;
  }
  .dt-content {
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    padding: 20px 0 40px 0;
    .main {
      padding: 22px 60px;
      overflow: hidden;
      .swiper-container {
        overflow: visible;
      }
      .swiper-pagination {
        height: 50px;
        top: -50px;
        font-size: 24px;
        color: #999;
        .swiper-pagination-current {
          color: #333;
        }
      }
      .swiper-button-prev {
        left: -40px;
        top: 333px;
      }
      .swiper-button-next {
        right: -40px;
        top: 333px;
      }
      .head-tsbr {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        // width: 620px;
        height: 160px;
        background-color: #65c28d;
        padding: 20px 0 26px;
        .flexbox-item {
          height: 100%;
          color: #fff;
          text-align: center;
          .flex-demo {
            p {
              font-size: 36px;
              margin-bottom: 6px;
            }
            div {
              font-size: 32px;
              // max-width: 250px;
              display: inline-block;
              height: 60px;
              line-height: 60px;
              border-radius: 12px;
              background-color: #84d2a4;
              padding: 0 20px;
              // margin: 0 auto;
            }
          }
        }
        .flexbox-item:first-child {
          border-right: 2px solid #a3ddbb;
        }
      }
      .vux-tab-wrap {
        margin-bottom: 20px;
      }
      .vux-tab {
        background-color: transparent;
      }
      .tab-one {
        text-align: left;
        // padding-left: 20px;
        font-size: 30px;
        font-weight: 600;
      }
      .tab-two {
        text-align: right;
        // padding-right: 20px;
        font-size: 30px;
        font-weight: 600;
      }
      .vux-tab-ink-bar-transition-backward {
        right: 76% !important;
      }
      .vux-tab-ink-bar-transition-forward {
        left: 76% !important;
      }

      .all-wrap {
        overflow: hidden;
        text-align: center;
        padding-top: 100px;
        img {
          width: 46%;
        }
        p {
          font-size: 30px;
          color: #28c76a;
        }
      }
    }
    .family-head {
      position: relative;
      background-color: #fff;
      box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.06);
      font-size: 40px;
      color: #000;
      width: 620px;
      height: 300px;
      border-radius: 14px;
      text-align: center;
      .edit-data {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 180px;
        height: 40px;
        background-color: #ffb618;
        color: #fff;
        font-size: 22px;
        border-radius: 20px;
        text-align: center;
        line-height: 40px;
        .edit {
          color: #fff;
          width: 30px;
          height: 30px;
        }
      }
      .cust-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title-name {
          // margin-top: 30px;
          font-size: 40px;
          color: #000;
        }
        .remark {
          color: #cdcdcd;
          font-size: 22px;
        }
        .sexAge {
          font-size: 26px;
          color: #666;
          margin: 5px 0 10px;
          .woman2 {
            width: 24px;
            height: 24px;
            vertical-align: text-top;
          }
        }
        .profession-tg {
          color: #333;
          font-size: 30px;
          .profession {
            vertical-align: sub;
            color: #2a69dd;
          }
          .productManager {
            margin-right: 40px;
          }
        }
        .icon {
          margin-top: 14px;
          span {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            display: inline-block;
            text-align: center;
            line-height: 46px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .span-phone {
            margin-right: 50px;
          }
          .span-map {
            // background-color: #84d2a4;
          }
        }
      }
    }
    .main-swiper {
      // height: 700px;
      box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.06);
      .tg-info {
        background-color: #fff;
      }
      .main-data {
        text-align: left;
        padding: 30px 60px;
        font-size: 28px;
        color: #333;
        .click-preview {
          float: right;
          padding: 0 4px;
          width: 160px;
          height: 40px;
          line-height: 40px;
          // display: table-cell;
          // vertical-align: middle;
          border-radius: 20px;
          color: #fff;
          font-size: 22px;
          text-align: center;
          background-color: #65c78d;
        }
        .title-info {
          font-size: 30px;
          color: #333;
          background-color: #d4f4e1;
          display: inline-block;
          height: 18px;
          line-height: 2px;
          margin-top: 34px;
          margin-bottom: 4px;
        }
        table {
          border-color: #eee;
          margin-top: 10px;
          table-layout: fixed;
          thead {
            font-size: 24px;
            color: #666;
            line-height: 50px;
            .coverage {
              width: 170px;
            }
          }
          tbody {
            font-size: 28px;
            color: #333;
            tr {
              height: 90px;
            }
            td {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .money {
              color: #28c76a;
            }
          }
        }
      }
    }
    .tg-notepad {
      // height: 700px;
      text-align: left;
      font-size: 28px;
      color: #333;
      font-weight: 600;
      background-color: #f5f5f5;
      .tg-notepad-item {
        position: relative;
        margin-bottom: 50px;
        .notepad-group {
          box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.06);
        }
        .voice {
          position: absolute;
          right: 20px;
          bottom: 14px;
          color: #888;
          width: 50px;
          height: 50px;
        }
      }
      .vux-no-group-title {
        border-radius: 10px;
        margin-top: 10px;
        .vux-x-textarea {
          padding-bottom: 30px;
        }
      }
      .icon-note {
        vertical-align: text-top;
        display: inline-block;
        width: 10px;
        height: 30px;
        background-color: #333;
        margin-right: 10px;
      }
      textarea {
        height: 220px;
        border-radius: 10px;
        color: #232323;
        font-size: 28px;
        line-height: 44px;
      }
    }
  }

  .total-dialog {
    position: fixed;
    height: 100vh;
    width: 100%;
    background: #000;
    left: 0;
    top: 0;
    opacity: 0.4;
    z-index: 1000;
    bottom: 0;
  }

  .upMenu {
    display: block !important;
  }
  .downMenu {
    display: none !important;
  }

  .popupMenu {
    position: fixed;
    top: 0;
    background: #fff;
    color: #666;
    width: 222px;
    right: 22px;
    display: none;
    font-size: 28px;
    z-index: 1001;
    box-sizing: border-box;
    padding: 0 10px;
    border-radius: 14px;
    .menu-list {
      line-height: 78px;
      text-align: center;
      border-bottom: 2px solid #e8e8e8;
      &:last-of-type {
        border: none;
      }
    }

    .arrow {
      border-width: 10px;
      border-style: solid;
      border-color: transparent transparent #fff;
      width: 0px;
      height: 0px;
      position: absolute;
      top: -18px;
      right: 20px;
    }
  }
}
</style>
