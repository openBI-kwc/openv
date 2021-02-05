<template lang="pug">
  //- 图片图表组件
  .imgage-com(:style="imgStyle")
    .text(v-if="!value.chartData.url") 请上传图片
</template>

<script>
export default {
  props: {
    value: null
  },
  computed: {
    imgStyle () {
      const { style, url } = this.value.chartData
      return {
        lineHeight: this.value.height + 'px',
        opacity: style.opacity / 10,
        background: `url(${url}) center center / ${style.backgroundSize} no-repeat`,
        transform: `rotate(${style.rotate})`
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .imgage-com {
    width: 100%;
    height: 100%;
    .text {
      color: #ccc;
      font-size: 20px;
      text-align: center;
    }
  }
</style>
