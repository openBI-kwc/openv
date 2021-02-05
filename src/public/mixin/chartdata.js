import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartData: null
    }
  },
  created () {
    this.chartData = this.position[this.index].chartData
  },
  computed: {
    ...mapState(['position', 'index'])
  }
}