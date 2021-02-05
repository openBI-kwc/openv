<template lang="pug">
  .create-screen
    //- 选择分类
    Modal.create-modal(:show="showCreate", @close="showCreate = false", @confrim="addScreen", text="创建大屏")
      .input-items
        .item
          .required
            i.icon &#xe692;
            | 请输入大屏名称
          input.input-control(v-model="screenName")
        .item
          .required
            i.icon &#xe692;
            | 请输选择所属分类
          Selection.select-by-bg(v-model="cateSelected", :option="cateList", :width="350")
    //- 头部
    .header
      .head-left
        .back(@click="backControl")
          span.icon &#xe624;
          |返回
    .content
      .tmp-list
        .tmp(@click="tmpIndex = 'empty'", :class="{'active': tmpIndex === 'empty'}")
          .thumbnail.empty
          .tmp-info
            .name.item 空白大屏
            .ratio.item 比例: 自定
            .pixel.item 尺寸: 自定
        .tmp(v-for="(item, ind) in tmplist", @click="tmpIndex = ind", :class="{'active': tmpIndex === ind}")
          img.thumbnail.img(v-if="item.thumbnail", :src="setting.server + item.thumbnail")
          .tmp-info
            .name.item {{item.name}}
            .ratio.item 比例: {{item.ratio}}
            .pixel.item  尺寸: {{item.pixel}}
      .tmp-prev
        .select-tmp-name {{tmpIndex !== 'empty' ? selectedTmp.name : '选择模板'}}
        .screen-tmp-img(ref="ScreenImg" :class="[tmpIndex === 'empty' ? 'empty-tmp' : '']" :style="screenImgStyle")
          .screen-tmp-mask
          .creat-button(@click="getTmpList('yes')") 使用
          .actualSize 屏幕大小：{{actualSize.width}} x {{actualSize.height}}
        .screen-tmp-ratio(v-if="tmpIndex === 'empty'")
          .tmp-ratio(v-for="ratio in tmpratio" :key="ratio" @click="changeRatio(ratio)" :class="{'active': selectRatio === ratio}") {{ratio}}
</template>

<script>
import { Utils, Lodash } from '@public/utils'
import { mapState } from 'vuex'
import { GET_CREATE_SCREEN_INFO } from '@api/visualscreen.js'
import {
  GET_TEMPLATE,
  GET_CATE_LIST
} from '@api/visualrelated.js'
const $ = window.$
export default {
  data () {
    return {
      showCreate: false,
      // 选中的模板索引 默认空白大屏
      tmpIndex: 'empty',
      // 选择的分类
      cateSelected: '',
      // 大屏名字
      screenName: '',
      // 模板列表
      tmplist: [],
      // 分类列表
      cateList: [],
      // 比例
      tmpratio: ['16:9', '4:2', '1:1', '1:2'],
      // 选择的比例
      selectRatio: '16:9',
      // 当前的图片的宽高
      screenImgHeight: 0,
      screenImgWidth: 0
    }
  },
  created () {
    this.getTmpList('no')
    this.getCateList()
    this.$nextTick(() => {
      this.getWh()
      $(window).on('resize', () => { this.getWh() })
    })
  },
  beforeDestroy () {
    $(window).off('resize')
  },
  computed: {
    ...mapState(['setting', 'screenOption']),
    // 宽高比
    whratio () {
      const r = this.selectRatio.split(':')
      return parseInt(r[0]) / parseInt(r[1])
    },
    // 屏幕实际宽高
    actualSize () {
      let height = Lodash.cloneDeep(this.screenOption).height
      let width = parseInt(height * this.whratio)
      return {width, height}
    },
    // 屏幕样式
    screenImgStyle () {
      let sty = {
        width: this.screenImgWidth + 'px'
      }
      if (this.selectedTmp && this.selectedTmp.img) {
        sty.background = `background: url(${this.selectedTmp.img}) 0 0 / cover no-repeat;`
      }
      return sty
    },
    // 选中的模板
    selectedTmp () {
      return this.tmpIndex === 'empty' ? null : (this.tmplist[this.tmpIndex] || null)
    }
  },
  methods: {
    // 获取w h
    getWh () {
      this.screenImgHeight = $(this.$refs.ScreenImg).height()
      this.screenImgWidth = this.screenImgHeight * this.whratio
    },
    // 改变比例
    changeRatio (ratio) {
      this.selectRatio = ratio
      this.screenImgWidth = this.screenImgHeight * this.whratio
    },
    // 获取分类
    getCateList () {
      GET_CATE_LIST().then(result => {
        this.cateList = result.map((item, index) => {
          if (index === 0) this.cateSelected = item.sid
          return {name: item.screenname, value: item.sid}
        })
      })
    },
    // 取消创建
    backControl () {
      this.$alert({type: 'warning', msg: '确定取消新建大屏吗?'}, () => {
        this.$router.replace('/visual')
      })
    },
    // 获取模板列表
    getTmpList (show = 'yes') {
      GET_TEMPLATE().then((result) => {
        if (result.err) return
        const resData = result.data
        this.tmplist = resData.list
        if (show === 'yes') this.showCreate = true
        else this.showCreate = false
      })
    },
    // 获取屏幕信息
    getScreenInfo (screenObj) {
      GET_CREATE_SCREEN_INFO(screenObj).then(res => {
        if (res.err) return
        this.$router.replace({
          name: 'screenediting',
          path: '/screenediting',
          params: {
            type: 'screen',
            id: Utils.enBase64(res.data.screenId)
          }
        })
      })
    },
    // 选择分类 创建大屏
    addScreen () {
      if (!this.screenName.trim()) {
        return this.$toasting({
          type: 'warning',
          title: '警告',
          message: '大屏名称不能全为空字符'
        })
      }
      let screenObj = {
        name: this.screenName,
        sid: this.cateSelected,
        tmpid: this.selectedTmp ? this.selectedTmp.id : -1
      }
      if (!this.selectedTmp) {
        screenObj.screenOption = Object.assign({}, Lodash.cloneDeep(this.screenOption), this.actualSize)
      }
      this.getScreenInfo(screenObj)
    }
  }
}
</script>

<style lang="less" scoped>
  .flex-center (@fa) {
    display: flex;
    justify-content: @fa;
    align-items: center;
  }
  .input-items {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .create-screen {
    display: flex;
    flex-direction: column;
    background:linear-gradient(90deg,#071937 0%,#304C6E 100%);
    /deep/ .popup-content-box {
      height: 300px;
      min-height: 300px;
    }
    /deep/ .kwc-control.el-select {
      width: 100%!important;
      .el-input {
        background: #003567;
        border: 1px solid rgba(0, 71, 157, 0.7);
        input {
          text-indent: 12px;
          color: rgba(255,255,255,.8);
          font-size:14px;
        }
      }
    }
  }
  .actualSize {
    z-index: 9;
    width: 170px;
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
    line-height: 22px;
    position: absolute;
    left: 50%;
    top: 50%;
    text-align: center;
    transform: translate(-50%, calc(-50% + 60px));
  }
  .header {
    height: 50px;
    width: 100%;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    .head-left {
      position: relative;
      width: 360px;
      height: 50px;
      display: flex;
      align-items: center;
      background-image: url(~@assets/img/line-create.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 0 10px;
      .back {
        position: absolute;
        left: 86px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        height: 25px;
        line-height: 25px;
        font-size: 14px;
        color: #ffffff;
        font-weight: 300;
      }
      &::after {
        display: block;
        content: "";
        width: 100vw;
        height: 0px;
        position: absolute;
        right: 0;
        top: 16px;
        box-shadow: 0 0 5px rgba(24, 144, 255, .4);
        border-top:1px solid rgba(24, 144, 255, 1);
        transform: translateX(100vw);
      }
    }
  }
  .content {
    display: flex;
    flex: 1;
    position: relative;
    width: 100%;
    .tmp-list {
      width: 360px;
      height: 100%;
      overflow: auto;
      .tmp {
        position: relative;
        width: 360px;
        height: 119px;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding-left:30px;
        &.active {
          padding-left:40px; 
          transition: padding .3s;
          background: url(~@assets/img/tmp-item-bg.png) 0 0 no-repeat;
          background-size: 100% 100% 
        }
      }
      .thumbnail {
        position: relative;
        width:176px;
        height:99px;
        border:1px solid rgba(24, 144, 255, 0.5);
        margin-right: 10px;
        &.empty {
          background:linear-gradient(-90deg,rgba(24,144,255,0.23) 0%,rgba(24,144,255,0.03) 100%);
        }
        &.img {
          height: 100%;
          width: 100%;
          object-fit: contain;
        }
      }
      .tmp-info {
        flex: 1;
        .item {
          width: 100%;
          padding-right: 7px;
          color:rgba(255,255,255,.6);
          line-height: 25px;
          font-size: 14px;
          font-weight: 400;
        }
        .name {
          color:rgba(255,255,255,1);
        }
      }
    }
    .tmp-prev {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      .select-tmp-name {
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 16px;
        color: #ffffff;
      }
      .screen-tmp-img {
        height: 70%;
        width: 0;
        max-width: 100%;
        background:rgba(0,36,70,1);
        box-shadow: 0 0 5px rgba(24, 144, 255, .4);
        border:1px solid rgba(24, 144, 255, 1);
        position: relative;
        &.empty-tmp .screen-tmp-mask,
        &.empty-tmp .creat-button {
          display: block !important;
        }
        &:hover .creat-button,
        &:hover .screen-tmp-mask {
          display: block;
        }
      }
      .screen-tmp-mask {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .2);
      }
      .creat-button {
        display: none;
        z-index: 9;
        width:108px;
        height:32px;
        background:rgba(24,144,255,1);
        font-size:14px;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height: 32px;
        position: absolute;
        left: 50%;
        top: 50%;
        text-align: center;
        cursor: pointer;
        transform: translate(-50%, -50%);
        &::after {
          display: block;
          width:220px;
          line-height: 20px;
          content: "在屏幕上尽情发挥你的想象力吧!";
          position: absolute;
          left: 50%;
          top: 0;
          transform: translate(-50%, 40px);
          font-size:14px;
          font-weight:400;
          color:rgba(255,255,255,.6);
        }
      }
      .screen-tmp-ratio {
        margin-top: 30px;
        display: flex;
        align-items: center;
        height: 30px;
        .tmp-ratio {
          width:80px;
          height:28px;
          border:1px solid rgba(24,144,255,.3);
          font-size:14px;
          font-weight:400;
          color:rgba(255,255,255,1);
          text-align: center;
          line-height: 28px;
          margin-right: 20px;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
          &.active {
            border:1px solid rgba(24,144,255,1);
          }
        }
      }
    }
  }
</style>
