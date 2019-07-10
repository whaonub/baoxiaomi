<template>
  <div>
    <div class="doubPoster">
      <div v-if="flag == 1">
        <div>
          <div class="total">已累计签到{{count}}天~</div>
          <div class="reward">{{msg}}</div>
        </div>
        <div class="brand">
          <img
            :ref="`pic-${index}`"
            src="../../assets/imgs/brand.png"
            alt
            v-for="(item,index) in 6"
            :key="index"
            @click="handleClick(index)"
          >
          <!-- <img class="back" src="../../assets/imgs/sign-poster.png" alt="" v-for="(item,index) in 6" :key="index"> -->
        </div>
      </div>
      <div v-if="flag == 2">
        <div class="total">已累计签到{{count}}天~</div>
        <div class="reward">{{msg}}</div>
        <div class="lottery">
          <ul class="box">
            <li class="row">
              <div
                :class="['col-4' , {active : activeClass[index]}]"
                v-for="(prize,index) in lis1"
                :key="index"
              >
                <img :src="prize.img">
                <div>{{prize.font}}</div>
              </div>
            </li>
            <li class="row">
              <div :class="['col-4' , {active : activeClass[7]}]">
                <img :src="prizesList[7].img">
                <div>{{prizesList[7].font}}</div>
              </div>
              <div class="col-4" @click="startLottery">
                <!-- <img :src="lotteryBtn.img"> -->
              </div>
              <div :class="['col-4' , {active : activeClass[3]}]">
                <img :src="prizesList[3].img">
                <div>{{prizesList[3].font}}</div>
              </div>
            </li>
            <li class="row">
              <div
                :class="['col-4' , {active : activeClass[6-index]}]"
                v-for="(prize,index) in lis2"
                :key="index"
              >
                <img :src="prize.img">
                <div>{{prize.font}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
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
  name: "double",
  props: {
    msg: { type: String },
    count: { type: Number },
    flag: { type: Number },
    prizesList: {
      type: Array,
      default() {
        return [];
      }
    },
    lotteryBtn: {
      type: Object,
      default() {
        return {
          img: ""
        };
      }
    },
    beforeLottery: {
      type: Function,
      default() {
        throw new Error("you must define beforeLottery before draw a lottery ");
      }
    },
    afterLottery: {
      type: Function,
      // eslint-disable-next-line
      default() {
        console.warn("you can use afterLottery after rolling");
      }
    },
    prize: {
      type: Number,
      default: 0
    },
    speed: {
      type: Number,
      default: 100
    },
    cycle: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      activeClass: [false, false, false, false, false, false, false, false],
      index: -1,
      counts: 8,
      timer: null,
      times: 0,
      speedData: 100,
      lock: false,
      afterLotteryHandler: null,
      drawFlag: true
    };
  },
  computed: {
    lis1() {
      return this.prizesList.slice(0, 3);
    },
    lis2() {
      return this.prizesList.slice(4, 7).reverse();
    }
  },
  created() {
    this.speedData = this.speed;
    this.afterLotteryHandler = this.afterLottery;
  },
  beforeDestroy() {
    this.afterLotteryHandler = () => {};
  },
  methods: {
    share() {
      this.$emit("shared");
    },
    close() {
      this.$emit("closeDialog");
    },
    handleClick(index) {
      if (this.drawFlag) {
        let el = this.$refs[`pic-${index}`][0];
        el.className = "animate";
        this.drawFlag = false;
      }
      this.$emit("getDoubleId", index);
    },
    startLottery() {
      if (!this.lock) {
        let promise = () => {
          return new Promise((resolve, reject) => {
            this.lock = true;
            this.beforeLottery(resolve, reject);
          });
        };
        let start = async () => {
          try {
            await promise();
            this.roll();
          } catch (e) {
            e();
          }
        };
        start();
      }
    },
    _rollHandler() {
      var index = this.index;
      var counts = this.counts;
      for (let i = 0, len = this.activeClass.length; i < len; i++) {
        this.activeClass[i] = false;
      }
      index += 1;
      if (index > counts - 1) {
        index = 0;
      }
      this.activeClass[index] = true;
      this.index = index;
      return false;
    },
    roll() {
      // eslint-disable-next-line
      this.activeClass = this.activeClass.map(item => (item = false));
      this.times += 1;
      this._rollHandler();
      if (this.times > this.cycle + 10 && this.prize == this.index) {
        clearTimeout(this.timer);
        setTimeout(() => {
          this._showResult();
        }, 1000);
        this.lock = false;
        this.index = -1;
        this.counts = 8;
        this.timer = null;
        this.speedData = this.speed;
        this.times = 0;
      } else {
        if (this.times < this.cycle) {
          this.speedData -= 2;
        } else {
          if (
            this.times > this.cycle + 10 &&
            ((this.prize == 0 && this.index == 7) ||
              this.prize == this.index + 1)
          ) {
            this.speedData += 110;
          } else {
            this.speedData += 20;
          }
        }
        if (this.speedData < 40) {
          this.speedData = 40;
        }
        this.timer = setTimeout(() => {
          this.roll();
        }, this.speedData);
      }
      return false;
    },
    _showResult() {
      this.afterLotteryHandler();
    }
  }
};
</script>
<style lang="less">
.doubPoster {
  background: #fa5b65;
  color: #fff;
  padding-top: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  width: 600px;
  margin: 0 auto;
  .total {
    font-size: 30px;
    font-weight: 900;
    letter-spacing: 2px;
  }
  .reward {
    font-size: 26px;
    margin: 10px auto;
    letter-spacing: 1px;
  }
  .brand {
    display: flex;
    flex-wrap: wrap;
    background: #fef6f1;
    justify-content: space-around;
    padding: 40px 0;
    img {
      width: 30%;
      height: 240px;
      backface-visibility: hidden;
      transition: transform 1s ease;
      &:nth-of-type(n + 4) {
        margin-top: 10px;
      }
    }
    .animate {
      transform: rotateY(90deg);
    }
  }
  .lottery {
    height: 800px;
    background: url("../../assets/imgs/lottery.png") no-repeat;
    background-size: 100%;
    color: #000;
    padding-top: 240px;
    .box {
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex-wrap: wrap;
      width: 420px;
      height: 420px;
      li {
        margin-right: 6px;
        display: flex;
        height: 33.33%;
        justify-content: space-around;
        div {
          width: 140px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            height: 55px;
          }
          div {
            color: #000;
            font-size: 20px;
          }
        }
        .active {
          background: #fee559;
        }
      }
    }
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

