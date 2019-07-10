<template>
  <div class="dt-pages invitingFace">
    <div class="dt-header">
      <dtHeader title="面对面邀请好友" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
      <!-- <img src="../../assets/imgs/twoCode.png" alt=""> -->
      <img :src="QRcode" alt="">
      <div>扫一扫二维码</div>
    </div>
  </div>
</template>
<script>
import dtHeader from "@/components/dtHeader";
import api from "@/api/index";

export default {
  name: "invitingFace",
  components: {
    dtHeader
  },
  data() {
    return {
      QRcode: ""
    };
  },
  created() {
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  methods: {
    async initData() {
      let res = await api.getQRCode();
      if (res.status == 1) {
        this.QRcode = res.data.str;
      } else {
        this.$alert(res.msg);
        return;
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
.invitingFace {
  .dt-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    img {
      width: 400px;
      margin-bottom: 20px;
    }
  }
}
</style>
