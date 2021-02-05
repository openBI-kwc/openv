//编辑屏幕或矩阵相关的信息
import http from '@api/http.js'
//定义接口 
// 获取单个屏幕数据
export const GET_SCREENDATA = params => http('get', '/index/index/singleScreenSummary', params)
// 验证屏幕密码
export const TEST_PASSWORD = params => http('post', '/index/screen/screenValiPassword', params)
// 获取矩阵数据
export const GET_MATRIX_INFO = params => http('post', '/index/index/getScreenDirInfo', params)
// 保存矩阵
export const SAVE_MATRIX = params => http('post', '/index/index/updateScreenDir', params)
// 验证权限
export const TEST_VIEW = params => http('get', '/release/index/valiView', params)
// 发布信息
export const PUBLIC_MSG = params => http('get', '/release/index/publishMsg', params)
