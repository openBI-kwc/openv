<template lang="pug">
  //- 图表组件渲染
  .chart-plug(v-if="componentId && chartOpt")
    component(:is="componentId" v-model="chartOpt")
</template>
<script>
import { mapState } from 'vuex'
import chartRender from '@assets/json/chartRender'
export default {
  props: {
    chartOpt: null
  },
  computed: {
    ...mapState(['setting']),
    componentId () {
      let { charttype } = this.chartOpt
      let chartObj = chartRender.filter(item => {
        if (item.ctype === charttype) {
          return item
        }
      })
      return chartObj[0].renderCom
    }
  }
}
</script>

<style lang="less" scoped>
  .chart-plug {
    user-select: none;
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
