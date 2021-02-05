// 词云配置
<template lang='pug'>
  .pie-config
    //- 全局样式
    ExpandList(title="全局样式")
      ControlItem(value="字体")
        Selection(v-model="chartData.textStyle.fontFamily", :option="fontFamily")
      ControlItem(value="最小字号")
        NumInput(:min="0", v-model="chartData.series[0].sizeRange[0]")
      ControlItem(value="最大字号")
        NumInput(:min="0", v-model="chartData.series[0].sizeRange[1]")
      ControlItem(value="最小角度")
        NumInput(:min="0", v-model="chartData.series[0].rotationRange[0]")
      ControlItem(value="最大角度")
        NumInput(:min="0", v-model="chartData.series[0].rotationRange[1]")
      ControlItem(value="角度步长")
        NumInput(:min="0", v-model="chartData.series[0].rotationStep")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontFamily
    }
  }
}
</script>
