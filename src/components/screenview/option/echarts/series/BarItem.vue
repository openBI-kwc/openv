<template lang="pug">
  //- 柱状图配置
  .watchChartData
    ControlItem(value="颜色")
      ColorPicker(v-model="watchChartData.itemStyle.color")
    .control-entry
      ExpandList(title="动画")
        ControlItem(value="开启")
          SwitchBar(v-model="watchChartData.animation")
        template(v-if="watchChartData.animation")
          ControlItem(value="间隔时长")
            NumInput(:min="0", :step="1000", v-model="watchChartData.animationDuration")
          ControlItem(value="缓动效果")
            Selection(v-model="watchChartData.animationEasing", :option="animationEasings")
          ControlItem(value="延迟时长")
            NumInput(:min="0", :step="1000", v-model="watchChartData.animationDelay")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {animationTypes, animationEasings} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      animationTypes,
      animationEasings
    }
  }
}
</script>
