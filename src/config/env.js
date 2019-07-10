/**
 * 配置编译环境和线上环境之间的切换
 */
let policyService = "";
let rootPath = "";
let wechatService = ""
let miniprogramType = 2

policyService = `https://bmapi-uat.fancetech.com/vcard`;
wechatService = `https://bmwx-uat.fancetech.com`;

if (process.env.NODE_ENV == "production") {
  policyService = `https://api.fancetech.com/vcard`;
  wechatService = `https://wx.fancetech.com`;
  miniprogramType = 0
}

export { policyService, rootPath, wechatService, miniprogramType };