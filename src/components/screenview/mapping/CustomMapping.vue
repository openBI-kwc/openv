<template lang="pug">
  //- 自定义视图数据源
  .CUSTOM
    LinkPopup(v-if="showAddPopup", @close="showAddPopup = false")
    .conf-item
      .fileid-content 选择已有数据库链接
      .fileid-content
        Selection(v-if="!nolinlk",
          v-model="value.source.dbLinkId",
          :option="dbLinks",
          @onChange="getDataUsed",
          :width="210")
        <div v-else class="not-select">暂无数据库连接, 点击[<b>新建</b>]按钮添加</div>
        .create-data(@click="showAddPopup = true") 新建
    //- 有数据才显示
    .conf-item
      .fileid-content 选择已有选择数据库
      .fileid-content
        Selection(v-if="!isnotSelect",
          v-model="value.source.selectDaid",
          :option="dataUsed",
          @onChange="changeData",
          :width="210")
        <div v-else class="not-select">暂无数据源, 点击[<b>新建</b>]按钮添加</div>
        .create-data(@click="createAdd") 新建
    //- 数据展示
    .conf-item(v-if="value.source.selectDaid !== 'Not selected'")
      .fileid-content 自定义视图数据
      .fileid-content.fileid-content
        //- Editer(:value="viewdata", :config="editerConf")
        .show-custom
          MonacoEditer(v-model="viewdata", :editorOptions="{ language: 'json', readOnly: true }")
</template>
<script>
import { mapState } from 'vuex'
import chartmapping from '@public/mixin/chartmapping'
import {
  GET_SQL_CUS_SRC
} from '@api/visualscreen.js'
import {
  GET_DATABASE
} from '@api/datasrc.js'
export default {
  mixins: [chartmapping],
  data () {
    return {
      // 没有数据源
      isnosrc: false,
      editerConf: {
        lang: 'json',
        width: '260px',
        height: '400px',
        readOnly: true
      },
      dbLinks: [],
      showAddPopup: false,
      // 显示的数据
      viewdata: []
    }
  },
  props: {
    value: Object
  },
  async created () {
    await this.getSqlLinks()
    await this.getDataUsed()
  },
  mounted () {
    this.$eventBus.$on('CREATED_DBLINK', () => {
      this.getSqlLinks()
    })
    this.$eventBus.$on('CREATED_DBSOURCE', () => {
      this.getDataUsed()
    })
  },
  computed: {
    ...mapState(['position', 'index']),
    nolinlk () {
      return this.value.source.dbLinkId === 'Not selected'
    },
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
    // 改变
    changeData (obj) {
      this.viewdata = this.dataUsed.filter(item => {
        return item.value === obj
      })[0].data || []
    },
    // 获取已有数据源
    getDataUsed () {
      return new Promise(resolve => {
        let chartOpt = this.position[this.index]
        let source = chartOpt.dataOpt.source
        let params = {
          type: source.type,
          id: source.dbLinkId
        }
        GET_SQL_CUS_SRC(params).then(res => {
          if (res.err) return
          let srclist = res.data
          // 如果没有数据
          if (!srclist.length) {
            source.selectDaid = 'Not selected'
            this.viewdata = []
            return
          }
          this.dataUsed = srclist.map((item, index) => {
            return {
              name: item.dataname,
              value: item.daid,
              data: item.data
            }
          })
          if (source.selectDaid === 'Not selected') {
            source.selectDaid = this.dataUsed[0].value
            this.viewdata = this.dataUsed[0].data
          }
          this.changeData(source.selectDaid)
          resolve()
        })
      })
    },
    // 获取数据库连接
    getSqlLinks () {
      return new Promise(resolve => {
        let source = this.value.source
        GET_DATABASE().then(res => {
          if (res.err) return
          let linklist = res.data
          // 没有连接
          if (!linklist.length) {
            source.dbLinkId = 'Not selected'
            source.selectDaid = 'Not selected'
            return
          }
          this.dbLinks = linklist.map((item, index) => {
            return {
              name: item.basename,
              value: item.baseid
            }
          })
          if (source.dbLinkId === 'Not selected') {
            source.dbLinkId = this.dbLinks[0].value
          }
          resolve()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .show-custom {
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
