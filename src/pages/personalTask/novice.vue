<template>
    <div class="novice">
        <div class="tabList" v-for="(item,index) in tabListData" :key="index">
            <div class="taskName">
                <img :src="item.taskIcon" alt="">
                <div>
                    <div class="title">
                        {{item.taskName}}
                        <span>+{{item.point}}金豆{{item.repeatNum > 1?'/次':''}}</span>
                    </div>
                    <div class="text">{{item.taskMsg}}<span v-if="item.repeatNum > 1">({{item.completeNum}}/{{item.repeatNum}})</span></div>
                </div>
            </div>
            <div class="taskStatus">
                <div v-if="item.taskStatse==1" @click="doTask(item)">去做任务</div>
                <div v-if="item.taskStatse==2" class="active-lingqu" @click="handleClick(item.taskId,item.point)">领取金豆</div>
                <div v-if="item.taskStatse==3" class="active-finish">已完成</div>
            </div>
        </div>
    </div>
</template>
<script>
import api from "@/api/index";

export default {
  name: "novice",
  props: {
    tabListData: { type: Array },
    getReward: { type: Function }
  },
  data() {
    return {};
  },
  methods: {
    // 做任务
    doTask(item) {
      this.$emit("goToTask", item);
    },
    // 领取金豆
    handleClick(taskId, point) {
      this.$emit("getReward", taskId, point);
    }
  }
};
</script>
<style lang="less">
.novice {
  padding: 0 30px;
  background: #ffffff;
  .tabList {
    display: flex;
    height: 138px;
    border-bottom: 2px solid #e8e8e8;
    align-items: center;
    justify-content: space-between;
    img {
      width: 60px;
      height: 58px;
      margin-right: 20px;
    }
    .taskName {
      display: flex;
      align-items: center;
      width: 500px;
      .title {
        font-size: 30px;
        color: #333333;
        span {
          color: #f96015;
          font-size: 28px;
        }
      }
      .text {
        font-size: 28px;
        color: #999999;
        width: 400px;
        span {
          color: #fda110;
        }
      }
    }
    .taskStatus {
      width: 180px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      color: #ffffff;
      font-size: 28px;
      div {
        background: #28c76a;
        border-radius: 30px;
      }
      .active-lingqu {
        background: #fda110;
      }
      .active-finish {
        background: #e9e8e8;
      }
    }
  }
  .tabList:last-child {
    border: 0;
  }
}
</style>

