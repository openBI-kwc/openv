<template lang="pug">
  //- 数据视图
  //- 屏蔽鼠标右键
  .screen-share#canvas-panel-wrap(ondragstart="window.event.returnValue = false" oncontextmenu="window.event.returnValue = false" onselectstart="window.event.returnValue = false" ondragover="javascript: return false;")
    Modal.check-user(:show="showModal", @close="closeModal", @confrim="verification")
      .check-wp
        .required
          i.icon &#xe692;
          | 请输入密码
        input(type="text" style="display:none;")
        input.input-control(type="password", placeholder="密码", v-model="password" autocomplete="off")
    Loading(v-if="loading")
    CanvasPanel(v-if="showCanvasPanel" @onLoad="loadedScreen", :screenCategory="'share'" :screenId="id")
</template>

<script>
import { mapState } from 'vuex'
import { Utils, Storage } from '@public/utils'
import { PUBLIC_MSG, TEST_VIEW } from '@api/visualedit.js'
export default {
  data () {
    return {
      token: '',
      // 是否加载完大屏面板
      showCanvasPanel: false,
      // loading
      loading: true,
      // 显示密码弹框
      showModal: false,
      // 缩放比例
      scale: null,
      // 屏幕宽 高
      screenWidth: null,
      screenHeight: null,
      // 大屏id
      id: Utils.deBase64(this.$route.params.id),
      // 输入密码
      password: '',
      // 当前大屏的数据
      currentScreen: null,
      // 缓存的访问大屏的id记录
      storeId: []
    }
  },
  async created () {
    // 获取token
    this.token = this.$route.query.t
    // 如果是本地部署
    if (this.setting.localDeploy) return this.loadpage()
    // 缓存
    let shareScreenId = Storage.get('Access-Screen-List') || ''
    let share = Utils.deBase64(shareScreenId)
    if (Utils.isJsonString(share)) this.storeId = JSON.parse(share)
    let isstore = this.storeId.includes(this.id + '')
    if (isstore) return this.loadpage()
    // 获取屏幕数据
    await this.getScreenData()
    if (!this.currentScreen) return
    document.title = '发布大屏 | ' + this.currentScreen.name
    // 过期了
    if (this.currentScreen.expired) return this.$router.push('/notfound')
    // 有无密码验证
    this.currentScreen.is_pwd ? this.showModal = true : this.verification()
  },
  computed: {
    ...mapState({
      screen: state => state.screenOption,
      setting: state => state.setting
    }),
    screenStyle () {
      if (!this.screen) return {}
      let style = {
        transformOrigin: 'left top'
      }
      let s = {
        width: `${this.screen.width}px`,
        height: `${this.screen.height}px`,
        transform: this.scale ? `scale(${this.scale})` : 'none'
      }
      return {
        ...style,
        ...s
      }
    }
  },
  methods: {
    // 验证通过加载页面
    loadpage () {
      this.showModal = false
      this.showCanvasPanel = true
    },
    // 前端存储
    shareIdStore () {
      let storeId = this.storeId
      if (!storeId.length) {
        storeId.push(this.id)
      } else {
        // 保留五个 不在里面
        if (!storeId.includes(this.id + '') && storeId.length >= 5) {
          storeId.shift()
        }
        storeId.push(this.id)
      }
      let shareBase64 = Utils.enBase64(JSON.stringify(storeId))
      Storage.set('Access-Screen-List', shareBase64)
    },
    // 验证权限
    verification () {
      let params = { pid: this.id }
      if (this.token) params.token = this.token
      if (this.password) {
        params.password = Utils.enBase64(this.password)
        params.len = this.password.length
      }
      TEST_VIEW(params).then((res) => {
        if (res.err) {
          switch (res.status + '') {
            case '6008':
              this.$router.replace('/notfound')
              break
          }
          return
        }
        this.loadpage()
        this.shareIdStore()
      })
    },
    closeModal () {
      this.$toasting({
        type: 'warning',
        title: '警告',
        message: '请输入密码'
      })  
    },
    // 屏幕加载完成
    loadedScreen () {
      this.loading = false
      this.$nextTick(() => {
        window.requestAnimationFrame(() => {
          // 计算缩放比例
          const width = this.$el.clientWidth
          this.scale = width / this.screen.width
        })
      })
    },
    // 获取屏幕数据
    getScreenData () {
      return new Promise(resolve => {
        PUBLIC_MSG({pid: this.id}).then((resData) => {
          if (resData.err) return
          this.currentScreen = resData.data
          resolve()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .screen-share {
    height: 100%;
    width: 100%;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    background: #ebebeb;
    background-size: 100% 100%; 
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5);
    /deep/ .popup-content-box {
      min-height: 250px;
      z-index: 100;
    }
    /deep/ .modal-content {
      width: 100%;
      display: flex;
      align-items: center;
      .check-wp {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
      }
    }
  }
</style>
