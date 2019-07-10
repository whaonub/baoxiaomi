<template>
  <div class="dt-pages card-addPhoto-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader  title="添加照片" rightText="保存"  @headerRight="add" :leftBack="false"  @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
        <div class="photo">
            <div>

            </div>
        </div>

    </div>
    <div class="dt-footer">
      <div class="dt-btn-box fz30">
        <div class="dt-btn-down" >上传照片</div>
        <div class="dt-pos-btn" :style="{display:$store.state.maskView}">上传照片</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tab, TabItem } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
export default {
  name: "addPhoto",
  components: {
    dtHeader,
    Tab,
    TabItem
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {},
    add() {},
    goBack() {
      this.$router.push({
        // path: "/examoptimizecomplete",
        // query: {
        //   orderId: this.orderId,
        //   companyId: this.companyId
        // }
      });
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

.card-addPhoto-page {
  background: #f7f7f7;
  .photo {
    margin: 30px;
    width: 690px;
    height: 690px;
    background-color: #e4e3e3;
    border-radius: 20px;
  }
  .dt-btn-box {
    width: 690px;
    bottom: 62px;
    margin: 0 32px;
    background-color: #28c76a;
    border-radius: 40px;
  }
  .dt-btn-down {
    background-color: #28c76a;
    border-radius: 40px;
    font-size: 36px;
    color: #ffffff;
  }
}
</style>


