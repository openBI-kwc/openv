<template lang="pug">
  .general-box(v-if="sysInfo")
    BreadCrumbs
    .main-container
      .general-item
        .left 设置地址:
        .right
          input.input-control.url(v-model="sysInfo.url", placeholder="ws://192.168.1.100:9090 或者直接数据端口号")
      .general-item
        .left PHP路径:
        .right
          input.input-control.php_path(v-model="sysInfo.php_path", placeholder="php路径")
      .general-item
        .left 启动socket:
        .right
          SwitchBar(v-model="sysInfo.status", :activeValue="1" :inactiveValue="0")
      .general-item
        .left
        .right
          .confirm-button(@click="confirmUpdate") 确定
</template>

<script>
import { mapState } from 'vuex'
import { Utils, Lodash, Storage } from '@public/utils'
import {
  GET_WEBSOCKET_CONFIG,
  SET_WEBSOCKET_CONFIG
} from '@api/system.js'
const enBase64 = Utils
export default {
  computed: {
    ...mapState(['setting', 'system'])
  },
  data () {
    return {
      sysInfo: null
    }
  },
  created () {
    this.getGeneral()
  },
  methods: {
    // 获取设置
    getGeneral () {
      GET_WEBSOCKET_CONFIG().then((value) => {
        if (!value.err) {
          this.sysInfo = value.data
        }
      })
    },
    // 确认修改
    confirmUpdate () {
      const params = Lodash.cloneDeep(this.sysInfo)
      let msg = {
        url: params['url']
      }
      for (const key in msg) {
        if (!msg[key]) {
          return this.$toasting({
            title: '警告',
            type: 'error',
            message: '存在未填项'
          })
        }
      }
      this.upodateConf(params)
    },
    // 修改配置
    upodateConf (params) {
      SET_WEBSOCKET_CONFIG(params).then((value) => {
        if (value.err) {
          return
        }
        // this.$store.dispatch('SET_SYSTEM_INFO', params)
        // Storage.set('System-Setting', enBase64(JSON.stringify(params)))
        // document.title = params.sysname
        this.$toasting({
          title: '提示',
          type: 'success',
          message: value.data
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .general-box {
    width: 100%;
    height: 100%;
  }
  .sysname {
    width: 300px;
    margin-bottom: 0;
  }
  .general-item {
    display: flex;
    align-items: flex-start;
    margin: 15px 0;
    .left {
      width: 100px;
      font-size: 12px;
      line-height: 32px;
      color: rgba(255,255,255,.8);
      text-align: right;
      justify-content: center;
    }
    /deep/ .right {
      margin-left: 20px;
      display: flex;
      align-items: center;
      .el-switch {
        .el-switch__core {
          background: #31363F;
        }
      } 
      .el-switch.is-checked {
        .el-switch__core {
          background: #409EFF;
        }
      }
    }
    &.logo-item .right {
      display: flex;
      align-items: flex-start;
      /deep/.upload-box {
        width: 300px;
        height: 50px;
      }
    }
  }
  .confirm-button {
    width:80px;
    height:30px;
    background:rgba(24,145,255,0.5);
    border:1px solid rgba(0, 174, 255, 1);
    line-height: 30px;
    text-align: center;
    user-select: none;
    cursor: pointer;
    font-size:14px;
    color:rgba(255,255,255,0.8);
  }
</style>
