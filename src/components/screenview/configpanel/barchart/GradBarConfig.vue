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
    ExpandList(title="左侧文本")
      ControlItem(value="字体")
        Selection(v-model="chartData.yAxis[0].axisLabel.textStyle.fontFamily", :option="fontFamily")
      ControlItem(value="大小")
        NumInput(:min="0", v-model="chartData.yAxis[0].axisLabel.textStyle.fontSize")
      ControlItem(value="颜色")
        ColorPicker(v-model="chartData.yAxis[0].axisLabel.textStyle.color")
      ControlItem(value="粗细")
        Selection(v-model="chartData.yAxis[0].axisLabel.textStyle.fontWeight", :option="fontWeight")
    ExpandList(title="数据系列")
      .watchChartData(v-if="chartData.series")
        ControlItem(value="柱体宽度")
          NumInput(:min="0",v-model="chartData.series[0].barWidth")
        ControlItem(value="柱体圆弧度")
          NumInput(:min="0",v-model="chartData.series[0].itemStyle.barBorderRadius")
        .control-entry(v-if="chartData.series[0].itemStyle.color.colorStops")
          ExpandList(title="柱体颜色")
            ControlItem(value="起始颜色")
              ColorPicker(v-model="chartData.series[0].itemStyle.color.colorStops[0].color")
            ControlItem(value="结束颜色")
              ColorPicker(v-model="chartData.series[0].itemStyle.color.colorStops[1].color")
        ControlItem(value="柱体颜色" v-else)
          ColorPicker(v-model="chartData.series[0].itemStyle.color")
        .control-entry
          ExpandList(title="数据标签")
            ControlItem(value="显示")
              SwitchBar(v-model="chartData.series[0].label.show")
            template(v-if="chartData.series[0].label.show")
              ControlItem(value="位置")
                Selection(v-model="chartData.series[0].label.position", :option="positionList")
              ControlItem(value="字体")
                Selection(v-model="chartData.series[0].label.fontFamily", :option="fontFamily")
              ControlItem(value="大小")
                NumInput(:min="0", v-model="chartData.series[0].label.fontSize")
              ControlItem(value="颜色")
                ColorPicker(v-model="chartData.series[0].label.color")
              ControlItem(value="粗细")
                Selection(v-model="chartData.series[0].label.fontWeight", :option="fontWeight")
        .control-entry(v-if="chartData.series[1]")
          ExpandList(title="散点")
            ControlItem(value="大小")
              NumInput(:min="0", v-model="chartData.series[1].symbolSize")
            ControlItem(value="颜色")
              ColorPicker(v-model="chartData.series[1].itemStyle.color")
            ControlItem(value="阴影色")
              ColorPicker(v-model="chartData.series[1].itemStyle.shadowColor")
            ControlItem(value="阴影模糊度")
              NumInput(v-model="chartData.series[1].itemStyle.shadowBlur")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, fontWeight, positionList} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontFamily,
      fontWeight,
      positionList
    }
  }
}
</script>
