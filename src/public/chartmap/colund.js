import { Utils as T,  Lodash as _ } from '@public/utils'
export default {
  // 云组件数据的处理
  'cloudComponent' (chartData, resData) {
    chartData.useData = resData
  }
}