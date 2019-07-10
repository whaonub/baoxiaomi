const vcardService = process.env.vcardService


export default {
    /** 查询代理人名片*/
    getAgentCard: {
        url: vcardService + '/agentCard/get',
        method: 'post'
    },
    /**当日简讯 分享 */
    getTodayNewsWithShare: {
        url: vcardService + '/newsShare/getTodayNewsWithShare',
        method: 'post'
    },
    /** 当日简讯*/
    getNews: {
        url: vcardService + '/noauth/getTodyNews',
        method: 'post'
    },
    /**当日简讯 登陆后 */
    getNewsByAuth: {
        url: vcardService + '/newsShare/getNewsShare',
        method: 'post'
    },
    /** 往日简讯*/
    getOldNews: {
        url: vcardService + '/news/getOldNews',
        method: 'post'
    },
    /** 指定日期简讯*/
    getByDate: {
        url: vcardService + '/news/getByDate',
        method: 'post'
    },
    /** 简讯访问量统计*/
    getVisitCount: {
        url: vcardService + '/newsShare/sumVisitNum',
        method: 'post'
    },
    /** 查询代理人最近动态*/
    getAgentZoneRecentDynamic: {
        url: vcardService + '/agentZone/recentDynamic',
        method: 'post'
    },
    /** 代理人特邀开关*/
    getAgentCardInvite: {
        url: vcardService + '/agentCard/invite',
        method: 'post'
    },

    /** 修改代理人名片*/
    getUpdateAgentCard: {
        url: vcardService + '/agentCard/update',
        method: 'post'
    },
    /** 查询访问数据*/
    getVisitor: {
        url: vcardService + '/visitor/get',
        method: 'post'
    },
    /** 代理人查询标签*/
    getTag: {
        url: vcardService + '/tag/getTag',
        method: 'post'
    },
    /** 代理人新增标签*/
    getAddAgentTag: {
        url: vcardService + '/tag/addAgent',
        method: 'post'
    },
    /** 代理人新增标签*/
    getdeleteTag: {
        url: vcardService + '/tag/delete',
        method: 'post'
    },
    /** 代理人保存标签*/
    getChangeTag: {
        url: vcardService + '/agentCard/changeTag',
        method: 'post'
    },
    /**base64图片上传*/
    ossUploadBase64Public: {
        url: vcardService + '/oss/uploadBase64Public',
        method: 'post'
    },
    /**分页获取代理人动态*/
    getAgentZone: {
        url: vcardService + '/agentZone/page',
        method: 'post'
    },
    /**发布最新动态*/
    getAddAgentZone: {
        url: vcardService + '/agentZone/add',
        method: 'post'
    },
    /**收藏简讯*/
    getNewsCollection: {
        url: vcardService + '/newsCollection/addCollection',
        method: 'post'
    },
    /**删除动态*/
    getDeleteById: {
        url: vcardService + '/agentZone/deleteById',
        method: 'post'
    },
    /**更换模板*/
    getChangeTemplate: {
        url: vcardService + '/agentCard/changeTemplate',
        method: 'post'
    },
    /**分享简讯 */
    getAddShare: {
        url: vcardService + '/newsShare/add',
        method: 'post'
    },
    /**查询大咖分享详情**/
    getShotDetail: {
        url: vcardService + '/canauth/bigShot/select/one',
        method: 'post'
    },
    /**查询大咖分享列表**/
    getShotList: {
        url: vcardService + '/noauth/bigShot/select/list',
        method: 'post'
    },
    /**查询推荐**/
    getRecommend: {
        url: vcardService + '/noauth/bigShot/select/recommend',
        method: 'post'
    },
    /**大咖收藏**/
    getCollect: {
        url: vcardService + '/bigShot/collect',
        method: 'post'
    },
    /**大咖点赞**/
    getPraise: {
        url: vcardService + '/bigShot/praise',
        method: 'post'
    },
    /**查询邀约 */
    getAppointment: {
        url: vcardService + '/appointment/getAppointment',
        method: 'post'
    },
    /**读取邀约 */
    readAppointment: {
        url: vcardService + '/appointment/readAppointment',
        method: 'post'
    },
    /**名片首页 谁看了我 */
    getShareVisitor: {
        url: vcardService + '/newsShare/getShareVisitor',
        method: 'post'
    },
    /**查询视频id */
    getVideoId: {
        url: vcardService + "/noauth/video/select",
        method: "post"
    },
    /**动态 谁看了我 */
    getPriaserByZone: {
        url: vcardService + "/agentZone/getPriaser",
        method: "post"
    }
};