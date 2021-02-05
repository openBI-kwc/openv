// 直线配置
<template lang='pug'>
  .line-config
    ExpandList(title="全局样式")
      ControlItem(value="背景色")
        ColorPicker(v-model="chartData.background")
      ControlItem(value="边框背景色")
        ColorPicker(v-model="chartData.borderColor")
      ControlItem(value="透明度")
        NumInput(:max="10", :step="1", :precision="1",v-model="chartData.opacity")
      ControlItem(value="上边框")
        CheckBox(v-model="chartData.showTopBorder", type="checkbox", radioActive="checked")
      ControlItem(value="下边框")
        CheckBox(v-model="chartData.showBottomBorder", type="checkbox", radioActive="checked")
      ControlItem(value="左边框")
        CheckBox(v-model="chartData.showLeftBorder", type="checkbox", radioActive="checked")
      ControlItem(value="右边框")
        CheckBox(v-model="chartData.showRightBorder", type="checkbox", radioActive="checked")
</template>
<script>
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [chartdata]
}
</script>
