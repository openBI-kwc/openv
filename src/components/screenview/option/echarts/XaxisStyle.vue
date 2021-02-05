<template lang="pug">
  //- 平面直角坐标系的x轴
  ExpandList(title="X轴", v-if="chartData.xAxis")
    ControlItem(value="类型")
      Selection(v-model="chartData.xAxis.type", :option="axisTypes")
    .control-entry
      ExpandList(title="文本")
        ControlItem(value="字号")
          NumInput(:min="0", v-model="chartData.xAxis.axisLabel.fontSize")
        ControlItem(value="颜色")
          ColorPicker(v-model="chartData.xAxis.axisLabel.color")
        ControlItem(value="粗细")
          Selection(v-model="chartData.xAxis.axisLabel.fontWeight", :option="fontWeight")
    .control-entry
      ExpandList(title="轴标签")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.xAxis.axisLabel.show")
        template(v-if="chartData.xAxis.axisLabel.show")
          ControlItem(value="距轴线距离")
            NumInput(:min="0", v-model="chartData.xAxis.axisLabel.margin")
          ControlItem(value="角度")
            NumInput(:min="0", v-model="chartData.xAxis.axisLabel.rotate")
    .control-entry
      ExpandList(title="轴单位" ,background="#F7F8FA")
        template
          ControlItem(value="字号")
            NumInput(:min="0", v-model="chartData.xAxis.nameTextStyle.fontSize")
          ControlItem(value="距轴线距离")
            NumInput(:min="0", v-model="chartData.xAxis.nameGap")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.xAxis.nameTextStyle.color")
          ControlItem(value="单位")
            AutoInput(v-model="chartData.xAxis.name")
    .control-entry
      ExpandList(title="轴线")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.xAxis.axisLine.show")
        template(v-if="chartData.xAxis.axisLine.show")
          ControlItem(value="线宽")
            NumInput(:min="0", v-model="chartData.xAxis.axisLine.lineStyle.width")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.xAxis.axisLine.lineStyle.color")
          ControlItem(value="类型")
            Selection(v-model="chartData.xAxis.axisLine.lineStyle.type", :option="lineTypes")
    .control-entry
      ExpandList(title="分隔线")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.xAxis.splitLine.show")
        template(v-if="chartData.xAxis.splitLine.show")
          ControlItem(value="线宽")
            NumInput(:min="0", v-model="chartData.xAxis.splitLine.lineStyle.width")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.xAxis.splitLine.lineStyle.color")
          ControlItem(value="类型")
            Selection(v-model="chartData.xAxis.splitLine.lineStyle.type", :option="lineTypes")
</template>

<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontWeight, lineTypes, axisTypes} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontWeight,
      lineTypes,
      axisTypes
    }
  }
}
</script>
