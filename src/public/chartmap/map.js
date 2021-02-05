import seriesDefault from '@assets/json/echartsSeries'
import { Utils, Lodash } from '@public/utils'
import { removeOverData } from '@public/chartmap/common.js'
const { setObjData } = Utils
const linecommon = (chartData, resData, opacity = 0) => {
  let { legend, series, xAxis } = chartData
  xAxis.data = resData.name
  let { line } = seriesDefault
  legend.data = []
  // 删除多余的数据
  removeOverData(chartData, resData)
  let last = resData.series.length - 1
  for (let index = 0; index <= last; index++) {
    let item = resData.series[index]
    legend.data.push(item.seriesName)
    let map = {
      'name': item.seriesName,
      'data': item.data,
      'areaStyle.opacity': opacity
    }
    let dataobj = series[index] || Lodash.cloneDeep(line)
    setObjData(dataobj, map)
    series[index] = dataobj
  }
}
export default {
  // 中国3D地图
  '3dzhongguoditu'(chartData, resData) {
    let { series } = chartData
    // 返回的顺序和系列的顺序一致了，只返回这三种类型的数据
    let base = ['lines3D', 'scatter3D', 'bar3D']
    for (let index = 0; index < resData.series.length; index++) {
      const item = resData.series[index]
      const citem = series[index]
      // 没有相应的类型
      if (!base.includes(item.type)) continue
      // 初始化图层数据
      let dataDefault = seriesDefault['geo' + item.type]
      // 类型不一致的删除原来的数据
      if (citem && citem.type !== item.type) {
        series.splice(index, 1)
      }
      let map = {
        'data': item.data
      }
      let dataobj = citem || Lodash.cloneDeep(dataDefault)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 中国地图
  'zhongguoditu'(chartData, resData) {
    let { series } = chartData
    // 返回的顺序和系列的顺序一致了，只返回这四种类型的数据
    let base = ['heatmap', 'effectScatter', 'scatter', 'lines']
    for (let index = 0; index < resData.series.length; index++) {
      const item = resData.series[index]
      const citem = series[index + 1]
      // 没有对相应的类型
      if (!base.includes(item.type)) continue
      // 初始化图层数据
      let dataDefault = seriesDefault['geo' + item.type]
      // 类型不一致的删除原来的数据
      if (citem && citem.type !== item.type) {
        chartData.series.splice(index + 1, 1)
      }
      let map = {
        'data': item.data
      }
      let dataobj = citem || Lodash.cloneDeep(dataDefault)
      // 填充数据
      setObjData(dataobj, map)
      chartData.series[index + 1] = dataobj
    }
  },
  // GIS地图
  'gismap'(chartData, resData) {
    // 返回的顺序和系列的顺序一致了，只返回这四种类型的数据
    let base = ['heatmap', 'effectScatter', 'scatter', 'lines']
    for (let index = 0; index < resData.series.length; index++) {
      const item = resData.series[index]
      // 没有对相应的类型
      if (!base.includes(item.type)) continue
      // 初始化图层数据
      let dataDefault = seriesDefault['geo' + item.type]
      // 原始图层系列
      let citem = chartData.series[index]
      // 类型不一致的删除原来的数据
      if (citem && citem.type !== item.type) {
        chartData.series.splice(index, 1)
      }
      let map = {
        'data': item.data,
        'coordinateSystem': 'bmap'
      }
      let dataobj = citem || Lodash.cloneDeep(dataDefault)
      // 填充数据
      setObjData(dataobj, map)
      chartData.series[index] = dataobj
    }
  },
  // 世界地图
  'shijieditu'(chartData, resData) {
    let { series } = chartData
    // 返回的顺序和系列的顺序一致了，只返回这四种类型的数据
    let base = ['lines', 'heatmap', 'effectScatter', 'scatter']
    for (let index = 0; index < resData.series.length; index++) {
      const item = resData.series[index]
      // 原始图层系列
      let citem = chartData.series[index]
      // 没有相应的类型
      if (!base.includes(item.type)) continue
      // 初始化图层数据
      let dataDefault = seriesDefault['geo' + item.type]
      // 类型不一致的删除原来的数据
      if (citem && citem.type !== item.type) {
        series.splice(index, 1)
      }
      let map = {
        'data': item.data,
        'coordinateSystem': 'geo'
      }
      let dataobj = citem || Lodash.cloneDeep(dataDefault)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 3D世界地图
  '3dshijieditu'(chartData, resData) {
    let { series } = chartData
    //  返回的顺序和系列的顺序一致了，只返回这三种类型的数据
    let base = ['lines3D', 'scatter3D', 'bar3D']
    for (let index = 0; index < resData.series.length; index++) {
      const item = resData.series[index]
      // 原始图层系列
      let citem = chartData.series[index]
      // 没有相应的类型
      if (!base.includes(item.type)) continue
      // 初始化图层数据
      let dataDefault = seriesDefault['geo' + item.type]
      // 类型不一致的删除原来的数据
      if (citem && citem.type !== item.type) {
        series.splice(index, 1)
      }
      let map = {
        'data': item.data,
        'coordinateSystem': 'geo3D',
      }
      let dataobj = citem || Lodash.cloneDeep(dataDefault)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  //地球仪
  'diqiuyi'(chartData, resData) {
    let { series } = chartData
    // 返回的顺序和系列的顺序一致了，只返回这三种类型的数据 只考虑一种类别
    let base = ['lines3D', 'scatter3D', 'bar3D']
    for (let index = 0; index < resData.series.length; index++) {
      const item = resData.series[index]
      // 原始图层系列
      let citem = chartData.series[index]
      // 没有相应的类型
      if (!base.includes(item.type)) continue
      // 初始化图层数据
      let dataDefault = seriesDefault['geo' + item.type]
      // 类型不一致的删除原来的数据
      if (citem && citem.type !== item.type) {
        series.splice(index, 1)
      }
      let map = {
        'data': item.data,
        'coordinateSystem': 'globe'
      }
      let dataobj = citem || Lodash.cloneDeep(dataDefault)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  }
}