// 时间配置
<template lang='pug'>
.time-config
  ExpandList(title="图标样式")
    ControlItem(value="大小")
      NumInput(:min="0", v-model="chartOpt.chartData.iconfontSize")
    ControlItem(value="颜色")
      ColorPicker(v-model="chartOpt.chartData.iconColor")
    ControlItem(value="边距")
      AutoInput(v-model="chartOpt.chartData.iconRight")
  ExpandList(title="文字样式")
    ControlItem(value="字号")
      NumInput(:min="0", v-model="chartOpt.chartData.fontSize")
    ControlItem(value="字体颜色")
      ColorPicker(v-model="chartOpt.chartData.color")
    ControlItem(value="字体")
      Selection(v-model="chartOpt.chartData.fontFamily", :option="fontFamily")
    ControlItem(value="字体粗细")
      Selection(v-model="chartOpt.chartData.fontWeight", :option="fontWeight")
    ControlItem(value="对齐方式")
      Selection(v-model="chartOpt.chartData.justifyContent", :option="aglin")
</template>
<script>
import { mapState } from 'vuex'
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, fontWeight, aglin} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      chartOpt: null,
      fontFamily,
      fontWeight,
      aglin
    }
  },
  computed: {
    ...mapState(['index', 'position'])
  },

  created () {
    this.chartOpt = this.position[this.index]
  }
}
</script>
