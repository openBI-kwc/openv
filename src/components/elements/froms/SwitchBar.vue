<template lang="pug">
  //- 滑动块组件
  .kwc-control.el-switch-control
    ElSwitch(v-model="valClone" :active-value="activeValue" :inactive-value="inactiveValue")
</template>
<script>
export default {
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    }
  },
  data () {
    return {
      valClone: false
    }
  },
  watch: {
    value: {
      handler () {
        this.valClone = this.value
      },
      immediate: true
    },
    valClone () {
      this.$emit('input', this.valClone)
      this.$emit('onClick', this.valClone)
      this.$emit('onChange', this.valClone)
    }
  }
}
</script>
