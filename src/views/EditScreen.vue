// 2017年9月15日
<template lang="pug">
  .screen-edit
    //- 锁定
    Modal.lockmodal(:show="showUnlockModal", @close="showUnlockModal = false", @confrim="testPassword", text="输入密码")
      .lock-input
        Required.name(text="请输入密码")
        input(type="text" style="display:none;")
        input.pwd(type="password", v-model="password" autocomplete="off")
    //- 标题栏
    Loading(v-if="loading")
    .screen-wp(v-show="!loading")
      ScreenHead
      .loading-indicator(:class="{'loading': chartLoading}")
      .screen-edit-main
        //- 左侧部分
        Layer(:class="{'--hide': !showLayer}")
        //- 中间大屏
        #canvas-edit-main-wp
          .canvas-main(ondragstart="window.event.returnValue = false" oncontextmenu="window.event.returnValue = false" onselectstart="window.event.returnValue = false" ondragover="javascript: return false;")
            #canvas-panel-wrap(@click.self.stop="clearChartIndex")
              CanvasPanel(ref="CanvasPanel" @onScale="changeScreenScale", @onLoad="onLoad")
            .canvas-slider
              .hot-key-borad
                .icon.borad &#xe689;
                .aui-dow-box
                  .borad(v-for="item in boradKeys" :key="item.name")
                    .name {{item.name}}
                    .value {{item.value}}
              Slider.slider(v-model="screenOption.scale", :min="1", :max="50", :step="1", @onChange="changeScreenScale")
        //- 右侧图标操作栏
        ChartConfig(:class="{'--hide': !showConfig}")
</template>

<script>
import hotkeys from 'hotkeys-js'
import { Utils } from '@public/utils'
import { GET_SCREENDATA, TEST_PASSWORD } from '@api/visualedit.js'
import { mapState } from 'vuex'
const $ = window.$
export default {
  data () {
    return {
      // 数据加载中
      loading: true,
      // 屏幕数据
      screenData: null,
      // 显示解锁的模态框
      showUnlockModal: false,
      // 大屏密码
      password: '',
      // 显示标尺
      showRuler: false,
      // 加载完成
      loadend: true,
      // 显示图层
      showLayer: true,
      // 显示config
      showConfig: true,
      boradKeys: [{
        name: '开关图层面板',
        value: 'cmd/ctrl+←'
      },
      {
        name: '开关右侧面板',
        value: 'cmd/ctrl+→'
      },
      {
        name: '画板移动',
        value: 'space+鼠标'
      },
      {
        name: '图表微调',
        value: '选中+↑/↓/←/→'
      },
      {
        name: '图表大幅微调',
        value: '选中+shift+↑/↓/←/→'
      },
      {
        name: '重置画板方位',
        value: 'cmd/ctrl+shift+a'
      }]
    }
  },
  created () {
    this.getScreenData()
  },
  beforeDestroy () {
    $(window).off('resize')
    // 清除屏幕数据
    this.$store.dispatch('CLEAR_SCREEN_OPTION', {})
  },
  methods: {
    calcScale () {
      setTimeout(() => {
        this.$store.dispatch('SET_SCREEN_OPTION', {
          scale: this.$refs.CanvasPanel.calcScreenScale()
        })
      }, 500)
    },
    registerHotkeys () {
      const hotkeyMap = {
        'command+left': () => { this.showLayer = !this.showLayer },
        'ctrl+left': () => { this.showLayer = !this.showLayer },
        'command+right': () => { this.showConfig = !this.showConfig },
        'ctrl+right': () => { this.showConfig = !this.showConfig }
      }
      let keys = Object.keys(hotkeyMap).join(',')
      hotkeys(keys, {scope: 'canvas'}, (evn, handler) => {
        evn.preventDefault()
        hotkeyMap[handler.key]()
        this.calcScale()
      })
      hotkeys.setScope('canvas')
    },
    // 清除激活的图表
    clearChartIndex () {
      this.$store.dispatch('SET_CHART_INDEX', null)
    },
    onLoad () {
      this.loadend = false
      this.showRuler = true
      this.loading = false
      this.registerHotkeys()
    },
    // 改变屏幕缩放
    changeScreenScale () {
      if (this.loadend) return
      this.$store.dispatch('SET_SCREEN_OPTION', this.screenOption)
    },
    // 进入大屏验证密码
    testPassword () {
      let params = {
        password: Utils.enBase64(this.password),
        cid: Utils.deBase64(this.$route.params.id)
      }
      let pattern = /^[^\u4e00-\u9fa5]{0,}$/
      if (!this.password || !pattern.test(this.password)) {
        return this.$toasting({
          type: 'error',
          title: '警告',
          message: '密码为空或存在中文字符'
        })
      }
      TEST_PASSWORD(params).then((val) => {
        if (val.err) return
        this.showUnlockModal = false
        this.loading = false
      })
    },
    // 获取屏幕数据
    getScreenData () {
      let params = {
        visualtype: this.$route.params.type,
        id: Utils.deBase64(this.$route.params.id)
      }
      GET_SCREENDATA(params).then((resData) => {
        if (resData.err) return
        this.screenData = resData.data
        document.title = '大屏编辑 | ' + this.screenData.name
      })
    }
  },
  computed: {
    ...mapState(['chartLoading', 'screenOption', 'index'])
  }
}
</script>

<style lang="less" scoped>
  @keyframes slide{
    0%{ 
      top: 300px;
    }
    100%{ 
      z-index: 9;
      display: block;
      top: -5px;
      visibility: visible;
    }
  }
  .hot-key-borad {
    position: relative;
    width: 30px;
    height: 30px;
    .borad {
      font-size: 25px;
      color: #4a8de0;
      margin-top: 3px;
      text-align: center;
    }
    &:hover {
      z-index: 99;
      .aui-dow-box {
        z-index: 9;
        display: block;
        top: -5px;
        visibility: visible;
      }
    }
  }
  .aui-dow-box {
    top: -30px;
    left: 50%;
    transform: translate(-50%, -100%);
    visibility: hidden;
    display: none;
    flex-wrap: wrap;
    align-content: flex-start;
    position: absolute;
    animation: slide 0.5s;
    width: 250px;
    background: #0E1A28;
    z-index: -1;
    padding: 5px;
    &::after {
      display: block;
      content: "";
      border: 10px solid transparent;
      border-top-color: #0E1A28;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translate(-50%, 20px);
    }
    .borad {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, .6);
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      .name {
        text-indent: 10px;
        text-align: left;
        width: 100px;
      }
      .value {
        height: 20px;
        background: #2E3E50;
        color: #219AF2;
        padding: 0 5px;
        line-height: 20px;
        border-radius: 2px; 
      }
    }
  }
  .screen-edit {
    display: flex;
    flex-direction: column;
    background: rgba(0,0,0,.5);
  }
  .screen-wp {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  #canvas-edit-main-wp {
    flex: 1;
    flex-direction: column;
    display: flex;
    overflow: hidden;
    height: 100%;
    z-index: 2;
  }
  .canvas-main {
    flex: 1;
    display: flex;
    position: relative;
    height: 100%;
    user-select: none;
    background: url('~@assets/img/screenbg.png') 0 0 repeat;
    #canvas-panel-wrap {
      overflow: auto;
      position: relative;
      width: 100%;
      height: 100%;
    }
    .canvas-slider {
      background:rgba(0, 0, 0, 0.4);
      height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: absolute;
      right: 0;
      bottom: 0;
      // box-shadow: 0 -1px #cccccc;
      user-select: none;
      z-index: 9;
      .slider {
        margin: 0 10px;
        /deep/ .el-slider__runway {
          background:#2E3E50;
        }
      }
    }
  }
  .screen-edit-main {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: calc(100% - 60px);
  }
  .lockmodal {
    /deep/  .modal-box {
      height: 250px;
      min-height: 250px;
      .modal-content {
        display: flex;
        align-items: center;
        .lock-input {
          width: 100%;
        }
        .name {
          margin: 10px 0;
          font-size: 12px;
          color: #666666;
        }
        .pwd {
          display: block;
          width: 100%;
          height: 30px;
          padding: 0 10px;
          border: 1px solid #e9e9e9;
          background-color: #ffffff;
          color: rgba(0, 0, 0, 0.85);
          font-size: 12px;
          line-height: 17px;
          &:focus{
            border: 1px solid #219AF2;
          }
        }
      }
    }
  }
  .loading-indicator {
    z-index: 99;
    position: fixed;
    left: 0;
    top: 60px;
    width: 100%;
    height: 0;
    transition: height .5s;
    background: -webkit-gradient(linear,80% 46%,10% 21%,from(#ff8754),to(#042a45));
    animation: ladingAnimation 1s infinite ease-out;
    &.loading {
      height: 2px;
    }
  }
  @keyframes ladingAnimation {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(150%);
    }
  }
</style>
