<template lang="pug">
  .security-box
    Loading(v-if="loading")
    .security(v-else)
      BreadCrumbs
      .main-container
        .safe-item
          .left 最大错误登录次数：
          .right
            NumInput.number-input(v-model="sendData.maxerr", :min="1", placeholder="例如：3")
            .delimit 次
        .safe-item
          .left 错误间隔时间：
          .right
            NumInput.number-input(v-model="sendData.locktimeset", :min="1", placeholder="例如：3")
            .delimit 秒
        .safe-item
          .left 是否允许多人同时登录：
          .right
            SwitchBar(v-model="multiTerminal", :min="1", @input="changelogins")
        .safe-item(v-if="multiTerminal")
          .left 最大允许登录终端数：
          .right
            NumInput.number-input(v-model="sendData.logins", :min="1", placeholder="例如：3")
            .delimit 台
        .safe-item
          .left 启用日志：
          .right
            SwitchBar(v-model="sendData.openlog" :activeValue="1" :inactiveValue="0")
        .safe-item
          .left
          .right
            .confirm-button(@click="confirm") 确定
</template>

<script>
import {
  GET_SAFE,
  SET_SAFE
} from '@api/system.js'
export default {
  data () {
    return {
      sendData: {},
      loading: true,
      multiTerminal: true
    }
  },
  created () {
    this.getSafe()
  },
  methods: {
    changelogins () {
      if (!this.multiTerminal) {
        this.sendData.logins = 1
      }
    },
    getSafe () {
      GET_SAFE().then((res) => {
        if (!res.err) {
          this.loading = false
          this.sendData = res.data
        }
      })
    },
    confirm () {
      const sendData = this.sendData
      this.changelogins()
      SET_SAFE(sendData).then((value) => {
        if (!value.err) {
          this.loading = false
          this.$alert({type: 'success', msg: '更新成功!'})
        }
      })
    },
    NotNegative (val) {
      // eslint-disable-next-line
      val = val.replace(/\-/g, '')
      return val
    }
  }
}
</script>

<style lang="less" scoped>
  .security-box, .security {
    height: 100%;
  }
  .security-box /deep/ .kwc-control.number-input .el-input {
    background: #003567;
    border: 1px solid rgba(0, 71, 157, 0.7);
    input {
      text-indent: 12px;
      color: rgba(255,255,255,.8);
      font-size:14px;
    }
  }
  .safe-item {
    display: flex;
    align-items: center;
    margin: 15px 0;
    font-size: 12px;
    color: #ffffff;
    .left {
      width: 150px;
      text-align: right;
    }
    /deep/ .right {
      margin-left: 20px;
      display: flex;
      align-items: center;
      .delimit {
        margin: 0 10px;
      }
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
  }
  .confirm-button {
    width: 100px;
    height: 30px;
    line-height: 30px;
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
