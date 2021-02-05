<template>
  <div class="dropzone" @click="checkFile" @drop="selectFile" @dragleave="stop" @ragover="stop" @dragenter="stop" @dragover="stop">
    <input ref="dropzoneInput" type="file" :accept="accept" @change="selectFile" :multiple="multiple"/>
    <slot class="slot"></slot>
  </div>
</template>

<script>
export default {
  props: {
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    stop (e) {
      e.preventDefault()
    },
    selectFile (e) {
      e.preventDefault()
      this.$emit('onChange', e)
    },
    checkFile () {
      this.$refs['dropzoneInput'].click()
    }
  }
}
</script>

<style scoped>
  .dropzone {
    position: relative;
    height: 200px;
    background-color: blue;
  }
  input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    display: none;
  }
  .slot {
    pointer-events: none;
  }
</style>
