// 直线配置
<template lang='pug'>
  .border-config
    ExpandList(title="线条配置")
      ControlItem(value="透明度")
        NumInput(v-model="curentLine.chartData.opacity", :step="1", :min="1", :max="10")
      ControlItem(value="粗细")
        NumInput(v-model="curentLine.chartData.weight", :min="1", :max="10")
      ControlItem(value="旋转角度")
        NumInput(v-model="curentLine.chartData.rotate", :min="-360", :max="360")
      ControlItem(value="线条样式")
        Selection(v-model="curentLine.chartData.lineUrl", :option="lineList")
</template>
<script>
import Utils from '@public/utils'
import chartdata from '@public/mixin/chartdata'
import { mapState } from 'vuex'
const { loadData } = Utils
export default {
  mixins: [chartdata],
  data () {
    return {
      lineList: [],
      curentLine: null
    }
  },
  created () {
    this.curentLine = this.position[this.index]
    this.getlineList()
  },
  computed: {
    ...mapState(['position', 'index', 'setting'])
  },
  methods: {
    selectBorder (item) {
      this.position[this.index].chartData = item 
    },
    getlineList () {
      loadData('./static/assets/staticSource/lines/line.config.json').then(result => {
        this.lineList = result.map((item, index) => {
          return {
            name: '线条' + (index + 1),
            value: item.lineUrl
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .img-list {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;
  }
  .img-box {
    display: flex;
    margin-top: 10px;
    width: 45%;
    height: 10px;
    cursor: pointer;
    .img {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
