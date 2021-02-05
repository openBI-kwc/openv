// 双向检测数据变化
export default {
  props: ['value'],
  data () {
    return {
      watchChartData: null
    }
  },
  created () {
    this.watchChartData = this.value
  },
  watch: {
    value: {
      handler (n, o) {
        this.watchChartData = this.value
      },
      immediate: false,
      deep: true
    },
    watchChartData: {
      handler (n, o) {
        this.$emit('input', this.watchChartData)
        this.$emit('onChange', this.watchChartData)
      },
      immediate: false,
      deep: true
    }
  }
}
