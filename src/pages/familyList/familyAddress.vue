<template>
  <div class="dt-pages family-address">
    <div class="dt-header">
      <dtHeader title="地址" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="main" v-for="(item,index) in addressList" :key="index">
        <div class="main-info">
          <p class="main-info-top">
            <span>[地址{{index + 1}}]</span>
            <span @click="gotoNativeMap(0)" class="map-right">
              <span class="map-bg">
                <icon class="dt-icon map" name="map"></icon>
              </span>
              <span>地图</span>
            </span>
          </p>
          <p class="main-info-middle">{{item.detailAddr}}</p>
          <p class="main-info-bottom">{{item.province}} {{item.city}} {{item.area}}</p>
        </div>
        <p @click="gotoNativeMap(0)" class="toHere">到这里</p>
      </div>

      <!-- <div v-if="addressList.length == 0" style="text-align: center">
        <img src="../../assets/imgs/noData.png" alt="">
        <h3 style="color: #28c76a">暂无地址，请完善信息</h3>
      </div> -->
      <tips v-if="addressList.length == 0" text="暂无地址，请完善信息" tips="tips10"></tips>
    </div>
  </div>
</template>
<script>
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import tips from "@/components/tips";
import { scrollToElement, getDevice } from "@/config/utils.js";
export default {
  components: {
    dtHeader,
    tips
  },
  data() {
    return {
      addressList: [],
      device: getDevice()
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  mounted() {},
  activated() {},
  watch: {},
  computed: {},
  methods: {
    async initData() {
      let res = await api.findCustomerAddr({
        id: this.$route.query.id
      });
      if (res.data == null) {
        this.addressList = [];
      } else {
        this.addressList = res.data;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    gotoNativeMap(v) {
      let address =
        this.addressList[v].province +
        this.addressList[v].city +
        this.addressList[v].area +
        this.addressList[v].detailAddr;
      let device = this.device;
      if (device == "android") {
        bmAndroid.openNativeMap(address, v);
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.openNativeMap.postMessage({
          val: address,
          type: v
        });
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

.family-address {
  .dt-content {
    padding: 20px;
    // padding-bottom: 100px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .main {
      margin-bottom: 20px;
      box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.06);
      width: 710px;
      height: 280px;
      border-radius: 10px;
      background-color: #fff;
      // padding: 0 10px;
      .main-info {
        height: 200px;
        border-bottom: 2px solid #e8e8e8;
        padding: 20px 30px 30px;
        margin: 0 10px;
        font-size: 30px;
        .main-info-top {
          color: #666;
          margin-bottom: 16px;
          .map-right {
            float: right;
            &:active {
              opacity: 0.7;
            }
            .map-bg {
              display: inline-block;
              width: 44px;
              height: 44px;
              background-color: #666;
              border-radius: 50%;
              line-height: 44px;
              text-align: center;
              .map {
                width: 36px;
                height: 36px;
                color: #fff;
              }
            }
          }
        }
        .main-info-middle {
          color: #333;
          font-size: 30px;
          padding-top: 10px;
          padding-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .main-info-bottom {
          font-size: 26px;
          color: #999;
        }
      }
      .toHere {
        text-align: center;
        height: 80px;
        line-height: 80px;
        color: #28c76a;
        font-size: 30px;
        &:active {
          opacity: 0.7;
          background-color: rgba(163, 145, 145, 0.2);
        }
      }
    }
  }
}
</style>
