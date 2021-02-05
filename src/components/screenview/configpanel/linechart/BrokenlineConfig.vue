// 折线图配置
<template lang='pug'>
  .line-config(v-if="chartData.series[0].type === 'line'")
    //- 全局样式
    TextStyle
    //- 标题样式
    TitleStyle
    //- x轴
    XaxisStyle
    //- y轴(左)
    YaxisStyle
    //- 图例
    LegendStyle
    //- 提示框
    TooltipStyle
    //- 系列
    ExpandList(title="数据系列")
      ControlItem(value="选择系列")
        Selection(v-model="selectedItem", :option="itemsList")
      SeriesItem(:value="item", v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series", :key="index")
</template>
<script>
import dataseries from '@public/mixin/dataseries'
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [dataseries, chartdata]
}
</script>
