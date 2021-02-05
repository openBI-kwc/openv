<template lang="pug">
  //- 下拉单选框
  .kwc-control.el-selection-control(:style="{'width': width + 'px'}")
    ElSelect(v-model="selectedValue",
      :multipleLimit="multipleLimit",
      :multiple="multiple",
      :disabled="disabled",
      :collapseTags="collapseTags",
      :filterable="true",
      :popper-class="'kwc-popper-selection'",
      placeholder="请选择")
      ElOption(v-for="(item, index) in option",
        :key="index",
        :label="item.name",
        :value="item.value")
</template>
<script>
export default {
  props: {
    multipleLimit: {
      type: Number,
      default: 0
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 下拉选项
    option: {
      type: Array,
      default () {
        return []
      }
    },
    // 传回父组件的选择值
    value: {
      type: [Number, String, Object, Array],
      default: ''
    },
    width: {
      type: Number,
      default: 170
    }
  },
  data () {
    return {
      selectedValue: this.value
    }
  },
  watch: {
    selectedValue: {
      handler (n, o) {
        this.$emit('input', this.selectedValue)
        this.$emit('onChange', this.selectedValue)
      },
      deep: true
    },
    value: {
      handler (n, o) {
        this.selectedValue = this.value
      },
      deep: true
    }
  }
}
</script>
