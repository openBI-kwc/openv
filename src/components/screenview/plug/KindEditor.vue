<template lang="pug">
  #richtext-editor
    VueRichEditer.rich(v-model="editorText"
      :resizeType="0",
      :uploadJson="setting.server + '/KindEditor/upload_json.php'")
</template>
<script>
import 'kindeditor/kindeditor-all.js'
import 'kindeditor/themes/default/default.css'
import { mapState } from 'vuex'
const VueRichEditer = () => import('vuerichediter')
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editorText: ''
    }
  },
  components: {
    VueRichEditer
  },
  computed: {
    ...mapState(['setting'])
  },
  created () {
    this.editorText = this.value
  },
  watch: {
    value: {
      handler (n, o) {
        this.editorText = this.value
      },
      immediate: false,
      deep: true
    },
    editorText: {
      handler (n, o) {
        this.$emit('input', this.editorText)
        this.$emit('onChange', this.editorText)
      },
      immediate: false,
      deep: true
    }
  }
}
</script>
