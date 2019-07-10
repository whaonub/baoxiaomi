<template>
  <div>
    <div v-if="totalStatus" class="total-dialog" @click="cancel" @scroll.prevent  @touchmove.prevent></div>
    <div class="policy-prompt" v-if="policyStatus">
      <p class="txt" @click="changeStatus(1)"><icon name="scanning" class="dt-icon scanning"></icon>智能扫描保单<check-icon class="check-box" :value.sync="scanning"></check-icon></p>
      <p class="txt" @click="changeStatus(2)"><icon name="entry-policy" class="dt-icon entry-policy"></icon>手工录入保单<check-icon class="check-box" :value.sync="entrypolicy"></check-icon></p>
      <p><button class="confirm" @click="confirm">确定</button></p>
    </div>
  </div>
</template>
<script>
import { CheckIcon } from "vux";
export default {
  components: {
    CheckIcon
  },
  data() {
    return {
      scanning: false,
      entrypolicy: false
    };
  },
  props: {
    totalStatus: {
      type: Boolean
    },
    policyStatus: {
      type: Boolean
    }
  },
  watch: {
    scanning() {
      if (this.scanning) {
        this.entrypolicy = false;
      }
    },
    entrypolicy() {
      if (this.entrypolicy) {
        this.scanning = false;
      }
    }
  },
  created() {},
  methods: {
    cancel() {
      this.$emit("popupCancel", true);
    },
    confirm() {
      let obj = {
        scanning: this.scanning,
        entrypolicy: this.entrypolicy
      };
      this.$emit("popupConfirm", obj);
    },
    changeStatus(type) {
      if (type == 1) {
        this.scanning = true;
        this.entrypolicy = false;
      } else {
        this.scanning = false;
        this.entrypolicy = true;
      }
    }
  }
};
</script>
<style  lang="less">
.total-dialog {
  position: fixed;
  height: 100vh;
  width: 100%;
  background: #000;
  left: 0;
  top: 0;
  opacity: 0.5;
  z-index: 1000;
  bottom: 0;
}
.policy-prompt {
  background: #fff;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 320px;
  margin: -160px -250px;
  z-index: 1001;
  color: #333333;
  font-size: 28px;
  padding: 10px;
  .dt-icon {
    color: #333333;
  }
  .txt {
    margin: 30px 0 43px 20px;
    line-height: 50px;
    height: 50px;
    position: relative;
  }
  .entry-policy {
    width: 60px;
    height: 60px;
    position: relative;
    top: -3px;
  }
  .scanning {
    margin-right: 11px;
    margin-left: 13px;
  }
  .check-box {
    margin-left: 150px;
    position: absolute;
    bottom: 0;
    right: 15px;
    .weui-icon-success {
      font-size: 19px;
    }
    .weui-icon-circle {
      font-size: 19px;
    }
  }
  .confirm {
    background: #28c76a;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #fff;
    border-radius: 10px;
    width: 100%;
    font-size: 30px;
  }
}
</style>