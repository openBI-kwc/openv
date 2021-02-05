<template lang="pug">
  //- 旭日图配置
  .watchChartData
    ControlItem(value="内半径(%)")
      NumSlider(v-model="watchChartData.radius[0]", symbol="%")
    ControlItem(value="外半径(%)")
      NumSlider(v-model="watchChartData.radius[1]", symbol="%")
    ControlItem(value="图形描边颜色")
      ColorPicker(v-model="watchChartData.itemStyle.borderColor")
    ControlItem(value="排列顺序")
      Selection(v-model="watchChartData.sort", :option="sort")
    ControlItem(value="图形描边宽度")
      NumInput(:min="0", v-model="watchChartData.itemStyle.borderWidth")
    ControlItem(value="显示标签")
      SwitchBar(v-model="watchChartData.label.show")
    .control-entry
      ExpandList(v-if="watchChartData.label && watchChartData.label.show", title="文本标签")
        ControlItem(value="文字颜色")
          ColorPicker(v-model="watchChartData.label.color")
        ControlItem(value="文字样式")
          Selection(v-model="watchChartData.label.fontStyle", :option="fontStyle")
        ControlItem(value="文字粗细")
          Selection(v-model="watchChartData.label.fontWeight", :option="fontWeight")
        ControlItem(value="文字大小")
          NumInput(:min="0", v-model="watchChartData.label.fontSize")
        ControlItem(value="文字行高")
          NumInput(:min="0", v-model="watchChartData.label.lineHeight")
        ControlItem(value="文字块圆角")
          NumInput(:min="0", v-model="watchChartData.label.borderRadius")
        ControlItem(value="文字块背景")
          ColorPicker(v-model="watchChartData.label.backgroundColor")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {fontWeight, sort, fontStyle} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      fontWeight,
      sort,
      fontStyle
    }
  }
}
</script>
