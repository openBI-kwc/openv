// 自定义指令
'use strict'
import imgerror from '@assets/img/datav.png'
import VueLazyload from 'vue-lazyload'
import dragging from 'awe-dnd'
/**
 * 检测图片是否存在
 * @param url
 */
const imageIsExist = function (url) {
  return new Promise((resolve) => {
    var img = new Image()
    img.onload = function () {
      if (this.complete == true) {
        resolve(true)
        img = null
      }
    }
    img.onerror = function () {
      resolve(false)
      img = null
    }
    img.src = url
  })
}
export default (Vue) => {
  // 拖动指令
  Vue.use(dragging)
  // autofocus
  Vue.directive('focus', {
    inserted: (el) => {
      el.focus()
    }
  })
  // 图片懒加载
  Vue.use(VueLazyload, {
    error: imgerror
  })
  //全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
  //指令名称为：imgerror
  Vue.directive('imgerror', {
    inserted: async function (el, binding) {
      let imgURL = el.src
      let exist = await imageIsExist(imgURL)
      if (!exist) {
        el.src = imgerror
      }
    }
  })
}
