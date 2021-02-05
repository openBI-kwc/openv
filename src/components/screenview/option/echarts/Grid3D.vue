<template lang="pug">
  //- 平面直角坐标系的x轴
  ExpandList(title="三维坐标系", v-if="chartData.grid3D")
    ControlItem(value="宽度")
      NumInput(:min="0", v-model="chartData.grid3D.boxWidth")
    ControlItem(value="高度")
      NumInput(:min="0", v-model="chartData.grid3D.boxHeight")
    ControlItem(value="深度")
      NumInput(:min="0", v-model="chartData.grid3D.boxDepth")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [watchchart, chartdata]
}
</script>
