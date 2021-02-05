<template lang="pug">
  .panel-item
    .clickPanel(v-if="!chartData.dev", @click="$emit('onClick')", draggable='true', @dragstart="$emit('onDragStart')")
    .clickPanel.dev(v-else)
      .lock
        .icon &#xe60d;
        .text 未解锁
    .delCollection.icon(@click="delCollect(chartData.collectionid)", v-if="chartData.collection") &#xe69a;
    .lazy
      img(:src="'./static/assets/thumbnails/' + chartData.comkey + '.png'")
    .name {{chartData.name}}
</template>

<script>
import { DEL_COLLEC } from '@api/visualrelated.js'
export default {
  props: {
    chartData: Object
  },
  methods: {
    delCollect (collectionid) {
      // 显示删除提示框
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        DEL_COLLEC({collectionid, status: 0}).then(res => {
          if (res.err) return
          this.$toasting({
            title: '提示',
            type: 'success',
            message: res.data
          })
          this.$parent.getCollection()
        })
      })
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
    &:hover .delCollection {
      display: inline-block;
    }
    .delCollection{
      display: none;
      cursor: pointer;
      width: 12px;
      height: 12px;
      line-height: 12px;
      color: #1890FF;
      position: absolute;
      top: 5px;
      left: 10px;
      z-index: 10;
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
  .dev {
    cursor: no-drop;
  }
  .lock {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.4);
    line-height: 40px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .icon, .text {
      height: 20px;
      line-height: 20px;
    }
  }
</style>
