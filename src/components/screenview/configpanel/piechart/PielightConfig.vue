// 环状发光占比图配置
<template lang='pug'>
  .config
    TitleStyle
    //- 图例
    LegendStyle
    //- 提示框
    TooltipStyle
    ExpandList(title="数据系列")
      ControlItem(value="选择系列")
        Selection(v-model="selectedItem", :option="itemsList")
      SeriesItem(:value="item", v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series", :key="index")
    ExpandList(title="阴影配置", background="#F7F8FA")
      ControlItem(value="阴影大小")
        NumInput(:min="0", v-model="chartData.series[0].itemStyle.shadowBlur")
      ControlItem(value="阴影颜色")
        ColorPicker(v-model="chartData.series[0].itemStyle.shadowColor")
      ControlItem(value="阴影水平偏移")
        NumInput(:min="0", v-model="chartData.series[0].itemStyle.shadowOffsetX")
      ControlItem(value="阴影垂直偏移")
        NumInput(:min="0", v-model="chartData.series[0].itemStyle.shadowOffsetY")
      ControlItem(value="扇形偏移距离")
        NumInput(:min="0", v-model="chartData.series[0].itemStyle.selectedOffset")
</template>
<script>
import dataseries from '@public/mixin/dataseries.js'
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [dataseries, chartdata]
}
</script>
