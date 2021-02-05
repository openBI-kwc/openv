<template lang="pug">
  .socket
    .content
      .required
        i.icon &#xe692;
        | WebSocket地址
      input.input-control(type="text", placeholder="ws://www.kwcnet.com/user/api", v-model="paramsData.filepath")
    .data-footer
      .bottom-button.confirm(v-if="editData", @click="editSourceData") 修改
      .bottom-button.confirm(v-else, @click="createNewData") 添加
</template>

<script>
import validator from '@public/validator.js'
import {
  ADD_API,
  UPDATE_DATA
} from '@api/datasrc.js'
export default {
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
    // 参数
    vaildParams () {
      this.paramsData = { ...this.paramsData, ...this.params }
      let msg = {
        dataname: '名称没有设置',
        filepath: 'WebSocket地址没有设置或输入错误'
      }
      const toast = (type) => {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: msg[type]
        })
      }
      for (const key in msg) {
        let type = key
        switch (type) {
          case 'dataname': {
            if (!this.paramsData[type]) {
              toast(type)
              return false
            }
            break
          }
          case 'filepath': {
            if (!validator.isWebsocket(this.paramsData[type])) {
              toast(type)
              return false
            }
            break
          }
        }
      }
      return true
    },
    // 添加
    createNewData () {
      if (!this.vaildParams()) return
      ADD_API(this.paramsData).then(value => {
        if (!value.err) {
          this.$toasting({
            type: 'success',
            title: '成功',
            message: value.data
          })
          this.$eventBus.$emit('CREATED_DBSOURCE')
          setTimeout(() => {
            this.$eventBus.$emit('CLOSE_DATAPOPUP', false)
          }, 16.7)
        }
      })
    },
    // 修改
    editSourceData () {
      if (!this.vaildParams()) return
      UPDATE_DATA(this.paramsData).then(value => {
        if (!value.err) {
          this.$toasting({
            type: 'success',
            title: '成功',
            message: '修改成功！'
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
