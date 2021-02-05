<template lang="pug">
  .panel-items.u3d-config-panel(:class="{'minimize': minimize}", @mouseenter="enter", @mouseleave="leave")
    .big-box
      .chart-name
        .max-box.icon(:class="{'max': max}", @click="toggleMax") &#xe65a;
        .name 配置菜单
      .config-unity
        .config-header(@click.stop="sceneExpand = !sceneExpand", :class="{'unfold': sceneExpand}")
          .expand-icon.icon &#xe672;
          .title 场景配置
        .scene-config(v-if="unityinit && scene && sceneExpand")
            ControlItem(value="产线编号")
              Selection(v-model="scene.chainId", :option="selectOptions.ProductionLine")
            ControlItem(value="工厂代码")
              Selection(v-model="scene.corpcode", :option="selectOptions.CorpCode")
        .config-header(@click.stop="modelExpand = !modelExpand", :class="{'unfold': modelExpand}")
          .expand-icon.icon &#xe672;
          .title 模型配置
        .model-config(v-show="modelExpand")
          template(v-if="config")
            ControlItem(value="模型名称")
              input.text-input(v-model="config.name")
            ControlItem(value="设备编码")
              Selection(v-model="config.modelID", :option="selectOptions.device")
            ControlItem(value="模型标签")
              input.text-input(v-model="config.classTag")
            ControlItem(value="模型顺序")
              NumInput(v-model="config.orderIndex", :min="0")
            ControlItem(value="播放动画")
              SwitchBar(v-model="config.playing")
            template(v-if="config.playing")
              ControlItem(value="动画类型")
                Selection(v-model="config.animationName", :option="anmiation")
              ControlItem(value="动画速度")
                NumInput(v-model="config.animationSpeed")
              ControlItem(value="动画时间(秒)")
                NumInput(v-model="config.animationRepeatTime")
            .control-entry
              ExpandList(title="位置")
                ControlItem(value="X")
                  NumInput(v-model="config.position[0].x", :min="-9999", :precision="5", :max="9999")
                ControlItem(value="Y")
                  NumInput(v-model="config.position[0].y", :min="-9999", :precision="5", :max="9999")
                ControlItem(value="Z")
                  NumInput(v-model="config.position[0].z", :min="-9999", :precision="5", :max="9999")
            .control-entry
              ExpandList(title="缩放")
                ControlItem(value="X")
                  NumInput(v-model="config.scale[0].x", :min="-9999", :precision="5", :max="9999")
                ControlItem(value="Y")
                  NumInput(v-model="config.scale[0].y", :min="-9999", :precision="5", :max="9999")
                ControlItem(value="Z")
                  NumInput(v-model="config.scale[0].z", :min="-9999", :precision="5", :max="9999")
            .control-entry
              ExpandList(title="旋转")
                ControlItem(value="X")
                  NumInput(v-model="config.rotation[0].x", :min="-9999", :precision="5", :max="9999")
                ControlItem(value="Y")
                  NumInput(v-model="config.rotation[0].y", :min="-9999", :precision="5", :max="9999")
                ControlItem(value="Z")
                  NumInput(v-model="config.rotation[0].z", :min="-9999", :precision="5", :max="9999")
          .noselect(v-else) 请先选择一个模型
      //- .footer
      //-   .button(v-if="config", @click="bindingModel") 绑定模型数据
    .min-box 配置菜单
</template>
<script>
import {
  GET_ANIMATION,
  GET_ALL_DEV,
  BIND_MODEL
} from '@api/visualscreen.js'
import { Lodash } from '@public/utils'
export default {
  props: {
    unityinit: false,
    setSceneRun: ''
  },
  data () {
    return {
      // 展开场景
      sceneExpand: true,
      // 展开模型
      modelExpand: false,
      // 最小化
      minimize: true,
      // 固定最大
      max: false,
      // 场景配置数据
      scene: '',
      // 模型配置
      config: '',
      anmiation: [],
      selectOptions: {}
    }
  },
  created () {
    // 接受到场景配置json数据
    this.$eventBus.$on('CONFIG_UNITY_SCENE', scene => {
      console.log('CONFIG_UNITY_SCENE', scene)
      this.scene = scene
      this.getDevs()
    })
    // 接受到模型配置json数据
    this.$eventBus.$on('CONFIG_UNITY_MODEL', item => {
      console.log('CONFIG_UNITY_MODEL', item)
      this.config = item
      this.getanimation()
    })
  },
  methods: {
    // 切换固定最大
    toggleMax () {
      this.max = !this.max
    },
    // 进入
    enter () {
      this.minimize = false
      if (typeof this.setSceneRun === 'function') this.setSceneRun(false)
    },
    // 鼠标离开
    leave () {
      if (typeof this.setSceneRun === 'function') this.setSceneRun(true)
      if (this.max) return
      this.minimize = true
    },
    // 绑定数据
    bindingModel () {
      if (!this.config) return
      let { chainId, modelID, guid } = this.config
      BIND_MODEL({
        chainId,
        modelID,
        guid,
        scenesId: this.config.ScenceId
      }).then(res => {
        if (res.err) return
        this.$toasting({
          title: '提示',
          message: res.data,
          type: 'success'
        })
      })
    },
    getDevs () {
      GET_ALL_DEV().then(res => {
        if (res.err) return
        this.selectOptions = res.data
      })
    },
    getanimation () {
      GET_ANIMATION({like: this.config.modelname}).then(res => {
        if (res.err) return
        let animat = res.data.Data.map(item => {
          return item.animationname.split(';')
        })
        // 二位数组状以为数组
        let arr = []
        for (const an of animat) {
          arr = [...arr, ...an]
        }
        this.anmiation = [...new Set(arr)].map((item, index) => {
          return {
            name: '动画' + (index +1),
            value: item
          }
        })
      })
    },
    // 实时保存，会有性能问题
    watchConfig: Lodash.debounce(function () {
      this.$eventBus.$emit('SAVE_UNITY_MODEL', this.config)
    }, 2000)
  },
  watch: {
    config: {
      handler (n, o) {
        this.watchConfig()
      },
      immediate: false,
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
  .noselect {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
  .text-input {
    display: block;
    width: 170px;
    line-height: 30px;
    border: 1px solid #E8E8EB;
    text-indent: 5px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    background: #FFFFFF;
    outline: none;
    color: rgba(0, 0, 0, 0.85);
    &:focus-within {
      border: 1px solid #219AF2;
    }
  }
  .config-header {
    display: flex;
    align-items: center;
    position: relative;
    background: #ffffff;
    height: 40px;
    padding-left: 10px;
    font-size: 12px;
    color: rgba(0,0,0,0.85);
    border-bottom: 1px solid #E9E9E9;
    cursor: pointer;
    &.unfold .expand-icon {
      transform: rotate(0deg);
    }
    .expand-icon {
      transition: transform .3s;
      font-size: 12px;
      color: rgba(0,0,0,0.85);
      transform: rotate(-90deg);
    }
  }
  .u3d-config-panel.minimize {
    right: -250px;
    .min-box {
      display: block;
    }
    .big-box {
      opacity: 0;
    }
  }
  .min-box {
    background: #ffffff;
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    height: 100%;
    width: 20px;
    font-size: 14px;
    color: rgba(25,144,255,1);
    border-right: 1px solid rgba(25,144,255,.6);
    border-left: 1px solid rgba(25,144,255,.6);
    line-height: 2;
  }
  .big-box {
    transition: all 1.5s;
    width:100%;
    height: 100%;
  }
  .panel-items {
    z-index: 9;
    transition: all .8s;
    position: fixed;
    right: 0;
    top: 56px;
    width:270px;
    height: 100%;
    background:rgba(255,255,255,1);
    box-shadow:0px 5px 20px 0px rgba(0,0,0,0.05);
    .chart-name {
      position: relative;
      text-align: center;
      padding: 0 10px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .max-box.max {
        transform: rotate(0);
      }
      .max-box {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        font-size: 16px;
        color:rgba(25,144,255,1);
        transform: rotate(180deg);
      }
      .name {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        line-height: 40px;
        text-indent: 10px;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
      }
    }
    .config-unity {
      height: calc(100% - 145px);
      overflow: auto;
      overflow-x: hidden;
    }
    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      border-top: 1px solid #dddddd;
    }
    .button {
      width: 160px;
      height: 30px;
      background: #219AF2;
      border-radius: 2px;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
