<template lang="pug">
  //- 网页组件
  .web-iframe(:style="{width: value.width + 'px', height: value.height + 'px'}")
    .iframe-mask
    iframe.iframe-box(:src="value.chartData.src" frameborder="0" width="100%" height="100%" scrolling="no" seamless)
</template>

<script>
export default {
  props: {
    value: null
  }
}
</script>
<style lang="less" scoped>
  .web-iframe {
    .iframe-box {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
    .iframe-mask {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }
  }
  
</style>
