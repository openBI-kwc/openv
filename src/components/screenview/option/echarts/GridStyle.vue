<template lang="pug">
  //- 平面直角坐标轴配置
  ExpandList(title="四周偏移量", v-if="chartData.grid")
    ControlItem(value="上偏移量")
      NumInput(:min="0" v-model="chartData.grid.top")
    ControlItem(value="右偏移量")
      NumInput(:min="0" v-model="chartData.grid.right")
    ControlItem(value="下偏移量")
      NumInput(:min="0" v-model="chartData.grid.bottom")
    ControlItem(value="左偏移量")
      NumInput(:min="0" v-model="chartData.grid.left")
</template>
<script>
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [chartdata]
}
</script>
