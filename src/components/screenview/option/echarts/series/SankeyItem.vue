<template lang="pug">
  //- 桑基图公共配置
  .watchChartData
    ControlItem(value="矩形节点宽度")
      NumInput(:min="0" v-model="watchChartData.nodeWidth")
    ControlItem(value="矩形节点距离")
      NumInput(:min="0" v-model="watchChartData.nodeGap")
    ControlItem(value="节点布局方向")
      Selection(v-model="watchChartData.orient" :option="orient")
    ControlItem(value="图形颜色")
      ColorPicker(v-model="watchChartData.itemStyle.color")
    ControlItem(value="图形描边宽度")
      NumInput(:min="0", v-model="watchChartData.itemStyle.borderWidth")
    ControlItem(value="图形描边颜色")
      ColorPicker(v-model="watchChartData.itemStyle.borderColor")
    ControlItem(value="图形透明度")
      NumInput(:min="0",:max="1",:step="0.1", :precision="1", v-model="watchChartData.itemStyle.opacity")
    ControlItem(value="桑基图边颜色")
      ColorPicker(v-model="watchChartData.lineStyle.color")
    ControlItem(value="桑基图边透明度")
      NumInput(:min="0",:max="1",:step="0.1", :precision="1", v-model="watchChartData.lineStyle.opacity")
    ControlItem(value="桑基图像曲度")
      NumInput(:min="0",:max="1",:step="0.1", :precision="1", v-model="watchChartData.lineStyle.curveness")
    ControlItem(value="显示标签")
      SwitchBar(v-model="watchChartData.label.show")
    .control-entry
      ExpandList(v-if="watchChartData.label && watchChartData.label.show", title="文本标签")
        ControlItem(value="颜色")
          ColorPicker(v-model="watchChartData.label.color")
        ControlItem(value="文字位置")
          Selection(v-model="watchChartData.label.position" :option="positionList")
        ControlItem(value="文字风格")
          Selection(v-model="watchChartData.label.fontStyle" :option="fontStyle")
        ControlItem(value="文字粗细")
          Selection(v-model="watchChartData.label.fontWeight" :option="fontWeight")
        ControlItem(value="文字系列")
          Selection(v-model="watchChartData.label.fontFamily" :option="fontFamily")
        ControlItem(value="文字大小")
          NumInput(:min="1" v-model="watchChartData.label.fontSize")
        ControlItem(value="文字行高")
          NumInput(:min="1" v-model="watchChartData.label.lineHeight")
        ControlItem(value="文字水平对齐")
          Selection(v-model="watchChartData.label.align" :option="horizontalAlign")
        ControlItem(value="文字垂直对齐")
          Selection(v-model="watchChartData.label.verticalAlign" :option="verticalAlign")
        ControlItem(value="背景颜色")
          ColorPicker(v-model="watchChartData.label.backgroundColor")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {orient, fontFamily, fontWeight, positionList, fontStyle, horizontalAlign, verticalAlign} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      orient,
      fontFamily,
      fontWeight,
      positionList,
      fontStyle,
      horizontalAlign, 
      verticalAlign
    }
  }
}
</script>
