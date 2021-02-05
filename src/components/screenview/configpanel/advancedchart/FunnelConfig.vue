// 漏斗图配置
<template lang='pug'>
  .funnel-config
    //- 图例
    LegendStyle
    //- 标题
    TitleStyle
    //- 自定义颜色
    CustomColor
    //- 系列
    ExpandList(title="数据系列")
      SeriesItem(v-model="series")
</template>
<script>
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [chartdata],
  data () {
    return {
      series: null
    }
  },
  created () {
    this.series = this.chartData.series[0]
  }
}
</script>
