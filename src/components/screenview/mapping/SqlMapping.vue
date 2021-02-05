<template lang="pug">
  //- dbbase数据源
  .SQL
    LinkPopup(v-if="showAddPopup", @close="showAddPopup = false")
    //- 数据连接 
    .conf-item
      .fileid-content 选择数据库链接
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
      .fileid-content 选择数据源
      .fileid-content
        Selection(v-if="!isnotSelect",
          v-model="value.source.selectDaid",
          :option="dataUsed",
          @onChange="changeSql",
          :width="210")
        <div v-else class="not-select">暂无数据源, 点击[<b>新建</b>]按钮添加</div>
        .create-data(@click="createAdd") 新建
    //- 数据展示
    .conf-item(v-if="!isnotSelect")
      .fileid-content 输入SQL语句
      .fileid-content
        //- Editer(v-model="value.source.sqlstr", :config="editerConf")
        .show-sql
          MonacoEditer(v-model="value.source.sqlstr" :editorOptions="{ language: 'sql'}")
</template>
<script>
import chartmapping from '@public/mixin/chartmapping'
import {
  GET_SQL_CUS_SRC
} from '@api/visualscreen.js'
import {
  GET_DATABASE
} from '@api/datasrc.js'
import { mapState } from 'vuex'
export default {
  mixins: [chartmapping],
  data () {
    return {
      // 没有数据源
      isnosrc: false,
      editerConf: {
        lang: 'sql',
        width: '260px',
        height: '400px'
      },
      // 数据连接
      dbLinks: [],
      showAddPopup: false
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
    // 改变sqlstr
    changeSql (o) {
      let arr = this.dataUsed.filter(item => {
        return item.value === o
      })
      if (arr.length > 0) this.value.source.sqlstr = arr[0].returnsql
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
            source.sqlstr = ''
            return
          }
          this.dataUsed = srclist.map((item, index) => {
            return {
              name: item.dataname,
              value: item.daid,
              returnsql: item.returnsql
            }
          })
          if (source.selectDaid === 'Not selected') {
            source.selectDaid = this.dataUsed[0].value
            source.sqlstr = this.dataUsed[0].returnsql
          }
          resolve()
        })
      })
    },
    // 获取数据库连接
    getSqlLinks () {
      return new Promise((resolve, reject) => {
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
  .show-sql {
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
