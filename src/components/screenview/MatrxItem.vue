// 矩阵预览单位
<template lang="pug">
  .screen(:style="screenStyle")
    .datav-items
      .datav(v-for="(chartkey, ind) in chartAllOpt.layer",
        v-show="!chartAllOpt.position[chartkey].ishide",
        :style="getDatavSty(chartkey, ind)")
        ChartRender(:chartOpt="chartAllOpt.position[chartkey]")
</template>
<script>
import {
  GET_SCREEN_INFO,
  GET_CHART_DATA
} from '@api/visualscreen.js'
import Utils from '@public/utils'
import chartPublicMethod from '@public/chartPublicMethod'
export default {
  props: {
    styles: {
      type: Object,
      default () {
        return {}
      }
    },
    screenId: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      chartAllOpt: {},
      screenStyle: {}
    }
  },
  async created () {
    await this.getScreenInfo()
    await this.getChartData()
    this.getsty()
  },
  methods: {
    getsty () {
      let sty = {
        ...this.styles
      }
      let screen = this.chartAllOpt.screenOption
      if (screen && screen.bgtype !== 'color') {
        sty.backgroundImage = `url(${screen.background})`
        sty.backgroundSize = '100% 100%'
        sty.backgroundPosition = '0 0'
        sty.backgroundRepeat = 'no-repeat'
      } else {
        sty.backgroundColor = screen.background
      }
      this.screenStyle = sty
    },
    getDatavSty (chartkey, ind) {
      let position = this.chartAllOpt.position
      let layer = this.chartAllOpt.layer
      let sty = {
        width: position[chartkey].width + 'px',
        height: position[chartkey].height + 'px',
        left: position[chartkey].x + 'px',
        top: position[chartkey].y + 'px',
        zIndex: layer.length - 1 - ind
      }
      return sty
    },
    getScreenInfo () {
      return new Promise(resolve => {
        GET_SCREEN_INFO({id: this.screenId}).then(res => {
          if (res.err) return
          let {
            position,
            screenOption
          } = res.data
          for (let key in position) {
            let item = position[key]
            if (!Utils.isJsonString(item.tconfig)) return
            position[key] = JSON.parse(item.tconfig)
            position[key].tid = item.tid
            position[key].islock = !!item.islock
            position[key].ishide = !!item.ishide
            position[key].collection = !!item.collection
            // 如果有静态数据就加入tdata
            if (item.tdata && Utils.isJsonString(screenOption)) {
              position[key].dataOpt.tdata = JSON.parse(item.tdata)
            }
          }
          if (!Utils.isJsonString(screenOption)) return
          res.data.screenOption = JSON.parse(screenOption)
          res.data.position = position
          this.chartAllOpt = res.data
          resolve()
        })
      })
    },
    getChartData () {
      return new Promise(resolve => {
        GET_CHART_DATA({id: this.screenId}).then(res => {
          if (res.err) return
          let chartAllData = res.data
          let chartPositions = this.chartAllOpt.position
          // 所有数据和所有position
          this.mergeChart(chartAllData, chartPositions)
          resolve()
        })
      })
    },
    // 合并图表数据
    mergeChart(chartAllData, chartPositions) {
      for (let tname in chartPositions) {
        let topt = chartPositions[tname]
        let tdata = chartAllData[tname]
        chartPublicMethod.mergeChartConfigAndData(topt, tdata)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.screen {
  .datav-items {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .datav {
    position: absolute;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
    overflow: hidden;
  }
}
</style>
