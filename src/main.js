import Vue from 'vue'
import router from './router'
import store from './store'
import _ from "lodash"
import animate from 'animate.css'
// 复制粘贴插件
import clipboard from 'clipboard';
import Icon from 'vue-svg-icon/Icon.vue'
import './config/rem'
import App from './App'
import Vconsole from 'vconsole'
import Router from "vue-router";
import {
  DatetimePlugin,
  WechatPlugin
} from 'vux'
// 消息提示
import msg from '@/utils/msg'
// 全局路由拦截
import routerIntercept from '@/utils/routerIntercept'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

Vue.use(Router)
Vue.use(DatetimePlugin)
Vue.use(animate)
Vue.component('icon', Icon)
Vue.prototype._ = _
Vue.use(WechatPlugin) // Vue.wechat = wx
Vue.use(msg);
Vue.use(routerIntercept);
Vue.prototype.clipboard = clipboard;

Vue.config.productionTip = false


/** 检测当前点击是否为自身元素(点击空白处隐藏模态框等操作) */
Vue.directive('clickoutside', {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  update() { },
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
})


/* eslint-disable no-new */

if (process.env.NODE_ENV != "production") {
  new Vconsole()
}
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
