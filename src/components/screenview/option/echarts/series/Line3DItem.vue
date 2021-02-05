<template lang="pug">
  //- 3D折线图图配置
  .watchChartData(v-if="watchChartData && watchChartData.type=== 'line3D'")
    ControlItem(value="边框宽度")
      NumInput(:min="0", v-model="watchChartData.lineStyle.width")
    ControlItem(value="透明度")
      NumInput(:min="0", :max="1", :step="0.1", :precision="1", v-model="watchChartData.lineStyle.opacity")
</template>

<script>
import watchchart from '@public/mixin/watchchart.js'
export default {
  mixins: [watchchart]
}
</script>
