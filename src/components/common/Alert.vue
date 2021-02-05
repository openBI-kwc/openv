<template lang="pug">
  //- 全局警告提示框
  Popup(v-if="show" :text="config.text" :isclose="config.isclose" @close="closeWindow")
    .alert-windows
      //- 内容区域
      .alert-content
        //- 内容放在这里
        .content-wrapper
          //- 图标
          .info.icon(v-if="config.type === 'info'") &#xe687;
          .success.icon(v-else-if="config.type === 'success'") &#xe644;
          .warning.icon(v-else-if="config.type === 'warning'") &#xe6f6;
          .error.icon(v-else="config.type === 'error'") &#xe66c;
          //- 文本
          .msgtext(v-if="config.msg") {{config.msg}}
      //- 底部按钮组
      .alert-footer
        //- 确定按钮
        .btn.confrim(@click="confrim") 确定
</template>

<script>
import hotkeys from 'hotkeys-js'
// 提示类型 成功: success 错误: error 警告: warning 提示: info
// 选项： 类型 文本 回调函数
export default {
  data () {
    return {
      show: false,
      config: {
        type: 'info',
        msg: '',
        callback: null,
        isclose: true,
        text: '提示'
      }
    }
  },
  mounted() {
    hotkeys('enter', (evn, handler) => {
      evn.preventDefault()
      if (!this.show && evn.type === 'keydown') return
      this.confrim()
    })
  },
  methods: {
    showAlertMessage (opt) {
      this.show = true
      this.config = opt
    },
    // 关闭弹框
    closeWindow () {
      this.config = {}
      this.show = false
    },
    // 确定
    confrim () {
      const config = this.config
      if (config.callback) config.callback()
      this.closeWindow()
    }
  },
  beforeDestroy () {
    hotkeys.unbind('enter')
  }
}
</script>

<style lang="less" scoped>
  .flex-center (@fa){
    display: flex;
    justify-content: @fa;
    align-items: center;
  }
  .error {
    text-align: left;
    margin: 0 auto;
    width: calc(100% - 80px);
    font-size: 14px;
    color: #FE6723;
    line-height: 1;
  }
  // 弹出框的主要内容
  .alert-windows {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  // 尾部
  .alert-footer {
    .flex-center(flex-end);
    height: 32px;
    .btn {
      width:80px;
      height:30px;
      line-height: 30px;
      border:1px solid rgba(24,144,255,1);
      font-size:14px;
      color:rgba(255,255,255,1);
      text-align: center;
      cursor: pointer;
      margin-left: 20px;
      user-select: none;
      &.confirm {
        border:1px solid rgba(44,183,255,1);
        background:rgba(24,144,255,0.55);
        background: #219AF2;
      }
    }
  }
  // 中间部分
  .alert-content {
    width: 100%;
    height: calc(100% - 32px);
    overflow: auto;
  }
  // 内容的存放区
  .content-wrapper {
    width: 100%;
    height: 100%;
    text-align: center;
    .flex-center(center);
    flex-direction: column;
    .icon {
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 50px;
      margin-bottom: 20px;
      &.info {
        color: #dddddd;
      }
      &.success {
        color: #1f89e0;
      }
      &.error {
        color: #ff0000;
      }
      &.warning {
        color: #ff9900;
      }
    }
    .msgtext {
      text-align: center;
      font-size: 14px;
      color: #ffffff;
    }
  }
</style>
