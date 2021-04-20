// 超链接配置
<template lang='pug'>
  .config
    ExpandList(title="超链接设置")
      ControlItem(value="地址")
        AutoInput(v-model="chartData.link")
      ControlItem(value="打开方式")
        Selection(v-model="chartData.target", :option="target")
      ControlItem(value="文本")
        AutoInput(v-model="chartData.text", @onBlur="changeText")
      ControlItem(value="显示下划线")
        SwitchBar(v-model="chartData.underline")
      ControlItem(value="文字滚动")
        SwitchBar(v-model="chartData.marquee")
      ControlItem(v-if="chartData.marquee", value="滚动速度")
        NumInput(:min="1", :max="30", v-model="chartData.scrollamount")
      ControlItem(value="鼠标悬浮颜色")
        ColorPicker(v-model="chartData.hoverColor")
    ExpandList(title="超链接样式")
      ControlItem(value="字体")
        Selection(v-model="chartData.style.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(:min="10", v-model="chartData.style.fontSize")
      ControlItem(value="颜色")
        ColorPicker(v-model="chartData.style.color")
      ControlItem(value="背景")
        ColorPicker(v-model="chartData.style.background")
      ControlItem(value="字体粗细")
        Selection(v-model="chartData.style.fontWeight", :option="fontWeight")
      ControlItem(value="对齐方式")
        Selection(v-model="chartData.style.justifyContent", :option="aglin")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, aglin, fontWeight} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      target: [
        {value: '_blank', name: '在新窗口打开'},
        {value: '_self', name: '在本页打开'}
      ],
      fontFamily,
      aglin,
      fontWeight
    }
  },
  methods: {
    changeText (val) {
      if (!val) {
        this.chartData.text = '北京格胜'
      }
    }
  },
  created () {
    this.chartData = this.position[this.index].chartData
  }
}
</script>
