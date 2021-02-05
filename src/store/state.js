export default {
  // 用户的信息
  user: {},
  // 系统的设置配置信息
  setting: {},
  // 系统的常规信息
  system: {},
  // 当前选中的图表索引
  index: null,
  // 选中的图表索引组
  indexList: [],
  // 所有图表的集合
  position: {},
  // 所有图表映射的图层
  layer: [],
  // 系统菜单
  sysmenu: [],
  // 用户可访问的路由页面的列表
  permissionRoutingList: [],
  // 图表更新loading状态
  chartLoading: false,
  // 大屏移动
  screenMoving: false,
  // 大屏的配置
  screenOption: {
    prohibitDrag: false,
    gridColor: '#1B4457',
    gridSize: 20,
    bgtype: 'color',
    animate: false,
    animateTime: 3000,
    background: {
      color: '#0e2a43'
    },
    width: 1920,
    height: 1080,
    scale: 10
  }
}
