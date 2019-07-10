<template>
  <div class="dt-pages search-insurance-page">
    <div class="dt-header">
      <dtHeader title="录入简版保单" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <search-item placeholder="请输入险种关键词搜索" @clear="clear" @input="changeValue" v-model="searchValue"></search-item>
      <div class="hotword" v-if="!searchStatus">
        <div class="title">热搜词</div>
        <div class="hotword-list">
          <span @click="hotWordSearch(item)" v-for="(item,index) in hotWord" :key="index">{{item.word}}</span>
        </div>
      </div>
      <div class="records" v-if="!searchStatus">
        <div class="title">历史搜索记录 <span @click="emptyHistory" class="empty-record">全部清空</span></div>
        <div class="records-list">
          <div class="records-li" v-for="(item,index) in records" :key="index">
            <span @click="addhistory(item,1)" class="name" v-html="item.productName"></span>
            <!-- <span class="date">{{item.createTime}}</span> -->
            <span @click="deletehistory(item)" class="remove">
              <icon class="dt-icon icon-remove" name="remove2"></icon>
            </span>
          </div>
        </div>
      </div>
      <div class="insurance-list" v-if="searchStatus">
        <flexbox orient="vertical" v-if="insurances.length>0">
          <flexbox-item :span='12' v-for="(item,index) in insurances" :key="index">
            <span @click="addhistory(item,0)" v-html="item.productName"></span>
          </flexbox-item>
        </flexbox>
        <div class="insurance-tips" v-if="searchStatus && insurances.length == 0">
          此险种未收录，建议您使用“扫描保单”OCR十秒快速识别保单的功能，或将此保单反馈至“我的”-“意见反馈
        </div>
      </div>
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
  Grid,
  GridItem
} from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import SearchItem from "@/components/searchItem";
export default {
  name: "searchInsurance",
  components: {
    XInput,
    Group,
    XButton,
    Flexbox,
    FlexboxItem,
    dtHeader,
    SearchItem,
    Grid,
    GridItem
  },
  data() {
    return {
      searchValue: "",
      searchStatus: false,
      hotWord: [],
      records: [],
      companyCodeList: [],
      insurances: [],
      companyId: ""
    };
  },
  created() {
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  methods: {
    async initData() {
      //热搜词
      let result = await api.insuranceHotword();
      if (result.status == 1) {
        this.hotWord = result.data;
      } else {
        this.$alert(result.msg);
        return false;
      }
      //查询companycodelist
      let companyId = null;
      let company = this.$store.state.company;
      if (company) {
        companyId = this.$store.state.company.companyId;
      }
      if (this.$route.query.companyId) {
        companyId = this.$route.query.companyId;
      }
      if (this.$store.state.companyId) {
        companyId = this.$store.state.companyId;
      }
      this.companyId = companyId;
      let companyCodeResult = await api.findCompanyCode({
        id: companyId
      });
      if (companyCodeResult.status == 1) {
        this.companyCodeList = companyCodeResult.data.companyCodeList;
      } else {
        this.$alert(companyCodeResult.msg);
        return false;
      }
      //查询搜索记录
      let insuranceHistoryResult = await api.findInsuranceHistory({
        companyIds: this.companyCodeList
      });
      if (insuranceHistoryResult.status == 1) {
        this.records = insuranceHistoryResult.data;
      } else {
        this.$alert(companyCodeResult.msg);
        return false;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    hotWordSearch(item) {
      this.searchValue = item.word;
      this.search();
    },
    async search() {
      let searchValue = this.searchValue;
      let companyCodeList = this.companyCodeList;
      if (companyCodeList.length == 0) {
        this.$alert("保险公司信息获取失败！");
        return false;
      }
      if (searchValue && companyCodeList.length > 0) {
        let result = await api.searchInsurance({
          companyIds: companyCodeList,
          queryStr: searchValue,
          pageNum: 1,
          pageSize: 1000
        });
        if (result.status == 1) {
          if (result.data) {
            this.insurances = result.data;
            this.searchStatus = true;
          } else {
            this.searchStatus = true;
            this.insurances = [];
          }
        } else {
          this.$alert(result.msg);
        }
      } else {
        this.searchStatus = false;
      }
    },
    changeValue() {
      let searchValue = this.searchValue;
      this.search();
      if (searchValue == "") {
        this.searchStatus = false;
      }
    },
    async addhistory(item, type) {
      if (type == 0) {
        let result = await api.addInsuranceHistory({
          productName: item.productName,
          productNo: item.productNo,
          companyId: item.companyId
        });
        if (result.status == 1) {
          this.$store.state.insurance.push(item);
          this.searchValue = "";
          this.searchStatus = false;
          this.$router.go(-1);
        } else {
          this.$alert(result.msg);
        }
      } else {
        this.$store.state.insurance.push(item);
        this.$router.go(-1);
      }
    },
    async deletehistory(item) {
      let id = item.searchHistoryId;
      let result = await api.deleteInsuranceHistory({
        id: id
      });
      if (result.status == 1) {
        let records = this.records;
        for (let i = 0; i < records.length; i++) {
          if (records[i].searchHistoryId == id) {
            records.splice(i, 1);
            break;
          }
        }
      } else {
        this.$alert(result.msg);
      }
    },
    async emptyHistory() {
      let result = await api.deleteInsuranceAllHistory();
      if (result.status == 1) {
        this.records = [];
      } else {
        this.$alert(result.msg);
      }
    },
    // 搜索清除
    clear(v) {
      this.searchValue = v;
      this.changeValue();
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

.search-insurance-page {
  background: #fff;
  color: #222;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .searchItem {
      padding: 15px 25px 25px 25px;
      background: #f2f2f2;
      height: auto;
      .serarch-text-container {
        .search-text {
          background: #fff;
          font-size: 32px;
          height: 88px;
          border-radius: 50px;
          padding-left: 50px;
        }
        .search-icon {
          width: 48px;
          height: 48px;
          margin: 16px 35px 0 0;
          background: url(../../assets/imgs/sousuo.png) no-repeat;
          background-size: 100% 100%;
        }
        .xIcon {
          display: none;
        }
      }
    }
    .hotword {
      margin: 40px 30px 0;
      overflow: hidden;
      .title {
        font-size: 36px;
        font-weight: 600;
      }
      .hotword-list {
        width: 110%;
        span {
          display: inline-block;
          width: 200px;
          height: 60px;
          text-align: center;
          line-height: 60px;
          border-radius: 10px;
          margin-right: 37px;
          margin-top: 20px;
          color: #666;
          background: #eaeaea;
        }
      }
    }
    .records {
      margin: 90px 30px 20px 30px;
      .title {
        font-size: 36px;
        overflow: hidden;
        line-height: 50px;
        font-weight: 600;
      }
      .empty-record {
        color: #28c76a;
        float: right;
        font-size: 30px;
        font-weight: normal;
      }
      .records-list {
        margin-top: 15px;
      }
      .records-li {
        height: 70px;
        line-height: 70px;
        font-size: 32px;
        text-align: center;
        overflow: hidden;
        span {
          float: left;
        }
        .name {
          width: 90%;
          text-align: left;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .date {
          width: 31%;
          color: #999;
        }
        .remove {
          width: 9%;
          text-align: right;
        }
        .icon-remove {
          color: #28c76a;
          width: 44px;
          height: 44px;
          position: relative;
          top: -6px;
        }
        em {
          font-style: normal;
        }
      }
    }
    .insurance-list {
      padding: 30px 30px 0;
      overflow: auto;
      .vux-flexbox-item {
        line-height: 26px;
        font-size: 16px;
        padding-bottom: 8px;
        color: #666;
        border-bottom: 1px #dedede solid;
        em {
          color: #f00;
          font-style: normal;
        }
      }
      .insurance-tips {
        line-height: 60px;
        color: #666;
        font-size: 34px;
      }
    }
  }
}
</style>
