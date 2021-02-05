<template lang="pug">
  //- 多行文本组件
  .text-box
    .text(:style="styles", :class="{active: value.chartData.style.animation}") {{value.chartData.text}}
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
        lineHeight: this.value.chartData.style.lineHeight + 'px',
        color: this.value.chartData.style.color,
        justifyContent: this.value.chartData.style.justifyContent,
        backgroundColor: this.value.chartData.style.backgroundColor,
        fontFamily: this.value.chartData.style.fontFamily,
        alignItems: this.value.chartData.style.alignItems,
        fontWeight: this.value.chartData.style.fontWeight,
        textIndent: this.value.chartData.style.textIndent + 'em'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .text-box {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .text {
    height: 100%;
    width: 100%;
    line-height: 20px;
    font-size: 30px;
    word-wrap: break-word;
    user-select: none;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .active {
    animation: move 3s infinite;
  }
  @keyframes move {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-100%);
    }
  }
</style>
