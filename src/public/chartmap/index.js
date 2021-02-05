import PieMap from '@public/chartmap/pie'
import BarMap from '@public/chartmap/bar'
import Tool from '@public/chartmap/tool'
import Scatter from '@public/chartmap/scatter'
import Line from '@public/chartmap/line'
import Othercharts from '@public/chartmap/othercharts'
import MapChart from '@public/chartmap/map'
import Colund from '@public/chartmap/colund'
// 图表数据的执行函数
export default {
  // 饼图的数据格式映射
  ...PieMap,
  // 柱图的数据格式映射
  ...BarMap,
  // 折线图的数据格式映射
  ...Line,
  // 散点图的数据格式映射
  ...Scatter,
  // 其他图表
  ...Othercharts,
  // 工具图表的数据格式映射
  ...Tool,
  // 地图
  ...MapChart,
  // 云组件
  ...Colund
}
