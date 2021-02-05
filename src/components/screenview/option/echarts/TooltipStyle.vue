<template lang="pug">
  //- 提示器的配置
  ExpandList(title="提示框", v-if="chartData.tooltip")
    ControlItem(value="编辑")
      SwitchBar(v-model="chartData.tooltip.show")
    template(v-if="chartData.tooltip.show")
      ControlItem(value="触发类型")
        Selection(v-model="chartData.tooltip.trigger", :option="triggerType")
      ControlItem(value="触发条件")
        Selection(v-model="chartData.tooltip.triggerOn", :option="triggerOnType")
      ControlItem(value="消失延迟")
        NumInput(:min="0", :step="1000", v-model="chartData.tooltip.hideDelay")
      ControlItem(value="背景颜色")
        ColorPicker(v-model="chartData.tooltip.backgroundColor")
      ControlItem(value="边框颜色")
        ColorPicker(v-model="chartData.tooltip.borderColor")
      ControlItem(value="边框宽度")
        NumInput(:min="0", v-model="chartData.tooltip.borderWidth")
      .control-entry
        ExpandList(title="文本样式")
          ControlItem(value="字号")
            NumInput(:min="0", v-model="chartData.tooltip.textStyle.fontSize")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.tooltip.textStyle.color")
          ControlItem(value="字体粗细")
            Selection(v-model="chartData.tooltip.textStyle.fontWeight", :option="fontWeight")
</template>

<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontWeight, triggerType, triggerOnType} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontWeight,
      triggerType,
      triggerOnType
    }
  }
}
</script>
