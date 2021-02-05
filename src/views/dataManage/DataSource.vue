<template lang="pug">
  .dataopt
    DataPopup(v-if="showAddPopup", :editData="editData", @close="showAddPopup=false")
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
                .class-btn(:class="{active: dataTypeActive === item.type}", @click="changeDataType(item.type)") {{item.name}}
          .general-item.classes
            .left 分类:
            .right
              .type-item
                .class-btn(:class="{active: dataActive === 'all'}", @click="changeType('all')") 全部
              .type-item(v-for="(item,index) in type" :key="index")
                .class-btn(:class="{active: dataActive === item.screenname}", @click="changeType(item.screenname)") {{item.screenname}}
        .dbopt-content-header
          .add-new-btn(@click="addNewData") 新建
          ContactSearch(v-model="searchWord" placeholder="请输入搜索词" @onQuerySearch="querySearch" @onSelectItem="selectItem")
        .content-box
          .content-wp
            table.table-box.table-list(v-if="dataList && dataList.length")
              thead.list-header
                tr
                  td.db-name 数据名称
                  td.type 数据类型
                  td.time 修改时间
                  td.class 行业分类
                  td.remark 备注
                  td.option 操作
              tbody.list-body
                tr(v-for="(item, index) in dataList" :key="index")
                  td.db-name
                    .name
                      .icon &#xe629;
                      .text {{item.dataname}}
                  td.type {{item.datatype}}
                  td.time {{item.createtime}}
                  td.class {{item.cid}}
                  td.remark(contenteditable, @blur="changeRemark($event, item)") {{item.remark}}
                  td.option
                    .operate
                      .operate-item(@click="editItem(item)") 修改
                      .operate-item(@click="deleteItem(item.daid)") 删除
            Nodata(v-else)
          Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>

<script>
import { Storage, Lodash } from '@public/utils'
import {
  GET_DATA,
  SEARCH_DATA,
  DELETE_DATA,
  MODIFY_REMARK
} from '@api/datasrc.js'
export default {
  data () {
    return {
      navList: [
        {
          text: '数据管理'
        },
        {
          text: '数据管理'
        }
      ],
      type: [],
      dataType: [],
      dataActive: 'all',
      dataTypeActive: 'all',
      loading: true,
      currentPage: 1,
      showAddPopup: false,
      dataList: [],
      pageSize: 20,
      total: 0,
      pages: 1,
      editData: null,
      searchWord: '',
      searchList: []
    }
  },
  created () {
    this.getDatabse()
  },
  activated () {
    this.$route.meta.isActive && this.getDatabse()
    this.$route.meta.isActive = true
  },
  mounted () {
    // 关闭Popup
    this.$eventBus.$on('CLOSE_DATAPOPUP', (val) => {
      this.showAddPopup = val
      Storage.session.clear()
      this.getDatabse()
    })
  },
  methods: {
    // 获取联想词
    getSaerchWord () {
      return new Promise(resolve => {
        SEARCH_DATA({searchWord: this.searchWord, datatype: this.dataTypeActive, cid: this.dataActive}).then((value) => {
          this.searchList = value.data.map(item => {
            return {
              value: item
            }
          })
          resolve()
        })
      })
    },
    // 显示
    async querySearch (queryString, callback) {
      this.searchWord = queryString
      await this.getSaerchWord()
      callback(this.searchList)
      this.pages = 1
      this.getDatabse()
    },
    // 获取列表
    getDatabse () {
      let params = {
        datatype: this.dataTypeActive,
        cid: this.dataActive,
        searchword: this.searchWord,
        currentPage: this.pages,
        pageSize: this.pageSize
      }
      GET_DATA(params).then((value) => {
        if (!value.err) {
          this.type = value.cid
          this.dataList = value.datalist
          this.dataType = value.datatype
          this.total = value.total
        }
        this.loading = false
      })
    },
    // 数据类型
    changeDataType (val) {
      this.dataTypeActive = val
      this.pages = 1
      this.getDatabse()
    },
    // 分组
    changeType (val) {
      this.dataActive = val
      this.pages = 1
      this.getDatabse()
    },
    selectItem (item) {
      this.searchWord = item.value
      this.searchList = []
      // this.getDatabse()
    },
    // 删除
    deleteItem (daid) {
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        DELETE_DATA({daid}).then((value) => {
          console.log('删除数据:', value)
          if (!value.err) {
            this.$toasting({
              type: 'success',
              title: '成功',
              message: value.data
            })
            this.getDatabse()
          }
        })
      })
    },
    pageChange (page) {
      this.pages = page
      this.getDatabse()
    },
    // 修改
    editItem (item) {
      this.editData = item
      this.showAddPopup = true
    },
    // 新建
    addNewData () {
      this.editData = null
      this.showAddPopup = true
    },
    // 备注
    changeRemark (e, item) {
      let params = {
        id: item.daid,
        type: 2,
        remark: e.target.innerHTML
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
      this.getDatabse()
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
  .dataopt {
    position: relative;
    height: 100%;
    .page-box {
      position: absolute;
      bottom: 20px;
      right: 0;
    }
    /deep/ .data-wp .popup-content-box {
      width: 600px;
      height: 600px;
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
  .dbopt-content-header {
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
      max-width: 300px;
      width: 100%;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
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
