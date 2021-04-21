/**
 * `socketHeartbeat` constructor.
 *
 * @param {Object} opts
 * {
 *  url ws链接地址
 *  pingTimeout 未收到消息多少秒之后发送ping请求，默认15000毫秒
    pongTimeout  发送ping之后，未收到消息超时时间，默认10000毫秒
    reconnectTimeout 尝试重连的间隔时间
    pingMsg ping消息值
    pongMsg  后台回应信息
 * }
 * @api public
 */
const defaultOpt = {
  url: '',
  // 每隔15秒发送一次心跳，如果收到任何后端消息定时器将会重置
  pingTimeout: 15000,
  // ping消息发送之后，30分钟内没收到后端消息便会认为连接断开
  pongTimeout: 60 * 30 * 1000,
  // 尝试重连的间隔时间
  reconnectTimeout: 5000,
  // ping消息值
  pingMsg: 'ping',
   // 后台回应信息
  pongMsg: 'pong',
  repeatLimit: null
}
// http://www.ws-test.com/
export default class socketHeartbeat {
  constructor({ options, callback }) {
    //ws实例
    this.websock = null
    this.repeat = 0;
    this.opts = Object.assign({}, defaultOpt, options)
    this.callback = callback
    this.send = this.socketSendData
    // override hook function
    this.onclose = () => {
      console.log('ws closed');
    };
    // 连接错误
    this.onerror = (e) => {
      console.log('ws error:', e.code || '未知错误')
    };
    // 连接成功
    this.onopen = () => {
      console.log('ws success')
      this.callback && this.callback('SUCCESS CALLBACK')
    };
    // 数据接收
    this.onmessage = (e) => {
      console.log('ws acceptData')
      this.callback && this.callback(e.data)
    };
    // 重连
    this.onreconnect = () => {
      console.log('ws reConnecting...')
    };
    // 初始化
    this.createWebSocket()
  }
  // 创建实例
  createWebSocket () {
    try {
      if (!!window.WebSocket && window.WebSocket.prototype.send) {
        console.log("您的浏览器支持Websocket通信协议")
        console.log('--------------------------------------------------')
        console.log('webSocket url: ', this.opts.url)
        if (!/(ws|wss):\/\/([\w.]+\/?)\S*/.test(this.opts.url)) {
          console.log('无效的ws 连接地址')
          return
        }
        // 没有创建实例
        if (!this.websock) this.websock = new WebSocket(this.opts.url);
        this.initEventHandle();
      } else {
        alert("您的浏览器不支持Websocket通信协议，请使用Chrome或者Firefox浏览器！")
      }
    } catch (e) {
      this.reconnect();
      throw e;
    }
  }
  // 初始化
  initEventHandle () {
    this.websock.onclose = () => {
      this.onclose();
      this.reconnect();
    };
    this.websock.onerror = () => {
      this.onerror();
      this.reconnect();
    };
    this.websock.onopen = () => {
      this.repeat = 0;
      this.onopen();
      //心跳检测重置
      this.heartCheck();
    };
    this.websock.onmessage = (event) => {
      this.onmessage(event);
      //如果获取到消息，心跳检测重置
      //拿到任何消息都说明当前连接是正常的
      this.heartCheck();
    };
  }
  // 重连
  reconnect () {
    //limit repeat the number
    if (this.opts.repeatLimit > 0 && this.opts.repeatLimit <= this.repeat) return;
    if (this.lockReconnect || this.forbidReconnect) return;
    this.lockReconnect = true;
    this.repeat++; //必须在lockReconnect之后，避免进行无效计数
    this.onreconnect();
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.createWebSocket();
      this.lockReconnect = false;
    }, this.opts.reconnectTimeout);
  }
  // 发送数据
  socketSendData (msg) {
    if (this.websock.readyState !== this.websock.OPEN) return
    try {
      if (msg !== this.opts.pongMsg && typeof msg === 'object') {
        console.log('ws sendData', msg)
        this.websock.send(JSON.stringify(msg))
      } else {
        this.websock.send(msg)
      }
    } catch (e) {}
  }
  //心跳检测
  heartCheck () {
    this.heartReset();
    this.heartStart();
  }
  // 开始心跳
  heartStart () {
    if (this.forbidReconnect) return; //不再重连就不再执行心跳
    this.pingTimeoutId = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      this.websock.send(this.opts.pingMsg);
      //如果超过一定时间还没重置，说明后端主动断开了
      this.pongTimeoutId = setTimeout(() => {
        //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        this.websock.close();
      }, this.opts.pongTimeout);
    }, this.opts.pingTimeout);
  }
  // 重置心跳
  heartReset() {
    clearTimeout(this.pingTimeoutId);
    clearTimeout(this.pongTimeoutId);
  }
  // 关闭连接
  close () {
    //如果手动关闭连接，不再重连
    this.forbidReconnect = true;
    this.heartReset();
    this.websock.close();
  }
}
