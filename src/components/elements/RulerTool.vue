<template>
  <div class="ruler-box" v-if="showRuler">
    <!-- 隐藏按钮 -->
    <div class="fa ruler-toggle" :class="rulerToggle ? 'fa-eye-slash' : 'fa-eye'" @click.self.stop="rulerToggle = !rulerToggle"></div>
    <!-- 水平刻度尺子 -->
    <div class="levelScaleRuler" :style="{'transform': `translateX(-${trans.x}px)`, 'width': windowWidth + 'px', 'paddingLeft': screenOffSet.x + 'px'}">
      <!-- 水平基础线 -->
      <div v-show="verticalDottedTop.pos > 0" ref="levelDottedLine" class="RefDot_h" :style="{'width': windowWidth + 'px', top: verticalDottedTop.pos + 'px'}">
        <span class="label ref-label">{{verticalDottedTop.label}}</span>
      </div>
      <div id="levelRuler" class="ScaleRuler_h" :style="{ 'width':  `calc(100% - ${screenOffSet.x}px)`, 'left': screenOffSet.x + 'px'}" @mousedown.stop="levelDragRuler">
        <span class="n" v-for="(item,index) in xScale" :key="index" :style="{left: index * labelSize + 2 + 'px'}">{{ item.label }}</span>
      </div>
      <!-- 垂直线集合 -->
      <div class="RefLine_v_g" v-show="rulerToggle">
        <div class="RefLine_v"  :id="item.id" :title="item.title" @dblclick.self.stop="removeRefLine('v', hindex)" v-for="(item, vindex) in verticalLineList" :style="{'height': windowHeight + 'px', left:item.left+ 'px'}" :key="vindex" @mousedown="dragVerticalLine(item.id)">
          <span class="label">{{item.left}}</span>
        </div>
      </div>
    </div>
    <!-- 垂直刻度尺子 -->
    <div class="verticalScaleRuler" :style="{'transform': `translateY(-${trans.y}px)`, 'height': windowHeight + 'px', 'paddingTop': screenOffSet.y + 'px'}" >
      <!-- 垂直基础线 -->
      <div v-show="levelDottedLeft.pos > 0" ref="verticalDottedLine" class="RefDot_v" :style="{'height': windowHeight + 'px', left:levelDottedLeft.pos + 'px'}">
        <span class="label ref-label">{{levelDottedLeft.label}}</span>
      </div>
      <div id="verticalRuler" class="ScaleRuler_v" :style="{'height':  `calc(100% - ${screenOffSet.y}px)`, 'top': screenOffSet.y + 'px'}" @mousedown.stop="verticalDragRuler">
        <span class="n" v-for="(item,index) in yScale" :key="index" :style="{top: index * labelSize + 2 + 'px'}">{{ item.label }}</span>
      </div>
      <!-- 水平线集合 -->
      <div class="RefLine_h_g" v-show="rulerToggle">
        <div class="RefLine_h" :id="item.id" :title="item.title"  @dblclick.self.stop="removeRefLine('h', hindex)" v-for="(item, hindex) in levelLineList" :style="{'width': windowWidth + 'px', top: item.top + 'px'}" :key="hindex" @mousedown="dragLevelLine(item.id)">
          <span class="label">{{item.top}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { mapState } from 'vuex'
const $ = window.$
export default {
  props: {
    // 显示
    showRuler: {
      type: Boolean,
      default: false
    },
    // 热键开关
    isHotKey: {
      type: Boolean,
      default: true
    },
    // 预置参考线
    // { type: 'l', site: 50 }, { type: 'v', site: 180 }
    presetLine: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 是否在父级元素
    parent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      labelSize: 50,
      size: 18,
      // 窗口宽度
      windowWidth: 99999,
      // 窗口高度
      windowHeight: 99999,
      // 水平刻度
      xScale: [],
      // 垂直刻度
      yScale: [],
      // 标尺与窗口上间距
      topSpacing: 0,
      //  标尺与窗口左间距
      leftSpacing: 0,
      isDrag: false,
      // 拖动开始标记，可能值x(从水平标尺开始拖动),y(从垂直标尺开始拖动)
      dragFlag: "",
      // 生成的水平线列表
      levelLineList: [],
      // 生成的垂直线列表
      verticalLineList: [],
      // 水平虚线位置
      levelDottedLeft: {label: '', pos: 0},
      // 垂直虚线位置
      verticalDottedTop: {label: '', pos: 0},
      // 垂直标尺的宽度
      rulerWidth: 0,
      // 水平标尺的高度
      rulerHeight: 0,
      // 被移动线的ID
      dragLineId: "",
      // 快捷键参数
      keyCode: { r: 82 },
      // 标尺辅助线显示开关
      rulerToggle: true,
      screenOffSet: {x: 0, y: 0},
      trans: {x: 0, y: 0}
    };
  },
  watch: {
    showRuler: {
      handler () {
        if (!this.showRuler) return
        this.$nextTick(() => {
          this.init();
        })
      },
      deep: true
    },
    'screenOption.scale' () {
      this.scaleCalc();
    },
    'screenMoving' () {
      if (this.screenMoving) return
      const SCREENDom = document.getElementById('canvas-panel-wrap').children[0]
      this.screenOffSet = {x: SCREENDom.offsetLeft, y: SCREENDom.offsetTop}
    }
  },
  mounted() {
    document.documentElement.addEventListener("mousemove", this.dottedLineMove, true);
    document.documentElement.addEventListener("mouseup", this.dottedLineUp, true);
    document.documentElement.addEventListener("keyup", this.keyboard, true);
    // 绑定窗口调整大小onresize事件
    window.addEventListener('resize', () => {
      this.init();
    })
  },
  beforeDestroy: function() {
    document.documentElement.removeEventListener("mousemove", null);
    document.documentElement.removeEventListener("mouseup", null);
    document.documentElement.removeEventListener("keyup", null);
    window.removeEventListener('resize', null)
  },
  methods: {
    init() {
      if (!this.showRuler) return
      $('#canvas-panel-wrap').on('scroll', (e) => {
        this.trans = {x: e.target.scrollLeft, y: e.target.scrollTop}
      })
      this.getWindowBox();
      this.scaleCalc();
      // 生成预置参考线
      this.quickGeneration(this.presetLine);
      
    },
    // 获取窗口宽与高
    getWindowBox() {
      const WRAP = document.getElementById('canvas-panel-wrap')
      const SCREENDom = WRAP.children[0]
      const verticalRulerDom = document.getElementById('verticalRuler')
      const levelRulerDom = document.getElementById('levelRuler')
      this.rulerWidth = verticalRulerDom.clientWidth;
      this.rulerHeight = levelRulerDom.clientHeight;
      this.topSpacing = levelRulerDom.getBoundingClientRect().y;
      this.leftSpacing = verticalRulerDom.getBoundingClientRect().x;
      this.screenOffSet = {x: SCREENDom.offsetLeft, y: SCREENDom.offsetTop}
    },
    // 计算刻度
    scaleCalc() {
      this.xScale = [];
      this.yScale = [];
      const scale = this.screenOption.scale / 10
      for (let i = 0; i < this.windowWidth; i += 1) {
        if (i % this.labelSize === 0) {
          const item = {
            label: parseInt(i * scale)
          }
          this.xScale.push(item);
        }
      }
      for (let i = 0; i < this.windowHeight; i += 1) {
        if (i % this.labelSize === 0) {
          const item = {
            label: parseInt(i * scale)
          }
          this.yScale.push(item);
        }
      }
    },
    // 生成一个水平参考线
    newLevelLine() {
      this.isDrag = true;
      this.dragFlag = "x";
    },
    // 生成一个垂直参考线
    newVerticalLine() {
      this.isDrag = true;
      this.dragFlag = "y";
    },
    // 虚线移动
    dottedLineMove($event) {
      if (!this.rulerToggle || !this.isDrag) return
      const scale = this.screenOption.scale / 10
      const x = $event.pageX - this.leftSpacing
      const y = $event.pageY - this.topSpacing
      switch (this.dragFlag) {
        case "x":
          this.verticalDottedTop = {label: parseInt(y * scale), pos: y};
          break;
        case "y":
          this.levelDottedLeft = {label: parseInt(x * scale), pos: x};
          break;
        case "l":
          this.verticalDottedTop = {label: parseInt(y * scale), pos: y};
          break;
        case "v":
          this.levelDottedLeft = {label: parseInt(x * scale), pos: x};
          break;
      }
    },
    // 虚线松开
    dottedLineUp($event) {
      if (!this.rulerToggle || !this.isDrag) return
      this.isDrag = false;
      switch (this.dragFlag) {
        case "x":
          const objx = {
            id: "levelLine_" + this.levelLineList.length + 1,
            title: $event.pageY - this.topSpacing - this.size + "px",
            top: $event.pageY - this.topSpacing
          }
          objx.top > this.size &&  this.levelLineList.push(objx);
          break;
        case "y":
          const objy = {
            id: "verticalLine_" + this.verticalLineList.length + 1,
            title: $event.pageX - this.leftSpacing - this.size + "px",
            left: $event.pageX - this.leftSpacing
          }
          objy.left > this.size && this.verticalLineList.push(objy);
          break;
        case "l":
          let Indexl, idl;
          this.levelLineList.forEach((item, index) => {
            if (item.id === this.dragLineId) {
              Indexl = index;
              idl = item.id;
            }
          });
          const newIl = {
            id: idl,
            title: $event.pageY - this.topSpacing - this.size + "px",
            top: $event.pageY - this.topSpacing
          }
          if ($event.pageY - this.topSpacing >= this.rulerHeight) {
            this.levelLineList.splice(Indexl, 1, newIl);
          } else {
            this.levelLineList.splice(Indexl, 1)
          }
          break;
        case "v":
          let Indexv, idv;
          this.verticalLineList.forEach((item, index) => {
            if (item.id === this.dragLineId) {
              Indexv = index;
              idv = item.id;
            }
          });
          const newIv = {
            id: idv,
            title: $event.pageX - this.leftSpacing - this.size + "px",
            left: $event.pageX - this.leftSpacing
          }
          if ($event.pageX - this.leftSpacing >= this.rulerWidth) {
            this.verticalLineList.splice(Indexv, 1, newIv);
          } else {
            this.verticalLineList.splice(Indexv, 1)
          }
          break;
      }
      this.dragLineId = "";
      this.dragFlag = "";
      this.verticalDottedTop = {label: '', pos: 0};
      this.levelDottedLeft = {label: '', pos: 0};
      // 所有的辅助线
      this.$emit("setLines", this.presetLines)
    },
    // 删除线
    removeRefLine (type, index) {
      if (type === 'v') this.verticalLineList.splice(index, 1)
      if (type === 'h') this.levelLineList.splice(index, 1)
    },
    // 水平标尺处按下鼠标
    levelDragRuler() {
      this.newLevelLine();
    },
    // 垂直标尺处按下鼠标
    verticalDragRuler() {
      this.newVerticalLine();
    },
    // 水平线处按下鼠标
    dragLevelLine(id) {
      this.isDrag = true;
      this.dragFlag = "l";
      this.dragLineId = id;
    },
    // 垂直线处按下鼠标
    dragVerticalLine(id) {
      this.isDrag = true;
      this.dragFlag = "v";
      this.dragLineId = id;
    },
    // 键盘事件
    keyboard($event) {
      if (!this.isHotKey) return
      switch ($event.keyCode) {
        case this.keyCode.r:
          this.rulerToggle = !this.rulerToggle;
          break;
      }
    },
    // 快速生成参考线
    quickGeneration(params) {
      if (!Array.isArray(params) || !params.length) return
      params.forEach(item => {
        switch (item.type) {
          case "l":
            this.levelLineList.push({
              id: "levelLine" + this.levelLineList.length + 1,
              title: item.site + "px",
              top: item.site + this.size
            });
            break;
          case "v":
            this.verticalLineList.push({
              id: "verticalLine" + this.verticalLineList.length + 1,
              title: item.site + "px",
              left: item.site + this.size
            });
            break;
          default:
            break;
        }
      });
    }
  },
  computed: {
     ...mapState(['screenMoving', 'screenOption']),
    presetLines () {
      const v = this.verticalLineList.map(item => { return { type: 'v', site: item.left } })
      const h = this.levelLineList.map(item => { return { type: 'h', site: item.top } })
      return [...new Set([...this.presetLine, ...v, ...h])]
    }
  },
};
</script>

<style scoped lang="less">
.ruler-box {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
  .ruler-toggle {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 16px;
    color: #676c94;
    z-index: 10;
    width: 18px;
    height: 18px;
    font-weight: bold;
    cursor: pointer;
    background: #ffffff;
  }
  .levelScaleRuler {
    width: 100%;
    height: 18px;
    background: rgba(255, 255, 255, 0.95);
    .ScaleRuler_h {
      // width: 100%;
      height: 18px;
      // left: 18px;
      opacity: 0.95;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAMAAAAuTX21AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACNJREFUeNpiYCAdMDKRCka1jGoBA2JZZGshiaCXFpIBQIABAAplBkCmQpujAAAAAElFTkSuQmCC) repeat-x;
    }
  }
  .verticalScaleRuler {
    height: 100%;
    width: 18px;
    background: rgba(255, 255, 255, 0.95);
    .ScaleRuler_v {
      width: 18px;
      // height: 100%;
      // top: 18px;
      opacity: 0.95;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAMAAABmvHtTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACBJREFUeNpiYGBEBwwMTGiAakI0NX7U9aOuHyGuBwgwAH6bBkAR6jkzAAAAAElFTkSuQmCC) repeat-y;
    }
  }
}
.ScaleRuler_h,
.ScaleRuler_v,
.RefLine_v,
.RefLine_h,
.RefDot_h,
.RefDot_v,
.levelScaleRuler,
.verticalScaleRuler {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
}
.ScaleRuler_h, .ScaleRuler_v{
  overflow: hidden;
  .n {
    position: absolute;
    font: 10px/1 Arial, sans-serif;
    color: #333;
    cursor: default;
  }
}
.ScaleRuler_v .n {
  width: 8px;
  left: 3px;
  word-wrap: break-word;
}
.ScaleRuler_h .n {
  top: 1px;
}
.label {
  position: absolute;
  font: 12px/1 Arial, sans-serif;
  color: #f14e4e;
  cursor: default;
  font-weight: bold;
}
.RefLine_h .label,
.RefDot_h .label{
  transform: translate(20px, 5px);
}
.RefLine_v .label,
.RefDot_v .label {
  transform: translate(5px, 20px);
}
.ref-label {
  color: #0784f7;
}
.RefLine_h {
  width: 100%;
  height: 3px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAABCAMAAADU3h9xAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFSv//AAAAH8VRuAAAAA5JREFUeNpiYIACgAADAAAJAAE0lmO3AAAAAElFTkSuQmCC) repeat-x left center;
  cursor: ns-resize;
}

.RefLine_v {
  width: 3px;
  height: 100%;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAICAMAAAAPxGVzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFSv//AAAAH8VRuAAAAA5JREFUeNpiYEAFAAEGAAAQAAGePof9AAAAAElFTkSuQmCC) repeat-y center top;
  cursor: ew-resize;
}

.RefDot_h {
  width: 100%;
  height: 3px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFf39/////F3PnHQAAAAJ0Uk5T/wDltzBKAAAAEElEQVR42mJgYGRgZAQIMAAADQAExkizYQAAAABJRU5ErkJggg==) repeat-x left 1px; 
  cursor: ns-resize;
  top: 0;
}

.RefDot_v {
  width: 3px;
  height: 1px;
  height: 100%;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFf39/////F3PnHQAAAAJ0Uk5T/wDltzBKAAAAEElEQVR42mJgYGRgZAQIMAAADQAExkizYQAAAABJRU5ErkJggg==) repeat-y 1px top;
  cursor: ew-resize;
  left: 0;
}
.content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
