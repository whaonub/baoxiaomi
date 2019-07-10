<template>
    <div class="articles">
        <div class="articles-content" v-for="(item,index) in articlesData" :key="index" @click="handleClick(item.bigShotShareId)">
            <div class="dt">
                <div class="dt-title">{{item.title}}</div>
                <div class="dt-textBox">{{item.introduce}}</div>
                <div class="dt-bottom">
                    <div>{{item.createTime}}</div>
                    <div>
                        <i class="zan eye_c"></i>
                        {{item.visitNum>0?item.visitNum:''}}
                    </div>
                </div>
            </div>
            <div class="dd">
                <img :src="item.imgUrl" alt="">
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "articles",
  props: {
    articlesData: { type: Array }
  },
  data() {
    return {};
  },
  methods: {
    handleClick(id) {
      this.$emit("toDetail", id);
    }
  }
};
</script>
<style lang="less">
.articles {
  background: #ffffff;
  padding: 0px 20px;
  .articles-content {
    display: flex;
    padding: 34px 10px;
    border-bottom: 2px solid #e8e8e8;
    .dt {
      width: 440px;
      padding-right: 24px;
      letter-spacing: 2px;
      .dt-title {
        font-size: 28px;
        color: #333333;
        font-weight: 700;
        line-height: 50px;
      }
      .dt-textBox {
        margin-top: 10px;
        font-size: 26px;
        color: #666666;
        line-height: 40px;
        height: 80px;
        overflow: hidden;
      }
      .dt-bottom {
        display: flex;
        margin-top: 10px;
        font-size: 24px;
        color: #666666;
        line-height: 40px;
        div:nth-child(1) {
          margin-right: 30px;
        }
        .zan {
          width: 30px;
          height: 28px;
          background-repeat: no-repeat;
          background-size: cover;
          position: relative;
          top: 5px;
          display: inline-block;
        }
        .eye_c {
          background-image: url("../../assets/imgs/eye_c.png");
          top: 5px;
        }
      }
    }
    .dd {
      img {
        position: relative;
        top: 20px;
        width: 250px;
        height: 125px;
      }
    }
  }
}
</style>

