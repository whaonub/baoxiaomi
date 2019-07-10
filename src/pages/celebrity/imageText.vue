<template>
    <div class="image-text">
        <div class="title">
            <div class="title-top">
                {{detailData.title}}
            </div>
            <div class="label">
                <div v-for="item in detailData.labels" :key="item.index">{{item}}</div>
            </div>
            <div class="evaluate">
                <div class="date">{{detailData.createTime}}</div>
                <div class="evaluate-label">
                    <div>
                        <i class="zan eye_c"></i>
                        <span>{{detailData.visitNum}}</span>
                    </div>
                    <div @click="collectClick(detailData.bigShotShareId)">
                        <i class="star star_c" v-if="!flag"></i>
                        <i class="star star_d" v-else></i>
                        <span>收藏</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="html">
            <div class="html-title" v-if="detailData.bigShotShareType == '3'">
                {{detailData.contentTip}}
            </div>
            <div class="html-content" v-html="detailData.content" @click="imgClick($event)"></div>
            <div class="praise">
                <img @click="praiseClick(detailData.bigShotShareId)" src="../../assets/imgs/praise2.png" v-if="isPraise" alt="赞">
                <img @click="praiseClick(detailData.bigShotShareId)" src="../../assets/imgs/praise.png"  v-else alt="赞">
                <div>{{likeNum}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "imageText",
  props: {
    detailData: { type: Object },
    flag: { type: Boolean },
    isPraise: { type: Boolean },
    likeNum: { type: Number }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    imgClick(event) {
      if (event.target.nodeName == "IMG") {
        this.$emit("getSrc", event.target.currentSrc);
      }
    },
    // 点击收藏与取消
    collectClick(id) {
      this.$emit("collect", id);
    },
    // 点击点赞与取消
    praiseClick(id) {
      this.$emit("praise", id);
    }
  }
};
</script>
<style lang="less">
.image-text {
  .title {
    padding: 40px 30px 30px;
    background: #fff;
    .title-top {
      font-size: 36px;
      font-weight: 900;
      color: #000;
      display: flex;
      align-items: center;
      span {
        width: 64px;
        border-top: 4px solid #000;
      }
    }
    .label {
      display: flex;
      font-size: 22px;
      margin: 20px 0 30px;
      div {
        padding: 5px 20px;
        border-radius: 19px;
      }
      div:nth-child(1) {
        color: #2d7cfe;
        border: 1px solid #2d7cfe;
      }
      div:nth-child(2) {
        color: #28c76a;
        border: 1px solid #28c76a;
        margin: 0 10px;
      }
      div:nth-child(3) {
        color: #fe801a;
        border: 1px solid #fe801a;
      }
    }
    .evaluate {
      display: flex;
      justify-content: space-between;
      line-height: 40px;
      height: 40px;
      font-size: 28px;
      .date {
        color: #999999;
      }
      .evaluate-label {
        display: flex;
        div {
          margin-left: 30px;
          span {
            margin-left: 10px;
            position: relative;
            top: 4px;
          }
        }
        .eye {
          width: 30px;
          height: 30px;
          position: relative;
          top: 3px;
        }
        .star,
        .zan {
          width: 30px;
          height: 28px;
          background-repeat: no-repeat;
          background-size: cover;
          position: relative;
          top: 5px;
          display: inline-block;
        }
        .star_c {
          background-image: url("../../assets/imgs/star_c.png");
        }
        .star_d {
          background-image: url("../../assets/imgs/star_d.png");
        }
        .zan_c {
          background-image: url("../../assets/imgs/zan_c.png");
        }
        .zan_d {
          background-image: url("../../assets/imgs/zan_d.png");
        }
        .eye_c {
          background-image: url("../../assets/imgs/eye_c.png");
          top: 7px;
        }
      }
    }
  }
  .html {
    background: #fff;
    padding: 0 30px 30px;
    .html-title {
      font-size: 22px;
      color: #66d393;
    }
    .audio {
      background: #f1f3f4;
      border-radius: 10px;
      audio {
        width: 100%;
      }
    }
    .html-content {
      padding-top: 22px;
      width: 100%;
      font-size: 26px;
      line-height: 46px;
      img {
        width: 100%;
        margin: 18px 0;
      }
      p {
        word-wrap: break-word;
      }
    }
    .praise {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24px;
      color: #999999;
      img {
        width: 140px;
        height: 140px;
      }
    }
  }
}
</style>


