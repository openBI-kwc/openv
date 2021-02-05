<template lang="pug">
  //- 标题的配置
  ExpandList(title="标题配置" v-if="chartData.title")
    ControlItem(value="显示标题")
      SwitchBar(v-model="chartData.title.show")
    template(v-if="chartData.title.show")
      ControlItem(value="文本")
        AutoInput(v-model="chartData.title.text")
      ControlItem(value="字体")
        Selection(v-model="chartData.title.textStyle.fontFamily", :option="fontFamily")
      ControlItem(value="大小")
        NumInput(:min="0", v-model="chartData.title.textStyle.fontSize")
      ControlItem(value="颜色")
        ColorPicker(v-model="chartData.title.textStyle.color")
      ControlItem(value="粗细")
        Selection(v-model="chartData.title.textStyle.fontWeight", :option="fontWeight")
      ControlItem(value="距顶部距离")
        NumInput(:min="0", v-model="chartData.title.padding")
      ControlItem(value="水平位置")
        Selection(v-model="chartData.title.left", :option="horizontalAlign")
      ControlItem(value="垂直位置")
        Selection(v-model="chartData.title.top", :option="verticalAlign")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontWeight, fontFamily, horizontalAlign, verticalAlign} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontWeight,
      fontFamily,
      horizontalAlign,
      verticalAlign
    }
  }
}
</script>
