<template lang="pug">
  //- 预览页面
  .screen-preview#canvas-panel-wrap(@mouseenter="showLaunch = true" @mouseleave="showLaunch = false" ondragstart="window.event.returnValue = false" oncontextmenu="window.event.returnValue = false" onselectstart="window.event.returnValue = false" ondragover="javascript: return false;")
    .glob-launch(v-show="showLaunch" @click.self="fullScreen") {{isFullScreen ? '退出全屏' : '全屏预览'}}
    Loading(v-if="loading")
    .screen-wp
      CanvasPanel(v-show="!loading" @onLoad="loadScreen" :screenCategory="'preview'", :screenId="screenId")
</template>

<script>
import { mapState } from 'vuex'
import Utils from '@public/utils'
import { GET_SCREENDATA } from '@api/visualedit.js'
export default {
  props: {
    sid: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      isFullScreen: false,
      showLaunch: false,
      loading: true,    
      scale: null,
      screenWidth: null,
      screenHeight: null,
      screenId: ''
    }
  },
  created () {
    this.screenId = this.sid || Utils.deBase64(this.$route.params.id)
    if (!this.screenId) {
      this.$toasting({
        title: '错误',
        type: 'error',
        message: '该大屏加载失败'
      })
      return this.$router.replace('/notfound')
    }
    this.getScreenData()
  },
  computed: {
    ...mapState({
      screen: state => state.screenOption
    }),
    getScreenBoxStyle () {
      let style = {
        background: this.screen.background,
        transform: `scale(${this.scale})`,
        width: `${this.screenWidth}px`,
        height: `${this.screenHeight}px`,
        transformOrigin: 'left top 0',
        backgroundSize: 'cover'
      }
      return style
    }
  },
  methods: {
    // 进入网页全屏
    fullScreen () {
      if (!this.isFullScreen) {
        // 启动全屏!
        this.launchFullscreen()
      } else {
        this.exitFullscreen()
      }
      this.isFullScreen = !this.isFullScreen
    },
    // 退出网页全屏
    exitFullscreen () {
      const element = document
      if (element.exitFullscreen) {
        element.exitFullscreen()
      } else if (element.msExitFullscreen) {
        element.msExitFullscreen()
      } else if (element.mozCancelFullScreen) {
        element.mozCancelFullScreen()
      } else if (element.webkitCancelFullScreen) {
        element.webkitCancelFullScreen()
      }
    },
    // 网页全屏
    launchFullscreen () {
      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },
    loadScreen () {
      this.loading = false
      this.$nextTick(() => {
        const width = this.$el.clientWidth
        this.screenWidth = this.screen.width
        this.screenHeight = this.screen.height
        this.scale = width / this.screenWidth
      })
    },
    // 获取屏幕数据
    getScreenData () {
      GET_SCREENDATA({id: this.screenId}).then((resData) => {
        if (resData.err) return
        document.title = '大屏预览 | ' + resData.data.name
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .glob-launch {
    position: fixed;
    font-size: 12px;
    background-color: #2e2e2e;
    box-shadow: 0 0 10px 0 rgba(0,0,0,.5);
    color: #fff;
    width: 152px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    left: 50%;
    margin-left: -51px;
    top: 13px;
    z-index: 99999;
  }
  .screen-wp {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .screen-preview {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
