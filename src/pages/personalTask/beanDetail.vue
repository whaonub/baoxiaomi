<template>
  <div class="dt-pages bean-detail">
    <div class="dt-header">
      <dtHeader title="金豆明细" :leftIcon="true" :leftBack="false" @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content" @scroll="scrollHandler">
      <div class="box">
        <div class="box-list" v-for="(item,index) in list" :key="index">
          <div class="left">
            <div class="title">{{item.taskName}}</div>
            <div class="time">{{item.createTime}}</div>
            <div
              class="num"
              :class="item.num > 0?'positive':'minus'"
            >{{item.num > 0?`+${item.num}`:item.num}}</div>
          </div>
        </div>
      </div>
    </div>
    <Tips :tips="tipsText" @refresh="refresh" v-if="showTip"></Tips>
  </div>
</template>
<script>
import dtHeader from "@/components/dtHeader";
import api from "@/api/index";
import dtScroll from "@/components/dtScroll";
import Tips from "@/components/tips";
export default {
  name: "beanDetail",
  components: {
    dtHeader,
    dtScroll,
    Tips
  },
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 13,
      isMore: true, //是否还有更多
      list: [],
      tipsText: "",
      showTip: false,
      total: "",
      moreStatus: true
    };
  },
  created() {
    this.initData();
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  methods: {
    initData() {
      this.showTip = false;
      this.tipsText = "";
      this.getList("0");
    },
    refresh() {
      this.initData();
    },
    goBack() {
      this.$router.go(-1);
    },
    scrollHandler(el) {
      let obj = el.srcElement;
      if (obj.offsetHeight + obj.scrollTop + 10 >= obj.scrollHeight) {
        if (this.isMore && this.moreStatus) {
          this.page++;
          this.moreStatus = false;
          this.getList("1");
        }
      }
    },
    async getList(status) {
      this.showTip = false;
      this.tips = "";
      let reuslt = await api.getDetailData({
        pageNum: this.page,
        pageSize: this.pageSize
      });
      if (reuslt.status == 1) {
        if (reuslt.data) {
          if (status == "0") {
            this.list = reuslt.data;
          } else {
            this.list = this.list.concat(reuslt.data);
          }
          this.total = reuslt.page.total;
          let total = Math.ceil(this.total / this.pageSize);
          if (this.page >= total) {
            this.isMore = false;
          } else {
            this.isMore = true;
          }
        } else {
          this.list = [];
          this.tipsText = "tips2";
          this.showTip = true;
        }
      } else {
        if (reuslt.type) {
          this.tipsText = "tips1";
          this.showTip = true;
        } else {
          this.$alert(reuslt.msg);
        }
      }
      this.moreStatus = true;
    }
  }
};
</script>
<style lang="less">
.bean-detail {
  .dt-content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .bean-list-content {
      position: relative;
      height: 100%;
      width: 100%;
      .bean-list-wrap {
        height: 100%;
        overflow-y: auto;
      }
    }
    .box {
      margin-top: 20px;
      background: #ffffff;
      padding: 0 30px;
      .box-list {
        padding: 20px 0;
        border-bottom: 2px solid #e8e8e8;
        .left {
          position: relative;
          .title {
            font-size: 28px;
            color: #333333;
            font-weight: 700;
            line-height: 50px;
            margin-bottom: 5px;
          }
          .time {
            font-size: 24px;
            color: #cccccc;
          }
          .num {
            position: absolute;
            bottom: 3px;
            right: 10px;
          }
        }
        .minus {
          color: #333;
        }
        .positive {
          color: #fcd222;
        }
      }
    }
  }
}
</style>

