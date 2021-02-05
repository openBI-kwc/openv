<template lang="pug">
  //- 分享提示框
  .share-box
    .mask
    .share-modal-box
      .share-modal-title
        .share-modal-text 发布
        .share-modal-close.icon(@click="$emit('close')") &#xe600;
      .share-modal-content.content
        .item-title 一、链接设置
        .share-item
          .name 分享链接
          .share-link {{shareLink}}
        .share-item
          .name
            .text 开启访问密码:
            .switch
              SwitchBar.switch(v-model="existPassword")
          input(type="text" style="display:none;")
          input.pwd-input(type="password", v-if="existPassword", placeholder="开启访问密码后可设置", v-model="password" autocomplete="off")
      .share-modal-btn-group
        .share-modal-btn(@click="$emit('close')") 取消
        .share-modal-btn.share-confirm(@click="share") 确定
</template>

<script>
import Utils from '@public/utils'
import { mapState } from 'vuex'
import { GET_PUB_INFO, SHARE_SCRREN } from '@api/visualrelated.js'
export default {
  data () {
    return {
      // 设置密码
      shareLink: '',
      existPassword: false,
      password: '',
      shareID: null
    }
  },
  computed: {
    ...mapState(['setting'])
  },
  methods: {
    share () {
      let sendData = {
        pid: this.shareID
      }
      if (this.existPassword) {
        sendData.is_pwd = 1
        sendData.password = this.password
      } else {
        sendData.is_pwd = 0
      }
      SHARE_SCRREN(sendData).then((res) => {
        this.$alert({type: 'success', msg: '发布成功!'}, () => {
          this.$emit('close')
        })
      })
    }
  },
  created () {
    GET_PUB_INFO().then((value) => {
      this.shareID = value.data
      const { href } = this.$router.resolve({
        name: 'share',
        path: '/share',
        params: {
          id: Utils.enBase64(value.data)
        }
      })
      this.sentData.shareLink = this.setting.server + '/' + href
    })
  }
}
</script>
<style lang="less" scoped>
  .share-modal-box {
    width: 600px;
    height: 425px;
    .content {
      height: calc(~"100% - 102px");
      padding-left: 20px;
      background-color: #F6F7F9;
      .item-title {
        font-size: 14px;
        color: #666666;
      }
      .share-item {
        margin-left: 30px;
        font-size: 12px;
        color: #666666;
        .name {
          height: 40px;
          line-height: 40px;
          position: relative;
          user-select: none;
          display: flex;
        }
        .share-link {
          width: 500px;
          height: 70px;
          resize: none;
          background: #FFFFFF;
          border: 1px solid #E9E9E9;
          font-size: 12px;
          color: #666666;
          line-height: 20px;
        }
        .pwd-input {
          width: 500px;
          height: 30px;
          background: #FFFFFF;
          border: 1px solid #E9E9E9;
          font-size: 12px;
          color: #666666;
          text-indent: 1em;
        }
      }
    }
  }
  .switch {
    margin: 0 5px;
  }
</style>
