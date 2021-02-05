<template lang="pug">
  .excel
    .content
      .required
        i.icon &#xe692;
        | 上传文件
      Dropzone.upload-panel(@getFile="uploadFile", accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel")
        .icon &#xe629;
        .text 文件大小不得超过
          span.bolb 5MB
    .data-footer
      .bottom-button.confirm(v-if="editData", @click="editSource") 修改
      .bottom-button.confirm(v-else, @click="addNewSource") 添加
</template>

<script>
import Utils from '@public/utils'
import { UPLOAD_FILE } from '@api/upload.js'
import { ADD_EXCEL, UPDATE_DATA } from '@api/datasrc.js'
const Dropzone = () => import('dropzone-puge')
const { formParams } = Utils
export default {
  components: {
    Dropzone
  },
  props: {
    editData: null,
    params: null
  },
  data () {
    return {
      // 参数
      paramsData: {
        filepath: ''
      }
    }
  },
  created () {
    this.paramsData = { ...this.paramsData, ...this.params }
    if (this.editData) {
      const {daid, filepath} = this.editData
      this.paramsData = {daid, filepath}
    }
  },
  methods: {
    // 上传
    uploadFile (event) {
      let params = formParams(event, 'file')
      // 发送请求
      UPLOAD_FILE(params).then((response) => {
        if (!response.err) {
          this.$toasting({
            type: 'success',
            title: '成功',
            message: '文件上传成功!'
          })
          this.paramsData.filepath = response.data
        }
      })
    },
    // 验证参数
    vaildParams () {
      this.paramsData = { ...this.paramsData, ...this.params }
      let msg = {
        dataname: '名称没有设置!',
        filepath: '文件没有上传!'
      }
      for (let key in msg) {
        let val = this.paramsData[key]
        if (msg[key] && !val) {
          this.$toasting({
            type: 'warning',
            title: '警告',
            message: msg[key]
          })
          return false
        }
        return true
      }
    },
    // 添加
    addNewSource () {
      if (!this.vaildParams()) return
      ADD_EXCEL(this.paramsData).then((value) => {
        if (!value.err) {
          this.$toasting({
            type: 'success',
            title: '成功',
            message: '添加成功!'
          })
          this.$eventBus.$emit('CREATED_DBSOURCE')
          setTimeout(() => {
            this.$eventBus.$emit('CLOSE_DATAPOPUP', false)
          }, 16.7)
        }
      })
    },
    // 修改
    editSource () {
      if (!this.vaildParams()) return
      UPDATE_DATA(this.paramsData).then((value) => {
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

<style lang="less" scoped>
  .content {
    margin-bottom: 20px;
  }
  .excel .upload-panel {
    height:120px;
    background:rgba(0,53,103,1);
    border:1px solid rgba(0,71,157,1);
    margin-bottom: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .icon {
      color: #1f81f7b3;
      font-size: 30px;
      width: 30px;
      line-height:30px;
      text-align: center;
    }
    .text {
      text-align: center;
      font-size:14px;
      color:rgba(255,255,255,0.8);
      line-height:30px;
    }
  }
</style>
