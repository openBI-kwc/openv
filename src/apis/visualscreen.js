// 大屏相关的信息
import http from '@api/http.js'
//定义接口 
// 添加图表
export const ADD_CHART = params => http('post', '/index/screen/addChart', params)
// 更新图表
export const UPDATE_CHART = params => http('put', '/index/screen/updateChart', params)
// 更新大屏配置
export const UPDATE_SCREEN_OPT = params => http('put', '/index/index/updateScreenInfo', params)
// 图表复制
export const COPY_CHART = params => http('post', '/index/screen/chartCopy', params)
// 图表删除
export const DEL_CHART = params => http('delete', '/index/screen/delChart', params)
// 图表锁定
export const LOCK_CHART = params => http('put', '/index/screen/chartLock', params)
// 图表隐藏
export const HIDDEN_CHART = params => http('put', '/index/screen/chartHidden', params)
// 图标移动
export const SWAP_CHART = params => http('put', '/index/screen/moveChart', params)
// 收藏图表
export const COLLECT_CHART = params => http('put', '/index/screen/collection', params)
// 获取数据类型
export const GET_DATA_TYPES = params => http('get', '/index/screen/getDataType', params)
// 获取已有数据源
export const GET_DATA_USED = params => http('post', '/index/screen/getSource', params)
// 获取映射关系
export const GET_MAP_DATA = params => http('post', '/index/screen/mapping', params)
// 获取已有的数据库数据源和自定义视图
export const GET_SQL_CUS_SRC = params => http('post', '/index/screen/getSqlSource', params)
// 查看响应结果
export const GET_RESULT = params => http('post', '/index/screen/responseResults', params)
// 获取屏幕信息
export const GET_SCREEN_INFO = params => http('get', '/index/index/getScreenInfo', params)
// 获取大屏所有图表的数据
export const GET_CHART_DATA = params => http('get', '/index/screen/getAllChart', params)
// 获取图表的静态数据
export const GET_SATIC_DATA = params => http('get', '/index/screen/getStatusData', params)
// 大屏发布接口
export const RELEASE = params => http('post', '/index/screen/addRelease', params)
// 获取token
export const GET_TOKEN = params => http('get', '/index/my/generateToken', params)
// 获取Icon图片
export const GET_ICON = params => http('get', '/index/icon/iconList', params)
// 删除背景图片
export const DELECT_BACKGROUND = params => http('post', '/index/setSystem/attDelete', params)
// 获取大屏分类的所有列表
export const GET_ALL_CATE_LIST = params => http('get', '/index/wIndex/getScreen', params)
// 获取场景屏幕的信息
export const GET_CREATE_SCREEN_INFO = params => http('post', '/index/index/screenInfo', params)
// 删除图片
export const DELETE_PICTURE = params => http('post', '/index/setSystem/attDelete', params)
// 删除Icon
export const DELECT_ICON = params => http('post', '/index/icon/iconDel', params)
// 本地部署
export const LOCAL_DEPLOY = params => http('get', '/index/setSystem/localDeploy', params)
// 保存离线部署大屏数据及配置
export const Export_Large = params => http('post', 'index/screen/exportLarge', params)
// 保存大屏，一次保存所有图表
export const SAVE_ALL_CHARTS = params => http('post', '/index/screen/saveAllChart', params)
// 导出大屏数据
export const EXPORT_SCREEN = params => http('get', '/index/screen/exportScreen', params)
// ----------------------------3D场景---------------------------------------------
// 获取UnityModel
export const GET_UNITY_MODEL = params => http('get', '/index/unity/getFileName', params)
// 获取模型动画
export const GET_ANIMATION = params => http('get', '/index/unity/getAnimation', params)
// 删除单个场景
export const DEL_SCENE = params => http('post', '/index/unity/deleteScenes', params)
// 获取所有场景 id = ? 查单个
export const GET_3D_SCENES = params => http('get', '/index/unity/singleScenesInfo', params)
// 获取所有设备信息
export const GET_ALL_DEV = params => http('get', '/index/deviceInfo/deviceAll', params)
// 绑定模型的数据
export const BIND_MODEL = params => http('post', '/index/deviceInfo/bindDevice', params)
// 删除模型
export const DEL_MODEL = params => http('post', '/index/unity/deleteModel', params)
// 绑定大屏
export const BIND_SCREEN = params => http('post', '/index/deviceInfo/bindScreen', params)
// 验证爱创token
export const VALI_TOKEN = params => http('post', '/acData/valiUser/valiToken', params)
