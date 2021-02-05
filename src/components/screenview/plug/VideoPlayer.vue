<template lang="pug">
  VideoJsPlayer(ref="Video", @ready="playerReadied", :options="options", :playsinline= "playsinline", :start="start")
</template>
<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
export default {
  props: ['value'],
  data() {
    return {
      playerOptions: {
        // videojs options
        muted: true,
        autoplay: true,
        loop: true,
        controls: true,
        poster: '',
        language: 'en',
        playbackRate: 1,
        // fluid: true,
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        sources: [
          {
            type: 'video/mp4',
            src: ''
          }
        ]
      },
      playsinline: false,
      start: 0
    }
  },
  methods: {
    playerReadied (player) {
      player.children_[0].playbackRate = this.options.playbackRate
    }
  },
  computed: {
    options: {
      set (val) {
        let { chartData } = this.value
        this.playsinline = chartData.playsinline
        this.start = chartData.start
      },
      get () {
        let { width, height, chartData } = this.value
        return Object.assign({}, this.playerOptions, { width, height, ...chartData.playerOptions })
      }
    }
  },
  components: {
    VideoJsPlayer: videoPlayer
  }
}
</script>
