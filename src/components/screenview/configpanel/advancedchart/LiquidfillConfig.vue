// 水球图配置
<template lang='pug'>
  .radar-config
    //- 全局样式
    ExpandList(title="全局样式")
      ControlItem(value="字体")
        Selection(v-model="chartData.textStyle.fontFamily", :option="fontFamily")
    //- 系列
    ExpandList(title="系列")
      .series-item(v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series", :key="index")
        ControlItem(value="水球形状")
          Selection(v-model="item.shape", :option="shapeList")
        ControlItem(value="水球颜色")
          ColorPicker(v-model="item.color[0]")
        ControlItem(value="开启动画")
          SwitchBar(v-model="item.waveAnimation")
        ControlItem(value="背景颜色")
          ColorPicker(v-model="item.backgroundStyle.color")
        ControlItem(value="最大波纹")
          NumInput(:min="1", :max="10", v-model="item.maxWaveNum", @onClick="updateChart")
        .control-entry
          ExpandList(title="中心标签")
            ControlItem(value="颜色")
              ColorPicker(v-model="item.label.color")
            ControlItem(value="字号")
              NumInput(:min="0", v-model="item.label.fontSize")
        .control-entry
          ExpandList(title="边框样式")
            ControlItem(value="显示边框")
              SwitchBar(v-model="item.outline.show")
            ControlItem(value="宽度")
              NumInput(:min="0", v-model="item.outline.itemStyle.borderWidth")
            ControlItem(value="颜色")
              ColorPicker(v-model="item.outline.itemStyle.borderColor")
</template>
<script>
import dataseries from '@public/mixin/dataseries'
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, shapeList} = multiplechoice
export default {
  mixins: [chartdata, dataseries],
  data () {
    return {
      shapeList,
      fontFamily
    }
  },
  methods: {
    updateChart (num) {
      let { series } = this.chartData
      let value = series[0].data[0]
      let waveData = []
      for (let index = 0; index < num; index++) {
        waveData.push(value)
      }
      series[0].data = waveData
    }
  }
}
</script>
