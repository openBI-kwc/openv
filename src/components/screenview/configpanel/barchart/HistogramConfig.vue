// 柱图配置
<template lang='pug'>
  .histogram-config
    //- 全局样式
    TextStyle
    //- 标题样式
    TitleStyle
    GridStyle
    //- 图例
    LegendStyle
    //- 提示框
    TooltipStyle
    //- X轴
    XaxisStyle
    //- Y轴
    YaxisStyle
    ExpandList(title="数据系列")
      ControlItem(value="选择系列")
        Selection(v-model="selectedItem", :option="itemsList")
      SeriesItem(:value="item", v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series", :key="index")
</template>
<script>
import dataseries from '@public/mixin/dataseries.js'
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [dataseries, chartdata]
}
</script>
