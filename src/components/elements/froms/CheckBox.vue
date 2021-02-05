<template lang="pug">
  //- 多选和单选框组件
  span.kwc-control.el-check-control
    template(v-if="type === 'checkbox'")
      input.checkbox(type="checkbox" :checked="value" :id="id" :disabled="disabled" @change="updateValue")
      label.check-label(:for="id" :class="{'active': active}")
        svg(viewBox="0,0,50,50")
          path(d="M5 30 L 20 45 L 45 5")
    template(v-if="type === 'radio' && radioActive ")
      input.checkbox(type="radio" :checked="value === radioActive" :id="id" :disabled="disabled" @change="updateValue")
      label.check-label(:for="id" :class="{'active': active}")
        svg(viewBox="0,0,50,50")
          path(d="M5 30 L 20 45 L 45 5")
</template>

<script>
import Utils from '@public/utils'
const { unid } = Utils
export default {
  props: {
    // checkbox radio
    type: {
      type: String,
      default: 'checkbox'
    },
    value: {
      type: [Boolean, String, Number, Array],
      default: false
    },
    radioActive: {
      type: [Boolean, String, Number, Array],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      id: unid()
    }
  },
  computed: {
    active () {
      return this.type === 'checkbox' ? !!this.value : (this.type === 'radio' ? this.value === this.radioActive : false)
    }
  },
  methods: {
    updateValue () {
      if (this.disabled) return
      if (this.type === 'radio' && this.value === this.radioActive) return
      let value = this.type === 'checkbox' ? !this.value : (this.type === 'radio' ? this.radioActive : '')
      this.$emit('input', value)
      this.$emit('onChange', value)
    }
  }
}
</script>

<style scoped lang="less">
  .checkbox {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    z-index: -1;
    & + .check-label {
      display: block;
      width: 14px;
      height: 14px;
      cursor: pointer;
      transition: all .2s ease;
      background:rgba(24,144,255,0.1);
      border:1px solid rgba(24, 144, 255, 0.4);
      border-radius:2px;
    }
    & + .check-label.active {
      background: #219AF2;
    }
    &:checked + .check-label svg path {
      stroke-dashoffset: 0;
    }
  }
  .check-label {
    border: 1px solid #d9d9d9;
    background: #f5f5f5;
    position: relative;
    svg {
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      path {
        fill: none;
        stroke: #ffffff;
        stroke-width: 2px;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 100;
        stroke-dashoffset: 100;
        transition: all 350ms cubic-bezier(1, 0, 0.37, 0.91);
      }
    }
  }
</style>
