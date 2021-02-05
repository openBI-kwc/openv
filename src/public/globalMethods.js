/* 全局方法 */
'use strict'
// 引入外部文件和第三方依赖
import Vue from 'vue'
import ElementUI, { Notification } from 'element-ui'
import Alert from '@coms/common/Alert'
import directives from '@public/directive.js'
import eventBus from '@public/eventBus.js'
import VTooltip from 'v-tooltip'
import 'echarts-gl'
import 'echarts-wordcloud'
import 'echarts-liquidfill'
import '@public/filters.js'
import '@public/componentRegister.js'
// import 'element-ui/lib/theme-chalk/index.css'
const $ = window.$
// 全局注册ElementUI
Vue.use(ElementUI)
// 全局指令
Vue.use(directives)
// eventbus事件栈
Vue.use(eventBus)
// 提示指令
Vue.use(VTooltip)
// 显示弹出框
let showAlert = (option, callBack) => {
  const VueAlert = Vue.extend(Alert)
  const AlertWindow = new VueAlert()
  let opt = {
    type: 'info',
    msg: '',
    callback: callBack || null,
    isclose: true,
    text: '提示'
  }
  if (typeof option === 'string') {
    option = Object.assign({}, opt, {msg: option})
  }
  option = Object.assign({}, opt, option)
  const typesText = {
    info: '提示',
    success: '成功',
    error: '错误',
    warning: '警告',
  }
  option.text = typesText[option.type]
  AlertWindow.showAlertMessage(option)
  AlertWindow.$mount()
  document.body.appendChild(AlertWindow.$el)
}
// 屏幕右侧吸附的toasting
let showToasting = (options) => {
  let opt = {
    type: 'info',
    position: 'top-left',
    duration: 2000
  }
  let params = Object.assign({}, opt, options)
  const typesText = {
    info: '提示',
    success: '成功',
    error: '错误',
    warning: '警告',
  }
  params.title = typesText[params.type]
  let timer = null
  clearTimeout(timer)
  timer = setTimeout(() => {
    let NotificationCom = Notification(params)
    $(NotificationCom.$el).addClass(params.type)
  }, 16.7)
}
export default {
  install(Vue, options) {
    // 全局警告提示框
    Vue.prototype.$alert = showAlert
    // 全局的toast
    Vue.prototype.$toasting = showToasting
  }
}
