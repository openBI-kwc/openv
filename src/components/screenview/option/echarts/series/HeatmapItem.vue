<template lang="pug">
  //- 热力地图
  .watchChartData(v-if="!watchChartData.coordinateSystem || watchChartData.coordinateSystem === 'cartesian2d'")
    ControlItem(value="模糊度", v-if="watchChartData.blurSize")
      NumInput(:min="0", v-model="watchChartData.blurSize")
    ControlItem(value="最大透明度", v-if="watchChartData.maxOpacity")
      NumInput(:min="0", :step="0.1", :precision="1", v-model="watchChartData.maxOpacity")
    .control-entry
      ExpandList(v-if="watchChartData.label", title="标签样式")
        ControlItem(value="显示标签")
          SwitchBar(v-model="watchChartData.label.show")
        ControlItem(value="文本位置")
          Selection(v-model="watchChartData.label.position", :option="positionList")
        ControlItem(value="文本颜色")
          ColorPicker(v-model="watchChartData.label.color")
        ControlItem(value="标题字体")
          Selection(v-model="watchChartData.label.fontFamily", :option="fontFamily")
        ControlItem(value="标题大小")
          NumInput(:min="0", v-model="watchChartData.label.fontSize")
        ControlItem(value="标题粗细")
          Selection(v-model="watchChartData.label.fontWeight", :option="fontWeight")
        ControlItem(value="边框宽度")
          NumInput(:min="0", v-model="watchChartData.label.borderWidth")
        ControlItem(value="边框颜色")
          ColorPicker(v-model="watchChartData.label.borderColor")
        ControlItem(value="边框圆角")
          NumInput(:min="0", v-model="watchChartData.label.borderRadius")
  .watchChartData(v-else)
    ControlItem(value="无需配置")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {positionList, fontFamily, fontWeight} = multiplechoice
export default {
  mixins: [watchchart],
  data() {
    return {
      positionList,
      fontFamily,
      fontWeight
    }
  }
}
</script>
