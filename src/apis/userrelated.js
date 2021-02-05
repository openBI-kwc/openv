// 用户相关的信息
import http from '@api/http.js'
//定义接口
// 登录
export const LOGIN = params => http('post', '/user/user/doLogin', params)
// 退出
export const LOGOUT = params => http('post', '/user/user/loginOut', params)
// 获取用户信息
export const GET_USER_MSG = params => http('post', '/index/wIndex/getUserMsg', params)
// 获取初始的路由
export const GET_INDEX_PATH = params => http('get', '/index/wIndex/getIndexPath', params)
// 获取权限路由表
export const GET_AUTH_LIST = params => http('get', '/index/wIndex/userRouting', params)
