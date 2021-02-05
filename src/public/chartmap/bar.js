import seriesDefault from '@assets/json/echartsSeries'
import { Utils,  Lodash } from '@public/utils'
import { removeOverData } from '@public/chartmap/common.js'
const { setObjData } = Utils
const barcommon = (chartData, resData, type) => {
  let { legend, series, xAxis } = chartData
  xAxis.data = resData.name
  legend.data = []
  // 删除多余的数据
  removeOverData(chartData, resData)
  for (const index in resData.series) {
    let item = resData.series[index]
    legend.data.push(item.seriesName)
    let map = {
      'name': item.seriesName,
      'data': item.data
    }
    let dataobj = series[index] || Lodash.cloneDeep(seriesDefault[type])
    setObjData(dataobj, map)
    series[index] = dataobj
  }
}
export default {
  // 斑马柱图
  'banmazhutu'(chartData, resData) {
    barcommon(chartData, resData, 'pictorialBar')
  },
  // 垂直基本柱图
  'chuizhijibenzhutu'(chartData, resData) {
    barcommon(chartData, resData, 'bar')
  },
  // 垂直胶囊柱图
  'chuizhijiaonanzhutu'(chartData, resData) {
    let { legend, series, xAxis } = chartData
    xAxis.data = resData.name
    let { bar } = seriesDefault
    legend.data = []
    // 删除多余的数据
    removeOverData(chartData, resData)
    for (const index in resData.series) {
      let item = resData.series[index]
      legend.data.push(item.seriesName)
      let map = {
        'name': item.seriesName,
        'data': item.data,
        'label.position': 'inside',
        'label.rotate': 90,
        'stack': 'default'
      }
      let dataobj = series[index] || Lodash.cloneDeep(bar)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 分组柱图
  'fenzuzhutu'(chartData, resData) {
    let { legend, series, yAxis } = chartData
    yAxis[0].data = resData.name
    let { bar } = seriesDefault
    legend.data = []
    for (const index in resData.series) {
      let item = resData.series[index]
      legend.data.push(item.seriesName)
      // 删除多余的数据
      removeOverData(chartData, resData)
      let map = {
        'name': item.seriesName,
        'label.position': 'inside',
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(bar)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 弧形柱图
  'huxingzhutu'(chartData, resData) {
    let { legend, series, radiusAxis } = chartData
    radiusAxis.data = resData.name
    legend.data = []
    let { huxingzhuzhuangtu } = seriesDefault
    // 删除多余的数据
    removeOverData(chartData, resData)
    for (const index in resData.series) {
      let item = resData.series[index]
      legend.data.push(item.seriesName)
      let map = {
        'name': item.seriesName,
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(huxingzhuzhuangtu)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 基本柱图
  'jibenzhutu'(chartData, resData) {
    let { legend, series, xAxis, yAxis } = chartData
    let { bar } = seriesDefault
    xAxis.data = resData.name
    yAxis[0].show = false
    legend.data = []
    // 删除多余的数据
    removeOverData(chartData, resData)
    for (const index in resData.series) {
      let item = resData.series[index]
      legend.data.push(item.seriesName)
      let map = {
        'name': item.seriesName,
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(bar)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 水平基本柱图
  'shuipingjibenzhutu'(chartData, resData) {
    let { legend, series, yAxis } = chartData
    let { bar } = seriesDefault
    yAxis[0].data = resData.name
    legend.data = []
    // 删除多余的数据
    removeOverData(chartData, resData)
    for (const index in resData.series) {
      let item = resData.series[index]
      legend.data.push(item.seriesName)
      let map = {
        'name': item.seriesName,
        'label.position': 'inside',
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(bar)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 水平胶囊柱图
  'shuipingjiaonanzhutu'(chartData, resData) {
    let { legend, series, yAxis } = chartData
    yAxis[0].data = resData.name
    let { bar } = seriesDefault
    legend.data = []
    // 删除多余的数据
    removeOverData(chartData, resData)
    for (const index in resData.series) {
      let item = resData.series[index]
      legend.data.push(item.seriesName)
      let map = {
        'name': item.seriesName,
        'label.position': 'inside',
        'data': item.data,
        'stack': 'default'
      }
      let dataobj = series[index] || Lodash.cloneDeep(bar)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 梯形柱图
  'tixingzhutu'(chartData, resData) {
    let { legend, series, xAxis } = chartData
    xAxis.data = resData.name
    let { bar } = seriesDefault
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
        'barGap': '10%'
      }
      if (index === 0) {
        map['itemStyle.barBorderRadius'] = [0, 0, 0, 99999]
      }
      if (index === last) {
        map['itemStyle.barBorderRadius'] = [0, 0, 99999, 0]
      }
      let dataobj = series[index] || Lodash.cloneDeep(bar)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 折线柱图
  'zhexianzhutu'(chartData, resData) {
    let { legend, series, xAxis } = chartData
    let { bar, line } = seriesDefault
    xAxis.data = resData.name
    legend.data = []
    // 删除多余的数据
    removeOverData(chartData, resData)
    let last = resData.series.length - 1
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      // 是不是柱子
      let isbar = item.seriesType === 'bar'
      // 修改图例
      let legendItem = ''
      if (isbar) legendItem = '柱子-' + item.seriesName
      else legendItem = '折线-' + item.seriesName
      legend.data.push(legendItem)
      // 修改坐标轴
      let map = {
        'name': legendItem,
        'data': item.data,
        'yAxisIndex': isbar ? 0 : 1
      }
      // 删除区域样式
      // !isbar && (map['areaStyle.opacity'] = 0.3)
      // 拷贝的数据
      let copyData = isbar ? bar : line
      let dataobj = series[index] || Lodash.cloneDeep(copyData)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 单轴折线柱图
  'danzhouzhexianzhutu'(chartData, resData) {
    let { legend, series, xAxis } = chartData
    let { bar, line } = seriesDefault
    xAxis.data = resData.name
    legend.data = []
    // 删除多余的数据
    removeOverData(chartData, resData)
    let last = resData.series.length - 1
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      // 是不是柱子
      let isbar = item.seriesType === 'bar'
      // 修改图例
      let legendItem = ''
      if (isbar) legendItem = '柱子-' + item.seriesName
      else legendItem = '折线-' + item.seriesName
      legend.data.push(legendItem)
      // 修改坐标轴
      let map = {
        'name': legendItem,
        'data': item.data,
      }
      // // 删除区域样式
      // !isbar && (map['areaStyle.opacity'] = 1)
      // 拷贝的数据
      let copyData = isbar ? bar : line
      let dataobj = series[index] || Lodash.cloneDeep(copyData)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 3D柱状图
  '3dzhuzhuangtu'(chartData, resData) {
    let { series, xAxis3D, yAxis3D } = chartData
    let { bar3D } = seriesDefault
    xAxis3D.data = Array.from(new Set(resData.xname))
    yAxis3D.data = Array.from(new Set(resData.yname))
    series[0].data = resData.data
    },
  // 双向横向柱状图
  'shuangxianghengxiangzhuzhuangtu'(chartData, resData) {
    let { series, yAxis } = chartData
    yAxis[0].data = resData.name
    let { bar } = seriesDefault
    removeOverData(chartData, resData)
    let last = resData.series.length - 1
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      let map = {
        'name': item.seriesName,
        'label.position': 'inside',
        'data': item.data,
        'stack': 'default'
      }
      let dataobj = series[index] || Lodash.cloneDeep(bar)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 锥形柱图
  'zhuixingzhutu'(chartData, resData) {
    let { legend, xAxis, series } = chartData
    let { pictorialBar, gradline } = seriesDefault
    removeOverData(chartData, resData)
    legend.data = resData.legend
    xAxis.data = resData.name
    // 删除多余的数据
    resData.series.forEach((item,index) => {
      if (index === 0) {
        let map = {
          'name': item.seriesName,
          'type': 'line',
          'data': item.data
        }
        let dataobj = series[0] || Lodash.cloneDeep(gradline)
        setObjData(dataobj, map)
        series[0] = dataobj
      } else {
        let map = {
          'name': item.seriesName,
          'symbolSize': '100%',
          'barGap': '-50%',
          'barWidth': 50,
          'symbolRepeat': false,
          'data': item.data
        }
        let dataobj = series[index] || Lodash.cloneDeep(pictorialBar)
        setObjData(dataobj, map)
        series[index] = dataobj
      }
    })
  },
  // 渐变柱状图
  'jianbianzhuzhuangtu'(chartData, resData) {
    let { yAxis, series } = chartData
    yAxis[0].data = resData.name
    series[0].data = resData.seriesData
  },
  // 水平发光柱状图
  'shuipingfaguangzhuzhuangtu'(chartData, resData) {
    let { yAxis, series } = chartData
    yAxis[0].data = resData.name
    series[0].data = resData.seriesData
    series[1].data = resData.seriesData
  },   
  // 分组渐变柱状图
  'fenzujianbianzhuzhuangtu'(chartData, resData) {
    let { yAxis, series, legend } = chartData
    let { gradbar } = seriesDefault
    yAxis.data = resData.name
    // 删除多余的数据
    removeOverData(chartData, resData)
    legend.data = []
    resData.series.forEach((item, index) => {
      legend.data.push(item.seriesName)
      let map = {
        'name': item.seriesName,
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(gradbar)
      setObjData(dataobj, map)
      series[index] = dataobj
    })
  }
}
