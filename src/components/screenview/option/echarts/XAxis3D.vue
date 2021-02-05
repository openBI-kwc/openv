<template lang="pug">
  //- 平面直角坐标系的x轴
  .xAxis3D-config
    ExpandList(title="3D X轴", v-if="chartData.xAxis3D.show")
      ControlItem(value="类型")
        Selection(v-model="chartData.xAxis3D.type", :option="axisTypes")
      .control-entry
        ExpandList(title="文本")
          ControlItem(value="编辑")
            SwitchBar(v-model="chartData.xAxis3D.axisLabel.show")
          template(v-if="chartData.xAxis3D.axisLabel.show")
            ControlItem(value="标签大小")
              NumInput(v-model="chartData.xAxis3D.axisLabel.fontSize")
            ControlItem(value="标签颜色")
              ColorPicker(v-model="chartData.xAxis3D.axisLabel.color")
            ControlItem(value="字体粗细")
              Selection(v-model="chartData.xAxis3D.fontWeight", :option="fontWeight")
      .control-entry
        ExpandList(title="轴单位" ,background="#F7F8FA")
          template(v-if="chartData.xAxis3D.nameTextStyle")
            ControlItem(value="单位")
              AutoInput(v-model="chartData.xAxis3D.name")
            ControlItem(value="字体")
              Selection(v-model="chartData.xAxis3D.nameTextStyle.fontFamily", :option="fontFamily")
            ControlItem(value="字号")
              NumInput(:min="0", v-model="chartData.xAxis3D.nameTextStyle.fontSize")
            ControlItem(value="颜色")
              ColorPicker(v-model="chartData.xAxis3D.nameTextStyle.color")
            ControlItem(value="轴距离")
              NumInput(:min="0", v-model="chartData.xAxis3D.nameGap")
            ControlItem(value="字体粗细")
              Selection(v-model="chartData.xAxis3D.nameTextStyle.fontWeight", :option="fontWeight")
      .control-entry
        ExpandList(title="轴线")
          ControlItem(value="编辑")
            SwitchBar(v-model="chartData.xAxis3D.axisLine.show")
          template(v-if="chartData.xAxis3D.axisLine.show")
            ControlItem(value="颜色")
              ColorPicker(v-model="chartData.xAxis3D.axisLine.lineStyle.color")
      .control-entry
        ExpandList(title="分隔线")
          ControlItem(value="编辑")
            SwitchBar(v-model="chartData.xAxis3D.splitLine.show")
          template(v-if="chartData.xAxis3D.splitLine.show")
            ControlItem(value="线宽")
              NumInput(:min="0", v-model="chartData.xAxis3D.splitLine.lineStyle.width")
            ControlItem(value="颜色")
              ColorPicker(v-model="chartData.xAxis3D.splitLine.lineStyle.color")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontWeight, axisTypes, fontFamily} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontWeight,
      axisTypes,
      fontFamily
    }
  }
}
</script>
