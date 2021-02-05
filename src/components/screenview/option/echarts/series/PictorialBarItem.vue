<template lang="pug">
  //- 柱状图配置
  .watchChartData
    ControlItem(value="颜色" v-if="watchChartData.itemStyle.color")
      ColorPicker(v-model="watchChartData.itemStyle.color")
    ControlItem(value="图形" v-if="watchChartData.symbol")
      Selection(v-model="watchChartData.symbol", :option="symbol")
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
const {animationTypes, animationEasings, symbol} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      animationEasings,
      animationTypes,
      symbol
    }
  }
}
</script>
