<template>
  <div v-transfer-dom :class="{ios:$store.state.device=='ios',iPhoneX:$store.state.device=='iPhoneX'}">
    <popup v-model="listShow" position="right" width="100%">
      <div class="dt-pages cust-page search-head">
        <div class="dt-header policyholder-header">
          <dt-header title="我的客户" :text-color="'#2c3e50'" @headerLeft="closeListShow" :leftBack="false"></dt-header>
          <search-item @submit="search" v-model="searchValue" ></search-item>
        </div>
        <div class="dt-content">
          <dt-scroll ref="listView" :listenScroll="true" :probeType="probeType" :pullup="more" @scrollToEnd="scrollSearch">
            <div class="cus-list wrapper">
              <div :gutter="0" v-for="(obj, idx) in cusList" :key="'cuslist'+idx" @click="selectCustomer(obj.customerId)" class="cuslist-box line">
                <flexbox class="minh fz32">
                  <flexbox-item :span="1/3" class="pl20">{{obj.customerName}}</flexbox-item>
                  <flexbox-item :span="1/3">{{obj.gender == "M" ? "男" : "女"}}</flexbox-item>
                  <flexbox-item>{{ getAgeByBirthDay(obj.birthday || '') + "周岁" }}</flexbox-item>
                </flexbox>
              </div>
            </div>
            <Tips :tips="nowTips" @refresh="refresh" v-if="showTip"></Tips>
          </dt-scroll>
        </div>
      </div>
    </popup>
    <dt-cusdetail v-model="detailShow" :customer-id="customerId" @detail-back="openListShow" @slelect-data="backData"></dt-cusdetail>
  </div>  
</template>
<script>
import DtHeader from "@/components/dtHeader"
import SearchItem from "@/components/searchItem"
import DtScroll from "@/components/dtScroll"
import DtCusdetail from "@/components/dtCusDetail"
import Tips from "@/components/tips"

import { Flexbox, FlexboxItem, Group, Popup, TransferDom} from "vux"
import { calculateAge } from "@/config/utils.js"
import api from "@/api/index"

export default {
  components: {
    Popup,
    DtHeader, SearchItem, DtScroll, DtCusdetail, Tips,
    Flexbox, FlexboxItem, Group
  },
  directives: {
    TransferDom
  },
  model: {
    prop: "listShow",
    event: "close"
  },
  props:{
    listShow: {
      type: Boolean,
      required: true
    },
    limitCon: {
      type: Object,
      default: () => {
        return {
          gender: "",
          minBirthday: "",
          maxBirthday: "",
        }
      }
    }
  },
  data() {
    return {
      searchValue: "",
      cusList: [],
      commomCustList: [], // 常用大分类
      customerId: "",
      detailShow: false,
      nowPageIndex: 1,
      showTip: false,
      nowTips: "tips4",
      more: true
    }
  },
  methods: {
    async search() {
      let ctx = this
      try {
        this.showTip = false
        let result = await api.listCustomer({
          pageNum: this.nowPageIndex,
          pageSize: 50,
          param: {
            customerName: this.searchValue,
            gender: this.limitCon.gender || "",
            minBirthday: this.limitCon.minBirthday || "",
            maxBirthday: this.limitCon.maxBirthday || ""
          }
        })

        if (result.status != '1') {
          throw(result)
        }

        if (!result.data.list || result.data.list.length == 0) {
          ctx.nowTips = "tips3"
          ctx.showTip = true
        }
        this.cusList = result.data.list
        this.$nextTick(function () {
          if (ctx.$refs.listView) {
            ctx.$refs.listView.refresh()
          }
        })
      } catch (e) {
        ctx.showTip = true
        console.error(e)
      }
    },
    async scrollSearch() {
      let ctx = this
      if (!this.more) { return }
      try {
        this.nowPageIndex += 1
        let result = await api.listCustomer({
          pageNum: this.nowPageIndex,
          pageSize: 50,
          param: {
            customerName: this.searchValue,
            gender: this.limitCon.gender || "",
            minBirthday: this.limitCon.minBirthday || "",
            maxBirthday: this.limitCon.maxBirthday || ""
          }
        })
        if (result.status != '1') {
          throw(result)
        }

        if (!result.data.hasNextPage) {
          this.more = false
          return
        }

        this.cusList = this._.concat(this.cusList, result.data.list)
        this.$nextTick(function(){
          if (ctx.$refs.listView) {
            ctx.$refs.listView.refresh()
          }
        })
      } catch (e) {
        console.error(e)
      }
    },
    refresh() {
      this.nowPageIndex = 1
      this.searchValue = ""
      this.search()
    },
    inputSearch() {
      this.nowPageIndex = 1
      this.search()
    },
    closeListShow() {
      this.$emit('close', false)
    },
    openListShow(val){
      this.$emit('close', val)
    },
    getAgeByBirthDay(birthday) {
      if (!birthday) { return "0" }
      return calculateAge(birthday)
    },
    selectCustomer(id) {
      this.customerId = id
    },
    backData(data) {
      this.$emit('slelectdata', data)
    }
  },
  created() {
     // 为了区分页面绑定的data和临时变量 
    this.probeType = 3
  },
  watch: {
    customerId(val) {
      if (val) {
        this.$emit('close', false)
        this.detailShow = true
      }
    },
    listShow(val) {
      if (val) {
        // 打开弹框的初始化
        this.searchValue = ""
        this.cusList = []
        this.customerId = ""
        this.detailShow = false
        this.nowPageIndex = 1
        this.nowTips = "tips4"
        this.showTip = false
        this.more = true

        this.search()
      }
    }
  }
}
</script>
<style lang="less" scoped>
@dt-bbbbbb: #bbbbbb;
@dt-f9545: #f95454;
@dt-ffffff: #ffffff;
@dt-iconcolor: black;
@dt-iconcolor: #dedede;

.cust-page {
  width: 750px;
  overflow: hidden;
  .line {
    border-top: 2px solid @dt-iconcolor
  }
  .pl20 {
    padding-left: 20px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .minh {
    min-height: 100px;
  }
  .fw600 {
    font-weight: 600;
  }
  .wrapper {
    background-color: @dt-ffffff;
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    margin: 10px 20px;
    padding: 0 10px;
    text-align: center;
    .item-active {
      color: @dt-f9545;
    }
  }
  .cuslist-box.line{
    &:first-child{
      border: 0;
    }
  }
}
</style>

