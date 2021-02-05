
export default function (callBack, retry = 3000, autoplay = true) {
  // 回调
  this.onmessage = callBack
  //采用轮询
  this.resource = {}
  // 开始轮询
  this.open = () => {
    let onmessage = this.onmessage
    //是否挂起
    let hangUp = false
    //最快轮询速度 3 秒一次
    let spend = retry > 3000 ? 3000 : retry
    // 关闭轮询
    this.resource.close && this.resource.close()
    this.resource.lockInt = setInterval(() => {
      retry -= spend
      if (retry > 0 || hangUp) return
      //挂起
      hangUp = true
      if (typeof onmessage === 'function') {
        onmessage()
        //取消挂起
        hangUp = false
      }
    }, spend)
    this.resource.close = () => {
      if (typeof this.resource.lockInt === 'number') {
        clearInterval(this.resource.lockInt)
      }
    }
    return this.resource
  }
  // 自动开启
  if (autoplay) return this.open()
}