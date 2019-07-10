<template>
  <div class="dt-pages exam-showHonor-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader title="标签展示" rightText="保存" :leftBack="false" @headerRight="addAgenTab" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <div class="selec-nav">
        <span class="nav-line"></span>
        <div class="selec-title">已选择标签</div>
      </div>
      <div class="selec-content selec-heigth">
        <div class="selec-loca" v-for="(item,index) in agenTagList" :key="index">
          <img class="selecIcon" @click="delTag(index ,item)" src="../../assets/imgs/del08.png" />
          <span class="selec-text label" :class="index==1?'label1':index==2?'label2':''">
            {{item.tagLable}}
          </span>
        </div>
      </div>
      <div class="selec-nav">
        <span class="nav-line"></span>
        <div class="selec-title">所有标签</div>
      </div>
      <div class="selec-content" style="margin: 6px 0">
        <div class="selec-loca selec-mar" v-for="(item,index) in tagList" :key="index">
          <icon class="dt-icon selecIcon" name="mark" v-for="(items,index) in agenTagList" :key="index" v-if="items.tagLable == item.tagLable && item.tabShow ==true"></icon>
          <img class="selecIcon" src="../../assets/imgs/del08.png" @click="delCustomTag(item ,index)" v-if="item.tagType == 2 && item.tabShow ==false" />
          <span class="selec-text" @click="saveTag(item)">
            {{item.tagLable}}
          </span>
        </div>

        <div class="selec-add selec-mar" @click="add">
          <div class="add-honor">
            <span class="addIcon"></span>
            <span class="selec-text">
              添加
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showConfirmBox" class="dialog" hide-on-blur>
        <div class="dialog-title titleStyle">新增标签</div>
        <div class="Divinput">
          <x-input :show-clear="false" :max="5" v-model="sureInput" :onkeyup="myFunction(sureInput)" placeholder="请输入行业标签/职业技能等" text-align="left" class="inputs">
            <span slot="right">{{sureNum}}</span>
          </x-input>
        </div>
        <div class="btn">
          <div class="btn-cent weui-dialog__ft" @click="cancel">
            <div class="cancel-btn weui-dialog__btn weui-dialog__btn_primary">取消</div>
          </div>
          <div class="btn-sure weui-dialog__ft" @click="sure">
            <div class="cancel-btn weui-dialog__btn weui-dialog__btn_primary">确定</div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
import {
  Tab,
  TabItem,
  TransferDomDirective as TransferDom,
  XDialog,
  XInput
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { setTimeout } from "timers";
export default {
  directives: {
    TransferDom
  },
  name: "showHonor",
  components: {
    dtHeader,
    Tab,
    TabItem,
    XDialog,
    XInput
  },
  data() {
    return {
      showConfirmBox: false,
      tagList: [],
      agentData: {},
      agenTagList: [],
      sureInput: "",
      sureNum: 5
    };
  },
  created() {},
  watch: {},
  mounted() {
    this.initData();
    this.sureNum = 5;
  },
  methods: {
    async initData() {
      let results = await api.getTag();
      if (results.status == 1) {
        this.tagList = results.data.list;
        this.agentData = this.$store.state.agentData;
        if (this.agentData.tags != null) {
          this.agenTagList = this.agentData.tags;
        }
        for (let i = 0; i < this.tagList.length; i++) {
          if (this.tagList[i].tagType == 2) {
            this.tagList[i].tabShow = false;
          } else {
            this.tagList[i].tabShow = true;
          }
          for (let j = 0; j < this.agenTagList.length; j++) {
            if (
              this.tagList[i].tagLable == this.agenTagList[j].tagLable &&
              this.tagList[i].tagType == 2
            ) {
              this.tagList[i].tabShow = true;
            }
          }
        }
      }
    },
    selectMember(item) {},
    add() {
      this.showConfirmBox = true;
    },
    //保存选择标签
    async addAgenTab() {
      let ids = [];
      this.agenTagList.forEach(item => {
        ids.push(item.tagId);
      });
      let results = await api.getChangeTag({ ids: ids });
      if (results.status == 1) {
        this.agentData.tags = this.agenTagList;
        this.$store.commit("getAgentData", this.agentData);
        this.$router.push({
          path: "/editCard",
          query: {}
        });
      }
    },
    delTag(index, val) {
      this.agenTagList.splice(index, 1);
      for (let i = 0; i < this.tagList.length; i++) {
        if (this.tagList[i].tagLable == val.tagLable && val.tagType == 2) {
          this.tagList[i].tabShow = false;
        } else {
          // this.tagList[i].tabShow = true
        }
      }
    },
    //保存标签
    saveTag(val) {
      let b = false;
      if (this.agenTagList.length < 3) {
        if (this.agenTagList.length == 0) {
          this.agenTagList.push(val);
        } else {
          for (let i = 0; i < this.agenTagList.length; i++) {
            if (this.agenTagList[i] == val) {
              b = true;
            }
          }
          if (b == false) {
            this.agenTagList.push(val);
          }
        }
        for (let i = 0; i < this.tagList.length; i++) {
          for (let j = 0; j < this.agenTagList.length; j++) {
            if (this.tagList[i].tagLable == val.tagLable && val.tagType == 2) {
              this.tagList[i].tabShow = true;

              return;
            } else {
            }
          }
        }
      } else {
        this.$toast("标签最多只能选择3个");
      }
    },
    cancel() {
      this.sureInput = "";
      this.showConfirmBox = false;
    },
    async delCustomTag(val, index) {
      let results = await api.getdeleteTag(val);
      if (results.status == 1) {
        this.tagList.splice(index, 1);
      }
    },

    async sure() {
      let results = await api.getAddAgentTag({ tagLable: this.sureInput });

      if (results.status == 1) {
        this.sureInput = "";
        results.data.tabShow = false;
        this.tagList.push(results.data);
        this.showConfirmBox = false;
      } else {
        this.$toast(results.msg);
      }
    },
    getByteLen(val) {
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }
      return len;
    },
    myFunction(val) {
      let maxChars = 5; //最多字符数
      this.sureNum = maxChars - val.length;
    },
    myFunction1(str, len) {
      let char_length = 0;
      for (let i = 0; i < str.length; i++) {
        let son_str = str.charAt(i);
        console.log(son_str);
        encodeURI(son_str).length > 2
          ? (char_length += 1)
          : (char_length += 0.5);

        if (char_length >= len) {
          let sub_len = char_length == len ? i + 1 : i;
          return str.substr(0, sub_len);
          break;
        }
      }
    },
    goBack() {
      this.$router.go(-1);
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

.exam-showHonor-page {
  background: #f7f7f7;

  .selec-nav {
    line-height: 90px;
    height: 90px;
    left: 32px;
    position: relative;
    .nav-line {
      top: 29px;
      width: 6px;
      height: 32px;
      background-color: #28c76a;
      display: block;
      position: absolute;
    }
    .selec-title {
      line-height: 90px;
      margin-left: 14px;
      font-size: 30px;
      color: #333333;
    }
  }
  .selec-content {
    padding: 24px 21px;
    background-color: #ffffff;

    .selec-loca {
      position: relative;
      display: inline-block;
      line-height: 50px;
      margin: 8px 6px;
      .selecIcon {
        position: absolute;
        top: -10px;
        width: 38px;
      }
      .selec-text {
        border-radius: 25px;
        border: solid 2px #cccccc;
        padding: 5px 20px;
        font-size: 29px;
        color: #cccccc;
        margin: 10px 15px;
      }
      .label {
        margin: 10px 6px;
        padding: 0 12px;
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
    }
    .selec-mar {
      margin: 8px 6px;
    }
    .selec-add {
      position: relative;
      display: inline-block;
      .add-honor {
        padding: 0 32px;
        border-radius: 25px;
        border: solid 2px #28c76a;
        line-height: 47px;
        color: #28c76a;
        font-size: 29px;
        .addIcon {
          position: relative;
          background-image: url("../../assets/imgs/honor-add.png");
          width: 21px;
          height: 21px;
          display: inline-block;
          background-size: cover;
          background-repeat: no-repeat;
        }
      }
    }
  }
}
.dialog {
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .titleStyle {
    padding: 48px 0;
    font-size: 36px;
    font-weight: 400;
    font-size: #333333;
  }
  // .Divinput {
  //   position: absolute;
  //   top: 54%;
  //   left: 58%;
  //   width: 100%;
  //   transform: translate(-50%,-50%);
  //   text-align: center;
  // }
  .weui-cell {
    padding: 0 0;
  }
  .inputs {
    margin-left: 10%;
    // color: #dcdcdc;
    font-size: 26px;
    padding-top: 18px;
    padding-bottom: 30px;
    padding-left: 8px;
    width: 80%;
    margin: 0 10%;
    border-bottom: 0.1px solid #666;
    span {
      font-size: 26px;
    }
  }
  .btn {
    width: 80%;
    margin: 60px 10% 46px 10%;
    position: relative;
  }
  .cancel-btn {
    font-size: 32px;
    color: #ffffff !important;
  }
  .btn-cent {
    width: 45%;
    border-radius: 20px;
    background: #28c76a;
    opacity: 0.4;
    line-height: 82px;
    color: #ffffff;
  }
  .btn-sure {
    width: 45%;
    border-radius: 20px;
    background: #28c76a;
    color: #ffffff;
    position: absolute;
    top: 0;
    line-height: 82px;
    right: 0;
  }
  .weui-dialog__btn:active {
    background-color: #28c76a;
    border-radius: 20px;
  }
}
</style>
