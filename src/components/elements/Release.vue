<template lang="pug">
  //- 发布
  .screen-release-wp
    Modal(:class="{'localDeploy':localDeploy}" :show="true", @close="closeModal", @confrim="addNewShare", text="发布")
      .data-wrapper
        .share-item.local
          CheckBox.checkBox(v-model="localDeploy")
          span.text 本地部署
        .share-item.share-link
          span.text 分享链接
          input.input-control(type="text", v-model="sentData.shareLink")
          span.copy(@click="copyLink") 复制
        template(v-if="!localDeploy")
          .share-item.visit-pwd
            CheckBox.checkBox(v-model="ispassword")
            span.text 设置访问密码
            input(type="text" style="display:none;")
            input.input-control.password(type="password", :disabled="!ispassword", v-model="sentData.password" autocomplete="off")
          .share-item.visit-token
            CheckBox.checkBox(v-model="istoken", @input="gettoken")
            span.text Token验证
            input.input-control.password(type="text", disabled,  v-model="sentData.token")
          .share-item.effective
            span.text 验证有效期
            Selection.time.select-by-bg(v-model="sentData.testTime", :width="300" :option="timeType")
          .share-item.release-page
            span.text 发布页面
            .pagetype
              .btn.page(:class="{active: sentData.type == 'page'}", @click="sentData.type = 'page'") 实时页面
              .btn.snapshot(:class="{active: sentData.type == 'snapshot'}", @click="sentData.type = 'snapshot'") 历史快照
</template>

<script>
import { Utils, Lodash, CopyToClipboard } from '@public/utils'
import { mapState } from 'vuex'
import { RELEASE, GET_TOKEN } from '@api/visualscreen.js'
const sentData = {
  shareLink: '',
  password: '',
  token: '',
  is_pwd: 0,
  testTime: 86400,
  type: 'page'
}
export default {
  props: {
    shareScreen: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // 本地部署
      localDeploy: false,
      // 是否开启密码
      ispassword: false,
      // 是否开启token
      istoken: false,
      // 发送的接口的数据
      sentData: Lodash.cloneDeep(sentData),
      timeType: [
        {value: 86400, name: '一天'},
        {value: 259200, name: '三天'},
        {value: 604800, name: '一星期'},
        {value: 2592000, name: '一个月'},
        {value: 0, name: '永久'}
      ]
    }
  },
  computed: {
    ...mapState({
      setting: state => state.setting
    })
  },
  created () {
    this.getlink()
  },
  beforeUpdate () {
    this.getlink()
  },
  methods: {
    gettoken () {
      if (!this.istoken) {
        this.sentData.token = ''
        return 
      }
      // 后端返回token
      GET_TOKEN().then((value) => {
        this.sentData.token = value
      })
    },
    getlink () {
      // 参数
      let query = {}
      if (!this.localDeploy) {
        if (!this.ispassword) this.sentData.password = ''
        if (this.istoken && this.sentData.token) {
          query.t = this.sentData.token
        }
      }
      const { href } = this.$router.resolve({
        name: 'share',
        path: '/share',
        params: {
          id: Utils.enBase64(this.shareScreen.id)
        },
        query
      })
      const { server, releaseMode } = this.setting
      this.sentData.shareLink = releaseMode === 'absolute' ? server : '' + '/' + href
    },
    // 关闭弹框
    closeModal () {
      this.$emit('close')
      this.sentData = Lodash.cloneDeep(sentData)
      this.ispassword = false
      this.istoken = false
    },
    // 复制
    copyLink () {
      let link = this.sentData.shareLink
      try {
        CopyToClipboard(link)
        this.$toasting({
          type: 'success',
          title: '成功',
          message: '复制成功!'
        })
      } catch (error) {
        this.$toasting({
          type: 'error',
          title: '警告',
          message: '复制失败'
        })
      }
    },
    // 添加发布
    addNewShare () {
      // 密码参数
      let pwdarg = {
        password: Utils.enBase64(this.sentData.password),
        len: this.sentData.password.length
      }
      const showpwd = this.ispassword && this.sentData.password
      this.sentData.is_pwd = showpwd ? 1 : 0
      let params = {
        data: null,
        pid: this.shareScreen.id,
        url: this.sentData.shareLink,
        is_pwd: this.sentData.is_pwd,
        testTime: this.sentData.testTime,
        type: this.sentData.type,
        name: this.shareScreen.name,
        token: this.sentData.token
      }
      // 本地部署
      if (this.localDeploy) {
        let obj = {
          is_pwd: 0,
          testTime: 0,
          password: '',
          token: '',
          type: 'page',
          localDeploy: this.localDeploy
        }
        params = Object.assign({}, params, obj)
      } else {
        showpwd && (params = Object.assign({}, params, pwdarg))
      }
      RELEASE(params).then((value) => {
        if (!value.err) {
          this.$toasting({
            type: 'success',
            title: '成功',
            message: '发布成功!'
          })
          this.closeModal()
        }
      })
      this.showPassword = false
      this.showToken = false
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .modal-box {
  width: 480px;
  height: 400px;
}
.localDeploy /deep/ .popup-content-box {
  min-height: 330px;
  .modal-box {
    height: 230px;
  }
}

.share-item {
  display: flex;
  align-items: center;
  line-height: 30px;
  height: 30px;
  margin-bottom: 20px;
  font-size: 12px;
  color: #FFF;
  line-height: 30px;
  .input-control {
    margin-bottom: 0;
  }
  .text {
    display: inline-block;
  }
}
.data-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.share-link {
  input {
    width: 360px;
    margin-right: 20px;
  }
  .text{
    margin-right: 20px;
  }
}
.local .text{
  margin-left: 20px;
}
.visit-pwd, .visit-token {
  .text{
    width: 80px;
    margin-right: 20px;
    margin-left: 20px;
  }
  input {
    width: 340px;
  }
}
.effective {
  .text{
    width: 80px;
    margin-right: 20px;
  }
  .time {
    width: 380px!important;
  }
}
// 发布页面
.release-page {
  .text {
    width: 80px;
    margin-right: 20px;
  }
  .pagetype {
    display: flex;
    align-items: center;
    .btn {
      padding: 0 10px;
      color: #fff;
      border: 1px solid #00aeff;
      font-size: 14px;
      cursor: pointer;
    }
    .active {
      border: 1px solid #2cb7ff;
      background: rgba(24, 144, 255, 0.55);
      background: #219AF2;
    }
  }
}
</style>
