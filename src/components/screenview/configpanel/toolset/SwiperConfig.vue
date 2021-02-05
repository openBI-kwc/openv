// 轮播图配置
<template lang='pug'>
.swipe-config
    ExpandList(title="全局样式")
      ControlItem(value="字体")
        Selection(v-model="chartOpt.chartData.style.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(v-model="chartOpt.chartData.style.fontSize")
    ExpandList(title="动画")
      ControlItem(value="效果")
        Selection(v-model="chartOpt.chartData.options.effect", :option="effect")
    ExpandList(title="图片")
      ControlItem(value="默认图片")
        AutoInput(v-model="chartOpt.chartData.dataUrl[0]")
    ExpandList(title="描述")
      ControlItem(value="背景色")
        ColorPicker(v-model="chartOpt.chartData.style.backgroundColor")
      ControlItem(value="文字颜色")
        ColorPicker(v-model="chartOpt.chartData.style.textColor")
      ControlItem(value="文字粗细")
        Selection(v-model="chartOpt.chartData.style.fontWeight", :option="fontWeight")
      ControlItem(value="长度(%)")
        NumInput(:min="0", v-model="chartOpt.chartData.style.width")
      ControlItem(value="高度(%)")
        NumInput(:min="0", v-model="chartOpt.chartData.style.height")
      ControlItem(value="上边距")
        NumInput(v-model="chartOpt.chartData.style.top")
      ControlItem(value="左边距")
        NumInput(v-model="chartOpt.chartData.style.left")
      ControlItem(value="水平对齐方式")
        Selection(v-model="chartOpt.chartData.style.justifyContent", :option="aglin")
</template>
<script>
import { mapState } from 'vuex'
import chartdata from '@public/mixin/chartdata'
import multiplechoice from '@assets/json/multiplechoice'
const {fontFamily, effect, fontWeight, aglin} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      chartOpt: null,
      fontFamily,
      effect,
      fontWeight,
      aglin
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
