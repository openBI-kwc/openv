import axios from 'axios'
import { Order, Cookies, Utils } from '@public/utils'
import Router from '@/router'
import Store from '@/store'
//创建axios的一个实例 
let instance = axios.create()
//请求拦截器 忽略
instance.interceptors.request.use(config => {
  let AccessToken = Cookies.getJSON('Access-Token')
  let notauth = ['login', 'share', 'carousel']
  // 当前路由
  let currentroute = Router.history.current.name
  // 不用AccessToken验证
  if (notauth.includes(currentroute) || AccessToken) return config
  Router.replace({ path: '/login' })
  return Order.$toasting({
    type: 'warning',
    title: '警告',
    message: '用户未登录'
  })
}, error => {
  try {
    return Promise.reject(error)
  } catch (error) {}
})
//响应拦截器 忽略
instance.interceptors.response.use((response) => {
  let result = response.data
  let setting = Store.state.setting
  if (setting.localDeploy || !result.err) return result
  const notfound = ['0005', '0006', '2020', '2026', '2040', '8005']
  const relogin = ['10001', '10002', '10003', '10004', '10007']
  if (notfound.includes(result.status + '')) {
    Router.replace('/notfound')
    return result
  }
  if (relogin.includes(result.status + '')) {
    Utils.clearAllStorage()
    Router.replace('/login')
    return result
  }
  Order.$toasting({
    type: 'warning',
    title: '提示',
    message: result.data || 'Server Error'
  })
  return result
}, (error) => {
  try {
    // 对响应错误做点什么
    Order.$toasting({
      type: 'warning',
      title: '警告',
      message: 'Server Error Code 500'
    })
    return Promise.reject(error)
  } catch (error) {}
})
let ajax = (method = 'get', url, params = {}) => {
  method = method.toLowerCase()
  let http = null
  // 不同处理方法
  switch (method) {
    case 'get':
      // 给 get请求加上时间戳参数，避免从缓存中拿数据
      params._t = Utils.unid()
      http = instance({
        method: 'get',
        url,
        params
      })
      break
    case 'post':
      http = instance({
        method: 'post',
        url,
        data: params
      })
      break
    case 'delete':
      params._t = Utils.unid()
      http = instance({
        method: 'delete',
        url,
        params
      })
      break
    case 'put':
      http = instance({
        method: 'put',
        url,
        data: params
      })
      break
    // 上传
    case 'upload':
      if (params instanceof FormData) {
        http = instance.post(url, params)
      }
      break
  }
  return http
}
export default ajax
