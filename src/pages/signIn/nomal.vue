<template>
  <div>
    <div class="poster">
      <div v-if="flag == 100">
        <div class="reward active">{{msg}}</div>
      </div>
      <!-- <div v-else-if="count == daysNumLeg">
        <div class="total">已累计签到{{count}}天~</div>
        <div class="reward">恭喜获得2个金豆</div>
      </div>-->
      <div v-if="flag == 0">
        <div class="total">已累计签到{{count}}天~</div>
        <div class="reward">{{msg}}</div>
      </div>
      <img :src="url" alt>
    </div>
    <div class="cancelBox" @click="close">
      <icon name="cancel" class="dt-icon cancel"></icon>
    </div>
    <!-- <div class="share" @click="share">
      <span>分享可得2个金豆</span>
      <icon name="shareb" class="dt-icon shareb"></icon>
    </div>-->
  </div>
</template>
<script>
export default {
  name: "nomal",
  props: {
    count: { type: Number },
    flag: { type: Number },
    url: { type: String },
    msg: { type: String }
  },
  data() {
    return {};
  },
  methods: {
    share() {
      this.$emit("shared");
    },
    close() {
      this.$emit("closeDialog");
    }
  }
};
</script>
<style lang="less">
.poster {
  background: #fff;
  padding-top: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 0 0 20px 20px;
  }
  .total {
    font-size: 28px;
    font-weight: 900;
    color: #2bc86b;
    letter-spacing: 2px;
  }
  .reward {
    font-size: 26px;
    color: #999999;
    margin: 5px auto;
    letter-spacing: 2px;
    padding: 10px 40px;
  }
  .active {
    text-align: left;
    line-height: 50px;
    color: #000;
  }
}
.cancelBox {
  position: absolute;
  top: -70px;
  right: 0;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  text-align: center;
  line-height: 60px;
}
.share {
  color: #fff;
  margin-top: 30px;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
