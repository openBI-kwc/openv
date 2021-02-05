<template lang="pug">
  .kwc-control.el-color-control
    input.k-ColorPicker-input(ref="ColorPickerInput" @focus="focus" type='text', autocomplete='off', placeholder='请选择颜色', :value='inputValue' @blur="inputValueChange")
    span.k-ColorPicker-previewIcon(@click="showSketchBox" :style="{'background': inputValue}")
    .k-PopOver-overlay(v-if="showSketch" @click.self="showSketch = false")
    .k-ColorPicker-popover(v-if="showSketch" :style="sketchStyle")
      Sketch.k-color-picker(v-if="componentType === 'Sketch'" v-model="colors")
      Chrome.k-color-picker(v-if="componentType === 'Chrome'" v-model="colors")
</template>
<script>
import { Sketch, Chrome } from 'vue-color'
const $ = window.$
export default {
  components: {
    Sketch,
    Chrome
  },
  props: {
    componentType: {
      type: String,
      default: 'Sketch'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showSketch: false,
      colors: '#ffffff',
      inputValue: '',
      sketchStyle: {},
      boxSize: {
        Chrome: {
          width: 240,
          height: 250
        },
        Sketch: {
          width: 220,
          height: 320
        }
      }
    }
  },
  created() {
    this.inputValue = this.value || ''
    this.colors = this.value || ''
  },
  watch: {
    value: {
      handler () {
        this.inputValue = this.value || ''
        this.colors = this.value || ''
      },
      immediate: false
    },
    colors: {
      handler () {
        if (!this.$children[0]) return
        let rgbaValue = this.$children[0].activeColor
        this.$emit('input', rgbaValue)
        this.inputValue = rgbaValue
      },
      immediate: false
    } 
  },
  methods: {
    inputValueChange (e) {
      let v = e.target.value
      /* eslint-disable */
      let rgba = /^[rR][gG][Bb][Aa]?[\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[\)]{1}$/g
      let hex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/g
      if (hex.test(v) || rgba.test(v)) {
        this.$emit('input', v)
        this.inputValue = v
      } else {
        e.target.value = this.inputValue
      }
    },
    showSketchBox () {
      this.$refs.ColorPickerInput.focus()
    },
    focus () {
      this.showSketch = true
      this.sketchStyle = this.getSketchStyle()
    },
    getSketchStyle () {
      let sty = {
        display: 'block',
        left: '5px',
        top: '35px'
      }
      let sketchHeight = $(this.$el).height()
      let sketchWidth = $(this.$el).width()
      let position = this.$el.getBoundingClientRect()
      let winWidth = $(window).width()
      let winHeight = $(window).height()
      let sketchBoxWidth = this.boxSize[this.componentType].width
      let sketchBoxHeight = this.boxSize[this.componentType].height
      let x = 0, y= 0
      // 最右侧
      if (position.left + sketchBoxWidth > winWidth) {
        x = -(sketchBoxWidth - sketchWidth) + 'px'
      }
      // 最下
      if (position.top + sketchBoxHeight > winHeight) {
        y = -(sketchBoxHeight + sketchHeight) + 'px'
      }
      sty.transform = `translate(${x}, ${y})`
      return sty
    }
  }
}
</script>
<style lang="less" scope>
  .el-color-control {
    width: 170px;
    height: 30px;
    border-bottom: 1px solid rgba(46,62,80,1);
    display: flex;
    align-items: center;
    // background: #03101F;
    position: relative;
    flex-wrap: nowrap;
    white-space: nowrap;
    &:focus-within {
      border-bottom: 1px solid #219AF2;
    }
    .k-ColorPicker-input {
      border: 0;
      background: rgba(0,0,0,0);
      outline: 0;
      width: 100%;
      flex-basis: 0;
      flex-grow: 1;
      padding: 0;
      margin: 0;
      height: 30px;
      line-height: 30px;
      font-size:14px;
      color:#ffffff;
      text-indent: 5px;
    }
    .k-ColorPicker-previewIcon {
      display: block;
      width:16px;
      height:16px;
      border:1px solid rgba(0,0,0,1);
      margin-right: 5px;
      cursor: pointer;
    }
    .k-PopOver-overlay {
      position: fixed!important;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      bottom: 0;
      background: rgba(0,0,0,0);
    }
    .k-ColorPicker-popover {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1400;
      display: none;
      /deep/ .k-color-picker {
        position: relative;
        z-index: 2;
        border-radius: 0;
        padding: 5px 5px 0;
        background:rgba(0,33,65,1);
        border:1px solid rgba(24,144,255,1);
        .vc-sketch-presets {
          display: flex;
          flex-wrap: wrap;
          border-top:0;
        }
        .vc-input__input {
          background:rgba(0,33,65,1);
          border:1px solid rgba(24,144,255,.8);
          font-size:10px;
          color:rgba(255,255,255,0.8);
          box-shadow: none;
        }
        .vc-input__label {
          padding-bottom: 0;
          height: 20px;
          line-height: 10px;
          font-size:10px;
          color:rgba(255,255,255,0.8);
        }
      }
    }
  }
</style>
