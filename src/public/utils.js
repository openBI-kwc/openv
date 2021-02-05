// 工具函数库
'use strict'
import Vue from 'vue'
// mds 加密
import JsMd5 from 'js-md5'
// 工具函数库
import Lodash from 'lodash'
// 加密
import CryptoJS from 'crypto-js'
// 操作storage https://github.com/ustbhuangyi/storage/blob/edcb8d10e7f9f68ff7ffa40669db4695dc4658c3/README.md
import Storage from 'good-storage'
// 操作cookies https://github.com/js-cookie/js-cookie
import Cookies from 'js-cookie'
// 剪切板
import CopyToClipboard from 'copy-to-clipboard'
// 导入base64
import { Base64 } from 'js-base64'
// 不要第三方依赖的工具
import Tool from './tool.js'
// Vue eventbus
const Order = new Vue()
const Utils = {
  ...Tool,
  // 清除所有的webstorage
  clearAllStorage () {
    let cookiesList = Cookies.getJSON()
    for (const key in cookiesList) {
      if (key === 'Not-Forget' && cookiesList[key]) {
        continue
      }
      Cookies.remove(key, {
        path: '/',
        expires: -1
      })
      Storage.clear()
    }
  },
  // base64 加密
  enBase64(e) {
    if (Lodash.isString(e) || Lodash.isNumber(e)) {
      try {
        e += ''
        return Utils.encryption(e)
      } catch (error) {
        console.error('加密失败：尝试清除缓存')
        return e
      }
    }
    return e
  },
  // base64 解密
  deBase64(e) {
    if (!Lodash.isString(e)) return e
    try {
      return Utils.decrypt(e)
    } catch (error) {
      console.error('解密失败：尝试清除缓存')
      return e
    }
  },
  // 删除对象里面的指定的key属性
  delObjData(target, dels) {
    if (!Lodash.isObject(target)) return
    Lodash.find(target, (o, i) => {
      if (!target['notdelete']) {
        dels.includes(i) && delete target[i]
        Utils.delObjData(o, dels)
      }
    })
  },
  // 设置对象的值
  setObjData(target, map) {
    for (const key in map) {
      const element = map[key]
      Lodash.set(target, key, element)
    }
  },
  // 定义加密函数
  encryption(data, secretkey) {
    /**
     * 定义加密函数
     * @param {string} data - 需要加密的数据, 传过来前先进行 JSON.stringify(data);
     * @param {string} key - 加密使用的 key
     */
    const aesEncrypt = (data, key) => {
      /**
       * CipherOption, 加密的一些选项:
       *   mode: 加密模式, 可取值(CBC, CFB, CTR, CTRGladman, OFB, ECB), 都在 CryptoJS.mode 对象下
       *   padding: 填充方式, 可取值(Pkcs7, AnsiX923, Iso10126, Iso97971, ZeroPadding, NoPadding), 都在 CryptoJS.pad 对象下
       *   iv: 偏移量, mode === ECB 时, 不需要 iv
       * 返回的是一个加密对象
       */
      const cipher = CryptoJS.AES.encrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
        iv: ''
      })
      // 将加密后的数据转换成 Base64
      const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64)
      // 返回加密后的经过处理的 Base64
      return base64Cipher
    }
    // 密码加密关键字
    const aesPwdkey = (key = 'kwc.net') => {
      /**
       * 生成密钥字节数组, 原始密钥字符串不足128位, 补填0.
       * @param {string} key - 原始 key 值
       * @return Buffer
       */
      const keySize = 128
      const filledKey = Buffer.alloc(keySize / 8)
      const keys = Buffer.from(key)
      if (keys.length < filledKey.length) {
        filledKey.map((b, i) => {
          filledKey[i] = keys[i]
        })
      }
      return filledKey
    }
    // 获取填充后的key
    const key = CryptoJS.enc.Utf8.parse(aesPwdkey(secretkey))
    return aesEncrypt(data, key)
  },
  // 定义解密函数
  decrypt(data, secretkey) {
    /**
     * 定义解密函数
     * @param {string} data - 加密的数据;
     * @param {string} key - 加密使用的 key
     */
    const aesDecrypt = (data, key) => {
      // 先将 Base64 还原一下, 因为加密的时候做了一些字符的替换
      // const restoreBase64 = data.replace(/\-/g,'+').replace(/_/g,'/');
      // 这里 mode, padding, iv 一定要跟加密的时候完全一样
      // 返回的是一个解密后的对象
      const decipher = CryptoJS.AES.decrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
        iv: ''
      })
      // 将解密对象转换成 UTF8 的字符串
      const resultDecipher = CryptoJS.enc.Utf8.stringify(decipher)
      // 返回解密结果
      return resultDecipher
    }
    // 密码加密关键字
    const aesPwdkey = (key = 'kwc.net') => {
      /**
       * 生成密钥字节数组, 原始密钥字符串不足128位, 补填0.
       * @param {string} key - 原始 key 值
       * @return Buffer
       */
      const keySize = 128
      const filledKey = Buffer.alloc(keySize / 8)
      const keys = Buffer.from(key)
      if (keys.length < filledKey.length) {
        filledKey.map((b, i) => {
          filledKey[i] = keys[i]
        })
      }
      return filledKey
    }
    const key = CryptoJS.enc.Utf8.parse(aesPwdkey(secretkey))
    return aesDecrypt(data, key)
  }
}
export {
  Utils as default,
  Utils,
  Storage,
  Cookies,
  Lodash,
  Order,
  CopyToClipboard,
  Base64,
  JsMd5
}
