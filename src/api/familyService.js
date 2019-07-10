/*跨域地址*/
const dev = process.env.dev
const plan = process.env.plan
const test = process.env.test
const familyService = process.env.familyService
const policyService = process.env.policyService
const vcardService = process.env.vcardService
const agentService = process.env.agentService
const userService = process.env.userService

export default {
  /** 新增家庭时先查询是否有家庭拥有重复成员来选择是否合并 */
  familyFindByInfo: {
    url: familyService + '/family/findByInfo',
    method: 'post'
  },
  /** 通过客户列表得新建家庭 */
  saveByFamilyList: {
    url: familyService + '/family/saveByFamilyList',
    method: 'post'
  },
  /**合并家庭 */
  familySave: {
    url: familyService + '/family/save',
    method: 'post'
  },
  /** 查询代理人家庭列表(分页) */
  familyList: {
    url: familyService + '/family/familyList',
    method: 'post'
  },
  /** 通过家庭id查询家庭信息 */
  familyFindById: {
    url: familyService + '/family/findById',
    method: 'post'
  },
  /** 通过id删除家庭 */
  familyDelete: {
    url: familyService + '/family/delete',
    method: 'post'
  },
  /** 修改家庭名称 */
  updateFamilyName: {
    url: familyService + '/family/update/familyName',
    method: 'post'
  },
  /** 通过客户id查询客户信息 */
  customerFindByCustId: {
    url: familyService + '/customer/findByCustId',
    method: 'post'
  },
  /** 修改客户详细信息 */
  updateCustomer: {
    url: familyService + '/customer/update',
    method: 'post'
  },
  /** 通过客户id查询客户地址 */
  findCustomerAddr: {
    url: familyService + '/customer/find/addr',
    method: 'post'
  },
  /** 查询代理人下的客户列表 */
  customerList: {
    url: familyService + '/customer/list',
    method: 'post'
  },
  /** 查询客户保单列表 */
  customerPolicyList: {
    url: policyService + '/policy/select/customer',
    method: 'post'
  },
  /** 修改家庭成员前先检查家庭成员是否重复 如果为null则直接修改 */
  editCheckFamilyMen: {
    url: familyService + '/family/edit/checkFamilyMen',
    method: 'post'
  },
  /** 删除缓存信息 */
  deleteRedis: {
    url: familyService + '/customer/delete/redis',
    method: 'post'
  },
  /** 修改家庭成员 */
  updateFamilyPeoples: {
    url: familyService + '/family/update/family',
    method: 'post'
  },
  /** 通过家庭id和客户id查找客户的笔记信息 */
  findNote: {
    url: familyService + '/customer/find/note',
    method: 'post'
  },
  /** 有笔记id代表修改，没有就是新建笔记记录 */
  saveNote: {
    url: familyService + '/customer/save/note',
    method: 'post'
  },
  /** 可选职业字典 */
  occupationList: {
    url: vcardService + '/dict/getByType',
    method: 'post'
  },
  /**代理人累计服务家庭 */
  findFamilyCount: {
    url: familyService + '/family/count',
    method: 'post'
  },
  /**通过时间查询托管家庭的信息列表 */
  findTrusteeshipList: {
    url: familyService + '/family/list/trusteeship',
    method: 'post'
  },
  /**托管列表更新家庭状态是否已读 */
  updatefamilyReadStatus: {
    url: familyService + '/family/update/isRead',
    method: 'post'
  },
  /** 获取家庭报告列表 */
  getFamilyReportList: {
    url: policyService + '/familyReport/list',
    method: 'post'
  },
  /** 家庭报告生成打标 */
  shortReportUpdate: {
    url: policyService + '/familyReport/shortReport/update',
    method: 'post'
  },
  /** 家庭报告列表删除 */
  familyReportListDelete: {
    url: policyService + '/familyReport/list/delete',
    method: 'post'
  },
  /** 简版家庭报告查询 */
  shortReportList: {
    url: policyService + '/familyReport/shortReport/get',
    method: 'post'
  },
  /** 历史简版家庭报告查询 */
  shortReportListHistory: {
    url: policyService + '/familyReport/shortReportHistory/get',
    method: 'post'
  },
  /** 历史详版家庭报告查询 */
  detailReportListHistory: {
    url: policyService + '/familyReport/detailReportHistory/get',
    method: 'post'
  },
  /** 历史交费详情查询 */
  premDetailHistory: {
    url: policyService + '/familyReport/premDetailHistory/get',
    method: 'post'
  },
  /** 历史保障详情查询 */
  securityDetailHistory: {
    url: policyService + '/familyReport/securityDetailHistory/get',
    method: 'post'
  },
  /** 历史保障建议查询 */
  securityAdviceHistory: {
    url: policyService + '/familyReport/securityAdviceHistory/select',
    method: 'post'
  },
  /** 历史客户顺序查询 */
  custHistoryList: {
    url: policyService + '/familyReport/custHistoryList/select',
    method: 'post'
  },
  /** 保障详情查询 */
  getSecurityDetail: {
    url: policyService + '/familyReport/securityDetail/get',
    method: 'post'
  },
  /** 详版版家庭报告查询 */
  detailReportList: {
    url: policyService + '/familyReport/detailReport/get',
    method: 'post'
  },
  /** 交费详情查询 交费提醒 */
  premDetailList: {
    url: policyService + '/familyReport/premDetail/get',
    method: 'post'
  },
  /** 客户顺序查询 */
  custListSelect: {
    url: policyService + '/familyReport/custList/select',
    method: 'post'
  },
  /** 保障建议查询 */
  securityAdviceSelect: {
    url: policyService + '/familyReport/securityAdvice/select',
    method: 'post'
  },
  /** 保障建议修改 */
  securityAdviceUpdate: {
    url: policyService + '/familyReport/securityAdvice/update',
    method: 'post'
  },
  /** 详版版家庭报告修改 */
  detailReportUpdate: {
    url: policyService + '/familyReport/detailReport/update',
    method: 'post'
  },
  /** word下载地址生成 */
  familyReportSave: {
    url: policyService + '/familyReport/word/save',
    method: 'post'
  },
  /** 发送报告-查询主客户信息 */
  getMaincustomer: {
    url: familyService + '/customer/maincustomer/get',
    method: 'post'
  },
  /** 发送报告-查询是否可以发送 */
  getCantrusteeship: {
    url: familyService + '/customer/cantrusteeship/get',
    method: 'post'
  },
  /** 发送报告-查询代理人信息 */
  getByIdAgentCard: {
    url: vcardService + '/agentCard/getById',
    method: 'post'
  },
  /** 推荐代理人-分享前查询ID */
  beforeAppoint: {
    url: vcardService + '/appointment/beforeAppoint',
    method: 'post'
  },
  /** 推荐代理人-分享前查询代理人信息 */
  beforeAppointA: {
    url: vcardService + '/appointment/beforeAppointA',
    method: 'post'
  },
  /** 获取二维码 */
  getQrcode: {
    url: agentService + '/agent/qrcode',
    method: 'post'
  },
  /** 托管绑定 */
  customerBindingSave: {
    url: policyService + '/customerBinding/save',
    method: 'post'
  },
  /** 查询签到信息 */
  getRegisterLog: {
    url: userService + '/register/getRegisterLog',
    method: 'post'
  },
  /** 签到 */
  register: {
    url: userService + '/register/register',
    method: 'post'
  },
  /** 翻倍奖励 */
  doubling: {
    url: userService + '/register/doubling',
    method: 'post'
  },
  /** 月末抽奖 */
  getAward: {
    url: userService + '/register/getAward',
    method: 'post'
  },
  /** 签到分享 */
  shareRegister: {
    url: userService + '/register/shareRegister',
    method: 'post'
  },
  /** 我的宝箱查询 */
  myTreasure: {
    url: userService + '/treasureBox/myTreasure',
    method: 'post'
  },
  /** 我的奖品 */
  myPrize: {
    url: userService + '/treasureBox/myPrize',
    method: 'post'
  },
  /** 宝箱-发送邀请 */
  invitat: {
    url: userService + '/treasureBox/invitat',
    method: 'post'
  },
  /** 打开宝箱 */
  openBox: {
    url: userService + '/treasureBox/openBox',
    method: 'post'
  },
  /** 保险公司关键词搜索 */
  companyListSearch: {
    url: policyService + '/company/policy/search',
    method: 'post'
  },
  /**查询XXX用户做了保单托管*/
  getTrusteeshipcusts: {
    url: familyService + '/customer/trusteeshipcusts/get',
    method: 'post'
  },
  /** 伯乐榜单 */
  getBestInvitation: {
    url: userService + '/invitation/getBestInvitation',
    method: 'post'
  },
  /** 我的邀请 */
  getMyInvitationPage: {
    url: userService + '/invitation/getMyInvitationPage',
    method: 'post'
  },
  /** 我的邀请-单条数据 */
  getMyInvitation: {
    url: userService + '/invitation/getMyInvitation',
    method: 'post'
  },
  /** 生成邀请码 */
  getInvitationCode: {
    url: userService + '/invitation/getInvitationCode',
    method: 'post'
  },
  /** 生成二维码 */
  getQRCode: {
    url: userService + '/invitation/getQRCode',
    method: 'post'
  },
  /** 根据家庭id查询家庭有效保单数量 */
  effectiveFamily: {
    url: policyService + '/policy/effective/family',
    method: 'post'
  },
  /** 大咖活动-自荐 */
  selfRecommend: {
    url: userService + '/bigShotRecommend/selfRecommend',
    method: 'post'
  },
  /** 大咖活动-创建邀请码 */
  createCode: {
    url: userService + '/bigShotRecommend/createCode',
    method: 'post'
  },
};
