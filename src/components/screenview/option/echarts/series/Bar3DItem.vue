<template lang="pug">
  //- 3D柱状图系列配置
  .watchChartData
    .control-entry
      ExpandList(title="标签样式")
        ControlItem(value="编辑")
          SwitchBar(v-model="watchChartData.label.show")
        template(v-if="watchChartData.label.show")
          ControlItem(value="字体")
            Selection(v-model="watchChartData.label.textStyle.fontFamily", :option="fontFamily")
          ControlItem(value="字号")
            NumInput(:min="0", v-model="watchChartData.label.textStyle.fontSize")
          ControlItem(value="颜色")
            ColorPicker(v-model="watchChartData.label.textStyle.color")
          ControlItem(value="字体粗细")
            Selection(v-model="watchChartData.label.textStyle.fontWeight", :option="fontWeight")
          ControlItem(value="描边宽度")
            NumInput(:min="0", v-model="watchChartData.label.textStyle.borderWidth")
          ControlItem(value="描边颜色")
            ColorPicker(v-model="watchChartData.label.textStyle.borderColor")
          ControlItem(value="背景颜色")
            ColorPicker(v-model="watchChartData.label.textStyle.backgroundColor")
          ControlItem(value="标签距离")
            NumInput(:min="0", v-model="watchChartData.label.distance")
    .control-entry
      ExpandList(title="柱子样式")
        ControlItem(value="透明度")
          NumInput(:min="0", :max="1", :step="0.1", :precision="1", v-model="watchChartData.itemStyle.opacity")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {fontWeight, fontFamily} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      fontWeight,
      fontFamily
    }
  }
}
</script>
