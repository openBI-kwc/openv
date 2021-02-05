// 3d柱状趋势变化图配置
<template lang='pug'>
  .columnar-trend-config
    ExpandList(title="标题样式")
      ControlItem(value="字体")
        Selection(v-model="chartData.titleStyle.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(v-model="chartData.titleStyle.fontSize")
      ControlItem(value="字体粗细")
        Selection(v-model="chartData.titleStyle.fontWeight", :option="fontWeight")
      ControlItem(value="字体颜色")
        ColorPicker(v-model="chartData.titleStyle.color")
    ExpandList(title="百分比样式")
      ControlItem(value="字体")
        Selection(v-model="chartData.percentStyle.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(v-model="chartData.percentStyle.fontSize")
      ControlItem(value="字体粗细")
        Selection(v-model="chartData.percentStyle.fontWeight", :option="fontWeight")
      ControlItem(value="字体颜色")
        ColorPicker(v-model="chartData.percentStyle.color")
    ExpandList(title="数值样式")
      ControlItem(value="字体")
        Selection(v-model="chartData.valueStyle.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(v-model="chartData.valueStyle.fontSize")
      ControlItem(value="字体粗细")
        Selection(v-model="chartData.valueStyle.fontWeight", :option="fontWeight")
      ControlItem(value="字体颜色")
        ColorPicker(v-model="chartData.valueStyle.color")
    ExpandList(title="内部柱体样式")
      ControlItem(value="柱体正面颜色")
        ColorPicker(v-model="chartData.innerStyle.leftbg")
      ControlItem(value="柱体顶部颜色")
        ColorPicker(v-model="chartData.innerStyle.topbg")
      ControlItem(value="柱体侧面颜色")
        ColorPicker(v-model="chartData.innerStyle.rightbg")
      ControlItem(value="边框发光色")
        ColorPicker(v-model="chartData.innerStyle.shadowColor")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import dataseries from '@public/mixin/dataseries.js'
const {fontFamily, fontWeight} = multiplechoice
export default {
  mixins: [dataseries],
  data () {
    return {
      fontFamily,
      fontWeight
    }
  }
}
</script>
