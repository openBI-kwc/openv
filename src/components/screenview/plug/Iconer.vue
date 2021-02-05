<template lang="pug">
  //- Icon组件
  .icon-com
    TooltipBox(:placement="chartData.textPos" :content="chartData.hoverText")
      .icon-wp.fa(@click="openURL" :style="fontIconSty" :class="classList")
</template>

<script>
import Utils from '@public/utils'
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
  methods: {
    openURL () {
      if (this.$route.name === 'screenediting') return
      if (!this.chartData.openURL || !this.chartData.link) return
      Utils.openURL(this.chartData.link, this.chartData.target)
    }
  },
  computed: {
    classList () {
      let anClass = {
        linear: 'fa-spin',
        'steps(8)': 'fa-pulse'
      }
      let { rotate, iconObj }= this.chartData
      let clsssArray = [rotate]
      clsssArray.push(iconObj.iconClass)
      if (iconObj.animation) {
        clsssArray.push(anClass[iconObj.animationType])
      }
      return clsssArray
    },
    fontIconSty () {
      let chartData = this.chartData
      let style = chartData.iconObj.style
      return {
        width: this.value.width + 'px',
        height: this.value.height + 'px',
        cursor: this.chartData.openURL && this.value.chartData.link ? 'pointer' : 'default',
        lineHeight: this.value.height + 'px',
        color: style.color,
        fontSize: style.fontSize + 'px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .icon-wp {
    text-align: center;
  }
</style>
