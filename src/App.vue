<template lang="pug">
  #app
    router-view.box
    ChartMenu
</template>
<script>
import { mapState } from 'vuex'
export default {
  watch: {
    $route () {
      let enter = ['localdeploy', 'share']
      if (this.setting.localDeploy && !enter.includes(this.$route.name)) this.$router.push({name: 'localdeploy'})
    }
  },
  computed: {
    ...mapState(['setting'])
  }
}
</script>
<style lang="less">
  @import '~@assets/css/main.less';
</style>
