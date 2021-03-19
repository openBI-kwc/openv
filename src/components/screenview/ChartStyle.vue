//- 样式配置
<template lang="pug">
  .panel-items(v-if="position[index]")
    //- 图表的名字
    .chart-name
      .text {{position[index].name}}
      .view
        .btn(@click="viewType = 'form'" :class="{'active' : viewType === 'form'}") 视图
        .btn(@click="viewType = 'json'" :class="{'active' : viewType === 'json'}") JSON
    //- 基础配置
    BasicAttr
    template(v-if="chartOpt")
      .json(v-if="viewType === 'json'")
        ChartConfigDebug
      component(v-if="viewType === 'form' && componentId" :is="componentId")
</template>
<script>
import { mapState } from 'vuex'
import chartRender from '@assets/json/chartRender'
export default {
  data () {
    return {
      chartOpt: null,
      // json
      viewType: 'form'
    }
  },
  created () {
    this.chartOpt = this.position[this.index]
  },
  computed: {
    ...mapState(['position', 'index', 'setting']),
    debug () {
      return process.env.NODE_ENV !== 'production'
    },
    componentId () {
      let { charttype } = this.chartOpt
      let chartObj = chartRender.filter(item => {
        if (item.ctype === charttype) {
          return item
        }
      })
      return chartObj[0].configCom
    }
  }
}
</script>
<style lang="less" scoped>
.panel-items {
  width: 100%;
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  .json {
    width: 100%;
    flex: 1;
    overflow: auto;
    padding-bottom: 10px;
  }
  .chart-name {
    width: 100%;
    height: 39px;
    line-height: 40px;
    text-indent: 10px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .view {
      display: flex;
      align-items: center;
      padding-right: 10px;
      .btn {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        margin: 0 2px;
        &.active {
          color: #219AF2;
        }
      }
    }
  }
}
</style>
