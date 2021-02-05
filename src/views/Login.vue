<template lang="pug">
  #login
    ParticleBackground
    //- 头部
    .login-logo(:style="{'background': `url(${system.logopath}) 0 0 / contain no-repeat`}")
    //- 表单输入框
    .login-form-box
      .login-form-box-bg
      form.login-form-box-content
        .err-msg-box(v-if="errmsg")
          .err-icon.icon &#xe617;
          .err-msg {{errmsg}}
        .text-input
          .icon.user &#xe851;
          input.input(type="text", placeholder="账号", v-model="username", @focus="focusInput" autocomplete="off")
        .text-input
          .icon.pwd &#xe64d;
          input(type="text" style="display:none;")
          input.input(type="password", placeholder="密码", v-model="password" ,@keyup.enter="loginSystem", @focus="focusInput" autocomplete="off")
        .save-pwd
          .check-box
            CheckBox(v-model="notforget")
            .text 记住用户名
          .forget(@click="showForgetmsg = true") 忘记密码?
        .login-button(:class="{'disabled': loading}")
          .fa.fa-spinner.fa-pulse(v-if="loading")
          button.btn(type="button" @click="loginSystem" :disabled="loading") 登录
        .forget-msg(v-show="showForgetmsg") 提示：如果您是超级管理员请联系开维创公司，否则请联系管理员
</template>

<script>
import { LOGIN } from '@api/userrelated.js'
import { Cookies, Utils, Lodash, Storage } from '@public/utils'
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      username: '',
      password: '',
      errmsg: '',
      showForgetmsg: false,
      notforget: false,
      loading: false,
      // 路由菜单的icon
      menuIcons: {
        '我的可视化': '&#xe64f;',
        '数据管理': '&#xe64c;',
        '权限管理': '&#xe652;',
        '系统管理': '&#xe650;',
        '账号管理': '&#xe64e;'
      }
    }
  },
  created () {
    this.notforget = Cookies.getJSON('Not-Forget') || false
    if (this.notforget) this.username = Cookies.getJSON('User-Name')
  },
  computed: {
    ...mapState({
      setting: state => state.setting,
      system: state => state.system
    })
  },
  methods: {
    focusInput () {
      this.errmsg = ''
      this.showForgetmsg = false 
    },
    // 格式化菜单
    formatMenu (accessmenu) {
      // 菜单 权限路由
      let menuList = [], authList = [], {column, menu} = accessmenu
      for (let pItem of column) {
        const {pname, path, pid} = pItem
        let parentMenu = {
          icon: this.menuIcons[pname],
          column: pname
        }
        // 如果path === ''有二级菜单
        if (typeof path === 'string' && !path) parentMenu.children = []
        for (let cItem of menu) {
          if (cItem.parentid !== pid) continue
          let childMenu = {
            name: cItem.path,
            text: cItem.pname
          }
          authList.push(cItem.path)
          if (typeof path === 'string' && !path) {
            parentMenu.children.push(childMenu)
          } else {
            parentMenu.name = cItem.path
          }
        }
        menuList.push(parentMenu)
      }
      return { menu: menuList, auth: authList }
    },
    // 登录
    loginSystem () {
      this.showForgetmsg = false
      let { password, username } = this.$data
      let pwd = Utils.enBase64(password)
      // 用户检测
      if (this.checkUser(username, password)) return
      // 显示loading
      this.loading = true
      let params = {username, password: pwd, len: password.length}
      // 登录请求
      LOGIN(params).then(res => {
        if (res.err) {
          this.loading = false
          // 登录失败错误码判断
          this.errmsg = res.data
          return
        }
        axios.get('http://www.openbi.com.cn/api/updatav/web')
        // 用户token
        let token = res.data.token
        // 权限路由
        let auth = this.formatMenu(res.data.accessmenu || []).auth
        // 设置菜单到vuex
        let menuData = this.formatMenu(res.data.accessmenu || []).menu
        this.$store.dispatch('SET_SYS_MENU', menuData)
        // 设置响应头
        axios.defaults.headers['Access-Token'] = token
        // 保存cookie
        Cookies.set('Not-Forget', this.notforget)
        Cookies.set('Access-Token', token)
        if (this.notforget) Cookies.set('User-Name', this.username)
        // 设置权限路由
        this.setAuthList(auth)
        // 用户路由的第一个为主页路径
        this.getIndexPath(auth)
      }).catch(() => {
        this.loading = false
        // 登录失败错误码判断
        this.errmsg = '登录失败'
      })
    },
    // 设置权限路由表
    setAuthList (auth) {
      if (!auth) return
      // 所有页面的路由权限
      let permissionRouting = Lodash.cloneDeep(auth)
      // 关联路由
      let relatedRoute = {
        'visual': ['screencreate', 'screenediting', 'preview', '3dscene']
      }
      for (let route of auth) {
        if (!relatedRoute[route]) continue
        permissionRouting = permissionRouting.concat(relatedRoute[route])
      }
      // 加入到vuex
      this.$store.dispatch('SET_PERMISSION_ROUTING', permissionRouting)
      // 缓存到Cookies
      Storage.set('Auth-List', Utils.enBase64(JSON.stringify(permissionRouting)))
    },
    // 用户路由的第一个为主页路径
    getIndexPath (auth = []) {
      let indexpath = auth[0]
      if (!indexpath) {
        this.loading = false
        return this.$toasting({
          type: 'warning',
          message: '该用户没有可访问的页面'
        })
      }
      this.$router.replace({
        path: indexpath
      })
    },
    // 账号验证检测，存在错误返回true
    checkUser (username, password) {
      // 空值验证
      if (!username || !password) {
        this.errmsg = '用户名和密码不能为空'
        return true
      }
      // 表单输入是否合法
      if (/['"#$%&\\^@【】 *]/.test(username) || /['"#$%&\\^@【】 *]/.test(password)) {
        this.errmsg = '用户名和密码验证非法,不能包含特殊符号'
        return true
      }
      return false
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
  @keyframes bgplay{
    0% {
      transform:rotate(0deg);
    }
    100% {
      transform:rotate(360deg);
    }
  }
  .err-msg-box {
    left: 50%;
    top: 160px;
    position: absolute;
    transform: translate(-50%,-50%);
    height: 30px;
    display: flex;
    width: 360px;
    line-height: 30px;
    font-size: 12px;
    border: 1px solid rgba(26, 115, 200, .3);
    z-index: 9;
    margin-bottom: 10px;
    color: #F86121;
    align-items: center;
    .err-icon {
      height: 30px;
      font-size: 22px;
      line-height: 30px;
      margin-right: 5px;
    }
  }
  #login {
    background: url("~@assets/img/login-bg.png") 0 0 no-repeat;
    background-size: 100% 100%;
    .login-logo {
      position: absolute;
      left: 50%;
      top: 5vh;
      transform: translateX(-50%);
      width: 450px;
      height: 60px;
      z-index: 9
    }
    .login-form-box {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 600px;
      height: 600px;
      z-index: 3;
      transform: translate(-50%,-50%);
      .login-form-box-bg {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 1;
        background: url(~@assets/img/aperture.png)  0 0 no-repeat;
        background-size: 600px;
        transform:translate3d(0,0,0);
        animation:bgplay 30s linear infinite;
      }
      .login-form-box-content {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 99;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .text-input {
          width:360px;
          height:40px;
          line-height: 62px;
          margin-bottom: 30px;
          border:1px solid rgba(26,115,233,1);
          .flex-center(flex-start);
          &.last-child {
            margin-bottom: 0;
          }
          .icon {
            width: 23px;
            height: 23px;
            padding: 0 13px;
            line-height: 23px;
            text-align: center;
            color: #ffffff;
            font-size: 16px;
            margin-right: 13px;
          }
          .input {
            display: block;
            height:40px;
            line-height: 40px;
            background: rgba(0,0,0,0);
            border: 0;
            flex: 1;
            font-size: 16px;
            color:#ffffff;
            padding-right: 10px;
            &::-webkit-input-placeholder {
              color:rgba(255,255,255,.3);
            }
            &:-moz-placeholder {
              color:rgba(255,255,255,.3);
            }
            &:-ms-input-placeholder {
              color:rgba(255,255,255,.3);
            }
          }
        }
        .login-button {
          position: relative;
          background: url(~@assets/img/login-btn.png) 0 0  no-repeat;
          background-size: 100% 100%;
          &.disabled {
            .btn {
              cursor: not-allowed;
            }
          }
          .fa-spinner {
            position: absolute;
            left: 30px;
            top: 5px;
            line-height: 30px;
            text-align: center;
            font-size: 18px;
            color: #FFFFFF;
            z-index: 9;
            width: 30px;
          }
          .btn {
            cursor: pointer;
            width:360px;
            height:40px;
            line-height: 40px;
            font-size:24px;
            color:rgba(255,255,255,1);
            text-align: center;
            background: rgba(0,0,0,0);
          }
        }
        .forget-msg {
          line-height: 20px;
          color: #ffffff;
          font-size: 12px;
          margin-top: 10px;
        }
        .save-pwd {
          width: 360px;
          height: 20px;
          line-height: 20px;
          font-size:16px;
          color:rgba(255,255,255,.3);
          margin-bottom: 20px;
          .flex-center(space-between);
          .check-box {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .text {
              margin-left: 11px;
            }
          }
          .forget {
            cursor: pointer;
          }
        }
      }
      .box-top {
        height: 80px;
        font-size: 16px;
        color: #219AF2;
        line-height: 80px;
        text-align: center;
        user-select: none;
      }
    }
  }
</style>
