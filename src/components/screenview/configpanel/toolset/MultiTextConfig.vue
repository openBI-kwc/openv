// 多行文本配置
<template lang='pug'>
  .config
    ExpandList(title="文本滚动")
      ControlItem(value="开始滚动")
        CheckBox(v-model="chartOpt.chartData.style.animation", type="checkbox", radioActive="checked")
    ExpandList(title="文本内容")
      ControlItem(value="请输入文本")
        AutoInput(v-model="chartOpt.chartData.text")
    ExpandList(title="文本样式")
      ControlItem(value="字体")
        Selection(v-model="chartOpt.chartData.style.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(:min="0", v-model="chartOpt.chartData.style.fontSize")
      ControlItem(value="颜色")
        ColorPicker(v-model="chartOpt.chartData.style.color")
      ControlItem(value="字体粗细")
        Selection(v-model="chartOpt.chartData.style.fontWeight", :option="fontWeight")
      ControlItem(value="行高")
        NumInput(:min="0", v-model="chartOpt.chartData.style.lineHeight")
      ControlItem(value="首行缩进(em)")
        NumInput(:min="0", v-model="chartOpt.chartData.style.textIndent")
    ExpandList(title="对齐方式")
      ControlItem(value="垂直对齐方式")
        Selection(v-model="chartOpt.chartData.style.alignItems", :option="vertical")
</template>
<script>
import chartdata from '@public/mixin/chartdata'
import { mapState } from 'vuex'
import multiplechoice from '@assets/json/multiplechoice'
const {fontFamily, fontWeight, vertical} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      chartOpt: null,
      fontFamily,
      fontWeight,
      vertical
    }
  },
  computed: {
    ...mapState(['position', 'index'])
  },
  created () {
    this.chartOpt = this.position[this.index]
  }
}
</script>
