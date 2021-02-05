<template lang="pug">
  //- 大屏坐标提示线
  .grid-line
    .grid-line-top
    .grid-line-left
    .grid-line-label {{coord.x}}, {{coord.y}}
</template>
<script>
export default {
  props: ['coord', 'scale']
}
</script>
<style lang="less" scoped>
  /* 位置线 */
  .grid-line .grid-line-top {
    position: absolute;
    border-left: 1px dashed #09f;
    width: 0;
    height: 10000px;
    left: -1px;
    transform: translateY(-100%);
  }
  .grid-line .grid-line-left {
    position: absolute;
    border-top: 1px dashed #09f;
    width: 10000px;
    height: 0;
    top: -1px;
    transform: translateX(-100%);
  }
  .grid-line .grid-line-label {
    position: absolute;
    padding: 5px;
    font-size: 16px;
    transform: translate(-100%, -100%);
    color: #09f;
    white-space: nowrap;
  }
</style>
