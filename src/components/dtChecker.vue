<template>
  <div class="dt-checker">
    <v-swiper :options="swiperOption">
      <vswiper-slide class="slide" v-for="(obj, index) in options" :key="index">
        <span :class="[stateList[index] ? selectedItemClass : defaultItemClass]" @click="select(index)">
          {{obj[nameKey]}}
        </span>
      </vswiper-slide>
    </v-swiper>
  </div>
</template>
<script>
import {
  swiper as VSwiper,
  swiperSlide as VswiperSlide
} from "vue-awesome-swiper";

export default {
  name: "dt-checker",
  components: { VSwiper, VswiperSlide },
  props: {
    value: {
      type: [String, Boolean, Number, Array]
    },
    options: {
      type: Array,
      default: () => [],
      required: true
    },
    type: {
      type: String,
      default: () => "radio"
    },
    valueMap: {
      type: Array,
      default: () => ["id", "text"]
    },
    defaultItemClass: {
      type: String,
      default: () => "span-box"
    },
    selectedItemClass: {
      type: String,
      default: () => "span-box active"
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 2,
        freeMode: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: false
        }
      },
      currentValue: this.value,
      stateList: []
    };
  },
  created() {
    this.valueKey = this.valueMap[0];
    this.nameKey = this.valueMap[1];

    this.initStateList(this.options, this.currentValue, this.type);
  },
  watch: {
    value(newValue) {
      this.currentValue = this.value;
    },
    currentValue(newValue) {
      this.initStateList(this.options, newValue, this.type);

      this.$emit("on-change", newValue);
      this.$emit("input", newValue);
    }
  },
  methods: {
    initStateList(data, value, type) {
      let ctx = this;
      ctx.stateList = [];
      for (let i = 0; i < data.length; i++) {
        ctx.stateList.push(false);
      }

      if (type === "radio") {
        data.forEach((ele, idx) => {
          if (ele[ctx.valueKey] === value) {
            ctx.stateList[idx] = true;
          } else {
            ctx.stateList[idx] = false;
          }
        });
      } else {
        data.forEach((ele, idx) => {
          if (value.includes(ele[ctx.valueKey])) {
            ctx.stateList[idx] = true;
          } else {
            ctx.stateList[idx] = false;
          }
        });
      }
    },
    select(idx) {
      let obj = this.getValue(idx, this);
      if (this.type === "radio") {
        this.selectRadio(obj[this.valueKey]);
      } else {
        this.selectCheckBox(obj[this.valueKey]);
      }
    },
    selectRadio(value) {
      this.currentValue = value;
    },
    selectCheckBox(value) {
      if (!isArray(this.currentValue)) {
        return;
      }
      let index = -1;
      index = this.currentValue.indexOf(value);
      if (index > -1) {
        this.currentValue.splice(index, -1);
      } else {
        this.currentValue.push(value);
      }
    },
    getValue(idx, ctx) {
      return ctx.options.find((obj, index) => {
        return index === idx;
      });
    }
  }
};

function isArray(arr) {
  return typeof list === "object" && list.length !== undefined;
}
</script>

<style lang="less" scoped>
@dt-f9545: #f95454;
@dt-ffffff: #ffffff;
@dt-iconcolor: #dedede;
@dt-fe852a: #fe852a;
@dt-333: #333333;
@dt-666: #666666;

.dt-checker {
  text-align: right;
  // overflow-x: auto;
  overflow: hidden;
  white-space: nowrap;
  height: 100%;
  padding: 1px 0;
  width: 100%;
  div {
    display: inline-block;
  }
  .slide {
    width: auto;
  }

  .benefit-box {
    height: 48px;
    border: 2px solid @dt-666;
    font-size: 30px;
    line-height: 48px;
    border-radius: 4px;
    text-align: center;
    display: inline-block;
    padding: 0 10px;
    margin-right: 43px;
    // &:not(:last-child) {
    //   margin-right: 43px;
    // }

    &.active {
      border: 2px solid @dt-f9545;
      background-color: @dt-f9545;
      color: @dt-ffffff;
    }
  }
}
</style>
