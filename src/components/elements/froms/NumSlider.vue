<template lang="pug">
  //- 自动类型的输入框
  .kwc-control.el-slider-control(:style="{'width': width + 'px'}")
    ElSlider.slider-bar(v-model="currentValue" :input-size="'mini'" :disabled="disabled" :show-tooltip="false" :min="min" :max="max" :step="step")
    NumInput.input-number(v-model="currentValue" :precision="precision" :step="step" :min="min" :max="max" :disabled="disabled")
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      default: 170
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String],
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
    precision: {
      type: Number,
      default: 0
    },
    symbol: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentValue: 0
    }
  },
  created () {
    this.getCurrentValue()
  },
  methods: {
    // 设置currentValue
    getCurrentValue (num = this.value) {
      let value = parseFloat(num)
      if (typeof value !== 'number' && isNaN(value)) return
      this.currentValue = value
    }
  },
  watch: {
    currentValue: {
      handler (n, o) {
        this.getCurrentValue(this.currentValue)
        let value = this.currentValue
        if (this.symbol) {
          value += this.symbol
        }
        this.$emit('input', value)
        this.$emit('onChange', value)
      },
      deep: true
    },
    value: {
      handler (n, o) {
        this.getCurrentValue()
      },
      deep: true
    }
  }
}
</script>
