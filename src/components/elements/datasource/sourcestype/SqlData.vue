<template lang="pug">
  .sql
    .content
      .required
        i.icon &#xe692;
        | SQL数据源
      Selection.select-by-bg(v-model="paramsData.sid", :width="350" :option="dataList")
    .data-footer
      .bottom-button.confirm(@click="getDBPreview") 预览
</template>

<script>
import {
  GET_DATABASE
} from '@api/datasrc.js'
export default {
  props: {
    editData: null,
    params: null
  },
  data () {
    return {
      dataList: [],
      paramsData: {
        sid: '未选择'
      }
    }
  },
  created () {
    this.getDblinks()
  },
  methods: {
    // 向后端查询所有的数据库连接
    getDblinks () {
      return new Promise(resolve => {
        GET_DATABASE({pageSize: 9999999999}).then(value => {
          if (value.err) return
          if (!value.data.length) {
            this.dataList = [{ name: '未选择', value: '未选择' }]
            return
          }
          this.dataList = value.data.map(item => {
            return {
              name: item.basename,
              value: item.baseid
            }
          })
          this.paramsData = { ...this.paramsData, ...this.params }
          this.paramsData.sid = this.dataList[0].value
          if (this.editData) {
            const {sid, returnsql, daid} = this.editData
            this.paramsData = {sid, returnsql, daid}
          }
          resolve()
        })
      })
    },
    // 参数
    vaildParams () {
      this.paramsData = { ...this.paramsData, ...this.params }
      let msglist = {
        dataname: '名称没有设置',
        sid: 'SQL数据源没有设置'
      }
      for (let key in msglist) {
        let val = this.paramsData[key]
        if (msglist[key] && !val) {
          this.$toasting({
            type: 'warning',
            title: '警告',
            message: msglist[key]
          })
          return false
        }
      }
      return true
    },
    // 预览
    getDBPreview () {
      if (!this.vaildParams()) return
      this.$emit('showPreview', {
        paramsData: this.paramsData,
        showPreview: true,
        isEditView: this.editData ? true : false
      })
    }
  }
}
</script>
