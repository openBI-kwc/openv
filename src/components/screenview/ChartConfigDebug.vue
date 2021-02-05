<template lang="pug">
  MonacoEditer(v-model="chartData", :editorOptions="{ language: 'json'}")
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['position', 'index']),
    chartData: {
      set (val) {
        this.position[this.index].chartData = val
      },
      get () {
        return this.position[this.index].chartData
      }
    }
  },
  data () {
    return {
      conf: {
        lang: 'json',
        height: '100%',
        width: '100%'
      }
    }
  }
}
</script>
