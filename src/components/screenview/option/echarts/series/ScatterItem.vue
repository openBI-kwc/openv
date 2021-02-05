<template lang="pug">
  //- 散点图配置
  .watchChartData
    ControlItem(value="边框宽度")
      NumInput(:min="0", v-model="watchChartData.itemStyle.borderWidth")
    ControlItem(value="边框类型")   
      Selection(v-model="watchChartData.itemStyle.borderType", :option="lineTypes")
    ControlItem(value="边框颜色")
      ColorPicker(v-model="watchChartData.itemStyle.borderColor")
    ControlItem(value="显示标签")
      SwitchBar(v-model="watchChartData.label.show")
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
    .control-entry
      ExpandList(v-if="watchChartData.label && watchChartData.label.show", title="文本标签")
        ControlItem(value="文本位置")
          Selection(v-model="watchChartData.label.position", :option="verticalAlign")
        ControlItem(value="文本颜色")
          ColorPicker(v-model="watchChartData.label.color")
        ControlItem(value="标题字体")
          Selection(v-model="watchChartData.label.fontFamily", :option="fontFamily")
        ControlItem(value="标题大小")
          NumInput(:min="0", v-model="watchChartData.label.fontSize")
        ControlItem(value="标题粗细")
          Selection(v-model="watchChartData.label.fontWeight", :option="fontWeight")
        ControlItem(value="边框宽度")
          NumInput(:min="0", v-model="watchChartData.label.borderWidth")
        ControlItem(value="边框颜色")
          ColorPicker(v-model="watchChartData.label.borderColor")
        ControlItem(value="边框圆角")
          NumInput(:min="0", v-model="watchChartData.label.borderRadius")
        ControlItem(value="背景颜色")
          ColorPicker(v-model="watchChartData.label.backgroundColor")
</template>

<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {lineTypes, fontWeight, fontFamily, verticalAlign, animationTypes, animationEasings} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      lineTypes,
      fontWeight,
      fontFamily,
      verticalAlign,
      animationTypes,
      animationEasings
    }
  }
}
</script>
