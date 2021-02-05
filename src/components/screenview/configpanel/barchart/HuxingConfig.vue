// 弧形柱图配置
<template lang='pug'>
  .histogram-config
    //- 标题样式
    TitleStyle
    //- 图例
    LegendStyle
    //- 提示框
    TooltipStyle
    ExpandList(title="数据系列")
      ControlItem(value="选择系列")
        Selection(v-model="selectedItem", :option="itemsList")
      .series-item(v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series", :key="index")
        .control-entry
          ExpandList(title="动画")
            ControlItem(value="开启")
              SwitchBar(v-model="watchChartData.animation")
            template(v-if="watchChartData.animation")
              ControlItem(value="间隔时长")
                NumInput(:min="0", :step="1000", v-model="watchChartData.animationDuration")
              ControlItem(value="缓动效果")
                Selection(v-model="watchChartData.animationEasing", :option="animationEasings")
              ControlItem(value="延迟时长")
                NumInput(:min="0", :step="1000", v-model="watchChartData.animationDelay")
        ControlItem(value="颜色")
          ColorPicker(v-model="item.itemStyle.color")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import dataseries from '@public/mixin/dataseries'
import chartdata from '@public/mixin/chartdata'
const {animationTypes, animationEasings} = multiplechoice
export default {
  mixins: [dataseries, chartdata],
  data () {
    return {
      barColor: [
        {value: '#fff', name: '填充颜色'}
      ],
      animationTypes,
      animationEasings,
      legendData: null,
      gridData: null,
      labelData: null,
      labelDataOne: null,
      switchs: false,
      xAxis: null,
      yAxis: null
    }
  },
  created () {
    this.labelData = this.chartData.series
    this.legendData = this.chartData.legend
    this.gridData = this.chartData.grid
    this.xAxis = this.chartData.xAxis
    this.yAxis = this.chartData.yAxis
  }
}
</script>
<style scoped>
</style>
