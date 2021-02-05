import regular from '@public/validator.js'
export default {
  // 网页
  'wangye'(chartData, resData) {
    let iframeUrl = resData.iframeUrl
    if (!regular.isUrl(iframeUrl)) {
      iframeUrl = 'http://' + iframeUrl
    }
    chartData.src = iframeUrl
  },
  // 轮播图
  'lunbotu'(chartData, resData) {
    chartData.dataUrl = resData.imglist
    chartData.desclist = resData.desclist
  },
  // 富文本
  'fuwenben'(chartData, resData) {
    chartData.data = resData.richtext
  },
  // 计数板
  'jishuban'(chartData, resData) {
    chartData.data = Number(resData.coutnum)
  },
  // 渐变计数板
  'jishubanpro'(chartData, resData) {
    chartData.data = Number(resData.coutnum)
  },
  // 多行文本
  'duoxingwenben'(chartData, resData) {
    chartData.text = resData.text
  },
  // 跑马灯
  'paomadeng'(chartData, resData) {
    chartData.data = resData.divertext
  },
  // 进度条
  'jindutiao'(chartData, resData) {
    chartData.num = resData.prognum
  },
  // 环形进度条
  'huanxingjindutiao'(chartData, resData) {
    chartData.num = resData.prognum
  },
  // 进度条形码
  'jindutiaoxingma'(chartData, resData) {
    chartData.name = resData.name
    chartData.value = resData.value
  },
  // 3d柱状趋势变化图
  '3dzhuzhuangqushibianhuatu'(chartData, resData) {
    chartData.standard = resData.standard
    chartData.title = resData.title
    chartData.value = resData.value
    chartData.percent = ((resData.value / resData.standard - 1) * 100).toFixed(2) + '%'
  },
  // 表格
  'biaoge'(chartData, resData) {
    chartData.data = resData
  },
  // 轮播表格
  'lunbobiaoge'(chartData, resData) {
    chartData.data = resData
  }
}