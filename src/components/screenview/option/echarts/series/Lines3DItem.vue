<template lang="pug">
  //- 3D飞线图配置
  .watchChartData
    .control-entry
      ExpandList(title="特效样式")
        ControlItem(value="编辑特效")
          SwitchBar(v-model="watchChartData.effect.show")
        template(v-if="watchChartData.effect.show")
          ControlItem(value="特效周期")
            NumInput(:min="1", v-model="watchChartData.effect.period")
          ControlItem(value="尾迹宽度")
            NumInput(:min="0", v-model="watchChartData.effect.trailWidth")
          ControlItem(value="尾迹长度")
            NumInput(:min="0", v-model="watchChartData.effect.trailLength")
          ControlItem(value="尾迹颜色")
            ColorPicker(v-model="watchChartData.effect.trailColor")
          ControlItem(value="透明度")
            NumInput(:min="0", :max="1", :step="0.1", :precision="1", v-model="watchChartData.effect.trailOpacity")
    .control-entry
      ExpandList(title="飞线样式")
        ControlItem(value="线条宽度")
          NumInput(:min="0", v-model="watchChartData.lineStyle.width")
        ControlItem(value="线条颜色")
          ColorPicker(v-model="watchChartData.lineStyle.color")
        ControlItem(value="透明度")
          NumInput(:min="0", :max="1", :step="0.1", :precision="1", v-model="watchChartData.lineStyle.opacity")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
export default {
  mixins: [watchchart]
}
</script>
