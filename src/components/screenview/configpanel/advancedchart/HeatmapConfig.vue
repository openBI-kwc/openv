<template lang="pug">
  //-热力图配置
  .heatmap-config
    //- 全局样式
    TextStyle
    //- 标题样式
    TitleStyle
    //- X轴
    XaxisStyle
    //- y轴
    YaxisStyle
    //-视觉映射
    VisualMap
    //-热力图系列配置
    ExpandList(title="系列")
      ControlItem(value="选择系列")
        Selection(v-model="selectedItem", :option="itemsList")
      SeriesItem(:value="item", v-if="index + 1 === selectedItem", v-for="(item, index) in chartData.series", :key="index")
</template>
<script>
import dataseries from '@public/mixin/dataseries'
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [dataseries, chartdata]
}
</script>
