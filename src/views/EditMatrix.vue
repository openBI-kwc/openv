<template lang="pug">
  .matrix
    //- 发布
    Loading(v-if="showLoading")
    template(v-else)
      .group-title
        .back.icon(@click="back") &#xe624;
        .preview-matrix
          .header-button(@click="openPreview")
            .icon &#xe63f;
            .text 预览
      .loading-indicator(:class="{'loading': chartLoading}")
      .matrix-box(v-if="preSeting")
        .screen-list
          .screen-list-header 可视化列表
          .screen(v-for="(item,index) in brief", :draggable="true", @dragstart='dragstart(item)', @dragend="draging = false")
            img(v-if="item.imgdata", v-lazy="setting.server + item.imgdata")
            .no-img(v-else)
            .name {{item.name}}
        //- 屏幕
        .matrix(@click.stop.self="screenIndex = null")
          .preview-wrap
            .preview-screen(v-if="preSeting.scale",
              :style="preSetingStyle",
              :id="mid")
              template(v-for="(item, ind) in screenList")
                Deformation.deformation(v-if="!draging",
                  :w="item.width",
                  :h="item.height",
                  :maxw="item.maxWidth",
                  :maxh="item.maxHeight",
                  :x="item.x",
                  :y="item.y",
                  :inscreen="true",
                  :scaling="true",
                  :class="{'selected': screenIndex === ind + 1}",
                  :style="{'zIndex': ind}",
                  @dragstop="dragStop($event, ind)",
                  @activated="onActivated(ind)",
                  @resizestop="onResizstop($event, ind)",
                  @keydown="keydown($event, item)",
                  :zoom="preSeting.scale / 10",
                  :ref="ind")
                  .cover(ondragstart="return false;")
                    img(v-if="item.imgdata", v-lazy="setting.server + item.imgdata")
                    .textOpen(v-else) {{item.name}}
                .content(v-else, @dragover='dragover($event)', @drop='drop($event, ind)', :style="{width: item.width + 'px', height: item.height + 'px', left: item.x + 'px', top: item.y  + 'px'}")
                  .text 将屏幕拖动到此区域
          //- 滑动条
          .edit-slider
            Slider.slider(v-model="preSeting.scale", :min="1", :max="50", :step="1")
        //- 配置
        .matrix-option
          ExpandList(title="默认大屏设置")
            ControlItem(value="宽度")
              NumInput(v-model="defaultScreen.width", :max="preSeting.width")
            ControlItem(value="高度")
              NumInput(v-model="defaultScreen.height", :max="preSeting.heigh")
          ExpandList(title="矩阵设置")
            ControlItem(value="矩阵宽度")
              NumInput(v-model="preSeting.width", :max="9999")
            ControlItem(value="矩阵高度")
              NumInput(v-model="preSeting.height", :max="9999")
            ControlItem(value="矩阵缩放")
              NumInput(v-model="preSeting.scale", :min="1", :step="1", :max="50")
            ControlItem(value="封面设置")
              .screenshot
                template(v-if="!screenshoting")
                  .shot-btn(@click="screenshot") 截图
                  .upload-btn.shot-btn 上传
                    input(type="file" @change="uploadScreenshot", accept="image/jpeg,image/png,image/bmp")
                .screenshoting(v-else) 封面设置中...
          ExpandList(v-if="screenIndex", title="当前大屏设置")
            ControlItem(value="宽度")
              NumInput(:min="0", v-model="screenList[screenIndex - 1].width")
            ControlItem(value="高度")
              NumInput(:min="0", v-model="screenList[screenIndex - 1].height")
            ControlItem(value="X坐标")
              NumInput(:min="0", v-model="screenList[screenIndex - 1].x")
            ControlItem(value="Y坐标")
              NumInput(:min="0", v-model="screenList[screenIndex - 1].y")
          .bottom-box
            .bottom-btn(v-if="screenIndex", @click.stop="deleteHandler(screenIndex)")
              .text 删除屏幕
              .icon &#xe61c;
            .bottom-btn(:class="{'active': this.screenList.length >= 5}", @click="addScreen")
              .text 增加屏幕
              .icon &#xe623;
</template>
<script>
import { Utils, Lodash } from '@public/utils'
import html2canvas from 'html2canvas'
import {
  GET_MATRIX_INFO,
  SAVE_MATRIX
} from '@api/visualedit.js'
import { UPLOAD_TMP_COVER } from '@api/upload.js'
const { formParams } = Utils
const $ = window.$
export default {
  data () {
    return {
      screenshoting: false,
      chartLoading: false,
      // 拖动
      draging: false,
      // 选中的大屏
      screenIndex: null,
      showLoading: true,
      id: null,
      // 预览设置
      preSeting: {
        width: 1920,
        height: 1080,
        scale: 1
      },
      screenOpt: null,
      // 正在拖动的大屏
      dragItem: null,
      // 大屏列表
      brief: {},
      // 添加屏幕的配置
      defaultScreen: {
        width: 1920,
        height: 1080,
        maxWidth: 5000,
        maxHeight: 5000
      },
      // 当前矩阵的大屏数量
      screenList: [],
      // 矩阵的缩放大小
      scale: '',
      mid: ''
    }
  },
  created () {
    this.id = Utils.deBase64(this.$route.params.id)
    this.mid = 'MATRX-' + this.$route.params.id
    this.getMtrixData()
  },
  mounted () {
    let $this = this
    let resizeScreen = Lodash.debounce(function () {
      $this.preSeting.scale = $this.calcscale()
    }, 2000, {
      leading: false,
      maxWait: 5000
    })
    $(window).on('resize', resizeScreen)
  },
  computed: {
    preSetingStyle () {
      let screen = this.preSeting
      let style = {
        transform: `scale(${screen.scale / 10})`,
        width: `${screen.width}px`,
        height: `${screen.height}px`
      }
      return style
    }
  },
  methods: {
    back () {
      this.$router.push({name: 'matrix'})
    },
    openPreview () {
      const { href } = this.$router.resolve({
        name: 'matrixPreview',
        params: {
          id: Utils.enBase64(this.id)
        }
      })
      Utils.openURL(href, '_blank')
    },
    // 计算缩放比例
    calcscale () {
      let target = $('#' + this.mid)[0]
      if (!target) return 10
      let parent = target.parentNode
      let offSetw = target.offsetLeft * 2
      const width = parent.offsetWidth - offSetw
      const swidth = this.preSeting.width
      let s = (width / swidth) * 10
      return s > 50 ? 50 : s
    },
    // 向服务器获取矩阵数据
    getMtrixData () {
      GET_MATRIX_INFO({id: this.id}).then((response) => {
        this.showLoading = false
        if (response.err) return
        let dir = response.data.dir
        // 大屏列表
        this.brief = response.data.screenSummary
        document.title = '矩阵编辑 | ' + dir.name
        if (dir.data && Utils.isJsonString(dir.data)) {
          let data = JSON.parse(dir.data)
          this.scale = data.option.scale
          this.preSeting = {
            width: data.option.width,
            height: data.option.height,
            scale: data.option.scale
          }
          this.screenList = data.screenList
        }
        // 父容器的宽高
        setTimeout(() => {
          // 默认屏幕大小
          this.preSeting.scale = this.calcscale()
        }, 100)
      })
    },
    // 设置画布
    getCanvas (dom, scale = 2) {
      let canvas = document.createElement('canvas')
      let w = parseInt(window.getComputedStyle(dom).width)
      let h = parseInt(window.getComputedStyle(dom).height)
      // 将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
      canvas.width = w * scale
      canvas.height = h * scale
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      // 可以按照自己的需求，对context的参数修改,translate指的是偏移量
      let context = canvas.getContext('2d')
      context.scale(scale, scale)
      return canvas
    },
    // 截图
    screenshot (e) {
      let scale = 2
      let dom = $('#' + this.mid)[0]
      let screenOption = {
        scale: scale || 2,
        useCORS: true,
        canvas: this.getCanvas(dom, scale),
        width: dom.clientWidth,
        height: dom.clientHeight
      }
      let teampscale = this.preSeting.scale
      this.preSeting.scale = 10
      this.screenshoting = true
      // 获取屏幕缩略图
      html2canvas(dom, screenOption).then(canvas => {
        this.preSeting.scale = teampscale
        // canvas.toDataURL 返回的是一串Base64编码的URL
        // 指定格式 PNG
        let context = canvas.getContext('2d')
        // 【重要】关闭抗锯齿
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false
        // 获取参数
        let geParams = (obj) => {
          let formdata = new FormData()
          for (const key in obj) {
            const value = obj[key]
            formdata.append(key, value)
          }
          return formdata
        }
        let data = {
          id: this.id,
          imgdata: Utils.convertCanvasToBlob(canvas),
          scale
        }
        let params = geParams(data)
        UPLOAD_TMP_COVER(params).then((res) => {
          this.screenshoting = false
          this.$alert({type: 'success', msg: '封面更换成功!'})
        })
      })
    },
    uploadScreenshot (e) {
      // 判断应该从哪个接口请求数据
      // const type = this.$route.params.type
      let formdata = new FormData()
      formdata.append('id', this.id)
      let params = formParams(e, 'imgdata', formdata)
      UPLOAD_TMP_COVER(params).then((response) => {
        this.$alert({type: 'success', msg: '封面上传成功!'})
      })
      e.target.value = ''
    },
    keydown (event, item) {
      if (event.key === 'Delete') {
        this.$store.dispatch('REMOVE_POSITION', item)
      }
    },
    // 增加屏幕
    addScreen () {
      const key = Utils.unid('matrx')
      const defaultScreen = this.defaultScreen
      let data = {
        key,
        width: defaultScreen.width,
        height: defaultScreen.height,
        maxWidth: defaultScreen.maxWidth,
        maxHeight: defaultScreen.maxHeight,
        x: 100,
        y: 100
      }
      this.screenList.push(data)
      if (this.screenList.length >= 5) {
        this.$toasting({
          type: 'warning',
          message: '最多添加5个屏幕！'
        })
      }
    },
    // 保存大屏
    updateMatrix () {
      return new Promise(resolve => {
        this.chartLoading = true
        let isEmptyScreen = this.screenList.some(item => {
          if (!item.id) return true
          return false
        })
        if (isEmptyScreen) {
          this.chartLoading = false
          return this.$toasting({
            type: 'warning',
            title: '警告',
            message: '存在空的屏幕'
          })
        }
        const data = {
          option: this.preSeting,
          screenList: this.screenList
        }
        SAVE_MATRIX({id: this.id, data: JSON.stringify(data)}).then(res => {
          if (!res.err) {
            this.chartLoading = false
            resolve()
          }
        })
      })
    },
    dragStop (value, ind) {
      // 错误处理
      if (ind + 1) {
        this.screenList[ind].x = value[0]
        this.screenList[ind].y = value[1]
      }
    },
    onActivated (ind) {
      this.screenIndex = ind + 1
    },
    // 删除屏幕
    deleteHandler (screenIndex) {
      this.$alert({type: 'warning', msg: '确定要删除吗'}, async () => {
        this.screenList.splice(screenIndex - 1, 1)
        await this.updateMatrix()
        this.$toasting({
          type: 'success',
          title: '成功',
          message: '删除成功！'
        })
        this.screenIndex = null
      })
    },
    onResizstop (info, index) {
      this.screenList[index].x = info[0]
      this.screenList[index].y = info[1]
      this.screenList[index].width = info[2]
      this.screenList[index].height = info[3]
    },
    dragstart (item) {
      this.dragItem = item
      this.draging = true
    },
    drop (event, ind) {
      event.preventDefault()
      const item = this.dragItem
      if (item) {
        this.screenList[ind].imgdata = item.imgdata
        this.screenList[ind].id = item.id
        this.screenList[ind].name = item.name
        this.updateMatrix()
      }
    },
    dragover (event) {
      event.preventDefault()
    },
    changeWidth (value) {
      this.preSeting.width = value
    },
    changeHeight (value) {
      this.preSeting.height = value
    },
    changeSliderValue (value) {
      let cloneScreen = Lodash.cloneDeep(this.preSeting)
      cloneScreen.scale = value
      this.preSeting = cloneScreen
    },
    // 实时保存矩阵
    watchScreenOption: Lodash.debounce(function () {
      this.updateMatrix()
    }, 600, {leading: false})
  },
  watch: {
    screenIndex (n, o) {
      if (n) {
        this.screenOpt = this.screenList[n - 1]
      } else {
        this.screenOpt = null
      }
    },
    screenOpt: {
      handler (n, o) {
        if (!this.screenOpt) return
        this.watchScreenOption()
      },
      immediate: false,
      deep: true
    }
  },
  beforeDestroy() {
    $(window).off('resize')
  }
}
</script>

<style lang="less" scoped>
  .screenshoting {
    width: 170px;
    line-height: 30px;
    text-align: center;
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
  .group-title {
    position: relative;
    width: 100%;
    height: 60px;
    line-height: 60px;
    display: flex;
    align-items: center;
    background: #1A1F28;
    box-shadow: 0 -4px 8px 0 #10141A;
    .back {
      width: 30px;
      height: 30px;
      position: absolute;
      left: 10px;
      cursor: pointer;
      text-align: center;
      line-height: 30px;
      color: #fff;
    }
  }
  .screenshot {
    display: flex;
    align-items: center;
    color: #333;
    width: 170px;
    border: 1px solid #E8E8EB;
    .shot-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      height: 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
      font-size: 1em;
      line-height: 30px;
      cursor: pointer;
      color: #364960;
      &.upload-btn {
        position: relative;
          input {
          position: absolute;
          opacity: 0;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border: none;
          outline: none;
        }
      }
    }
    .shot-btn:hover, .shot-btn.active {
      color: #fff;
      background: #364960;
    }
    .upload {
      input {
        cursor: pointer;
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
    }
  }
  .matrix-box {
    width: 100%;
    height: calc(~"100% - 60px");
    display: flex;
    .screen {
      position: relative;
      height: 90px;
      padding: 9px 20px 0 20px;
      overflow: hidden;
      cursor: -webkit-grab;
      display: flex;
      border-bottom: 1px solid #4B5364;
      &:last-child {
        border-bottom: 0;
      }
      img {
        width: 100px;
        height: 68px;
      }
      .no-img {
        width: 100px;
        height: 68px;
        background: #0e2943;
      }
      .name {
        height: 23px;
        line-height: 23px;
        position: absolute;
        bottom: 0;
        left: 20px;
        font-size: 12px;
        color: #FFFFFF;
        width: 68px;
      }
    }
    .matrix {
      width: calc(~"100% - 460px");
      height: 100%;
      background: url("~@assets/img/screenbg.png") repeat;
      user-select: none;
    }
  }
  .screen-list {
    width: 160px;
    height: 100%;
    background: #373E4D;
    overflow: auto;
    .screen-list-header {
      width: 100%;
      height: 39px;
      font-size: 12px;
      color: #FFFFFF;
      text-align: center;
      line-height: 40px;
      border-bottom: 1px solid #4B5364;
    }
  }
  .deformation {
    border: 1px solid #2b91b7 !important;
    .cover {
      width: 100%;
      height: 100%;
      background: #cccccc;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .selected {
    z-index: 999 !important;
  }
  .content {
    position: absolute;
    border: 1px solid #ccc;
    background-color: darkslategray;
    .text {
      color: #ccc;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 40px;
      width: 300px;
      text-align: center;
      line-height: 40px;
      font-size: 2rem;
    }
  }
  .preview-matrix {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    font-size: 12px;
  }
  .header-button {
    width: 60px;
    height: 45px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    .icon {
      width: 16px;
      height: 16px;
      line-height: 16px;
      color: #009BF9;
      text-align: center;
      font-size: 16px;
    }
    .text {
      line-height: 20px;
      color: #FFFFFF;
      margin-top: 8px;
    }
  }
  .preview-wrap {
    position: relative;
    width: 100%;
    height: calc(100% - 30px);
    overflow: auto;
    .preview-screen {
      position: absolute;
      top: 60px;
      left: 60px;
      background: rgb(14, 42, 67);
      transform-origin: 0 0;
      transition: .3s all ease-in-out;
      background-size: cover,contain;
      background-position: center,right bottom;
      background-repeat: no-repeat,no-repeat;
      box-shadow: rgba(0,0,0,.5) 0 0 30px 0;
      img {
        user-select: none;
      }
      .preview-screen-info {
        z-index: 99;
        height: 40px;
        line-height: 20px;
        position: absolute;
        bottom: 0;
        right: 0;
        color: #666;
        padding: 10px;
        font-size: 14px;
        user-select: none;
      }
    }
  }
  .edit-slider {
    width: 100%;
    height: 30px;
    line-height: 30px;
    align-items: center;
    display: flex;
    background-color: #ffffff;
    border: 1px solid #cccccc;
    justify-content: flex-end;
    .slider {
      margin: 0 10px;
    }
  }
  .matrix-option {
    height: 100%;
    width: 300px;
    position: relative;
    overflow: auto;
    background: #f7f8fa;
    border-left: 1px solid #CCCCCC;
  }
  .bottom-box {
    position: absolute;
    width: 100%;
    bottom: 0;
    .bottom-btn {
      display: flex;
      justify-content: center;
      background: #FFFFFF;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      width: 100%;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #219AF2;
      margin: 5px 0;
      .icon {
        margin: 0 10px;
      }
    }
    .active {
      pointer-events: none;
    }
  }
  .textOpen{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 5rem;
  }
</style>
