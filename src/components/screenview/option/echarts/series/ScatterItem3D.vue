<template lang="pug">
  //- 散点3D图配置
  .watchChartData
    ControlItem(value="边框宽度")
      NumInput(:min="0", v-model="watchChartData.itemStyle.borderWidth")
    ControlItem(value="边框颜色")
      ColorPicker(v-model="watchChartData.itemStyle.borderColor")
    ControlItem(value="透明度")
      NumInput(:min="0", :max="1", :step="0.1", :precision="1", v-model="watchChartData.itemStyle.opacity")
    ControlItem(value="显示标签")
      SwitchBar(v-model="watchChartData.label.show")
    .control-entry
      ExpandList(v-if="watchChartData.label && watchChartData.label.show", title="文本标签")
        ControlItem(value="文本位置")
          Selection(v-model="watchChartData.label.position", :option="verticalAlign")
        ControlItem(value="文本颜色")
          ColorPicker(v-model="watchChartData.label.textStyle.color")
        ControlItem(value="文本字体")
          Selection(v-model="watchChartData.label.textStyle.fontFamily", :option="fontFamily")
        ControlItem(value="文本大小")
          NumInput(:min="0", v-model="watchChartData.label.textStyle.fontSize")
        ControlItem(value="文本粗细")
          Selection(v-model="watchChartData.label.textStyle.fontWeight", :option="fontWeight")
        ControlItem(value="边框宽度")
          NumInput(:min="0", v-model="watchChartData.label.textStyle.borderWidth")
        ControlItem(value="边框颜色")
          ColorPicker(v-model="watchChartData.label.textStyle.borderColor")
</template>

<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {verticalAlign, fontFamily, fontWeight} = multiplechoice
export default {
  mixins: [watchchart],
  data  () {
    return {
      verticalAlign,
      fontFamily,
      fontWeight
    }
  }
}
</script>
