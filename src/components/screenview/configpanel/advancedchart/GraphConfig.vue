// 关系网络配置
<template lang='pug'>
  .graph-config
    TitleStyle
    TooltipStyle
    //- 自定义颜色
    CustomColor
    ExpandList(title="节点配置")
      ControlItem(value="拖拽")
        SwitchBar(v-model="series.draggable")
      ControlItem(value="节点标记")
        Selection(v-model="series.symbol", :option="symbol")
      ControlItem(value="节点不透明度")
        NumInput(v-model="series.itemStyle.opacity")
      ControlItem(value="边框宽度")
        NumInput(v-model="series.itemStyle.borderWidth" :min="0")
      ControlItem(value="边框颜色")
        ColorPicker(v-model="series.itemStyle.borderColor")
      ControlItem(value="阴影宽度")
        NumInput(v-model="series.itemStyle.shadowBlur")
      ControlItem(value="阴影颜色")
        ColorPicker(v-model="series.itemStyle.shadowColor")
    ExpandList(title="力引导", v-if="series.force && series.layout === 'force'")
      ControlItem(value="斥力因子")
        NumInput(:min="0", v-model="series.force.repulsion")
      ControlItem(value="引力因子")
        NumInput(:min="0.01", :step="0.01", :max="100", :precision="2", v-model="series.force.gravity")
      ControlItem(value="节点距离")
        NumInput(:min="0", v-model="series.force.edgeLength")
    ExpandList(title="环形布局", v-if="series.circular && series.layout === 'circular'")
      ControlItem(value="标签旋转")
        SwitchBar(v-model="series.circular.rotateLabel")
    //- 标签
    ExpandList(title="文字标签")
      ControlItem(value="编辑")
        SwitchBar(v-model="series.label.show")
      template(v-if="series.label.show")
        ControlItem(value="位置")
          Selection(v-model="series.label.position", :option="positionList")
        ControlItem(value="字号")
          NumInput(:min="0", v-model="series.label.fontSize")
        ControlItem(value="颜色")
          ColorPicker(v-model="series.label.color")
        ControlItem(value="字体粗细")
          Selection(v-model="series.label.fontWeight", :option="fontWeight")
    //- 连接线
    ExpandList(title="连接线")
      ControlItem(value="线宽")
        NumInput(:min="0", v-model="series.lineStyle.width")
      ControlItem(value="曲度")
        NumInput(:min="0", :max="1", :step="0.1",:precision="1" v-model="series.lineStyle.curveness")
      ControlItem(value="类型")
        Selection(v-model="series.lineStyle.type", :option="lineTypes")
      ControlItem(value="颜色")
        ColorPicker(v-model="series.lineStyle.color")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {layouts, symbol, positionList, fontWeight, lineTypes} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      series: null,
      layouts,
      symbol,
      positionList,
      fontWeight,
      lineTypes
    }
  },
  created () {
    this.series = this.chartData.series[0]
  }
}
</script>
