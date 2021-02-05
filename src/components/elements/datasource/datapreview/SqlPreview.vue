<template lang='pug'>
  .preview-wp
    .sql-content
      .sqlstr
        MonacoEditer(v-model="sqlstr" :editorOptions="{ language: 'sql', theme: 'vs-dark'}")
      .viewdata
        MonacoEditer(v-model="viewdata", :editorOptions="{ language: 'json', readOnly: true, theme: 'vs-dark'}")
    .data-footer
      .bottom-button.confirm(@click="execute") 执行
      .bottom-button(@click="$emit('goPrevStep')") 上一步
      .bottom-button.confirm(v-if="isEditView", @click="editItem") 修改
      .bottom-button.confirm(v-else, @click="addNewSqlData") 添加
</template>

<script>
import { RUN_SQL, ADD_SQL, UPDATE_SQL } from '@api/datasrc.js'
export default {
  props: {
    previewParams: null,
    isEditView: false
  },
  data () {
    return {
      sqlstr: '',
      viewdata: {}
    }
  },
  created () {
    if (this.isEditView) {
      this.sqlstr = this.previewParams.returnsql
    }
  },
  watch: {
    sqlstr () {
      this.previewParams.returnsql = this.sqlstr
    }
  },
  methods: {
    // 执行SQl
    execute () {
      if (!this.validParams()) return
      let params = {
        sid: this.previewParams.sid,
        returnsql: this.previewParams.returnsql || this.sqlstr,
        type: this.previewParams.datatype
      }
      RUN_SQL(params).then(value => {
        if (!value.err) {
          this.viewdata = value.data
        } else {
          this.$toasting({
            type: 'error',
            title: '失败',
            message: 'SQL语句执行失败!'
          })
        }
      })
    },
    // 参数
    validParams () {
      if (!this.sqlstr) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '请填写SQL语句!'
        })
        return false
      }
      return true
    },
    // 添加SQL
    addNewSqlData () {
      if (!this.validParams()) return
      let params = {
        ...this.previewParams,
        returnsql: this.sqlstr
      }
      ADD_SQL(params).then(value => {
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
    },
    // 修改
    editItem () {
      if (!this.validParams()) return
      let params = {
        ...this.previewParams,
        returnsql: this.sqlstr
      }
      UPDATE_SQL(params).then(value => {
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
</script>

<style scoped lang='less'>
  .preview-wp {
    height: 100%;
    .sql-content {
      width: 100%;
      height: calc(100% - 52px);
      margin-bottom: 10px;
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .sqlstr, .viewdata {
        height: 100%;
        flex: 1;
      }
    }
  }
</style>
