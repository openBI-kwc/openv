<template lang="pug">
  //- api数据源
  .API
    //- 选择数据源
    .conf-item
      .fileid-content 选择已有数据源
      .fileid-content
        Selection(v-if="!isnotSelect",
          v-model="value.source.selectDaid",
          :option="dataUsed",
          @onChange="changeApi",
          :width="210")
        <div v-else class="not-select">暂无数据源, 点击[<b>新建</b>]按钮添加</div>
        .create-data(@click="createAdd") 新建
    //- 当前API地址
    .conf-item(v-if="!isnotSelect", @onChange="getMapData")
      .fileid-content API地址
      .fileid-content
        .show-api
          MonacoEditer(v-if="editData", v-model="editData.url", @onChange="editApi")
    //-  输入API地址
    .conf-item(v-else, @onChange="getMapData")
      .fileid-content API地址
      .fileid-content
        .show-api
          MonacoEditer.show-res(v-model="value.source.apiURL")
</template>
<script>
import chartmapping from '@public/mixin/chartmapping'
import {
  GET_DATA_USED
} from '@api/visualscreen.js'
import {
  UPDATE_DATA
} from '@api/datasrc.js'
import { Order } from '@public/utils'
export default {
  mixins: [chartmapping],
  props: {
    value: Object
  },
  data () {
    return {
      editConf: {
        width: '260px',
        height: '400px'
      }
    }
  },
  created () {
    // 获取已有数据源
    this.getDataUsed()
  },
  mounted () {
    this.$eventBus.$on('CREATED_DBSOURCE', () => {
      this.getDataUsed()
    })
  },
  beforeDestroy() {
    Order.$off('CREATED_DBSOURCE')
  },
  computed: {
    editData () {
      let id = this.value.source.selectDaid
      let obj = this.dataUsed.filter(item => {
        return item.value === id
      })[0]
      return obj
    },
    isnotSelect () {
      return this.value.source.selectDaid === 'Not selected'
    }
  },
  watch: {
    editData: {
      handler (n, o) {
        this.value.source.apiURL = this.editData.url
      },
      deep: true
    }
  },
  methods: {
    // 切换api
    changeApi () {
      this.value.source.apiURL = this.editData.url
    },
    // 获取已有数据源
    getDataUsed () {
      let source = this.value.source
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
            value: item.daid,
            url: item.filepath
          }
        })
        if (source.selectDaid === 'Not selected') {
          source.selectDaid = this.dataUsed[0].value
          source.apiURL = this.dataUsed[0].url
        }
      })
    },
    createAdd () {
      this.$emit('create', {
        type: this.value.source.type
      })
    },
    // 修改数据
    editApi () {
      UPDATE_DATA({
        daid: this.value.source.selectDaid,
        datatype: this.value.source.type,
        filepath: this.editData.url
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .show-api {
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
  /deep/ .modal-box {
    min-height: 100px;
    width: 500px;
    .modal-content{
      height: 60px;
      display: flex;
      align-items: center;
    }
  }
</style>
