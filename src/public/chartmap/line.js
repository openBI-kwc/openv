import seriesDefault from '@assets/json/echartsSeries'
import { Utils,  Lodash } from '@public/utils'
import {
  removeOverData
} from '@public/chartmap/common.js'
const { setObjData } = Utils
const linecommon = (chartData, resData, opacity = 0) => {
  let {
    legend,
    series,
    xAxis
  } = chartData
  xAxis.data = resData.name
  let {
    line
  } = seriesDefault
  legend.data = []
  // 删除多余的数据
  removeOverData(chartData, resData)
  let last = resData.series.length - 1
  for (let index = 0; index <= last; index++) {
    let item = resData.series[index]
    legend.data.push(item.seriesName)
    let map = {
      'name': item.seriesName,
      'data': item.data
    }
    let dataobj = series[index] || Lodash.cloneDeep(line)
    setObjData(dataobj, map)
    series[index] = dataobj
  }
}
export default {
  // 基本折线图
  'jibenzhexiantu'(chartData, resData) {
     let {
    legend,
    series,
    xAxis
  } = chartData
  xAxis.data = resData.name
  let {
    line
  } = seriesDefault
  legend.data = []
  // 删除多余的数据
  removeOverData(chartData, resData)
  let last = resData.series.length - 1
  for (let index = 0; index <= last; index++) {
    let item = resData.series[index]
    legend.data.push(item.seriesName)
    let map = {
      'name': item.seriesName,
      'data': item.data
    }
    let dataobj = series[index] || Lodash.cloneDeep(line)
    setObjData(dataobj, map)
    series[index] = dataobj
  }
  },
  // 区域图
  'quyutu'(chartData, resData) {
    linecommon(chartData, resData, 1)
  },
  // 区域翻拍器
  'quyufanpaiqi'(chartData, resData) {
    linecommon(chartData, resData, 1)
  },
  // 双轴折线图
  'shuangzhouzhexiantu'(chartData, resData) {
    let {
      legend,
      series,
      xAxis
    } = chartData
    let {
      line
    } = seriesDefault
    xAxis.data = resData.name
    legend.data = []
    // 删除多余的数据
    removeOverData(chartData, resData)
    let last = resData.series.length - 1
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      // 是不是第一个轴
      let isyaxis1 = item.seriesType === 'yaxis1'
      // 修改图例
      let legendItem = ''
      if (isyaxis1) legendItem = 'Y轴1-' + item.seriesName
      else legendItem = 'Y轴2-' + item.seriesName
      legend.data.push(legendItem)
      // 修改坐标轴
      let map = {
        'name': legendItem,
        'data': item.data,
        'yAxisIndex': isyaxis1 ? 0 : 1
      }
      let dataobj = series[index] || Lodash.cloneDeep(line)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 3D折线图
  '3dzhexiantu'(chartData, resData) {
    let {
      series
    } = chartData
    let {
      line3D
    } = seriesDefault
    // 删除多余的数据
    removeOverData(chartData, resData)
    let last = resData.series.length - 1
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      let map = {
        'name': item.seriesName,
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(line3D)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 虚线折线图
  'xuxianzhexiantu'(chartData, resData) {
    let {
      series
    } = chartData
    let {
      line
    } = seriesDefault
    // 删除多余的数据
    removeOverData(chartData, resData)
    let { xAxis } = chartData
    xAxis.data = resData.name
    let last = resData.series.length - 1
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      let map = {
        'name': item.seriesName,
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(line)
      setObjData(dataobj, map)
      series[index] = dataobj
      series[index].lineStyle.type = 'dashed'
    }
  }
}
