// 柱图配置
<template lang='pug'>
  .barcode-config
    //- 全局样式
    TextStyle
    //- 标题样式
    TitleStyle
    GridStyle
    //- 提示框
    TooltipStyle
    //- Y轴
    ExpandList(title="文本配置")
      ControlItem(value="显示文本")
        SwitchBar(v-model="chartData.yAxis[0].axisLabel.show")
      template(v-if="chartData.yAxis[0].axisLabel.show")
        ControlItem(value="字体")
          Selection(v-model="chartData.yAxis[0].axisLabel.textStyle.fontFamily", :option="fontFamily")
        ControlItem(value="大小")
          NumInput(:min="0", v-model="chartData.yAxis[0].axisLabel.textStyle.fontSize")
        ControlItem(value="颜色")
          ColorPicker(v-model="chartData.yAxis[0].axisLabel.textStyle.color")
        ControlItem(value="粗细")
          Selection(v-model="chartData.yAxis[0].axisLabel.textStyle.fontWeight", :option="fontWeight")
        ControlItem(value="距顶点距离")
          NumInput(:min="-9999", v-model="chartData.yAxis[0].axisLabel.padding[3]")
        ControlItem(value="文本行高")
          NumInput(:min="0", v-model="chartData.yAxis[0].axisLabel.lineHeight")
    ExpandList(title="数据系列")
      .watchChartData(v-if="chartData.series")
        .control-entry
          ExpandList(title="颜色")
              ControlItem(value="进度颜色")
                ColorPicker(v-model="chartData.series[0].itemStyle.color")
              ControlItem(value="底柱颜色")
                ColorPicker(v-model="chartData.series[1].itemStyle.color")
        .control-entry
          ExpandList(title="数据文本")
              ControlItem(value="字体")
                Selection(v-model="chartData.series[0].label.textStyle.fontFamily", :option="fontFamily")
              ControlItem(value="大小")
                NumInput(:min="0", v-model="chartData.series[0].label.textStyle.fontSize")
              ControlItem(value="颜色")
                ColorPicker(v-model="chartData.series[0].label.textStyle.color")
              ControlItem(value="粗细")
                Selection(v-model="chartData.series[0].label.textStyle.fontWeight", :option="fontWeight")
              ControlItem(value="距顶点横坐标")
                NumInput(:min="-9999", v-model="chartData.series[0].label.position[0]")
              ControlItem(value="距顶点纵坐标")
                NumInput(:min="-9999", v-model="chartData.series[0].label.position[1]")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, fontWeight} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontFamily,
      fontWeight
    }
  }
}
</script>
