import Vue from 'vue';
import Router from 'vue-router';
import { Cookies, Storage, Utils } from '@public/utils';
// 登录页面
import Login from '@views/Login';
// 测试页面
// const DevelopmentTest = () => import('@views/testModule/DevelopmentTest')
// 屏幕轮播
const ScreenCarousel = () => import('@views/ScreenCarousel')
// 本地部署
const LocalDeploy = () => import('@views/LocalDeploy')
// 404页面
const NotFound = () => import('@views/NotFound')
// 右侧显示的容器
const Main = () => import('@views/Main')
// 屏幕查看
const ScreenPreview = () => import('@views/ScreenPreview')
// 屏幕发布
const ScreenShare = () => import('@views/ScreenShare')
// 3d 场景
const ThreeScene = () => import('@views/ThreeScene')
// 屏幕管理---------------------------------
const Visual = () => import('@views/visualManage/Visual')
// 屏幕编辑
const EditScreen = () => import('@views/EditScreen')
// 模板管理
const CarouselScreen = () => import('@views/visualManage/CarouselScreen')
// 我的发布
const ReleaseScreen = () => import('@views/visualManage/ReleaseScreen')
// 创建屏幕
const CreatVisual = () => import('@views/CreatVisual')
// 云组件中心
const CloudComponents = () => import('@views/visualManage/CloudComponents')
// 系统设置----------------------------------
// 常规设置
const GeneralSettings = () => import('@views/systemSetting/GeneralSettings')
// 附件设置
const AttachSettings = () => import('@views/systemSetting/AttachSettings')
// 安全设置
const Security = () => import('@views/systemSetting/Security')
// 数据库备份
const DbBackup = () => import('@views/systemSetting/DbBackup')
// 查看附件
const ImgAttach = () => import('@views/systemSetting/ImgAttach')
// 权限管理---------------------------------------
// 用户管理
const UserManage = () => import('@views/authManage/UserManage')
// 用户组
const UserGroup = () => import('@views/authManage/UserGroup')
// 分组管理
const GroupManage = () => import('@views/authManage/GroupManage')
// 日志列表
const UserLog = () => import('@views/authManage/UserLog')
// 数据操作---------------------------------------
const DataSource = () => import('@views/dataManage/DataSource')
// 数据库链接----------------------------------------
const DbConnect = () => import('@views/dataManage/DbConnect')
// 账号管理----------------------------------------
// 密码修改
const EditPassword = () => import('@views/accountManage/EditPassword')
// 用户基本信息
const BasicInfo = () => import('@views/accountManage/BasicInfo')
Vue.use(Router)
const mode = process.env.NODE_ENV === 'production' ? 'history' : 'hash'
const vueRouter = new Router({
  // mode,
  routes: [
    // 登录
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        keepAlive: false,
        docTitle: 'sysname'
      }
    },
    // 主路由
    {
      path: '/',
      name: 'root',
      redirect: '/login',
      component: Main,
      children: [{
          path: '/visual',
          name: 'visual',
          component: Visual,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/cloudcomponents',
          name: 'cloudcomponents',
          component: CloudComponents,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/carouselscreen',
          name: 'carouselscreen',
          component: CarouselScreen,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/release',
          name: 'release',
          component: ReleaseScreen,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/users',
          name: 'users',
          component: UserManage,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/usergroup',
          name: 'usergroup',
          component: UserGroup,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/classification',
          name: 'classification',
          component: GroupManage,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/logging',
          name: 'logging',
          component: UserLog,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/convent',
          name: 'convent',
          component: GeneralSettings,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/attach',
          name: 'attach',
          component: AttachSettings,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/security',
          name: 'security',
          component: Security,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/dbbackup',
          name: 'dbbackup',
          component: DbBackup,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/imageattach',
          name: 'imageattach',
          component: ImgAttach,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/datasource',
          name: 'datasource',
          component: DataSource,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/dbconnect',
          name: 'dbconnect',
          component: DbConnect,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/editpassword',
          name: 'editpassword',
          component: EditPassword,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        },
        {
          path: '/basicinfo',
          name: 'basicinfo',
          component: BasicInfo,
          meta: {
            keepAlive: true,
            docTitle: 'sysname'
          }
        }
      ]
    },
    // 本地部署列表
    {
      path: '/localdeploy',
      name: 'localdeploy',
      component: LocalDeploy,
      meta: {
        keepAlive: false,
        docTitle: 'sysname'
      }
    },
    {
      path: '/preview/:id',
      name: 'preview',
      component: ScreenPreview,
      meta: {
        keepAlive: false,
        docTitle: 'sysname'
      }
    },
    {
      path: '/share/:id',
      name: 'share',
      component: ScreenShare,
      meta: {
        keepAlive: false,
        docTitle: 'sysname'
      }
    },
    {
      path: '/screenediting/:type/:id',
      name: 'screenediting',
      component: EditScreen,
      meta: {
        keepAlive: false,
        docTitle: 'sysname'
      }
    },
    {
      path: '/screencreate',
      name: 'screencreate',
      component: CreatVisual,
      meta: {
        keepAlive: false,
        docTitle: 'sysname'
      }
    },
    {
      path: '/3dscene/:type/:id?',
      name: '3dscene',
      component: ThreeScene,
      meta: {
        keepAlive: false,
        docTitle: 'sysname'
      }
    },
    {
      path: '/carousel/:crIdent',
      name: 'carousel',
      component: ScreenCarousel,
      meta: {
        keepAlive: false,
        docTitle: 'sysname'
      }
    },
    {
      path: '/notfound',
      name: 'notfound',
      component: NotFound,
      meta: {
        keepAlive: false,
        docTitle: 'notfound'
      }
    },
    // 调试测试页面
    // {
    //   path: '/debugtest',
    //   name: 'debugtest',
    //   component: DevelopmentTest,
    //   meta: {
    //     keepAlive: false,
    //     docTitle: 'notfound'
    //   }
    // },
    {
      path: '*',
      name: 'undefind',
      redirect: '/notfound',
      meta: {
        keepAlive: false,
        docTitle: 'notfound'
      }
    }
  ]
})
const sysSetting = Storage.get('System-Setting')
const documentTitle = {
  sysname: sysSetting ? JSON.parse(Utils.deBase64(sysSetting)).sysname : '北京格胜数维可视化平台',
  notfound: '页面不存在(404)'
}
// 路由导航守卫RBAC权限控制
vueRouter.beforeEach((to, from, next) => {
  document.title = documentTitle[to.meta.docTitle]
  // 过滤掉的路由
  const filteredRoute = ['share', 'carousel', 'notfound', 'debugtest', 'localdeploy']
  // 用户的权限路由列表jsonstring
  const routeAuthJson = Utils.deBase64(Storage.get('Auth-List') || '') || ''
  // 用户的权限路由列表
  const userRouteAuthList = routeAuthJson && Utils.isJsonString(routeAuthJson) ? JSON.parse(routeAuthJson) : []
  // 用户token判断是否登录
  const isLogin = !!Cookies.getJSON('Access-Token')
  // 验证是否为有效的路由地址
  const isValidURL = to.matched.some(item => { return item.regex.test(to.fullPath) })
  // 是否通过认证
  const isVerified = isValidURL && userRouteAuthList.includes(to.name)
  // 是否为过滤的路由
  const isNoCheck = isValidURL && filteredRoute.includes(to.name)
  // 不用效验的路由
  if (isNoCheck) {
    return next()
  } else if (isLogin && userRouteAuthList.length > 0) {
    // 用户已登陆 回到登录页
    if (to.name === 'login') {
      // 跟路由或者404页面路由过去
      if (from.fullPath === '/' || from.name === 'notfound' ) {
        return next(userRouteAuthList[0] || '/login')
      }
      return next(from)
    }
    // 是否已验证
    if (isVerified) {
      return next()
    }
    // 没有权限，路由到404
    return next('notfound')
  } else {
    // 用户没有登陆,路由到登录页，重新登录
    // 解决死循环 login 会进入两次
    if (to.name === 'login') {
      return next()
    } else {
      return next('login')
    }
  }
  // 最后一个，再次路由，确保路由完整
  return next(to)
})
export default vueRouter
