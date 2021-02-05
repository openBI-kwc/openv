<template lang="pug">
  //- 数据视图
  //- 屏蔽鼠标右键
  .matrix-preview(ondragstart="window.event.returnValue = false" oncontextmenu="window.event.returnValue = false" onselectstart="window.event.returnValue = false" ondragover="javascript: return false;" :style="getScreenBoxStyle")
    Loading(v-if="loading")
    .screen-box(:class="{'hidden': loading}")
      MatrxItem.screen(v-if="screen.id", v-for="(screen, index) in screenList",
        :styles="styleSc(screen)",
        :screenId="screen.id",
        :key="index")
</template>

<script>
import Utils from '@public/utils'
import {
  GET_MATRIX_INFO
} from '@api/visualedit.js'
export default {
  data () {
    return {
      loading: true,
      scale: null,
      screenWidth: null,
      screenHeight: null,
      id: Utils.deBase64(this.$route.params.id),
      screenList: [],
      matrixOption: {}
    }
  },
  created () {
    this.getDirData()
  },
  computed: {
    getScreenBoxStyle () {
      let style = {
        transform: `scale(${this.scale})`,
        width: `${this.matrixOption.width}px`,
        height: `${this.matrixOption.height}px`,
        transformOrigin: 'left top 0'
      }
      return style
    }
  },
  methods: {
    styleSc (item) {
      let style = {
        width: `${item.width}px`,
        height: `${item.height}px`,
        left: `${item.x}px`,
        top: `${item.y}px`,
        transformOrigin: 'left top 0'
      }
      return style
    },
    // 获取屏幕数据
    getDirData () {
      GET_MATRIX_INFO({id: this.id}).then((res) => {
        if (res.err) return
        let dir = res.data.dir
        document.title = '矩阵预览 | ' + dir.name
        if (!Utils.isJsonString(dir.data)) return
        let matrixData = JSON.parse(dir.data)
        this.screenList = matrixData.screenList
        this.matrixOption = matrixData.option
        this.loading = false
        let width = this.$el.clientWidth
        this.scale = width / this.matrixOption.width
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .matrix-preview {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    .hidden {
      position: fixed;
      left: -10000000%;
      top: -10000000000%;
      opacity: 0;
    }
    .screen {
      position: absolute;
      z-index: inherit;
      overflow: hidden;
    }
  }
</style>
