<template>
  <div class="dt-pages card-seeRecord-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader  title="访客记录"  :leftBack="false"  @headerLeft="goBack"></dtHeader>
    </div>
    <div class="dt-content">
       <dt-scroll ref="listView" v-if="seeData.length > 0" :listenScroll="true" :probeType="probeType" :pullup="isMore" @scrollToEnd="scrollSearch">
        <div v-for="(item,index) in seeData" :key="index">
          <p class="day">{{item.date}}</p>
          <div v-for="(items,index) in item.visitors" :key="index" >
            <flexbox :gutter="0" style="background:#fff; padding:10px 14px">
              <flexbox-item :span="1.6" >
                <img class="name-img" v-if="items.image" :src="items.image" />
                <img class="name-img" v-if="!items.image" src="../../assets/imgs/name-my.jpg" />
              </flexbox-item>
              <flexbox-item>
                  <div class="name">{{items.nickName?items.nickName:'游客'}}</div>
              </flexbox-item>
              <flexbox-item align="right">
                <div class="time">{{items.time}}</div>
              </flexbox-item>
            </flexbox>
            <div class="line"></div>
          </div>

        </div>
       </dt-scroll>
       <tips v-if="seeData.length == 0" text="暂无数据" tips="tips10"></tips>
    </div>
  </div>
</template>
<script>
import { Tab, TabItem, Flexbox, FlexboxItem, Scroller } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import DtScroll from "@/components/dtScroll";
import tips from "@/components/tips";
export default {
  name: "seeRecord",
  components: {
    dtHeader,
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem,
    Scroller,
    DtScroll,
    tips
  },
  data() {
    return {
      isMore: true,
      queryObj: {
        endRow: 0,
        pageNum: 1,
        pageSize: 9,
        pages: 0,
        startRow: 0,
        total: 0
      },
      queryDate: {
        dateStr: "2018-09-14"
      },
      seeData: []
    };
  },
  created() {
    // 为了区分页面绑定的data和临时变量
    this.probeType = 3;
  },
  mounted() {
    this.isMore = true;
    this.initData();
  },
  methods: {
    scrollSearch() {
      if (this.isMore == true) {
        //this.$vux.loading.show();
        this.queryObj.pageNum++;
        this.initData();
      }
    },
    async initData() {
      let results = await api.getVisitor(this.queryObj);
      let ctx = this;
      if (results.status == 1) {
        if (results.data != null) {
          for (let i = 0; i < results.data.length; i++) {
            let now = new Date(results.data[i].date.replace(/\-/g, "/"));

            let month = now.getMonth() + 1;
            let date = now.getDate();
            results.data[i].date = month + "月" + date + "日";
            for (let l = 0; l < results.data[i].visitors.length; l++) {
              let n = new Date(results.data[i].visitors[l].createTime);
              let hours = n.getHours();
              let minutes = n.getMinutes();
              results.data[i].visitors[l].createTime = hours + ":" + minutes;
            }
          }
          if (this.seeData.length > 0) {
            this.seeData = this._.concat(this.seeData, results.data);
          } else {
            this.seeData = this._.concat(this.seeData, results.data);
          }
        } else {
          this.isMore = false;
        }
      }
    },
    selectMember(item) {},

    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
// 注意：在rootValue = 750px的设计稿中
// 现在 title cell 的高度为125
// 普通cell的高度为100
@dt-bbbbbb: #bbbbbb;
@dt-f9545: #f95454;
@dt-ffffff: #ffffff;
@dt-iconcolor: #dedede;

.card-seeRecord-page {
  background: #f7f7f7;
  .dt-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .vux-1px-b:after {
    border: none;
  }
  .day {
    height: 82px;
    width: 100%;
    line-height: 82px;
    padding-left: 28px;
  }

  .name-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .time {
    font-size: 22px;
    color: #999999;
  }
  .name {
    font-size: 28px;
  }
  .line {
    margin-left: 28px;
    border: solid 1px #f7f7f7;
  }
}
</style>
