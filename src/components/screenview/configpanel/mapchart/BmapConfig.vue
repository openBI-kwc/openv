<template lang='pug'>
  // 中国地图配置
  .heatmap-config
    //- 视觉映射
    VisualMap
    //- 地理坐标
    BmapStyle
    //- 数据系列
    ExpandList(title="数据系列")
      ControlItem(value="选择系列")
        Selection(v-model="selectedItem", :option="itemsList")
      .series-item(v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series", :key="index")
        SeriesItem(:value="item")
</template>
<script>
import dataseries from '@public/mixin/dataseries'
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [dataseries, chartdata]
}
</script>
