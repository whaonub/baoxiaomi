<template>
  <div class="dt-pages recommended-strategy">
    <div class="dt-header">
      <dtHeader title="推荐攻略" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <div class="main"></div>
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
    return {};
  },
  created() {
    window.shareResult = function() {};
    window.buttonReturn = () => {
      this.goBack();
      return "buttonReturn";
    };
    this.initData();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    initData() {},
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
.recommended-strategy {
  background-color: #fea767;
  .dt-header {
    background: none;
    .headerTop {
      background: none;
    }
  }
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .main {
      width: 680px;
      height: 1140px;
      background: url("../../assets/imgs/recommended-strategy.png") no-repeat
        left bottom;
      background-size: 100%;
      border-radius: 20px;
      margin: 30px auto;
    }
  }
}
</style>
