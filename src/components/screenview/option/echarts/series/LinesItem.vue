<template lang="pug">
  //- 飞线图配置
  .watchChartData
    .control-entry
      ExpandList(title="特效样式")
        ControlItem(value="编辑特效")
          SwitchBar(v-model="watchChartData.effect.show")
        template(v-if="watchChartData.effect.show")
          ControlItem(value="特效周期")
            NumInput(:min="0", v-model="watchChartData.effect.period")
          ControlItem(value="特效延迟")
            NumInput(:min="0", v-model="watchChartData.effect.delay")
          ControlItem(value="特效颜色")
            ColorPicker(v-model="watchChartData.effect.color")
          ControlItem(value="形状大小")
            NumInput(:min="0", v-model="watchChartData.effect.symbolSize")
    .control-entry
      ExpandList(title="飞线样式")
        ControlItem(value="线条宽度")
          NumInput(:min="0", v-model="watchChartData.lineStyle.width")
        ControlItem(value="线条类型")
          Selection(v-model="watchChartData.lineStyle.type", :option="lineTypes")
        ControlItem(value="透明度")
          NumInput(:min="0", :max="1", :step="0.1", :precision="1", v-model="watchChartData.lineStyle.opacity")
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
