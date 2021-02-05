<template lang="pug">
  //- 富文本
  .custom-box(v-html="value.chartData.data")
</template>

<script>
export default {
  props: {
    value: null
  }
}
</script>

<style lang="less" scoped>
  .custom-box {
    overflow: auto;
    width: 100%;
    height: 100%;
    box-sizing: border-box !important;
  }
</style>
