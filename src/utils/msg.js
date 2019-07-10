import Vue from 'vue';
import {
  ToastPlugin,
  AlertPlugin,
  ConfirmPlugin,
  LoadingPlugin
} from 'vux';
import { getDevice } from "@/config/utils.js";
import { goToWechatPage } from "@/utils/index";
import { miniprogramType } from "@/config/env";
Vue.use(ToastPlugin);
Vue.use(AlertPlugin);
Vue.use(ConfirmPlugin);
Vue.use(LoadingPlugin);

function checkType(val) {
  return typeof val === "number" || typeof val === "string"
}
export default {
  install(Vue, option) {
    const msg = {
      $toast: config => {
        let defaultConfigaultConfigaultConfig = {
          type: 'text',
          text: '',
          time: 1000
        }
        if (checkType(config)) {
          Vue.$vux.toast.show(Object.assign(defaultConfigaultConfigaultConfig, {
            text: config
          }))
        } else {
          Vue.$vux.toast.show(Object.assign(defaultConfigaultConfigaultConfig, config))
        }
      },
      $alert: config => {
        let defaultConfigaultConfig = {
          content: '网络异常,请稍后再试！',
          buttonText: '确定',
          maskTransition: 'vux-fade',
        }
        if (checkType(config)) {
          Vue.$vux.alert.show(Object.assign(defaultConfigaultConfig, {
            content: config
          }));
        } else {
          Vue.$vux.alert.show(Object.assign(defaultConfigaultConfig, config));
        }
      },
      $confirm: config => {
        let isConfirm = false;
        let defaultConfig = {
          title: '提示',
          content: '网络异常,请稍后再试！',
          confirmText: '确定',
          cancelText: '取消',
          onConfirm: () => {
            isConfirm = true;
          }
        }
        if (checkType(config)) {
          Vue.$vux.confirm.show(Object.assign(defaultConfig, {
            content: config
          }));
        } else {
          Vue.$vux.confirm.show(Object.assign(defaultConfig, config));
        }
      },
      $showLoading: config => {
        let defaultConfig = {

        }
        if (checkType(config)) {
          Vue.$vux.loading.show(Object.assign(defaultConfig, {
            text: config
          }));
        } else {
          Vue.$vux.loading.show(Object.assign(defaultConfig, config));
        }
      },
      $hideLoading: () => {
        Vue.$vux.loading.hide()
      },
      $share: sharObj => {
        let device = getDevice();
        let shareChannel = '12'
        if (sharObj.shareChannel) {
          shareChannel = sharObj.shareChannel
        }
        let obj = {
          type: sharObj.type, //1小程序，2，图片，3连接 ios专用
          userName: sharObj.userName, //appid gh_16600ce93d45
          miniprogramType: miniprogramType, //小程序0,1,2  (0-正式,1-开发,2-体验)
          path: sharObj.path, //小程序地址
          title: sharObj.title, //标题
          content: sharObj.content, //内容，副标题
          shareChannel: shareChannel,
          clickUrl: goToWechatPage(sharObj.clickUrl), //链接
          pictureBase64: sharObj.pictureBase64, //图片 分享图片就是base64，如果是连接就是http IOS下
          pictureUrl: sharObj.pictureUrl // 安卓下的图片
        };
        if (device == "android") {
          obj = JSON.stringify(obj);
          bmAndroid.nativeShare(obj);
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.nativeShare.postMessage(obj);
        }
      },
      $userGuide: sharObj => {
        let device = getDevice();
        if (device == "android") {
          let obj = JSON.stringify(sharObj);
          bmAndroid.userGuide(obj);
        } else if (device == "ios" || device == "iPhoneX") {
          window.webkit.messageHandlers.userGuide.postMessage(sharObj);
        }
      }
    }
    Object.entries(msg).forEach(([method, callback]) => {
      Vue.prototype[method] = callback;
    })
  }
}
