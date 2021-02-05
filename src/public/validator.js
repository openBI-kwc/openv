// 匹配特定数字： 
/*
^[1-9]d*$　 　 //匹配正整数 
^-[1-9]d*$ 　 //匹配负整数 
^-?[1-9]d*$　　 //匹配整数 
^[1-9]d*|0$　 //匹配非负整数（正整数 + 0） 
^-[1-9]d*|0$　　 //匹配非正整数（负整数 + 0） 
^[1-9]d*.d*|0.d*[1-9]d*$　　 //匹配正浮点数 
^-([1-9]d*.d*|0.d*[1-9]d*)$　 //匹配负浮点数 
^-?([1-9]d*.d*|0.d*[1-9]d*|0?.0+|0)$　 //匹配浮点数 
^[1-9]d*.d*|0.d*[1-9]d*|0?.0+|0$　　 //匹配非负浮点数（正浮点数 + 0） 
^(-([1-9]d*.d*|0.d*[1-9]d*))|0?.0+|0$　　//匹配非正浮点数（负浮点数 + 0） 
评注：处理大量数据时有用，具体应用时注意修正 
*/

// 匹配特定字符串： 
/*
^[A-Za-z]+$　　//匹配由26个英文字母组成的字符串 
^[A-Z]+$　　//匹配由26个英文字母的大写组成的字符串 
^[a-z]+$　　//匹配由26个英文字母的小写组成的字符串 
^[A-Za-z0-9]+$　　//匹配由数字和26个英文字母组成的字符串 
^w+$　　//匹配由数字、26个英文字母或者下划线组成的字符串 
*/

// 在使用RegularExpressionValidator验证控件时的验证功能及其验证表达式介绍如下: 
/*
只能输入数字：“^[0-9]*$” 
只能输入n位的数字：“^d{n}$” 
只能输入至少n位数字：“^d{n,}$” 
只能输入m-n位的数字：“^d{m,n}$” 
只能输入零和非零开头的数字：“^(0|[1-9][0-9]*)$” 
只能输入有两位小数的正实数：“^[0-9]+(.[0-9]{2})?$” 
只能输入有1-3位小数的正实数：“^[0-9]+(.[0-9]{1,3})?$” 
只能输入非零的正整数：“^+?[1-9][0-9]*$” 
只能输入非零的负整数：“^-[1-9][0-9]*$” 
只能输入长度为3的字符：“^.{3}$” 
只能输入由26个英文字母组成的字符串：“^[A-Za-z]+$” 
只能输入由26个大写英文字母组成的字符串：“^[A-Z]+$” 
只能输入由26个小写英文字母组成的字符串：“^[a-z]+$” 
只能输入由数字和26个英文字母组成的字符串：“^[A-Za-z0-9]+$” 
只能输入由数字、26个英文字母或者下划线组成的字符串：“^w+$” 
验证用户密码:“^[a-zA-Z]w{5,17}$”正确格式为：以字母开头，长度在6-18之间， 
*/


// 只能包含字符、数字和下划线。 
/*
验证是否含有^%&',;=?$"等字符：“[^%&',;=?$x22]+” 
只能输入汉字：“^[u4e00-u9fa5],{0,}$” 
验证Email地址：“^w+[-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$” 
验证InternetURL：“^http://([w-]+.)+[w-]+(/[w-./?%&=]*)?$” 
验证电话号码：“^((d{3,4})|d{3,4}-)?d{7,8}$” 
验证身份证号（15位或18位数字）：“^d{15}|d{}18$” 
验证一年的12个月：“^(0?[1-9]|1[0-2])$”正确格式为：“01”-“09”和“1”“12” 
验证一个月的31天：“^((0?[1-9])|((1|2)[0-9])|30|31)$” 
匹配中文字符的正则表达式： [u4e00-u9fa5] 
匹配双字节字符(包括汉字在内)：[^x00-xff] 
匹配空行的正则表达式：n[s| ]*r 
匹配HTML标记的正则表达式：/< (.*)>.*|< (.*) />/ 
匹配首尾空格的正则表达式：(^s*)|(s*$) 
匹配Email地址的正则表达式：w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)* 
匹配网址URL的正则表达式：http://([w-]+.)+[w-]+(/[w- ./?%&=]*)? 
*/
/*
(1) 应用： 计算字符串的长度（ 一个双字节字符长度计2， ASCII字符计1）
String.prototype.len = function () {
  return this.replace([ ^ x00 - xff] / g, "aa").length;
}

(2) 应用： javascript中没有像vbscript那样的trim函数， 我们就可以利用这个表达式来实现
String.prototype.trim = function () {
  return this.replace(/(^s*)|(s*$)/g, "");
}
(3) 应用： 利用正则表达式分解和转换IP地址
//IP地址转换成对应数值 
function IP2V(ip) {
  re = /(d+).(d+).(d+).(d+)/g //匹配IP地址的正则表达式 
  if (re.test(ip)) {
    return RegExp.$1 * Math.pow(255, 3)) + RegExp.$2 * Math.pow(255, 2)) + RegExp.$3 * 255 + RegExp.$4 * 1
  } else {
  throw new Error("Not a valid IP address!")
  }
}
(4)应用：从URL地址中提取文件名的javascript程序 
(5)应用：利用正则表达式限制网页表单里的文本框输入内容 
用正则表达式限制只能输入中文：onkeyup="value="/blog/value.replace(/["^u4E00-u9FA5]/g,'') " onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^u4E00-u9FA5]/g,''))" 
用正则表达式限制只能输入全角字符： onkeyup="value="/blog/value.replace(/["^uFF00-uFFFF]/g,'') " onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^uFF00-uFFFF]/g,''))" 
用正则表达式限制只能输入数字：onkeyup="value="/blog/value.replace(/["^d]/g,'') "onbeforepaste= "clipboardData.setData('text',clipboardData.getData('text').replace(/[^d]/g,''))" 
用正则表达式限制只能输入数字和英文：onkeyup="value="/blog/value.replace(/[W]/g,"'') "onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^d]/g,''
*/
const regexs = {
  number: /^[0-9]+$/,
  email: /^[A-Za-z0-9_\-\.]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
  ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,
  // 电话号码
  fax: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
  // 手机号码
  phone: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$|^0\d{2,3}-?\d{7,8}$/,
  url: /(http|https):\/\/([\w.]+\/?)\S*/,
  websocket: /(ws|wss):\/\/([\w.]+\/?)\S*/,
  money: /^(0|[1-9]\d*)(\.\d+)?$/,
  // 匹配英文字符的正则表达式： 
  english: /^[A-Za-z]+$/,
  // 匹配中文字符的正则表达式： 
  chinese: /^[\u0391-\uFFE5]+$/,
  percent: /^(?:[1-9][0-9]?|100)(?:\.[0-9]{1,2})?$/,
  special: /[~!@#$%^&*()/\|,.<>?"'();:_+-=\[\]{}]/
}



export default {
  // 验证合法邮箱
  isEmail(field) {
    return regexs.email.test(field);
  },
  // 验证合法 ip 地址
  isIp(field) {
    return regexs.ip.test(field);
  },
  // 验证传真
  isFax(field) {
    return regexs.fax.test(field);
  },
  // 验证座机
  isTel(field) {
    return regexs.fax.test(field);
  },
  // 验证手机
  isPhone(field) {
    return regexs.phone.test(field);
  },
  // 验证URL
  isUrl(field) {
    return regexs.url.test(field);
  },
  // 验证websocket
  isWebsocket(field) {
    return regexs.websocket.test(field);
  },
  isMoney(field) {
    return regexs.money.test(field);
  },
  isEnglish(field) {
    return regexs.english.test(field);
  },
  isChinese(field) {
    return regexs.chinese.test(field);
  },
  isPercent(field) {
    return regexs.percent.test(field);
  },
  // 最大长度
  maxLength(field, length) {
    if (!regexs.number.test(length)) return false;
    return field.length <= parseInt(length, 10);
  },
  // 最小长度
  minLength(field, length) {
    if (!regexs.number.test(length)) return false;
    return field.length >= parseInt(length, 10);
  },
  // 不包含特殊符号
  noSpecial: (field) => {
    return regexs.percent.test(field);
  }
}
