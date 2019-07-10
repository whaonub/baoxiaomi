import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
import {
    getDevice
} from "@/config/utils";
Vue.use(Vuex);

const state = {
    isPc: false, //是否pc访问
    clientInfo: null, //客户端信息
    agentId: "",
    app_token: "", //token
    refreshToken: "", //更新令牌
    isLoading: false,
    device: getDevice(),
    dicMap: new Map(),
    maskView: "none",
    direction: 'forward',
    company: null,
    policyId: null,
    companyId: null,
    insurance: [],
    customerData: {},
    detailPolicyId: null,
    entryMode: null,
    productNoIds: [], //编辑时选中的险种
    policyDetailsProducts: null,
    insuredCustomer: null,
    policyMakeFrom: null,
    cacheArr: ["trusteeshipIndex", "policyMake", "policyInsured", "policyInsurance", "policyInsuranceInfo", "policyDetails", "editFamilyPeoples", "addDynam", "editCard"],
    agentData: null,
    position: [],
    positionData: null,
    reportDetailsPeoplesIndex: null,
    guide: {
        cardEdit: 0,
        cardNews: 0,
        openCard: 0,
        examSend: 0,
        policyDetails: 0,
        reportSimple: 0,
        ocrTip: 0
    },
    record: null//任务中心-新手-每日
};

const mutations = {
    setToken(state, data) {
        state.app_token = data.accessToken;
        if (data.refreshToken) {
            state.refreshToken = data.refreshToken;
        }
    },
    //点击清除之前所有缓存的页面
    clearCacheArr(state) {
        state.cacheArr = []
    },
    //清空缓存后再将待缓存的页面添加
    setCacheArr(state) {
        state.cacheArr = ["trusteeshipIndex", "policyMake", "policyInsured", "policyInsurance", "policyInsuranceInfo", "policyDetails", "editFamilyPeoples", "addDynam", "editCard"]
    },
    clearCacheByName(state, pageName) {
        let cacheList = state.cacheArr
        for (let i = 0; i < cacheList.length; i++) {
            if (cacheList[i] == pageName) {
                cacheList.splice(i, 1)
            }
        }
    },
    setCacheByName(state, pageName) {
        state.cacheArr.push(pageName)
    },
    userGuide(state, objs) {
        let guide = state.guide
        for (var p in guide) {
            for (var o in objs) {
                if (p == o) {
                    guide[p] = objs[o]
                }
            }
        }
        state.guide = guide
    },
    //按钮遮罩显示
    showMaskView(state) {
        state.maskView = 'block'
    },
    //按钮遮罩隐藏
    hideMaskView(state) {
        state.maskView = 'none'
    },
    //路由跳转加载
    updateLoadingStatus(state, payload) {
        state.isLoading = payload.isLoading
    },
    setDicMap(state, payload) {
        state.dicMap.set(payload.key, payload.list)
    },
    // 改变进出栈方向
    updateDirection(state, payload) {
        state.direction = payload.direction
    },
    // 存储客户列表客户信息
    saveCustomerData(state, payload) {
        state.customerData = payload
    },
    getAgentData(state, agentData) {
        state.agentData = agentData
    },
    getPositionList(state, position) {
        state.position = position
    },
    getPositionData(state, positionData) {
        state.positionData = positionData
    },
    setReportDetailsPeoplesIndex(state, index) {
        state.reportDetailsPeoplesIndex = index
    }
};

const actions = {};

export default new Vuex.Store({
    state,
    actions,
    mutations
});
