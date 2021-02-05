<template lang="pug">
  //- 长连接数据源
  .WEBSOCKET
    .conf-item
      .fileid-content 选择已有数据源
      .fileid-content
        Selection(v-if="!isnotSelect",
          v-model="value.source.selectDaid",
          :option="dataUsed",
          @onChange="changeSocket",
          :width="210")
        <div v-else class="not-select">暂无数据源, 点击[<b>新建</b>]按钮添加</div>
        .create-data(@click="createAdd") 新建
    .conf-item(v-if="!isnotSelect")
      .fileid-content Websocket地址
      .fileid-content
        //- Editer(v-model="editData.url", :config="editerConf", @input="editWebsocket")
        .show-websocket
          MonacoEditer(v-model="editData.url", @onChange="editWebsocket")
    //- 数据展示
    .conf-item(v-else)
      .fileid-content Websocket地址
      .fileid-content
        //- Editer(v-model="value.source.socketURL", :config="editerConf")
        .show-websocket
          MonacoEditer(v-model="value.source.socketURL")
</template>
<script>
import {
  GET_DATA_USED
} from '@api/visualscreen.js'
import {
  UPDATE_DATA
} from '@api/datasrc.js'
import chartmapping from '@public/mixin/chartmapping'
import { mapState } from 'vuex'
export default {
  mixins: [chartmapping],
  data () {
    return {
      editerConf: {
        width: '260px',
        height: '400px'
      }
    }
  },
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
  methods: {
    changeSocket () {
      this.value.source.socketURL = this.editData.url
    },
    // 修改数据
    editWebsocket () {
      UPDATE_DATA({
        daid: this.value.source.selectDaid,
        datatype: this.value.source.type,
        filepath: this.editData.url
      })
    },
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
            value: item.daid,
            url: item.filepath
          }
        })
        if (source.selectDaid === 'Not selected') {
          source.selectDaid = this.dataUsed[0].value
          source.socketURL = this.dataUsed[0].url
        }
      })
    }
  },
  watch: {
    editData: {
      handler (n, o) {
        this.value.source.socketURL = this.editData.url
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
  .show-websocket {
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
