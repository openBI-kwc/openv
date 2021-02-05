import Vue from 'vue'
let components = []
/**
 * 首字母大写
 * @param str 字符串
 * @example heheHaha
 * @return {string} HeheHaha
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
/**
 * 对符合'xx/xx.vue'组件格式的组件取组件名
 * @param str fileName
 * @example abc/bcd/def/basicTable.vue
 * @return {string} BasicTable
 */
function validateFileName(str) {
  return /^\S+\.vue$/.test(str) && str.replace(/^\S+\/(\w+)\.vue$/, (rs, $1) => capitalizeFirstLetter($1))
}
const requireComponent = require.context('@coms', true, /\.vue$/)
// 找到组件文件夹下以.vue命名的文件，如果文件名为index，那么取组件中的name作为注册的组件名
// ---------------------------------------------------------------------------
let keys = requireComponent.keys()
for (let index = 0; index < keys.length; index++) {
  const filePath = keys[index]
  const componentConfig = requireComponent(filePath)
  const fileName = validateFileName(filePath)
  const componentName = fileName.toLowerCase() === 'index' ? capitalizeFirstLetter(componentConfig.default.name) : fileName
  try {
    if (components.includes(componentName)) {
      console.error(`[${componentName}]组件 ---> 重复注册了`)
      continue
    }
    components.push(componentName)
    // Vue.js 的异步组件是把组件定义为一个工厂函数，在组件需要渲染时触发工厂函数，并且把结果缓存起来，用于后面的再次渲染。
    Vue.component(componentName, function (resolve) {
      // 将组件定义传入 resolve 回调函数
      resolve(componentConfig.default || componentConfig)
    })
  } catch (error) {
    console.warn(`[${componentName}]组件 ---> 全局注册失败`)
  }
}
export { components }