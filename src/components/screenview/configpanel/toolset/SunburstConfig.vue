<template lang="pug">
  //-旭日图配置
  .sunbur-config
    //- 全局样式
    TextStyle
    //- 标题样式
    TitleStyle
    //-视觉映射
    VisualMap
    //-旭日图系列配置
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
