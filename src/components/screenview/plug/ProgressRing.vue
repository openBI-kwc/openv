<template lang="pug">
  <!-- 环形进度条 -->
  .progress-circle
    svg(xmlns="http://www.w3.org/200/svg" height="110" width="110")
      defs(v-if="value.chartData.ringStyle[0].colorTypes === 'gradient'")
        linearGradient#grad1(x1='0%', y1='0%', x2='100%', y2='100%')
          stop(offset='0%', :stop-color="value.chartData.ringStyle[0].doublecolor[0]")
            //- <animate attributeName="stop-color" values="lightblue;blue;red;red;black;red;red;purple;lightblue" dur="14s" repeatCount="indefinite" />
          stop(offset='100%', :stop-color="value.chartData.ringStyle[0].doublecolor[1]")
      defs(v-if="value.chartData.ringStyle[1].colorTypes === 'gradient'")
        linearGradient#grad2(x1='0%', y1='0%', x2='100%', y2='100%')
          stop(offset='0%', :stop-color="value.chartData.ringStyle[1].doublecolor[0]")
            //- <animate attributeName="stop-color" values="lightblue;blue;red;red;black;red;red;purple;lightblue" dur="14s" repeatCount="indefinite" />
          stop(offset='100%', :stop-color="value.chartData.ringStyle[1].doublecolor[1]")
      circle(cx="55"
        cy="55"
        r="50"
        fill="none"
        :stroke="value.chartData.ringStyle[0].colorTypes==='gradient'? strokLeft : value.chartData.ringStyle[0].singlecolor"
        stroke-width="5"
        stroke-linecap="round")
      circle(class="demo2"
        ref="J_demo2"
        cx="55"
        cy="55"
        r="50"
        fill="none"
        :stroke="value.chartData.ringStyle[1].colorTypes==='gradient'? strokRight : value.chartData.ringStyle[1].singlecolor"
        stroke-width="5"
        stroke-dasharray="0 10000")
    .text(:style="getStyle()") {{ Math.round((value.chartData.num / value.chartData.total) * 100) + "%"}}
</template>

<script>
export default {
  props: {
    value: null
  },
  data () {
    return {
      num: this.value.chartData.num,
      strokLeft: "url('#grad1')",
      strokRight: "url('#grad2')"
    }
  },
  mounted () {
    this.circle()
  },
  updated () {
    this.circle()
  },
  computed: {
  },
  methods: {
    getStyle () {
      return {
        fontSize: this.value.chartData.style.fontSize + 'px',
        lineHeight: this.value.chartData.lineHeight + 'px',
        color: this.value.chartData.style.color,
        justifyContent: this.value.chartData.style.justifyContent,
        fontFamily: this.value.chartData.style.fontFamily,
        alignItems: this.value.chartData.style.alignItems,
        fontWeight: this.value.chartData.style.fontWeight
      }
    },
    circle () {
      let demo2 = this.$refs.J_demo2
      let circleLength = Math.floor(2 * Math.PI * demo2.getAttribute('r'))
      let val = this.value.chartData.num
      val = Math.max(0, val)
      val = Math.min(100, val)
      demo2.setAttribute(
        'stroke-dasharray',
        '' + (circleLength * val) / this.value.chartData.total + ',10000'
      )
    }
  }
}
</script>
<style lang="less" scoped>
.progress-circle{
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.demo2 {
  transform-origin: 55px 55px;
  transform: rotate(-90deg);
  transition: stroke-dasharray 0.3s ease-in;
}
.text {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
