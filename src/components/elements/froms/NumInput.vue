<template lang="pug">
  //- 数字输入框
  .kwc-control.el-number-control(:style="{'width': width + 'px'}")
    ElInputNumber(v-model="currentValue",
      controls-position="right",
      :min="min",
      :max="max",
      :step="step",
      :size="'small'",
      :precision="precision",
      :placeholder="'输入数字'")
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    precision: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: 0
    },
    value: {
      type: [Number, String],
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    width: {
      type: Number,
      default: 170,
      validator: val => {
        return typeof val === 'number' && val >= 70
      }
    }
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  created () {
    let isnum = typeof this.value === 'number'
    if (!isnum) {
      this.currentValue = Number(this.value)
    }
  },
  watch: {
    'currentValue': {
      handler (n, o) {
        this.$emit('input', n)
        this.$emit('onChange', n)
        this.$emit('onClick', n)
      },
      deep: true
    },
    'value': {
      handler (n, o) {
        this.currentValue = this.value
      },
      deep: true
    }
  }
}
</script>
