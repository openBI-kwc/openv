<template lang="pug">
  .table-play-container
    .table-play-header
      .table-play-header-item.text-center(:style="thstyle", v-for="(item, index) in chartData.data.thead", :key="index") {{item}}
    .tabel-play-body(:style="{height: tbheight + 'px'}")
      .table-play-line.table-dashboard(v-for="(tr, trindex) in value.chartData.data.tbody", :key="trindex+'s'")
        .table-play-line-item.text-center(:style="trindex % 2 === 0 ? tddoublestyle : tdsinglestyle", v-for="(td, tdindex) in tr", :key="tdindex") {{td}}
      .table-play-line.table-dashboard(v-for="(tr, trindex) in value.chartData.data.tbody", :key="trindex+'v'")
        .table-play-line-item.text-center(:style="trindex % 2 === 0 ? tddoublestyle : tdsinglestyle", v-for="(td, tdindex) in tr", :key="tdindex") {{td}}
</template>
<script>
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
    // 双行表格内容
    tddoublestyle () {
      let chartData = this.chartData
      // 表头高
      let theadheight = chartData.theadstyle.height
      // 表格高
      let tableheight = this.value.height
      // 行数
      let rows = chartData.data.tbody.length
      let style = chartData.tbodystyle
      return {
        ...style,
        fontSize: style.fontSize + 'px',
        backgroundColor: style.doubleBg,
        height: (tableheight - theadheight) / rows + 'px'
      }
    },
    // 单行表格内容
    tdsinglestyle () {
      let chartData = this.chartData
      // 表头高
      let theadheight = chartData.theadstyle.height
      // 表格高
      let tableheight = this.value.height
      // 行数
      let rows = chartData.data.tbody.length
      let style = chartData.tbodystyle
      return {
        ...style,
        fontSize: style.fontSize + 'px',
        backgroundColor: style.singleBg,
        height: (tableheight - theadheight) / rows + 'px'
      }
    },
    // 表头
    thstyle () {
      let style = this.chartData.theadstyle
      return {
        ...style,
        fontSize: style.fontSize + 'px',
        height: style.height + 'px'
      }
    },
    tbheight () {
      return this.value.height - this.chartData.theadstyle.height
    }
  }
}
</script>
<style lang="less" scoped>
.text-left {
  justify-content: flex-start;
  text-align: left;
}
.text-right {
  justify-content: flex-end;
  text-align: right;
}
.text-center {
  justify-content: center;
  text-align: center;
}
.table-play-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .table-play-header {
    display: flex;
    align-items: center;
    overflow: hidden;
    .table-play-header-item {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
  }
  .tabel-play-body {
    overflow: hidden;
  }
  .table-play-line {
    overflow: hidden;
    vertical-align: middle;
    display: flex;
    align-items: center;
  }
  .table-play-line-item {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .table-play-line-content {
    width: 100%;
    overflow: hidden;
  }
}
</style>
