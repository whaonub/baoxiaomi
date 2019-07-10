//获取访问的设备信息
export const getDevice = () => {
  let u = navigator.userAgent,
    app = navigator.appVersion;
  let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  let isIphoneX = /iPhoneX/.test(u);
  if (isiOS && screen.height == 812 && screen.width == 375) {
    return "iPhoneX"
  }
  if (isAndroid) {
    return "android";
  } else if (isIphoneX) {
    return "iPhoneX";
  } else if (isiOS) {
    return "ios";
  } else {
    return "web";
  }
};

// 	转义html标签
export const HtmlEncode = text => {
  text
    .replace(/&/g, "&")
    .replace(/\"/g, '"')
    .replace(/</g, "<")
    .replace(/>/g, ">");
};

// utf8解码
export const utf8_decode = str_data => {
  let tmp_arr = [],
    i = 0,
    ac = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0;
  str_data += "";
  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 < 128) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if (c1 > 191 && c1 < 224) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(
        ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
      );
      i += 3;
    }
  }
  return tmp_arr.join("");
};

//query 获取地址栏参数
export const getQueryString = name => { //如：http://www.baidu.com/?tab=2  →  getQueryString('tab') →   2;
  let href = document.location.href;
  let string = href.substring(href.indexOf('?') + 1);
  let oArr = {};
  let arr = string.split('&');
  for (let i = 0; i < arr.length; i++) {
    let newArr = arr[i].split('=');
    oArr[newArr[0]] = newArr[1];
  }
  return oArr[name] ? decodeURIComponent(oArr[name]) : '';
}


//身份证脱敏
export const idCardTuo = (str) => {
  //console.log(idCardTuo('429004199409173672'));
  if (typeof str === 'string') {
    let ruten = str.substring(0, str.length - 4); //提取字符串下标之间的字符。
    let replace = '';
    for (let i = 0; i < ruten.length; i++) {
      replace += '*'
    }
    return str.replace(ruten, replace); //字符串中用字符替换另外字符，或替换一个与正则表达式匹配的子串。
  }
}


//银行脱敏
export const bankTuo = (str) => {
  if (typeof str === 'string') {
    let ruten = str.substring(6, str.length - 4); //提取字符串下标之间的字符。
    let replace = '';
    for (let i = 0; i < ruten.length; i++) {
      replace += '*'
    }
    return str.replace(ruten, replace); //字符串中用字符替换另外字符，或替换一个与正则表达式匹配的子串。
  }

}

//判断是否微信客户端打开页面
export const isWeixin = () => {
  var ua = navigator.userAgent.toLowerCase();
  var isWeixin = ua.indexOf("micromessenger") != -1;
  if (!isWeixin) {
    return false;
  } else {
    return true;
  }
}

/**
 * 获取元素的offset
 */
export const offset = (el) => {
  var left = 0
  var top = 0
  while (el) {
    left += el.offsetLeft
    top += el.offsetTop
    el = el.offsetParent
  }
  return {
    left: left,
    top: top,
    el: el
  }
}

/**
 * 元素滚动方法
 */
export const scrollToElement = function (el, delay = 20, rootEl = "wrap") {
  let wrapper = this.$refs[rootEl]
  if (!wrapper || !el) {
    return
  }
  let pos = offset(el)
  let wrapperOffset = offset(wrapper)
  pos.top -= wrapperOffset.top
  wrapper.scrollTop = pos.top
}

/**
 * 计算周岁
 * @param {String} date  format YYYY-MM-DD
 */
export const calculateAge = date => {
  let now = new Date()
  let birth = new Date(date)

  if ((birth.getTime() - now.getTime()) > 0) {
    return 0
  }

  let nowYear = now.getFullYear()
  let nowMonth = now.getMonth() + 1
  let nowDay = now.getDate()

  let birthYear = birth.getFullYear()
  let birthMonth = birth.getMonth() + 1
  let birthDay = birth.getDate()

  let age = nowYear - birthYear
  if (nowMonth <= birthMonth) {
    if (nowMonth == birthMonth) {
      if (nowDay < birthDay) {
        age--
      }
    } else {
      age--
    }
  }
  return age
};

/**
 * 通过毫秒获取格式化日期
 * @param ms 毫秒
 * @param type 日期类型 1：年 2：年月...
 * @returns {string}
 */
export const formartDate = (ms, type) => {
  if (typeof ms !== 'number') {
    return
  }
  let date = new Date(ms)
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  let hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`
  let min = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`
  let sec = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`

  switch (type) {
    case 1:
      return `${year}`;
    case 2:
      return `${year}/${month}`;
    case 3:
      return `${year}/${month}/${day}`;
    case 4:
      return `${year}/${month}/${day} ${hours}`
    case 5:
      return `${year}/${month}/${day} ${hours}:${min}`
    case 6:
      return `${year}/${month}/${day} ${hours}:${min}:${sec}`
    default:
      return `${year}/${month}/${day} ${hours}:${min}`
  }
}


export const uuid = (len, radix) => {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}


// 图片转base64
export const Base64 = (img) => {

  function getBase64Image(img) {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    let dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
  }

  let image = new Image();
  image.src = img;
  image.setAttribute("crossOrigin", "Anonymous");
  return new Promise(function (resolve, reject) {
    image.onload = function () {
      let base64 = getBase64Image(image);
      resolve(base64);
    };
  })
}



export const AppendJs = (callback) => {
  var scripts = ['https://player.polyv.net/script/player.js'];
  var HEAD =
    document.getElementsByTagName("head").item(0) ||
    document.documentElement;
  var s = new Array(),
    last = scripts.length - 1,
    recursiveLoad = function (i) {
      //递归
      s[i] = document.createElement("script");
      s[i].setAttribute("type", "text/javascript");
      s[i].onload = s[i].onreadystatechange = function () {
        //Attach handlers for all browsers
        if (
          !/*@cc_on!@*/ 0 ||
          this.readyState == "loaded" ||
          this.readyState == "complete"
        ) {
          this.onload = this.onreadystatechange = null;
          this.parentNode.removeChild(this);
          if (i != last) recursiveLoad(i + 1);
          else if (typeof callback == "function") {
            callback();
          }
        }
      };
      s[i].setAttribute("src", scripts[i]);
      HEAD.appendChild(s[i]);
    };
  recursiveLoad(0);
}