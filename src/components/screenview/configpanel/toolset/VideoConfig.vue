// 视频配置
<template lang='pug'>
  ExpandList(title="视频配置")
    ControlItem(value="视频地址")
      AutoInput(v-model="chartData.playerOptions.sources[0].src")
    ControlItem(value="自动播放")
      SwitchBar(v-model="chartData.playerOptions.autoplay")
    ControlItem(value="循环播放")
      SwitchBar(v-model="chartData.playerOptions.loop")
    ControlItem(value="控制条")
      SwitchBar(v-model="chartData.playerOptions.controls")
    ControlItem(value="静音")
      SwitchBar(v-model="chartData.playerOptions.muted")
    ControlItem(value="海报地址")
      AutoInput(v-model="chartData.playerOptions.poster")
    ControlItem(value="默认播放速度")
      Selection(v-model="chartData.playerOptions.playbackRate", :option="playbackRates")
</template>
<script>
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [chartdata],
  data () {
    return {
      chartData: null,
      playbackRates: [{
        name: '0.5倍数',
        value: 0.5
      }, {
        name: '1.0倍数',
        value: 1.0
      }, {
        name: '1.5倍数',
        value: 1.5
      }, {
        name: '2.0倍数',
        value: 2.0
      }]
    }
  },
  created () {
    this.chartData = this.position[this.index].chartData
  }
}
</script>
