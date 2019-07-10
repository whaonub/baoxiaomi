<template>
    <div class="dt-pages task-rules">
        <div class="dt-header">
            <dtHeader title="任务规则" :leftIcon="true" :leftBack="false"  @headerLeft="goBack" ></dtHeader>
        </div>
        <div class="dt-content">
            <div class="rules">
                <div class="list" v-for="(item,index) in data" :key="index">
                    <div>{{item.id}}</div>
                    <div>{{item.text}}</div>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
import dtHeader from "@/components/dtHeader";

export default {
  name: "taskRules",
  components: {
    dtHeader
  },
  data() {
    return {
      data: [
        { id: 1, text: "完成每项新手任务均可领取相应奖励；" },
        { id: 2, text: "每日完成任务，可获得相应奖励；" },
        { id: 3, text: "全部完成新手任务即可获得抽奖一次，100%中奖；" },
        { id: 4, text: "活动最终解释权归保小秘所有。" }
      ]
    };
  },
  created() {
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
.task-rules {
  background: #ffffff;
  .dt-content {
    background: #ffffff;
    -webkit-overflow-scrolling: touch;
    .rules {
      padding-top: 6px;
      .list {
        display: flex;
        margin-top: 37px;
        div:nth-child(1) {
          width: 36px;
          height: 36px;
          background: #febc55;
          text-align: center;
          line-height: 36px;
          color: #ffffff;
          border-radius: 18px;
          margin: 0 30px;
        }
        div:nth-child(2) {
          font-size: 26px;
          color: #666666;
        }
      }
    }
  }
}
</style>

