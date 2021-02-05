<template lang="pug">
  .unity3d-coms(
    @mouseenter="enterScene",
    @mouseleave="leaveScene",
    :id="chartOpt.u3dId",
    :style="{width: chartOpt.width + 'px', height: chartOpt.height + 'px'}")
</template>
<script>
import { loader } from 'vue-m-loader'
import { Utils, Lodash } from '@public/utils'
import Socket from '@public/socketHeartbeat'
import { mapState } from 'vuex'
const { unid, isJsonString, deBase64 } = Utils
const $ = window.$
const u3dDefault = {
  comtype: '3dvisual',
  comkey: '3dchangjing',
  name: 'Unity',
  width: 10,
  height: 10,
  chartData: null,
  charttype: 'unity3d'
}
// 头部的高度
const SceneHeadHeight = 56
// --------------U3d接口-------------------
/*
  CreateNewScence  创建场景
  SaveConfiger      保存模型
  SelectModel      选择模型，加到场景里面去的
  SetResolution    宽高变化，自适应布局
  Exist            u3d实例销毁，退出场景
  RecvFromSocket   实时数据发送
  SaveScence       保存场景
  StopModelRun     场景暂停
  BeginModelRun    场景运行
*/
// -------------JS回调---------------
/*
  ConfigU3dModel    配置模型，给我模型的数据
  UnityInited      所有u3d所有数据加载完
  SetSceneInfo     获取场景配置数据
  TestFunc         测试调用
*/
// ----------------------------------
export default {
  props: {
    value: null,
    // 不是一个图表
    notChart: false
  },
  data () {
    return {
      // u3d加载完
      u3dLoaded: false,
      // 路由参数的type
      comtype: '',
      // 获取的路由参数id
      u3did: '',
      // unity实例
      gameInstance: null,
      // chart数据
      chartOpt: null,
      // 选择的3d模型
      selectedModel: null,
      // sock实例
      socketInstance: null
    }
  },
  created () {
    // 新建场景
    this.chartOpt = this.notChart ? u3dDefault : this.value
    // 添加唯一的id
    if (this.chartOpt.u3dId) return
    this.chartOpt.u3dId = unid('u3d')
    this.setType()
  },
  watch: {
    chartOpt: {
      handler () {
        this.$emit('input', this.chartOpt)
      },
      deep: true
    },
    'chartOpt.width': {
      handler () {
        this.watchResize()
      },
      deep: true,
      immediate: false
    },
    'chartOpt.height': {
      handler () {
        this.watchResize()
      },
      deep: true,
      immediate: false
    },
    value: {
      handler () {
        this.chartOpt = this.value
      },
      deep: true
    }
  },
  mounted () {
    this.setWH()
    if (this.notChart) {
      $(window).on('resize', Lodash.debounce(() => {
        this.setWH()
      }, 600, {leading: false}))
    }
    // 加载UnityLoader
    loader({url: this.setting.server + '/webCdnPkg/unity3dWeb/Build/UnityLoader.js'}).then(() => {
      if (!window.UnityLoader) {
        return this.$toasting({
          title: '错误',
          type: 'error',
          message: 'UnityLoader加载失败'
        })
      }
      // 初始化实例
      this.gameInstance = window.UnityLoader.instantiate(this.chartOpt.u3dId,
        this.setting.server + '/static/unity3d/Web/Build/Web.json',
        { onProgress: this.unityProgress })
    })
  },
  computed: {
    ...mapState(['setting'])
  },
  methods: {
    // 判断路由
    setType () {
      if (this.$route.name !== '3dscene') return
      let params = this.$route.params
      this.comtype = params.type
      if (!params.id) this.u3did = ''
      else this.u3did = deBase64(params.id)
      if (this.comtype === 'edit') {
        let chartData = {
          id: this.u3did
        }
        this.chartOpt.chartData = chartData
      }
    },
    // 设置宽高
    setWH () {
      if (!this.notChart) return
      let width = document.documentElement.clientWidth || document.body.clientWidth
      let height = document.documentElement.clientHeight || document.body.clientHeight
      this.chartOpt.width = width
      this.chartOpt.height = height - SceneHeadHeight
    },
    // 场景加载完，加载剩余资源...
    loadUnityResources () {
      this.u3dLoaded = true
      // 创建完后回调
      this.$emit('unityLoaded', this.u3dLoaded)
      // 注册事件
      this.registeredEvent()
      // u3d回调所有资源加载完
      window.UnityInited = () => {
        console.log('-------------------------------------')
        console.log('Unity所有资源加载完,可以加载模型数据了.......')
        console.log('-------------------------------------')
        // 默认是禁用的， 关闭键盘
        this.leaveScene()
        // 默认可以编辑场景， 如果不会再场景视图里面就禁用编辑
        this.disableEdit()
        // 回调获取场景数据
        window.SetSceneInfo = (sceneobj) => {
          if (!isJsonString(sceneobj)) return
          // 场景数据传入到配置组件里面
          this.$eventBus.$emit('CONFIG_UNITY_SCENE', JSON.parse(sceneobj))
        }
        // 发送id 如果没有就是新的场景 ID = 0
        let u3dChartData = this.chartOpt.chartData
        let ScenceID = u3dChartData ? u3dChartData.id + '' : '0'
        console.log('创建场景CreateNewScence', ScenceID)
        this.sendMessage('CreateNewScence', ScenceID)
        // 创建长连接
        // eslint-disable-next-line
        if (!!parseFloat(ScenceID)) {
          let socket = new Socket({
            options: { url: this.setting.thrdUrl },
            callback: (result) => {
              if (!result) return
              if (result === 'I was activated') {
                this.socketInstance = socket
                // 获取场景的id
                this.socketInstance.send({
                  scenesId: ScenceID
                })
              } else {
                if (!isJsonString(result)) return
                console.log('RecvFromSocket', JSON.parse(result))
                // 发送给u3d
                this.sendMessage('RecvFromSocket', result)
              }
            }
          })
        }
      }
      // 选择了某个模型，给与配置属性
      window.ConfigU3dModel = (config) => {
        if (!config || !isJsonString(config)) return
        console.log('-------------------------------------')
        console.log('接受的模型数据', config)
        console.log('-------------------------------------')
        // 传入到模型的配置组件里面
        this.$eventBus.$emit('CONFIG_UNITY_MODEL', JSON.parse(config))
      }
    },
    // 禁用模型的编辑
    disableEdit () {
      if (this.$route.name !== '3dscene') {
        // 禁用编辑
        this.sendMessage('SettingModelState', 0)
      }
    },
    // 注册事件
    registeredEvent () {
      // 选择了模型
      this.$eventBus.$on('SELECT_UNITY_MODEL', (item) => {
        if (!this.gameInstance) return
        console.log('选择模型数据', item)
        this.selectedModel = item
      })
      // 保存模型
      this.$eventBus.$on('SAVE_UNITY_MODEL', (item) => {
        if (!this.gameInstance) return
        let modelJsonString = JSON.stringify(item)
        console.log('保存模型', 'SaveConfiger')
        this.sendMessage('SaveConfiger', modelJsonString)
      })
      // 保存场景
      this.$eventBus.$on('SAVE_UNITY_SCENCE', (sceneObj) => {
        if (!this.gameInstance) return
        console.log('保存场景', 'SaveScence --> ' + sceneObj)
        this.sendMessage('SaveScence', sceneObj)
      })
    },
    // 自动点击元素
    unityClick (e) {
      console.log('鼠标点击当前元素')
    },
    // 获取鼠标焦点
    unityFocus (e) {
      let evt = window.event ? window.event : e
      let target = evt.srcElement || evt.target
      console.log('鼠标焦点在当前元素', target.id)
    },
    // 进入场景
    enterScene () {
      this.sendMessage('SettingInput', 'On')
      console.log('场景开启键盘', 'On')
      this.addUnityModel()
    },
    // 离开场景
    leaveScene () {
      this.sendMessage('SettingInput', 'Off')
      console.log('场景关闭键盘', 'Off')
    },
    // 添加模型
    addUnityModel () {
      if (!this.selectedModel) return
      // 加载到场景中
      this.sendMessage('SelectModel', this.selectedModel.name)
      this.selectedModel = null
    },
    // 发送消息
    sendMessage () {
      if (!this.gameInstance) return
      let args = Array.prototype.slice.call(arguments)
      console.log('消息参数', args)
      this.gameInstance.SendMessage('JSManager', ...args)
    },
    // 加载进度条
    unityProgress (gameInstance, progress) {
      if (!gameInstance.Module) return
      if (!gameInstance.logo) {
        gameInstance.logo = document.createElement('div')
        gameInstance.logo.className = 'logo ' + gameInstance.Module.splashScreenStyle
        gameInstance.container.appendChild(gameInstance.logo)
      }
      if (!gameInstance.progress) {
        gameInstance.progress = document.createElement('div')
        gameInstance.progress.className = 'progress ' + gameInstance.Module.splashScreenStyle
        gameInstance.progress.empty = document.createElement('div')
        gameInstance.progress.empty.className = 'empty'
        gameInstance.progress.appendChild(gameInstance.progress.empty)
        gameInstance.progress.full = document.createElement('div')
        gameInstance.progress.full.className = 'full'
        gameInstance.progress.appendChild(gameInstance.progress.full)
        gameInstance.container.appendChild(gameInstance.progress)
      }
      gameInstance.progress.full.style.width = (100 * progress) + '%'
      gameInstance.progress.empty.style.width = (100 * (1 - progress)) + '%'
      if (progress === 1) {
        gameInstance.logo.style.display = 'none'
        gameInstance.progress.style.display = 'none'
        console.log('-------------------------------------')
        console.log('Unity3d场景加载完成,等待加载网络等资源........')
        console.log('-------------------------------------')
        // 实例初始化完成
        this.loadUnityResources()
      }
    },
    watchResize: Lodash.debounce(() => {
      if (!this.gameInstance) return
      let {width, height} = this.chartOpt
      console.log('SetResolution宽高变化', `${width},${height}`)
      this.sendMessage('SetResolution', `${width},${height}`)
    }, 600, {leading: false})
  },
  beforeDestroy () {
    // 销毁u3d实例
    delete window.ConfigU3dModel
    delete window.UnityInited
    delete window.SetSceneInfo
    $(window).off('resize')
    this.sendMessage('Exist')
  }
}
</script>
