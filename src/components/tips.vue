<template>
  <div class="all-wrap" @click="clickImg">
    <div class="tips">
      <p v-if="tips==='tips1'"><img src="../assets/imgs/noNetwork.png" alt="无网络"></p>
      <p v-if="tips==='tips1'">网络异常,请点击重试！</p>
      <p v-if="tips==='tips2'"><img src="../assets/imgs/noData.png" alt="无数据"></p>
      <p v-if="tips==='tips2'">暂无数据</p>
      <p v-if="tips==='tips3'"><img src="../assets/imgs/noReport.png" alt="无报告"></p>
      <p v-if="tips==='tips3'">暂无报告</p>
      <p v-if="tips==='tips4'"><img src="../assets/imgs/noReport.png" alt="无报告"></p>
      <p v-if="tips==='tips4'">暂无保单</p>
      <p v-if="tips==='tips5'"><img src="../assets/imgs/noDetailed.png" alt="无明细"></p>
      <p v-if="tips==='tips5'">暂无明细</p>
      <p v-if="tips==='tips6'"><img src="../assets/imgs/noImg.png" alt="无图片"></p>
      <p v-if="tips==='tips6'">暂无图片</p>
      <p v-if="tips==='tips7'"><img src="../assets/imgs/noMessage.png" alt="无消息"></p>
      <p v-if="tips==='tips7'">暂无消息</p>
      <p v-if="tips==='tips8'"><img src="../assets/imgs/noCollect.png" alt="无收藏"></p>
      <p v-if="tips==='tips8'">暂无收藏</p>
      <p v-if="tips==='tips9'"><img src="../assets/imgs/noBaozhang.png" alt="无保障"></p>
      <p v-if="tips==='tips9'">你怎么没有保障呢~</p>
      <p v-if="tips==='tips10'"><img src="../assets/imgs/noData.png"></p>
      <p v-if="tips==='tips10'">{{text}}</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    tips: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    }
  },
  watch: {},
  created() {},
  methods: {
    clickImg() {
      this.$emit("refresh", true);
    }
  }
};
</script>
<style  lang="less">
.all-wrap {
  overflow: hidden;
  width: 100%;
  text-align: center;
  padding-top: 50%;
  img {
    width: 260px;
  }
  .tips {
    margin-top: -120px;
  }
  p {
    font-size: 30px;
    color: #999;
  }
}
</style>