<template lang="pug">
  //- 折线图配置
  .watchChartData(v-if="watchChartData && watchChartData.type === 'line'")
    .control-entry
      ExpandList(title="折线")
        ControlItem(value="颜色" v-if="watchChartData.lineStyle.color && watchChartData.lineStyle.color.colorStops")
          .control-entry
            ColorPicker(v-model="watchChartData.lineStyle.color.colorStops[0].color")
          .control-entry
            ColorPicker(v-model="watchChartData.lineStyle.color.colorStops[1].color")
        ControlItem(value="颜色" v-if="!watchChartData.lineStyle.color.colorStops && watchChartData.lineStyle.color")
          .control-entry
            ColorPicker(v-model="watchChartData.lineStyle.color")
        ControlItem(value="样式")
          Selection(v-model="watchChartData.lineStyle.type", :option="lineTypes")
        ControlItem(value="粗细")
          NumInput(:min="0", v-model="watchChartData.lineStyle.width")
        ControlItem(value="平滑曲线")
          SwitchBar(v-model="watchChartData.smooth")
    .control-entry
      ExpandList(title="圆点")
        ControlItem(value="编辑")
          SwitchBar(v-model="watchChartData.showSymbol")
        template(v-if="watchChartData.showSymbol")
          ControlItem(value="颜色")
            ColorPicker(v-model="watchChartData.itemStyle.color")
          ControlItem(value="图形形状")
            Selection(v-model="watchChartData.symbol", :option="symbol")
          ControlItem(value="半径")
            NumInput(:min="1", v-model="watchChartData.symbolSize")
    .control-entry
      ExpandList(title="动画")
        ControlItem(value="开启")
          SwitchBar(v-model="watchChartData.animation")
        template(v-if="watchChartData.animation")
          ControlItem(value="间隔时长")
            NumInput(:min="0", :step="1000", v-model="watchChartData.animationDuration")
          ControlItem(value="缓动效果")
            Selection(v-model="watchChartData.animationEasing", :option="animationEasings")
          ControlItem(value="延迟时长")
            NumInput(:min="0", :step="1000", v-model="watchChartData.animationDelay")
    .control-entry(v-if="watchChartData.areaStyle")
      ExpandList(title="区域", background="#F7F8FA")
        //- ControlItem(value="编辑")
        //-   SwitchBar(v-model="watchChartData.areaStyle.show")
        template(v-if="watchChartData.areaStyle")
          ControlItem(value="颜色" v-if="watchChartData.areaStyle.color.colorStops")
            .control-entry
              ColorPicker(v-model="watchChartData.areaStyle.color.colorStops[0].color")
            .control-entry
              ColorPicker(v-model="watchChartData.areaStyle.color.colorStops[1].color")
          ControlItem(value="颜色" v-if="watchChartData.areaStyle.color && !watchChartData.areaStyle.color.colorStops")
            .control-entry
              ColorPicker(v-model="watchChartData.areaStyle.color.colorStops[0].color")
            .control-entry
              ColorPicker(v-model="watchChartData.areaStyle.color.colorStops[1].color")
          ControlItem(value="透明度")
            NumInput(:min="0", :max="1", :step="0.1", :precision="1", v-model="watchChartData.areaStyle.opacity")
    .control-entry
      ExpandList(title="标签")
        ControlItem(value="编辑按钮")
          SwitchBar(v-model="watchChartData.label.show")
        template(v-if="watchChartData.label.show && watchChartData.label")
          ControlItem(value="字号")
            NumInput(:min="0", v-model="watchChartData.label.fontSize")
          ControlItem(value="颜色")
            ColorPicker(v-model="watchChartData.label.color")
          ControlItem(value="字体粗细")
            Selection(v-model="watchChartData.label.fontWeight" :option="fontWeight")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {lineTypes, fontWeight, animationTypes, symbol, animationEasings} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      lineTypes,
      fontWeight,
      symbol,
      animationTypes,
      animationEasings
    }
  }
}
</script>
