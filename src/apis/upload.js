// 文件上传
import http from '@api/http.js'
//定义接口
// 上传图片
export const UPLOAD_IMG = params => http('upload', '/index/setSystem/upattachment', params)
// 上传文件
export const UPLOAD_FILE = params => http('upload', '/index/dataSource/uploadFile', params)
// 上传图标
export const UPLOAD_ICON = params => http('upload', '/index/icon/uploadIcon', params)
// 上传水印
export const UPLOAD_SY = params => http('upload', '/index/setSystem/uploadImg', params)
// 模板封面
export const UPLOAD_TMP_COVER = params => http('upload', '/index/template/updateCover', params)
// 更新大屏封面
export const UPDATE_SCREEN_COVER = params => http('upload', '/index/index/updateScreenCover', params)
// 更新模板封面
export const UPDATE_TMP_COVER = params => http('upload', '/index/template/updateTemplateCover', params)
// 上传用户图片
export const UPDATE_MSG = params => http('upload', '/user/user/uploadImg', params)
// 导入大屏
export const IMPORT_SCREEN = params => http('upload', '/index/screen/importScreen', params)