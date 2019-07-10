<template>
  <div class="dt-pages card-searchLocation-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader
        title="所在位置"
        rightText="确定"
        :leftBack="false"
        @headerRight="save"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div class="dt-content">
      <div class="search-box" @click="showSearch = true">
        <x-input placeholder="搜索附近位置" :show-clear="false" :disabled="true">
          <div class="search-icon" slot="right"></div>
        </x-input>
      </div>
      <div class="city" v-if="list.length>0">{{city}}</div>
      <div class="city-content">
        <div
          class="nearby"
          v-for="(item,index) in list"
          :key="index"
          @click="citySelect(index,item)"
        >
          <div class="naerby-left">
            <div class="nearby-name">{{item.poiName}}</div>
            <div class="nearby-tltle">{{item.city}}{{item.district}}{{item.street}}</div>
          </div>
          <div class="nearby-select" v-if="indexList == index">
            <img src="../../assets/imgs/city-select.png" alt="选中">
          </div>
        </div>
      </div>
      <div class="naerby-center" v-if="list.length>0">
        <div>没有您要的地址请在上方搜索～</div>
      </div>
      <div class="city-tips" v-if="list.length==0">
        <img src="../../assets/imgs/loading.gif" alt="加载中">
      </div>
    </div>

    <div
      v-transfer-dom
      :class="{ios:$store.state.device=='ios',iPhoneX:$store.state.device=='iPhoneX'}"
    >
      <popup
        v-model="showSearch"
        style="background:#fff"
        position="left"
        width="100%"
        class="search-list"
      >
        <div class="dt-pages">
          <div class="dt-header">
            <div class="headerTop">
              <div class="page-title vux-1px-b">
                <div class="head-item search-item">
                  <input
                    class="search-input"
                    v-model="keyWords"
                    placeholder="搜索附近位置"
                    type="text"
                    @blur="changeValue"
                  >
                  <div class="search-del" v-if="keyWords">
                    <icon @click.native="delSearch" class="dt-icon clear" name="clear"></icon>
                  </div>
                  <span class="search" @click="handleQuery"></span>
                </div>
                <span class="add-search-text" @click="showSearch = false">取消</span>
              </div>
            </div>
          </div>
          <div class="dt-content">
            <div class="city" v-if="city">{{city}}</div>
            <div class="city-content">
              <div
                class="nearby"
                v-for="(item,index) in searchList"
                :key="index"
                @click="citySelect(index,item)"
              >
                <div class="naerby-left">
                  <div class="nearby-name" v-html="item.poiName"></div>
                  <div class="nearby-tltle">{{item.city}}{{item.district}}{{item.street}}</div>
                </div>
                <div class="nearby-select" v-if="indexList == index">
                  <img src="../../assets/imgs/city-select.png" alt="选中">
                </div>
              </div>
              <div class="city-tips" v-if="searchStatus">
                <img src="../../assets/imgs/loading.gif" alt="加载中">
              </div>
              <div class="naerby-center" v-if="searchList.length==0">
                <div>没有您要的地址请在上方搜索～</div>
              </div>
            </div>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
import { TransferDom, Popup, XInput } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils";

export default {
  directives: {
    TransferDom
  },
  name: "searchLocation",
  components: {
    dtHeader,
    Popup,
    XInput
  },
  data() {
    return {
      device: getDevice(),
      indexList: -1,
      showSearch: false,
      keyWords: "",
      position: {},
      city: "",
      list: [
        // {
        //   poiName: "是我十 年如一日迷失在高楼林立"
        // },
        // {
        //   poiName:
        //     "像我这样的人呐，从出生就陷入淤泥 ，只是活着便已用尽了全部力气"
        // },
        // {
        //   poiName: "你曾对我说过 生如逆旅"
        // }
      ],
      searchList: [],
      searchStatus: false
    };
  },
  created() {
    this.initData();
    let _this = this;
    //回调原生地址数据
    window.poiSearchCompleted = function(position) {
      let list = [];
      if (position) {
        list = JSON.parse(position);
        _this.searchList = JSON.parse(JSON.stringify(list));
      } else {
        _this.searchList = list;
      }
      _this.list = list;
      _this.searchStatus = false;
      let searchList = _this.searchList;
      for (let i = 0; i < searchList.length; i++) {
        searchList[i].newPoiName = searchList[i].poiName;
      }
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          list[i].newPoiName = list[i].poiName;
        }
        _this.city = list[0].city;
      }
    };
  },
  mounted() {},
  methods: {
    initData(keyWord) {
      //调用原生方法定位附近位置
      let str = null;
      const code =
        "01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|22|97|99";
      if (keyWord) {
        str = keyWord;
      }
      let clientInfo = this.$store.state.clientInfo;
      let device = this.device;
      if (device == "android") {
        if (
          clientInfo &&
          (clientInfo.appV == "1.0.1" || clientInfo.appV == "1.0.0")
        ) {
          bmAndroid.nativePoiSearch(str, 1000);
        } else {
          bmAndroid.nativePoiSearch(str, 1000, code);
        }
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.nativePoiSearch.postMessage({
          keyWord: str,
          distance: 1000,
          code: code
        });
      }
    },
    citySelect(val, data) {
      if (val == this.indexList) {
        this.position = {};
        this.indexList = -1;
        this.showSearch = false;
      } else {
        this.position = data;
        this.indexList = val;
        this.showSearch = false;
      }
    },
    delSearch() {
      this.keyWords = "";
      this.initData();
    },
    goBack() {
      this.$router.go(-1);
    },
    save() {
      this.$router.go(-1);
      if (this.position) {
        this.$store.commit("getPositionData", this.position);
      } else {
        this.$store.commit("getPositionData", {
          street: ""
        });
      }
    },
    //搜索高亮
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    handleQuery(event) {
      this.searchStatus = true;
      this.initData(this.keyWords);
      this.clearTimer();
      this.timer = setTimeout(() => {
        this.changeColor(this.searchList);
      }, 500);
    },
    changeColor(resultsList) {
      let data = [];
      for (let i = 0; i < resultsList.length; i++) {
        data.push({
          poiName: resultsList[i].poiName.replace(/<[^>]+>/g, ""),
          newPoiName: resultsList[i].newPoiName,
          city: resultsList[i].city,
          district: resultsList[i].district,
          street: resultsList[i].street
        });
      }
      data.map((item, index) => {
        if (this.keyWords && this.keyWords.length > 0) {
          // 高亮替换v-html值
          let replaceString;
          for (let i = 0; i < this.keyWords.length; i++) {
            // 匹配关键字正则
            let replaceReg = new RegExp(this.keyWords[i], "g");
            replaceString =
              '<span class="search-text_sod">' + this.keyWords[i] + "</span>";
            item.poiName = item.poiName.replace(replaceReg, replaceString);
          }
          if (replaceString) {
            data[index].poiName = item.poiName;
          }
        }
      });
      this.searchList = data;
    },
    changeValue() {
      if (this.keyWords == "") {
        this.initData();
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

.card-searchLocation-page {
  background: #fff;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .search-box {
    margin: 21px 32px;
    background-color: #f5f5f5;
    width: 687px;
    height: 90px;
    border-radius: 45px;
    .vux-x-input {
      padding: 0 0px;
      line-height: 45px;
      margin: 0 20px;
      font-size: 15px;
      color: #959494;
    }
  }
  .city {
    padding: 46px 0;
    font-size: 30px;
    color: #333333;
    padding-left: 30px;
    border-bottom: 1px solid #e8e8e8;
  }
  .nearby {
    padding: 21px 0 25px 30px;
    position: relative;
    border-bottom: 1px solid #e8e8e8;
    .nearby-name {
      padding-bottom: 19px;
      color: #333333;
      font-size: 30px;
    }
    .nearby-tltle {
      color: #999999;
      font-size: 26px;
    }
    .naerby-left {
      margin-right: 80px;
    }
    .nearby-select {
      position: absolute;
      right: 30px;
      top: 40%;
      width: 44px;
      height: 31px;
      img {
        width: 100%;
      }
    }
  }
}
.city-tips {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 64px;
  height: 64px;
  margin: -32px 0 0 -32px;
  img {
    width: 64px;
    height: 64px;
  }
}
.naerby-center {
  padding-top: 40px;
  padding-bottom: 50px;
  text-align: center;
  color: #cccccc;
  font-size: 24px;
}
.search-list {
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .dt-header {
    .headerTop {
      width: 100%;
      vertical-align: 88px;
      text-align: center;
      left: 0;
      top: 0;
      background: #28c76a;
      .title-name {
        text-align: center;
        font-weight: 700;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #fff;
      }
      .search-item {
        margin: 0 30px;
        position: relative;
        width: 606px;
        background-color: #ffffff;
        border-radius: 30px;
        .search-input {
          padding: 0 30px;
          width: 520px;
          font-size: 30px;
          height: 60px;
          background-color: #ffffff;
          border-radius: 30px;
          border: solid 2px #ffffff;
        }
        .search-del {
          position: absolute;
          right: 78px;
          top: 9px;
          width: 45px;
          .clear {
            width: 45px;
            height: 45px;
          }
        }
        .search {
          position: absolute;
          top: 7px;
          right: 20px;
          width: 48px;
          height: 48px;
          background: url(../../assets/imgs/sousuo.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      .page-title {
        height: 88px;
        padding: 14px 0px;
        vertical-align: 88px;
        text-align: left;
        .head-item {
          display: inline-block;
        }

        .add-search-text {
          // line-height: 10px;
          // display: block;
          // font-size: 18px;
          // letter-spacing: 1px;
          color: #fff;
          font-size: 32px;
        }
      }

      .rightIcon {
        color: #fff;
      }
    }
    .headerTop + div {
      margin-top: 88px;
    }
  }
  .city {
    padding: 46px 0;
    font-size: 30px;
    color: #333333;
    padding-left: 30px;
    border-bottom: 1px solid #e8e8e8;
  }
  .nearby {
    padding: 21px 0 25px 30px;
    position: relative;
    border-bottom: 1px solid #e8e8e8;
    .nearby-name {
      padding-bottom: 19px;
      color: #333333;
      font-size: 30px;
      .search-text_sod {
        color: #28c76a;
      }
    }
    .nearby-tltle {
      color: #999999;
      font-size: 26px;
    }
    .naerby-left {
      margin-right: 80px;
    }
    .nearby-select {
      position: absolute;
      right: 30px;
      top: 40%;
      width: 44px;
      height: 31px;
      img {
        width: 100%;
      }
    }
  }
  // 重置search框内清除图标样式
  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
}
</style>
