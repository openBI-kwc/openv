import seriesDefault from '@assets/json/echartsSeries'
import { removeOverData } from '@public/chartmap/common.js'
import { Utils, Lodash } from '@public/utils'
const { setObjData } = Utils
let scatterComs = (chartData, resData, type = 'scatter') => {
  let { legend, series } = chartData
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
    let s = seriesDefault[type]
    let dataobj = series[index] || Lodash.cloneDeep(s)
    setObjData(dataobj, map)
    series[index] = dataobj
  }
}
let scatterLineComs = (chartData, resData, type = 'scatter') => {
  let { legend, series } = chartData
  let { line } = seriesDefault
  let legenddata = []
  // 删除多余的数据
  removeOverData(chartData, resData)
  let last = resData.series.length - 1
  for (let index = 0; index <= last; index++) {
    let item = resData.series[index]
    // 是不是散点
    let isscatter = item.seriesType === type
    // 是不是折线
    let isline = item.seriesType === 'line'
    let legendItem = ''
    if (isscatter) {
      legendItem = '散点-' + item.seriesName
      item.seriesName = legendItem
    } else {
      legendItem = '气泡-' + item.seriesName
      item.seriesName = legendItem
    }
    if (isline) {
      legendItem = '折线-' + item.seriesName
      item.seriesName = legendItem
    }
    // 添加图例
    legenddata.push(legendItem)
    // 修改坐标轴
    let map = {
      'data': item.scatter,
      'name': item.seriesName,
      'type': item.seriesType
    }
    // 拷贝的数据
    let copyData = isscatter ? seriesDefault[type] : line
    let dataobj = series[index] || Lodash.cloneDeep(copyData)
    // 填充数据
    setObjData(dataobj, map)
    series[index] = dataobj
  }
  legend.data = [...new Set(legenddata)]
}

export default {
  // 气泡图
  'qipaotu'(chartData, resData) {
    scatterComs(chartData, resData, 'effectScatter')
  },
  // 散点图
  'sandiantu'(chartData, resData) {
    scatterComs(chartData, resData, 'scatter')
  },
  // 散点折线图
  'sandianzhexiantu'(chartData, resData) {
    scatterLineComs(chartData, resData, 'scatter')
  },
  // 气泡折线图
  'qipaozhexiantu'(chartData, resData) {
    scatterLineComs(chartData, resData, 'effectScatter')
  }
}
