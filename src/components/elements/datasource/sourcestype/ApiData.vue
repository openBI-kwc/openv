<template lang="pug">
  .api
    .content
      .required
        i.icon &#xe692;
        | API地址
      .icon.questions(v-tooltip="tips") &#xe662;
      input.input-control(type="text", placeholder="http://www.openbi.com.cn/user/api", v-model="paramsData.filepath")
    .data-footer
      .bottom-button(v-if="editData", @click="editSourceData") 修改
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
      },
      tips: 'api 数据格式:' + JSON.stringify([{
        'value': 20,
        'name': '张三'
      }, {
        'value': 40,
        'name': '李四'
      }], null, 2)
    }
  },
  created () {
    this.paramsData = { ...this.paramsData, ...this.params }
    if (this.editData) {
      const {filepath, daid} = this.editData
      this.paramsData = {filepath, daid}
    }
  },
  methods: {
    // 参数
    vaildParams () {
      this.paramsData = { ...this.paramsData, ...this.params }
      let msg = {
        dataname: '名称没有设置',
        filepath: 'API地址没有设置或输入错误'
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
            if (!validator.isUrl(this.paramsData[type])) {
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

<style lang="less" scoped>
.content {
  position: relative;
  .questions {
    position: absolute;
    top: 6px;
    left: 80px;
    color: #fff;
  }
}
</style>
