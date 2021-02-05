<template lang="pug">
  //- 极坐标径向轴
  ExpandList(title="极坐标", v-if="chartData.radiusAxis")
    ControlItem(value="类型")
      Selection(v-model="chartData.radiusAxis.type", :option="axisTypes")
    .control-entry
      ExpandList(title="文本")
        ControlItem(value="字号")
          NumInput(:min="0", v-model="chartData.radiusAxis.axisLabel.fontSize")
        ControlItem(value="颜色")
          ColorPicker(v-model="chartData.radiusAxis.axisLabel.color")
        ControlItem(value="字体粗细")
          Selection(v-model="chartData.radiusAxis.axisLabel.fontWeight", :option="fontWeight")
    .control-entry
      ExpandList(title="轴标签")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.radiusAxis.axisLabel.show")
        template(v-if="chartData.radiusAxis.axisLabel.show")
          ControlItem(value="最小值")
            AutoInput(v-model="chartData.radiusAxis.min")
          ControlItem(value="最大值")
            AutoInput(v-model="chartData.radiusAxis.max")
          ControlItem(value="显示格式")
            AutoInput(v-model="chartData.radiusAxis.axisLabel.formatter")
          ControlItem(value="距轴线距离")
            AutoInput(v-model="chartData.radiusAxis.axisLabel.margin")
          ControlItem(value="角度")
            AutoInput(v-model="chartData.radiusAxis.axisLabel.rotate")
    .control-entry
      ExpandList(title="轴单位")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.radiusAxis.name")
        template(v-if="chartData.radiusAxis.name")
          ControlItem(value="单位")
            AutoInput(v-model="chartData.radiusAxis.name")
          ControlItem(value="字号")
            NumInput(:min="0", v-model="chartData.radiusAxis.nameTextStyle.fontSize")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.radiusAxis.nameTextStyle.color")
          ControlItem(value="距轴线距离")
            AutoInput(v-model="chartData.radiusAxis.nameGap")
    .control-entry
      ExpandList(title="轴线")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.radiusAxis.axisLine.show")
        template(v-if="chartData.radiusAxis.axisLine.show")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.radiusAxis.axisLine.lineStyle.color")
          ControlItem(value="线宽")
            AutoInput(v-model="chartData.radiusAxis.axisLine.lineStyle.width")
          ControlItem(value="类型")
            Selection(v-model="chartData.radiusAxis.axisLine.lineStyle.type", :option="lineTypes")
    .control-entry
      ExpandList(title="网格线")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.radiusAxis.splitLine.show")
        template(v-if="chartData.radiusAxis.splitLine.show")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.radiusAxis.splitLine.lineStyle.color")
          ControlItem(value="线宽")
            AutoInput(v-model="chartData.radiusAxis.splitLine.lineStyle.width")
          ControlItem(value="类型")
            Selection(v-model="chartData.radiusAxis.splitLine.lineStyle.type", :option="lineTypes")
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
