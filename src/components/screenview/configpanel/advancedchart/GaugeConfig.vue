// 仪表盘配置
<template lang='pug'>
  .pie-config
    //- 系列
    ExpandList(title="数据系列")
      ControlItem(value="选择系列")
        Selection(v-model="selectedItem", :option="itemsList")
      SeriesItem(:value="item", v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series", :key="index")
</template>
<script>
import chartdata from '@public/mixin/chartdata'
import dataseries from '@public/mixin/dataseries'
export default {
  mixins: [dataseries, chartdata]
}
</script>
