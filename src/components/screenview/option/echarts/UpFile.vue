// 饼图配置
<template lang='pug'>
  .pie
    ExpandList(title="中心图片(带图饼图)", v-if="this.graphic")
      ControlItem(value="图片地址")
        AutoInput(v-model="graphic.elements[0].style.image")
      ControlItem(value="背景图片")
        .right
          ImageUpload(text="点击上传图片", @onChange="uploadBackground", :imgUrl='graphic.elements[0].style.image',  accept="image/jpeg,image/png,image/bmp,image/gif,image/svg+xml")
      ControlItem(value="图片宽")
        NumInput(:min="0", v-model="graphic.elements[0].style.width")
      ControlItem(value="图片高")
        NumInput(:min="0", v-model="graphic.elements[0].style.height")
</template>
<script>
import { UPLOAD_IMG } from '@api/upload.js'
import Utils from '@public/utils'
import { mapState } from 'vuex'
import chartdata from '@public/mixin/chartdata'
const { formParams } = Utils
export default {
  mixins: [chartdata],
  data () {
    return {
      legendData: null,
      gridData: null,
      labelData: null,
      switchs: false,
      graphic: null,
      faceBase64: null
    }
  },
  created () {
    this.labelData = this.chartData.series[0]
    this.legendData = this.chartData.legend
    this.gridData = this.chartData.grid
    this.graphic = this.chartData.graphic
    this.switchs = parseFloat(this.labelData.radius[0]) > 0
  },
  computed: {
    ...mapState(['setting'])
  },
  methods: {
    // 上传带图饼图背景
    uploadBackground (e) {
      let params = formParams(e, 'image')
      UPLOAD_IMG(params).then((response) => {
        if (response.err) return
        let url = this.setting.server + response.data.url
        this.graphic.elements[0].style.image = url
      })
      e.target.value = ''
    }
  }
}
</script>
<style scoped>
  .right{
    line-height: 100%;
  }
</style>
