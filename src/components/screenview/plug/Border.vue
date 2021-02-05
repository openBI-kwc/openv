<template lang="pug">
  //- 边框组件
  <div class="border" :style="sty"></div>
</template>
<script>
export default {
  data () {
    return {
      bordertypes: {
        fill: 'fill / 1 / 0 stretch',
        stretch: 'stretch'
      }
    }
  },
  props: {
    value: null
  },
  computed: {
    sty () {
      let { width, height, chartData } = this.value
      let { borderUrl, opacity, borderWidth, borderStretch } = chartData
      return {
        opacity: opacity / 100,
        borderStyle: 'solid',
        borderWidth: borderWidth.map(item => { return item + 'px ' }).join(''),
        borderImage: `url(${borderUrl}) ${borderWidth.join(' ')} ${this.bordertypes[borderStretch]}`,
        width: width + 'px',
        height: height + 'px'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.border {
  transform: translateZ(0);
  background: none;
  pointer-events: none;
}

</style>
