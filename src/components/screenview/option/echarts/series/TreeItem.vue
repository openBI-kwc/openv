<template lang="pug">
  //-树图系列配置
  .watchChartData
    ControlItem(value="组件宽度(%)")
      AutoInput(v-model="watchChartData.width")
    ControlItem(value="组件高度(%)")
      AutoInput(v-model="watchChartData.height")
    ControlItem(value="矩形边框宽度")
      NumInput(v-model="watchChartData.itemStyle.borderWidth")
    ControlItem(value="矩形边框颜色")
      ColorPicker(v-model="watchChartData.itemStyle.borderColor")
    ControlItem(value="显示标签")
      SwitchBar(v-model="watchChartData.label.show")
    .control-entry
      ExpandList(v-if="watchChartData.label && watchChartData.label.show", title="文本标签")
        ControlItem(value="位置")
          Selection(v-model="watchChartData.label.position", :option="tree")
        ControlItem(value="颜色")
          ColorPicker(v-model="watchChartData.label.color")
        ControlItem(value="字体")
          Selection(v-model="watchChartData.label.fontFamily", :option="fontFamily")
        ControlItem(value="大小")
          NumInput(:min="0", v-model="watchChartData.label.fontSize")
        ControlItem(value="粗细")
          Selection(v-model="watchChartData.label.fontWeight", :option="fontWeight")
        ControlItem(value="边框宽度")
          NumInput(:min="0", v-model="watchChartData.label.borderWidth")
        ControlItem(value="边框颜色")
          ColorPicker(v-model="watchChartData.label.borderColor")
        ControlItem(value="边框角度")
          NumInput(:min="0", v-model="watchChartData.label.borderRadius")
        ControlItem(value="背景颜色")
          ColorPicker(v-model="watchChartData.label.backgroundColor")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {fontWeight, tree, fontFamily} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      fontWeight,
      tree,
      fontFamily
    }
  }
}
</script>
