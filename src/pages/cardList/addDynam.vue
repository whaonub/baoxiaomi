<template>
  <div class="dt-pages card-addDynam-page">
    <div class="dt-header" ref="topInfo">
      <dtHeader
        title="发表动态"
        rightText="发表"
        :leftBack="false"
        @headerRight="initData"
        @headerLeft="goBack"
      ></dtHeader>
    </div>
    <div class="dt-content">
      <div class="add-text">
        <x-textarea
          :max="200"
          v-model="data.message"
          @on-change="addDynamText"
          :show-counter="false"
          placeholder="分享新鲜事......"
        ></x-textarea>
        <p class="tips">{{textNum}}字</p>
      </div>
      <div class="photograph-box">
        <div class="photograph" v-for="(item,index) in data.images" :key="index">
          <img :src="item" class="img-camera">
          <span @click="delImages(index)">
            <icon name="tipdel" class="dt-icon"></icon>
          </span>
        </div>
        <div class="photograph" @click="photograph(data.images.length)" v-if="data.images.length<9">
          <img src="../../assets/imgs/camera.png" class="camera" alt="相机">
        </div>
      </div>

      <div class="location" @click="searchLocation">
        <div class="location-img">
          <img src="../../assets/imgs/location.png">
        </div>
        <div class="location-title" @click="searchLocation">
          <p>{{data.location}}</p>
        </div>
        <div class="location-rigth">
          <img src="../../assets/imgs/icon_arrow_right.png">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tab, TabItem, XTextarea } from "vux";
import api from "@/api/index";
import dtHeader from "@/components/dtHeader";
import { getDevice } from "@/config/utils";
import { unescape } from "querystring";
export default {
  name: "addDynam",
  components: {
    dtHeader,
    Tab,
    TabItem,
    XTextarea
  },
  data() {
    return {
      textNum: 200,
      device: getDevice(),
      data: {
        images: [],
        location: "",
        message: ""
      }
    };
  },
  created() {
    let $this = this;
    window.buttonReturn = function() {
      $this.goBack();
      return "buttonReturn";
    };
  },
  activated() {
    if (this.$store.state.positionData) {
      this.data.location = this.$store.state.positionData.newPoiName;
      this.$store.state.positionData = null;
    }
  },
  mounted() {
    let _this = this;
    //回调原生图片数据
    window.upLoadCameraImage = function(base64Url) {
      let data;
      data = JSON.parse(base64Url);
      data.forEach(item => {
        _this.saveImg(item);
      });
    };
  },
  methods: {
    //保存，并判断图片或者内容一项不能为空
    async initData() {
      if (this.data.images.length > 0 || this.data.message.length > 0) {
        let results = await api.getAddAgentZone(this.data);
        console.log(results);
        if (results.status == 1) {
          this.$router.go(-1);
        }
      } else {
        this.$toast("内容或者图片不能为空");
      }
    },
    //提示还能输入多少字
    addDynamText(val) {
      if (val == "") {
        this.textNum = 200;
      } else {
        this.textNum = 200 - val.length;
      }
    },
    //调用接口传入base64拿回流
    async saveImg(val) {
      let data = [];
      data.push(val);
      let results = await api.ossUploadBase64Public({
        base64Images: data,
        dir: "zone",
        name: "abc.jpg"
      });
      console.log(results);
      if (results.status == 1) {
        let data = this.data.images.concat(results.data);
        this.data.images = data;
      }
    },
    delImages(index) {
      let images = this.data.images;
      images.splice(index, 1);
    },
    //调用原生方法拍照
    photograph(val) {
      let device = this.device;
      if (device == "android") {
        bmAndroid.showCamera(2, 9 - val);
      } else if (device == "ios" || device == "iPhoneX") {
        window.webkit.messageHandlers.showCamera.postMessage({
          type: 2,
          value: 9 - val
        });
      }
    },
    searchLocation() {
      this.$router.push({ path: "/searchLocation" });
    },
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

.card-addDynam-page {
  background: #fff;
  .dt-content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .add-text {
    margin: 25px 30px 25px 30px;
    position: relative;
    .weui-cell {
      padding: 0 0;
      .weui-textarea {
        height: 162px;
        font-size: 15px;
        color: #000;
      }
    }
    .tips {
      position: absolute;
      bottom: 0;
      right: 0;
      color: #cccccc;
      font-size: 24px;
    }
  }
  .photograph-box {
    margin: 0 15px;
    margin-bottom: 18px;
    .photograph {
      width: 230px;
      height: 230px;
      background-color: #eeeeee;
      border-radius: 10px;
      margin: 0 2px;
      position: relative;
      display: inline-block;
      .img-camera {
        width: 100%;
        height: 100%;
      }
      .camera {
        width: 73px;
        height: 60px;
        padding: 85px 78px;
      }
      .dt-icon {
        position: absolute;
        right: 0;
        top: 0;
        color: #fff;
        background: #000;
        opacity: 0.5;
        border-radius: 50%;
        padding: 6px;
        width: 28px;
        height: 28px;
      }
    }
  }
  .location {
    padding: 0 30px;
    position: relative;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    height: 90px;
    .location-img {
      position: absolute;
      top: 24px;
      img {
        width: 42px;
      }
    }
    .location-rigth {
      position: absolute;
      top: 31px;
      right: 21px;
      img {
        width: 17px;
        height: 28px;
      }
    }
    .location-title {
      position: absolute;
      left: 94px;
      font-size: 30px;
      color: #999999;
      line-height: 90px;
      max-width: 600px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
