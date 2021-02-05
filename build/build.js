'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora({
  text: '正在编译......'
})
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red(' 编译失败，请重试！ \n'))
      process.exit(1)
    }

    console.log(chalk.cyan(' 编译成功！ \n'))
    console.log(chalk.yellow(
      '  提示：构建的文件应通过HTTP服务器提供。 \n' +
      '  通过"file://"方式打开index.html文件将无法工作。 \n'
    ))
  })
})
