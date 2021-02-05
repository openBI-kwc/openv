<template lang="pug">
  <!-- 渐变计数板组件 -->
  .gradient-board
    .clock(:style="countStyle")
      .count-section(v-for="(item, index) in counting" :key="index") {{item}}
    .text(:style="counttxtStyle") 计数名称: {{chartData.textStyle.name}}
</template>

<script>
import Utils from '@public/utils'
const { numberFormat } = Utils
export default {
  props: ['value'],
  data () {
    return {
      chartData: null
    }
  },
  created () {
    this.chartData = this.value.chartData
  },
  computed: {
    counting () {
      const { data, sumStyle } = this.chartData
      let str = ''
      if (typeof data !== 'number' || isNaN(data)) {
        str = '000'
      } else {
        str = data + ''
      }
      if (sumStyle.format) {
        return numberFormat(str, 2, '.', ',')
      }
      return str
    },
    countStyle () {
      let { fontSize, fontFamily, fontWeight } = this.chartData.sumStyle
      return {
        'fontSize': fontSize + 'px',
        'fontFamily': fontFamily,
        'fontWeight': fontWeight
      }
    },
    counttxtStyle () {
      let { fontSize, fontFamily, fontWeight, color } = this.chartData.textStyle
      return {
        'fontSize': fontSize + 'px',
        'color': color,
        'fontFamily': fontFamily,
        'fontWeight': fontWeight
      }
    }
  }
}
</script>

<style scoped>
.gradient-board {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;
  width: 100%;
  height: 100%;
}
.text {
  border-bottom: 1px solid #00B4F7;
  margin-left: -50px;
}
.clock {
  display: flex;
  align-content: flex-end;
  align-items: center;
  margin-top: 20px;
  background-image: linear-gradient(bottom right, #00B4F7, rgba(29, 112, 112, 1));
  -webkit-background-clip: text; 
  -webkit-text-fill-color: rgba(0,0,0,0); 
}
.count-section {
  margin: 0 10px;
  color: #00b4f7;
}
</style>
