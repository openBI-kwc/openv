import * as types from './mutation-types'
import Vue from 'vue'
import Tool from '@public/tool'
const defaultStateOption = {
  // 用户的信息
  user: {},
  // 系统的设置配置信息
  setting: {},
  // 系统的常规信息
  system: {},
  // 当前选中的图表索引
  index: null,
  // 选中的图表索引组
  indexList: [],
  // 所有图表的集合
  position: {},
  // 所有图表映射的图层
  layer: [],
  // 系统菜单
  sysmenu: [],
  // 用户可访问的路由页面的列表
  permissionRoutingList: [],
  // 图表更新loading状态
  chartLoading: false,
  // 大屏移动
  screenMoving: false,
  // 大屏的配置
  screenOption: {
    prohibitDrag: false,
    gridColor: '#1B4457',
    gridSize: 20,
    bgtype: 'color',
    animate: false,
    animateTime: 3000,
    background: {
      color: '#0e2a43'
    },
    width: 1920,
    height: 1200,
    scale: 10
  }
}
export default {
  [types.SET_SCREEN_MOVE](state, data) {
    state.screenMoving = data
  },
  // 动态设置所有的vuex配置数据
  [types.SET_CONFIG](state, data) {
    const stateClone = Tool.cloneDeep(state)
    let newStateItems = Tool.deepObjectMerge(stateClone, data)
    for (let key in newStateItems) {
      let item = newStateItems[key]
      Vue.set(state, key, item)
    }
  },
  // 设置图表加载状态
  [types.SET_CHART_LOADING](state, data = false) {
    state.chartLoading = data
  },
  // 设置屏幕的配置
  [types.SET_SCREEN_OPTION](state, data) {
    if (!data) return
    let screenOption = state.screenOption
    for (let key of Object.keys(data)) {
      let item = data[key]
      if (typeof item === 'undefined') continue
      Vue.set(state.screenOption, key, item)
    }
  },
  // 设置图层列表
  [types.SET_LAYER](state, data) {
    state.layer = data
  },
  // 设置图表配置组信息
  [types.SET_POSITION_LIST](state, data) {
    state.position = data
  },
  // 增加元素图层信息
  [types.PUSH_POSITION](state, data) {
    const key = data.key
    // 空值处理
    if (!key || state.position[key]) return
    Vue.set(state.position, key, data)
    state.layer.unshift(key)
  },
  // 更新元素图层信息
  [types.UPDATE_POSITION](state, data) {
    const key = data.key
    // 空值处理
    if (!key || !state.position[key]) return
    for (let keyName in data) {
      Vue.set(state.position[key], keyName, data[keyName])
    }
  },
  // 销毁元素
  [types.REMOVE_POSITION](state, data) {
    if (!data) return
    // 在图层中索引
    const index = state.layer.indexOf(data)
    if (index < 0 && !state.position[data]) return
    // 删除position
    delete state.position[data]
    // 删除layer
    state.layer.splice(index, 1)
    state.index = null
  },
  // 复制一个元素
  [types.COPY_POSITION](state, data) {
    const index = state.index
    if (!index || !data.key || state.position[data.key]) return
    const newPosition = Tool.cloneDeep(state.position[index])
    let newChart = Tool.deepObjectMerge(newPosition, data)
    Vue.set(state.position, data.key, newChart)
    state.layer.unshift(data.key)
  },
  // 设置可访问的路由列表
  [types.SET_PERMISSION_ROUTING](state, data) {
    state.permissionRoutingList = data
  },
  // 设置系统菜单
  [types.SET_SYS_MENU](state, data) {
    state.sysmenu = data
  },
  // 设置当前单个焦点元素
  [types.SET_CHART_INDEX](state, data) {
    state.index = data
  },
  // 设置当前多个焦点元素
  [types.SET_CHART_INDEX_LIST](state, data) {
    state.indexList = data
  },
  // 设置用户信息
  [types.SET_USER_INFO](state, data) {
    state.user = data
  },
  // 清除屏幕设置
  [types.CLEAR_SCREEN_OPTION](state, data) {
    state.screenOption = Tool.cloneDeep(state.screenOption)
    state.position = {}
    state.layer = []
    state.index = null
  },
  // 设置系统的配置
  [types.SET_SYSTEM_SETTING](state, data) {
    state.setting = data
  },
  // 设置系统的常规信息
  [types.SET_SYSTEM_INFO](state, data) {
    state.system = data
  },
  // 清除所有状态
  [types.CLEAR_ALL_INFO](state, data) {
    let defaultstate = Tool.cloneDeep(defaultStateOption)
    delete defaultstate.system
    for (const key in defaultstate) {
      const value = defaultstate[key]
      Vue.set(state, key, value)
    }
  }
}
