// 图表数据系列
// import multiplechoice from '@assets/json/multiplechoice'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      chartData: null,
      selectedItem: 1,
      itemsList: []
    }
  },
  created() {
    this.chartData = this.position[this.index].chartData
    if (!this.chartData.series) return
    let series = this.chartData.series
    this.itemsList = series.map((item, index) => {
      let ordernum = index + 1
      return {
        name: 'series' + ordernum,
        value: ordernum
      }
    })
  },
  computed: {
    ...mapState(['position', 'index'])
  }
}
