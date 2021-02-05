// 全局过滤器
'use strict'
import Utils from '@public/utils'
import Vue from 'vue'
let filters = {
  // 验证空字符
  strFormat: value => {
    if (typeof value === 'string' && value.trim().length > 0) return value
    else return '暂无内容'
  },
  // 时间格式化
  timeFormat:value => {
    if (typeof value !== 'number') return '无效时间'
    try {
      // 判断时间戳是否有效
      new Date(parseInt(value))
      return Utils.timeFormat(value, 'Y-m-d H:i:s')
    } catch (e) {
      return '无效时间'
    }
  }
}
for (const key in filters) {
  Vue.filter(key, (value) => {
    return filters[key](value)
  })
}
