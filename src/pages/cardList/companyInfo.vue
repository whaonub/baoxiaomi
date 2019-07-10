<template>
  <div class="dt-pages company-info">
    <div class="dt-header">
      <dtHeader title="公司简介" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <h3 class="title">{{companyFullName}}</h3>
      <div class="pic-box">
        <div class="pic-item">
          <img v-if="logo" :src="logo"/>
        </div>
      </div>
      <h3 class="tit">公司信息</h3>
      <div class="desc" v-html="tip"></div>
      <h3 class="tit">公司电话</h3>
      <div class="footer">
        <p class="desc">{{tel}}</p>
        <img @click="callPhone" class="phone" src="../../assets/imgs/c-phone.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils.js";
export default {
  components: {
    dtHeader
  },
  data() {
    return {
      device: getDevice(),
      companyFullName: "",
      tip: "",
      logo: "",
      tel: ""
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    async initData() {
      let companyId = this.$route.query.companyId;
      let result = await api.findCompanyInfo({
        id: companyId
      });
      if (result.status == 1) {
        if (result.data) {
          let companyInfo = result.data;
          this.companyFullName = companyInfo.companyFullName;
          this.tip = companyInfo.tip;
          this.logo = companyInfo.bigLogo;
          this.tel = companyInfo.tel;
        }
      } else {
        this.$alert("暂无保险公司信息");
      }
    },
    callPhone() {
      let tel = this.tel;
      window.location.href = `tel:${tel}`;
    },
    goBack() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.goHomePage();
      } else if (device == "ios" || device == "iPhoneX") {
        let isPc = this.$store.state.isPc;
        if (!isPc) {
          window.webkit.messageHandlers.goHomePage.postMessage(null);
        } else {
          this.$router.go(-1);
        }
      }
    }
  }
};
</script>
<style lang="less">
.company-info {
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 36px 30px;
    .title {
      font-size: 36px;
      color: #484848;
    }
    .pic-box {
      overflow-x: auto;
      width: 100%;
      margin: 24px 0 44px;
      .pic-item {
        text-align: center;
        border-radius: 16px;
        img {
          max-width: 700px;
        }
      }
    }
    .tit {
      font-size: 36px;
      color: #484848;
      border-bottom: 2px solid #ccc;
      padding-bottom: 14px;
    }
    .desc {
      font-size: 32px;
      color: #666;
      padding: 20px 0;
      line-height: 48px;
    }
    .phone {
      position: relative;
      top: 4px;
      width: 44px;
      height: 44px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
