// 世界地图配置
<template lang='pug'>
  .heatmap-config
    //- 标题样式
    TitleStyle
    //- 视觉映射
    VisualMap
    //- 地理坐标
    GeoStyle
    ExpandList(title="系列数据")
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
