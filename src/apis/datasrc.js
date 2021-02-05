// 数据管理相关的信息
import http from '@api/http.js'
//定义接口 
// 获取数据管理列表
export const GET_DATA = params => http('get', '/index/datament/dataList', params)
// 搜索数据
export const SEARCH_DATA = params => http('get', '/index/datament/search', params)
// 删除数据
export const DELETE_DATA = params => http('post', '/index/datament/delData', params)
// 修改数据备注
export const MODIFY_REMARK = params => http('post', '/index/dataBaseSource/modifynotes', params)
// 添加API
export const ADD_API = params => http('post', '/index/my/addApi', params)
// 添加EXCEL
export const ADD_EXCEL = params => http('post', '/index/datament/addCsv', params)
// 修改API/EXCEL
export const UPDATE_DATA = params => http('put', '/index/datament/updateDataSrc', params)
// 查询所有数据表
export const QUERY_DATATABLE = params => http('post', '/index/dataBaseSource/showTables', params)
// 执行SQL语句
export const RUN_SQL = params => http('get', '/index/dataBaseSource/showSql', params)
// 添加SQL
export const ADD_SQL = params => http('post', '/index/dataBaseSource/sqlLink', params)
// 修改SQL
export const UPDATE_SQL = params => http('post', '/index/dataBaseSource/updateSql', params)
// 获取数据表数据
export const GET_TABLEDATA = params => http('post', '/index/dataBaseSource/selectTables', params)
// 添加自定义视图
export const ADD_CUSTOM = params => http('post', '/index/dataBaseSource/addCustomize', params)
// 修改自定义视图
export const UPDATE_CUSTOM = params => http('post', '/index/dataBaseSource/updateCustomize', params)
// 获取数据库列表
export const GET_DATABASE = params => http('get', '/index/dataBaseSource/getDataBase', params)
// 搜索数据库列表
export const SEARCH_DATABASE = params => http('get', '/index/dataBaseSource/likeWord', params)
// 删除数据库
export const DELETE_DATABASE = params => http('post', '/index/dataBaseSource/deleteDataBase', params)
// 测试连接数据库
export const TEST_CONNECTION = params => http('post', '/index/dataBaseSource/testConnection', params)
// 添加数据库
export const ADD_DATABASE = params => http('post', '/index/dataBaseSource/addDataBase', params)
// 修改数据库
export const UPDATE_DATABASE = params => http('put', '/index/dataBaseSource/updateDataBase', params)
