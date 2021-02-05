<template lang="pug">
  //- csv数据源
  .CSV
    .conf-item
      .fileid-content 选择已有数据源
      .fileid-content
        Selection(v-if="!isnotSelect", v-model="value.source.selectDaid", :option="dataUsed", :width="210")
        <div v-else class="not-select">暂无数据源, 点击[<b>新建</b>]按钮添加</div>
        .create-data(@click="createAdd") 新建
</template>
<script>
import {
  GET_DATA_USED
} from '@api/visualscreen.js'
import { mapState } from 'vuex'
import chartmapping from '@public/mixin/chartmapping'
export default {
  mixins: [chartmapping],
  props: {
    value: Object
  },
  created () {
    this.getDataUsed()
  },
  mounted () {
    this.$eventBus.$on('CREATED_DBSOURCE', () => {
      this.getDataUsed()
    })
  },
  computed: {
    ...mapState(['position', 'index']),
    isnotSelect () {
      return this.value.source.selectDaid === 'Not selected'
    }
  },
  methods: {
    createAdd () {
      this.$emit('create', {
        type: this.value.source.type
      })
    },
    // 获取已有数据源
    getDataUsed () {
      let chartOpt = this.position[this.index]
      let source = chartOpt.dataOpt.source
      let params = {
        datatype: source.type
      }
      GET_DATA_USED(params).then(res => {
        if (res.err) return
        let srclist = res.data
        if (!srclist.length) {
          source.selectDaid = 'Not selected'
          return
        }
        this.dataUsed = srclist.map((item, index) => {
          return {
            name: item.dataname,
            value: item.daid
          }
        })
        if (source.selectDaid === 'Not selected') {
          source.selectDaid = this.dataUsed[0].value
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
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
    display: flex;
    align-items: center;
  }
  .create-data {
    width: 40px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #219AF2;
    border-radius: 2px;
    font-size: 12px;
    color: #FFFFFF;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
