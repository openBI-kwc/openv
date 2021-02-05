<template lang="pug">
  //- 漏斗图配置
  .watchChartData
    ControlItem(value="最小数值")
      NumInput(:min="0", v-model="watchChartData.min")
    ControlItem(value="最大数值")
      NumInput(:min="0", v-model="watchChartData.max")
    ControlItem(value="低谷宽度")
      NumInput(:min="0", v-model="watchChartData.minSize")
    ControlItem(value="数据项间隙")
      NumInput(:min="0", v-model="watchChartData.gap")
    ControlItem(value="数据排序")
      Selection(v-model="watchChartData.sort", :option="sortList")
    ControlItem(value="对齐方式")
      Selection(v-model="watchChartData.funnelAlign", :option="horizontalAlign")
    .control-entry
      ExpandList(title="标签")
        ControlItem(value="开启")
          SwitchBar(v-model="watchChartData.label.show")
        template(v-if="watchChartData.label.show")
          ControlItem(value="文字大小")
            NumInput(:min="10", v-model="watchChartData.label.fontSize")
          ControlItem(value="文字颜色")
            ColorPicker(v-model="watchChartData.label.color")
          ControlItem(value="字体粗细")
            Selection(v-model="watchChartData.label.fontWeight", :option="fontWeight")
          ControlItem(value="标签位置")
            Selection(v-model="watchChartData.label.position", :option="horizontalAlign")
</template>
<script>
import watchchart from '@public/mixin/watchchart.js'
import multiplechoice from '@assets/json/multiplechoice'
const {horizontalAlign, fontWeight} = multiplechoice
export default {
  mixins: [watchchart],
  data () {
    return {
      sortList: [
        {value: 'ascending', name: '升序'},
        {value: 'descending', name: '降序'},
        {value: 'none', name: '无'}
      ],
      horizontalAlign,
      fontWeight
    }
  }
}
</script>
