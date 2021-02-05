// 饼图配置
<template lang='pug'>
  .config
    //- 排除部分 title为数组
    TitleStyle(v-if="!chartData.title.length")
    //- 图例
    LegendStyle
    //- 自定义颜色
    CustomColor
    //- 提示框
    TooltipStyle
    ExpandList(title="数据系列")
      ControlItem(value="选择系列")
        Selection(v-model="selectedItem", :option="itemsList")
      SeriesItem(:value="item", v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series", :key="index")
    //- 带图饼图上传图片
    UpFile
</template>
<script>
import dataseries from '@public/mixin/dataseries.js'
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [dataseries, chartdata]
}
</script>
