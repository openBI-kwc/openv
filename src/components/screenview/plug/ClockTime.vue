<template lang="pug">
//- 当前时间组件
.clock(:style="getStyle()")
  .icon(:style="iconStyle()") &#xe787;
  .date(:style="font()") {{currentTime}}
</template>

<script>
import Utils from '@public/utils'
export default {
  data () {
    return {
      date: +new Date(),
      clock: null
    }
  },
  props: {
    value: null
  },
  created () {
    setInterval(() => {
      this.date = +new Date()
    }, 1000)
  },
  computed: {
    currentTime () {
      let now = this.date
      return Utils.timeFormat(now, 'Y-m-d H:i:s')
    }
  },
  methods: {
    font () {
      return {
        'fontSize': this.value.chartData.fontSize + 'px'
      }
    },
    getStyle () {
      return {
        'color': this.value.chartData.color,
        'fontFamily': this.value.chartData.fontFamily,
        'fontWeight': this.value.chartData.fontWeight,
        'justifyContent': this.value.chartData.justifyContent,
        'alignItems': this.value.chartData.alignItems
      }
    },
    iconStyle () {
      return {
        'font-size': this.value.chartData.iconfontSize + 'px',
        'color': this.value.chartData.iconColor,
        'marginRight': this.value.chartData.iconRight + 'px'
      }
    }
  }
}
</script>

<style scoped>
  .clock {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: sans-serif;
    display: flex;
    position: relative;
    justify-content: center;
    overflow: hidden;
  }
  .date {
    margin-right: 20px;
  }
  .clock > div {
    display: flex;
  }

  .tick-hidden {
    opacity: 0;
  }
</style>
