<template lang="pug">
  //- 地理坐标系配置项
  ExpandList(title="地理坐标系", v-if="geo && geo.show")
    ControlItem(value="地图缩放")
      SwitchBar(v-model="geo.roam")
    ControlItem(value="中心经度")
      NumInput(:min="-180", :max="180", v-model="geo.center[0]")
    ControlItem(value="中心纬度")
      NumInput(:min="-90", :max="90", v-model="geo.center[1]")
    ControlItem(value="缩放比例")
      NumInput(:min="0", v-model="geo.zoom")
    .control-entry(v-if="geo.label")
      ExpandList(title="文本")
        ControlItem(value="编辑")
          SwitchBar(v-model="geo.label.show")
        template(v-if="geo.label.show")
          ControlItem(value="字号")
            NumInput(:min="0", v-model="geo.label.fontSize")
          ControlItem(value="颜色")
            ColorPicker(v-model="geo.label.color")
          ControlItem(value="字体粗细")
            Selection(v-model="geo.label.fontWeight", :option="fontWeight")
    .control-entry(v-if="geo.itemStyle")
      ExpandList(title="图形样式")
        ControlItem(value="区域颜色")
          ColorPicker(v-model="geo.itemStyle.areaColor")
        ControlItem(value="描边颜色")
          ColorPicker(v-model="geo.itemStyle.borderColor")
        ControlItem(value="描边线宽")
          NumInput(:min="0", v-model="geo.itemStyle.borderWidth")
        ControlItem(value="描边类型")
          Selection(v-model="geo.itemStyle.borderType", :option="lineTypes")
</template>

<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontWeight, lineTypes} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      geo: null,
      fontWeight,
      lineTypes
    }
  },
  created () {
    this.geo = this.chartData.geo
  }
}
</script>
