// 权限管理的信息
import http from '@api/http.js'
//定义接口
// 获取分类列表
export const GET_CLASS = params => http('get', '/index/wIndex/manageClass', params)
// 添加分类
export const ADD_CLASS = params => http('post', '/index/woperating/classAdd', params)
// 重命名分类
export const RENAME_CLASS = params => http('put', '/index/woperating/rename', params)
// 查询分类
export const QUERY_CLASS = params => http('get', '/index/wIndex/getScreenSid', params)
// 删除分类
export const DELETE_CLASS = params => http('delete', '/index/woperating/classDel', params)
// 获取权限列表
export const GET_PERMISSION = params => http('get', '/index/wIndex/permissionGet', params)
// 添加权限
export const ADD_PERMISSION = params => http('post', '/index/woperating/permissionAdd', params)
// 查询权限
export const QUERY_PERMISSION = params => http('get', '/index/wIndex/getPermissionMessage', params)
// 修改权限
export const UPDATE_PERMISSION = params => http('put', '/index/woperating/permissionUpdate', params)
// 删除权限
export const DELETE_PERMISSION = params => http('delete', '/index/woperating/permissionDel', params)
// 获取用户组列表
export const GET_USER = params => http('get', '/index/wIndex/roleList', params)
// 获取角色列表
export const GET_PERLIST = params => http('get', '/index/wIndex/permissionGet', params)
// 添加用户组
export const ADD_USERGROUP = params => http('post', '/index/woperating/roleAdd', params)
// 修改用户组
export const UPDATE_USERGROUP = params => http('put', '/index/woperating/roleUpdate', params)
// 查询用户组
export const QUERY_USERGROUP = params => http('get', '/index/wIndex/rolePermission', params)
//删除用户组
export const DELETE_USERGROUP = params => http('delete', '/index/woperating/roleDel', params)
// 登录日志列表
export const LOGUSER_LIST = params => http('get', '/index/wIndex/loguserList', params)
// 操作日志列表
export const LOGLIST = params => http('get', '/index/wIndex/logList', params)
// 获取用户管理用户列表
export const GET_USERLIST = params => http('get', '/index/wIndex/userList', params)
// 获取全部用户分类权限
export const GET_SCREENGROUP = params => http('get', '/index/wIndex/getScreenGroup', params)
// 获取用户管理角色列表
export const GET_ROLE = params => http('get', '/index/wIndex/getRole', params)
// 添加用户
export const USER_ADD = params => http('post', '/index/woperating/userAdd', params)
// 修改用户
export const USER_UPDATE = params => http('put', '/index/woperating/userUpdate', params)
// 查询用户信息
export const GET_USER_MSG = params => http('get', '/index/wIndex/getUserMessage', params)
// 查询用户分类权限
export const GET_GROUP_MSG = params => http('get', '/index/wIndex/getScreenGroupMessage', params)
//删除用户
export const USER_DELETE = params => http('delete', '/index/woperating/userDel', params)
