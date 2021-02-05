// 可视化相关的信息
import http from '@api/http.js'
//定义接口 
// 获取大屏列表
export const GET_SCREEN = params => http('get', '/index/index/screenSummary', params)
// 删除屏幕
export const DELETE_SCREEN = params => http('post', '/index/index/deleteScreen', params)
// 复制屏幕
export const COPY_SCREEN = params => http('post', '/index/index/copyScreen', params)
// 锁定屏幕
export const LOCK_SCREEN = params => http('post', '/index/screen/screenLocking', params)
// 解锁屏幕
export const UNLOCK_SCREEN = params => http('post', '/index/screen/screenUnlocking', params)
// 获取矩阵列表
export const GET_MATRIX_LIST = params => http('get', '/index/index/screenDirSummary', params)
// 新建矩阵
export const ADD_MATRIX = params => http('post', '/index/index/screenDir', params)
// 删除矩阵
export const DELETE_MATRIX = params => http('post', '/index/index/deleteScreenDir', params)
// 获取发布列表
export const GET_RELEASE = params => http('get', '/index/screen/releaseList', params)
// 取消发布
export const DELETE_RELEASE = params => http('delete', '/index/screen/deleteRelease', params)
// 获取模板
export const GET_TEMPLATE = params => http('get', '/index/template/templateSummary', params)
// 新建模板
export const ADD_TEMPLATE = params => http('post', '/index/template/templateInfo', params)
// 获取分类（大屏和数据管理的分类）列表 有用户权限
export const GET_CATE_LIST = params => http('get', '/index/index/cateGain', params)
// 获取发布信息
export const GET_PUB_INFO = params => http('post', '/index/dataMap/publish', params)
// 发布大屏
export const SHARE_SCRREN = params => http('post', '/index/dataMap/pUpdate', params)
// 大屏重命名
export const RENAME_SCRREN = params => http('post', '/index/index/updateScreenName', params)
// 矩阵重命名
export const RENAME_MATRIX = params => http('post', '/index/index/updateScreenDirName', params)
// 模板重命名
export const RENAME_TMPLATE = params => http('post', '/index/template/updateTemplate', params)
// 删除模板
export const DEL_TMP = params => http('delete', '/index/template/deleteTemplate', params)
// 获取我的收藏
export const GET_COLLEC = params => http('get', '/index/screen/getCollection', params)
// 删除我的收藏
export const DEL_COLLEC = params => http('post', '/index/screen/collection', params)
// 修改轮播大屏
export const UPDATE_CAROUSEL_SCREEN = params => http('put', '/index/carousel/updateCarouselScreen', params)
// 添加轮播大屏
export const ADD_CAROUSEL_SCREEN = params => http('post', '/index/carousel/addCarouselScreen', params)
// 获取轮播大屏
export const GET_CAROUSEL = params => http('get', '/index/carousel/getCarousel', params)
// 删除轮播大屏
export const DEL_CAROUSEL = params => http('delete', '/index/carousel/delCarousel', params)
// 获取轮播大屏详情
export const GET_CAROUSEL_DETAIL = params => http('get', '/index/carousel/getCarouselDetail', params)
