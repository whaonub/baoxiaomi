<template>
  <div class="dt-pages edit-family-name">
    <div class="dt-header">
      <dtHeader title="修改家庭昵称" textColor="#fff" textWeight="bold" @headerRight="saveBtn" rightText="完成" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" ref="wrap">
      <group>
        <x-input ref="familyName" :max="7" :is-type="validateVal" placeholder="请填写家庭昵称" v-model="familyName" show-clear required></x-input>
      </group>
    </div>
  </div>
</template>
<script>
import { XInput, Group } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
export default {
  components: {
    XInput,
    Group,
    dtHeader
  },
  data() {
    return {
      familyName: "",
      validateVal: val => {
        let reg = /^[\u4e00-\u9fa5a-zA-Z0-9\-_]+[\u4e00-\u9fa5a-zA-Z0-9\-_]*$/;
        return {
          valid: reg.test(val),
          msg: "只支持中英文、数字、下划线"
        };
      }
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
    initData() {
      this.familyName = this.$route.query.name;
    },
    goBack() {
      this.$router.go(-1);
    },
    async saveBtn() {
      let el = this.$refs.familyName;
      if (!el.valid) {
        el.focus();
        this.$toast(el.firstError);
        return;
      }
      let res = await api.updateFamilyName({
        familyId: this.$route.query.familyId,
        familyName: this.familyName
      });
      this.$router.go(-1);
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

.edit-family-name {
  .dt-content {
    // padding: 0 2%;
    // padding-bottom: 100px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    font-size: 30px;
    color: #333;
    .weui-cells {
      margin-top: 10px;
    }
  }
}
</style>
