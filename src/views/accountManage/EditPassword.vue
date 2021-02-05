<template lang="pug">
  .edit-pwd-box.box
    BreadCrumbs
    .main-container
      form.inputs-box
        .input-item
          .name 原密码
          input.input(placeholder="输入旧密码", v-model="password")
        .input-item
          .name 新密码
          input.input(placeholder="输入新密码", v-model="newPassword", type="password" autocomplete="off")
        .input-item
          .name 确认新密码
          input.input(placeholder="确认新密码", v-model="rpassword", type="password" autocomplete="off")
        .confrim(@click="editPwd") 确认
</template>
<script>
import { Utils, Cookies } from '@public/utils'
import { UPDATE_PASSWORD } from '@api/account.js'
import { LOGOUT } from '@api/userrelated.js'
export default {
  data () {
    return {
      password: '',
      newPassword: '',
      rpassword: ''
    }
  },
  methods: {
    // 修改密码
    editPwd () {
      if (this.showMsg) return
      if (!this.checkInput()) return
      let pwd = Utils.enBase64(this.password)
      let newpwd = Utils.enBase64(this.newPassword)
      let data = {
        password: pwd,
        len: this.password.length,
        newPassword: newpwd,
        newlen: this.newPassword.length
      }
      UPDATE_PASSWORD(data).then(res => {
        if (!res.err) {
          this.$alert({type: 'success', msg: '密码修改成功'}, () => {
            this.logout()
          })
        } else {
          this.$toasting({
            type: 'warning',
            title: '警告',
            message: res.data
          })
        }
      })
    },
    // 表单验证
    checkInput () {
      let data = {
        password: this.password,
        newPassword: this.newPassword,
        rpassword: this.rpassword
      }
      // 原密码为空
      if (!data.password) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '原密码不能为空'
        })
        return false
      } else {
        if (data.newPassword && data.rpassword) {
          if (data.newPassword !== data.rpassword) {
            this.$toasting({
              type: 'warning',
              title: '警告',
              message: '新密码和确认密码不一致'
            })
            return false
          } else {
            if (data.newPassword === data.password) {
              this.$toasting({
                type: 'warning',
                title: '警告',
                message: '新密码和原密码一样'
              })
              return false
            } else {
              if (/['"#$%&\\^@【】 *]/.test(data.password) || /['"#$%&\\^@【】 *]/.test(data.newPassword)) {
                this.$toasting({
                  type: 'warning',
                  title: '警告',
                  message: '密码验证非法,不能包含特殊符号'
                })
                return false
              } else {
                return true
              }
            }
          }
        } else {
          this.$toasting({
            type: 'warning',
            title: '警告',
            message: '请输入新密码并确认密码'
          })
          return false
        }
      }
    },
    logout () {
      LOGOUT().then(res => {
        if (res.err) return 
        this.$store.dispatch('CLEAR_ALL_INFO')
        Utils.clearAllStorage()
        Object.keys(Cookies.getJSON()).forEach(key => {
          Cookies.remove(key, {
            path: '/',
            expires: -1
          })
        })
        this.$router.replace('/')
      })
    }
  }
}
</script>
<style lang="less" scoped>
  // 垂直两端对齐
  .flex-center (@fa) {
    display: flex;
    justify-content: @fa;
    align-items: center;
  }
  .msg-box {
    display: flex;
    width: 330px;
    height: 30px;
    line-height: 30px;
    background: #FEF6EC;
    font-size: 12px;
    border: 1px solid #FFD9CA;
    margin: 16px 90px 0;
    .icon {
      width: 30px;
      height: 30px;
      font-size: 16px;
      text-align: center;
      line-height: 30px;
    }
    .err-icon {
      color: #F86121;
    }
    .err-msg {
      color: #666666;
    }
  }
  .input-item {
    margin-top: 16px;
    .flex-center(flex-start);
    height: 32px;
    line-height: 32px;
    .name {
      width: 70px;
      font-size: 12px;
      color: #ffffff;
      text-align: right;
      margin-right: 20px;
    }
    input.input {
      width: 330px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      background:rgba(0,53,103,1) !important;
      border:1px solid rgba(0,71,157,1);
      outline: none;
      color: rgba(255,255,255,.8) !important;
      text-indent: 5px;
    }
  }
  .confrim {
    width:80px;
    height:30px;
    background:rgba(24,145,255,0.5);
    border:1px solid rgba(0, 174, 255, 1);
    line-height: 30px;
    text-align: center;
    margin-left: 90px;
    margin-top: 30px;
    user-select: none;
    cursor: pointer;
    font-size:14px;
    color:rgba(255,255,255,0.8);
  }
</style>
