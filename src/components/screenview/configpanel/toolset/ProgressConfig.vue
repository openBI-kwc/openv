// 进度条配置
<template lang='pug'>
  ExpandList(title="全局配置")
    ControlItem(value="选择字体系列")
      Selection(v-model="chartOpt.chartData.style.fontFamily", :option="fontFamily")
    ControlItem(value="字号")
      NumInput(:min="0", v-model="chartOpt.chartData.style.fontSize")
    ControlItem(value="颜色")
      ColorPicker(v-model="chartOpt.chartData.style.color")
    ControlItem(value="字体粗细")
      Selection(v-model="chartOpt.chartData.style.fontWeight", :option="fontWeight")
    ControlItem(value="水平对齐方式")
      Selection(v-model="chartOpt.chartData.style.justifyContent", :option="aglin")
    ControlItem(value="垂直对齐方式")
      Selection(v-model="chartOpt.chartData.style.alignItems", :option="vertical")
    ControlItem(value="目标值")
      NumInput(:min="0", v-model="chartOpt.chartData.num")
    ControlItem(value="总值")
      NumInput(:min="0", v-model="chartOpt.chartData.total")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
import { mapState } from 'vuex'
const {fontFamily, fontWeight, aglin, vertical} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      chartOpt: null,
      fontFamily,
      fontWeight,
      aglin,
      vertical
    }
  },
  computed: {
    ...mapState(['itemsList', 'index'])
  },
  created () {
    this.chartOpt = this.position[this.index]
  }
}
</script>
