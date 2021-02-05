// 饼图配置
<template lang='pug'>
  .config
    TitleStyle
    ExpandList(title="环状属性")
      ControlItem(value="内半径(%)")
        NumSlider(v-model="series.radius[0]", symbol="%")
      ControlItem(value="外半径(%)")
        NumSlider(v-model="series.radius[1]", symbol="%")
      ControlItem(value="颜色")
        ColorPicker(v-model="series.data[0].itemStyle.color")
      ControlItem(value="底色")
        ColorPicker(v-model="series.data[1].itemStyle.color")
    ExpandList(title="标签属性")
      ControlItem(value="字体")
        Selection(v-model="series.data[0].label.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(:min="0", v-model="series.data[0].label.fontSize")
      ControlItem(value="颜色")
        ColorPicker(v-model="series.data[0].label.color")
      ControlItem(value="字体粗细")
        Selection(v-model="series.data[0].label.fontWeight", :option="fontWeight")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, fontWeight} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      series: null,
      fontFamily,
      fontWeight
    }
  },
  created () {
    this.series = this.chartData.series[0]
  }
}
</script>
