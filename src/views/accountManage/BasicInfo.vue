<template lang="pug">
  .baseinfo-box.box(v-if="userInfo")
    //- 基本信息修改
    .avatarModal(v-show="showAvatar")
      Modal.edit-avatar-box(:show="true", @close="closeAlert", :showFooter="false" text="修改头像")
        .avatar-content
          .avatar-img-box
            img#avatarimg(:src="preAvater")
          .preview-box-parcel
            .text 头像预览：
            #preview-img
        .avatar-footer(slot="footer")
          .left
            .av-btn.reset(@click="cropperReset") 复位
            .av-btn.rotate(@click="cropperRotate") 旋转
            .av-btn.turn(@click="cropperTurn") 转向
          .av-btn.confrim(@click="updateAvater") 确认
    BreadCrumbs
    .main-container
      .baseinfo
        .info-desc
          .avatar-box
            ImageUpload.avatar(ref="ImageUpload" :imgUrl="preAvater", @onChange="selectFile", accept="image/jpeg,image/png,image/bmp")
            span.edit-avatar(@click="editAvatar") 修改头像
          .infos
            .item 登录账号：{{userInfo.realname}}
            .item 邮箱：{{userInfo.email}}
            .item 注册时间：{{userInfo.createtime | dateFormat}}
        .info-edit
          .title 基本信息
          .edit-from
            .item-input
              .name 地址:
              input.input(placeholder="请输入地址", v-model="userInfo.address", @focus="errInfo.address = ''")
              .err-msg(v-if="errInfo.address") {{errInfo.address}}
            .item-input
              .name 联系电话:
              input.input(placeholder="请输入联系电话", v-model="userInfo.phone", @focus="errInfo.phone = ''")
              .err-msg(v-if="errInfo.phone") {{errInfo.phone}}
            .item-input
              .name 邮箱:
              input.input(placeholder="请输入邮箱", v-model="userInfo.email", @focus="errInfo.email = ''")
              .err-msg(v-if="errInfo.email") {{errInfo.email}}
            .save(@click="editInfos") 保存
</template>

<script>
import { SAVA_USERINFO } from '@api/account.js'
import { GET_USER_MSG } from '@api/userrelated.js'
import { UPDATE_MSG } from '@api/upload.js' 
import { mapState } from 'vuex'
import validator from '@public/validator.js'
import { Utils, Lodash } from '@public/utils'
import Cropper from 'cropperjs'
const { formParams, convertBase64ToBlob } = Utils
const $ = window.$
export default {
  data () {
    return {
      userInfo: null,
      showMask: false,
      showAvatar: false,
      errInfo: {
        address: '',
        phone: '',
        email: ''
      },
      // 图片的文件对象事件
      avatarBlob: null,
      // 头像预览
      preAvater: null,
      croppable: false,
      cropper: null,
      flagX: true
    }
  },
  created () {
    this.getUserInfo()
  },
  filters: {
    dateFormat (value) {
      if (!value) return ''
      return Utils.timeFormat(value, 'Y-m-d')
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      setting: state => state.setting
    })
  },
  methods: {
    cropperReset () {
      this.cropper.reset()
    },
    cropperRotate () {
      this.cropper.rotate(45)
    },
    cropperTurn () {
      this.cropper.scale(1, this.flagX ? -1 : 1)
      this.flagX = !this.flagX
    },
    editAvatar () {
      this.$refs['ImageUpload'].selectFile()
    },
    getObjectURL (file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    selectFile (e) {
      this.picValue = e.target.files[0] || e.dataTransfer.files[0]
      if (!this.picValue) return
      this.openAlert()
      // 初始化这个裁剪框
      let image = document.getElementById('avatarimg')
      let minAspectRatio = 0.5
      let maxAspectRatio = 1.5
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        // 默认比例
        preview: '#preview-img',
        // 预览视图
        guides: true,
        // 裁剪框的虚线(九宫格)
        autoCropArea: 1,
        // 0-1之间的数值，定义自动剪裁区域的大小，默认0.8
        // 是否允许移动图片
        dragCrop: true,
        // 是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
        movable: true,
        // 是否允许移动剪裁框
        resizable: true,
        // 是否允许改变裁剪框的大小
        zoomable: true,
        // 是否允许缩放图片大小
        mouseWheelZoom: true,
        // 是否允许通过鼠标滚轮来缩放图片
        touchDragZoom: true,
        // 是否允许通过触摸移动来缩放图片
        rotatable: true,
        // 是否允许旋转图片   
        viewMode: 1,
        ready: () => {
          this.croppable = true
          let cropper = this.cropper
          let containerData = cropper.getContainerData()
          let cropBoxData = cropper.getCropBoxData()
          let aspectRatio = cropBoxData.width / cropBoxData.height
          let newCropBoxWidth = null
          if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
            newCropBoxWidth = cropBoxData.height * ((minAspectRatio + maxAspectRatio) / 2)
            cropper.setCropBoxData({
              left: (containerData.width - newCropBoxWidth) / 2,
              width: newCropBoxWidth
            })
          }
        },
        cropmove: () => {
          let cropper = this.cropper
          let cropBoxData = cropper.getCropBoxData()
          let aspectRatio = cropBoxData.width / cropBoxData.height
          if (aspectRatio < minAspectRatio) {
            cropper.setCropBoxData({
              width: cropBoxData.height * minAspectRatio
            })
          } else if (aspectRatio > maxAspectRatio) {
            cropper.setCropBoxData({
              width: cropBoxData.height * maxAspectRatio
            })
          }
        }
      })
      // 每次替换图片要重新得到新的url
      if (this.cropper) this.cropper.replace(this.getObjectURL(this.picValue))
    },
    updateAvater () {
      if (!this.croppable) return
      // Crop
      let croppedCanvas = this.cropper.getCroppedCanvas()
      // Round
      let roundedCanvas = this.getRoundedCanvas(croppedCanvas)
      this.preAvater = roundedCanvas.toDataURL()
      // console.log(this.preAvater)
      this.avatarBlob = convertBase64ToBlob(this.preAvater)
      this.postImg()
    },
    getRoundedCanvas (sourceCanvas) {
      let canvas = document.createElement('canvas')
      let context = canvas.getContext('2d')
      let width = sourceCanvas.width
      let height = sourceCanvas.height
      canvas.width = width
      canvas.height = height
      context.imageSmoothingEnabled = true
      context.drawImage(sourceCanvas, 0, 0, width, height)
      context.globalCompositeOperation = 'destination-in'
      context.beginPath()
      context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true)
      context.fill()
      return canvas
    },
    // 检查
    checkInput () {
      let pass = true
      for (let key in this.userInfo) {
        let item = this.userInfo[key]
        switch (key) {
          case 'address':
            if (item === '') {
              this.errInfo.address = '地址不能为空'
              pass = false
            }
            break
          case 'email':
            if (item === '') {
              this.errInfo.email = '邮箱不能为空'
              pass = false
            } else if (!validator.isEmail(item)) {
              this.errInfo.email = '邮箱格式不正确'
              pass = false
            }
            break
          case 'phone':
            if (item === '') {
              this.errInfo.phone = '联系电话不能为空'
              pass = false
            } else if (!validator.isPhone(item)) {
              this.errInfo.phone = '联系电话格式不正确'
              pass = false
            }
            break
        }
      }
      return pass
    },
    editInfos () {
      if (!this.checkInput()) return
      let params = Object.assign({}, this.userInfo, {type: 1})
      SAVA_USERINFO(params).then(res => {
        if (!res.err) {
          this.$store.dispatch('SET_USER_INFO', this.userInfo)
          this.$toasting({
            type: 'success',
            message: '修改成功'
          })
        }
      })
    },
    postImg () {
      if (!this.avatarBlob) {
        return this.$toasting({
          message: '请选择图片再上传'
        })
      }
      let formdata = new FormData()
      formdata.append('type', 1)
      formdata.append('userImg', this.avatarBlob)
      UPDATE_MSG(formdata).then((res) => {
        if (!res.err) {
          this.userInfo.avatar = this.setting.server + res.data
          this.closeAlert()
          this.$toasting({
            type: 'success',
            message: '修改成功'
          })
        }
      })
    },
    openAlert () {
      this.showMask = true
      this.showAvatar = true
      this.preAvater = this.userInfo.avatar
      $('.cropper-container').eq(0).remove()
      $('#avatarimg').removeClass('cropper-hidden')
    },
    closeAlert () {
      this.flagX = true
      this.croppable = false
      this.showMask = false
      this.showAvatar = false
      this.avatarBlob = null
      this.preAvater = this.userInfo.avatar
      this.cropper.destroy()
      this.cropper = null
    },
    getUserInfo () {
      let use = !Lodash.isEmpty(this.user)
      if (use) {
        this.userInfo = Lodash.cloneDeep(this.user)
        this.preAvater = this.userInfo.avatar
        return
      }
      GET_USER_MSG().then(res => {
        if (!res.err) {
          this.userInfo = res.data
          this.preAvater = this.userInfo.avatar
          this.$store.dispatch('SET_USER_INFO', res.data)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .baseinfo-box /deep/ .popup-content-box {
    width: 60vw;
    height: 60vh;
  }
  .avatar-content {
      height: 100%;
      padding: 10px;
      padding-left: 0;
      display: flex;
      justify-content: space-between;
      .avatar-img-box {
        width: calc(100% - 210px);
      }
      .preview-box-parcel {
        width: 200px;
        margin-left: 10px;
        .text {
          height: 20px;
          line-height: 20px;
          margin-bottom: 10px;
          font-size: 12px;
          color: #ffffff;
        }
        #preview-img {
          width: 200px;
          height: 200px;
          overflow: hidden;
          border: 1px solid #cccccc;
        }
      }
    }
    .avatar-footer {
      height: 32px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        height: 32px;
        display: flex;
        align-items: center;
        .av-btn {
          margin-right: 10px;
        }
      }
      .av-btn {
        width: 80px;
        height: 30px;
        background: rgba(24, 145, 255, 0.5);
        border: 1px solid #00aeff;
        line-height: 30px;
        text-align: center;
        user-select: none;
        cursor: pointer;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  .info-desc {
    margin-top: 20px;
    height: 150px;
    display: flex;
    .avatar-box {
      width: 100px;
      margin-left: 5px;
      margin-right: 20px;
      text-align: center;
      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
        overflow: hidden;
        /deep/ .img {
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .edit-avatar {
        line-height: 20px;
        font-size: 12px;
        color: #219AF2;
        cursor: pointer;
      }
    }
    .infos {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100px;
      .item {
        height: 20px;
        font-size: 12px;
        color: #ffffff;
      }
    }
  }
  .info-edit {
    margin-top: 15px;
    .title {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #ffffff;
    }
    .edit-from {
      margin-left: 5px;
      .item-input {
       display: flex;
       justify-content: flex-start;
       align-items: center;
        height: 30px;
        margin-bottom: 16px;
        .name {
          width: 100px;
          margin-right: 20px;
          font-size: 12px;
          color: #ffffff;
          text-align: right;
        }
        .input {
          width: 330px;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          background:rgba(0,53,103,1);
          border:1px solid rgba(0,71,157,1);
          outline: none;
          color: rgba(255,255,255,.8);
          text-indent: 5px;
        }
        .err-msg {
          margin-left: 10px;
          color: #f00;
          font-size: 12px;
        }
      }
      .save {
        width:80px;
        height:30px;
        background:rgba(24,145,255,0.5);
        border:1px solid rgba(0, 174, 255, 1);
        line-height: 30px;
        text-align: center;
        margin-left: 120px;
        margin-top: 30px;
        user-select: none;
        cursor: pointer;
        font-size:14px;
        color:rgba(255,255,255,0.8);
      }
    }
  }
</style>
