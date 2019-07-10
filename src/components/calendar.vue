<template>
  <div class="calendar-content">
    <x-input
      class="sr_ipt sr_fr"
      type="tel"
      v-model="item.year"
      placeholder="输入"
      :max="4"
      :show-clear="false"
      @on-blur="conversionValue(pindex,index,0,item,...arguments)"
    ></x-input>年
    <x-input
      class="sr_ipt"
      type="tel"
      v-model="item.month"
      placeholder="输入"
      :max="2"
      :show-clear="false"
      @on-blur="conversionValue(pindex,index,1,item,...arguments)"
    ></x-input>月
    <x-input
      class="sr_ipt"
      type="tel"
      v-model="item.day"
      placeholder="输入"
      :max="2"
      :show-clear="false"
      @on-blur="conversionValue(pindex,index,2,item,...arguments)"
    ></x-input>日
    <datetime
      v-model="item.value"
      :start-date="startDate"
      :end-date="endDate"
      format="YYYY-MM-DD"
      year-row="{value}年"
      month-row="{value}月"
      day-row="{value}日"
      @on-change="validateInput(pindex,index,item,...arguments)"
      :title="item.name"
    >
      <span class="calendar"></span>
    </datetime>
  </div>
</template>
<script>
import { XInput, Datetime } from "vux";
export default {
  components: {
    Datetime,
    XInput
  },
  data() {
    return {
      endDate: "",
      startDate: this.calendarStartDate(),
      year: "",
      month: "",
      day: ""
    };
  },
  props: {
    item: {
      type: Object,
      default: ""
    },
    pindex: {
      type: Number,
      default: ""
    },
    index: {
      type: Number,
      default: ""
    }
  },
  watch: {},
  created() {
    this.calendarEndDate();
  },
  methods: {
    calendarEndDate() {
      var date = new Date();
      var month = parseInt(date.getMonth()) + 1;
      var day = date.getDate();
      var year = date.getFullYear();
      this.year = year;
      this.month = month;
      this.day = day;
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var newdate = year + "-" + month + "-" + day;
      this.endDate = newdate;
    },
    calendarStartDate() {
      return "1900-01-01";
    },
    validateInput(pindex, index, item, value) {
      let calendarObj = {
        pindex: pindex,
        index: index,
        item: item,
        value: value
      };
      this.$emit("validateValue", calendarObj);
    },
    conversionValue(pindex, index, value, item, data) {
      if (data) {
        data = data.replace(/[^\d]/g, "");
      }
      let calendarObj = {
        pindex: pindex,
        index: index,
        type: value
      };
      if (value == 0) {
        if (data.length < 4 || parseInt(data) < 1900) {
          data = "1900";
        }
        if (parseInt(data) > this.year) {
          data = this.year;
        }
        calendarObj.year = data;
      } else if (value == 1) {
        if (parseInt(data) > this.month && item.year == this.year) {
          data = this.month.toString();
        }
        if (parseInt(data) == 0) {
          data = "01";
        } else if (parseInt(data) < 10 && data.length == 1) {
          data = "0" + data;
        } else if (parseInt(data) > 12) {
          data = "12";
        }
        calendarObj.month = data;
      } else if (value == 2) {
        if (
          parseInt(data) > this.day &&
          item.year == this.year &&
          item.month == this.month
        ) {
          data = this.day.toString();
        }
        if (parseInt(data) == 0) {
          data = "01";
        } else if (parseInt(data) < 10 && data.length == 1) {
          data = "0" + data;
        } else if (parseInt(data) > 31) {
          data = "31";
        }
        calendarObj.day = data;
      }
      if (
        item.year == this.year &&
        item.month == this.month &&
        item.day >= this.day
      ) {
        calendarObj.day = this.day.toString();
      }
      this.$emit("transfervalue", calendarObj);
    }
  }
};
</script>
<style  lang="less">
.calendar-content {
  font-size: 28px;
  .weui-cell {
    padding: 5px;
  }
  .weui-cell:before {
    border: none;
  }
  .sr_ipt {
    padding: 8px 0;
    margin-left: 10px;
    display: inline-block;
    .weui-cell__hd {
      width: auto;
    }
    .weui-cell__bd {
      width: 32px;
    }
  }
  .sr_fr {
    margin-left: 0;
    margin-right: 5px;
    .weui-cell__bd {
      min-width: 36px;
    }
  }
  .weui-cell__bd .weui-input {
    text-align: center;
  }
  .weui-cell__bd .weui-input::-webkit-input-placeholder {
    text-align: left;
  }
  .calendar {
    width: 40px;
    height: 40px;
    position: relative;
    display: inline-block;
    top: 3px;
    background-image: url("../assets/imgs/date.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .vux-datetime {
    position: absolute;
    right: 0;
    top: 3px;
  }
}
</style>