'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
// 打包之后的文件夹名 默认为：dist
const buildName = 'CloudVisualization'
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
let serverURL = ''
try {
  const contentText = fs.readFileSync(path.join(__dirname, '../static/config.json') ,'utf-8')
  serverURL = JSON.parse(contentText).setting.server
} catch (err) {
  console.log(chalk.red(`Unable to get server interface address, project compilation failed \n\n Make sure the /static/config.json file exists`))
  process.exit(1)
  return false
}
function setProxyTable () {
  return serverURL ? {
    '/apis': {
      target: serverURL,
      changeOrigin: true,
      pathRewrite: {
        '^/apis': ''
      }
    }
  } : {}
}
module.exports = {
  serverURL, 
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // https://webpack.docschina.org/configuration/dev-server/#devserver-proxy
      // target: 'https://cdn.wangyaxing.cn', // 接口的域名
      // secure: false, // 如果是https接口，需要配置这个参数
      // changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      // pathRewrite: {'^/img': ''} // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
      // target：要使用url模块解析的url字符串
      // forward：要使用url模块解析的url字符串
      // agent：要传递给http（s）.request的对象（请参阅Node的https代理和http代理对象）
      // ssl：要传递给https.createServer（）的对象
      // ws：true / false，是否代理websockets
      // xfwd：true / false，添加x-forward标头
      // secure：true / false，是否验证SSL Certs
      // toProxy：true / false，传递绝对URL作为路径（对代理代理很有用）
      // prependPath：true / false，默认值：true - 指定是否要将目标的路径添加到代理路径
      // ignorePath：true / false，默认值：false - 指定是否要忽略传入请求的代理路径（注意：如果需要，您必须附加/手动）。
      // localAddress：要为传出连接绑定的本地接口字符串
      // changeOrigin：true / false，默认值：false - 将主机标头的原点更改为目标URL
      ...setProxyTable()
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    // 自动打开浏览器
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: false
  },
  build: {
    // Template for index.html
    index: path.resolve(__dirname, `../${buildName}/index.html`),

    // Paths
    assetsRoot: path.resolve(__dirname, `../${buildName}`),
    assetsSubDirectory: 'static',
    // 未修改前的配置为 '/'
    // 修改打包后的/static 为 ./static
    assetsPublicPath: './',

    /**
     * Source Maps
     */
    // 不生成资源地图 减少打包时间 系统就不会自动生成 map文件
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 默认为false 设置为true 可能会出错
    // 注:安装的时候带上版本号，现在 compression-webpack-plugin 2.0已出
    // 默认该命令安装最新版，最新版本和当前的webpack不匹配，要报错，2.0最新版 
    // npm install --save-dev compression-webpack-plugin@1.1.12
    // 安装完成后
    // npm run build 执行后会发现js文件夹内每个js文件都有一个相对应的gz后缀文件
    // 而且gz文件比相对应的js文件小很多
    // 浏览器如果支持 g-zip 会自动查找有没有gz文件，找到了就直接加载gz文件然后本地解压并执行。
    // 新增的gzip文件会加大打包文件的总大小
    productionGzip: true,
    productionGzipExtensions: ['js', 'css', 'json'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
