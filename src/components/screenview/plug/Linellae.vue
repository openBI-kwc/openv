<template lang="pug">
  //- 线条组件
  <div class="line-box">
    <div class="line" :style="lineStyle"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: null
  },
  data () {
    return {
      chartData: null
    }
  },
  created () {
    this.chartData = this.value.chartData
  },
  computed: {
    lineStyle () {
      return {
        opacity: (this.chartData.opacity / 10).toFixed(2),
        background: `url(${this.chartData.lineUrl}) left center repeat-x`,
        transform: `rotate(${this.chartData.rotate}deg)`,
        height: this.chartData.weight + 'px',
        backgroundSize: '100%'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.line-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .line {
    margin: auto;
    max-width: 90%;
    width: 100%;
  }
}
</style>
