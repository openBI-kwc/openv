// 系统管理的信息
import http from '@api/http.js'
//定义接口 
// 获取附件设置
export const GET_ATTACHMENT = params => http('get', '/index/setSystem/getAttachment', params)
// 更新附件
export const UPDATE_ATTACHMENT = params => http('put', '/index/setSystem/attachment', params)
// 添加备份
export const ADD_BACKUP = params => http('get', '/index/setSystem/backup', params)
// 删除备份
export const DELETE_BACKUP = params => http('post', '/index/setSystem/backupDel', params)
// 获取备份列表
export const GET_BACKUPLIST = params => http('get', '/index/setSystem/backupList', params)
// 获取常规设置
export const GET_GENERAL = params => http('get', '/index/setSystem/generalList', params)
// 更新常规设置
export const SET_GENERAL = params => http('put', '/index/setSystem/generalSet', params)
// 获取附件列表
export const GET_ATTLIST = params => http('get', '/index/setSystem/attList', params)
// 删除附件
export const DEL_ATTLIST = params => http('post', '/index/setSystem/attDelete', params)
// 获取配置安全管理信息
export const GET_SAFE = params => http('get', '/index/wIndex/safeGet', params)
// 更新配置安全管理信息
export const SET_SAFE = params => http('put', '/index/woperating/safeSet', params)
// 获取常规设置
export const GET_WEBSOCKET_CONFIG = params => http('get', '/websocket/Setting/index', params)
// 更新常规设置
export const SET_WEBSOCKET_CONFIG = params => http('put', '/websocket/Setting/set', params)
