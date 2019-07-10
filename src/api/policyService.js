/*跨域地址*/
const dev = process.env.dev
const plan = process.env.plan
const test = process.env.test
const policyService = process.env.policyService
const insuranceService = process.env.insuranceService
const familyService = process.env.familyService
export default {
  /** 保险公司列表查询 */
  companyList: {
    url: policyService + '/company/list',
    method: 'post'
  },
  /**保单录入 */
  addPolicy: {
    url: policyService + '/policy/add',
    method: 'post'
  },
  /**查询保单基本信息 */
  findPolicyBase: {
    url: policyService + '/policy/select/base',
    method: 'post'
  },
  /**险种 热搜词 */
  insuranceHotword: {
    url: policyService + '/product/hotword/select',
    method: 'post'
  },
  /**根据companyId查询公司编码 */
  findCompanyCode: {
    url: policyService + '/company/code/select',
    method: 'post'
  },
  /**险种添加添加搜索历史 */
  addInsuranceHistory: {
    url: policyService + '/product/add/history',
    method: 'post'
  },
  /**查询搜索历史信息 */
  findInsuranceHistory: {
    url: policyService + '/product/history/select',
    method: 'post'
  },
  /**删除搜索历史信息 */
  deleteInsuranceHistory: {
    url: policyService + '/product/history/delete',
    method: 'post'
  },
  /**根据保单号查询输入的险种 */
  findInputInsurance: {
    url: policyService + '/product/select/input',
    method: 'post'
  },
  /**查询险种列表 */
  searchInsurance: {
    url: policyService + '/product/search',
    method: 'post'
  },
  /**新增险种信息 */
  addInsuranceToPolicy: {
    url: policyService + '/product/add',
    method: 'post'
  },
  /**根据保单id查询险种和责任详情 */
  findInsuranceDuties: {
    url: policyService + '/product/select/detail',
    method: 'post'
  },
  /**根据保单id查询险种入参详情 */
  findInputInsuranceDetail: {
    url: policyService + '/product/select/param/detail',
    method: 'post'
  },
  /**查询保单下的所有可选责任 */
  findPolicyLiability: {
    url: policyService + '/liability/select/policy',
    method: 'post'
  },
  /**根据代理人id删除搜索历史 */
  deleteInsuranceAllHistory: {
    url: policyService + '/product/history/delete/byagent',
    method: 'post'
  },
  /**保单录入时新增被保险人 */
  addPolicyInsured: {
    url: policyService + '/policy/add/insured',
    method: 'post'
  },
  /**险种入参添加 */
  addPolicyInsuredParam: {
    url: policyService + '/product/param/add',
    method: 'post'
  },
  /**按照险种新增可选责任 */
  addPolicyLiability: {
    url: policyService + '/liability/add',
    method: 'post'
  },
  /**根据条件分页查询保单列表 */
  findPolicyList: {
    url: policyService + '/policy/select/list',
    method: 'post'
  },
  /**根据保单id查询保单详情 */
  findPolicyDetail: {
    url: policyService + '/policy/select/detail',
    method: 'post'
  },
  /**查询险种类别字典 */
  findInsuranceType: {
    url: policyService + '/product/select/type',
    method: 'post'
  },
  /**根据保单id删除保单 */
  deletePolicyById: {
    url: policyService + '/policy/delete',
    method: 'post'
  },
  /**根据保单id查询险种详情 */
  findInsuranceByPolicyId: {
    url: policyService + '/product/select/detail',
    method: 'post'
  },
  /**根据保单id查询责任 */
  findDutyByPolicyId: {
    url: policyService + '/liability/select/all/product',
    method: 'post'
  },
  /**编辑保单 基本信息 */
  editPolicyDetail: {
    url: policyService + '/policy/edit',
    method: 'post'
  },
  /**查询投保人是否再已有家庭重复 */
  policyDetailCheckinsure: {
    url: familyService + '/customer/edit/insureCheck',
    method: 'post'
  },
  /** 编辑投保人信息*/
  editPolicyDetailInsure: {
    url: familyService + '/customer/edit/insure',
    method: 'post'
  },
  /**编辑保单受益人 */
  editPolicyDetailBenefit: {
    url: policyService + '/policy/edit/benefit',
    method: 'post'
  },
  /**根据险种查询选中的责任 */
  findInsuranceLiability: {
    url: policyService + '/liability/select/all/product',
    method: 'post'
  },
  /**查询被保人是否再已有家庭重复 */
  policyDetailCheckInsured: {
    url: familyService + '/customer/edit/insuredCheck',
    method: 'post'
  },
  /**编辑保单被保人 */
  editPolicyInsured: {
    url: policyService + '/policy/edit/insured',
    method: 'post'
  },
  /**删除缓存信息 */
  deleteCustomerRedis: {
    url: familyService + '/customer/delete/redis',
    method: 'post'
  },
  /**编辑保单 判断险种是否有可选责任 */
  checkDutyExist: {
    url: policyService + '/product/liability/exist',
    method: 'post'
  },
  /**根据险种编码查询可选责任 */
  findLiabilityByNo: {
    url: policyService + '/liability/select/product',
    method: 'post'
  },
  /**查询增补的险种详情 */
  findInsuranceByAddition: {
    url: policyService + '/product/select/detail/addition',
    method: 'post'
  },
  /**编辑界面新增险种 */
  addPolicyInsurance: {
    url: policyService + '/product/add/addition',
    method: 'post'
  },
  /**根据险种id删除保单 */
  deletePolicyInsuranceById: {
    url: policyService + '/product/delete',
    method: 'post'
  },
  /**编辑险种信息 */
  editPolicyDetailInsuranceInfo: {
    url: policyService + '/product/edit',
    method: 'post'
  },
  /**查询该代理人的排名 */
  findAgentSort: {
    url: policyService + '/policy/sort/select',
    method: 'post'
  },
  /**查询保单数量（有家庭id就查询家庭保单数量，没有就查询代理人保单数量） */
  findAgentPolicyCount: {
    url: policyService + '/policy/count/select',
    method: 'post'
  },
  /**根据家庭id生成报告 */
  saveFamilyReport: {
    url: policyService + '/familyReport/save',
    method: 'post'
  },
  /**录入保单时根据保单号校验保单是否重复 */
  findPolicyNoExist: {
    url: policyService + '/policy/select',
    method: 'post'
  },
  /**根据代理人查询是否存在未编辑完的保单 */
  findPolicyCache: {
    url: policyService + '/policy/select/cache',
    method: 'post'
  },
  /**根据保单号清除缓存 */
  deletePolicyCache: {
    url: policyService + '/policy/delete/cache',
    method: 'post'
  },
  /**分享的同时记录信息 */
  createMeasureRecord: {
    url: policyService + '/app/measure/record',
    method: 'post'
  },
  /**查询答案 */
  getAnswerInfo: {
    url: policyService + '/wx/measure/answer/get',
    method: 'post'
  },
  /**查询测需列表 */
  getMeasureList: {
    url: policyService + '/app/measure/list/get',
    method: 'post'
  },
  /** 测需列表中删除*/
  deleteMeasureById: {
    url: policyService + '/app/measure/delete/byshareid',
    method: 'post'
  },
  /**查询测需结果*/
  findMeasureResult: {
    url: policyService + '/app/measure/scord/get',
    method: 'post'
  },
  /**更新是否已读 */
  updateMeasureStatus: {
    url: policyService + '/app/measure/isread/update',
    method: 'post'
  },
  /**公司+代理人公司列表 */
  getCompanyAgentAll: {
    url: policyService + '/company/listCompanyAgentAll',
    method: 'post'
  },
  /**搜索 公司+代理人公司列表 */
  searchCompanyAgent: {
    url: policyService + '/company/agent/search',
    method: 'post'
  },
  /**保险公司 */
  findCompanyInfo: {
    url: policyService + '/company/code/selecttip',
    method: 'post'
  },
  /**查看测需优化后的结果 */
  optimizeMeasure: {
    url: policyService + '/app/measure/optimize/get',
    method: 'post'
  },
  /**查询测需评价 */
  getIsuseful: {
    url: policyService + "/wx/measure/isuseful/get",
    method: "post"
  },
};
