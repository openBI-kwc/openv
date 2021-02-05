<template lang="pug">
  <!-- 边框计数板组件 -->
  .board
    .count-section(v-for="(item, ind) in counting" :key="ind" :style="countStyle") {{counting[ind]}}
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      chartData: null
    }
  },
  watch: {
    'value.chartData.data' (n, o) {
      if (!n) return
      this.chartData.data = n
    }
  },
  created () {
    this.chartData = this.value.chartData
  },
  computed: {
    counting () {
      const { data } = this.chartData
      let P = ''
      if (typeof data !== 'number' || isNaN(data)) {
        P = '0'
      } else {
        P = data + ''
      }
      return P.padStart(3, 0)
    },
    countStyle () {
      const { borderStyle, textStyle, useBorder } = this.chartData
      let style = {
        fontSize: textStyle.fontSize + 'px',
        color: textStyle.color,
        fontFamily: textStyle.fontFamily,
        fontWeight: textStyle.fontWeight,
        opacity: borderStyle.opacity / 100
      }
      if (useBorder) {
        style = { 
          ...style,
          borderStyle: 'solid',
          borderWidth: borderStyle.borderWidth.map(item => { return item + 'px ' }).join(''),
          borderImage: `url(${borderStyle.borderType}) ${borderStyle.borderWidth.join(' ')} fill / 1 / 0 stretch`
        }
      }
      return style
    }
  }
}
</script>

<style scoped>
.board {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.count-section {
  box-sizing: content-box;
  text-align: center;
  margin:0 5px;
}
</style>
