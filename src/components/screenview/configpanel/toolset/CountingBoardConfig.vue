// 计数板配置
<template lang='pug'>
.board-config
  ExpandList(title="边框设置")
    ControlItem(value="使用边框")
      SwitchBar(v-model="chartData.useBorder")
    template(v-if="chartData.useBorder")
      ControlItem(value="边框类型")
        Selection(v-model="chartData.borderStyle.borderType", :option="borders")
      ControlItem(value="不透明度(%)")
        NumInput(v-model="chartData.borderStyle.opacity" :max="100" :min="1")
      ControlItem(value="上边宽")
        NumInput(v-model="chartData.borderStyle.borderWidth[0]" :max="100" :min="1")
      ControlItem(value="右边宽")
        NumInput(v-model="chartData.borderStyle.borderWidth[1]" :max="100" :min="1")
      ControlItem(value="下边宽")
        NumInput(v-model="chartData.borderStyle.borderWidth[2]" :max="100" :min="1")
      ControlItem(value="左边宽")
        NumInput(v-model="chartData.borderStyle.borderWidth[3]" :max="100" :min="1")
  ExpandList(title="文本样式")
    ControlItem(value="字体")
      Selection(v-model="chartData.textStyle.fontFamily", :option="fontFamily")
    ControlItem(value="字号")
      NumInput(v-model="chartData.textStyle.fontSize")
    ControlItem(value="颜色")
      ColorPicker(v-model="chartData.textStyle.color")
    ControlItem(value="字体粗细")
      Selection(v-model="chartData.textStyle.fontWeight", :option="fontWeight")
</template>
<script>
import Utils from '@public/utils'
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
import borders from '@assets/json/borders'
const {fontFamily, fontWeight} = multiplechoice
const { loadData } = Utils
export default {
  mixins: [chartdata],
  data () {
    return {
      borders: [],
      fontFamily,
      fontWeight
    }
  },
  created () {
    this.getBorderList()
  },
  methods: {
    changeBorder (val) {
      if (this.useBorder) return
      this.chartData.size = 0
      this.chartData.borderUrl = ''
    },
    getBorderList () {
      this.borders = borders.map((item, index) => {
        const count = index + 1
        return {
          name: count + '号边框',
          value: './static/assets/img/borders/' + item.src
        }
      })
    }
  }
}
</script>
