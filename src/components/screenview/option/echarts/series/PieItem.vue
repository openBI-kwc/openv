<template lang="pug">
  //- 饼状图配置
  .watchChartData
    .control-entry(v-if="watchChartData.label")
      ExpandList(title="标签")
        ControlItem(value="编辑")
          SwitchBar(v-model="watchChartData.label.show")
        template(v-if="watchChartData.label.show")
          ControlItem(value="字体")
            Selection(v-model="watchChartData.label.fontFamily", :option="fontFamily")
          ControlItem(value="字号")
            NumInput(:min="0", v-model="watchChartData.label.fontSize")
          ControlItem(value="颜色")
            ColorPicker(v-model="watchChartData.label.color")
          ControlItem(value="字体粗细")
            Selection(v-model="watchChartData.label.fontWeight", :option="fontWeight")
          ControlItem(value="位置")
            Selection(v-model="watchChartData.label.position", :option="pieLabelPos")
    .control-entry(v-if="watchChartData.labelLine")
      ExpandList(title="标签线")
        ControlItem(value="开启")
          SwitchBar(v-model="watchChartData.labelLine.show")
        ControlItem(value="线1")
          NumInput(v-model="watchChartData.labelLine.length")
        ControlItem(value="线2")
          NumInput(v-model="watchChartData.labelLine.length2")
        ControlItem(value="平滑线")
          SwitchBar(v-model="watchChartData.labelLine.smooth")
    .control-entry
      ExpandList(title="动画")
        ControlItem(value="开启")
          SwitchBar(v-model="watchChartData.animation")
        template(v-if="watchChartData.animation")
          ControlItem(value="间隔时长")
            NumInput(:min="0", :step="1000", v-model="watchChartData.animationDuration")
          ControlItem(value="动画类型")
            Selection(v-model="watchChartData.animationType", :option="animationTypes")
          ControlItem(value="缓动效果")
            Selection(v-model="watchChartData.animationEasing", :option="animationEasings")
          ControlItem(value="延迟时长")
            NumInput(:min="0", :step="1000", v-model="watchChartData.animationDelay")
    .control-entry
      ExpandList(title="其他配置")
        ControlItem(value="内半径(%)")
          NumSlider(v-model="watchChartData.radius[0]", symbol="%")
        ControlItem(value="外半径(%)")
          NumSlider(v-model="watchChartData.radius[1]", symbol="%")
        ControlItem(value="南丁格尔玫瑰")
            SwitchBar(v-model="watchChartData.showRoseType")
        template(v-if="watchChartData.showRoseType")
          ControlItem(value="南丁格尔玫瑰")
            Selection(v-model="watchChartData.roseType", :option="roseTypes")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {fontFamily, fontWeight, pieLabelPos, animationTypes, animationEasings, roseTypes} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      fontFamily,
      fontWeight,
      pieLabelPos,
      animationTypes,
      animationEasings,
      roseTypes
    }
  },
  created () {
    this.watchChartData.showRoseType = !!(this.watchChartData.roseType)
  },
  watch: {
    'watchChartData.showRoseType': {
      handler (n, o) {
        this.watchChartData.roseType = this.watchChartData.showRoseType ? 'radius' : false
      }
    }
  }
}
</script>
