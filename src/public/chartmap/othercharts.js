import seriesDefault from '@assets/json/echartsSeries'
import { Utils, Lodash } from '@public/utils'
import { removeOverData } from '@public/chartmap/common.js'
const { setObjData } = Utils
let graphHanler = (chartData, resData) => {
  // 删除数据时要删除 categories  links
  let { series } = chartData
  // 类目
  series[0].categories = resData.categories.map(item => {
    return {
      name: item
    }
  })
  // 数据
  series[0].data = resData.data.map(item => {
    return {
      ...item,
      symbolSize: item.size
    }
  })
  // 节点关系
  series[0].links = resData.links
}
export default {
  // 词云
  'ciyun'(chartData, resData) {
    function createRandomItemStyle() {
      return {
        normal: {
          color: 'rgb(' + [
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160)
          ].join(',') + ')'
        }
      }
    }
    chartData.series[0].data = resData.map(item => {
      item.textStyle = createRandomItemStyle()
      return item
    })
  },
  // 漏斗图
  'loudoutu'(chartData, resData) {
    let { legend, series } = chartData
    let { funnel } = seriesDefault
    legend.data = resData.name
    // 删除多余的数据
    removeOverData(chartData, resData)
    let last = resData.series.length - 1
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      let map = {
        'name': item.seriesName,
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(funnel)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 水球图
  'shuiqiutu'(chartData, resData) {
    let value = resData.value
    let maxWaveNum = chartData.series[0].maxWaveNum
    let wavedata = []
    for (let index = 0; index < maxWaveNum; index++) {
      wavedata.push({ value })
    }
    chartData.series[0].data = wavedata
  },
  // 仪表盘
  'yibiaopan'(chartData, resData) {
    let gaugedata = resData.data
    chartData.series[0].data = gaugedata
  },
  // 雷达图
  'leidatu'(chartData, resData) {
    // 删除数据时要删除 indicator
    let { radar, series } = chartData
    let { target, maxVal } = resData
    let indicator = []
    let { leidatu } = seriesDefault
    // 遍历指标
    for (let index = 0; index < target.length; index++) {
      indicator.push({
        text: target[index],
        max: maxVal[index]
      })
    }
    radar.indicator = indicator
    // 数据
    let rdata = resData.data
    let sdata = series[0].data || []
    let removeRData = (sdata, rdata) => {
      let last = rdata.length
      let len = sdata.length
      if (len > last) sdata.splice(last - 1, len - last)
    }
    // 删除多余的数据
    removeRData(sdata, rdata)
    for (let index = 0; index < rdata.length; index++) {
      let item = rdata[index]
      let dataobj = sdata[index] || Lodash.cloneDeep(leidatu)
      let map = {
        'name': item.name,
        'value': item.value
      }
      setObjData(dataobj, map)
      sdata.push(dataobj)
    }
    series[0].data = sdata
  },
  // 箱型图
  'xiangxingtu'(chartData, resData) {
    let { xAxis, series, legend } = chartData
    let { boxplot } = seriesDefault
    legend.data = []
    // x轴
    xAxis.data = resData.name
    // 删除多余的数据
    removeOverData(chartData, resData)
    let last = resData.series.length - 1
    // 数据
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      // 修改图例
      legend.data.push(item.seriesName)
      // 修改坐标轴
      let map = {
        'name': item.seriesName,
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(boxplot)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 热力图
  'relitu'(chartData, resData) {
    let { xAxis, series, yAxis } = chartData
    // x轴
    xAxis.data = resData.xAxisData
    // y轴
    yAxis[0].data = resData.yAxisData
    // 数据
    series[0].data = resData.data
  },
  // 关系图
  'guanxiwangluo'(chartData, resData) {
    graphHanler(chartData, resData)
  },
  // 和弦图
  'hexiantu'(chartData, resData) {
    graphHanler(chartData, resData)
  },
  //矩形树图
  'juxingshutu'(chartData, resData) {
    let { series } = chartData
    let { rectangletree } = seriesDefault
    // 删除多余的数据
    removeOverData(chartData, resData)
    let last = resData.series.length - 1
    // 数据
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      // 修改坐map
      let map = {
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(rectangletree)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  //桑基图
  'sangjitu'(chartData, resData) {
    let { series } = chartData
    let { sankey } = seriesDefault
    // 删除多余的数据
    removeOverData(chartData, resData)
    let last = resData.series.length - 1
    // 数据
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      // 修改map
      let map = {
        'links':item.links,
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(sankey)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  //旭日图
  'xuritu'(chartData, resData) {
    let { series } = chartData
    let { sunburst } = seriesDefault
    // 删除多余的数据
    removeOverData(chartData, resData)
    let last = resData.series.length - 1
    // 数据
    for (let index = 0; index <= last; index++) {
      let item = resData.series[index]
      // 修改map
      let map = {
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(sunburst)
      // 填充数据
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  }
}