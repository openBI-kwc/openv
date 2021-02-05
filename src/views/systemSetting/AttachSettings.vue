<template lang="pug">
  .attachment-box
    Loading(v-if="loading")
    template(v-else)
    .attachment(v-if="sendData")
      BreadCrumbs
      .main-container
        .attachment-item
          .left 允许上传类型:
          .right
            Selection.edit-bar(v-model="img", :multiple="true", :multipleLimit="8", :width="400", :option="imgTypes")
        .attachment-item
          .left 图片大小:
          .right
            NumInput.number-by-bg(v-model="sendData.width", :min="0", :max="99999", placeholder="例如：500")
            span.delimit px
            NumInput.number-by-bg(v-model="sendData.height", :min="0", :max="99999", placeholder="例如：500")
            span.delimit px
        .attachment-item
          .left 启用水印:
          .right
            SwitchBar(v-model="sendData.is_water")
        template(v-if="sendData.is_water")
          .attachment-item
            .left 水印不透明度(%):
            .right
              NumInput.number-by-bg(v-model="sendData.transparency", :min="0", :max="100" placeholder="例如：80", )
          .attachment-item
            .left 水印位置:
            .right
              Selection.select-by-bg(v-model="sendData.position", :option="pos")
          .attachment-item.img-attachment
            .left 上传水印:
            .right
              ImageUpload(:imgUrl="setting.server + sendData.waterpath", @onChange="uploadFile($event)", accept="image/*")
        .attachment-item
          .left
          .right
            .confirm-button(@click="confirm") 确定
</template>

<script>
import { Utils, Lodash } from '@public/utils'
import {
  GET_ATTACHMENT,
  UPDATE_ATTACHMENT
} from '@api/system.js'
import { UPLOAD_SY } from '@api/upload.js'
import { mapState } from 'vuex'
const { formParams } = Utils
export default {
  data () {
    return {
      pos: [
        {
          name: '左上',
          value: 'LeftTop'
        },
        {
          name: '靠上',
          value: 'Top'
        },
        {
          name: '右上',
          value: 'RightTop'
        },
        {
          name: '靠左',
          value: 'Left'
        },
        {
          name: '中间',
          value: 'Center'
        },
        {
          name: '靠右',
          value: 'Right'
        },
        {
          name: '左下',
          value: 'LeftBottom'
        },
        {
          name: '靠下',
          value: 'Bottom'
        },
        {
          name: '右下',
          value: 'RightBottom'
        }],
      imgTypes: [
        {
          name: 'JPG',
          value: 'JPG'
        },
        {
          name: 'PNG',
          value: 'PNG'
        },
        {
          name: 'JPEG',
          value: 'JPEG'
        },
        {
          name: 'SVG',
          value: 'SVG'
        },
        {
          name: 'BMP',
          value: 'BMP'
        },
        {
          name: 'GIF',
          value: 'GIF'
        }],
      navList: [
        {
          text: '系统管理'
        },
        {
          text: '附件设置'
        }],
      sendData: {},
      publishPicked: 'publish',
      loading: true,
      img: []
    }
  },
  created () {
    this.getAttach()
  },
  computed: {
    ...mapState(['setting'])
  },
  methods: {
    getAttach () {
      GET_ATTACHMENT().then((value) => {
        if (!value.err) {
          this.loading = false
          this.img = value.data.type.split(',')
          this.sendData = value.data
        }
      })
    },
    check (sendData) {
      let map = {
        type: '允许上传类型不能为空',
        width: '允许上传宽度不能为空',
        height: '允许上传高度不能为空',
        transparency: '水印透明度不能为空'
      }
      let pass = true
      for (const key in map) {
        if (!sendData[key]) {
          this.$toasting({
            type: 'warning',
            message: map[key]
          })
          pass = false
          break
        }
      }
      return pass
    },
    confirm () {
      let sendData = Lodash.cloneDeep(this.sendData)
      if (!this.check(sendData)) return
      // eslint-disable-next-line
      let { is_water } = sendData
      sendData.type = this.img.join(',')
      // eslint-disable-next-line
      sendData.is_water = is_water ? (is_water = 1) : (is_water = 2)
      UPDATE_ATTACHMENT(sendData).then((value) => {
        if (!value.err) {
          this.$toasting({
            type: 'success',
            message: '更新成功'
          })
        }
      })
    },
    // 上传水印
    uploadFile (e) {
      let params = formParams(e, 'image')
      // 发送请求
      UPLOAD_SY(params).then((response) => {
        if (response.err) return
        this.sendData.waterpath = response.data
      })
      e.target.value = ''
    },
    editType (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="less" scoped>
  .attachment-box, .attachment  {
    height: 100%;
  }
  .attachment-item {
    display: flex;
    align-items: center;
    margin: 15px 0;
    .select-by-bg {
      margin-bottom: 0;
    }
    &.img-attachment {
      align-items: flex-start;
    }
    .left {
      width: 100px;
      font-size: 12px;
      color: #ffffff;
      text-align: right;
    }
    /deep/ .right {
      margin-left: 20px;
      display: flex;
      align-items: center;
      min-width: 170px;
      .delimit {
        margin: 0 10px;
        font-size: 12px;
        color: #ffffff;
      }
      .el-switch {
        .el-switch__core {
          background: #31363F;
        }
      } 
      .el-switch.is-checked {
        .el-switch__core {
          background: #409EFF;
        }
      }
    }
    &.img-attachment .right {
      margin: auto 20px;
      display: flex;
    }
    .upload-box {
      width: 170px;
      height: 170px;
    }
  }
  .upload-button {
    color: #ffffff;
    width: 76px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    margin: 0 15px;
    cursor: pointer;
    position: relative;
    background:rgba(24,145,255,0.5);
    border:1px solid rgba(0, 174, 255, 1);
    border-radius: 2px;
    color:rgba(255,255,255,0.8);
    input {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      opacity: 0;
    }
  }
  .confirm-button {
    width:80px;
    height:30px;
    background:rgba(24,145,255,0.5);
    border:1px solid rgba(0, 174, 255, 1);
    line-height: 30px;
    text-align: center;
    user-select: none;
    cursor: pointer;
    font-size:14px;
    color:rgba(255,255,255,0.8);
  }
</style>
