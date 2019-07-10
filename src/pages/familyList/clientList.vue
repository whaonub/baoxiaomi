<template>
  <div class="dt-pages client-list-page">
    <div class="dt-header">
      <dtHeader title="客户列表" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <search-item
        placeholder="搜索"
        @input="changeValue"
        @clear="clear"
        v-model.trim="familyListParam.inputValue"
      ></search-item>

      <div v-if="!searchStatus" class="insurance-list">
        <div class="index-list">
          <dtScroll
            ref="wrap"
            class="wrapper"
            :pullup="isMore"
            :data="clientData"
            :pulldown="true"
            @scrollToEnd="scrollToEnd"
            @pulldown="pulldown"
          >
            <ul class="index-list-wrap" ref="indexWrap">
              <li class="index-group" ref="indexGroup">
                <ul>
                  <li
                    :style="customerId == item.customerId?'background: #f2fff7;': ''"
                    @click="clickItem(item)"
                    v-for="(item,index) in clientData"
                    :key="index"
                    class="index-group-item"
                  >
                    <p class="index-item-head">
                      <span>{{item.customerAlias}}</span>
                      <span v-if="item.familyName != null">
                        来自
                        <font
                          :color="item.familyName.split(',').length > 1?'#28c76a': ''"
                        >{{item.familyName | formatFamilyName}}</font>
                        的家庭
                      </span>
                    </p>
                    <div class="gender">
                      <p class="index-item-main">
                        <span class="index-item-info">{{item.gender == 1?'男':'女'}}</span>
                        <span class="index-item-info index-item-age">{{item.age}}岁</span>
                      </p>
                      <span class="remark">备注：{{item.remark}}</span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </dtScroll>
        </div>
      </div>
      <Tips :tips="tipsText" @refresh="refresh" v-if="searchStatus"></Tips>
    </div>
  </div>
</template>
<script>
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import dtScroll from "@/components/dtScroll";
import SearchItem from "@/components/searchItem";
import Tips from "@/components/tips";
import { getDevice } from "@/config/utils.js";
export default {
  name: "clientList",
  components: {
    dtHeader,
    SearchItem,
    dtScroll,
    Tips
  },
  data() {
    return {
      device: getDevice(),
      isMore: true, //是否还有更多
      searchValue: "",
      searchStatus: false,
      clientData: [],
      customerId: "",
      familyListParam: {
        inputValue: "",
        pageNum: 1,
        pageSize: 20
      },
      tipsText: ""
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    // this.initData();
    this.pulldown();
  },
  filters: {
    // 格式化家庭名称
    formatFamilyName(val) {
      let nameArr = val.split(",");
      return nameArr.join("、");
    }
  },

  methods: {
    // 初始化数据
    async initData() {
      this.customerId = this.$route.query.customerId;
      this.familyListParam.pageNum = 1;
      let res = await api.customerList(this.familyListParam);
      if (res.status == 1) {
        if (res.data) {
          this.clientData = res.data;
          this.searchStatus = false;
        } else {
          this.clientData = [];
          this.tipsText = "tips2";
          this.searchStatus = true;
        }
      } else {
        // this.clientData = [];
        this.$alert(res.msg);
        return;
      }
    },
    // 返回
    goBack() {
      let from = this.$route.query.from;
      let device = this.device;
      if (from) {
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
        this.$router.go(-1);
      }
      // this.isMore = true;
    },
    // 搜索
    search() {
      let searchValue = this.familyListParam.inputValue;
      if (searchValue) {
        this.searchStatus = true;
      } else {
        this.searchStatus = false;
      }
      this.initData();
    },
    changeValue() {
      let searchValue = this.familyListParam.inputValue;
      this.search();
      if (searchValue == "") {
        this.searchStatus = false;
      }
    },
    //下拉刷新加载
    pulldown() {
      this.clientData = [];
      this.isMore = true;
      this.initData();
    },
    //触底加载更多
    async scrollToEnd() {
      if (this.isMore == true) {
        this.familyListParam.pageNum++;
        let res = await api.customerList(this.familyListParam);
        if (res.data == null) {
          this.isMore = false;
          return;
        }
        this.clientData.push(...res.data);
      }
    },
    // 搜索清除
    clear(v) {
      this.searchValue = v;
      if (this.searchValue) {
        this.searchStatus = true;
      } else {
        this.searchStatus = false;
      }
    },
    // 选中客户保存到store
    clickItem(v) {
      this.$store.commit("saveCustomerData", v);
      this.$router.go(-1);
    },
    refresh() {
      this.pulldown();
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

.client-list-page {
  background: #fff;
  color: #222;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    .searchItem {
      padding: 6px 25px 25px 25px;
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

    .insurance-list {
      // margin: 0 30px;
      // padding-top: 15px;
      position: absolute;
      top: 120px;
      bottom: 0;
      width: 100%;

      .index-list {
        position: relative;
        width: 100%;
        height: 100%;
        background: #fff;
        .index-list-wrap {
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          .index-group {
            > ul {
              // padding: 0 30px;
              font-size: 32px;
              line-height: 36px;
              color: #222;
              .index-group-item {
                padding: 20px 0;
                border-bottom: 2px solid #dedede;
                &:active {
                  background-color: rgba(0, 0, 0, 0.1);
                }
                .index-item-head {
                  padding: 0 30px;
                  margin-bottom: 20px;
                  font-size: 32px;
                  color: #333;
                  font-weight: bold;
                  letter-spacing: 1px;
                  span:first-child {
                    width: 182px;
                    display: inline-block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                  }
                  span:nth-child(2) {
                    font-size: 28px;
                    color: #232323;
                    margin-left: 10px;
                    font-weight: normal;
                    width: 480px;
                    display: inline-block;
                    vertical-align: middle;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }
                .gender {
                  padding: 0 30px;
                  .index-item-main {
                    display: inline-block;
                    width: 172px;
                    margin-right: 20px;
                    .index-item-info {
                      font-size: 28px;
                      letter-spacing: 1px;
                      color: #999999;
                    }
                    .index-item-age {
                      margin-left: 28px;
                    }
                  }
                  .remark {
                    width: 480px;
                    display: inline-block;
                    font-size: 28px;
                    letter-spacing: 1px;
                    color: #999999;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                  }
                }

                .customer-list-isTrusteeship {
                  display: inline-block;
                  width: 56px;
                  height: 56px;
                  background-color: #28c76a;
                  border: solid 2px #28c76a;
                  opacity: 0.79;
                  border-radius: 50%;
                  line-height: 56px;
                  text-align: center;
                  font-size: 20px;
                  color: #fff;
                  margin-right: 22px;
                  overflow: hidden;
                  vertical-align: middle;
                }
                .customer-list-noTrusteeship {
                  display: inline-block;
                  width: 56px;
                  height: 56px;
                  background-color: #fff;
                  border: solid 2px #28c76a;
                  opacity: 0.79;
                  border-radius: 50%;
                  line-height: 56px;
                  text-align: center;
                  font-size: 20px;
                  color: #28c76a;
                  margin-right: 22px;
                  overflow: hidden;
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
