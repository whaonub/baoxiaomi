import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

import policyRouter from "./policy"
import familyRouter from "./family"
import cardRouter from "./card"

// 邀约页面
const invitations = r => require.ensure([], () => r(require("@/pages/invitations/invitations")), "invitations");

// 邀请有礼页面
const inviting = r => require.ensure([], () => r(require("@/pages/inviting/inviting")), "inviting");

// 面对面邀请
const invitingFace = r => require.ensure([], () => r(require("@/pages/inviting/invitingFace")), "invitingFace");

// 宝箱活动
const activity = r => require.ensure([], () => r(require("@/pages/activity/activity")), "activity");
// 快捷登录
const fastLogin = r => require.ensure([], () => r(require("@/pages/activity/fastLogin")), "fastLogin");

// 签到
const signIn = r => require.ensure([], () => r(require("@/pages/signIn/signIn")), "signIn");

// 大咖分享
const celebrity = r => require.ensure([], () => r(require("@/pages/celebrity/celebrity")), "celebrity");
// 更多文章
const moreArticle = r => require.ensure([], () => r(require("@/pages/celebrity/moreArticle")), "moreArticle");


// 个人中心---任务中心
const personalTask = r => require.ensure([], () => r(require("@/pages/personalTask/index")), "personalTask");
// 金豆明细
const beanDetail = r => require.ensure([], () => r(require("@/pages/personalTask/beanDetail")), "beanDetail");
// 任务规则
const taskRules = r => require.ensure([], () => r(require("@/pages/personalTask/taskRules")), "taskRules");

let routerList = []
let router = [{
    path: "/invitations",
    component: invitations,
    meta: {
      requireAuth: true,
    }
  },
  {
    path: "/inviting",
    component: inviting,
    meta: {
      requireAuth: true,
    }
  },
  {
    path: "/invitingFace",
    component: invitingFace,
    meta: {
      requireAuth: true,
    }
  },
  {
    path: "/signIn",
    component: signIn,
    meta: {
      requireAuth: true,
    }
  },
  {
    path: "/activity",
    component: activity,
    meta: {
      requireAuth: true,
    }
  },
  {
    path: "/fastLogin",
    component: fastLogin,
    meta: {
      requireAuth: true,
    }
  },
  {
    path: "/celebrity",
    component: celebrity
  },
  {
    path: "/moreArticle",
    component: moreArticle
  },
  {
    path: "/personalTask",
    component: personalTask,
    meta: {
      requireAuth: true,
    }
  },
  {
    path: "/beanDetail",
    component: beanDetail,
    meta: {
      requireAuth: true,
    }
  },
  {
    path: "/taskRules",
    component: taskRules,
    meta: {
      requireAuth: true,
    }
  }
]

routerList = routerList.concat(router)
routerList = routerList.concat(policyRouter)
routerList = routerList.concat(familyRouter)
routerList = routerList.concat(cardRouter)


export default new Router({
  mode: 'history',
  routes: routerList
})
