<template lang="pug">
  //- 地球组件
  ExpandList(title="地球配置", v-if="watchChartData && watchChartData.show")
    ControlItem(value="内半径")
      NumSlider(v-model="watchChartData.globeRadius")
    ControlItem(value="外半径")
      NumSlider(v-model="watchChartData.globeOuterRadius")
    ControlItem(value="地球顶点位移")
      NumInput(:min="0", :max="10", v-model="watchChartData.displacementScale")
    ControlItem(value="纹理")
      Selection(v-model="watchChartData.baseTexture", :option="textureList")
    ControlItem(value="质量")
      Selection(v-model="watchChartData.displacementQuality", :option="quality")
    .control-entry
      ExpandList(title="相机控制", v-if="watchChartData.viewControl")
        ControlItem(value="自动旋转")
          SwitchBar(v-model="watchChartData.viewControl.autoRotate")
        ControlItem(value="旋转角度X")
          NumInput(:min="-360", :max="360", v-model="watchChartData.viewControl.alpha")
        ControlItem(value="旋转角度Y")
          NumInput(:min="-360", :max="360", v-model="watchChartData.viewControl.beta")
        ControlItem(value="相机距离")
          NumInput(v-model="watchChartData.viewControl.distance")
    .control-entry
      ExpandList(title="相机中心", v-if="watchChartData.viewControl.center")
        ControlItem(value="X坐标")
          NumInput(v-model="watchChartData.viewControl.center[0]")
        ControlItem(value="Y坐标")
          NumInput(v-model="watchChartData.viewControl.center[1]")
        ControlItem(value="Z坐标")
          NumInput(v-model="watchChartData.viewControl.center[2]")
</template>

<script>
import watchchart from '@public/mixin/watchchart.js'
import Utils from '@public/utils'
import multiplechoice from '@assets/json/multiplechoice'
const {textureList, quality} = multiplechoice
const { loadData } = Utils
export default {
  mixins: [watchchart],
  data () {
    return {
      textureList,
      quality
    }
  },
  created () {
    loadData('./static/assets/staticSource/mapImg/mapimg.config.json').then(textureList => {
      this.textureList = textureList
    })
  }
}
</script>
