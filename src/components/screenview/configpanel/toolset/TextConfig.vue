// 文本配置
<template lang='pug'>
  .config
    ExpandList(title="全局配置")
      ControlItem(value="标题文本")
        AutoInput(v-model="chartData.text")
      ControlItem(value="水平对齐")
        Selection(v-model="chartData.style.justifyContent", :option="aglin")
      ControlItem(value="垂直对齐")
        Selection(v-model="chartData.style.alignItems", :option="vertical")
    ExpandList(title="文本样式")
      ControlItem(value="字体")
        Selection(v-model="chartData.style.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(:min="10", v-model="chartData.style.fontSize")
      ControlItem(value="字体粗细")
        Selection(v-model="chartData.style.fontWeight", :option="fontWeight")
    ExpandList(title="文字颜色")
      ControlItem(value="填充方式")
        Selection(:value="chartData.style.textColor.type", :option="colorTypes" @onChange="changeTextColor")
      template(v-if="chartData.style.textColor.type === 'danse'")
        ControlItem(value="文本颜色")
          ColorPicker(v-model="chartData.style.textColor.color")
      template(v-if="chartData.style.textColor.type === 'gradient'")
        ControlItem(value="渐变方式")
          Selection(v-model="chartData.style.textColor.gradType" :option="gradTypes")
        ControlItem(value="开始颜色")
          ColorPicker(v-model="chartData.style.textColor.startColor")
        ControlItem(value="终止颜色")
          ColorPicker(v-model="chartData.style.textColor.endColor")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, fontWeight, aglin, vertical} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontFamily,
      fontWeight,
      aglin,
      vertical,
      gradTypes: [
        {
          name: '线性',
          value: 'linear-gradient'
        },
        {
          name: '圆形',
          value: 'radial-gradient'
        }
      ],
      colorTypes: [
        {
          name: '单色填充',
          value: 'danse'
        },
        {
          name: '渐变填充',
          value: 'gradient'
        }
      ],
      colorObj: {
        danse: {
          'type': 'danse',
          'color': '#000'
        },
        gradient: {
          'type': 'gradient',
          'gradType': 'linear-gradient',
          'startColor': 'rgba(139,87,42,1)',
          'endColor': 'rgba(189,16,224,1)'
        }
      }
    }
  },
  methods: {
    changeTextColor (type) {
      this.chartData.style.textColor = this.colorObj[type]
    }
  }
}
</script>
