<template lang="pug">
  //- 百度地图配置
  ExpandList(title="地图配置", v-if="chartData.bmap")
    ControlItem(value="中心经度")
      NumInput(:min="-180", :max="180", v-model="chartData.bmap.center[0]")
    ControlItem(value="中心纬度")
      NumInput(:min="-180", :max="180", v-model="chartData.bmap.center[1]")
    ControlItem(value="缩放")
      SwitchBar(v-model="chartData.bmap.roam")
    ControlItem(value="缩放等级")
      NumInput(:min="1", v-model="chartData.bmap.zoom")
    ControlItem(value="地图样式")
      Selection(v-model="btmp", :option="bmapStyle", @onChange="selectTmp")
</template>
<script>
import BmapStyle from '@assets/json/bmaptmp'
import chartdata from '@public/mixin/chartdata'
import multiplechoice from '@assets/json/multiplechoice'
const {bmapStyle} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      bmapStyle: [],
      btmp: ''
    }
  },
  created () {
    Object.keys(BmapStyle).forEach((key, index) => {
      const element = {
        name: BmapStyle[key].name,
        value: key
      }
      this.bmapStyle.push(element)
    })
    this.btmp = this.chartData.bmap.mapStyle.name
  },
  methods: {
    selectTmp (tmpname) {
      if (tmpname === 'default') return
      let tmp = BmapStyle[tmpname]
      this.chartData.bmap.mapStyle = tmp
    }
  }
}
</script>
