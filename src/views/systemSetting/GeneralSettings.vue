<template lang="pug">
  .general-box(v-if="sysInfo")
    BreadCrumbs
    .main-container
      .general-item
        .left 系统名称:
        .right
          input.input-control.sysname(v-model="sysInfo.sysname", placeholder="例如：开维创数据可视化系统")
      .general-item
        .left 发布应用:
        .right
          SwitchBar(v-model="sysInfo.publish", :activeValue="1" :inactiveValue="0")
      .general-item.logo-item
        .left 上传LOGO:
        .right
          ImageUpload.logo-img(:imgUrl="sysInfo.logopath", @onChange="uploadImg", accept="image/jpeg,image/png,image/bmp")
      .general-item
        .left
        .right
          .confirm-button(@click="confirmUpdate") 确定
</template>

<script>
import { mapState } from 'vuex'
import { Utils, Lodash, Storage } from '@public/utils'
import {
  GET_GENERAL,
  SET_GENERAL
} from '@api/system.js'
import { UPLOAD_SY } from '@api/upload.js'
const { formParams, enBase64 } = Utils
export default {
  computed: {
    ...mapState(['setting', 'system'])
  },
  data () {
    return {
      sysInfo: null
    }
  },
  created () {
    this.getGeneral()
  },
  methods: {
    // 获取设置
    getGeneral () {
      let has = !Lodash.isEmpty(this.system)
      if (has) {
        this.sysInfo = Lodash.cloneDeep(this.system)
        return
      }
      GET_GENERAL().then((value) => {
        if (!value.err) {
          this.sysInfo = value.data
        }
      })
    },
    // 确认修改
    confirmUpdate () {
      const params = Lodash.cloneDeep(this.sysInfo)
      let msg = {
        sysname: params['sysname'],
        logopath: params['logopath']
      }
      for (const key in msg) {
        if (!msg[key]) {
          return this.$toasting({
            title: '警告',
            type: 'error',
            message: '存在未填项'
          })
        }
      }
      this.upodateConf(params)
    },
    // 修改配置
    upodateConf (params) {
      SET_GENERAL(params).then((value) => {
        if (value.err) return
        this.$store.dispatch('SET_SYSTEM_INFO', params)
        Storage.set('System-Setting', enBase64(JSON.stringify(params)))
        document.title = params.sysname
        this.$toasting({
          title: '提示',
          type: 'success',
          message: '修改成功'
        })
      })
    },
    // 上传图片
    uploadImg (e) {
      let params = formParams(e, 'image')
      // 上传Logo
      UPLOAD_SY(params).then((response) => {
        if (!response.err) {
          this.sysInfo.logopath = this.setting.server + response.data
          this.$toasting({
            title: '提示',
            type: 'success',
            message: '上传成功'
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .general-box {
    width: 100%;
    height: 100%;
  }
  .sysname {
    width: 300px;
    margin-bottom: 0;
  }
  .general-item {
    display: flex;
    align-items: flex-start;
    margin: 15px 0;
    .left {
      width: 100px;
      font-size: 12px;
      line-height: 32px;
      color: rgba(255,255,255,.8);
      text-align: right;
      justify-content: center;
    }
    /deep/ .right {
      margin-left: 20px;
      display: flex;
      align-items: center;
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
    &.logo-item .right {
      display: flex;
      align-items: flex-start;
      /deep/.upload-box {
        width: 300px;
        height: 50px;
      }
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
