<template lang="pug">
  .main-content-wp
    .content-header
      .corporate-logo
        img(:src="system.logopath")
      .menu-items-tabs(v-if="menuData.length > 0")
        .items-tab(v-for="(menu, index) in menuData" :key="menu.column" :class="{'active': currentMenuItem === menu}")
          .item(@click="selectChildMenu(menu)")
            .icon(v-html="menu.icon")
            .text {{menu.column}}
      .user-menu-box(v-if="showUserBox")
        .user-info
          router-link(:to="{'name': 'basicinfo'}")
            img.user-img(v-if="user.avatar", :src="user.avatar" v-imgerror="'img notfound'")
            img.user-img(v-else, src="~@assets/img/pavatar.png")
          .user-name {{user.realname}}
          .icon.drop(@click="edituser") &#xe672;
        .mask(v-if="uedit", @click.self="edituser")
        .drop-menu-wp(v-show="uedit")
          .item(@click.self="editpwd") 修改密码
          .item(@click="logout") 退出
      .linght-line
        .line-point
    .content-center
      //- 左侧二级菜单栏
      .system-menu-wp
        template(v-if="currentMenuItem.children")
          router-link.child-item(v-for="(child, index) in currentMenuItem.children" :to="{path: child.name}" :key="child.name") {{child.text}}
      //- 右侧展示区域 不能去掉这层Div不然会造成动画效果时闪动
      #view-content(v-if="showView")
        keep-alive
          router-view.center(v-if="$route.meta.keepAlive")
        router-view.center(v-if="!$route.meta.keepAlive")
</template>

<script>
import { Utils, Cookies, Lodash, Storage } from '@public/utils'
import { mapState } from 'vuex'
import { GET_MENU } from '@api/account.js'
import { LOGOUT, GET_USER_MSG } from '@api/userrelated.js'
export default {
  data () {
    return {
      // 在编辑用户？
      uedit: false,
      // 显示中间区域内容？
      showView: false,
      showUserBox: false,
      // 菜单数据
      menuData: [],
      // 当前路由
      currentRoute: '',
      // 当前选择的菜单项
      currentMenuItem: {},
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
  created() {
    this.currentRoute = this.$route.name
    let token = Cookies.get('Access-Token')
    if (!token) return this.$router.replace('/login')
    // 请求菜单
    this.requestMenu()
    this.getUserInfo()
  },
  computed: {
    ...mapState(['system', 'user', 'sysmenu', 'setting'])
  },
  watch: {
    '$route.name' (to, from) {
      if (!to) return
      this.currentRoute = this.$route.name
      if (this.menuData.length > 0) this.expandMenu()
    }
  },
  methods: {
    selectChildMenu (menu) {
      this.currentMenuItem = menu
      this.currentRoute = menu.children[0].name
      this.$router.push({ path: this.currentRoute })
    },
    // 展开菜单
    expandMenu () {
      for (let index = 0; index < this.menuData.length; index++) {
        const menu = this.menuData[index]
        const subItems = menu.children
        if (!subItems) continue
        for (let sindex = 0; sindex < subItems.length; sindex++) {
          const sitem = subItems[sindex]
          if (this.currentRoute !== sitem.name) continue
          this.currentMenuItem = menu
          return
        }
      }
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
      // 缓存到cookies
      Storage.set('Auth-List', Utils.enBase64(JSON.stringify(permissionRouting)))
    },
    // 请求菜单
    requestMenu () {
      // 存在菜单在vuex中
      if (this.sysmenu.length > 0) {
        this.menuData = Lodash.cloneDeep(this.sysmenu)
        this.showView = true
        this.expandMenu()
      } else {
        GET_MENU().then(res => {
          if (res.err) return
          this.menuData = this.formatMenu(res.data).menu
          this.$store.dispatch('SET_SYS_MENU', Lodash.cloneDeep(this.menuData))
          this.setAuthList(this.formatMenu(res.data || []).auth)
          this.showView = true
          this.expandMenu()
        })
      }
    },
    // 修改用户
    edituser () {
      this.uedit = !this.uedit
    },
    // 修改密码
    editpwd () {
      this.edituser()
      this.$router.push({name: 'editpassword'})
    },
    // 退出
    logout () {
      this.uedit = false
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
    },
    // 获取用户数据
    getUserInfo () {
      let f = !Lodash.isEmpty(this.user)
      if (f) {
        this.showUserBox = true
        return
      }
      GET_USER_MSG().then(res => {
        if (res.err) return
        this.$store.dispatch('SET_USER_INFO', res.data)
        this.showUserBox = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .main-content-wp {
    display: flex;
    flex-direction: column;
  }
  .content-header {
    position: relative;
    width: 100%;
    height: 76px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .linght-line {
      position: absolute;
      top: 76px;
      left: 0;
      width: 100%;
      transform: translate(-549px, calc(-50% - 18px));
      animation: flowinglight 6s linear infinite;
      .line-point {
        width: 549px;
        height: 40px;
        transition: all 0.6s;
        background: url(~@assets/img/light.png) 0 0 / cover no-repeat;
      }
      @keyframes flowinglight {
        from { 
          transform: translate(-549px, calc(-50% - 18px));
        }
        to {
          transform: translate(100%, calc(-50% - 18px));
        }
      }
    }
    .corporate-logo {
      width: 240px;
      height: 76px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 160px;
        object-fit: contain;
      }
    }
    .menu-items-tabs {
      z-index: 9;
      flex: 1;
      display: flex;
      align-items: center;
      height: 76px;
      padding-left: 173px;
      .items-tab {
        width: 160px;
        height: 76px;
        display: flex;
        align-items: center;
        background: url(~@assets/img/menubg.png) 0 0 / cover no-repeat ;
        &.active {
          background: url(~@assets/img/menubg-active.png) 0 0 / cover no-repeat ;
        }
        .item {
          width: 160px;
          height: 40px;
          display: flex;
          align-items: center;
          padding-left: 25px;
          font-weight:300;
          color: #ffffff;
          font-size: 16px;
          cursor: pointer;
          .text {
            margin-left: 10px;
          }
        }
      }
    }
    .user-menu-box {
      position: relative;
      z-index: 9;
      display: flex;
      align-items: center;
      height: 26px;
      line-height: 26px;
      margin-right: 30px;
      .mask {
        z-index: 9;
        opacity: 0;
      }
      .user-info {
        width: 100%;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .user-img {
          width: 26px;
          height: 26px;
          text-align: center;
          object-fit: cover;
          border-radius: 50%;
        }
        .user-name {
          font-size:16px;
          color:rgba(255,255,255,1);  
          margin: 0 10px;
        }
        .drop {
          width: 15px;
          height: 15px;
          line-height: 15px;
          color: rgba(33,154,242,1);
          cursor: pointer;
          font-size: 15px;
        }
      }
      .drop-menu-wp {
        position: absolute;
        width: 150px;
        height: fit-content;
        border: 1px solid #1890FF;
        background: #002141;
        right: 6px;
        top: 30px;
        z-index: 10;
        &::before {
          display: block;
          content: '';
          position: absolute;
          right: -1px;
          top: -20px;
          border-top: 10px solid rgba(0,0,0,0);
          border-left: 10px solid rgba(0,0,0,0);
          border-right: 0px solid rgba(0,0,0,0);
          border-bottom: 10px solid #1890FF;
        }
        .item {
          position: relative;
          height: 30px;
          line-height: 30px;
          text-indent: 18px;
          font-size: 12px;
          color: #ffffff;
          cursor: pointer;
          &:hover {
            color: #fff;
            background: #156dbe;
          }
        }
      }
    }
  }
  .content-center {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: calc(100% - 76px);
    flex: 1;
  }
  .system-menu-wp {
    width: 240px;
    height: 100%;
    background:rgba(24, 144, 255, .03);
    display: flex;
    flex-direction: column;
    border-right:1px solid rgba(24,144,255,.2);
    z-index: 9;
    .child-item {
      display: block;
      text-indent: 98px;
      height:40px;
      line-height: 40px;
      font-size:14px;
      position: relative;
      cursor: pointer;
      font-weight:400;
      color:rgba(255,255,255,.9);
    }
    .router-link-exact-active, .router-link-active{
      background:linear-gradient(90deg,rgba(24,144,255,1) 0%,rgba(24,144,255,0) 100%);
      &::after{
        display: block;
        content: "";
        position: absolute;
        height: 40px;
        width: 7px;
        right: -7px;
        top: 0;
        background: url(~@assets/img/navarrow.png) 0 0 / cover no-repeat ;
      }
    }
  }
</style>
