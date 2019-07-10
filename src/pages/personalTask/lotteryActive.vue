<template>
    <div class="lotteryActive">
        <div class="title">
            <div></div>
            <div>完成全部新手任务即可抽奖，100%中奖</div>
        </div>
        <div class="lottery" :class="isPrized==1?'lottery-disabled':'' ">
            <ul class="box">
                <li class="row">
                    <div :class="['col-4' , {active : activeClass[index]}]" v-for="(prize,index) in lis1" :key="index">
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
                    <div :class="['col-4' , {active : activeClass[6-index]}]" v-for="(prize,index) in lis2" :key="index">
                        <img :src="prize.img">
                        <div>{{prize.font}}</div>
                    </div>
                </li>
            </ul>
            <div class="lotteryMark" v-if="hideMark()">
                <div v-for="(item,index) in 12" :key="index" :class="hasDebris(index)">
                    <span><img src="../../assets/imgs/lock.png" alt="">{{item}}号碎片</span>
                </div>
            </div>
        </div>
        <div class="lottery-disabled display-none"></div>
    </div>
</template>
<script>
export default {
  name: "lotteryActive",
  props: {
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
    },
    debris: {
      type: Array
    },
    isPrized: {
      type: Number,
      default: 0
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
      afterLotteryHandler: null
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
      this.$emit("getDoubleId", index);
    },
    hideMark() {
      if (this.debris.length == 12) {
        return false;
      } else {
        return true;
      }
    },
    hasDebris(index) {
      let flag = false;
      this.debris.map(item => {
        if (item == index + 1) {
          flag = true;
        }
      });
      if (flag) {
        return "t" + index + " active";
      } else {
        return "t" + index;
      }
    },
    startLottery() {
      if (this.isPrized == 1) {
        return false;
      }
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
.lotteryActive {
  background: #fff;
  margin-top: 20px;
  padding-bottom: 20px;
  .title {
    display: flex;
    padding: 40px 30px;
    font-size: 30px;
    align-items: center;
    color: #232323;
    div:nth-child(1) {
      width: 10px;
      height: 32px;
      background: #28c76a;
      margin-right: 16px;
    }
  }
  .lottery {
    width: 690px;
    height: 834px;
    position: relative;
    margin: 0 auto;
    background: url("../../assets/imgs/lottery-active.png") no-repeat;
    background-size: 100%;
    color: #000;
    padding-top: 240px;
    .box {
      margin-left: 92px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex-wrap: wrap;
      width: 490px;
      height: 490px;
      li {
        display: flex;
        height: 33.33%;
        justify-content: flex-start;
        div {
          width: 33.33%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          img {
            height: 55px;
          }
          div {
            width: 100%;
            color: #000;
            font-size: 20px;
          }
        }
        .active {
          background: #fee559;
        }
      }
    }
    .lotteryMark {
      position: absolute;
      width: 700px;
      height: 700px;
      top: 134px;
      border-radius: 20px;
      color: #fff;
      font-size: 24px;
      display: flex;
      flex-wrap: wrap;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 33.3%;
        background-size: cover;
        background-repeat: no-repeat;
        opacity: 0.8;
        position: absolute;
        img {
          width: 36px;
          height: 27px;
        }
      }
      .t0 {
        left: 0;
        top: 0;
        background-image: url("../../assets/imgs/lottery/t0.png");
        width: 234px;
        height: 219px;
        span {
          position: relative;
          top: -20px;
        }
      }
      .t1 {
        left: 184px;
        top: -2px;
        background-image: url("../../assets/imgs/lottery/t1.png");
        width: 327px;
        height: 179px;
      }
      .t2 {
        right: 2px;
        top: -2px;
        background-image: url("../../assets/imgs/lottery/t2.png");
        width: 234px;
        height: 220px;
        span {
          position: relative;
          top: -20px;
        }
      }
      .t3 {
        left: 0;
        top: 176px;
        background-image: url("../../assets/imgs/lottery/t3.png");
        width: 280px;
        height: 219px;
        span {
          position: relative;
          top: -18px;
          left: -20px;
        }
      }
      .t4 {
        left: 232px;
        top: 134px;
        background-image: url("../../assets/imgs/lottery/t4.png");
        width: 234px;
        height: 221px;
        span {
          position: relative;
          top: 20px;
        }
      }
      .t5 {
        right: 2px;
        top: 174px;
        background-image: url("../../assets/imgs/lottery/t5.png");
        width: 280px;
        height: 221px;
        span {
          position: relative;
          top: -18px;
          left: 23px;
        }
      }
      .t6 {
        left: 2px;
        top: 352px;
        background-image: url("../../assets/imgs/lottery/t6.png");
        width: 234px;
        height: 179px;
      }
      .t7 {
        left: 188px;
        top: 314px;
        background-image: url("../../assets/imgs/lottery/t7.png");
        width: 329px;
        height: 217px;
        span {
          position: relative;
          top: 15px;
        }
      }
      .t8 {
        right: 0;
        top: 350px;
        background-image: url("../../assets/imgs/lottery/t8.png");
        width: 234px;
        height: 179px;
        span {
          position: relative;
          top: 15px;
        }
      }
      .t9 {
        left: 3px;
        bottom: -8px;
        background-image: url("../../assets/imgs/lottery/t9.png");
        width: 234px;
        height: 217px;
        span {
          position: relative;
          top: 17px;
        }
      }
      .t10 {
        left: 189px;
        bottom: -8px;
        background-image: url("../../assets/imgs/lottery/t10.png");
        width: 328px;
        height: 217px;
        span {
          position: relative;
          top: 17px;
        }
      }
      .t11 {
        right: 0;
        bottom: -7px;
        background-image: url("../../assets/imgs/lottery/t11.png");
        width: 234px;
        height: 219px;
        span {
          position: relative;
          top: 17px;
          left: 5px;
        }
      }
      .active {
        display: none;
      }
    }
  }
  .lottery-disabled {
    background: url("../../assets/imgs/lottery-active-disabled.png") no-repeat;
    background-size: 100%;
  }
  .display-none {
    display: none;
    height: 0;
    overflow: hidden;
  }
}
</style>

