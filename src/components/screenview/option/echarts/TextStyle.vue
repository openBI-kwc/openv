<template lang="pug">
   //- 全局样式
   ExpandList(title="全局样式", v-if="chartData.textStyle")
     ControlItem(value="文本样式")
       Selection(v-model="chartData.textStyle.fontFamily", :option="fontFamily")
     ControlItem(value="文本大小")
       NumInput(:min="0", v-model="chartData.textStyle.fontSize")
     ControlItem(value="文本粗细")
       Selection(v-model="chartData.textStyle.fontWeight", :option="fontWeight")
     ControlItem(value="文本颜色")
       ColorPicker(v-model="chartData.textStyle.color")
</template>

<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontWeight, fontFamily} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontWeight,
      fontFamily
    }
  }
}
</script>
