const Tool = {
  /**
   * 如果target(也就是FirstOBJ[key])存在，
   * 且是对象的话再去调用deepObjectMerge，
   * 否则就是FirstOBJ[key]里面没这个对象，需要与SecondOBJ[key]合并
   */
  // 深度合并对象
  deepObjectMerge(FirstOBJ, SecondOBJ) {
    for (var key in SecondOBJ) {
      FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
      Tool.deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key];
    }
    return FirstOBJ;
  },
  // 深度克隆
  cloneDeep(obj) {
    if (obj === null) return null
    if (typeof obj !== 'object') return obj
    if (obj.constructor === Date) return new Date(obj)
    //保持继承链
    let newObj = new obj.constructor()
    //不遍历其原型链上的属性
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let val = obj[key]
        // 使用arguments.callee解除与函数名的耦合
        newObj[key] = typeof val === 'object' ? Tool.cloneDeep(val) : val
      }
    }
    return newObj
  },
  numberFormat(number, decimals, dec_point, thousands_sep) {
    /*
     * 参数说明：
     * number：要格式化的数字
     * decimals：保留几位小数
     * dec_point：小数点符号
     * thousands_sep：千分位符号
     * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    let n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec);
        return '' + Math.ceil(n * k) / k;
      };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    let re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2');
    }

    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  },
  // 判断字符串是否为json数据
  isJsonString(str) {
    try {
      if (typeof JSON.parse(str) === 'object') {
        return true
      }
    } catch (e) {
      console.warn('不是一个有效的JSON String')
    }
    return false
  },
  // 打开url
  openURL(url, target = '_self') {
    //创建A标签
    let a = document.createElement('a');
    //给创建好的a标签赋值
    a.setAttribute('href', url);
    //设置css 隐藏属性
    a.setAttribute('style', 'display:none');
    //设置 a标签为新窗口打开
    a.setAttribute('target', target);
    //将设置好的a标签，添加到 body 内
    document.body.appendChild(a);
    //模拟点击
    a.click();
    //移除a标签
    a.parentNode.removeChild(a);
  },
  // 用于生成 唯一unid
  unid(idtype = '', length = 18) {
    const S4 = () => {
      const rad = 1 + Math.random()
      const radKey = (rad * 0x10000) | 0
      return radKey.toString(16).substring(1)
    }
    // const s4 = S4() + S4() + S4() + S4() + S4() + S4()
    const code = S4() + Tool.getRandomCode()
    return (idtype.substr(0, 5) + code).substr(0, length)
  },
  // 用于生成随机序列
  getRandomCode(length = 25) {
    if (!(length > 0)) return false
    let data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let nums = "";
    for (let i = 0; i < length; i++) {
      let r = parseInt(Math.random() * 61);
      nums += data[r];
    }
    return nums
  },
  // 在 :root中加入新的变量属性
  // key: -> --{key}
  setProperty(key, value, el = document.documentElement) {
    const isSupported = window.CSS && window.CSS.supports
    if (isSupported) {
      /* supported */
      el.style.setProperty('--' + key, value)
    } else {
      /* not supported */
    }
  },
  // data: 要保存到本地的数据 :filename 文件名
  saveFile(filename, data) {
    let fakeClick = (obj) => {
      let ev = document.createEvent('MouseEvents')
      ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      obj.dispatchEvent(ev)
    }
    let exportRaw = (name, data) => {
      let urlObject = window.URL || window.webkitURL || window
      let export_blob = new Blob([data])
      let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      save_link.href = urlObject.createObjectURL(export_blob)
      save_link.download = name
      fakeClick(save_link)
    }
    exportRaw(filename, data)
  },
  // 加载本地数据
  loadData(url, option = {}) {
    let cof = {
      isJson: true,
      async: true,
      timeout: 60000,
      responseType: 'text',
      headers: {}
    }
    let opt = Object.assign({}, cof, option)
    return new Promise((resolve, reject) => {
      let xmlhttp = null
      // code for Firefox, Opera, IE7, etc.
      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
        // code for IE6, IE5
      } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      // 设置期望的返回数据类型
      xmlhttp.responseType = opt.responseType
      // 设置请求头
      for (const key of Object.keys(opt.headers)) {
        xmlhttp.setRequestHeader(key, opt.headers[key]);
      }
      // 设置超时时间
      if (opt.async && opt.timeout) {
        xmlhttp.timeout = opt.timeout
      }
      xmlhttp.open('GET', url, opt.async)
      xmlhttp.addEventListener('load', e => {
        const status = xmlhttp.status;
        if ((status >= 200 && status < 300) || status === 304) {
          let result = null;
          if (xmlhttp.responseType === 'text') {
            result = xmlhttp.responseText;
          } else if (xmlhttp.responseType === 'document') {
            result = xmlhttp.responseXML;
          } else {
            result = xmlhttp.response;
          }
          if (opt.isJson && Tool.isJsonString(result)) {
            resolve(JSON.parse(result))
          } else {
            resolve(result)
          }
        }
      })
      xmlhttp.send(null)
    })
  },
  // 获取uoload参数
  formParams(event, key, formdata) {
    // 多文件处理
    let multipleFiles = (params, files) => {
      let fileList = Array.prototype.slice.call(files)
      for (const index in fileList) {
        let item = fileList[index]
        // 判断文件大小
        let mb = 20971520
        if (item.size > mb * 50) {
          Vue.$toasting({
            title: '警告',
            type: 'warning',
            message: '文件大小不能超过50MB'
          })
          return
        }
        params.append(key + index, item, item.name)
      }
      params.append('num', fileList.length)
    }
    let files = event.target.files || event.dataTransfer.files
    // 判断文件是否选择
    if (!files[0]) return
    // 判断文件大小
    let mb = 1024 * 1024
    if (files[0].size > mb * 50) {
      Vue.$toasting({
        title: '警告',
        type: 'warning',
        message: '文件大小不能超过50MB'
      })
      return
    }
    let params = new FormData()
    if (formdata instanceof FormData) params = formdata
    if (files.length > 1) {
      multipleFiles(params, files)
    } else {
      for (let item of files) {
        params.append(key, item, item.name)
      }
    }
    return params
  },
  // 图片转Blob
  convertCanvasToBlob(e) {
    let t, i, s, n, r, a, o, c
    // 判断是否为DOM元素
    if (e instanceof HTMLElement) {
      n = 'image/png'
      t = e.toDataURL(n, 0.1)
    } else {
      t = e
    }
    i = window.atob(t.split(',')[1])
    r = new window.ArrayBuffer(i.length)
    a = new window.Uint8Array(r)
    for (s = 0; s < i.length; s++) a[s] = i.charCodeAt(s)
    const BLOBOBJ = window.WebKitBlobBuilder || window.MozBlobBuilder
    let returnData = o ? (c = new BLOBOBJ(), c.append(r), c.getBlob(n)) : new window.Blob([r], {
      type: n
    })
    return returnData
  },
  /** 将base64转换为文件对象
   *  @param {String} base64 base64字符串
   * */
  convertBase64ToBlob(base64) {
    var base64Arr = base64.split(',');
    var imgtype = '';
    var base64String = '';
    if (base64Arr.length > 1) {
      //如果是图片base64，去掉头信息
      base64String = base64Arr[1];
      imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'));
    }
    // 将base64解码
    var bytes = atob(base64String);
    //var bytes = base64;
    var bytesCode = new ArrayBuffer(bytes.length);
    // 转换为类型化数组
    var byteArray = new Uint8Array(bytesCode);

    // 将base64转换为ascii码
    for (var i = 0; i < bytes.length; i++) {
      byteArray[i] = bytes.charCodeAt(i);
    }

    // 生成Blob对象（文件对象）
    return new Blob([bytesCode], {
      type: imgtype
    });
  },
  // 时间戳转换成指定格式日期 绝对时间
  timeFormat(timestamp, formats) {
    // formats格式包括
    // 1. Y-m-d
    // 2. Y-m-d H:i:s
    // 3. Y年m月d日
    // 4. Y年m月d日 H时i分
    formats = formats || 'Y-m-d'
    let zero = (value) => {
      if (value < 10) {
        return '0' + value
      }
      return value
    }
    let myDate = timestamp ? new Date(timestamp) : new Date()
    let year = myDate.getFullYear()
    let month = zero(myDate.getMonth() + 1)
    let day = zero(myDate.getDate())
    let hour = zero(myDate.getHours())
    let minite = zero(myDate.getMinutes())
    let second = zero(myDate.getSeconds())
    return formats.replace(/Y|m|d|H|i|s/ig, (matches) => {
      return ({
        Y: year,
        m: month,
        d: day,
        H: hour,
        i: minite,
        s: second
      })[matches]
    })
  }
}
export {
  Tool as
  default,
  Tool
}
