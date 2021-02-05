<template lang="pug">
  //- 可自由拖动位置和缩放大小的组件
  .deformation(:class="deformationClass" :style="deformationStyle" @mousedown.prevent.stop="dragDown"
    @mouseenter.prevent.stop="dragHover" @mouseleave.prevent.stop="dragLeavel" @contextmenu.prevent.stop="dragMenu")
    //- 如果可改变大小为真
    .transform-handler(v-if="resizable && !disable")
      template(v-if="!scaling")
        //- 左上
        .handler.handler-lt(@mousedown.seft.prevent.stop="handlerSize('lt')")
        //- 上中
        .handler.handler-tm(@mousedown.seft.prevent.stop="handlerSize('tm')")
        //- 上右
        .handler.handler-tr(@mousedown.seft.prevent.stop="handlerSize('tr')")
        //- 右中
        .handler.handler-rm(@mousedown.seft.prevent.stop="handlerSize('rm')")
        //- 下中
        .handler.handler-bm(@mousedown.seft.prevent.stop="handlerSize('bm')")
        //- 下左
        .handler.handler-bl(@mousedown.self.prevent.stop="handlerSize('bl')")
        //- 左中
        .handler.handler-lm(@mousedown.self.prevent.stop="handlerSize('lm')")
        //- 右下
        .handler.handler-rb(@mousedown.seft.prevent.stop="handlerSize('rb')")
      .handler.handler-rb.scaling.icon(v-else @mousedown.seft.prevent.stop="handlerSize('rb')") &#xe653;
    slot
</template>

<script>
/* eslint-disable */
// resizing 大小变化中
// deactivated 取消激活状态
// activated 组件激活
// dragging 组件正在拖动
// resizestop 组件大小停止变化
// dragstop 停止拖动组件
// draghover 鼠标悬浮
// dragleavel 鼠标离开
// dragmenu   右键菜单
export default {
  replace: true,
  props: {
    // 是否可被拖动
    draggable: {
      type: Boolean,
      default: true
    },
    // 是否可改变大小
    resizable: {
      type: Boolean,
      default: true
    },
    // 是否在屏幕内移动
    inscreen: {
      type: Boolean,
      default: false
    },
    // 禁用图表
    disable: {
      type: Boolean,
      default: false
    },
    // 显示边框
    showBorder: {
      type: Boolean,
      default: false
    },
    // 等比缩放
    scaling: {
      type: Boolean,
      default: false
    },
    // 宽度
    w: {
      type: Number,
      default: 0,
      validator: val => {
        return typeof val === "number" && val >= 0;
      }
    },
    // 高度
    h: {
      type: Number,
      default: 0,
      validator: val => {
        return typeof val === "number" && val >= 0;
      }
    },
    // 屏幕位置x轴
    x: {
      type: Number,
      default: 0
    },
    // 屏幕位置y轴
    y: {
      type: Number,
      default: 0
    },
    // 缩放比例
    zoom: {
      type: Number,
      default: 1
    },
    // 最小宽度
    minw: {
      type: Number,
      default: 0,
      validator: function(val) {
        return val >= 0;
      }
    },
    // 最小高度
    minh: {
      type: Number,
      default: 0,
      validator: function(val) {
        return val >= 0;
      }
    },
    // 最大宽度
    maxw: {
      type: Number,
      default: Infinity
    },
    // 最大高度
    maxh: {
      type: Number,
      default: -Infinity
    }
  },
  data() {
    return {
      top: this.y,
      left: this.x,
      width: this.w,
      height: this.h,
      resizing: false,
      dragging: false,
      active: false,
      scale: '',
      handler: '',
      parentX: 0,
      parentW: 9999,
      parentY: 0,
      parentH: 9999,
      mouseX: 0,
      mouseY: 0,
      lastMouseX: 0,
      lastMouseY: 0,
      mouseOffX: 0,
      mouseOffY: 0,
      elmX: 0,
      elmY: 0,
      elmW: 0,
      elmH: 0
    };
  },
  mounted() {
    // 初始化控件宽高
    if (this.minw > this.w) this.width = this.minw;
    if (this.minh > this.h) this.height = this.minh;
    // 判断是否只能在屏幕内部移动
    if (this.inscreen) this.calculationParent();
    // 判断浏览器是否支持passive
    try {
      Object.defineProperty({}, "passive", {
        get () {
          this.passiveSupported = true;
        }
      });
    } catch (err) {}
  },
  computed: {
    deformationStyle() {
      let sty = {
        transform: `translate(${this.left}px, ${this.top}px)`,
        width: this.width + "px",
        height: this.height + "px"
      }
      if (this.showBorder) sty.border =  '1px solid #0CCAEB'
      return sty
    },
    deformationClass () {
      return {
        draggable: this.draggable && !this.disable,
        active: this.active,
        dragging: this.dragging,
        resizing: this.resizing
      }
    }
  },
  beforeDestroy () {
    document.documentElement.removeEventListener('mousemove', null)
    document.documentElement.removeEventListener('mousedown', null)
    document.documentElement.removeEventListener('mouseup', null)
  },
  methods: {
    // 计算父级元素获取位置
    calculationParent() {
      this.parentW = parseInt(this.$el.parentNode.clientWidth, 10);
      this.parentH = parseInt(this.$el.parentNode.clientHeight, 10);
      if (this.w > this.parentW) this.width = this.parentW;
      if (this.h > this.parentH) this.height = this.parentH;
      if (this.x + this.width > this.parentW) this.left = this.parentW - this.width;
      if (this.y + this.height > this.parentH) this.top = this.parentH - this.height;
    },
    // 取消选择事件
    cancelSelect(e) {
      this.mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft;
      this.mouseY = e.pageY || e.clientY + document.documentElement.scrollTop;
      this.lastMouseX = this.mouseX;
      this.lastMouseY = this.mouseY;
      const target = e.target || e.srcElement;
      const regex = new RegExp("handler-([trmbl]{2})", "");
      if (this.$el.contains(target) || regex.test(target.className) || !this.active) return
      document.documentElement.removeEventListener("mousemove", null);
      document.documentElement.removeEventListener("mousedown", null);
      document.documentElement.removeEventListener("mouseup", null);
      this.active = false;
      this.$emit("deactivated");
    },
    // 图表大小设置
    handlerSize(handler) {
      // 将handler设置为当前元素
      this.handler = this.scaling ? 'rb' : handler;
      this.resizing = true;
      // 缩放比例
      if (this.scaling)  {
        this.scale = this.elmW / this.elmH
      }
    },
    // 鼠标悬浮
    dragHover(e) {
      this.$emit("draghover");
    },
    // 离开组件
    dragLeavel(e) {
      this.$emit("dragleavel");
    },
    // 组件右键事件
    dragMenu(e) {
      this.$emit("dragmenu", [e.pageX, e.pageY]);
    },
    // 组件被按下事件
    dragDown(e) {
      const passiveSupported = this.passiveSupported;
      // 判断是否支持拖动
      if (this.disable || !this.draggable) return;
      const target = e.target || e.srcElement;
      // 确保事件发生在组件内部
      if (!this.$el.contains(target)) return
      if (!this.active) {
        this.lastMouseX = e.pageX || e.clientX + document.documentElement.scrollLeft;
        this.lastMouseY = e.pageY || e.clientY + document.documentElement.scrollTop;
        document.documentElement.addEventListener("mousemove", this.dragMove, passiveSupported ? { passive: true } : true);
        document.documentElement.addEventListener("mousedown", this.cancelSelect, passiveSupported ? { passive: true } : true);
        document.documentElement.addEventListener("mouseup", this.dragUp, passiveSupported ? { passive: true } : true);
        this.active = true;
        this.$emit("activated");
      }
      this.elmX = parseInt(this.left);
      this.elmY = parseInt(this.top);
      this.elmW = this.$el.offsetWidth || this.$el.clientWidth;
      this.elmH = this.$el.offsetHeight || this.$el.clientHeight;
      this.dragging = true;
    },
    // 拖动移动事件
    dragMove(e) {
      // 鼠标在页面上的坐标
      this.mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft;
      this.mouseY = e.pageY || e.clientY + document.documentElement.scrollTop;
      // diffX =  当前鼠标位置 - 上次鼠标位置 + ？？
      let diffX = (this.mouseX - this.lastMouseX + this.mouseOffX) / this.zoom;
      let diffY = (this.mouseY - this.lastMouseY + this.mouseOffY) / this.zoom;
      this.mouseOffX = this.mouseOffY = 0;
      this.lastMouseX = this.mouseX;
      this.lastMouseY = this.mouseY;
      if (this.resizing) {
        const has = (type) => this.handler.indexOf(type) >= 0
        if (has("t")) {
          if (this.elmH - diffY < this.minh) this.mouseOffY = diffY - (diffY = this.elmH - this.minh);
          else if (this.elmY + diffY < this.parentY) this.mouseOffY = diffY - (diffY = this.parentY - this.elmY);
          this.elmY += diffY;
          this.elmH -= diffY;
        }
        if (has("b")) {
          if (this.elmH + diffY < this.minh) this.mouseOffY = diffY - (diffY = this.minh - this.elmH);
          else if (this.elmY + this.elmH + diffY > this.parentH) this.mouseOffY = diffY - (diffY = this.parentH - this.elmY - this.elmH);
          this.elmH += diffY;
        }
        if (has("l")) {
          if (this.elmW - diffX < this.minw) this.mouseOffX = diffX - (diffX = this.elmW - this.minw);
          else if (this.elmX + diffX < this.parentX) this.mouseOffX = diffX - (diffX = this.parentX - this.elmX);
          this.elmX += diffX;
          this.elmW -= diffX;
        }
        if (has("r")) {
          if (this.elmW + diffX < this.minw) this.mouseOffX = diffX - (diffX = this.minw - this.elmW);
          else if (this.elmX + this.elmW + diffX > this.parentW) this.mouseOffX = diffX - (diffX = this.parentW - this.elmX - this.elmW);
          this.elmW += diffX;
        }
        this.left = Math.round(this.elmX);
        this.top = Math.round(this.elmY);
        this.width = Math.round(this.elmW);
        this.height = Math.round(this.elmH);
        // w / h = scale
        if (this.scaling && has("b")) {
          this.height = Math.round(this.width / this.scale)
        }
        this.$emit("resizing", [this.left, this.top, this.width, this.height]);
      } else if (this.dragging) {
        if (this.inscreen) {
          if (this.elmX + diffX < this.parentX) this.mouseOffX = diffX * this.zoom - (diffX = this.parentX - this.elmX);
          else if (this.elmX + this.elmW + diffX > this.parentW) this.mouseOffX = diffX * this.zoom - (diffX = this.parentW - this.elmX - this.elmW);
          if (this.elmY + diffY < this.parentY) this.mouseOffY = diffY * this.zoom - (diffY = this.parentY - this.elmY);
          else if (this.elmY + this.elmH + diffY > this.parentH) this.mouseOffY = diffY * this.zoom - (diffY = this.parentH - this.elmY - this.elmH);
        }
        this.elmX += diffX;
        this.elmY += diffY;
        if (this.draggable) {
          this.left = Math.round(this.elmX);
          this.top = Math.round(this.elmY);
        }
        this.$emit("dragging", [this.left, this.top]);
      }
    },
    // 拖动松开事件
    dragUp(e) {
      this.handler = null;
      if (this.resizing) {
        this.resizing = false;
        this.$emit("resizestop", [this.left, this.top, this.width, this.height]);
      }
      if (this.dragging) {
        this.dragging = false;
        this.$emit("dragstop", [this.left, this.top]);
      }
      this.scale = ''
      this.elmX = this.left;
      this.elmY = this.top;
    }
  },
  watch: {
    x(newVal) {
      if (isNaN(newVal)) {
        console.error("传入x值为空!");
      } else {
        this.left = newVal;
      }
    },
    y(newVal) {
      if (isNaN(newVal)) {
        console.error("传入y值为空!");
      } else {
        this.top = newVal;
      }
    },
    w(newVal) {
      if (isNaN(newVal)) {
        console.error("传入w值为空!");
      } else {
        this.width = newVal;
      }
    },
    h(newVal) {
      if (isNaN(newVal)) {
        console.error("传入h值为空!");
      } else {
        this.height = newVal;
      }
    }
  }
};
</script>

<style scoped lang="less">
.deformation {
  position: absolute;
  left: 0;
  top: 0;
  user-select: none;
}
.transform-handler {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.handler {
  z-index: 99;
  display: none;
  position: absolute;
  width: 6px;
  height: 6px;
  background: #ffffff;
}
.active .handler {
  display: block;
}
/* 左上 */
.handler-lt {
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  cursor: nwse-resize;
}
/* 上中 */
.handler-tm {
  top: 0;
  left: 50%;
  width: 12px;
  transform: translate(-50%, -50%);
  cursor: ns-resize;
}
/* 右上 */
.handler-tr {
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  cursor: nesw-resize;
}
/* 右中*/
.handler-rm {
  top: 50%;
  right: 0;
  height: 12px;
  transform: translate(50%, -50%);
  cursor: ew-resize;
}
/* 右下*/
.handler-rb {
  right: 0;
  bottom: 0;
  transform: translate(50%, 50%);
  cursor: nwse-resize;
  &.scaling {
    width: 13px;
    height: 13px;
    color: #fff;
    background: #219AF2;
    font-size: 12px;
    transform: none;
    line-height: 13px;
    text-align: center;
  }
}
/* 下中 */
.handler-bm {
  bottom: 0;
  left: 50%;
  width: 12px;
  transform: translate(-50%, 50%);
  cursor: ns-resize;
}
/* 左下 */
.handler-bl {
  bottom: 0;
  left: 0;
  transform: translate(-50%, 50%);
  cursor: nesw-resize;
}
/* 左中*/
.handler-lm {
  top: 50%;
  left: 0;
  height: 12px;
  transform: translate(-50%, -50%);
  cursor: ew-resize;
}
</style>
