// 3d场景
<template lang="pug">
  .three-scene(v-if="notempty")
    Modal.scene-modal(:show="confrimSave", @close="confrimSave = false", @confrim="addNewScene", text="保存场景")
      .input-group
        .label 场景名称
        AutoInput(v-model="sceneName")
    .header
      .back(@click="$router.push({name: 'visual'})") 返回
      .scene-name {{sceneName || '未命名'}}
      .options(v-if="unityLoaded")
        .opt.runing
          .text 运行状态
          SwitchBar(v-model="sceneRuning", @onClick="setSceneRun")
        .opt(@click="confrimSaveScene")
          .icon &#xe63e;
          .text 保存
    .content
      //- 模型列表
      ThrSceneModel(v-show="unityLoaded", :setSceneRun="setSceneRun")
      //- unity场景显示
      Unity3d(ref="Unity3d", :notChart="true", 
        @unityLoaded="unityLoaded = true")
      //- 模型配置
      Unity3dConfig(ref="Unity3dConfig", v-show="unityLoaded",
        :unityinit="unityLoaded", :setSceneRun="setSceneRun")
</template>
<script>
import {
  GET_3D_SCENES
} from '@api/visualscreen.js'
import { Utils, Lodash } from '@public/utils'
const { deBase64 } = Utils
export default {
  data () {
    return {
      // 场景存在
      notempty: false,
      // 确认保存
      confrimSave: false,
      // 场景名称
      sceneName: '',
      // 加载完毕
      unityLoaded: false,
      // 场景启停
      sceneRuning: true
    }
  },
  created () {
    let { id } = this.$route.params
    if (!id) {
      this.notempty = true
      return
    }
    this.getU3dName(deBase64(id))
  },
  methods: {
    // 获取u3d的名字
    getU3dName (id) {
      GET_3D_SCENES({id}).then(res => {
        if (res.err) return
        this.notempty = true
        this.sceneName = res.data[0].scenesname
      })
    },
    // 确认保存场景
    addNewScene () {
      this.saveScence()
      this.confrimSave = false
    },
    // 二次确认保存场景
    confrimSaveScene () {
      this.confrimSave = true
    },
    // 发送保存消息到3d,保存到数据库
    saveScence () {
      let { scene } = this.$refs['Unity3dConfig']
      if (!scene) return
      let sceneobj = Lodash.cloneDeep(scene)
      sceneobj.ScenceName = this.sceneName
      this.$eventBus.$emit('SAVE_UNITY_SCENCE', JSON.stringify(sceneobj))
      this.setSceneRun(true)
    },
    // 全屏
    setFullscreen () {
      let { gameInstance } = this.$refs['Unity3d']
      gameInstance && gameInstance.SetFullscreen(1)
    },
    // 启停
    setSceneRun (flag) {
      this.sceneRuning = flag
      let { sendMessage } = this.$refs['Unity3d']
      // StopModelRun     场景暂停
      // BeginModelRun    场景运行
      let msg = flag ? 'BeginModelRun' : 'StopModelRun'
      console.log('场景启停状态', msg)
      sendMessage(msg)
    }
  }
}
</script>

<style lang="less" scoped>
  .three-scene {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .header .opt.runing {
      flex-direction: row;
      /deep/ .switch-input {
        width: 70px;
        margin: 0 5px;
      }
    }
    /deep/ .scene-modal .modal-box {
      min-height: 216px;
      .input-group {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .label {
          font-size:13px;
          font-weight:500;
          color:rgba(102,102,102,1);
          line-height:18px;
          margin-bottom: 10px;
        }
        .kwc-control {
          width: 100% !important;
        }
      }
    }
    .content {
      height: calc(100% - 42px);
      position: relative;
    }
    .header {
      padding: 0 20px;
      height:56px;
      background:rgba(42,48,60,1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      .back {
        cursor: pointer;
        font-size: 14px;
        color:rgba(255,255,255,1);
        line-height: 20px;
      }
      .scene-name {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        color:rgba(255,255,255,1);
        line-height: 22px;
      }
      .options {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .opt {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-left: 15px;
      }
      .opt .icon {
        color: #4498F2;
        font-size: 14px;
      }
      .opt .text {
        margin-top: 5px;
        text-align: center;
        font-size:12px;
        color:rgba(255,255,255,1);
        line-height:17px;
      }
    }
  }
</style>
