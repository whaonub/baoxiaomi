
//录入保单
const policyMake = r => require.ensure([], () => r(require("@/pages/policyInfo/policyMake")), "policyMake");
//录入保单-选择险种
const policyInsurance = r => require.ensure([], () => r(require("@/pages/policyInfo/policyInsurance")), "policyInsurance");
//录入保单-搜索险种
const searchInsurance = r => require.ensure([], () => r(require("@/pages/policyInfo/searchInsurance")), "searchInsurance");
//录入保单-可选责任
const policyDuty = r => require.ensure([], () => r(require("@/pages/policyInfo/policyDuty")), "policyDuty");
//录入保单-险种信息填写
const policyInsuranceInfo = r => require.ensure([], () => r(require("@/pages/policyInfo/policyInsuranceInfo")), "policyInsuranceInfo");
//保单详情
const policyDetails = r => require.ensure([], () => r(require("@/pages/policyDetails/policyDetails")), "policyDetails");
//托管列表
const trusteeshipList = r => require.ensure([], () => r(require("@/pages/trusteeship/list")), "trusteeshipList");
//累计托管保单列表
const policyTotal = r => require.ensure([], () => r(require("@/pages/trusteeship/total")), "policyTotal");
//保单托管首页
const trusteeshipIndex = r => require.ensure([], () => r(require("@/pages/trusteeship/index")), "trusteeship");
//录入保单-填写被保人
const policyInsured = r => require.ensure([], () => r(require("@/pages/policyInfo/policyInsured")), "policyInsured");
//新手教程
const course = r => require.ensure([], () => r(require("@/pages/policyInfo/course")), "course");

//发送测需
const examSend = r => require.ensure([], () => r(require("@/pages/exam/examSend")), "examSend");
//查看答案
const lookAnswers = r => require.ensure([], () => r(require("@/pages/exam/lookAnswers")), "lookAnswers");
//智能测需列表
const examlist = r => require.ensure([], () => r(require("@/pages/exam/list")), "examlist");
//测需结果页面
const optimizeResult = r => require.ensure([], () => r(require("@/pages/exam/optimizeResult")), "optimizeResult");

//智能测需优化完成
const optimizecomplete = r => require.ensure([], () => r(require("@/pages/exam/optimizeComplete")), "optimizecomplete");
//智能测需家庭优化完成
const optimizefamilyComplete = r => require.ensure([], () => r(require("@/pages/exam/optimizefamilyComplete")), "optimizefamilyComplete");


//用户协议
const userAgreement = r => require.ensure([], () => r(require("@/pages/policyInfo/userAgreement")), "userAgreement");
//保单托管服务协议
const policyAgreement = r => require.ensure([], () => r(require("@/pages/policyInfo/policyAgreement")), "policyAgreement");
//提现帮助
const drawCashHelp = r => require.ensure([], () => r(require("@/pages/policyInfo/drawCashHelp")), "drawCashHelp");

let router = [
    {
        path: "/",
        component: trusteeshipIndex,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/policyMake",
        component: policyMake,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: "/policyInsurance",
        component: policyInsurance,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: "/searchInsurance",
        component: searchInsurance,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: "/policyDuty",
        component: policyDuty,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: "/policyInsuranceInfo",
        component: policyInsuranceInfo,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: "/policyDetails",
        component: policyDetails,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: "/trusteeshipList",
        component: trusteeshipList,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: "/policyTotal",
        component: policyTotal,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: "/trusteeship",
        name: "trusteeship",
        component: trusteeshipIndex,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/policyInsured",
        component: policyInsured,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/course",
        component: course,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/examSend",
        component: examSend,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: "/lookAnswers",
        component: lookAnswers,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/examlist",
        component: examlist,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/optimizeResult",
        component: optimizeResult,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/userAgreement",
        component: userAgreement
    },
    {
        path: "/policyAgreement",
        component: policyAgreement
    },
    {
        path: "/drawCashHelp",
        component: drawCashHelp
    },
    {
        path: "/optimizecomplete",
        component: optimizecomplete,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/optimizefamilyComplete",
        component: optimizefamilyComplete,
        meta: {
            requireAuth: true
        }
    },
]

export default router

