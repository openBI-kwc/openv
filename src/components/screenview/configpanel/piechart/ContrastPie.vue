// 百分比对比饼图配置
<template lang='pug'>
  .config
    //- 标题的配置
    ExpandList(title="标题配置" v-if="chartData.title[0]")
      ControlItem(value="显示主标题")
        SwitchBar(v-model="chartData.title[0].show")
      template(v-if="chartData.title[0].show")
        ControlItem(value="文本")
          AutoInput(v-model="chartData.title[0].text")
        ControlItem(value="字体")
          Selection(v-model="chartData.title[0].textStyle.fontFamily", :option="fontFamily")
        ControlItem(value="大小")
          NumInput(:min="0", v-model="chartData.title[0].textStyle.fontSize")
        ControlItem(value="颜色")
          ColorPicker(v-model="chartData.title[0].textStyle.color")
        ControlItem(value="粗细")
          Selection(v-model="chartData.title[0].textStyle.fontWeight", :option="fontWeight")
        ControlItem(value="距顶部距离")
          NumInput(:min="0", v-model="chartData.title[0].padding")
        ControlItem(value="水平位置")
          Selection(v-model="chartData.title[0].left", :option="horizontalAlign")
        ControlItem(value="垂直位置")
          Selection(v-model="chartData.title[0].top", :option="verticalAlign")
      ControlItem(value="显示副标题")
        SwitchBar(v-model="chartData.title[1].show")
      template(v-if="chartData.title[1].show")
        ControlItem(value="文本")
          AutoInput(v-model="chartData.title[1].text")
        ControlItem(value="字体")
          Selection(v-model="chartData.title[1].textStyle.fontFamily", :option="fontFamily")
        ControlItem(value="大小")
          NumInput(:min="0", v-model="chartData.title[1].textStyle.fontSize")
        ControlItem(value="颜色")
          ColorPicker(v-model="chartData.title[1].textStyle.color")
        ControlItem(value="粗细")
          Selection(v-model="chartData.title[1].textStyle.fontWeight", :option="fontWeight")
        ControlItem(value="距顶部距离")
          NumInput(:min="0", v-model="chartData.title[1].padding")
        ControlItem(value="水平位置")
          Selection(v-model="chartData.title[1].left", :option="horizontalAlign")
        ControlItem(value="垂直位置")
          Selection(v-model="chartData.title[1].top", :option="verticalAlign")
    //- 提示框
    TooltipStyle
    ExpandList(title="数据系列")
      .watchChartData(v-if="chartData.series")
        .control-entry
          ExpandList(title="颜色")
            ControlItem(value="内环颜色")
              ColorPicker(v-model="chartData.series[0].itemStyle.color")
            ControlItem(value="外环颜色")
              ColorPicker(v-model="chartData.series[1].itemStyle.color")
            ControlItem(value="底环颜色")
              ColorPicker(v-model="chartData.series[2].itemStyle.color")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, horizontalAlign, verticalAlign, fontWeight} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontFamily,
      horizontalAlign,
      verticalAlign,
      fontWeight
    }
  }
}
</script>
