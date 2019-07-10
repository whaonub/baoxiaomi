import service from "./service"
import apiUtil from './apiUtil'
import policyService from './policyService'
import familyService from './familyService'
import vcardService from './vcardService'
import userService from './userService'
let params = _.extend(policyService, service, familyService, vcardService, userService)

const generateApiMap = apiUtil.generateApiMap({...params })
export default {
    ...generateApiMap // 取出所有可遍历属性赋值在新的对象上
}