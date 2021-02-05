<template lang="pug">
  //- 标题文本组件
  .text-box(:style="textStyle" :class="{'gradient': value.chartData.style.textColor.type === 'gradient'}" v-html="value.chartData.text")
</template>
<script>
export default {
  props: {
    value: null
  },
  computed: {
    textStyle () {
      const sty = this.value.chartData.style
      let textObj = {
        fontSize: sty.fontSize + 'px',
        fontFamily: sty.fontFamily,
        fontWeight: sty.fontWeight,
        justifyContent: sty.justifyContent,
        alignItems: sty.alignItems
      }
      let { gradType, type } = sty.textColor
      if (type === 'danse') {
        textObj.color = sty.textColor.color
      } else if (type === 'gradient') {
        if (gradType === 'linear-gradient') {
          textObj.backgroundImage = `linear-gradient(90deg,${sty.textColor.startColor},${sty.textColor.endColor})`
        } else if (gradType === 'radial-gradient') {
          textObj.backgroundImage = `radial-gradient(circle,${sty.textColor.startColor},${sty.textColor.endColor})`
        }
      }
      return textObj
    }
  }
}
</script>
<style lang="less" scoped>
  .text-box {
    height: 100%;
    width: 100%;
    user-select: none;
    display: flex;
    white-space: nowrap;
    &.gradient {
      -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
    }
  }
</style>
