//家庭保单列表
const familyListIndex = r => require.ensure([], () => r(require("@/pages/familyList/familyListIndex")), "familyListIndex");
//家庭保单列表-编辑个人信息
const familyEditUserinfo = r => require.ensure([], () => r(require("@/pages/familyList/familyEditUserinfo")), "familyEditUserinfo");
//家庭保单列表-家庭详情页
const familyDetails = r => require.ensure([], () => r(require("@/pages/familyList/familyDetails")), "familyDetails");
//家庭保单列表-修改家庭昵称
const editFamilyName = r => require.ensure([], () => r(require("@/pages/familyList/editFamilyName")), "editFamilyName");
//家庭保单列表-修改家庭昵称
const familyAddress = r => require.ensure([], () => r(require("@/pages/familyList/familyAddress")), "familyAddress");
//家庭保单列表-编辑家庭成员
const editFamilyPeoples = r => require.ensure([], () => r(require("@/pages/familyList/editFamilyPeoples")), "editFamilyPeoples");

//家庭保单列表-编辑家庭成员
const companyList = r => require.ensure([], () => r(require("@/pages/familyList/companyList")), "companyList");
//家庭保单列表-客户列表
const clientList = r => require.ensure([], () => r(require("@/pages/familyList/clientList")), "clientList");

// 家庭报告列表
const ReportList = r => require.ensure([], () => r(require("@/pages/familyReport/reportList")), "reportList");
// 简版报告
const ReportSimple = r => require.ensure([], () => r(require("@/pages/familyReport/reportSimple")), "reportSimple");
// 详版报告
const ReportDetail = r => require.ensure([], () => r(require("@/pages/familyReport/reportDetail")), "reportDetail");
// 交费提醒
const PayRemind = r => require.ensure([], () => r(require("@/pages/familyReport/payRemind")), "payRemind");
// 保障详情
const safeguardDetail = r => require.ensure([], () => r(require("@/pages/familyReport/safeguardDetail")), "safeguardDetail");
//发送报告
const reportSend = r => require.ensure([], () => r(require("@/pages/familyReport/reportSend")), "reportSend");
//发送报告完成
const reportSendSuccess = r => require.ensure([], () => r(require("@/pages/familyReport/reportSendSuccess")), "reportSendSuccess");
//历史简版报告
const reportSimpleHistory = r => require.ensure([], () => r(require("@/pages/familyReport/reportSimpleHistory")), "reportSimpleHistory");
//历史详版报告
const reportDetailHistory = r => require.ensure([], () => r(require("@/pages/familyReport/reportDetailHistory")), "reportDetailHistory");
//关于我们
const aboutUs = r => require.ensure([], () => r(require("@/pages/aboutUs/aboutUs")), "aboutUs");
//隐私政策
const privacyPolicy = r => require.ensure([], () => r(require("@/pages/aboutUs/privacyPolicy")), "privacyPolicy");
//新手攻略
const newStrategy = r => require.ensure([], () => r(require("@/pages/trusteeship/newStrategy")), "newStrategy");
//大咖招募-首页
const expertsIndex = r => require.ensure([], () => r(require("@/pages/expertsToRecruit/expertsIndex")), "expertsIndex");
//大咖招募-推荐攻略
const recommendedStrategy = r => require.ensure([], () => r(require("@/pages/expertsToRecruit/recommendedStrategy")), "recommendedStrategy");



let router = [{
    path: "/familyListIndex",
    component: familyListIndex,
    meta: {
      requireAuth: true,
    }
  },
  {
    path: "/familyEditUserinfo",
    component: familyEditUserinfo,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/newStrategy",
    component: newStrategy,
    meta: {
      requireAuth: false
    }
  },
  {
    path: "/familyDetails",
    component: familyDetails,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/editFamilyName",
    component: editFamilyName,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/familyAddress",
    component: familyAddress,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/editFamilyPeoples",
    component: editFamilyPeoples,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/companyList",
    component: companyList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/clientList",
    component: clientList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/reportList",
    component: ReportList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/reportSimple",
    component: ReportSimple,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/reportDetail",
    component: ReportDetail,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/payRemind",
    component: PayRemind,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/safeguardDetail",
    component: safeguardDetail,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/reportSend",
    component: reportSend,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/reportSendSuccess",
    component: reportSendSuccess,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/reportSimpleHistory",
    component: reportSimpleHistory,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/reportDetailHistory",
    component: reportDetailHistory,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/aboutUs",
    component: aboutUs,
    meta: {
      requireAuth: false
    }
  },
  {
    path: "/privacyPolicy",
    component: privacyPolicy,
    meta: {
      requireAuth: false
    }
  },
  {
    path: "/expertsIndex",
    component: expertsIndex,
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/recommendedStrategy",
    component: recommendedStrategy,
    meta: {
      requireAuth: true
    }
  },
]

export default router
