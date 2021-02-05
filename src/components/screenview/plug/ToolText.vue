<template lang="pug">
  //- 单行文本组件
  .text-box
    marquee.text(v-if="value.chartData.marquee", :style="value.chartData.style") {{value.chartData.text}}
    .text(v-else, :style="styles") {{value.chartData.text}}
</template>
<script>
export default {
  props: {
    value: null
  },
  computed: {
    styles () {
      return {
        fontSize: this.value.chartData.style.fontSize + 'px',
        lineHeight: this.value.chartData.height + 'px',
        color: this.value.chartData.style.color,
        justifyContent: this.value.chartData.style.justifyContent,
        backgroundColor: this.value.chartData.style.backgroundColor,
        fontFamily: this.value.chartData.style.fontFamily,
        alignItems: this.value.chartData.style.alignItems,
        fontWeight: this.value.chartData.style.fontWeight
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .text-box {
    height: 100%;
    width: 100%;
  }
  .text {
    height: 100%;
    width: 100%;
    line-height: 40px;
    font-size: 30px;
    word-wrap: break-word;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
