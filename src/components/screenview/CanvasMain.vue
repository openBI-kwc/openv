<template lang="pug">
  .canvas-main-wp(@mousemove.prevent.stop="dragMove" @mousedown.prevent.stop="dragStart" @mouseup.prevent.stop="dragEnd('mouse')" :style="canvasPanelStyle" :id="screenId" :class="canvasPanelClass")
    .mask(v-if="!disableMove && moving")
    template(v-else)
      .view-rect(v-if="showViewRect" :style="viewRectStyle")
    slot
</template>
<script>
import { mapState } from 'vuex'
import hotkeys from 'hotkeys-js'
const $ = window.$
export default {
  props: {
    screenStyle: {
      type: Object,
      default: () => {}
    },
    disableMove: {
      type: Boolean,
      default: false
    },
    screenId: {
      type: String,
      default: ''
    },
    // 在容器内部
    inroom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moving: false,
      dragging: false,
      $elLeft: 0,
      $elTop: 0,
      mouseLeft: 0,
      mouseTop: 0,
      $elOffsetLeft: 0,
      $elOffsetTop: 0,
      // 元素的位置
      canvasPosition: {},
      showViewRect: false,
      viewRectStyle: {},
      topLeft: [],
      bottomRight: [],
      selIndexList: []
    }
  },
  mounted() {
    this.registerHotkeys()
  },
  computed: {
    canvasPanelClass() {
      return {
        'canvas-moving': !this.disableMove && this.moving,
        'canvas-panel': !this.disableMove
      }
    },
    canvasPanelStyle() {
      return Object.assign({}, this.canvasPosition, this.screenStyle)
    },
    ...mapState(['position', 'index', 'indexList'])
  },
  methods: {
    registerHotkeys () {
      if (this.disableMove) return
      hotkeys('space', {keyup: true, element: this.$el, scope: 'canvas'}, (evn, handler) => {
        evn.preventDefault()
        switch (evn.type) {
          case 'keydown':
            this.moving = true
            this.$store.dispatch('SET_SCREEN_MOVE', this.moving)
            break
          case 'keyup':
            this.dragEnd('keyborad')
            break
        }
      })
      hotkeys.setScope('canvas')
    },
    dragStart (e) {
      this.$store.dispatch('SET_CHART_INDEX_LIST', [])
      this.showViewRect = true
      this.viewRectStyle = {}
      if (this.showViewRect && this.$route.name === 'screenediting') {
        this.startSpot = {
          top: e.offsetY + 'px',
          left: e.offsetX + 'px'
        }
        let canvasX = document.getElementsByClassName('chart-canvas')[0].parentElement.offsetLeft - 60,
          canvasY = document.getElementsByClassName('chart-canvas')[0].parentElement.offsetTop - 60
        this.topLeft = [e.offsetX + canvasX, e.offsetY + canvasY]
      }
      if (!this.moving) {
        this.$store.dispatch('SET_CHART_INDEX', null)
        return
      }
      this.dragging = true
      // 获取元素所在的坐标
      this.$elLeft = $(this.$el).offset().left
      this.$elTop = $(this.$el).offset().top
      // 获取鼠标所在的坐标
      this.mouseLeft = parseInt(this.mousePosition(e).x)
      this.mouseTop = parseInt(this.mousePosition(e).y)
      // 鼠标相对元素左和上边缘的坐标
      this.$elOffsetLeft = this.mouseLeft - this.$elLeft
      this.$elOffsetTop = this.mouseTop - this.$elTop
    },
    dragMove(e) {
      if (this.showViewRect) {
        if (!this.startSpot) return
        let spotL = this.startSpot.left
        let spotT = this.startSpot.top
        spotL.substring(spotL.length - 2)
        spotT.substring(spotT.length - 2)
        this.viewRectStyle = {
          top: Math.min(parseInt(spotT), e.offsetY) + 'px',
          left: Math.min(parseInt(spotL), e.offsetX) + 'px',
          width: Math.abs(parseInt(this.startSpot.left) - e.offsetX) + 'px',
          height: Math.abs(parseInt(this.startSpot.top) - e.offsetY) + 'px'
        }
        this.bottomRight = [this.topLeft[0] + parseInt(e.offsetX - parseInt(this.startSpot.left)), this.topLeft[1] + parseInt(e.offsetY - parseInt(this.startSpot.top))]
      }
      if (!this.dragging) return
      // 获取移动后的元素的坐标
      let x = this.mousePosition(e).x - this.$elOffsetLeft
      let y = this.mousePosition(e).y - this.$elOffsetTop
      if (this.inroom) {
        // 计算可移动位置的大小， 保证元素不会超过可移动范围
        // min方法保证不会超过右边界，max保证不会超过左边界
        let width = $(this.$el).parent().width() - $(this.$el).width()
        let height = $(this.$el).parent().height() - $(this.$el).height()
        x = Math.min(Math.max(0, x), width)
        y = Math.min(Math.max(0, y), height)
      }
      // 给元素及时定位
      this.canvasPosition = {
        left: x + 'px',
        top: y + 'px'
      }
    },
    dragEnd(type = 'keyborad') {
      this.checkEchartSpot()
      this.showViewRect = false
      if (type === 'keyborad') {
        this.moving = false
      }
      this.$store.dispatch('SET_SCREEN_MOVE', this.moving)
      this.dragging = false
    },
    mousePosition(e) {
      e = e || window.event
      return {
        x: e.pageX,
        y: e.pageY
      }
    },
    // 判断图标坐标是否在圈中范围
    checkCoords (itemCoord) {
      if (this.topLeft.length === 0 || this.bottomRight.length === 0) return false
      // if (this.topLeft.length === 0 || this.bottomRight.length === 0) return false
      let condition1 = itemCoord[0] > Math.min(this.topLeft[0], this.bottomRight[0])
      let condition2 = itemCoord[0] < Math.max(this.topLeft[0], this.bottomRight[0])
      let condition3 = itemCoord[1] > Math.min(this.topLeft[1], this.bottomRight[1])
      let condition4 = itemCoord[1] < Math.max(this.topLeft[1], this.bottomRight[1])
      if (condition1 && condition2 && condition3 && condition4) {
        return true
      } else {
        return false
      }
    },
    // 判断大屏中图表是否在范围
    checkEchartSpot () {
      // 区别点击事件与mousedown事件
      if (!this.viewRectStyle.width) {
        return
      }
      this.selIndexList = []
      for (let k in this.position) {
        let begin = [this.position[k].x, this.position[k].y]
        let end = [this.position[k].x + this.position[k].width, this.position[k].y + this.position[k].height]
        let judge1 = this.checkCoords(begin)
        let judge2 = this.checkCoords(end)
        if (judge1 || judge2) {
          this.selIndexList.push(k)
        }
      }
      this.$store.dispatch('SET_CHART_INDEX_LIST', this.selIndexList)
      // 去除边框线
      this.viewRectStyle = {}
    }
  },
  beforeDestroy() {
    hotkeys.unbind('space', 'canvas')
  }
}
</script>
<style lang="less" scoped>
.mask {
  background: none;
  z-index: 99;
  opacity: 1;
}
.view-rect {
  position: absolute;
  width: 0;
  height: 0;
  background: rgba(0,135,235,.15);
  border: 1px solid #0087eb;
  z-index: 99;
}
.canvas-moving {
  cursor: grab;
}
</style>
