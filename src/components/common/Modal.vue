// 模态框
<template lang="pug">
  Popup(:text="text" v-if="show" @close="$emit('close')")
    .modal-box
      //- 内容区域
      .modal-content
        slot
      //- 底部按钮组
      .modal-btn-group
        template(v-if="showFooter")
          .modal-btn(@click="$emit('close')") 取消
          .modal-btn.confirm(@click="$emit('confrim')") 确定
        slot(v-else, name="footer")
</template>
<script>
export default {
  data () {
    return {
      shows: false
    }
  },
  props: {
    showFooter: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: '提示'
    },
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>
