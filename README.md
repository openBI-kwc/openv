
# 数据可视化系统


# 摘要

云组件主要通过**组件化**的规范来使用，在开发时需要用到`es6 class`,并绑定在window全局对象上面，易于初始化使用

示例代码

```js
class BarChart {
  constructor (option = {el: String , params: Object || Array, dataset: Object || Array }) {
    this.option = option
  }
  // 实例化
  init ()
  // 更新
  update () {}
  //销毁
  destroy () {}
}

window.BarChart = BarChart
    
  
```

使用时

```js 
// 创建实例

this.chart = new Window[moduleMethodName]({ el: '#' + this.colundID, params: moduleParam.calcRow, dataset: useDate })
// 初始化
this.chart.init()
// 更新
this.chart.update({ el: '#' + this.colundID, params: moduleParam.calcRow, dataset: useDate })
// 销毁
this.chart.destroy()
```



# 说明

## init 

初始化函数：在实例创建完成的时候，进行初始化

参数：

- el   渲染的元素的Id选择器

- params 控制页面视图的属性集合 Object 或者 Array

- dataset 组件的数据集合 Object 或者 Array

## update

​	更新组件： 当组件需要跟新数据和视图的时候使用

​	参数： 同**init**

## destroy

​	销毁组件

​    参数： 不需要

# 配置文件

```js

{
  // 系统设置
  "system": {
    // 平台名称设置
    "sysname": "数维可视化平台",       
    // 是否可用发布功能
    "publish": 1,
    // 平台LOGO
    "logopath": "./static/assets/img/logo.png"
  },
  // 系统数据配置
  "setting": {
    // 系统数据接口地址  ${server} + '/getUserInfo'
    "server": "http://v2.kwcdev.cn",
    // 大屏实时数据配置
    "realData" : {
      // 实时数据启用方式 websocket http
      "type": "websocket",
      // 实数数据地址
      "url": "ws://192.168.30.189:9090"
    },
    // 三维场景实时数据地址
    "thrdUrl": "ws://192.168.30.189:9508",
    // 是否可以使用本地部署下载功能
    "localDeploy": false,
    // 发布大屏时的一级目录 默认 openv 应与前端包目录同名
    "shareDir": "openv"
  }
}

```

## 作者

- [yangyfeng](https://github.com/yangyfeng)
- [likego555](https://github.com/likego555)
- [lius0815](https://github.com/lius0815)
- [qq252208535](https://github.com/qq252208535)

# License

遵循nc开源协议发布，并提供个人免费使用。