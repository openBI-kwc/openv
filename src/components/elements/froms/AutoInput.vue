<template lang="pug">
  //- 自动类型的输入框
  .kwc-control.el-text-control(:style="{'width': width + 'px'}")
    ElInput(v-model="currentValue",
      :type="type",
      :show-word-limit="showWord",
      :placeholder="placeholder",
      :clearable="clearable",
      :disabled="disabled",
      :min="min",
      :autocomplete="autocomplete",
      :readonly="readonly",
      @blur="$emit('onBlur', currentValue)")
</template>
<script>
export default {
  props: {
    value: [String, Number],
    width: {
      type: Number,
      default: 170
    },
    type: {
      type: String,
      default: 'text'
    },
    showWord: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: 'on'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentValue: ''
    }
  },
  created () {
    this.currentValue = this.value
  },
  watch: {
    currentValue: {
      handler (n, o) {
        this.$emit('input', this.currentValue)
        this.$emit('onClick', this.currentValue)
        this.$emit('onChange', this.currentValue)
      },
      deep: true
    },
    value: {
      handler (n, o) {
        this.currentValue = this.value
      },
      deep: true
    }
  }
}
</script>
