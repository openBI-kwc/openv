<template lang="pug">
  //- static数据数据源
  .STATIC
    .conf-item
      .fileid-content 静态数据
      .fileid-content
        template(v-if="chartOpt.charttype==='fuwenben'")
          KindEditor(v-if="editData[0].richtext", v-model="editData[0].richtext")
        .static-data(v-else)
          MonacoEditer(v-model="editData", :editorOptions="{ language: 'json' }")
</template>
<script>
import chartPublicMethod from '@public/chartPublicMethod'
import { mapState } from 'vuex'
export default {
  props: {
    value: Object
  },
  data () {
    return {
      editerConf: {
        lang: 'json',
        width: '260px',
        height: '400px',
        fontSize: 10
      },
      editData: '',
      chartOpt: null
    }
  },
  watch: {
    editData: {
      handler (n, o) {
        this.value.tdata = this.editData
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['position', 'index'])
  },
  async created () {
    this.chartOpt = this.position[this.index]
    let tdata = this.value.tdata
    this.editData = tdata || {}
    if (tdata) return
    // 如果切换到静态数据 要请求对应的修改过的或默认的数据
    await chartPublicMethod.getChartStaticData(this.chartOpt)
    this.editData = this.value.tdata
    this.$emit('mapping')
  }
}
</script>
<style lang="less" scoped>
.static-data {
  width: 260px;
  height: 400px;
}
.conf-item {
  width: 100%;
  height: auto;
  .fileid-content {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
    padding-left: 20px;
    line-height: 40px;
    user-select: none;
    height: auto;
  }
}
</style>
