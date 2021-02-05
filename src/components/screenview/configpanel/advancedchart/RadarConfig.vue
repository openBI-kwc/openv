// 雷达图配置
<template lang='pug'>
  .radar-config
    //- 全局样式
    ExpandList(title="全局样式")
      ControlItem(value="字体")
        Selection(v-model="chartData.textStyle.fontFamily", :option="fontFamily")
    //- 坐标系
    ExpandList(title="坐标系")
      RadarStyle
    //- 系列
    ExpandList(title="系列")
      .series-item(v-if="index + 1 == selectedItem", v-for="(item, index) in chartData.series[0].data", :key="index")
        ControlItem(value="选择系列")
          Selection(v-model="selectedItem", :option="itemsList")
        template(v-if="index + 1 === selectedItem")
          ControlItem(value="透明度")
            NumInput(:max="1", :step="0.1", :precision="1", v-model="item.areaStyle.opacity")
          ControlItem(value="颜色")
            ColorPicker(v-model="item.areaStyle.color")
          .control-entry
            ExpandList(title="动画")
              ControlItem(value="开启")
                SwitchBar(v-model="item.animation")
              template(v-if="item.animation")
                ControlItem(value="间隔时长")
                  NumInput(:min="0", :step="1000", v-model="item.animationDuration")
                ControlItem(value="缓动效果")
                  Selection(v-model="item.animationEasing", :option="animationEasings")
                ControlItem(value="延迟时长")
                  NumInput(:min="0", :step="1000", v-model="item.animationDelay")
          ControlItem(value="节点大小")
            NumInput(:min="0", v-model="item.symbolSize")
          ControlItem(value="边框大小")
            NumInput(:min="0", v-model="item.lineStyle.width")
          ControlItem(value="边框颜色")
            ColorPicker(:min="0", v-model="item.lineStyle.color")
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, animationTypes, animationEasings} = multiplechoice
export default {
  mixins: [chartdata],
  data() {
    return {
      selectedItem: 1,
      itemsList: [],
      fontFamily,
      animationTypes,
      animationEasings
    }
  },
  created() {
    if (!this.chartData.series) return
    let series = this.chartData.series[0].data
    this.itemsList = series.map((item, index) => {
      let ordernum = index + 1
      return {
        name: 'series' + ordernum,
        value: ordernum
      }
    })
  }
}
</script>
