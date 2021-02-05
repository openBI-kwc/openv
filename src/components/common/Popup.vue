<template lang="pug">
  //- 可自定义内容的弹出层
  .popup-box(:class="classid")
    .mask(@click.self.stop="$emit('close')")
    .popup-content-box
      .line-point.top
      .line-point.bottom
      .popup-content
        .popup-header
          .name {{text}}
          .close.icon(v-if="isclose" @click.self="$emit('close')") &#xe600;
        .slot-warp
          slot
</template>
<script>
import Utils from '@public/utils'
export default {
  data () {
    return {
      classid: Utils.unid()
    }
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    isclose: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
  .flex-center (@fa){
    display: flex;
    justify-content: @fa;
    align-items: center;
  }
  .slot-warp {
    height: calc(100% - 36px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .line-point {
    &.bottom {
      left: calc(100% - 300px);
      bottom: -27px;
      animation: flowinglightBottom 3s linear infinite alternate;
    }
    &.top {
      left: 0;
      top: -27px;
      animation: flowinglightTop 3s linear infinite alternate;
    }
    position: absolute;
    width: 300px;
    height: 35px;
    transition: all 0.6s;
    background: url(~@assets/img/light.png) center center / cover no-repeat;
  }
  @keyframes flowinglightTop {
    from {
      left: 0;
    }
    to {
      left: calc(100% - 300px);
    }
  }
  @keyframes flowinglightBottom {
    from {
      left: calc(100% - 300px);
    }
    to {
      left: 0;
    }
  }
  @keyframes popup {
    0%{
      left: 50;
      top: -100%;
      transform: translate(-50%,0);
    }
    100% {
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
  }
  .popup-content-box {
    display: flex;
    flex-direction: column;
    z-index: 99;
    height: fit-content;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    border:15px solid rgba(0,0,0,0);
    border-image:url(~@assets/img/modal-bg.png) 15 15 stretch;
    animation: popup 0.3s;
    max-height: 60vh;
    max-width: 60vw;
    min-width: 500px;
    .popup-content {
      background: #001d39;
      padding: 5px 20px 10px;
      display: flex;
      flex-direction: column;
      flex: 1;
      max-height: 100%
    }
  }
  .popup-header {
    .flex-center(space-between);
    font-size:14px;
    color:rgba(255,255,255,1);
    height:36px;
    line-height: 36px;
    background:rgba(7,54,98,0.6);
    padding: 0 10px;
    .close {
      text-align: center;
      width:16px;
      height:16px;
      line-height: 16px;
      color:rgba(0,183,238,0.7);
      cursor: pointer;
      font-size: 14px;
    }
  }
</style>
