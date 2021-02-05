// 图表相关的方法
'use strict'
import store from '@/store'
import { Utils, Order, Lodash } from '@public/utils'
import chartmap from '@public/chartmap'
import Router from '@/router'
import {ADD_CHART, UPDATE_CHART, GET_CHART_DATA, GET_SATIC_DATA} from '@api/visualscreen.js'
const { delObjData, deBase64, unid } = Utils
const chartPublicMethod = {
  // 通过图表的宽高获取图表的坐标
  getChartPosition(w, h) {
    let currentRoute = Router.history.current
    if (currentRoute.name !== 'screenediting') {return {x: 0, y: 0}}
    let { screenOption } = store.state
    let { width, height } = screenOption
    let x = Math.round(width / 2)
    let y = Math.round(height / 2)
    return {x, y}
  },
  // 增加新的图表组件
  createNewChartAssembly(assembly, chartData, pos) {
    if (Lodash.isObject(chartData)) { assembly.chartData = chartData }
    let x = 0, y = 0
    let { width, height, dataOpt, collection } = assembly
    let currentRoute = Router.history.current
    let sid = deBase64(currentRoute.params.id)
    if (currentRoute.name !== 'screenediting') return
    // 增加公共属性
    const addCommonProps = () => {
      // 图表元素在屏幕中间
      if (!pos) {
        pos = chartPublicMethod.getChartPosition(width, height)
      }
      x = pos.x - width / 2
      y = pos.y - height / 2
      // 默认的配置
      const defaultOption = {
        key: unid(),
        x,
        y,
        resizable: true,
        showBorder: false,
        islock: false,
        ishide: false,
        collection: false
      }
      // 数据源配置
      const dataOptConfig = {
        timeClock: 5,
        autoUpdate: false,
        source: {
          type: 'STATIC'
        }
      }
      if (dataOpt) assembly.dataOpt = { ...dataOpt, ...dataOptConfig }
      assembly = { ...defaultOption, ...assembly }
    }
    const mergeChartData = (chartOpt) => {
      return new Promise(resolve => {
        GET_CHART_DATA({ chartid: chartOpt.tid }).then(res => {
          if (res.err) return
          let resData = res.data[chartOpt.key]
          chartPublicMethod.mergeChartConfigAndData(chartOpt, resData)
          store.dispatch('SET_CHART_LOADING', false)
          resolve()
        })
      })
    }
    // 不是收藏的图表
    if (!collection) { 
      addCommonProps()
    } else {
      assembly.key = unid()
    }
    // 添加图表的参数
    const params = {
      screenid: sid,
      ...assembly
    }
    store.dispatch('SET_CHART_LOADING', true)
    ADD_CHART(params).then(async res => {
      if (res.err) return
      // 图表Id
      assembly.tid = res.data.tid
      // 没有数据的组件不用请求数据
      if (!dataOpt) {
        // 添加到vuex 设置中
        return chartPublicMethod.storeAssemblyToVuex(assembly)
      }
      if (!collection) {
        await chartPublicMethod.getChartStaticData(assembly)
      } else {
        await mergeChartData(assembly)
      }
      chartPublicMethod.storeAssemblyToVuex(assembly)
    })
  },
  // 将组件存储到vuex中
  storeAssemblyToVuex(assembly) {
    store.dispatch('PUSH_POSITION', assembly)
    store.dispatch('SET_CHART_LOADING', false)
    store.dispatch('SET_CHART_INDEX', assembly.key)
  },
  // 合并图表的配置和数据
  mergeChartConfigAndData(chartOpt, resData) {
    try {
      // 没有拿到配置或者没有数据映射关系不执行
      if (!chartOpt.dataOpt || !resData) return
      // 判断数据是否合法
      if (!Lodash.isObject(resData)) return Order.$toasting({
        type: 'warning',
        title: '警告',
        message: resData
      })
      // 图表的类型和数据
      let { charttype, chartData } = chartOpt
      if (!chartmap[charttype]) return
      chartmap[charttype](chartData, resData)
    } catch (error) {
      console.error(error)
    }
  },
  // 更新图表的配置和数据并渲染视图
  updateChartConfigAndData(chartIndex = null) {
    const { index, position } = store.state
    chartIndex = index
    if (!chartIndex) return
    let chartOpt = position[chartIndex]
    GET_CHART_DATA({ chartid: chartOpt.tid }).then(res => {
      if (res.err) return
      let resData = res.data[chartIndex]
      chartPublicMethod.mergeChartConfigAndData(chartOpt, resData)
    })
  },
  // 只更新图表的配置存储到数据库
  updateChartOpt(chartIndex = null, chartConfig = null) {
    const currentRoute = Router.history.current
    if (currentRoute.name !== 'screenediting') return
    const { index, position } = store.state
    let chartKeyName = chartIndex || index
    if (!chartKeyName) return
    let chartOpt = position[chartKeyName]
    let screenid = deBase64(currentRoute.params.id)
    // 复制一份图表的配置项并删除数据项
    let cloneChartConfig = Lodash.cloneDeep(chartOpt)
    chartPublicMethod.filterChartField(cloneChartConfig)
    // 判断新旧值的变化了哪些，如果没有旧值传入就是跟新所有字段
    if (!chartConfig) chartConfig = cloneChartConfig
    if (chartConfig && chartConfig.collectionid) delete chartConfig.collectionid
    let params = Object.assign({screenid}, {}, chartConfig)
    store.dispatch('SET_CHART_LOADING', true)
    UPDATE_CHART(params).then(res => {
      if (res.err) return
      store.dispatch('SET_CHART_LOADING', false)
    })
  },
  // 获取图表静态数据
  getChartStaticData(assembly) {
    let { tid, dataOpt } = assembly
    return new Promise(resolve => {
      GET_SATIC_DATA({ tid }).then(res => {
        if (res.err || !res.data) return
        let result = res.data
        let {resultData, statusData} = result
        // 图表的静态数据
        dataOpt.tdata = statusData
        // 得到了静态数据合并配置
        chartPublicMethod.mergeChartConfigAndData(assembly, resultData)
        resolve(result)
      })
    })
  },
  // 过滤掉不要的字段
  filterChartField(position) {
    // 调试模式不过滤
    if(store.state.setting.development || process.env.NODE_ENV !== 'production') return
    let deleteList = ['indicator', 'categories', 'links', 'tooldata', 'desclist', 'data', 'tdata']
    delObjData(position, deleteList)
  }
}
export default chartPublicMethod
