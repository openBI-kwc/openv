<template lang="pug">
  //- 图例样式配置项
  .legend-config(v-if="chartData.legend")
    ExpandList(title="图例")
      ControlItem(value="编辑按钮")
        SwitchBar(v-model="chartData.legend.show")
      template(v-if="chartData.legend.show")
        ControlItem(value="图例字体")
          Selection(v-model="chartData.legend.textStyle.fontFamily", :option="fontFamily")
        ControlItem(value="图例字号")
          NumInput(:min="0", v-model="chartData.legend.textStyle.fontSize")
        ControlItem(value="图例颜色")
          ColorPicker(v-model="chartData.legend.textStyle.color")
        ControlItem(value="字体粗细")
          Selection(v-model="chartData.legend.textStyle.fontWeight", :option="fontWeight")
        ControlItem(value="图例水平位置")
          Selection(v-model="chartData.legend.left", :option="horizontalAlign")
        ControlItem(value="图例垂直位置")
          Selection(v-model="chartData.legend.top", :option="verticalAlign")
        ControlItem(value="图例布局朝向")
          Selection(v-model="chartData.legend.orient", :option="orient")
        ControlItem(value="图例间距")
          NumInput(:min="0", v-model="chartData.legend.itemGap")
        ControlItem(value="图例宽")
          NumInput(:min="0", v-model="chartData.legend.itemWidth")
        ControlItem(value="图例高")
          NumInput(:min="0", v-model="chartData.legend.itemHeight")
</template>

<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, fontWeight, horizontalAlign, verticalAlign, orient} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontFamily,
      fontWeight,
      horizontalAlign,
      verticalAlign,
      orient
    }
  }
}
</script>
