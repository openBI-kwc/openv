// 视觉映射工具配置
<template lang="pug">
  ExpandList(title="视觉映射")
    ControlItem(value="编辑")
      SwitchBar(v-model="visualMap.show")
    template(v-if="visualMap.show")
      ControlItem(value="宽度")
        NumInput(:min="0", v-model="visualMap.itemWidth")
      ControlItem(value="高度")
        NumInput(:min="0", v-model="visualMap.itemHeight")
      ControlItem(value="最小值")
        NumInput(:min="0",:max="visualMap.max", v-model="visualMap.min")
      ControlItem(value="最大值")
        NumInput(:max="200",:min="visualMap.min", v-model="visualMap.max")
      ControlItem(value="方向")
        Selection(v-model="visualMap.orient", :option="orient")
      ControlItem(value="位置")
        Selection(v-model="visualMap.left", :option="horizontalAlign")
      ControlItem(value="分隔数量",v-if="visualMap.type ==='pieceWise'")
        NumInput(:min="0", v-model="visualMap.splitNumber")
      .control-entry
        ExpandList(title="颜色")
          .control-entry(v-for="(item, index) in visualMap.inRange.color", :key="index")
            ColorPicker(v-model="visualMap.inRange.color[index]")
      .control-entry
        ExpandList(title="文本", v-if="visualMap.text")
          ControlItem(value="字体")
            Selection(v-model="visualMap.textStyle.fontFamily", :option="fontFamily")
          ControlItem(value="字号")
            NumInput(:min="0", v-model="visualMap.textStyle.fontSize")
          ControlItem(value="颜色")
            ColorPicker(v-model="visualMap.textStyle.color")
          ControlItem(value="粗细")
            Selection(v-model="visualMap.textStyle.fontWeight", :option="fontWeight")
</template>

<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {orient, horizontalAlign, fontFamily, fontWeight} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      orient,
      horizontalAlign,
      fontFamily,
      fontWeight,
      alignType: [
        {value: 'auto', name: '自动'},
        {value: 'left', name: '左'},
        {value: 'right', name: '右'},
        {value: 'top', name: '上'},
        {value: 'bottom', name: '下'}
      ],
      visualMap: null
    }
  },
  created () {
    this.visualMap = this.chartData.visualMap
  }
}
</script>
