// echarts 实例初始化组件
<template>
  <div class="echarts-render" :style="chartStyle"></div>
</template>
<script>
import echarts from 'echarts'
import 'echarts/map/js/china.js'
import 'echarts/map/js/world.js'
import { Lodash } from '@public/utils'
import { mapState } from 'vuex'
// echarts实例
export default {
  props: {
    value: null
  },
  data () {
    return {
      chartInstance: null,
      timer: null
    }
  },
  created () {
    if (this.value.charttype === 'gismap' && !window['isImportBmap']) {
      import('echarts/extension/bmap/bmap')
      window['isImportBmap'] = true
    }
  },
  computed: {
    chartStyle () {
      let { width, height } = this.value
      return {
        width: width + 'px',
        height: height + 'px'
      }
    },
    ...mapState({
      screen: state => state.screenOption
    })
  },
  mounted () {
    const value = this.value
    if (!value || !value.chartData) return
    // 注册echarts
    this.chartInstance = echarts.init(this.$el)
    // 绘制图表
    this.chartInstance.setOption(value.chartData, true)
    this.animateScreen()
    // 将chart对象暴露给父组件
    this.$emit('onInited', this.chartInstance)
  },
  methods: {
    reRender: Lodash.debounce(function (n, o) {
      // 组件刚刚没创建时value会发生修改，但是这时Echarts实例还没有生成
      if (!o || !n || !this.chartInstance) return
      // 判断传入的格式是否正确,如果不正确或者为空则销毁图表
      if (Lodash.isObject(n)) {
        this.chartInstance.setOption(this.value.chartData, true)
      } else {
        console.info('没有传入配置项或者配置项不正确!')
      }
    }, 1000),
    resize: Lodash.debounce(function (n, o) {
      // 避免不正常调用导致报错
      if (!n || !this.chartInstance) return
      let { width, height } = this.value
      // 如果高度配置发生改变，更改图表大小
      this.chartInstance.resize({ width, height })
    }, 1000),
    animateScreen () {
      // 关闭定时器
      if (this.timer) clearInterval(this.timer)
      let that = this
      if (this.screen.animate) {
        this.timer = setInterval(() => {
          that.chartInstance.clear()
          that.chartInstance.setOption(that.value.chartData, true)
        }, this.screen.animateTime)
      }
    }
  },
  watch: {
    'value.width': {
      handler (n, o) { this.resize(n, o) }
    },
    'value.height': {
      handler (n, o) { this.resize(n, o) }
    },
    'screen': {
      handler (n, o) {
        this.animateScreen() 
      },
      immediate: false,
      deep: true
    },
    // 对于某些情况下的数据改变即使使用了deep: true也无法监测到
    'value.chartData': {
      handler (n, o) { this.reRender(n, o) },
      deep: true
    }
  },
  beforeDestroy () {
    if (!this.chartInstance) return
    this.chartInstance.dispose()
    this.chartInstance = null
    // 关闭定时器
    if (!this.timer) return
    clearInterval(this.timer) 
  }
}
</script>
