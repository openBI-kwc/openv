<template lang="pug">
  //- 跑马灯组件
  .text-box(:style="styles" @click="openURL")
    span.text(ref="Text") {{value.chartData.data}}
    span.copy-text(ref="CopyText") {{value.chartData.data}}
</template>
<script>
import Utils from '@public/utils'
export default {
  props: {
    value: null
  },
  data () {
    return {
      timer: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    openURL () {
      if (this.$route.name === 'screenediting') return
      Utils.openURL(this.value.chartData.hexLink.link, this.value.chartData.hexLink.target)
    },
    init () {
      this.textDom = this.$refs['Text']
      this.copyTextDom = this.$refs['CopyText']
      this.copyTextDom.innerHTML = this.textDom.innerHTML
      clearInterval(this.timer)
      this.timer = setInterval(() => { this.move() }, this.value.chartData.speed)
    },
    move () {
      if (this.$el.scrollLeft >= this.textDom.offsetWidth) {
        this.$el.scrollLeft = 0
      } else {
        this.$el.scrollLeft += 1
      }
    }
  },
  watch: {
    value: {
      handler (n, o) {
        clearInterval(this.timer)
        this.timer = null
        this.init()
      },
      deep: true
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  },
  computed: {
    styles () {
      let obj = {
        fontSize: this.value.chartData.style.fontSize + 'px',
        color: this.value.chartData.style.color,
        fontFamily: this.value.chartData.style.fontFamily,
        fontWeight: this.value.chartData.style.fontWeight
      }
      if (this.value.chartData.hexLink.open) {
        obj.cursor = 'pointer'
      }
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
  .text-box {
    height: 100%;
    width: 100%;
    overflow: hidden;
    white-space:nowrap;
    display: flex;
    align-items: center;
  }
</style>
