import axios from 'axios'
import _ from "lodash"
import store from '../store/index'
import router from '../router/index'
import service from './service'
import Vue from 'vue'
import { LoadingPlugin, AlertModule } from 'vux'
import { getDevice } from '@/config/utils.js'
let device = getDevice()
let _this = new Vue()

const generateApiMap = (map) => {
    let facade = {}
    _.forEach(map, function (value, key) {
        facade[key] = toMethod(value)
    })
    return facade
}

const toMethod = (options) => {
    options.method = options.method || 'post'
    return (params = {}, attachedParams) => {
        // params = _.extend(params, attachedParams)
        let config = _.merge(options.config, attachedParams)
        return sendApiInstance(options.method, options.url, params, config)
    }
}

// 创建axios实例
const createApiInstance = (config = {}) => {
    let app_token = store.state.app_token
    let agentId = store.state.agentId
    let clientInfo = store.state.clientInfo
    const _config = {
        withCredentials: false, // 跨域
        baseURL: '',
        timeout: 100000,
        closeLoading: false,
        headers: {
            'User-Agent-System': device,
            'clientType': 'h5'
        }
    }
    if (agentId) {
        _config.headers["agentId"] = agentId
    }
    if (app_token) {
        _config.headers["Authorization"] = app_token
    }
    if (clientInfo) {
        for (let p in clientInfo) {
            if (p != 'clientType') {
                _config.headers[p] = clientInfo[p]
            }
        }
    }
    config = _.merge(_config, config)
    return axios.create(config)
}

const err_check = (status, message, data) => {
    if (status == 1 || status == 6666) {
        return true
    }
    return false
}

const sendApiInstance = (method, url, params, config = {}) => {
    if (!url) {
        return
    }
    if (!config.closeLoading) {
        _this.$showLoading()
        store.commit('showMaskView')
    }
    let instance = createApiInstance(config)
    instance.interceptors.response.use(async response => {
        let { status, msg, data, page } = response.data
        if (response.status && response.status != 200) {
            _this.$vux.alert.show({
                content: '亲，您的手机网络不太顺畅喔~',
                onHide() {
                    if (device == "android") {
                        bmAndroid.clean();
                    } else if (device == "ios" || device == "iPhoneX") {
                        window.webkit.messageHandlers.clean.postMessage(null);
                    } else {
                        window.location.reload(true)
                    }
                }
            });
            return false
        }
        if (err_check(status, msg, data) && data) {
            if (!config.closeLoading) {
                if (!config.hideMaskView) {
                    _this.$hideLoading()
                    store.commit('hideMaskView')
                }
            }
            return { data: data, msg: null, status: status, page: page }
        } else {
            if (!config.closeLoading) {
                _this.$hideLoading()
                store.commit('hideMaskView')
            }
            //401 token过期
            if (status == 401) {
                let isPc = store.state.isPc
                let pageUrl = router.currentRoute.fullPath
                let refreshToken = store.state.refreshToken;
                let getRefreshToken = service.refreshToken
                getRefreshToken.params = {
                    refreshToken: refreshToken
                }
                let refreshResult = await sendApiInstance(getRefreshToken.method, getRefreshToken.url, getRefreshToken.params, {})
                if (refreshResult.data) {
                    store.commit("setToken", refreshResult.data)
                    if (device == "android") {
                        let refreshObj = JSON.stringify(refreshResult.data)
                        bmAndroid.syncToken(refreshObj);
                    } else if (device == "ios" || device == "iPhoneX") {
                        if (!isPc) {
                            window.webkit.messageHandlers.syncToken.postMessage(refreshResult.data);
                        }
                    }
                    return await sendApiInstance(method, url, params, config)
                } else {
                    store.commit("setToken", {
                        accessToken: "",
                        refreshToken: ""
                    });
                    let isTokenError = 1
                    //跳转登陆
                    if (pageUrl == "/cardDetails") {
                        pageUrl = ""
                        isTokenError = 0
                    }
                    if (pageUrl == "/cardFamily" || pageUrl == "/editTemplate" || pageUrl == "/editCard" || pageUrl == "/seeDynam") {
                        isTokenError = 0
                    }
                    let obj = {
                        backUrl: pageUrl,
                        isTokenError: isTokenError
                    }
                    if (device == "android") {
                        obj = JSON.stringify(obj)
                        bmAndroid.redirectLogin(obj);
                    } else if (device == "ios" || device == "iPhoneX") {
                        if (!isPc) {
                            window.webkit.messageHandlers.redirectLogin.postMessage(obj);
                        }
                    } else {
                        // 错误处理
                        return { data: null, msg: msg || "服务异常!", status: status, error: response.data.error, page: page }
                    }
                }
            } else {
                // 错误处理
                return { data: null, msg: msg || "服务异常!", status: status, error: response.data.error, page: page }
            }
        }
    },
        error => {
            console.log("服务异常!")
            _this.$vux.alert.show({
                content: '亲，您的手机网络不太顺畅喔~',
                onHide() {
                    if (device == "android") {
                        bmAndroid.clean();
                    } else if (device == "ios" || device == "iPhoneX") {
                        window.webkit.messageHandlers.clean.postMessage(null);
                    } else {
                        window.location.reload(true)
                    }
                }
            });
            if (!config.closeLoading) {
                _this.$vux.loading.hide()
                store.commit('hideMaskView')
            }
            return { data: null, msg: "服务异常!", status: 0, type: true, error: error.response.statusText }
        }
    )
    if (method === 'get') {
        params = {
            params: params
        }
    }

    return instance[method](url, params, config)
}

export default {
    generateApiMap
}