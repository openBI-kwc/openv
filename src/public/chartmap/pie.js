import seriesDefault from '@assets/json/echartsSeries'
import { Utils, Lodash } from '@public/utils'
const { setObjData } = Utils
export default {
  // 标注对比饼图
  'biaozhuduibibingtu'(chartData, resData) {
    let { legend, series } = chartData
    legend.data = resData.legend
    series[0].data = resData.data
  },
  'zhibiaoduibibingtu'(chartData, resData) {
    let { legend, series } = chartData
    legend.data = resData.legend
    series[0].data = resData.data
  },
  // 带图饼图
  'daitubingtu'(chartData, resData) {
    let { legend, series } = chartData
    legend.data = resData.legend
    series[0].data = resData.data
  },
  // 多维度饼图
  'duoweidubingtu'(chartData, resData) {
    let { legend, series } = chartData
    let { pie } = seriesDefault
    legend.data = resData.name
    // 删除多余的数据
    let last = resData.series.length
    let len = series.length
    if (len > last) series.splice(last - 1, len - last)
    for (const index in resData.series) {
      let item = resData.series[index]
      let map = {
        'name': item.seriesName,
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(pie)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 基本饼图
  'jibenbingtu'(chartData, resData) {
    let { legend, series } = chartData
    legend.data = resData.legend
    series[0].data = resData.data
  },
  // 环扇饼图
  'huanshanbingtu'(chartData, resData) {
    let { legend, series } = chartData
    legend.data = resData.legend
    series[0].data = resData.data
  },
  // 轮播饼图
  'lunbobingtu'(chartData, resData) {
    let { legend, series } = chartData
    legend.data = resData.legend
    series[0].data = resData.data
  },
  //环状发光占比图
  'huanzhuangfaguangzhanbitu'(chartData, resData) {
    let { legend, series } = chartData
    legend.data = resData.legend
    let { huanzhuangfaguangzhanbitu } = seriesDefault
    for (const index in resData.series) {
      let item = resData.series[index]
      let map = {
        'data': item.data
      }
      let dataobj = series[index] || Lodash.cloneDeep(huanzhuangfaguangzhanbitu)
      setObjData(dataobj, map)
      series[index] = dataobj
    }
  },
  // 单值百分比饼图
  'danzhibaifenbibingtu'(chartData, resData) {
    let { series } = chartData
    let [current, remaining] = series[0].data
    let {total, value} = resData[0]
    // 当前值
    current.value = value
    // 剩余值
    if (value > total ) {
      remaining.value = 0
    } else {
      remaining.value = total - value
    }
  },
  // 目标占比饼图
  'mubiaozhanbibingtu'(chartData, resData) {
    let { series, title, currenttext, totaltext } = chartData
    // 数据层
    let [current, remaining] = series[0].data
    // 获取的数据
    let {total, value} = resData[0]
    // 当前值
    current.value = value
    // 剩余值
    if (value > total ) {
      remaining.value = 0
    } else {
      remaining.value = total - value
    }
    // 文案
    let [text1, text2] = title
    text1.text = currenttext + value
    text2.text = totaltext + total
  },
  // 指标占比饼图
  'zhibiaozhanbibingtu'(chartData, resData) {
    let { series, title, currenttext, totaltext } = chartData
    // 数据层
    let [current, remaining] = series[0].data
    // 获取的数据
    let {total, value} = resData[0]
    // 当前值
    current.value = value
    // 剩余值
    if (value > total ) {
      remaining.value = 0
    } else {
      remaining.value = total - value
    }
    // 文案
    let [text1, text2] = title
    text1.text = currenttext + value
    text2.text = totaltext + total
  },
  // 百分比对比饼图
  'baifenbiduibibintu'(chartData, resData) {
    let { series } = chartData
    series[0].data = []
    series[0].data[0] = {
      value: resData.branch[0]
    }
    series[0].data[1] = {
      value: resData.branch[1],
      itemStyle: {
        color: "rgba(0,0,0,0)"
      }
    }
    series[1].data = []
    series[1].data[0] = {
      value: resData.total[0]
    }
    series[1].data[1] = {
      value: resData.total[1],
      itemStyle: {
        color: "rgba(0,0,0,0)"
      }
    }
    series[2].data = [100]
  }
}