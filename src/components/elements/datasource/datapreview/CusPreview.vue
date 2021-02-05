<template lang="pug">
  .Handsontable-wp
    .table-wp
      #Handsontable_TABLE(ref="handsontable")
    .data-footer
      .bottom-button(@click="$emit('goPrevStep')") 上一步
      .bottom-button.confirm(v-if="isEditView", @click="editItem") 修改
      .bottom-button.confirm(v-else, @click="addCusData") 添加
</template>
<script>
import Handsontable from 'handsontable'
import {
  GET_TABLEDATA,
  ADD_CUSTOM,
  UPDATE_CUSTOM
} from '@api/datasrc.js'
export default {
  props: {
    previewParams: null,
    isEditView: false
  },
  data () {
    return {     
      tableList: null,
      // 表格数据
      tableData: null,
      // 表格实例
      table: null,
      // 选择的数据
      selectData: null,
      value: '',
      data: {},
      baseconfig: {}
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 参数
    getParams () {
      const dataArr = this.table.getSelected()
      if (!dataArr) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '没有选择数据!'
        })
        return false
      }
      this.selectData = this.table.getData(dataArr[0][0], dataArr[0][1], dataArr[0][2], dataArr[0][3])
      return true
    },
    // 获取数据
    getTableData () {
      if (this.previewParams.tablename === '未选择') return
      // 获取数据表数据
      GET_TABLEDATA({
        dbconfig: this.previewParams.base,
        table: this.previewParams.tablename
      }).then(value => {
        if (value.err) return
        this.tableData = value.data
        // 展示表格
        setTimeout(() => {
          let container = this.$refs['handsontable']
          this.table = new Handsontable(container, {
            colHeaders: this.tableData.title,
            data: this.tableData.data,
            selectionMode: 'range',
            outsideClickDeselects: false,
            manualColumnResize: true,
            manualRowResize: true,
            startCols: 10,
            startRows: 10,
            minCols: 20,
            minSpareRows: 30,
            stretchH: 'all'
          })
        }, 0)
      })
    },
    // 添加
    addCusData () {
      this.getParams()
      if (this.selectData) {
        let { cid, sid, datanme, datatype, dataname } = this.previewParams
        let params = {
          data: this.selectData,
          table: this.previewParams.tablename,
          ...{ cid, sid, datanme, datatype, dataname }
        }
        ADD_CUSTOM(params).then(value => {
          if (!value.err) {
            this.$toasting({
              type: 'success',
              title: '成功',
              message: '添加成功！'
            })
            this.$eventBus.$emit('CREATED_DBSOURCE')
            setTimeout(() => {
              this.$eventBus.$emit('CLOSE_DATAPOPUP', false)
            }, 16.7)
          }
        })
      }
    },
    // 修改
    editItem () {
      this.getParams()
      let { cid, sid, datanme, datatype, dataname } = this.previewParams
      let params = {
        data: this.selectData,
        table: this.previewParams.tablename,
        ...{ cid, sid, datanme, datatype, dataname }
      }
      if (this.isEditView) {
        params['daid'] = this.previewParams.daid
      }
      if (this.selectData) {
        UPDATE_CUSTOM(params).then(value => {
          if (!value.err) {
            this.$toasting({
              type: 'success',
              title: '成功',
              message: '数据修改成功!'
            })
            this.$eventBus.$emit('CREATED_DBSOURCE')
            setTimeout(() => {
              this.$eventBus.$emit('CLOSE_DATAPOPUP', false)
            }, 16.7)
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .Handsontable-wp {
    height: 100%;
    .table-wp {
      width: 100%;
      height: calc(100% - 52px);
      margin-bottom: 10px;
      margin-top: 10px;
      overflow: auto;
    }
  }
</style>
