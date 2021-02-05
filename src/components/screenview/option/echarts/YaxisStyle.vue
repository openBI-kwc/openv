<template lang="pug">
  //- 平面直角坐标系的y轴
  ExpandList(title="Y轴" v-if="chartData.yAxis && chartData.yAxis[0].show")
    ControlItem(value="选择系列")
      Selection(v-model="selectedItem", :option="itemsList")
    template(v-if="index + 1 === selectedItem", v-for="(item, index) in chartData.yAxis")
      ControlItem(value="类型")
        Selection(v-model="item.type", :option="axisTypes")
      .control-entry
        ExpandList(title="文本")
          ControlItem(value="字号")
            NumInput(:min="0", v-model="item.axisLabel.fontSize")
          ControlItem(value="颜色")
            ColorPicker(v-model="item.axisLabel.color")
          ControlItem(value="粗细")
            Selection(v-model="item.axisLabel.fontWeight", :option="fontWeight")
      .control-entry
        ExpandList(title="轴标签")
          ControlItem(value="编辑")
            SwitchBar(v-model="item.axisLabel.show")
          template(v-if="item.axisLabel.show")
            ControlItem(value="最小值")
              NumInput(:min="0", v-model="item.min")
            ControlItem(value="最大值")
              NumInput(:min="0", v-model="item.max")
            ControlItem(value="距轴线距离")
              NumInput(:min="0", v-model="item.axisLabel.margin")
            ControlItem(value="角度")
              NumInput(:min="0", v-model="item.axisLabel.rotate")
      .control-entry
        ExpandList(title="轴单位" ,background="#F7F8FA")
          template
            ControlItem(value="字号")
              NumInput(:min="0", v-model="item.nameTextStyle.fontSize")
            ControlItem(value="距轴线距离")
              NumInput(:min="0", v-model="item.nameGap")
            ControlItem(value="颜色")
              ColorPicker(v-model="item.nameTextStyle.color")
            ControlItem(value="单位")
              AutoInput(v-model="item.name")
      .control-entry
        ExpandList(title="轴线")
          ControlItem(value="编辑")
            SwitchBar(v-model="item.axisLine.show")
          template(v-if="item.axisLine.show")
            ControlItem(value="线宽")
              NumInput(:min="0", v-model="item.axisLine.lineStyle.width")
            ControlItem(value="颜色")
              ColorPicker(v-model="item.axisLine.lineStyle.color")
            ControlItem(value="类型")
              Selection(v-model="item.axisLine.lineStyle.type", :option="lineTypes")
      .control-entry
        ExpandList(title="分隔线")
          ControlItem(value="编辑")
            SwitchBar(v-model="item.splitLine.show")
          template(v-if="item.splitLine.show")
            ControlItem(value="线宽")
              NumInput(:min="0", v-model="item.splitLine.lineStyle.width")
            ControlItem(value="颜色")
              ColorPicker(v-model="item.splitLine.lineStyle.color")
            ControlItem(value="类型")
              Selection(v-model="item.splitLine.lineStyle.type", :option="lineTypes")
</template>

<script>
import dataseries from '@public/mixin/dataseries'
import chartdata from '@public/mixin/chartdata'
import multiplechoice from '@assets/json/multiplechoice'
const {fontWeight, lineTypes, axisTypes} = multiplechoice
export default {
  mixins: [dataseries, chartdata],
  data() {
    return {
      fontWeight,
      lineTypes,
      axisTypes
    }
  }
}
</script>
