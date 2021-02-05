// 左侧图层
<template lang="pug">
  #layer-panel-wp
    .layer-manager
      //- 左侧栏标题
      .layer-panel-head
        .name 图层
        .change-icons
          .icon.item(:class="{'active': type === 'tile'}", @click="type = 'tile'") &#xe601;
          .icon.item(:class="{'active': type === 'thumbnail'}", @click="type = 'thumbnail'") &#xe602;
      .layer-panel-options
        .icon.item(@click="changeLayer('up')") &#xe674;
        .icon.item(@click="changeLayer('down')") &#xe671;
        .icon.item(@click="changeLayer('top')") &#xe673;
        .icon.item(@click="changeLayer('end')") &#xe676;
      //- 如果处于锁定布局模式就只简单显示列表
      .layer-panel-mian(v-if="screen.prohibitDrag", :class="type")
        .layer-item(v-for="(item,lindex) in layerList", :key="item.chartIndex", oncontextmenu="javascript: return false;")
          img.layer-item-icon.thumbimg(v-if="type === 'thumbnail'", :src="getST(item)")
          .layer-item-icon.icon(v-else, v-html="iconlist[position[item.chartIndex].charttype]")
          .layer-item-name {{position[item.chartIndex].name}}
          //- 判断图层是否被锁定
          .islock.icon(v-if="position[item.chartIndex].islock") &#xe641;
          //- 判断图层是否隐藏
          .ishide.icon(v-if="position[item.chartIndex].ishide") &#xe6d5;
      //- 如果没有被锁定则允许拖拽，允许点击选中
      .layer-panel-mian(v-else, :class="type")
        .layer-item(v-dragging="{ item:item, list:layerList, group:'layer', comb: item.comb}", :key="item.chartIndex", v-for="(item,lindex) in layerList", :class="{ active: (chartIndex === item.chartIndex || indexList.includes(item.chartIndex)) }",
          @contextmenu.stop="dragMenu($event, item.chartIndex)",
          @click.stop="selectLayer(item.chartIndex)")
          img.layer-item-icon.thumbimg(v-if="type === 'thumbnail'", :src="getST(item)")
          .layer-item-icon.icon(v-else, v-html="iconlist[position[item.chartIndex].charttype]")
          .layer-item-name {{position[item.chartIndex].name}}
          //- 判断图层是否被锁定
          .islock.icon(v-if="position[item.chartIndex].islock") &#xe641;
          //- 判断图层是否隐藏
          .ishide.icon(v-if="position[item.chartIndex].ishide") &#xe6d5;
</template>
<script>
import { mapState } from 'vuex'
import { SWAP_CHART } from '@api/visualscreen.js'
import chartRender from '@assets/json/chartRender'
import hotkeys from 'hotkeys-js'
export default {
  data () {
    return {
      // 平铺 缩略图 thumbnail
      type: 'thumbnail',
      // 图层列表
      layerList: [],
      multSelected: '',
      minIndex: null,
      maxIndex: null,
      // 选中的图表下标数组
      selIndexList: []
    }
  },
  mounted () {
    // 正在拖动
    this.$dragging.$on('dragged', ({value}) => {})
    // 拖动完毕
    this.$dragging.$on('dragend', () => {
      let newlayer = this.layerList.map(item => { return item.chartIndex })
      this.$store.dispatch('SET_CONFIG', {layer: newlayer})
      this.changeLayer('all')
    })
    this.registerHotkey()
  },
  computed: {
    ...mapState({
      position: state => state.position,
      screen: state => state.screenOption,
      indexList: state => state.indexList,
      chartIndex: state => state.index,
      layer: state => state.layer,
      setting: state => state.setting
    }),
    iconlist () {
      let obj = {}
      for (let index = 0; index < chartRender.length; index++) {
        const item = chartRender[index]
        obj[item.ctype] = item.icon
      }
      return obj
    }
  },
  methods: {
    // 获取缩略图
    getST (item) {
      const data = this.position[item.chartIndex]
      const { server } = this.setting
      const { pluginPath, modulePicture } = data.chartData
      if (data.charttype === 'cloudComponent') {
        return server + pluginPath + '/' + modulePicture
      }
      return './static/assets/thumbnails/' + data.comkey + '.png'
    },
    registerHotkey () {
      if (this.screen.prohibitDrag) return
      hotkeys('*', {keyup: true, element: this.$el, scope: 'canvas'}, (evn, handler) => {
        evn.preventDefault()
        if (hotkeys.shift) {
          switch (evn.type) {
            case 'keydown':
              this.multSelected = 'group'
              break
            case 'keyup':
              this.multSelected = ''
              break
          }
        }
        if (hotkeys.ctrl) {
          switch (evn.type) {
            case 'keydown':
              this.multSelected = 'one'
              break
            case 'keyup':
              this.multSelected = ''
              break
          }
        }
      })
      hotkeys.setScope('canvas')
    },
    // shift 多选
    shiftSelect () {
      if (!(this.minIndex || this.maxIndex)) return
      let subs = this.getMultChart()
      if (this.selIndexList.length !== 0) this.selIndexList = []
      for (let i= subs[0]; i<= subs[1]; i++) {
        this.selIndexList.push(this.layerList[i].chartIndex)
      }
      this.multSelected = ''
      this.$store.dispatch('SET_CHART_INDEX_LIST', this.selIndexList)
    },
    // ctrl 多选
    ctrlSelect (item) {
      if (!(this.minIndex || this.maxIndex)) return
      let subs = this.getMultChart()
      // 第一次多选但非第一次点击  
      if (this.selIndexList.length === 0 && subs[0]) {
        this.selIndexList.push(this.layerList[subs[0]].chartIndex)
        this.selIndexList.push(item)
        // 第一次 以ctrl 组合键点击
      } else if (this.selIndexList.length === 0 && !subs[0]) {
        this.selIndexList.push(this.chartIndex)
        this.selIndexList.push(item)
        // 非第一次多选和点击
      } else {
        let count = 0
        for (let index = 0; index < this.selIndexList.length; index++) {
          if (this.selIndexList[index].chartIndex === item) {
            this.selIndexList.splice(index, 1)
            // console.log(this.selIndexList)
          } else {
            count = count + 1
          }
        }
        if (count === this.selIndexList.length) this.selIndexList.push(this.layerList[subs[1]].chartIndex)
      }
      this.multSelected = ''
      this.$store.dispatch('SET_CHART_INDEX_LIST', this.selIndexList)
    },
    // 获取多选中的 表名称
    getMultChart () {
      let that = this
      let minKey, maxKey
      this.layerList.map((item, index) => {
        if (that.layerList[index].chartIndex === that.minIndex) {
          minKey = index
        } else if (that.layerList[index].chartIndex === that.maxIndex) {
          maxKey = index
        }
        if (maxKey < minKey) {
          let tmp = maxKey
          maxKey = minKey
          minKey = tmp 
        }
      })
      return [minKey, maxKey]
    },
    changeLayer (type) {
      let params = { operating: type }
      if (type === 'all') params.layerlist = this.layer
      else {
        if (!this.chartIndex) return
        params.tid = this.position[this.chartIndex].tid
      }
      this.$store.dispatch('SET_CHART_LOADING', true)
      SWAP_CHART(params).then(res => {
        if (res.err) return
        // 修改的参数
        let posobj = { layer: res.data }
        if (this.chartIndex) posobj.index = this.chartIndex
        this.$store.dispatch('SET_CONFIG', posobj)
        this.$store.dispatch('SET_CHART_LOADING', false)
        this.$toasting({
          title: '提示',
          type: 'success',
          message: '修改成功'
        })
      })
    },
    // 右键菜单
    dragMenu (e, chartKey) {
      e.preventDefault()
      let coods = [e.pageX, e.pageY]
      this.$eventBus.$emit('CHART_TEXT_MENU', {coods, chartKey})
    },
    // 禁用事件
    disableEvent (e) {
      e.preventDefault()
      return false
    },
    // 选中组件
    selectLayer (item) {
      if (!this.multSelected) {
        this.selIndexList = []
        this.$store.dispatch('SET_CHART_INDEX_LIST', this.selIndexList)
        // 高亮指定组件
        this.$store.dispatch('SET_CHART_INDEX', item)
      } else if (this.multSelected === 'one') {
        this.minIndex = this.chartIndex
        this.maxIndex = item
        this.ctrlSelect(item)
      } else if (this.multSelected === 'group') {
        this.minIndex = this.chartIndex
        this.maxIndex = item
        this.shiftSelect()
      }
      return false
    },
    // 删除组件
    removeLayer (key) {
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        this.$store.dispatch('REMOVE_POSITION', key)
      })
    }
  },
  watch: {
    layer: {
      handler (n, o) {
        // 可以多选拖动
        this.layerList = this.layer.map((chartIndex) => {
          return { 
            chartIndex,
            comb: 'layer'
          }
        })
      },
      deep: true
    }
  },
  beforeDestroy() {
    hotkeys.unbind('*', 'canvas')
  }
}
</script>

<style lang="less" scoped>
  #layer-panel-wp {
    position: relative;
    height: 100%;
    width: 160px;
    background:rgba(27,31,36,.2);
    position: relative;
    transition: all .6s;
    flex: none;
    display: flex;
    flex-direction: column;
    transition: width .3s ease;
    z-index: 5;
    overflow: hidden;
    &.--hide {
      width: 0;
      .layer-manager {
        transform: translateX(-100%);
      }
    } 
    .layer-manager {
      display: flex;
      flex-direction: column;
      width: 160px;
      height: 100%;
      overflow-y: scroll;
      flex: auto;
      z-index: 9;
      transition: .3s ease;
    }
    .layer-panel-options {
      padding: 0 10px;
      height: 30px;
      border-bottom: 1px solid rgba(255, 255, 255, .1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item {
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
        font-size: 12px;
        color: #ffffff;
        background: rgba(0,0,0,0);
        &:hover, &.active, &.selected {
          background: #1890FF;
          border-color:#8CCAF6;
        }
      }
    }
    .layer-panel-head {
      padding: 0 10px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        font-size: 16px;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
      }
      .change-icons {
        display: flex;
        align-items: center;
        .item {
          cursor: pointer;
          font-size: 12px;
          color: rgba(255, 255, 255, .6);
          margin-left: 10px;
          &:hover, &.active {
            color: #4D8FCC;
          }
        }
      }
    }
  }
  .layer-panel-mian {
    width: 100%;
    height: calc(100% - 72px);
    overflow: auto;
    .layer-item {
      padding: 0 10px;
      display: flex;
      align-items: center;
      position: relative;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      background: rgba(0,0,0,0);
      cursor: pointer;
      &:last-child {
        border-bottom: 0;
      }
      &:hover {
        background:linear-gradient(90deg,rgba(24,144,255,1) 0%,rgba(24,144,255,0) 100%);
      }
      &.active {
        background:linear-gradient(90deg,rgba(24,144,255,1) 0%,rgba(24,144,255,0) 100%);
      }
      .icon {
        width: 12px;
        height: 12px;
        color:rgba(255, 255, 255, .8);
        line-height: 12px;
        font-size: 12px;
        text-align: center;
      }
      .layer-item-name {
        margin-left: 10px;
        height: 30px;
        width: 120px;
        line-height: 30px;
        font-size: 12px;
        color: rgba(255, 255, 255, 1);
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
      }
      .ishide {
        margin-left: 5px;
      }
    }
  }
  .layer-panel-mian.thumbnail {
    .layer-item {
      height: 50px;
      line-height: 50px;
      &:hover {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAAyCAYAAADbYdBlAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjM4OTc3NURCRDdGMTFFOTkzQkJBMDdFQjk3NkNDOTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjM4OTc3NUVCRDdGMTFFOTkzQkJBMDdFQjk3NkNDOTIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMzg5Nzc1QkJEN0YxMUU5OTNCQkEwN0VCOTc2Q0M5MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMzg5Nzc1Q0JEN0YxMUU5OTNCQkEwN0VCOTc2Q0M5MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkR3R0AAAAoqSURBVHja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");
      }
      &.active {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAAyCAYAAADbYdBlAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjM4OTc3NURCRDdGMTFFOTkzQkJBMDdFQjk3NkNDOTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjM4OTc3NUVCRDdGMTFFOTkzQkJBMDdFQjk3NkNDOTIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMzg5Nzc1QkJEN0YxMUU5OTNCQkEwN0VCOTc2Q0M5MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMzg5Nzc1Q0JEN0YxMUU5OTNCQkEwN0VCOTc2Q0M5MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkR3R0AAAAoqSURBVHja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");
      }
      .thumbimg {
        width: 50px;
        height: 30px;
        object-fit: cover;
        overflow: hidden;
      }
    }
  }
</style>
