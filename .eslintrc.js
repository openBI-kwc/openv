// http://eslint.org/docs/user-guide/configuring
module.exports = {
  //此项是用来告诉eslint找当前配置文件不能往父级查找
  root: true,
  //此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  parserOptions: {
    sourceType: 'module',
    //此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
    parser: 'babel-eslint'
  },
  //此项指定环境的全局变量
  env: {
    browser: true,
    es6: true
  },
  // 此项是用来配置标准的js风格，就是说写代码的时候要规范的写
  extends: ['standard', 'plugin:vue/essential'],
  // required to lint *.vue files
  // 此项是用来提供插件的，插件名称省略了eslint-plugin-，下面这个配置是用来规范html的
  plugins: ['vue'],
  // add your custom rules here
  // 下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
  // 主要有如下的设置规则，可以设置字符串也可以设置数字，两者效果一致
  // "off" -> 0 关闭规则
  // "warn" -> 1 开启警告规则
  // "error" -> 2 开启错误规则
  rules: {
    'no-unused-vars': 0,
    'no-tabs': 0,
    'no-unneeded-ternary': 0, 
    // 忽略函数空格检测
    'space-before-function-paren': 0,
    // 中缀操作符周围要不要有空格
    'space-infix-ops': 0,
    'no-trailing-spaces': 0,
    'new-parens': 0,
    // 禁止在使用new构造一个实例后不赋值
    'no-new': 0,
    // 大括号内是否允许不必要的空格
    'object-curly-spacing': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // 双峰驼命名格式
    'camelcase': 0,
    // no-var
    'no-var': 2,
    'one-var': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
