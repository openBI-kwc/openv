<template lang="pug">
  //- 滑动杆组件
  .slider-box(:style="{'width': width + 'px'}")
    .small.icon(@click="changeValue('reduce')") &#xe625;
    ElSlider.slider-bar(v-model="sliderValue",
     :format-tooltip="formatTooltip",
     :disabled="disabled",
     :min="min",
     :max="max",
     :step="step")
    .big.icon(@click="changeValue('add')") &#xe623;
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 250
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      required: true,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    // 正常的值
    nomal: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      sliderValue: 0
    }
  },
  created () {
    this.sliderValue = this.value
  },
  methods: {
    formatTooltip (val) {
      let point = this.sliderValue / this.nomal
      let str= Number(point * 100).toFixed(2)
      str += '%'
      return str
    },
    changeValue (type) {
      let value = this.sliderValue
      if (type === 'reduce') {
        value -= this.step
      }
      if (type === 'add') {
        value += this.step
      }
      // 如果超出范围不响应
      if (value > this.max || value <= this.min) return
      this.$emit('input', value)
      this.$emit('onClick', value)
      this.$emit('onChange', value)
    }
  },
  watch: {
    sliderValue: {
      handler (n, o) {
        this.$emit('input', this.sliderValue)
        this.$emit('onClick', this.sliderValue)
        this.$emit('onChange', this.sliderValue)
      },
      deep: true
    },
    value: {
      handler (n, o) {
        this.sliderValue = this.value
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="less">
  .slider-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 30px;
  }
  .slider-bar {
    position: relative;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 15px;
    /deep/ .el-slider__button-wrapper {
      z-index: 9;
      .el-slider__button {
        transform: none
      }
    }
  }
  .icon {
    width: 25px;
    line-height: 25px;
    color:#009BF9;
    cursor: pointer;
    font-size: 18px;
    text-align: center;
  }
</style>
