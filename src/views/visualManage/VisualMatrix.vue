<template lang="pug">
  .matrix
    Release(v-if="show", :id="id", :screenData="screenData", @close="show = false")
    //- 创建矩阵
    Modal.create-matrix(:show="isCreate", @close="isCreate = false", @confrim="createMatrix", text="创建矩阵")
      //- 用户编辑
      .select.inputs-item
        .text-bar
          span.important.icon &#xe69b;
          span.content-text 请选择所属分类:
        Selection(v-model="cateSelected", :option="cateList", :width="350")
      //- 文本输入
      .text.inputs-item
        .text-bar
          span.important.icon &#xe69b;
          span.content-text 请输入大屏名称:
        input.input(v-model="matrixName")
    Loading(v-if="loading")
    template(v-else)
      BreadCrumbs
      .main-container
        .general-item.clearfloat(:class="{'fit-content': fitcontent}")
          .left 分类:
          .right
            .type-item(:class="{active: cateType === 0}", @click="chageCate()") 全部
            .type-item(v-for="item in cateList",
              :class="{active: cateType === item.value}",
              @click="chageCate(item.value)") {{item.name}}
          .expend(@click="fitcontent = !fitcontent")
            .icon &#xe683;
        .option-header(key="content-top")
            ButtonNormal.add-new-button(@onClick="isCreate=true", icon="&#xe637;", text="+ 新建", key="add-screen")
            .tool
              Selection.sort-menu(:option="sortoptions", :width="200", v-model="order", @onChange="chageOrdSort")
              SearchBox(v-model="searchWord", :width="200", @onSearch="searchScreen",  placeholder="请输入可视化矩阵名称")
        .content-box
          .screen-card-list(v-if="matrixList.length > 0")
            ScreenCard(v-for="item in matrixList",
              :key="item.id",
              :item="item",
              :showtop="['preview']",
              type="matrix",
              @onClick="openMatrix(item.id)",
              @changeShow="changeShow(item)")
              TooltipBox(:content="'删除'")
                .icon(@click="delScreen(item.id)") &#xe61c;
          Nodata(v-else)
          Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>

<script>
import { Utils, Lodash } from '@public/utils'
import {
  GET_MATRIX_LIST,
  ADD_MATRIX,
  DELETE_MATRIX,
  GET_CATE_LIST
} from '@api/visualrelated.js'
export default {
  data () {
    return {
      currentPage: 1,
      total: 0,
      pageSize: 20,
      fitcontent: false,
      navList: [
        {
          text: '我的可视化'
        },
        {
          text: '大屏矩阵'
        }
      ],
      show: false,
      id: 0,
      screenData: null,
      loading: true,
      isCreate: false,
      cateSelected: 1,
      matrixName: '',
      cateType: 0,
      matrixList: [],
      cateList: [],
      order: 'name',
      searchWord: '',
      sortoptions: [
        {
          name: '按名称排序',
          value: 'name'
        },
        {
          name: '按创建时间排序',
          value: 'createTime'
        },
        {
          name: '按修改时间排序',
          value: 'updatetime'
        }
      ]
    }
  },
  created () {
    this.getMatrixList()
    this.getCateList()
  },
  activated () {
    this.$route.meta.isActive && this.getMatrixList()
    this.$route.meta.isActive = true
  },
  methods: {
    // 获取分类
    getCateList () {
      GET_CATE_LIST().then(result => {
        this.cateList = result.map(item => {
          return {name: item.screenname, value: item.sid}
        })
        this.cateSelected = this.cateList[0].value
      })
    },
    // 分页
    pageChange (page) {
      this.currentPage = parseFloat(page)
      this.getMatrixList()
    },
    enBase64: Utils.enBase64,
    openMatrix (id) {
      const { href } = this.$router.resolve({
        name: 'editMatrix',
        path: '/editMatrix',
        params: {
          id: this.enBase64(id)
        }
      })
      Utils.openURL(href, '_blank')
    },
    changeShow (item) {
      this.show = true
      this.screenData = item
      this.id = item.id
    },
    // 获取矩阵
    getMatrixList () {
      let params = {
        sid: this.cateType,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.searchWord && (params.searchword = this.searchWord)
      this.order && (params.order = this.order)
      GET_MATRIX_LIST(params).then(result => {
        this.loading = false
        if (result.err) return
        let resData = result.data
        this.matrixList = resData.list
        this.total = resData.total
      })
    },
    // 创建矩阵
    createMatrix () {
      let params = {
        sid: this.cateSelected,
        name: this.matrixName
      }
      ADD_MATRIX(params).then(value => {
        if (!value.err) {
          this.isCreate = false
          this.matrixName = ''
          this.getMatrixList()
          // 去编辑
          this.openMatrix(value.data.id)
          this.$toasting({
            type: 'success',
            title: '成功',
            message: '创建成功!'
          })
        }
      })
    },
    // 删除
    delScreen (id) { // 显示删除屏幕提示框
      // 显示删除提示框
      this.$alert({type: 'warning', msg: '确定要删除大屏吗?'}, () => {
        DELETE_MATRIX({id}).then((response) => {
          if (!response.err) {
            this.getMatrixList()
            this.$toasting({
              type: 'success',
              title: '成功',
              message: '删除成功!'
            })
          }
        })
      })
    },
    // 分类
    chageCate (val = 0) {
      this.cateType = val
      this.getMatrixList()
    },
    // 搜索
    searchScreen (val) {
      this.searchWord = val
    },
    // 排序
    chageOrdSort (val) {
      this.order = val
      this.getMatrixList()
    },
    watchSearchword: Lodash.debounce(function () {
      console.log('searchword发生变化')
      this.getMatrixList()
    }, 600, {leading: false})
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
  .fit-content {
    height: auto !important;
  }
  .matrix {
    height: 100%;
    .icon {
      cursor: pointer;
      color: #666666;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      user-select: none;
      &:hover {
        color: #219af2;
      }
    }
  }
  .create-matrix {
    /deep/ .modal-box {
      min-height: 275px;
    }
  }
  .matrix {
    position: relative;
    height: 100%;
    .option-header{
      height: 30px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tool {
        display: flex;
        align-items: center;
      }
      .add-new-button{
        width: 70px;
      }
      .sort-menu{
        margin-right: 20px;
      }
    }
    .screen-card-list {
      position: absolute;
      overflow: auto;
      width: 100%;
      height: calc(100% - 70px);
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
    }
  }
  .general-item {
    padding:0 10px;
    height: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    background: #FFFFFF;
    position: relative;
    overflow: hidden;
    max-height: 200px;
    transition: all .3s;
    .left {
      float: left;
      font-size: 12px;
      line-height: 40px;
      align-items: center;
      color: rgba(0,0,0,0.85);
      width: 30px;
    }
    .right {
      float: left;
      padding: 0 20px;
      display: flex;
      align-items: center;
      min-height: 40px;
      width: calc(100% - 80px);
      flex-wrap: wrap;
    }
    &.fit-content .expend .icon {
      transform: rotate(180deg);
    }
    .expend {
      float: left;
      width: 50px;
      height: 40px;
      line-height: 40px;
      color: #1890ff;
      font-size: 10px;
      cursor: pointer;
      text-align: right;
      .icon {
        transition: all .3s;
        width: 20px;
        height: 20px;
        line-height: 20px;
      }
    }
    .type-item {
      color: rgba(0, 0, 0, 0.65);
      font-size: 12px;
      margin: 10px;
      border-radius: 2px;
      cursor: pointer;
      line-height: 20px;
      height: 20px;
      padding: 0 5px;
    }
    .active {
      color: #ffffff;
      padding: 2px 8px;
      background-color: #219af2;
    }
  }
  .content-box {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    padding-bottom: 20px;
  }
  .inputs-item {
    width: 100%;
    margin: 0 auto;
    .text-bar {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: left;
      margin: 10px 0;
      font-size: 12px;
      color: #666666;
      .important {
        text-align: center;
        color: #ff0000;
        width: 5px;
        height: 5px;
        line-height: 5px;
        margin-right: 10px;
        font-size: 10px;
        transform: scale(0.7);
      }
      .content-text {
        height: 30px;
        line-height: 30px;
        color: #666666;
        font-size: 14px;
      }
    }
    .input {
      height: 30px;
      line-height: 30px;
      border-radius: 0;
      width: 350px;
      font-size: 12px;
      background:rgba(0,53,103,1);
      border:1px solid rgba(0,71,157,1);
      outline: none;
      color: rgba(255,255,255,.8);
      text-indent: 1em;
      &:focus{
        border: 1px solid #219AF2;
      }
    }
  }
  .page-box {
    height: 50px;
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
