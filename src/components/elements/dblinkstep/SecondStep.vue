<template lang="pug">
  .data-base
    form.content
      .required
        i.icon &#xe692;
        | 服务器
      input.input-control(type="text", placeholder="数据源连接域名", v-model="params.baseconfig.hostname")
      .required
        i.icon &#xe692;
        | 用户名
      input.input-control(type="text", placeholder="数据库用户名", v-model="params.baseconfig.username")
      .required
        i.icon &#xe692;
        | 密码
      input(type="text" style="display:none;")
      input.input-control(type="password", placeholder="数据库密码", v-model="params.baseconfig.password" autocomplete="off")
      template(v-if="params.baseconfig.type === 'oracle'")
        .required
          i.icon &#xe692;
          | 数据库名
        input.input-control(type="text", placeholder="数据库名", v-model="params.baseconfig.dbname")
      .required
        i.icon &#xe692;
        | 端口
      input.input-control(type="text", placeholder="数据库端口", v-model="params.baseconfig.hostport")
      .content-test
        button.test-button(@click="testConnection" :disabled="loading" :class="{'disabled': loading}")
          i.fa.fa-spinner.fa-spin(v-if="loading")
          | 测试连接
        Selection.select-database-name.select-by-bg(v-if="testpass" v-model="params.baseconfig.database" :option="databaseList")
      .da-link-tips
        .important.icon &#xe6bf;
        .da-link-tips-text
          .text 请确保数据库可以被公网访问
          .text 请确保数据库没有被防火墙禁止
          .text 请确保数据库域名能够被解析
          .text 请确保数据库已经启动
    .data-footer
      .bottom-button(@click="prevStep") 上一步
      .bottom-button.confirm(v-if="editData", @click="reviseData") 修改
      .bottom-button.confirm(v-else, @click="addDataBaseLink") 添加
</template>

<script>
import {TEST_CONNECTION, ADD_DATABASE, UPDATE_DATABASE} from '@api/datasrc.js'
import Utils from '@public/utils'
const { enBase64 } = Utils
const secondParams = {
  hostname: '',
  hostport: '',
  username: '',
  password: '',
  database: '',
  dbname: ''
}
export default {
  props: {
    editData: null,
    cate: {
      type: Array,
      default: () => []
    },
    sendData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      testpass: false,
      params: {},
      baseid: null,
      databaseList: []
    }
  },
  created () {
    this.initPrarms()
  },
  methods: {
    initPrarms () {
      let baseconfig = {...this.sendData.baseconfig, ...secondParams}
      this.params = Object.assign({}, this.sendData, {baseconfig})
      if (this.editData) {
        this.baseid = this.editData.baseid
        this.params = Object.assign({baseid: this.baseid}, this.sendData)
        this.params.baseconfig.password = ''
      }
    },
    // 参数
    getParams (isTest = false) {
      let config = this.params.baseconfig
      let vaildFileds = {
        hostname: '服务器地址没有设置',
        hostport: '服务器端口没有设置',
        username: '服务器用户名没有设置',
        password: '服务器密码没有设置'
      }
      for (let key in vaildFileds) {
        if (!config[key]) {
          this.$toasting({
            type: 'warning',
            title: '警告',
            message: vaildFileds[key]
          })
          return false
        }
      }
      if (!isTest && (!this.testpass || !config.database)) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '请先测试连接选择数据库'
        })
        return false
      }
      return true
    },
    // 添加数据
    addDataBaseLink () {
      if (!this.getParams()) return
      let pwd = this.params.baseconfig.password
      let pwdArgs = {
        password: enBase64(pwd),
        len: pwd.length
      }
      let baseconfig = Object.assign({}, this.params.baseconfig, pwdArgs)
      let params = Object.assign({}, this.params, { baseconfig })
      ADD_DATABASE(params).then((val) => {
        if (val.err) return
        this.$emit('nextStep')
      })
    },
    // 修改数据
    reviseData () {
      if (!this.getParams()) return
      let pwd = this.params.baseconfig.password
      let pwdArgs = {
        password: enBase64(pwd),
        len: pwd.length
      }
      let baseconfig = Object.assign({}, this.params.baseconfig, pwdArgs)
      let params = Object.assign({}, this.params, { baseconfig, baseid: this.baseid })
      UPDATE_DATABASE(params).then((val) => {
        if (val.err) return
        this.$emit('nextStep')
      })
    },
    // 测试连接
    testConnection () {
      if (!this.getParams(true)) return
      this.loading = true
      let pwd = this.params.baseconfig.password
      let params = {...this.params.baseconfig, ...{ password: enBase64(pwd), len: pwd.length }}
      TEST_CONNECTION(params).then((value) => {
        this.loading = false
        if (value.err) {
          this.testpass = false
          return
        }
        this.$toasting({
          type: 'success',
          title: '成功',
          message: '连接成功！'
        })
        this.databaseList = value.data.map((item) => { return { value: item, name: item } })
        this.params.baseconfig.database = this.databaseList[0].value
        // 修改
        if (this.editData) {
          this.params.database = this.editData.baseconfig.database
        }
        this.testpass = true
      })
    },
    // 上一步
    prevStep () {
      this.$emit('prevStep')
    }
  }
}
</script>
<style lang="less" scoped>
.placeholder-color (@color) {
  &::-webkit-input-placeholder {
    color: @color;
  }
  &::-moz-placeholder {
    color: @color;
  }
  &:-ms-input-placeholder {
    color: @color;
  }
}
.content {
  overflow: auto;
  overflow-x: hidden;
  flex: 1;
  /deep/ input, input {
    .placeholder-color(rgba(255,255,255,.3));
    font-weight: 400!important;
  }
}
.data-base {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content-test{
  display: flex;
  justify-content: space-between;
  .test-button {
    display: flex;
    justify-content: content;
    align-items: center;
    height:30px;
    line-height: 30px;
    border:1px solid rgba(24,144,255,1);
    font-size:14px;
    color:rgba(255,255,255,1);
    text-align: center;
    cursor: pointer;
    user-select: none;
    border:1px solid rgba(44,183,255,1);
    background:rgba(24,144,255,0.55);
    padding: 0 10px;
    .fa-spinner {
      margin-right: 5px;
    }
    &.disabled {
      background: rgba(153, 153, 153, .2);
      cursor: not-allowed;
    }
  }
  .select-database-name {
    width: 100%!important;
    flex: 1;
    margin-left: 30px;
  }
}
.da-link-tips {
  margin-top: 15px;
  font-size: 12px;
  color: #ffffff;
  line-height: 25px;
  overflow: hidden;
  .icon {
    width: 25px;
    height: 25px;
    float: left;
    color: #de0c0c;
    font-size: 16px;
    font-weight: bold;
    line-height: 25px;
        text-align: center;
  }
  .da-link-tips-text{
    float: left;
    line-height: 25px;
    font-size: 14px;
  }
}
</style>
