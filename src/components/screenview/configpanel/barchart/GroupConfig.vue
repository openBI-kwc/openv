// 分层渐变柱状图配置
<template lang='pug'>
  .group-config
    //- 全局样式
    TextStyle
    //- 标题样式
    TitleStyle
    //- 图例
    LegendStyle
    //- 提示框
    TooltipStyle
    ExpandList(title="左侧文字")
      ControlItem(value="文字颜色")
        ColorPicker(v-model="chartData.yAxis.axisLabel.textStyle.color")
      ControlItem(value="文字大小")
        NumInput(v-model="chartData.yAxis.axisLabel.textStyle.fontSize")
      ControlItem(value="偏移量")
         NumInput(:min="5" v-model="chartData.yAxis.offset")
    ExpandList(title="数据系列")
      ControlItem(value="选择系列")
        Selection(v-model="selectedItem", :option="itemsList")
      .SeriesItem(v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series", :key="index")
        ControlItem(value="起始颜色")
          ColorPicker(v-model="item.itemStyle.color.colorStops[0].color")
        ControlItem(value="终止颜色")
          ColorPicker(v-model="item.itemStyle.color.colorStops[1].color")
        ControlItem(value="柱子宽度")
          NumInput(:min="5" v-model="item.barWidth")
        .control-entry
          ExpandList(title="动画")
            ControlItem(value="开启")
              SwitchBar(v-model="item.animation")
            template(v-if="item.animation")
              ControlItem(value="间隔时长")
                NumInput(:min="0", :step="1000", v-model="item.animationDuration")
              ControlItem(value="缓动效果")
                Selection(v-model="item.animationEasing", :option="animationEasings")
              ControlItem(value="延迟时长")
                NumInput(:min="0", :step="1000", v-model="item.animationDelay")
        .control-entry
          ExpandList(title="文字标签")
            ControlItem(value="开启")
              SwitchBar(v-model="item.label.show")
            template(v-if="item.label.show")
              ControlItem(value="文字颜色")
                ColorPicker(v-model="item.label.textStyle.color")
              ControlItem(value="文字大小")
                NumInput(:min="10" v-model="item.label.textStyle.fontSize")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import dataseries from '@public/mixin/dataseries.js'
import chartdata from '@public/mixin/chartdata'
const {animationTypes, animationEasings} = multiplechoice
export default {
  mixins: [dataseries, chartdata],
  data () {
    return {
      animationTypes,
      animationEasings
    }
  }
}
</script>
