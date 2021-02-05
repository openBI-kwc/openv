<template lang="pug">
  //- 折线图配置
  .watchChartData
    ControlItem(value="最小值")
      NumInput(:min="0", v-model="watchChartData.min")
    ControlItem(value="最大值")
      NumInput(:min="0", v-model="watchChartData.max")
    ControlItem(value="分割段数")
      NumInput(:min="0", v-model="watchChartData.splitNumber")
    ControlItem(value="轴线宽度")
      NumInput(:min="0", v-model="watchChartData.axisLine.lineStyle.width")
    .control-entry
      ExpandList(title="标签")
        ControlItem(value="字号")
          NumInput(:min="0", v-model="watchChartData.axisLabel.fontSize")
        ControlItem(value="距轴线距离")
          NumInput(:min="0", v-model="watchChartData.axisLabel.distance")
        ControlItem(value="颜色")
          ColorPicker(v-model="watchChartData.axisLabel.color")
        ControlItem(value="字体粗细")
          Selection(v-model="watchChartData.axisLabel.fontWeight", :option="fontWeight")
    .control-entry
      ExpandList(title="指针样式")
        ControlItem(value="宽度")
          NumInput(:min="0", v-model="watchChartData.pointer.width")
        ControlItem(value="颜色")
          ColorPicker(v-model="watchChartData.itemStyle.color")
    .control-entry
      ExpandList(title="标题")
        ControlItem(value="显示标题")
          SwitchBar(v-model="watchChartData.title.show")
        template(v-if="watchChartData.title.show")
          ControlItem(value="颜色")
            ColorPicker(v-model="watchChartData.title.color")
          ControlItem(value="字号")
            NumInput(v-model="watchChartData.title.fontSize")
    .control-entry
      ExpandList(title="详情")
        ControlItem(value="显示详情")
          SwitchBar(v-model="watchChartData.detail.show")
        template(v-if="watchChartData.detail.show")
          ControlItem(value="颜色")
            ColorPicker(v-model="watchChartData.detail.color")
          ControlItem(value="字号")
            NumInput(v-model="watchChartData.detail.fontSize")
          ControlItem(value="背景色")
            ColorPicker(v-model="watchChartData.detail.backgroundColor")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {fontWeight} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      fontWeight
    }
  }
}
</script>
