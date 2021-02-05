<template lang="pug">
  //- 地理坐标系配置项
  ExpandList(title="3D地理坐标系", v-if="geo3D && geo3D.show")
    .control-entry(v-if="geo3D.itemStyle")
      ExpandList(title="图形样式")
        ControlItem(value="图形颜色")
          ColorPicker(v-model="geo3D.itemStyle.color")
        ControlItem(value="描边颜色")
          ColorPicker(v-model="geo3D.itemStyle.borderColor")
        ControlItem(value="描边线宽")
          NumInput(:min="0", v-model="geo3D.itemStyle.borderWidth")
    //- .control-entry(v-if="geo3D.label")
    //-   ExpandList(title="文本标签")
    //-     ControlItem(value="编辑")
    //-       SwitchBar(v-model="geo3D.label.show")
    //-     template(v-if="geo3D.label.show")
    //-       ControlItem(value="字号")
    //-         NumInput(:min="0", v-model="geo3D.label.textStyle.fontSize")
    //-       ControlItem(value="颜色")
    //-         ColorPicker(v-model="geo3D.label.textStyle.color")
    //-       ControlItem(value="字体粗细")
    //-         Selection(v-model="geo3D.label.textStyle.fontWeight", :option="fontWeight")
</template>
<script>
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [chartdata],
  data () {
    return {
      geo3D: null
    }
  },
  created () {
    this.geo3D = this.chartData.geo3D
  }
}
</script>
