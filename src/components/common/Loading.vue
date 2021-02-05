<template lang="pug">
  //- loading组件
  .loading-box(:style="styles")
    .loading
</template>
<script>
export default {
  props: {
    styles: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="less" scoped>
  .loading-box {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 99;
    left: 0;
    top: 0;
    background:linear-gradient(135deg,#071628 0%,#243650 100%);
    .loading {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      overflow: visible;
      z-index: 99;
      width: 10%;
      height: 0;
      padding-top: 10%;
      background: url('~@assets/img/loading.gif') center center no-repeat;
      background-size: cover;
    }
  }

</style>
