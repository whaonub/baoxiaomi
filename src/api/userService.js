const userService = process.env.userService

export default {
    /**查询任务数量**/
    getTaskNum: {
        url: userService + '/task/getTaskNum',
        method: 'post'
    },
    /**查询新手任务**/
    getNoviceTask: {
        url: userService + '/task/getNoviceTask',
        method: 'post'
    },
    /**查询每日任务**/
    getDailyTask: {
        url: userService + '/task/getDailyTask',
        method: 'post'
    },
    /**碎片奖励信息**/
    getDebris: {
        url: userService + '/task/getDebris',
        method: 'post'
    },
    /**查询增减记录**/
    getDetailData: {
        url: userService + '/point/getPointLog',
        method: 'post'
    },
    /**领取奖励**/
    getReward: {
        url: userService + '/task/getReward',
        method: 'post'
    },
    /**新手任务抽奖**/
    getTaskReward: {
        url: userService + '/task/getTaskReward',
        method: 'post'
    },
    /**完成任务 */
    complateTask: {
        url: userService + '/task/complateTask',
        method: 'post'
    }
}