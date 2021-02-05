// 环形进度条配置
<template lang='pug'>
  .config
    ExpandList(title="全局配置")
      ControlItem(value="字体")
        Selection(v-model="progressData.chartData.style.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(:min="0", v-model="progressData.chartData.style.fontSize")
      ControlItem(value="颜色")
        ColorPicker(v-model="progressData.chartData.style.color")
      ControlItem(value="字体粗细")
        Selection(v-model="progressData.chartData.style.fontWeight", :option="fontWeight")
      ControlItem(value="期望值")
        NumInput(:min="0", v-model="progressData.chartData.num")
      ControlItem(value="总值")
        NumInput(:min="0", v-model="progressData.chartData.total")
    ExpandList(title="文本样式")
      ControlItem(value="底环颜色类型")
        Selection(v-model="progressData.chartData.ringStyle[0].colorTypes", :option="colorTypes")
      ControlItem(value="颜色" v-if="progressData.chartData.ringStyle[0].colorTypes === 'danse'")
        ColorPicker(v-model="progressData.chartData.ringStyle[0].singlecolor" v-if="progressData.chartData.ringStyle[0].colorTypes === 'danse'")
      ControlItem(value="起始颜色" v-if="progressData.chartData.ringStyle[0].colorTypes === 'gradient'")
        ColorPicker(v-model="progressData.chartData.ringStyle[0].doublecolor[0]" v-if="progressData.chartData.ringStyle[0].colorTypes === 'gradient'")
      ControlItem(value="终止颜色" v-if="progressData.chartData.ringStyle[0].colorTypes === 'gradient'")
        ColorPicker(v-model="progressData.chartData.ringStyle[0].doublecolor[1]" v-if="progressData.chartData.ringStyle[0].colorTypes === 'gradient'")
      ControlItem(value="顶环颜色类型")
        Selection(v-model="progressData.chartData.ringStyle[1].colorTypes", :option="colorTypes")
      ControlItem(value="颜色" v-if="progressData.chartData.ringStyle[1].colorTypes === 'danse'")
        ColorPicker(v-model="progressData.chartData.ringStyle[1].singlecolor" v-if="progressData.chartData.ringStyle[1].colorTypes === 'danse'")
      ControlItem(value="起始颜色" v-if="progressData.chartData.ringStyle[1].colorTypes === 'gradient'")
        ColorPicker(v-model="progressData.chartData.ringStyle[1].doublecolor[0]" v-if="progressData.chartData.ringStyle[1].colorTypes === 'gradient'")
      ControlItem(value="终止颜色" v-if="progressData.chartData.ringStyle[1].colorTypes === 'gradient'")
        ColorPicker(v-model="progressData.chartData.ringStyle[1].doublecolor[1]" v-if="progressData.chartData.ringStyle[1].colorTypes === 'gradient'")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, fontWeight, colorTypes} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      progressData: null,
      fontFamily,
      fontWeight,
      colorTypes
    }
  },
  created () {
    this.progressData = this.position[this.index]
  },
  methods: {
    annular () {
      if (this.switchs) {
        this.labelData.radius = ['30%', '50%']
      } else {
        this.labelData.radius = ['0%', '70%']
      }
      this.switchs = !this.switchs
    }
  }
}
</script>
