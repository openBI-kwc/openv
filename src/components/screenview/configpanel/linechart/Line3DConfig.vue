// 三维折线图配置
<template lang="pug">
  .line3d-config
    TitleStyle
    //- 数据映射
    VisualMap
    //- X轴
    XAxis3D
    //- Y轴
    YAxis3D
    //- z轴
    ZAxis3D
    //- 图形规格
    Grid3D
    //- 系列
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
