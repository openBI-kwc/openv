<template lang="pug">
  //- 每一个系列配置
  .series-item(v-if="watchChartData")
    BarItem(v-model="watchChartData", v-if="watchChartData.type === 'bar'")
    PictorialBarItem(v-model="watchChartData", v-if="watchChartData.type === 'pictorialBar'")
    LineItem(v-model="watchChartData", v-if="watchChartData.type === 'line'")
    PieItem(v-model="watchChartData", v-if="watchChartData.type === 'pie'")
    ScatterItem(v-model="watchChartData", v-if="watchChartData.type === 'scatter'")
    ScatterItem(v-model="watchChartData", v-if="watchChartData.type === 'effectScatter'")
    BoxplotItem(v-model="watchChartData", v-if="watchChartData.type === 'boxplot'")
    HeatmapItem(v-model="watchChartData", v-if="watchChartData.type === 'heatmap'")
    LinesItem(v-model="watchChartData", v-if="watchChartData.type === 'lines'")
    SankeyItem(v-model="watchChartData", v-if="watchChartData.type === 'sankey'")
    FunnelItem(v-model="watchChartData", v-if="watchChartData.type === 'funnel'")
    GaugeItem(v-model="watchChartData", v-if="watchChartData.type === 'gauge'")
    TreeItem(v-model="watchChartData", v-if="watchChartData.type === 'treemap'")
    SunburstItem(v-model="watchChartData", v-if="watchChartData.type === 'sunburst'")
    //- echarts gl
    ScatterItem3D(v-model="watchChartData", v-if="watchChartData.type === 'scatter3D'")
    Bar3DItem(v-model="watchChartData", v-if="watchChartData.type === 'bar3D'")
    Lines3DItem(v-model="watchChartData", v-if="watchChartData.type === 'lines3D'")
    Line3DItem(v-model="watchChartData", v-if="watchChartData.type === 'line3D'")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
export default {
  mixins: [watchchart]
}

</script>
