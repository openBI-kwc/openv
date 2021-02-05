<template lang="pug">
  .custom
    .content
      .required
        i.icon &#xe692;
        | SQL数据源
      Selection.select-by-bg(v-model="paramsData.sid" :option="dataList", @input="selectDB")
      .required
        i.icon &#xe692;
        | 数据表
      Selection.select-by-bg(v-model="paramsData.tablename" :option="dbTableList")
    .data-footer
      .bottom-button.confirm(@click="getDBData") 预览
</template>

<script>
import {
  GET_DATABASE,
  QUERY_DATATABLE
} from '@api/datasrc.js'
export default {
  props: {
    editData: null,
    params: null
  },
  data () {
    return {
      showExcel: false,
      // 参数
      paramsData: {
        sid: '未选择',
        tablename: '未选择',
        // 数据库配置
        base: ''
      },
      // 数据源
      dataList: [],
      // 数据表
      dbTableList: [{
        name: '未选择',
        value: '未选择'
      }]
    }
  },
  created () {
    if (this.editData) {
      this.paramsData = {
        sid: this.editData.sid,
        daid: this.editData.daid,
        tablename: this.editData.tablename
      }
    }
    this.getDBLinks()
  },
  methods: {
    // 向后端查询所有的数据库
    getDBLinks () {
      return new Promise(resolve => {
        GET_DATABASE({pageSize: 9999999999}).then(value => {
          if (value.err) return resolve()
          if (!value.data.length) {
            this.dataList = [{
              name: '未选择',
              value: '未选择',
              base: ''
            }]
            return resolve()
          }
          this.dataList = value.data.map(item => {
            return {
              name: item.basename,
              value: item.baseid,
              base: item.baseconfig
            }
          })
          this.paramsData.base = this.dataList[0].base
          this.paramsData.sid = this.dataList[0].value
          if (this.paramsData.base) this.queryDbTable()
          resolve()
        })
      })
    },
    queryDbTable () {
      QUERY_DATATABLE(this.paramsData.base).then((value) => {
        if (value.err) return
        if (!value.data.length) {
          this.dbTableList = [{
            name: '未选择',
            value: '未选择'
          }]
          return
        }
        this.dbTableList = value.data.map(o => {
          return {
            name: o,
            value: o
          }
        })
        this.paramsData.tablename = this.dbTableList[0].value
      })
    },
    // 选择数据源
    selectDB () {
      this.paramsData.base = this.dataList.filter(obj => {
        if (obj.value === this.paramsData.sid) {
          return obj
        }
      })[0].base
      if (!this.paramsData.base) return
      // 获取数据表
      this.queryDbTable()
    },
    // 预览
    getDBData () {
      this.paramsData = { ...this.paramsData, ...this.params }
      let msglist = {
        dataname: '名称没有设置!',
        sid: '数据源没有设置!',
        tablename: '没有选择数据表！'
      }
      for (let key in msglist) {
        let msg = msglist[key]
        if (this.paramsData[key] && this.paramsData[key] !== '未选择') {
          this.$emit('showPreview', {
            paramsData: this.paramsData,
            showPreview: true,
            isEditView: this.editData ? true : false
          })
        } else {
          return this.$toasting({
            type: 'warning',
            title: '警告',
            message: msg
          })
        }
      }
    }
  }
}
</script>

<style src="handsontable/dist/handsontable.css"></style>
