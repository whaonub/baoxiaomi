<template>
    <div class="movie">
        <div id="player"></div>
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
                    <div @click="praiseClick(detailData.bigShotShareId)">
                        <i class="zan zan_c" v-if="!isPraise"></i>
                        <i class="zan zan_d" v-else></i>
                        <span>{{likeNum}}</span>
                    </div>
                    <div @click="collectClick(detailData.bigShotShareId)">
                        <i class="star star_c" v-if="!flag"></i>
                        <i class="star star_d" v-else></i>
                        <span>收藏</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-validity">
            <div class="content-box" v-for="(item,index) in validityData" :key="index">
                <div class="box-top">
                    <img :src="item.img" alt="">
                    <div>{{item.title}}</div>
                </div>
                <div class="box-text">
                    <div class="text" :class="item.show?'':'active'">
                        {{item.show?item.text:item.text.substr(0,48)}}
                    </div>
                    <div v-if="item.text.length>48" class="toggleBtn" @click="handleClick(index)">
                        <icon :name="item.show?'uparrow':'downarrow'" class="dt-icon" :class="item.show?'uparrow':'downarrow'"></icon>
                        {{item.show?"收起":"展开"}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { AppendJs } from "@/config/utils.js";
export default {
  name: "movie",
  props: {
    validityData: { type: Array },
    detailData: { type: Object },
    flag: { type: Boolean },
    isPraise: { type: Boolean },
    likeNum: { type: Number }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.playVideo();
  },
  methods: {
    handleClick(index) {
      this.$emit("toggle", index);
    },
    // 点击收藏与取消
    collectClick(id) {
      this.$emit("collect", id);
    },
    // 点击点赞与取消
    praiseClick(id) {
      this.$emit("praise", id);
    },
    playVideo() {
      if (window.polyvObject) {
        var dtPlayer = polyvObject("#player").videoPlayer({
          width: "100%",
          height: 240,
          forceH5: true,
          df: 3,
          vid: this.detailData.vid
        });
        window.dtPlayer = dtPlayer;
      } else {
        AppendJs(this.playVideo);
      }
    }
  }
};
</script>
<style lang="less">
.movie {
  video {
    width: 100%;
    height: 420px;
  }
  .title {
    margin-top: 16px;
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
          display: inline-block;
          line-height: 40px;
          height: 40px;
          margin-left: 30px;
          span {
            margin-left: 10px;
            display: inline-block;
          }
        }
        .eye {
          width: 28px;
          height: 28px;
          position: relative;
          top: 6px;
          display: inline-block;
          vertical-align: initial;
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
  .content-validity {
    padding: 0 20px;
    .content-box {
      padding: 0 10px;
      background: #fff;
      margin-top: 16px;
      .box-top {
        display: flex;
        border-bottom: 2px solid #e8e8e8;
        line-height: 80px;
        align-items: center;
        font-size: 28px;
        font-weight: 700;
        img {
          width: 44px;
          height: 34px;
          margin: 0 15px 0 10px;
        }
      }
      .box-text {
        padding: 24px 10px;
        line-height: 48px;
        font-size: 24px;
        position: relative;
        .text {
          width: 590px;
          overflow: hidden;
        }
        .active {
          height: auto;
        }
        .toggleBtn {
          position: absolute;
          right: 0;
          bottom: 28px;
          text-align: right;
          color: #ccc;
          background: #fff;
        }
      }
    }
  }
}
</style>

