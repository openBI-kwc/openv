// 目标占比饼图
<template lang='pug'>
  .config
    ExpandList(title="进度属性")
      ControlItem(value="内半径(%)")
        NumSlider(v-model="progress.radius[0]", symbol="%")
      ControlItem(value="外半径(%)")
        NumSlider(v-model="progress.radius[1]", symbol="%")
      ControlItem(value="目标文案")
        AutoInput(v-model="chartData.totaltext")
      ControlItem(value="目标文案位置")
        NumSlider(v-model="taltxt.top", symbol="%")
      ControlItem(value="当前进度文案")
        AutoInput(v-model="chartData.currenttext")
      ControlItem(value="当前进度文案位置")
        NumSlider(v-model="curtxt.top", symbol="%")
      ControlItem(value="颜色")
        ColorPicker(v-model="progress.data[0].itemStyle.color")
    ExpandList(title="中心标签")
      ControlItem(value="字号")
        NumInput(:min="0", v-model="progress.data[0].label.fontSize")
      ControlItem(value="颜色")
        ColorPicker(v-model="progress.data[0].label.color")
      ControlItem(value="字体粗细")
        Selection(v-model="progress.data[0].label.fontWeight", :option="fontWeight")
    ExpandList(title="环状属性")
      ControlItem(value="内半径(%)")
        NumSlider(v-model="outerring.radius[0]", symbol="%")
      ControlItem(value="外半径(%)")
        NumSlider(v-model="outerring.radius[1]", symbol="%")
      ControlItem(value="颜色")
        ColorPicker(v-model="outerring.data[0].itemStyle.color")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontWeight} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontWeight,
      progress: null,
      outerring: null,
      curtxt: null,
      taltxt: null
    }
  },
  created () {
    let { series, title } = this.chartData
    let map = {
      progress: series[0],
      outerring: series[1],
      curtxt: title[0],
      taltxt: title[1]
    }
    for (const key in map) {
      this.$data[key] = map[key]
    }
  },
  watch: {
    'chartData.totaltext': {
      handler () {
        let { data } = this.progress
        let total = data[0].value + data[1].value
        this.taltxt.text = this.chartData.totaltext + total
      },
      deep: true,
      immediate: false
    },
    'chartData.currenttext': {
      handler () {
        let current = this.progress.data[0].value
        this.curtxt.text = this.chartData.currenttext + current
      },
      deep: true,
      immediate: false
    }
  }
}
</script>
