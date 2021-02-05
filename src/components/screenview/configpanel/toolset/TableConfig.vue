// 表格配置
<template lang='pug'>
.table-config
  ExpandList(title="表头配置")
    ControlItem(value="字体")
      Selection(v-model="chartData.theadstyle.fontFamily", :option="fontFamily")
    ControlItem(value="字号")
      NumInput(:min="0" v-model="chartData.theadstyle.fontSize")
    ControlItem(value="字体颜色")
      ColorPicker(v-model="chartData.theadstyle.color")
    ControlItem(value="背景颜色")
      ColorPicker(v-model="chartData.theadstyle.backgroundColor")
    ControlItem(value="表头行高")
      NumInput(:min="0", v-model="chartData.theadstyle.height")
  ExpandList(title="内容配置")
    ControlItem(value="字体")
      Selection(v-model="chartData.tbodystyle.fontFamily", :option="fontFamily")
    ControlItem(value="字号")
      NumInput(:min="0" v-model="chartData.tbodystyle.fontSize")
    ControlItem(value="字体粗细")
      Selection(v-model="chartData.tbodystyle.fontWeight", :option="fontWeight")
    ControlItem(value="字体颜色")
      ColorPicker(v-model="chartData.tbodystyle.color")
    ControlItem(value="单行背景色")
      ColorPicker(v-model="chartData.tbodystyle.singleBg")
    ControlItem(value="双行背景色")
      ColorPicker(v-model="chartData.tbodystyle.doubleBg")
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
