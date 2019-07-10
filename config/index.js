"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    proxyTable: {
      "/dev": {
        // target: "http://10.78.10.156:8040", //设置你调用的接口域名和端口号 别忘了加http
        // target: "http://10.78.10.156:8020", //徐力本机
        target: "http://10.78.10.100:8040", //任庆雨本机
        //老铁10.78.10.164,10.78.8.41
        //dev 10.176.16.54
        //张维10.78.11.46,10.78.8.45
        //徐雳10.78.10.156
        //10.176.16.54:8000/auth
        //10.176.16.54:8000/cust
        //10.176.16.54:8000/policy
        changeOrigin: true,
        pathRewrite: {
          "^/dev": "" //这里理解成用‘/dev'代替target里面的地址，后面组件中我们掉接口时直接用dev代替
          //比如我要调用'http://10.78.8.136:8081/user/login'，直接写‘/dev/user/login'即可
        }
      },
      //保单
      "/policyService": {
        target: "http://10.176.16.54:8030", //dev环境
        //target: "http://10.78.10.156:8030", //黄忠伟本机
        //target: "http://10.176.16.54:8000/policy",
        changeOrigin: true,
        pathRewrite: {
          "^/policyService": ""
        }
      },
      "/test": {
        target: "http://10.78.8.136:8081/market-rest", //设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
          "^/test": ""
        }
      },
      //家庭
      "/familyService": {
        target: "http://10.176.16.54:8020", //设置你调用的接口域名和端口号 别忘了加http
        // target: "http://10.78.10.156:8020", //徐力本机
        //target: "http://10.176.16.54:8000/cust",
        // target: "http://10.78.10.159:8020", //张维本机
        changeOrigin: true,
        pathRewrite: {
          "^/familyService": ""
        }
      },
      //名片
      "/vcardService": {
        target: "http://10.176.16.54:8040", //设置你调用的接口域名和端口号 别忘了加http
        //  target: "http://10.176.16.54:8000/vcard", //任庆雨本机
        changeOrigin: true,
        pathRewrite: {
          "^/vcardService": ""
        }
      },
      // 翔哥二维码微信API接口
      "/agentService": {
        target: "http://10.176.16.54:8010", //设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
          "^/agentService": ""
        }
      },
      //用户权限
      "/authService": {
        //target: "http://10.176.16.54:8000/auth", //设置你调用的接口域名和端口号 别忘了加http
        target: "http://10.176.16.54:8000/auth", //徐力本机
        changeOrigin: true,
        pathRewrite: {
          "^/authService": ""
        }
      },
      // 个人中心-任务中心
      "/userService": {
        target: "http://10.176.16.54:8050", //设置你调用的接口域名和端口号 别忘了加http
        //target: "http://10.176.16.54:8000/point", //任庆雨本机
        changeOrigin: true,
        pathRewrite: {
          "^/userService": ""
        }
      }
    },

    // Various Dev Server settings
    // host: '10.78.10.64', // can be overwritten by process.env.HOST
    host: "0.0.0.0", // can be overwritten by process.env.HOST
    port: 7100, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: false,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: "cheap-module-eval-source-map",

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, "../baomi/index.html"),

    // Paths
    assetsRoot: path.resolve(__dirname, "../baomi"),
    assetsSubDirectory: "static",
    assetsPublicPath: "/",

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: "#source-map",

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }

};
