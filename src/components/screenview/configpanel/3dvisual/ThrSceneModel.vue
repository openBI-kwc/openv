<template lang="pug">
  .model-box(:class="{'minimize': minimize}", @mouseenter="enter", @mouseleave="leave")
    .big-box
      .header
        .nmae 模型库
        .max-box.icon(:class="{'max': max}", @click="toggleMax") &#xe65a;
        //- .upload 上传模型
      .model-list.clearfloat
        .model.float-left(v-for="(item,index) in modelList" :key="index")
          .img-box
            img(@click.self="selectModel(item)", v-lazy="setting.server + item.unityimagepath")
            .opt
              //- .icon.edit &#xe633;
              .icon.del(@click="delModel(item)") &#xe61c;
          .name {{item.unityname}}
    .min-box 模型库
</template>
<script>
import {
  GET_UNITY_MODEL,
  DEL_MODEL
} from '@api/visualscreen.js'
import { mapState } from 'vuex'
export default {
  props: {
    setSceneRun: ''
  },
  data () {
    return {
      // 最小化
      minimize: true,
      // 固定最大
      max: false,
      modelList: []
    }
  },
  created () {
    this.getModelList()
  },
  computed: {
    ...mapState(['setting'])
  },
  methods: {
    // 删除模型
    delModel (item) {
      this.$alert({type: 'warning', msg: '确定要删除吗?'}, () => {
        DEL_MODEL({id: item.unityid}).then(res => {
          if (res.err) return
          this.getModelList()
          this.$toasting({
            title: '提示',
            message: res.data,
            type: 'success'
          })
        })
      })
    },
    // 切换固定最大
    toggleMax () {
      this.max = !this.max
    },
    // 鼠标进入
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
    selectModel (item) {
      this.$eventBus.$emit('SELECT_UNITY_MODEL', item)
    },
    getModelList () {
      GET_UNITY_MODEL().then((responseData) => {
        if (!responseData.err) {
          this.modelList = responseData.data.Data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .model-box.minimize {
    left: -250px;
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
    right: 0;
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
  .model-box {
    z-index: 9;
    transition: all .8s;
    position: fixed;
    left: 0;
    top: 56px;
    width:270px;
    height: 100%;
    background:rgba(255,255,255,1);
    box-shadow:0px 5px 20px 0px rgba(0,0,0,0.05);
    .header {
      border-bottom: 1px solid rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      height:42px;
      padding: 0 10px;
      background:rgba(255,255,255,1);
      .name {
        font-size:16px;
        color:rgba(0,0,0,0.85);
      }
      .max-box.max {
        transform: rotate(180deg);
      }
      .max-box {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 16px;
        color:rgba(25,144,255,1);
      }
      .upload {
        cursor: pointer;
        font-size: 14px;
        color:rgba(25,144,255,1);
      }
    }
    .model-list {
      padding: 20px 0;
      height: calc(100% - 82px);
      overflow: auto;
      .img-box {
        position: relative;
        width:108px;
        height:96px;
        border:1px solid rgba(0,0,0,0.1);
        box-sizing: content-box;
        img {
          cursor: pointer;
          width:108px;
          height:96px;
          border: 0;
          outline: none;
        }
        .opt {
          display: none;
          position: absolute;
          width: 100%;
          height: 20px;
          left: 0;
          top: 0;
          z-index: 9;
          justify-content: space-between;
          align-items: center;
          .icon {
            margin: 5px;
            color: #1890FF;
            cursor: pointer;
            font-size: 12px;
          }
        }
      }
      .name {
        margin-top: 10px;
        height:20px;
        font-size:14px;
        color:rgba(0,0,0,0.85);
        line-height:20px;
        text-align: center;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width: 108px;
      }
      .model {
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 20px;
        &:hover .img-box {
          border:1px solid rgba(24,144,255,1);
        }
        &:hover .opt {
          display: flex;
        }
      }
    }
  }
</style>
