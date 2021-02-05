<template lang="pug">
  //- 屏幕管理卡片
  .screen-card
    .thumbnails-box
      img.thumbnails(v-lazy="setting.server + item.imgdata")
      .hover-mask
        .card-tool-top(v-if="showtop.length > 0")
          .pwd(v-if="showPwd && showtop.includes('lock') && item.lock") 密码： {{getPwd(item)}}
          TooltipBox(v-if="showtop.includes('lock')" :content="item.lock ? '解锁' : '锁定'" placement="top")
            .fa.topbtn(@click="lock(item)" :class="item.lock ? 'fa-unlock' : 'fa-lock'")
          TooltipBox(v-if="showtop.includes('release')", :content="'发布'" placement="top")
            .icon.topbtn(@click="release(item)") &#xe613;
          TooltipBox(v-if="showtop.includes('preview')", :content="'预览'" placement="top")
            .icon.topbtn(@click="openPreview(item)") &#xe615;
        .edit-button(@click="$emit('onClick', item)")
          .lock.icon(v-if="item.lock") &#xe60d;
          |编辑
        .screen-times(v-if="type === 'screen'")
          .create 创建时间：{{item.createtime}}
          .update 修改时间：{{item.updatetime}}
    .card-tool-bottom
      .text(:style="textstyle" contenteditable="true" @blur="changeName($event, item)" @focus="setcopyName") {{cardObj.name}}
      .tool-bar
        slot
</template>

<script>
import img404 from '@assets/img/datav.png'
import { mapState } from 'vuex'
import Utils from '@public/utils'
import { GET_USER_MSG } from '@api/userrelated.js'
import {
  RENAME_SCRREN,
  RENAME_MATRIX,
  RENAME_TMPLATE
} from '@api/visualrelated.js'
export default {
  props: {
    showtop: {
      type: Array,
      default () {
        return ['release', 'preview', 'lock']
      }
    },
    type: {
      type: String,
      default: 'screen'
    },
    item: Object
  },
  data () {
    return {
      copyName: '',
      img404: img404,
      cardObj: this.item,
      textstyle: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    }
  },
  computed: {
    // Getting Vuex State from store/modules/activities
    ...mapState(['setting', 'user']),
    showPwd () {
      let isown = !!this.item.publishuser
      if (isown || this.user.role === 1) return true
      return false
    }
  },
  methods: {
    setcopyName (e) {
      this.copyName = e.target.innerHTML
      this.textstyle = {}
    },
    enBase64: Utils.enBase64,
    getPwd (item) {
      let itemPossword = item.password
      return Utils.deBase64(itemPossword)
    },
    // 锁定
    lock (item) {
      this.$emit('onLock', item)
    },
    // 发布
    release (item) {
      if (item.publish) {
        this.$toasting({
          type: 'success',
          title: '提示',
          message: '屏幕已发布！'
        })
      } else {
        this.$emit('onShare', item)
      }
    },
    // 预览
    openPreview (item) {
      let hop = {
        name: 'preview',
        path: '/preview'
      }
      if (this.type === 'matrix') {
        hop = {
          name: 'matrixPreview',
          path: '/matrixPreview'
        }
      }
      const { href } = this.$router.resolve({
        ...hop,
        params: {
          id: this.enBase64(item.id)
        }
      })
      Utils.openURL(href, '_blank')
    },
    // 重命名
    changeName (e, item) {
      this.textstyle = {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
      let newNme = e.target.innerHTML
      const params = {
        id: this.cardObj.id, 
        name: newNme
      }
      if (this.copyName === newNme) return
      let API_URL = {
        'screen': RENAME_SCRREN,
        'tmplate': RENAME_TMPLATE,
        'matrix': RENAME_MATRIX,
        'userMsg': GET_USER_MSG
      }
      API_URL[this.type](params).then((responseData) => {
        if (responseData.err) {
          e.target.innerHTML = this.copyName
          this.copyName = ''
          return
        }
        this.cardObj.name = newNme
        this.copyName = ''
        this.$toasting({
          type: 'success',
          title: '提示',
          message: '修改成功'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .screen-card {
    position: relative;
    font-size: 14px;
    transition: all .3s;
    width: 300px;
    height: 200px;
    overflow: hidden;
    margin-right: 20px;
    margin-bottom: 20px;
    color: #410090;
    background: #FFFFFF;
    user-select: none;
    box-shadow: 0 2px 10px 0 rgba(235,235,235,0.50);
    .pwd {
      position: absolute;
      left: 15px;
      top: 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 30px;
    }
    .text {
      width: 70%;
      overflow: hidden;
      word-wrap: break-word;
      color: #666666;
    }
    .topbtn {
      cursor: pointer;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      user-select: none;
      color: #FFFFFF;
    }
    .topbtn:hover, .active {
      color: #219af2;
    }
  }
  .card-tool-top {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: rgba(33, 154, 242, .6);
  }
  .thumbnails-box {
    height: 160px;
    background: #061521;
    overflow: hidden;
    position: relative;
    box-shadow: 0px 0px 1px 0 #C6CBD4;
    .thumbnails {
      object-fit: cover;
      height: 160px;
      width: 100%;
    }
  }
  .hover-mask {
    position: relative;
    transition: all .3s;
    width: 100%;
    height: 100%;
    transform: translateY(-200%);
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    .lock {
      font-size: 15px;
      margin-right: 10px;
      color: #3a51ab;
    }
    .screen-times {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(25px);
      width: 100%;
      font-size: 12px;
      color: #fff;
      text-align: center;
      line-height: 20px;
    }
    .edit-button {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      color: #ffffff;
      text-align: center;
      border-radius: 2px;
      background-color: #219AF2;
      cursor: pointer;
    }
  }
  .card-tool-bottom {
    position: relative;
    height: 40px;
    line-height: 40px;
    display: flex;
    overflow: hidden;
    margin: 0 10px;
    font-size: 14px;
    .tool-bar {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: none;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .screen-card:hover {
    .hover-mask {
      transform: translateY(-100%);
    }
    .tool-bar {
      display: flex;
    }
  }
</style>
