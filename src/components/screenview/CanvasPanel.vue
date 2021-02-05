// 屏幕面板的组件
<template lang="pug">
  CanvasMain(ref="CanvasMain" :disableMove="disableMode", :screenStyle="screenStyle", :screenId="'canvas-screen-' + elementPropId")
    .chart-canvas
      //- 网格线
      GridLines(v-show="showGridLines")
      Deformation.datav-transform(
        :style="{'zIndex': layer.length - ind}"
        v-for="(chartkey, ind) in layer",
        v-show="!position[chartkey].ishide",
        :disable="chartProhibitDrag(chartkey)",
        :class="deformationClass(chartkey)",
        :w="position[chartkey].width",
        :h="position[chartkey].height",
        :x="position[chartkey].x",
        :y="position[chartkey].y",
        :showBorder="position[chartkey].showBorder"
        :resizable="position[chartkey].resizable",
        :inscreen="false",
        :zoom="screenOption.scale / 10",
        :key="chartkey",
        @resizing="onresizing($event, chartkey)",
        @activated="onactivated(chartkey)",
        @dragging="ondragging($event, chartkey)",
        @resizestop="onresizestop($event, chartkey)",
        @dragmenu="ondragmenu($event, chartkey)",
        @draghover="ondraghover(chartkey)",
        @dragleavel="ondragleavel",
        @dragstop="ondragstop($event, chartkey)")
        //- 坐标线
        CoodsLines(v-show="index === chartkey || indexList.includes(chartkey)", :coord="getCoodsLinesPosition(chartkey)")
        //- 图表没有交互
        .shelter(v-show="shelterKey === chartkey")
        //- 挂载图表
        ChartRender(:chartOpt="position[chartkey]")
</template>
<script>
// 大屏处理的核心
/* eslint-disable */
import { mapState } from 'vuex'
import echarts from 'echarts'
import Socket from '@public/socketHeartbeat'
import { Utils, Lodash } from '@public/utils'
import chartPublicMethod from '@public/chartPublicMethod'
import PollSource from '@public/pollSource.js'
import { GET_SCREEN_INFO, GET_CHART_DATA } from '@api/visualscreen.js'
import hotkeys from 'hotkeys-js'
const $ = window.$
const { unid, deBase64, enBase64, isJsonString, loadData } = Utils
let ChartOffset = { x: 0, y: 0 }
const hotkeyMapLess = {
  'left': () => { ChartOffset.x -- },
  'right': () => { ChartOffset.x ++ },
  'up': () => { ChartOffset.y -- },
  'down': () => { ChartOffset.y ++ },
  'shift+left': () => { ChartOffset.x -= 10 },
  'shift+right': () => { ChartOffset.x += 10 },
  'shift+up': () => { ChartOffset.y -= 10 },
  'shift+down': () => { ChartOffset.y += 10 }
}
const hotkeyMapRegister = {
  // 删除
  'delete': 'del',
  'backspace': 'del',
  // 置顶
  'ctrl+up': 'top',
  'shift+command+up': 'top',
  // 置底
  'ctrl+down': 'end',
  'shift+command+down': 'end',
  // 上移一层
  'ctrl+up': 'up',
  'command+up': 'up',
  // 下移一层
  'ctrl+down': 'down',
  'command+down': 'down',
  // 复制
  'ctrl+c': 'copy',
  'command+c': 'copy',
  // 锁定/解锁
  'ctrl+;': 'islock',
  'command+;': 'islock',
  // 显示/隐藏
  'ctrl+b': 'isdisplay',
  'command+b': 'isdisplay',
  // 收藏
  'ctrl+m': 'collect',
  'command+m': 'collect'
}
export default {
  props: {
    // 大屏类型 
    // screen 大屏 preview 预览 share 发布
    screenCategory: {
      type: String,
      default: 'screen'
    },
    // 大屏id
    screenId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      // 遮蔽的图层图表键
      shelterKey: '',
      // 显示坐标网格
      showGridLines: false,
      // 轮询列表
      PollSourceList: [],
      // 数据类型 使用那个接口请求数据
      requestSourceType: 'screen',
      // 鼠标悬浮在哪个图表上
      chartHoveId: '',
      // 大屏id
      sid: '',
      // websocket的实例
      websocket: null,
      // 是不是在看发布
      sharetype: unid('S'),
      // 选中的图表数组
      selIndexList: [],
      // 多选状态
      multSelected: false
    }
  },
  created() {
    const { name, params } = this.$route
    if (name === 'screenediting' && typeof params.type !== undefined) {
      this.requestSourceType = params.type
      this.sid = deBase64(params.id)
    } else {
      this.requestSourceType = this.screenCategory
      this.sid = this.screenId
    }
    if (!this.requestSourceType || !this.sid) {
      return this.$toasting({
        title: '错误',
        type: 'error',
        message: '该大屏加载失败'
      })
    }
    // 获取大屏数据
    this.getScreenInfo()
  },
  mounted () {
    this.$nextTick(() => {
      // 注册热键
      this.registerHotKey()
      // 键盘微调
      this.lessChangePosition()
      // 多选热键
      this.selctDeformations()
    })
  },
  computed: {
    ...mapState(['screenOption', 'position', 'index', 'layer', 'indexList', 'setting']),
    chartOpt () {
      return this.position[this.index]
    },
    // dom元素上的id属性
    elementPropId() {
      return enBase64(this.sid)
    },
    // 禁用图表编辑的模式
    disableMode() {
      // 大屏编辑：screen 大屏预览模式： preview 大屏的发布模式：share
      return ['preview', 'share'].includes(this.requestSourceType)
    },
    // 屏幕样式
    screenStyle() {
      const { scale, width, height, bgtype, background  } = this.screenOption
      let sty = {
        transform: `scale(${scale / 10})`,
        transformOrigin: `left top`,
        width: width + 'px',
        height: height + 'px'
      }
      switch (bgtype) {
        case 'color':
          sty.backgroundColor = background[bgtype]
          break
        case 'image':
          sty.backgroundImage = `url(${background[bgtype]})`
          sty.backgroundSize = background.backgroundSize
          sty.backgroundPosition = '0 0'
          sty.backgroundRepeat = 'no-repeat'
          break
      }
      return sty
    }
  },
  watch: {
    indexList: {
      handler (n, o) {
        if (!n) return
        if (n.length === 1) {
          this.$store.dispatch('SET_CHART_INDEX', n[0])
          this.selIndexList = []
          this.$store.dispatch('SET_CHART_INDEX_LIST', this.selIndexList)
        } else {
          this.selIndexList = n
        }
      },
      deep: true,
      immediate: false
    },
    chartOpt: {
      handler (n, o) {
        if (!n) return
        this.watchChartOpt(this.chartOpt.key, this.chartOpt)
        console.log('图表配置变化')
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    watchChartOpt: Lodash.debounce(function (key = null, options) {
      chartPublicMethod.updateChartOpt(key || this.index, options)
    }, 600, {leading: false}),
    // 注册热键
    registerHotKey () {
      let keys = Object.keys(hotkeyMapRegister).join(',')
      hotkeys(keys, {element: this.$el, scope: 'canvas'}, (evn, callback) => {
        evn.preventDefault()
        const type = hotkeyMapRegister[callback.key]
        this.hotkeyHandler(evn, callback, type)
      })
      hotkeys.setScope('canvas')
    },
    // 微调位置
    lessChangePosition () {
      let keys = Object.keys(hotkeyMapLess).join(',')
      hotkeys(keys, {keyup: true, element: this.$el, scope: 'canvas'}, (evn, handler) => {
        evn.preventDefault()
        if (!this.index) return
        let currentChart = this.position[this.index]
        if (evn.type === 'keydown') {
          hotkeyMapLess[handler.key]()
          let option = {
            key: currentChart.key,
            x: currentChart.x + ChartOffset.x,
            y: currentChart.y + ChartOffset.y
          }
          this.$store.dispatch('UPDATE_POSITION', option)
        }
        if (evn.type === 'keyup') {
          ChartOffset = { x: 0, y: 0 }
        }
      })
      hotkeys.setScope('canvas')
    },
    // 图表多选热键
    selctDeformations () {
      if (this.disableMode || this.screenOption.prohibitDrag) return
      hotkeys('*', {keyup: true, element: this.$el, scope: 'canvas'}, (evn, handler) => {
        evn.preventDefault()
        if(hotkeys.ctrl) {
          if (evn.type === 'keydown') {
            this.multSelected = true
          }
          if (evn.type === 'keyup') {
            this.multSelected = false
          }
        }
      })
      hotkeys.setScope('canvas')
    },
    // 拖放组件的className
    deformationClass (chartkey) {
      return {
        'selected': chartkey === this.index || this.indexList.includes(chartkey),
        'hover-chart': this.chartHoveId === chartkey || this.indexList.includes(chartkey),
        'show-border': this.position[chartkey].showBorder || this.indexList.includes(chartkey)
      }
    },
    // 热键执行函数
    hotkeyHandler (evn, callback, type) {
      if (this.disableMode || this.screenOption.prohibitDrag || !this.index) return
      if (evn.type === 'keydown') {
        this.$eventBus.$emit('CHART_TEXT_MENU', {
          optType: type,
          chartKey: this.index
        })
      }
    },
    // 关闭轮询
    closePollSource () {
      for (let index = 0; index < this.PollSourceList.length; index++) {
        let Poll = this.PollSourceList[index]
        Poll.close()
        console.log('关闭轮询：' + Poll.name)
      }
    },
    // 开启轮询
    setPollSource (func, time = 5000, name = unid('poll')) {
      let Poll = PollSource(func, time)
      Poll.name = name
      this.PollSourceList.push(Pollps)
      console.log('开启轮询:' + Poll.name)
    },
    // 组件浮层,有没有交互
    shelter(chartkey) {
      if (this.disableMode || this.screenOption.prohibitDrag || this.position[chartkey].islock) return false
      return true
    },
    // 是否禁用选中
    chartProhibitDrag(chartkey) {
      return this.disableMode || this.screenOption.prohibitDrag || this.position[chartkey].islock
    },
    // 将后端请求的数据进行合并到图表中
    chartOptionMerge(result) {
      if (result.err) return
      let allChartPositon = result.data
      // 复制一份不影响原来的
      let cloneDeepPosition = Lodash.cloneDeep(this.position)
      let chartList = {}
      for (let key in allChartPositon) {
        if (allChartPositon.hasOwnProperty(key)) {
          chartList[key] = cloneDeepPosition[key]
        }
      }
      // 是不会空对象
      if (Lodash.isEmpty(chartList)) return
      for (const tname in chartList) {
        if (chartList.hasOwnProperty(tname)) {
          let chartOpt = chartList[tname]
          let chartData = allChartPositon[tname]
          chartPublicMethod.mergeChartConfigAndData(chartOpt, chartData)
          this.$store.dispatch('UPDATE_POSITION', chartList[tname])
        }
      }
    },
    // 实时刷新数据
    clockRequest() {
      const { realData } = this.setting
      // 只有在禁用图表编辑的模式下才开启
      // 如果没有图表不开启
      if (!this.layer.length || !this.disableMode) return
      const autoUpdate = this.layer.some(tname => {
        let dataOpt = this.position[tname].dataOpt
        return dataOpt && dataOpt.autoUpdate
      })
      // 没有任何开启自动跟新的图表 不开启
      if (!autoUpdate) return
      // 实时数据类型
      // 1.websocket连接
      if (realData.type === 'websocket') {
        if (this.websocket) return
        const socketInstance = new Socket({
          options: { url: realData.url },
          callback: (result) => {
            if (!result) return
            if (result === 'SUCCESS CALLBACK') {
              this.websocket = socketInstance
              this.websocket.send({ sid: this.sid })
            } else {
              if (!isJsonString(result)) return
              console.log('socket update:', result)
              this.chartOptionMerge(JSON.parse(result))
            }
          }
        })
      }
      // 2.http请求
      if (realData.type === 'http') {
        const runtime = realData.runtime
        let time = runtime && runtime > 3000 ? 3000 : runtime
        this.setPollSource(() => {
          let mergeChart = (result) => {
            if (result.err) return
            let chartAllData = result.data
            for (let key in this.position) {
              if (chartList.hasOwnProperty(key)) {
                let topt = this.position[key]
                let tdata = chartAllData[key]
                chartPublicMethod.mergeChartConfigAndData(topt, tdata)
              }
            }
          }
          if (!realData.url) {
            this.getAllChartData().then(result => { mergeChart(result) })
          } else {
            loadData(realData.url).then(result => { mergeChart(result) })
          }
        }, time, '轮询图表数据')
      }
    },
    // 坐标位置数据
    getCoodsLinesPosition(chartkey) {
      return {
        x: this.position[chartkey].x,
        y: this.position[chartkey].y
      }
    },
    // 获取所有图表的数据
    getAllChartData() {
      let params = {id: this.sid}
      // 查看发布的时候
      if (this.screenCategory === 'share') {
        params.sharetype = this.sharetype
      }
      return new Promise(resolve => {
        // 本地部署
        let SCREEN_DATA = null
        if (this.setting.localDeploy) {
          let path = '/index/screen/getAllChart'.toLowerCase().replace(/\//g, '_')
          let url = `./static/data/${path}_${params.id}.json`
          SCREEN_DATA = loadData(url)
        } else {
          SCREEN_DATA = GET_CHART_DATA(params)
        }
        SCREEN_DATA.then(result => {
          resolve(result)
        })
      })
    },
    // 根据id向服务器请求屏幕配置
    // 大屏编辑：screen 大屏预览模式： preview 大屏的发布模式：share
    getScreenInfo() {
      let params = {id: this.sid}
      // 查看发布的时候
      if (this.screenCategory === 'share') {
        params.sharetype = this.sharetype
      }
      let SCREEN_DATA = null
      // 本地部署
      if (this.setting.localDeploy) {
        let path = '/index/index/getScreenInfo'.toLowerCase().replace(/\//g, '_')
        let url = `./static/data/${path}_${params.id}.json`
        SCREEN_DATA = loadData(url)
      } else {
        SCREEN_DATA = GET_SCREEN_INFO(params)
      }
      // 请求数据 根据id向服务器请求屏幕配置
      SCREEN_DATA.then((result) => {
        if (result.err) return
        let chartAllOpt = result.data
        // 没有使用模板就使用默认的大屏配置
        if (!chartAllOpt.screenOption) {
          chartAllOpt.screenOption = Lodash.cloneDeep(this.screenOption)
        }
        // 将操作置于操作队尾，以解决依赖没有加载完全的问题 将获取到的数据放入vuex 计算屏幕位置
        this.getAllChartData().then(result => {
          if (result.err) return
          const chartAllData = result.data
          // 合并所有图表
          this.mergeAllChart(chartAllData, chartAllOpt)
        })
      })
    },
    // 合并图表
    mergeAllChart(chartAllData, chartAllOpt) {
      if (!chartAllOpt) return
      const { position, screenOption, layer } = chartAllOpt
      this.$store.dispatch('SET_SCREEN_OPTION', screenOption)
      for (const tname of layer.reverse()) {
        if (position.hasOwnProperty(tname)) {
          let toption = position[tname]
          let tdata = chartAllData[tname]
          chartPublicMethod.mergeChartConfigAndData(toption, tdata)
          this.$store.dispatch('PUSH_POSITION', position[tname])
        }
      }
      // 如果没有加载完数据就是不合并数据
      window.setTimeout(() => {
        this.$emit('onLoad')
        this.$nextTick(() => {
          this.$store.dispatch('SET_SCREEN_OPTION', {
            scale: this.calcScreenScale(this.screenOption)
          })
        })
      }, 600)
      // 注册屏幕变化
      this.registeredScreenChange()
      // 定时请求模块,屏幕编辑状态不会创建连接,屏幕中没有图表不会创建连接,没有自动刷新的图表不会创建连接,只有在发布和预览模式才会启动自动定时刷新
      if (!this.websocket) this.clockRequest()
    },
    // 注册屏幕变化
    registeredScreenChange() {
      window.requestAnimationFrame(() => {
        // 监听屏幕大小改变事件
        this.$eventBus.$on('CHANGE_SCREEN_SCALE', () => { this.$emit('onScale') })
        this.$emit('onScale')
        // 视口改变,屏幕大小改变
        $(window).on('resize', Lodash.debounce(() => {
          this.$store.dispatch('SET_SCREEN_OPTION', {
            scale: this.calcScreenScale(this.screenOption)
          })
        }, 2000, { leading: false }))
      })
    },
    // 鼠标悬浮
    ondraghover(chartHoveId) {
      if (this.disableMode) return
      this.chartHoveId = chartHoveId
    },
    // 鼠标离开
    ondragleavel() {
      this.chartHoveId = ''
    },
    // 组件停止改变大小事件
    onresizestop(info, key) {
      this.showGridLines = false
      const params = {
        key,
        x: info[0],
        y: info[1],
        width: info[2],
        height: info[3]
      }
      // 将数据改为对应大小
      this.$store.dispatch('UPDATE_POSITION', params)
      let opt = {
        x: this.chartOpt.x,
        y: this.chartOpt.y,
        width: this.chartOpt.width,
        height: this.chartOpt.height,
        tid: this.chartOpt.tid
      }
      console.log('组件改变大小')
      this.watchChartOpt(key, opt)
    },
    // 组件被激活事件
    onactivated(chartkey) {
      // 非ctrl多选
      if (!this.multSelected) {
        let total = 0
        if (this.selIndexList.length === 0) {
          this.$store.dispatch('SET_CHART_INDEX', chartkey)
          return
        }
        this.selIndexList.map((item, index) => {
          if(item !== chartkey) {
            total = total + 1
          }
        })
        if (total === this.selIndexList.length) {
          this.selIndexList = []
          this.$store.dispatch('SET_CHART_INDEX_LIST', this.selIndexList)
          this.$store.dispatch('SET_CHART_INDEX', chartkey)
        }
      } else {
        // 多选列表为空
        if (this.selIndexList.length == 0) {
          this.selIndexList = []
          this.$store.dispatch('SET_CHART_INDEX_LIST', this.selIndexList)
          this.$store.dispatch('SET_CHART_INDEX', chartkey)
        } else {
          // 多选列表非空,判断 添加还是取消
          let count = 0
          this.selIndexList.map((item, index) => {
            if(item === chartkey) {
              this.selIndexList.splice(index, 1)
            } else {
              count = count + 1
            }
          })
          if (count === this.selIndexList.length) this.selIndexList.push(chartkey)
          this.$store.dispatch('SET_CHART_INDEX_LIST', this.selIndexList)
          this.multSelected = false
        }
      }
    },
    // 组件结束拖动事件
    ondragstop(coordinate, key) {
      this.showGridLines = false
      this.shelterKey = ''
      let coordShortX = coordinate[0] - this.position[key].x
      let coordShortY = coordinate[1] - this.position[key].y
      if (this.indexList.length !== 0) {
        this.indexList.map(item => {
          key = item
          const params = {
            key,
            x: this.position[item].x + coordShortX,
            y: this.position[item].y + coordShortY
          }
          this.$store.dispatch('UPDATE_POSITION', params)
          let mulChartOpt = Lodash.cloneDeep(this.position[item])
          let opt = {
            x: mulChartOpt.x,
            y: mulChartOpt.y,
            width: mulChartOpt.width,
            height: mulChartOpt.height,
            tid: mulChartOpt.tid
          }
          console.log('组件拖动位置')
          this.watchChartOpt(item, opt)
        })
      } else {
        const params = {
          key,
          x: coordinate[0],
          y: coordinate[1]
        }
        this.$store.dispatch('UPDATE_POSITION', params)
        let opt = {
          x: this.chartOpt.x,
          y: this.chartOpt.y,
          width: this.chartOpt.width,
          height: this.chartOpt.height,
          tid: this.chartOpt.tid
        }
        console.log('组件拖动位置')
        this.watchChartOpt(key, opt)
      }
    },
    // 组件正在拖动事件
    ondragging(coordinate, key) {
      this.showGridLines = true
      this.shelterKey = key
      let coordShortX = coordinate[0] - this.position[key].x
      let coordShortY = coordinate[1] - this.position[key].y
      if (this.indexList.length !== 0) {
        this.indexList.map(item => {
          key = item
          let option = {
            key,
            x: this.position[item].x + coordShortX,
            y: this.position[item].y + coordShortY
          }
          this.$store.dispatch('UPDATE_POSITION', option)
        })
      } else {
        this.$store.dispatch('UPDATE_POSITION', {
          key,
          x: coordinate[0],
          y: coordinate[1]
        })
      }
    },
    // 大小变化中
    onresizing(info, key) {
      this.showGridLines = true
      // 将数据改为对应大小
      this.$store.dispatch('UPDATE_POSITION', {
        key,
        x: info[0],
        y: info[1],
        width: info[2],
        height: info[3]
      })
    },
    // 右键事件
    ondragmenu(coods, chartKey) {
      // 如果是禁用的模式就取消右键功能
      if (this.disableMode) return
      if (this.position[chartKey].islock) return
      this.$eventBus.$emit('CHART_TEXT_MENU', {
        coods,
        chartKey
      })
    },
    // 取消激活组件
    clearIndex() {
      this.$store.dispatch('SET_CHART_INDEX', null)
    },
    // 计算缩放比例
    calcScreenScale(screenOption = this.screenOption) {
      if (!screenOption || !$('#canvas-panel-wrap')[0]) return 10
      this.$refs.CanvasMain.canvasPosition = {}
      const offset = $(this.$el)[0].offsetLeft * 2
      let width = $('#canvas-panel-wrap').width() - offset
      return (width / screenOption.width) * 10
    }
  },
  beforeDestroy() {
    hotkeys.unbind('*', 'canvas')
    let keysMap = [...Object.keys(hotkeyMapLess), ...Object.keys(hotkeyMapRegister)]
    for (const key in keysMap) {
      if (keysMap.hasOwnProperty(key)) {
        hotkeys.unbind(key, 'canvas')
      }
    }
    this.closePollSource()
    $(window).off('resize')
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
  }
}
</script>
<style lang="less" scoped>
.hover-chart {
  background: rgba(12,202,235,0.08);
  border: 1px solid #0CCAEB;
}
.canvas-panel {
  position: absolute;
  left: 60px;
  top: 60px;
  box-shadow: rgba(0,0,0,.5) 0 0 5px 0;
}
.chart-canvas {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.datav-transform.selected {
  border: 1px solid #0CCAEB;
  background: rgba(150, 150, 150, 0.3);
  z-index: 9999!important;
  /deep/ .handler {
    display: block;
  }
}
.shelter {
  z-index: 9;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: move!important;
}
</style>
