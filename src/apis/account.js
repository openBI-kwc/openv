// 账号管理
import http from '@api/http.js'
//定义接口 
// 获取菜单
export const GET_MENU = params => http('get', '/index/wIndex/index', params)
// 修改密码
export const UPDATE_PASSWORD = params => http('put', '/user/user/userPsswordUpdate', params)
// 保存基本信息
export const SAVA_USERINFO = params => http('put', '/index/woperating/updateBasicMessage', params)
