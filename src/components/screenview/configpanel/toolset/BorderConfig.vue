// 边框配置
<template lang="pug">
  .border-config
    Modal.tool-box(:show="showBorderList", :showFooter="false",  @close="showBorderList = false" text="边框列表")
      .img-list
        .img-box(v-for="(item, index) in borderList", @click="selectBorder(item)", :key="index")
          img.img(:src="'./static/assets/img/borders/' + item.src")
    ExpandList(title="基础配置")
      .control-entry
        .border-image
          img.images(:src="chartData.borderUrl" @click="showBorderList = true")
      ControlItem(value="不透明度(%)")
        NumInput(v-model="chartData.opacity", :step="1", :min="1", :max="100")
      ControlItem(value="描边方式")
        Selection(v-model="chartData.borderStretch" :option="bordertypes")
    ExpandList(title="描边大小")
      ControlItem(value="上")
        NumInput(v-model="chartData.borderWidth[0]", :step="1", :min="1", :max="100")
      ControlItem(value="右")
        NumInput(v-model="chartData.borderWidth[1]", :step="1", :min="1", :max="100")
      ControlItem(value="下")
        NumInput(v-model="chartData.borderWidth[2]", :step="1", :min="1", :max="100")
      ControlItem(value="左")
        NumInput(v-model="chartData.borderWidth[3]", :step="1", :min="1", :max="100")
</template>
<script>
import Utils from '@public/utils'
import { mapState } from 'vuex'
import chartdata from '@public/mixin/chartdata'
import borders from '@assets/json/borders.json'
const { loadData } = Utils
export default {
  mixins: [chartdata],
  data () {
    return {
      borderList: [],
      showBorderList: false,
      bordertypes: [{
        name: '中间镂空',
        value: 'stretch'
      },
      {
        name: '填充内容',
        value: 'fill'
      }]
    }
  },
  created () {
    this.borderList = borders.map(item => {
      item.opacity = 100
      return item
    })
  },
  computed: {
    ...mapState(['position', 'index', 'setting'])
  },
  watch: {
    chartData (n, o) {
      if (!n) return
      this.position[this.index].chartData = this.chartData
    }
  },
  methods: {
    selectBorder (item) {
      this.showBorderList = false
      let bItem = {
        borderUrl: './static/assets/img/borders/' + item.src,
        opacity: item.opacity,
        borderWidth: item.borderWidth,
        borderStretch: 'fill'
      }
      this.chartData = bItem
    }
  }
}
</script>
<style lang="less" scoped>
  .border-image {
    width: 100%;
    height: 200px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .images {
      width: 100%;
      height: 100%;
      object-fit: contain;
      cursor: pointer;
    }
  }
  .img-list {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .img-box .img {
      cursor: pointer;
      margin: 10px;
      height: 150px;
      width: 150px;
      max-height: 150px;
      max-width: 150px;
      object-fit: contain;
    }
  }
</style>
