<template lang="pug">
  .dblink
    LinkPopup(v-if="showAddPopup", :editData="editData", @close="closePopup")
    Loading(v-if="loading")
    template(v-else)
      BreadCrumbs
      .main-container
        .general-box
          .general-item
            .left 数据:
            .right
              .type-item
                .class-btn(:class="{active: dataTypeActive === 'all'}", @click="changeDataType('all')") 全部
              .type-item(v-for="(item,index) in dataType", :key="index")
                .class-btn(:class="{active: dataTypeActive === item.type}", @click="changeDataType(item.type)") {{item.databasesname}}
          .general-item.classes
            .left 分类:
            .right
              .type-item
                .class-btn(:class="{active: dataActive === 'all'}", @click="changeType('all')") 全部
              .type-item(v-for="(item,index) in type" :key="index")
                .class-btn(:class="{active: dataActive === item.sid}", @click="changeType(item.sid)") {{item.screenname}}
        .dblink-content-header
          .add-new-btn(@click="addNewData") 新建
          ContactSearch(v-model="searchWord" placeholder="请输入搜索词" @onQuerySearch="querySearch" @onSelectItem="selectItem")
        .content-box
          .content-wp
            table.table-box.table-list(v-if="dataList && dataList.length")
              thead.list-header
                tr
                  td.db-name 数据名称
                  td.type 服务地址
                  td.time 修改时间
                  td.class 行业分类
                  td.datatype 数据类型
                  td.remark 备注
                  td.option 操作
              tbody.list-body
                tr(v-for="(item,index) in dataList" :key="index")
                  td.db-name
                    .name
                      .icon &#xe629;
                      .text {{item.basename}}
                  td.type {{hostname(item) | strFormat}}
                  td.time {{item.createtime | strFormat}}
                  td.class {{currcate(item) | strFormat}}
                  td.datatype  {{currdatatype(item) | strFormat}}
                  td.remark(contenteditable, @blur="changeRemark($event, item)") {{item.remark}}
                  td.option
                    .operate
                      .operate-item(@click="editItem(item)") 修改
                      .operate-item(@click="deleteItem(item.baseid)") 删除
            Nodata(v-else)
        Paging.page-box(v-if="total > 10", :page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>

<script>
import { Utils, Lodash } from '@public/utils'
import {
  GET_DATABASE,
  SEARCH_DATABASE,
  DELETE_DATABASE,
  MODIFY_REMARK
} from '@api/datasrc.js'
export default {
  data () {
    return {
      type: [],
      dataType: [],
      dataActive: 'all',
      dataTypeActive: 'all',
      loading: true,
      currentPage: 1,
      pageSize: 20,
      showAddPopup: false,
      dataList: [],
      total: 0,
      editData: null,
      searchWord: '',
      searchList: []
    }
  },
  created () {
    this.getDataList()
  },
  activated () {
    this.$route.meta.isActive && this.getDataList()
    this.$route.meta.isActive = true
  },
  methods: {
    // 获取联想词
    getSaerchWord () {
      return new Promise(resolve => {
        SEARCH_DATABASE({searchword: this.searchWord, stype: this.dataTypeActive, sid: this.dataActive}).then((value) => {
          this.searchList = value.data.map(item => {
            return {
              value: item
            }
          })
          resolve()
        })
      })
    },
    async querySearch (queryString, callback) {
      this.searchWord = queryString
      await this.getSaerchWord()
      callback(this.searchList)
      this.getDataList()
      this.currentPage = 1
      this.getDataList()
    },
    hostname (item) {
      // if (!Utils.isJsonString(item.baseconfig)) return ''
      // let baseconfig = JSON.parse(item.baseconfig)
      return item.baseconfig.hostname
    },
    currcate (item) {
      return this.type.filter(obj => {
        if (item.sid === obj.sid) {
          return obj
        }
      })[0].screenname
    },
    currdatatype (item) {
      // if (!Utils.isJsonString(item.baseconfig)) return ''
      // let baseconfig = JSON.parse(item.baseconfig)
      return item.baseconfig.type
    },
    closePopup () {
      this.showAddPopup = false
      this.getDataList()
    },
    // 获取数据列表
    getDataList () {
      let params = {
        stype: this.dataTypeActive,
        sid: this.dataActive,
        searchword: this.searchWord,
        currentPage: this.currentPage
      }
      GET_DATABASE(params).then((value) => {
        if (!value.err) {
          this.type = value.cate
          this.dataType = value.databases
          this.dataList = value.data
          this.total = value.total
        }
        this.loading = false
      })
    },
    selectItem (item) {
      this.searchWord = item.value
      this.searchList = []
      this.getDataList()
    },
    changeList () {
      this.searchList = []
      this.getDataList()
    },
    changeDataType (type) {
      this.dataTypeActive = type
      this.currentPage = 1
      this.getDataList()
    },
    changeType (sid) {
      this.dataActive = sid
      this.currentPage = 1
      this.getDataList()
    },
    // 删除列表
    deleteItem (baseid) {
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        DELETE_DATABASE({baseid}).then((value) => {
          console.log('删除数据:', value)
          if (!value.err) {
            this.$toasting({
              type: 'success',
              title: '成功',
              message: value.data
            })
            this.getDataList()
          }
        })
      })
    },
    pageChange (page) {
      this.currentPage = page
      this.getDataList()
    },
    // 修改
    editItem (item) {
      this.editData = item
      this.showAddPopup = true
    },
    addNewData () {
      this.editData = null
      this.showAddPopup = true
    },
    changeRemark (e, item) {
      const text = e.target.outerText
      let params = {
        id: item.baseid,
        type: 1,
        remark: text
      }
      MODIFY_REMARK(params).then(value => {
        if (!value.err) {
          this.$toasting({
            type: 'success',
            title: '成功',
            message: value.data
          })
        }
      })
    },
    watchSearchword: Lodash.debounce(function () {
      this.getDataList()
    }, 300, {leading: false})
  },
  watch: {
    searchWord: {
      handler (n, o) {
        if (n === o) return
        this.searchWord = n
        this.watchSearchword()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .dblink {
    position: relative;
    height: 100%;
    .page-box {
      position: absolute;
      bottom: 20px;
      right: 0;
    }
  }
  .general-box {
    min-height:120px;
    margin-top: 20px;
    padding-left: 20px;
    background:rgba(24,144,255,0.05);
    .general-item {
      min-height: 60px;
      position: relative;
      display: flex;
      transition: all .3s;
      &.classes .right{
        flex-wrap: wrap;
      }
      .left {
        font-size: 14px;
        line-height: 60px;
        color: #ffffff;
        width: 50px;
      }
      .right {
        display: flex;
        flex: 1;
        align-items: center;
        .type-item {
          height: 60px;
          margin-right:10px;
          display: flex;
          align-items: center;
          .class-btn {
            color:rgba(255,255,255,.8);
            font-size: 14px;
            cursor: pointer;
            line-height: 24px;
            height: 24px;
            padding: 0 5px;
            &.active {
              color:rgba(24,144,255,1);
              background: url(~@assets/img/class-active.png) center center no-repeat;
              background-size: 100% 24px;
            }
          }
          
        }
      }
    }
  }
  .dblink-content-header {
    margin: 20px 0;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .add-new-btn {
      width:80px;
      height:30px;
      background:rgba(24,145,255,0.5);
      border:1px solid rgba(0, 174, 255, 1);
      line-height: 30px;
      text-align: center;
      user-select: none;
      cursor: pointer;
      font-size:14px;
      color:rgba(255,255,255,0.8);
    }
  }
  .content-box {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    padding-bottom: 50px;
    overflow: hidden;
    .content-wp {
      overflow: auto;
      height: 100%;
    }
  }
  .table-box {
    position: relative;
    .remark {
      max-width: 30%;
    }
    .name {
      display: flex;
      line-height: 46px;
      .icon {
        color: #009BF9;
        margin-right: 10px;
      }
      .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .operate {
      min-width: 100px;
      display: flex;
      justify-content: flex-end;
      .operate-item {
        color: #258AD7;
        cursor: pointer;
        margin-left: 15px;
        line-height: 40px;
        font-size: 12px;
      }
    }
  }
</style>
