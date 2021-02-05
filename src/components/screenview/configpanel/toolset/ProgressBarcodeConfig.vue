// 直线配置
<template lang='pug'>
.line-config
  ControlItem(value="文字位置")
    Selection(v-model="chartData.nameStyle.vertical", :option="TextVertical")
  ExpandList(title="标题样式")
    ControlItem(value="字体")
      Selection(v-model="chartData.titleStyle.fontFamily", :option="fontFamily")
    ControlItem(value="字号")
      NumInput(v-model="chartData.titleStyle.fontSize")
    ControlItem(value="字体粗细")
      Selection(v-model="chartData.titleStyle.fontWeight", :option="fontWeight")
    ControlItem(value="字体颜色")
      ColorPicker(v-model="chartData.titleStyle.color")
  ExpandList(title="文本样式")
    ControlItem(value="字体")
      Selection(v-model="chartData.nameStyle.fontFamily", :option="fontFamily")
    ControlItem(value="字号")
      NumInput(v-model="chartData.nameStyle.fontSize")
    ControlItem(value="字体粗细")
      Selection(v-model="chartData.nameStyle.fontWeight", :option="fontWeight")
    ControlItem(value="字体颜色")
      ColorPicker(v-model="chartData.nameStyle.color")
  ExpandList(title="数据样式")
    ControlItem(value="字体")
      Selection(v-model="chartData.valueStyle.fontFamily", :option="fontFamily")
    ControlItem(value="字号")
      NumInput(v-model="chartData.valueStyle.fontSize")
    ControlItem(value="字体粗细")
      Selection(v-model="chartData.valueStyle.fontWeight", :option="fontWeight")
    ControlItem(value="字体颜色")
      ColorPicker(v-model="chartData.valueStyle.color")
  ExpandList(title="条形码颜色")
    ControlItem(value="进度颜色")
      ColorPicker(v-model="chartData.iconStyle.leftColor")
    ControlItem(value="背景颜色")
      ColorPicker(v-model="chartData.iconStyle.bottomColor")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, fontWeight, TextVertical} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontFamily,
      fontWeight,
      TextVertical
    }
  }
}
</script>
