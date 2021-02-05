'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        // 解决vue打包后并背景图片路径错误问题
        // 通过img标签引入的图片显示正常，是因为img为html标签
        // 他的路径是由index.html开始访问的，他走static/img/'图片名'是能正确访问到图片的
        // app.css访问static/img/'图片名'是访问错误的
        // 因为在css目录下并没有static目录
        // 所以此时需要先回退两层到根节点处才可以正确获取到图片。 所以设置 ../../就可以啦
        // 使用别名引入背景图 打包后图片地址变成 http://127.0.0.1:9000/static/css/static/img/login-bg.0271ef1.jpeg
        publicPath: '../../',
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
// https://www.jianshu.com/p/9248db0349fb
// 国内免费cdn镜像源，添加cdn根地址
exports.cdnBaseHttp = config.serverURL || 'https://cdn.bootcss.com';
// external配置
// name 模块名称，与package.json同名
// scope 模块作用域命名
// js js地址
// css css地址
// version 版本号
// notPackage 不用安装到本地 node_modules
exports.externalConfig = [{
  name: 'vue',
  scope: 'Vue',
  js: 'vue.min.js'
},
{
  name: 'vue-router',
  scope: 'VueRouter',
  js: 'vue-router.min.js'
},
{
  name: 'axios',
  scope: 'axios',
  js: 'axios.min.js'
},
{
  name: 'element-ui',
  scope: 'ELEMENT',
  js: 'index.js'
},
{
  name: 'vuex',
  scope: 'Vuex',
  js: 'vuex.min.js'
},
// ----------------------不是npm包文件-----------------------
{
  name: 'd3',
  js: 'd3.min.js',
  version: '5.9.2',
  notPackage: true
},
{
  name: 'three.js',
  js: 'three.min.js',
  version: 'r56',
  notPackage: true
},
{
  name: 'jquery',
  js: 'jquery.min.js',
  version: '1.8.1',
  notPackage: true
},
{
  name: 'font-awesome',
  version: '4.7.0',
  css: 'css/font-awesome.min.css',
  notPackage: true
}];
// 获取模块版本号
exports.getModulesVersion = () => {
  let mvs = {};
  let regexp = /^npm_package_.{0,3}dependencies_/gi;
  for (let m in process.env) { // 从node内置参数中读取，也可直接import 项目文件进来
    if (regexp.test(m)) { // 匹配模块
      // 获取到模块版本号
      mvs[m.replace(regexp, '').replace(/_/g, '-')] = process.env[m].replace(/(~|\^)/g, '');
    }
  }
  return mvs;
}
// 导出不需要被打包的cdn模块配置重点
exports.getExternalModules = config => {
  const isproduction = process.env.NODE_ENV === "production"
  let externals = {}; // 结果
  let dependencieModules = this.getModulesVersion(); // 获取全部的模块和版本号
  config = config || JSON.parse(JSON.stringify(this.externalConfig)); // 默认使用utils下的配置
  if (isproduction) {
    config.forEach(item => {
      let version = item.notPackage ? item.version : dependencieModules[item.name];
      // 拼接css 和 js 完整链接
      let cdnURL = this.cdnBaseHttp + '/webCdnPkg'
      item.css = item.css && [cdnURL, item.name, version, item.css].join('/');
      item.js = item.js && [cdnURL, item.name, version, item.js].join('/');
      // 为打包时准备
      if (item.scope) externals[item.name] = item.scope;
    });
  } else {
    config = config.filter(obj => { return obj.notPackage })
    config.forEach(item => {
      // 拼接css 和 js 完整链接
      item.css = item.css && ['https://cdn.bootcss.com', item.name, item.version, item.css].join('/');
      item.js = item.js && ['https://cdn.bootcss.com', item.name, item.version, item.js].join('/');
    })
  }
  return {externals, config};
}
