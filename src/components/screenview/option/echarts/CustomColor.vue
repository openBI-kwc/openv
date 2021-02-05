<template lang="pug">
  //- 标题的配置
  ExpandList(title="自定义颜色")
    CustomColorInput(@sendColorList="getCustom", :colors="colors")
</template>
<script>
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [chartdata],
  data () {
    return {
      openCustomColor: false,
      colors: []
    }
  },
  created () {
    if (typeof this.chartData.color !== 'undefined') {
      this.colors = this.chartData.color
    }
  },
  methods: {
    getCustom (data) {
      this.chartData.color = data
      this.colors = this.chartData.color
    }
  }
}
</script>
