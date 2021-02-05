<template lang="pug">
  //- 雷达图配置
  .radar-config
    ControlItem(value="起始角度")
      NumInput(:min="0", v-model="chartData.radar.startAngle")
    ControlItem(value="分割段数")
      NumInput(:min="0", v-model="chartData.radar.splitNumber")
    ControlItem(value="形状")
      Selection(v-model="chartData.radar.shape", :option="radershap")
    .control-entry
      ExpandList(title="指示器名称")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.radar.name.show")
        template(v-if="chartData.radar.name.show")
          ControlItem(value="字号")
            NumInput(:min="0", v-model="chartData.radar.name.textStyle.fontSize")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.radar.name.textStyle.color")
          ControlItem(value="字体粗细")
            Selection(v-model="chartData.radar.name.textStyle.fontWeight", :option="fontWeight")
          ControlItem(value="距轴线距离")
            NumInput(:min="0", v-model="chartData.radar.nameGap")
    .control-entry
      ExpandList(title="轴线")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.radar.axisLine.show")
        template(v-if="chartData.radar.axisLine.show")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.radar.axisLine.lineStyle.color")
          ControlItem(value="线宽")
            NumInput(:min="0", v-model="chartData.radar.axisLine.lineStyle.width")
          ControlItem(value="类型")
            Selection(v-model="chartData.radar.axisLine.lineStyle.type", :option="lineTypes")
    .control-entry
      ExpandList(title="网格线")
        ControlItem(value="编辑")
          SwitchBar(v-model="chartData.radar.splitLine.show")
        template(v-if="chartData.radar.splitLine.show")
          ControlItem(value="颜色")
            ColorPicker(v-model="chartData.radar.splitLine.lineStyle.color")
          ControlItem(value="线宽")
            NumInput(:min="0", v-model="chartData.radar.splitLine.lineStyle.width")
          ControlItem(value="类型")
            Selection(v-model="chartData.radar.splitLine.lineStyle.type", :option="lineTypes")
</template>

<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {radershap, fontWeight, lineTypes} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      radershap,
      fontWeight,
      lineTypes
    }
  }
}
</script>
