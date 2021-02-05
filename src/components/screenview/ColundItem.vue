<template lang="pug">
  .panel-item
    .clickPanel(@click="$emit('onClick')", draggable='true', @dragstart="$emit('onDragStart')")
    .lazy
      img(:src="modulePicture")
    .name {{chartData.name}}
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    chartData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState(['setting']),
    modulePicture () {
      const { modulePicture, pluginPath } = this.chartData.chartData
      const { server } = this.setting
      return server + pluginPath + '/' + modulePicture
    }
  }
}
</script>

<style lang="less" scoped>
  .panel-item {
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: relative;
    margin: 5px;
    &:hover .lazy {
      background: #29303C;
      border: 1px solid #219AF2;
    }
    .lazy {
      width: 80px;
      height: 80px;
      position: relative;
      margin: 0 auto;
      background: #29303C;
      opacity: .85;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }
    .name {
      width: 100%;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #d8cfbf;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      position: absolute;
      bottom: 0;
      left: 0;
      user-select: none;
    }
  }
  .clickPanel {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 9;
  }
</style>
