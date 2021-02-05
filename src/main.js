// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 通过CDN已经引入的依赖 import ... from ... 可以删除
//转译ie下的es高级语法
import 'babel-polyfill'
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Utils, Cookies, Lodash, Storage } from '@public/utils'
import globalMethods from '@public/globalMethods.js'
// 注册全局方法
Vue.use(globalMethods)
const { loadData, enBase64, deBase64 } = Utils
// 设置默认的axios的配置
const setAxios = (params) => {
  if (!Lodash.isObject(params)) return
  let defaultsConfig = Object.assign({}, {
    baseURL: '/apis',
    timeout: 60000,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Token': Cookies.get('Access-Token') || 'not login'
    }
  }, params)
  for (let key in defaultsConfig) {
    axios.defaults[key] = defaultsConfig[key]
  }
}
// 加载默认配置
const loadConfig = () => {
  return new Promise(resolve => {
    loadData('./static/config.json').then(configData => { resolve(configData) })
  })
}
(async () => {
  const configData = await loadConfig()
  const { setting, system } = configData
  let axiosParams = {}
  process.env.NODE_ENV === 'production' && (axiosParams = { baseURL: setting.server })
  setAxios(axiosParams)
  // 加载配置文件信息
  store.dispatch('SET_SYSTEM_SETTING', setting)
  store.dispatch('SET_SYSTEM_INFO', system)
  Storage.set('System-Setting', enBase64(JSON.stringify(system)))
  // await loadMap()
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })
})()
