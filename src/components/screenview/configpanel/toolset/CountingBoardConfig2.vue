// 计数板2配置
<template lang='pug'>
  .board-config
    ExpandList(title="文本样式")
      ControlItem(value="内容")
        AutoInput(v-model="chartData.textStyle.name")
      ControlItem(value="字体")
        Selection(v-model="chartData.textStyle.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(v-model="chartData.textStyle.fontSize")
      ControlItem(value="颜色")
        ColorPicker(v-model="chartData.textStyle.color")
      ControlItem(value="字体粗细")
        Selection(v-model="chartData.textStyle.fontWeight", :option="fontWeight")
    ExpandList(title="数字样式")
      ControlItem(value="格式化数字")
        SwitchBar(v-model="chartData.sumStyle.format")
      ControlItem(value="字体")
        Selection(v-model="chartData.sumStyle.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(v-model="chartData.sumStyle.fontSize")
      ControlItem(value="字体粗细")
        Selection(v-model="chartData.sumStyle.fontWeight", :option="fontWeight")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, fontWeight} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontFamily,
      fontWeight
    }
  }
}
</script>
