<template lang="pug">
  .colund(:id="colundID" :style="stylesOwn")
</template>
<script>
/* eslint-disable */
import { loader } from 'vue-m-loader'
import { Utils as T, Lodash as _ } from '@public/utils'
/* eslint-enable */
import { mapState } from 'vuex'
const LazyLoad = window.LazyLoad
export default {
  data() {
    return {
      colundID: 'colund_' + T.unid(),
      // 示例
      chart: null
    }
  },
  props: ['value'],
  mounted () {
    this.$nextTick().then(() => {
      this.classRender()
    })
  },
  watch: {
    'value.width': {
      handler (a, b) {
        if (a === b) return
        this.updateChart()
      },
      deep: true
    },
    'value.height': {
      handler (a, b) {
        if (a === b) return
        this.updateChart()
      },
      deep: true
    },
    'value.chartData.useData': {
      handler (a, b) {
        this.updateChart()
      },
      deep: true
    },
    'value.chartData.moduleParam': {
      handler (a, b) {
        this.updateChart()
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['setting']),
    // 本身元素样式
    stylesOwn () {
      const { width, height } = this.value
      return {
        width: width + 'px',
        height: height + 'px'
      }
    }
  },
  methods: {
    // 外部私有资源
    loadSrc (callback) {
      const { chartData } = this.value
      const { pluginPath, moduleClassRouter, cssImport, javascriptImport } = chartData
      const { server } = this.setting
      const base = server + pluginPath + '/'
      let cssList = []
      let jsList = []
      // 加载css
      if (Array.isArray(cssImport)) {
        cssList = cssImport.src.map(v => base + v)
      } else {
        if (cssImport) {
          cssList.push(base + cssImport)
        }
      }
      if (cssList.length > 0) LazyLoad.css(cssList)

      // 加载js
      if (Array.isArray(javascriptImport)) {
        jsList = javascriptImport.map(v => base + v)
      } else {
        if (jsList) {
          jsList.push(base + javascriptImport)
        }
      }
      if (jsList.length > 0) {
        LazyLoad.js(jsList, () => {
          LazyLoad.js(base + moduleClassRouter, () => {
            callback && callback()
          })
        })
      } else {
        LazyLoad.js(base + moduleClassRouter, () => {
          callback && callback()
        })
      }
    },
    // 渲染组件
    classRender () {
      this.loadSrc(() => {
        // 渲染组件
        this.$nextTick().then(() => {
          const { moduleMethodName, moduleParam, useData } = this.value.chartData
          this.chart = new window[moduleMethodName]({ el: this.colundID, params: moduleParam, dataset: useData })
          this.chart.init()
        })
      })
    },
    // 修改
    updateChart: _.debounce(function (n, o) {
      if (!this.chart) return
      const { moduleMethodName, moduleParam, useData } = this.value.chartData
      this.chart.update({ el: this.colundID, params: moduleParam, dataset: useData })
    }, 1000)
  },
  beforeDestroy () {
    this.chart && this.chart.destroy()
  }
}
</script>
<style lang="less" scoped>
  .colund {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
