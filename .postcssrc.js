module.exports = {
  plugins: {
    "autoprefixer":{},
    "postcss-aspect-ratio-mini": {},
    "postcss-viewport-units": {},
    "postcss-pxtorem": {
      "rootValue": 750,
      "propList": ["*"],
      "selectorBlackList": [ 
        ".ig-",
        ".vux-",
        ".weui-",
        ".scroller-",
        ".dp-",
        ".mt-",
        ".mint-"
      ],
      "replace": true,
      "mediaQuery": false,
      "minPixelValue": 0
    }
  }
};