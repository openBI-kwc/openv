<template lang="pug">
  //- 直线组件
  .line(:style="getStyle()" :width="value.width" :height="value.height")
</template>

<script>
export default {
  props: {
    value: Object
  },
  methods: {
    getStyle () {
      let opt = this.value.chartData
      return {
        'opacity': opt.opacity / 10,
        'height': this.value.height - 2 + 'px',
        'width': this.value.width - 2 + 'px',
        'backgroundColor': opt.background,
        'borderTop': opt.showTopBorder ? `1px solid ${opt.borderColor}` : 'none',
        'borderRight': opt.showRightBorder ? `1px solid ${opt.borderColor}` : 'none',
        'borderBottom': opt.showBottomBorder ? `1px solid ${opt.borderColor}` : 'none',
        'borderLeft': opt.showLeftBorder ? `1px solid ${opt.borderColor}` : 'none'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .line {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
</style>
