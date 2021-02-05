<template lang="pug">
  .upload-box(@click="selectFile")
    img.img(:src="imgUrl ? imgUrl : './static/assets/img/logo.png'")
    input(type="file", @change="changeFileInput($event)", :accept="accept", ref="FILE")
</template>
<script>
export default {
  props: {
    imgUrl: {
      type: String,
      default: './static/assets/img/logo.png'
    },
    accept: {
      type: String,
      default: 'image/jpeg,image/png,image/bmp,image/gif,image/svg+xml'
    }
  },
  methods: {
    selectFile () {
      this.$refs['FILE'].click()
    },
    changeFileInput ($event) {
      this.$emit('onChange', $event)
    }
  }
}
</script>
<style lang="less" scoped>
  /* 上传按钮样式 */
  .upload-box {
    width: 150px;
    height: 150px;
    cursor: pointer;
    position: relative;
    display: inline-block;
    overflow: hidden;
    text-indent: 0;
    border: 1px solid #2e3e50;
    .img {
      width: 100%;
      height: 100%;
      position: absolute;
      top:0;
      left:0;
      background-color: rgba(0,0,0,0);
      object-fit: contain;
    }
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      visibility: hidden;
    }
  }
</style>
