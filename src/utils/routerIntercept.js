import router from '../router'
import store from "../store";
import { getDevice, getQueryString } from "@/config/utils";
let device = getDevice()
import Vue from "vue";
let _this = new Vue();
export default {
	install() {
		const history = window.sessionStorage;
		let historyCount = history.getItem('count') * 1;
		router.beforeEach(function (to, from, next) {
			const toIndex = history.getItem(to.path);
			const fromIndex = history.getItem(from.path);
			if (toIndex) {
				if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
					store.commit('updateDirection', { direction: 'forward' })
				} else {
					store.commit('updateDirection', { direction: 'reverse' })
				}
			} else {
				++historyCount;
				history.setItem('count', historyCount);
				to.path !== '/' && history.setItem(to.path, historyCount);
				store.commit('updateDirection', { direction: 'forward' })
			}

			if (/\/http/.test(to.path)) {
				let url = to.path.split('http')[1];
				window.location.href = `http${url}`
			} else {
				let isPc = getQueryString("isPc");
				if (isPc) {
					next()
				}
			}
			store.commit('updateLoadingStatus', { isLoading: true })
			if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
				let isPc = store.state.isPc
				let apptokenObj
				let clientObj
				if (device == "android") {
					clientObj = bmAndroid.getClientInfo();
					apptokenObj = bmAndroid.getToken();
					if (apptokenObj && apptokenObj != "null") {
						apptokenObj = JSON.parse(apptokenObj)
						store.state.app_token = apptokenObj.accessToken;
						store.state.refreshToken = apptokenObj.refreshToken;
						store.commit("setToken", apptokenObj)
						if (clientObj && clientObj != "null") {
							if (typeof clientObj === "string") {
								clientObj = JSON.parse(clientObj)
							}
							if (typeof clientObj.clientInfo === "string") {
								clientObj.clientInfo = JSON.parse(clientObj.clientInfo)
							}
							store.state.clientInfo = clientObj.clientInfo
							if (typeof clientObj.guide === "string") {
								if (clientObj.guide) {
									clientObj.guide = JSON.parse(clientObj.guide)
								}
							}
							let userGuide = clientObj.guide
							store.commit("userGuide", userGuide)
						}
						next();
					} else {
						if (to.path == "/cardDetails") {
							next();
						} else {
							let resObj = {
								backUrl: to.path,
								isTokenError: 0
							}
							resObj = JSON.stringify(resObj)
							bmAndroid.redirectLogin(resObj);
						}
					}
				} else if (device == "ios" || device == "iPhoneX") {
					if (!isPc) {
						window.webkit.messageHandlers.getClientInfo.postMessage(null);
						window.getClientInfo = function (obj) {
							if (obj) {
								obj = JSON.parse(obj)
								store.state.clientInfo = obj.clientInfo
								let userGuide = obj.guide
								store.commit("userGuide", userGuide)
							}
						}
						window.webkit.messageHandlers.getToken.postMessage(null);
						window.getToken = function (obj) {
							if (obj) {
								obj = JSON.parse(obj)
								store.state.app_token = obj.accessToken;
								store.state.refreshToken = obj.refreshToken
								store.commit("setToken", obj)
								next();
							} else {
								if (to.path == "/cardDetails") {
									next();
								} else {
									let resObj = {
										backUrl: to.path,
										isTokenError: 0
									}
									window.webkit.messageHandlers.redirectLogin.postMessage(resObj);
								}
							}
						};

					} else {
						next();
					}
				} else {
					//pc端未登录
					next()
				}
			}
			else {
				next();
			}
		});

		router.afterEach(function (to) {
			store.commit('updateLoadingStatus', { isLoading: false })
		})

		router.onError(function (err) {
			console.log(err)
			if (err && err != '{}' && err.message.indexOf('messageHandlers') == -1) {
				_this.$alert({
					content: '因系统维护导致资源文件异常,请返回首页再重新进入。',
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
			}
		})

	}
}


