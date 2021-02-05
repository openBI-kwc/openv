<template lang="pug">
  //- 散点图配置
  .watchChartData
    ControlItem(value="颜色")
      ColorPicker(v-model="watchChartData.itemStyle.color")
    ControlItem(value="描边颜色")
      ColorPicker(v-model="watchChartData.itemStyle.borderColor")
    ControlItem(value="描边宽度")
      NumInput(:min="0", v-model="watchChartData.itemStyle.borderWidth")
    ControlItem(value="描边类型")
      Selection(v-model="watchChartData.itemStyle.borderType", :option="lineTypes")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {lineTypes} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      lineTypes
    }
  }
}
</script>
