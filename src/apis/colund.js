import http from '@api/http.js'
// 云组件相关
// 插件上传
export const UPLOAD_COUNLD = params => http('post', '/plugins/upload', params)
// 插件列表
export const GET_COUNLD_LIST = params => http('get', '/plugins/index/lists', params)
// 插件更新
export const UPDATE_PLUGIN = params => http('get', '/plugins/index/update', params)
// 插件删除
export const DEL_PLUGIN = params => http('post', '/plugins/index/del', params)
// 插件下载
export const LOAD_PLUGIN = params => http('post', '/plugins/index/download', params)