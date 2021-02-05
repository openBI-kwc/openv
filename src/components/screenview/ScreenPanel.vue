// 大屏配置栏
<template lang="pug">
  .config-manager__screen
    Modal.tool-box(:show="useLocalImg", :showFooter="false",  @close="useLocalImg = false" text="图片列表")
      .bg-box
        .img-box(v-for="(item, index) in imgList", :key="index")
          img.img(:src="setting.server + (item.waterurl ? item.waterurl : item.waterurl)", @click.stop="setScreenBackGround(setting.server + (item.waterurl ? item.waterurl : item.waterurl))")
          //- .delate-button.icon(@click.stop="showDelateBox([item.upid])") &#xe61c;
      Paging.page-box(slot="footer" :page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
    .config-manager-header 大屏配置
    ControlItem(value="大屏宽度")
      NumInput(v-model="screenOption.width", :max="9999", :min="100")
    ControlItem(value="大屏高度")
      NumInput(v-model="screenOption.height", :max="9999", :min="100")
    ControlItem(value="背景类型")
      .bg-opt
        .item(v-for="item in backgroundPick")
          CheckBox.check(type="radio", v-model="screenOption.bgtype", :radioActive="item.value", @onChange="changeBgType")
          span.name {{item.name}}
    //- 背景图片
    template(v-if="screenOption.bgtype === 'image'")
      ControlItem(value="图片地址")
        input.bdinput(v-model="screenOption.background[screenOption.bgtype]")
      .control-entry
        Dropzone.upload-pane(type="file", @getFile="uploadBackground", accept="image/jpeg,image/png,image/bmp,image/gif,image/svg+xml")
          .show-image(v-if="screenOption.background[screenOption.bgtype]")
            img.images(:src="screenOption.background[screenOption.bgtype]")
          template(v-else)
            .icon &#xe61e;
            .text 点击或拖拽文件到这里选择
      ControlItem(value="使用本地素材")
        .local-button(@click="useLocalImg = true; getAttList()") 点击选择
      ControlItem(value="展示方式")
        .bg-opt
          .item(v-for="item in backgroundSize")
            CheckBox.check(type="radio", v-model="screenOption.background.backgroundSize", :radioActive="item.value")
            span.name {{item.name}}
    //- 背景颜色
    ControlItem(value="背景颜色", v-if="screenOption.bgtype === 'color'")
      ColorPicker(v-model="screenOption.background[screenOption.bgtype]")
    ControlItem(value="封面设置")
      .screenshot
        .shot-btn(@click="screenshot") 截图
        .shot-btn(@click.stop="showShotBtn") 上传
          input(ref="uploadShotInput" type="file" @change="uploadScreenshot", accept="image/jpeg,image/png,image/bmp,image/gif,image/svg+xml")
    ExpandList(title="辅助配置")
      //- 屏幕网格
      ControlItem(value="网格大小")
        NumInput(v-model="screenOption.gridSize", :max="50", :min="5")
      ControlItem(value="网格颜色")
        ColorPicker(v-model="screenOption.gridColor")
      ControlItem(value="锁定布局")
        SwitchBar(v-model="screenOption.prohibitDrag")
      ControlItem(value="全屏浏览", v-if="!isFull")
        .button
          .opt-btn.icon(@click="fullScreen") &#xe653;
      ControlItem(value="退出全屏", v-else)
        .button
          .opt-btn.icon(@click="fullScreen") &#xe655;
    ExpandList(title="高级配置")
      ControlItem(value="大屏动画")
        SwitchBar(v-model="screenOption.animate")
      ControlItem(value="动画间隔" v-if="screenOption.animate")
        NumInput(:min="0", :step="1000", v-model="screenOption.animateTime")
      
      ControlItem(value="导出大屏")
        .button
          .opt-btn.icon(@click="outputScreenOption") &#xe654;
      ControlItem(value="导入大屏")
        .button
          .opt-btn.icon.import(@click="inputScreenOption")
            | &#xe654;
            input(ref="dropzoneInput" type="file" @change="selectFile")
</template>

<script>
import { UPDATE_SCREEN_OPT, DELECT_BACKGROUND, EXPORT_SCREEN } from '@api/visualscreen.js'
import { UPLOAD_IMG, UPDATE_SCREEN_COVER, IMPORT_SCREEN } from '@api/upload.js'
import { GET_ATTLIST } from '@api/system.js'
import { Utils, Lodash } from '@public/utils'
import html2canvas from 'html2canvas'
import { mapState } from 'vuex'
const Dropzone = () => import('dropzone-puge')
const { formParams, openURL } = Utils
const $ = window.$
export default {
  components: {
    Dropzone
  },
  data () {
    return {
      imgList: [],
      // 使用本地素材
      useLocalImg: false,
      // 大屏id
      sid: Utils.deBase64(this.$route.params.id) || '',
      // 全屏
      isFull: false,
      currentPage: 1,
      total: 0,
      pageSize: 20,
      backgroundSize: [
        {name: '铺满', value: '100% 100%'},
        {name: '自适应', value: 'contain'}
      ],
      backgroundPick: [
        {value: 'color', name: '颜色'},
        {value: 'image', name: '图片'}
      ]
    }
  },
  computed: {
    ...mapState(['screenOption', 'setting'])
  },
  methods: {
    showShotBtn ($event) {
      this.$refs['uploadShotInput'].click()
    },
    // 选择文件
    selectFile (e) {
      e.preventDefault()
      let formdata = new FormData()
      formdata.append('sid', this.sid)
      let params = formParams(e, 'screenData', formdata)
      IMPORT_SCREEN(params).then(res => {
        if (res.err) return
        this.$toasting({
          type: 'success',
          message: '导入成功'
        })
      })
    },
    // 改变背景类型
    changeBgType (val) {
      let obj = {}
      switch (val) {
        case 'color':
          obj[val] = '#1B4457'
          break
        case 'image':
          obj[val] = ''
          obj.backgroundSize = '100% 100%'
          break
      }
      this.screenOption.background = obj
    },
    // 分页
    pageChange (page) {
      this.currentPage = parseFloat(page)
      this.getAttList()
    },
    // 获取背景图片列表
    getAttList () {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      GET_ATTLIST(params).then((responseData) => {
        if (responseData.err) return
        let res = responseData.data
        this.imgList = res.list
        this.total = res.total
      })
    },
    // 上传背景图
    uploadBackground (e) {
      let params = formParams(e, 'image')
      UPLOAD_IMG(params).then((response) => {
        if (response.err) {
          return this.$toasting({
            title: '警告',
            type: 'error',
            message: '上传失败'
          })
        }
        this.$toasting({
          type: 'success',
          message: '上传成功'
        })
        let url = this.setting.server + response.data.url
        let background = {}
        let sbg = this.screenOption.background
        let bgtype = this.screenOption.bgtype
        background = { ...sbg }
        background[bgtype] = url
        this.$store.dispatch('SET_SCREEN_OPTION', {
          background
        })
      })
      e.target.value = ''
    },
    // 截图
    screenshot (e) {
      // 清除组件选中，不清除截图出来的不好看
      this.$store.dispatch('SET_CHART_INDEX', null)
      this.$store.dispatch('SET_CHART_INDEX_LIST', [])
      // 元素id
      let SCREENID = 'canvas-screen-' + this.$route.params.id
      // 缩放倍数
      let scale = 2
      // 截图元素
      let dom = document.getElementById(SCREENID)
      let screenScale = this.screenOption.scale / 10
      let screenOption = {
        scale: scale,
        useCORS: true,
        canvas: this.getCanvas(dom, scale),
        width: dom.clientWidth,
        height: dom.clientHeight
      }
      // 获取截图前的缩放比例
      let tampscale = this.screenOption.scale
      // 取消缩放
      this.screenOption.scale = 10
      this.$nextTick(() => {
        html2canvas(dom, screenOption).then(canvas => {
          // 回到之前的比例
          this.screenOption.scale = tampscale
          // canvas.toDataURL 返回的是一串Base64编码的URL
          // let windowURL = window.URL || window.webkitURL
          // createObjectURL创建一个指向该参数对象(图片)的URL
          // let dataURL = windowURL.createObjectURL(canvas.toDataURL())
          // console.log(dataURL)
          // 指定格式 PNG
          let context = canvas.getContext('2d')
          canvas.imageTimeout = 0
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
            id: this.sid,
            imgdata: Utils.convertCanvasToBlob(canvas),
            scale
          }
          let params = geParams(data)
          UPDATE_SCREEN_COVER(params).then((response) => {
            this.$toasting({type: 'success', message: '封面更换成功!'})
          })
        })
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
    // 上传封面
    uploadScreenshot (e) {
      let formdata = new FormData()
      formdata.append('id', this.sid)
      let params = formParams(e, 'imgdata', formdata)
      UPDATE_SCREEN_COVER(params).then((result) => {
        if (result.err) return
        this.$toasting({
          type: 'success',
          message: '封面更换成功!'
        })
      })
      e.target.value = ''
    },
    // 改变屏幕设置
    changeScreenSize () {
      this.$eventBus.$emit('CHANGE_SCREEN_SCALE')
    },
    // 导出屏幕配置
    outputScreenOption () {
      const params = {
        id: this.sid
      }
      EXPORT_SCREEN(params).then(result => {
        if (result.err) return
        openURL(result.data, '_self')
      })
    },
    // 导入
    inputScreenOption () {
      this.$refs['dropzoneInput'].click()
    },
    // 网页全屏
    launchFullscreen (element) {
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
    // 退出网页全屏
    exitFullscreen (element) {
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
    // 进入网页全屏
    fullScreen () {
      if (!this.isFull) {
        // 启动全屏!
        this.launchFullscreen(document.documentElement) // 整个网页
      } else {
        this.exitFullscreen(document)
      }
      this.isFull = !this.isFull
    },
    // 设置背景图
    setScreenBackGround (data) {
      let background = {}
      let sbg = this.screenOption.background
      let bgtype = this.screenOption.bgtype
      background = { ...sbg }
      background[bgtype] = data
      this.$store.dispatch('SET_SCREEN_OPTION', {
        background
      })
      this.useLocalImg = false
    },
    // 删除上传的背景图
    showDelateBox (upid) {
      // 显示删除提示框
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        DELECT_BACKGROUND({upid}).then((response) => {
          // 获取背景列表
          this.getAttList()
          // 当删除已在使用的背景图，使用默认的。
          this.setScreenBackGround()
          console.log('删除背景图片:', response)
          if (!response.err) {
            this.imgName = response.data
          }
        })
      })
    },
    watchOpt: Lodash.debounce(function () {
      // 保存大屏配置到vuex
      this.$store.dispatch('SET_SCREEN_OPTION', this.screenOption)
      this.changeScreenSize()
      let params = {
        sid: this.sid,
        screenOpt: this.screenOption
      }
      console.log('屏幕配置变化')
      this.$store.dispatch('SET_CHART_LOADING', true)
      UPDATE_SCREEN_OPT(params).then(res => {
        if (res.err) return
        this.$store.dispatch('SET_CHART_LOADING', false)
      })
    }, 600, {leading: false})
  },
  watch: {
    screenOption: {
      handler (n, o) {
        if (!o) return
        this.watchOpt()
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
  input {
    opacity: 0;
    display: none;
  }
  .bdinput {
    opacity: 1;
    display: inline-block;
    text-indent: 12px;
    width: 170px;
    height: 30px;
    line-height: 30px;
    outline: none;
    background: rgba(0,0,0,0);
    border: none;
    border-bottom: 1px solid #2E3E50;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    &:focus {
      border-bottom: 1px solid #219AF2;
    }
  }
  .bg-opt {
    width: 170px;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .item {
      width: 65px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 20px;
      .name {
        color: rgba(255, 255, 255, .7);
      }
    }
  }
  .show-image, .images {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #ffffff;
  }
  .local-button {
    cursor: pointer;
    width: 170px;
    height: 30px;
    line-height: 30px;
    color: #1890FF;
    text-align: center;
    font-weight: 400;
    background: rgba(0,0,0,0);
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
  }
  .config-manager__screen /deep/ .upload-pane {
    height: 130px;
    width: 100%;
    margin: 10px 0;
    background: #131212;
    border: 1px solid #e9e9e9;
    cursor: pointer;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .icon {
      color: #219af2;
      font-size: 2rem;
      width: 24px;
      height: 28px;
      text-align: center;
      margin: 0 auto;;
    }
    .text {
      font-size: 12px;
      height: 20px;
      color: #ffffff;
      text-align: center;
      margin-top: 15px;
    }
  }
  .import {
    position: relative;
    transform: rotate(180deg);
  }
  .config-manager__screen {
    height: 100%;
    width: 100%;
    position: relative;
    .exit-full {
      font-weight: bold;
    }
    /deep/ .upload-box {
      display: block;
      width: 170px;
    }
  }
  .screenshot {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, .7);
    width: 170px;
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
      border-radius: 2px;
      color: #1890FF;
    }
    .shot-btn:hover, .shot-btn.active {
      color: #1890FF;
      border:1px solid #219af2;
    }
  }
  .button {
    width: 170px;
    height: 40px;
    display: flex;
    align-items: center;
    .opt-btn {
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: rgba(255, 255, 255, .7);
      cursor: pointer;
      &:hover {
        color: #219af2;
      }
    }
  }
  .config-manager-header {
    width: 100%;
    height: 39px;
    font-size: 16px;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.3);
    text-align: center;
    line-height: 40px;
    cursor: default;
  }
  .bg-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .page-box {
    width: 100%;
    justify-content: center;
  }
  .img-box .img {
    cursor: pointer;
    margin: 10px;
    height: 150px;
    width: 150px;
    object-fit: cover;
  }
  .delate-button {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.4);
    width: 5px;
    height: 5px;
    left: 5px;
    bottom: 5px;
    line-height: 5px;
    text-align: center;
    cursor: pointer;
    color: #ffffff;
    font-size: 10px;
  }
</style>
