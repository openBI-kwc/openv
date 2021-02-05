// 中国地图配置
<template lang='pug'>
  .heatmap-config
    //- 标题样式
    TitleStyle
    //- 视觉映射
    VisualMap
    //- 地理坐标
    GeoStyle
    //- 数据系列
    ExpandList(title="数据系列")
      ControlItem(value="选择系列")
        Selection(v-model="selectedItem", :option="itemsList")
      .series-item(v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series", :key="index")
        ControlItem(value="无需配置",v-if="item.type === 'map'")
        SeriesItem(v-else, :value="item")
</template>
<script>
import dataseries from '@public/mixin/dataseries'
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [dataseries, chartdata]
}
</script>
