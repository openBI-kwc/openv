<template lang="pug">
  //- 数据视图
  //- 屏蔽鼠标右键
  .carousel-screen(:id="carouselId" ondragstart="window.event.returnValue = false" oncontextmenu="window.event.returnValue = false" onselectstart="window.event.returnValue = false")
    Loading(v-if="loading")
    template(v-else)
      .screen-box(v-if="currentScreen")
        .swiper-wrapper
          .swiper-slide(v-for="(item,index) in currentScreen.screens" :key="`大屏--${index}-->${item}`")
            iframe.content-container(:src="item" scrolling="no" frameborder="0")
        .swiper-pagination
        .play-puase-wraper(:class="currentScreen.controlPos")
          .wp
            #prev-button.icon &#xe66f;
            #play-puase-button.icon(v-html="isplay ? '&#xe66e;' : '&#xe66d;'")
            #next-button.icon &#xe688;
</template>

<script>
import { GET_CAROUSEL_DETAIL } from '@api/visualrelated.js'
import Swiper from 'swiper'
import Utils from '@public/utils'
const $ = window.$
export default {
  data () {
    return {
      loading: true,
      crIdent: this.$route.params.crIdent,
      currentScreen: null,
      swiper: null,
      isplay: true,
      carouselId: Utils.unid('c-')
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      GET_CAROUSEL_DETAIL({crIdent: this.crIdent}).then(result => {
        if (result.err) return
        this.currentScreen = result.data
        document.title = '轮播大屏 | ' + this.currentScreen.cname
        this.loading = false
        if (this.currentScreen.screens.length > 1) this.initSwiper()
      })
    },
    initSwiper () {
      const { time, animation } = this.currentScreen
      let initParams = {
        observer: true,
        observeParents: true,
        pagination: '.swiper-pagination',
        autoplay: time * 1000,
        loop: true,
        speed: 500,
        prevButton: '#prev-button',
        nextButton: '#next-button',
        effect: animation
      }
      switch (animation) {
        case 'fade':
          initParams.fade = {
            crossFade: true
          }
          break
        case 'cube':
          initParams.cube = {
            slideShadows: true,
            shadow: true,
            shadowOffset: 100,
            shadowScale: 0.6
          }
          break
        case 'coverflow':
          initParams.coverflow = {
            rotate: 30,
            stretch: 10,
            depth: 60,
            modifier: 2,
            slideShadows: true
          }
          break
        case 'flip':
          initParams.flip = {
            slideShadows: true,
            limitRotation: true
          }
          break
      }
      this.$nextTick(() => {
        this.swiper = new Swiper('.screen-box', initParams)
        $('#play-puase-button').on('click', () => {
          if (this.isplay) this.swiper.stopAutoplay()
          else this.swiper.startAutoplay()
          this.isplay = !this.isplay
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .screen-box {
    height: 100%;
    width: 100%;
    position: relative;
  }
  .swiper-pagination {
    bottom: 0;
  }
  .swiper-wrapper {
    width: 100%;
    height: 100%;
    .content-container {
      border: 0;
      width: 100%;
      height: 100%;
    }
  }
  .play-puase-wraper {
    z-index: 1;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 10vh;
    min-height: 30px;
    max-height: 240px;
    display: flex;
    align-items: center;
    &.left {
      justify-content: flex-start;
      margin-left: 120px;
    }
    &.right {
      justify-content: flex-end;
      margin-right: 120px;
    }
    &.center {
      justify-content: center;
    }
    .wp {
      width: 200px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .icon {
      height: 30px;
      line-height: 30px;
      line-height: 30px;
      font-size: 20px;
      color: #ffffff;
      cursor: pointer;
      text-align: center;
      width:56px;
      background:rgba(0,0,0,1);
      border:1px solid rgba(255, 255, 255, 0.5);
      border-radius:6px;
    }
  }
</style>
