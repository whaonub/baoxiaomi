<template>
  <div class="dt-pages card-photoWall-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader
        title="照片墙"
        :leftBack="false"
        :rightText="img==''?'':'删除'"
        @headerRight="delImg"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div class="dt-content">
      <div class="all-wrap" v-show="img == ''|| img == undefined">
        <div class="tips">
          <p>
            <img src="../../assets/imgs/noImg.png" alt="无图片">
          </p>
          <p>上传照片，更换背景</p>
        </div>
      </div>
      <div class="photo" v-show="img">
        <img :src="img">
      </div>
    </div>
    <div class="dt-footer">
      <div class="dt-btn-box fz30">
        <div class="dt-btn-down" @click="photographClick">上传照片</div>
        <div class="dt-pos-btn" :style="{display:$store.state.maskView}">上传照片</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tab, TabItem } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils";
import { setTimeout } from "timers";

export default {
  name: "photoWall",
  components: {
    dtHeader,
    Tab,
    TabItem
  },
  data() {
    return {
      device: getDevice(),
      show: false,
      img: "",
      menus: {
        1: "拍照",
        2: "从相册选泽"
      },
      showCameraType: true
    };
  },
  created() {
    this.showCameraType = true;
    this.img = this.$store.state.agentData.picWall;
    let _this = this;
    this.initData();
    //拍照回调
    if (this.showCameraType) {
      window.upLoadCameraImage = function(base64Url) {
        let data;
        data = JSON.parse(base64Url);
        _this.savePhotoWallImg(data);
      };
    }
  },
  mounted() {},
  methods: {
    initData() {},
    photographClick() {
      let device = this.device;
      if (device == "android") {
        bmAndroid.showCamera(2, 1);
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.showCamera.postMessage({
          type: 2,
          value: 1
        });
      }
    },
    async savePhotoWallImg(val) {
      let results = await api.ossUploadBase64Public({
        base64Images: val,
        dir: "common",
        name: "abc.jpg"
      });
      if (results.status == 1) {
        console.log("bbbb");
        this.img = results.data[0];
        let $this = this;
        setTimeout(function() {
          $this.goBack();
        });
      } else {
        this.$toast(results.msg);
      }
    },
    delImg() {
      this.img = "";
    },
    goBack() {
      this.$router.go(-1);
      this.$store.state.agentData.picWall = this.img;
      this.showCameraType = false;
      window.upLoadCameraImage = null;
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

.card-photoWall-page {
  background: #f7f7f7;
  .photo {
    margin: 30px;
    width: 690px;
    border-radius: 20px;
    overflow: hidden;
    img {
      width: 100%;
      height: auto;
    }
  }
  .all-wrap {
    overflow: hidden;
    text-align: center;
    padding-top: 50%;
    img {
      width: 260px;
    }
    .tips {
      margin-top: -120px;
    }
    p {
      font-size: 30px;
      color: #999;
    }
  }
  .dt-btn-box {
    width: 690px;
    bottom: 62px;
    margin: 0 32px;
    background-color: #28c76a;
    border-radius: 40px;
  }
  .dt-btn-down {
    background-color: #28c76a;
    border-radius: 40px;
    font-size: 36px;
    color: #ffffff;
  }
  .dt-pos-btn {
    border-radius: 40px;
    font-size: 36px;
    color: #ffffff;
  }
}
</style>
