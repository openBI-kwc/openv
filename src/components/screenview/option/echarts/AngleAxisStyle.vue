<template lang="pug">
  //- 极坐标的配置项
  ExpandList(title="极坐标", v-if="chartData.angleAxis")
    ControlItem(value="起始角度")
      AutoInput(v-model="chartData.angleAxis.startAngle")
    ControlItem(value="坐标轴类型")
      Selection(v-model="chartData.angleAxis.type", :option="axisTypes")
    ControlItem(value="最小值")
      AutoInput(v-model="chartData.angleAxis.min")
    ControlItem(value="最大值")
      AutoInput(v-model="chartData.angleAxis.max")
    .control-entry
      ExpandList(title="轴线")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.angleAxis.axisLine.show")
        template(v-if="chartData.angleAxis.axisLine.show")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.angleAxis.lineStyle.color")
          ControlItem(value="线宽")
            AutoInput(v-model="chartData.angleAxis.lineStyle.width")
          ControlItem(value="类型")
            AutoInput(v-model="chartData.angleAxis.lineStyle.type", :option="lineTypes")
    .control-entry
      ExpandList(title="轴标签")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.angleAxis.axisLabel.show")
        template(v-if="chartData.angleAxis.axisLabel.show")
          ControlItem(value="字号")
            NumInput(:min="0", v-model="chartData.angleAxis.axisLabel.fontSize")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.angleAxis.axisLabel.color")
          ControlItem(value="字体粗细")
            Selection(v-model="chartData.angleAxis.axisLabel.fontWeight", :option="fontWeight")      
          ControlItem(value="距轴线距离")
            NumInput(:min="0", v-model="chartData.angleAxis.axisLabel.margin")
    .control-entry
      ExpandList(title="网格线")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.angleAxis.splitLine.show")
        template(v-if="chartData.angleAxis.splitLine.show")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.angleAxis.splitLine.lineStyle.color")
          ControlItem(value="线宽")
            AutoInput(v-model="chartData.angleAxis.splitLine.lineStyle.width")
          ControlItem(value="类型")
            Selection(v-model="chartData.angleAxis.splitLine.lineStyle.type", :option="lineTypes")
</template>

<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {axisTypes, fontWeight, lineTypes} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      axisTypes,
      fontWeight,
      lineTypes
    }
  }
}
</script>
