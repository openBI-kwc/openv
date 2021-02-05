<template lang="pug">
  //- 进度条组件
  .progress-box
    .label(:style="styles") {{ Math.round((value.chartData.num / value.chartData.total) * 100) + "%"}}
    progress(:value="value.chartData.num", :max="value.chartData.total", :style="progress")
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
    },
    progress () {
      return {
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .progress-box {
    height: 100%;
    width: 100%;
  }
  .label {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    font-size: 40px;
  }
  progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
  }
</style>
