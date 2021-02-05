<template lang="pug">
  //- 刻度面板
  .dashboard-grid-overlay(:style="gridStyles")
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['screenOption']),
    gridStyles () {
      let { gridSize, gridColor } = this.screenOption
      if (!gridColor) gridColor = '#1B4457'
      if (!gridSize) gridSize = 20
      return {
        'backgroundSize': `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px`,
        'backgroundImage': `linear-gradient(${gridColor} 1px, rgba(0,0,0,0) 0px),linear-gradient(90deg, ${gridColor} 1px, rgba(0,0,0,0) 0px)`
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .dashboard-grid-overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
