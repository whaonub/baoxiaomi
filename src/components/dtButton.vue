<template>
  <x-button class="dt-btn" :style="style" :text="text" @click.native="btnClick">
  </x-button>
</template>

<script>
import { XButton } from "vux";
export default {
  name: "dtButton",
  components: {
    XButton
  },
  props: {
    text: {
      type: String,
      default: ""
    },
    radius: {
      type: Number,
      default: 45
    }
  },
  methods: {
    btnClick() {
      this.$emit("click");
    }
  },
  computed: {
    style() {
      return `border-radius: ${this.radius}px`;
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/mixin";
.dt-btn {
  height: 90px;
  /*border-radius: 45px;*/
  overflow: hidden;
  background: #28c76a;
  color: #fff;
  .active-op(0.7);
  font-size: 30px;
  &:after {
    display: none;
  }
}
</style>
