<template lang="pug">
  //- 超连接组件
  .link-box(:style="linkStyle")
    marquee(v-if="this.value.chartData.marquee", onMouseOut="this.start()" onMouseOver="this.stop()", :scrollamount="value.chartData.scrollamount")
      a.link(:class="{'underline': value.chartData.underline}"
        :href="value.chartData.link"
        :target="value.chartData.target"
        @mouseenter="enter",
        @mouseleave="leave") {{value.chartData.text}}
    a.link(v-else, :class="{'underline': value.chartData.underline}"
      :href="value.chartData.link"
      :target="value.chartData.target"
      @mouseenter="enter",
      @mouseleave="leave") {{value.chartData.text}}
</template>
<script>
export default {
  props: {
    value: null
  },
  methods: {
    enter (e) {
      let hoverColor = this.value.chartData.hoverColor
      if (!hoverColor) return
      e.target.style.color = hoverColor
    },
    leave (e) {
      e.target.style.color = ''
    }
  },
  computed: {
    linkStyle () {
      const { style } = this.value.chartData
      return {
        fontSize: style.fontSize + 'px',
        color: style.color,
        justifyContent: style.justifyContent,
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        background: style.background
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .link-box {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .link {
    color: inherit;
    word-wrap: break-word;
    &.underline {
      text-decoration: underline;
    }
  }
</style>
