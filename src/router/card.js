

//名片详情
const cardDetails = r => require.ensure([], () => r(require("@/pages/cardList/cardDetails")), "cardDetails");
//往日简讯
const newsletterDay = r => require.ensure([], () => r(require("@/pages/cardList/newsletterDay")), "newsletterDay");
//访问记录
const seeRecord = r => require.ensure([], () => r(require("@/pages/cardList/seeRecord")), "seeRecord");
//编辑名片
const editCard = r => require.ensure([], () => r(require("@/pages/cardList/editCard")), "editCard");
//新增荣誉
const showHonor = r => require.ensure([], () => r(require("@/pages/cardList/showHonor")), "showHonor");
//上传照片
const addPhoto = r => require.ensure([], () => r(require("@/pages/cardList/addPhoto")), "addPhoto");
//照片墙
const photoWall = r => require.ensure([], () => r(require("@/pages/cardList/photoWall")), "photoWall");
//发表动态
const addDynam = r => require.ensure([], () => r(require("@/pages/cardList/addDynam")), "addDynam");
//选择地址
const searchLocation = r => require.ensure([], () => r(require("@/pages/cardList/searchLocation")), "searchLocation");

//分享动态
const cardFamily = r => require.ensure([], () => r(require("@/pages/cardList/cardFamily")), "cardFamily");
//查看动态
const seeDynam = r => require.ensure([], () => r(require("@/pages/cardList/seeDynam")), "seeDynam");

//更换模板
const editTemplate = r => require.ensure([], () => r(require("@/pages/cardList/editTemplate")), "editTemplate");

// 保险公司介绍
const companyInfo = r => require.ensure([], () => r(require("@/pages/cardList/companyInfo")), "companyInfo");


let router = [
    {
        path: "/cardDetails",
        component: cardDetails,
        meta: {
            requireAuth: true
        },
    },
    {
        path: "/newsletterDay",
        component: newsletterDay,
        meta: {
            requireAuth: true
        },
    },
    {
        path: "/seeRecord",
        component: seeRecord,
        meta: {
            requireAuth: true
        },
    },
    {
        path: "/editCard",
        component: editCard,
        meta: {
            requireAuth: true
        },
    },
    {
        path: "/showHonor",
        component: showHonor,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/addPhoto",
        component: addPhoto,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/photoWall",
        component: photoWall,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/addDynam",
        component: addDynam,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/searchLocation",
        component: searchLocation,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/cardFamily",
        component: cardFamily,
        meta: {
            requireAuth: true
        }
    },
    {
        path: "/seeDynam",
        component: seeDynam,
        meta: {
            requireAuth: true
        },
    },
    {
        path: "/editTemplate",
        component: editTemplate,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: "/companyInfo",
        component: companyInfo,
        meta: {
            requireAuth: true,
        }
    }
]

export default router

