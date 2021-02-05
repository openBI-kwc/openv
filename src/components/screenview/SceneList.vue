<template lang="pug">
  .scene-list
    .panel-item
      .clickPanel(@click="creatNew3dScreen", tag="div")
      .lazy.create
        .img.icon &#xe637;
      .name 新建3D场景
    .panel-item(v-for="(item, index) in threeScreen", :key="index")
      .opt
        .icon.edit(@click="editScene(item)") &#xe633;
        .icon.del(@click="delScene(item)") &#xe61c;
      .clickPanel(@click.self="$emit('onClick', item)")
      .lazy
        img.img(v-lazy="'./static/assets/thumbnails/3dchangjing.png'")
      .name {{item.name}}
</template>
<script>
import {
  GET_3D_SCENES,
  DEL_SCENE
} from '@api/visualscreen.js'
import Utils from '@public/utils'
const { enBase64 } = Utils
export default {
  data () {
    return {
      // 3d场景
      threeScreen: []
    }
  },
  created () {
    this.getScenes()
  },
  methods: {
    // 创建新的3d场景
    creatNew3dScreen () {
      const { href } = this.$router.resolve({
        path: '/3dscene',
        name: '3dscene',
        params: {
          type: 'create'
        }
      })
      Utils.openURL(href, '_blank')
    },
    // 编辑场景
    editScene (item) {
      const { href } = this.$router.resolve({
        path: '/3dscene',
        name: '3dscene',
        params: {
          type: 'edit',
          id: enBase64(item.chartData.id)
        }
      })
      Utils.openURL(href, '_blank')
    },
    // 删除场景
    delScene (item) {
      this.$alert({type: 'warning', msg: '确定要删除该场景吗？'}, () => {
        DEL_SCENE({id: item.chartData.id}).then(res => {
          if (res.err) return
          this.getScenes()
          this.$toasting({
            title: '提示',
            message: res.data,
            type: 'success'
          })
        })
      })
    },
    // 获取场景
    getScenes () {
      GET_3D_SCENES().then(res => {
        if (res.err) return
        this.threeScreen = res.data.map(item => {
          return {
            comtype: '3dvisual',
            comkey: '3dchangjing',
            name: item.scenesname,
            width: 1000,
            height: 1000,
            chartData: item,
            charttype: 'unity3d'
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .panel-item {
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: relative;
    margin: 5px;
    &:hover .opt {
      display: flex;
    }
    &:hover .lazy, .create {
      background: #29303C;
      width: 100px;
      height: 100px;
      border: 1px solid #219AF2;
    }
    .lazy {
      background: #29303C;
      opacity: .85;
      cursor: pointer;
      .img {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
      .icon.img {
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        font-size: 35px;
        color: rgba(33,154,242,1);
      }
    }
    .name {
      width: 100%;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #d8cfbf;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      position: absolute;
      bottom: 0;
      left: 0;
      user-select: none;
    }
  }
  .opt {
    display: none;
    position: absolute;
    width: 100%;
    height: 20px;
    left: 0;
    top: 0;
    z-index: 10;
    justify-content: space-between;
    align-items: center;
    .icon {
      margin: 5px;
      color: #1890FF;
      cursor: pointer;
      font-size: 14px;
    }
  }
  .clickPanel {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 9;
  }
</style>
