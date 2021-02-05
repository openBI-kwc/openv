<template>
  <div class="swiper-image">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item, index) in value.chartData.dataUrl" :key="index" :width="value.width" :height="value.height">
        <div class="swipertitle" :style="textStyles">{{value.chartData.desclist[index]}}</div>
        <img :src="item" :width="value.width" :height="value.height"/>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import { Lodash } from '@public/utils'
const $ = window.$
export default {
  props: ['value'],
  data () {
    return {
      mySwiper: null,
      swiperOptions: {
        observer: true,
        observeParents: true,
        pagination: '.swiper-pagination'
      },
      opt: {},
      effectList: {
        slide: {},
        fade: {
          fade: {
            crossFade: false
          }
        },
        cube: {
          cube: {
            slideShadows: false,
            shadow: false,
            shadowOffset: 0,
            shadowScale: 0
          }
        },
        coverflow: {
          coverflowEffect: {
            rotate: 30,
            stretch: 10,
            depth: 60,
            modifier: 2,
            slideShadows: true
          }
        },
        flip: {
          slideShadows: true,
          limitRotation: true
        }
      }
    }
  },
  created () {
    this.opt = this.value.chartData.options
  },
  mounted () {
    this.mountInstance()
  },
  computed: {
    // 获取swiper配置
    swiperOpt () {
      const options = Object.assign({}, this.opt, this.effectList[this.opt.effect], this.swiperOptions)
      $('.swipertitle').css(this.textStyles)
      return options
    },
    textStyles () {
      let style = this.value.chartData.style
      return {
        fontSize: style.fontSize + 'px',
        fontFamily: style.fontFamily,
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems,
        fontWeight: style.fontWeight,
        width: style.width + '%',
        height: style.height + '%',
        marginTop: style.top + 'px',
        marginLeft: style.left + 'px'
      }
    }
  },
  methods: {
    mountInstance() {
      const swiperOptions = this.swiperOpt
      this.swiper = new Swiper('.swiper-image', swiperOptions)
    },
    update: Lodash.debounce(function () {
      if (!this.swiper) return
      this.swiper.destroy && this.swiper.destroy(true, true)
      this.mountInstance()
    }, 600, {leading: false})
  },
  beforeDestroy () {
    if (!this.swiper) return
    this.swiper.destroy && this.swiper.destroy(true, true)
    this.swiper = null
  },
  watch: {
    'value.width': {
      handler(n, o) {
        if (!this.swiper) return
        this.update()
      },
      deep: true,
      immediate: false
    },
    'value.height': {
      handler(n, o) {
        if (!this.swiper) return
        this.update()
      },
      deep: true,
      immediate: false
    },
    'value.chartData.options': {
      handler(n, o) {
        if (!this.swiper) return
        this.update()
      },
      deep: true,
      immediate: false
    },
    'value.chartData.style': {
      handler(n, o) {
        if (!this.swiper) return
        this.update()
      },
      deep: true,
      immediate: false
    }
  }
}
</script>

<style lang="less" scoped>
.swipertitle {
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
}
.swiper-image {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
