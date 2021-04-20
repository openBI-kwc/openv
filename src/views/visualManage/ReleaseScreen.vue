<template lang="pug">
  .myrelease
    Loading(v-if="loading")
    template(v-else)
      BreadCrumbs
      .main-container
        .option-header
          .button-group
            button.btn.export-button(v-if="releaseList.length" @click="downLocalDep" :disabled="exporting" :class="{'disabled': exporting }")
              .fa.fa-spinner.fa-pulse(v-if="exporting")
              |导出本地部署大屏
            .btn.cancel-button(v-if="checkedList.length > 0", @click="cancelShare") 取消发布
          .options
            .search-box
              .search-icon.icon &#xe643;
              input.search-input(placeholder="请输入搜索内容" v-model="searchWord")
            Selection.order-menu(v-model="order" :option="sortoptions", @onChange="orderSortList")
        .content-box
          .content-wp
            table.table-box.table-list(v-if="releaseList.length")
              thead.list-header
                tr
                  td.check
                    CheckBox(:size="12", :value="checkedAll", @input="changeAllchecked")
                  td.name 屏幕名称
                  td.count 浏览次数
                  td.extype 是否过期
                  td.time 分享时间
                  td.effective 有效期
                  td.class 所属分类
              tbody.list-body(v-for="(item, index) in releaseList", :key="index")
                tr.link-wp(@click.stop="changeChecked(item)")
                  td.check
                    CheckBox(:size="12", :value="item.checked", @input="changeChecked(item)")
                  td.name
                    .is-pwd.icon(v-if="item.is_pwd") &#xe612;
                    .text {{item.sname}}
                  td.count {{item.viewsnum}}
                  td.extype {{item.extype ? '已过期' : '未过期'}}
                  td.time {{item.createtime}}
                  td.effective {{item.expiredate}}
                  td.class {{item.ptype}}
                tr.opentrs(v-show="item.checked")
                  td(colspan="7")
                    .sharelink(:class="{'active': item.checked}", v-show="item.checked")
                      span.sitem.link
                        span.sname 链接:
                        a.text(:href="item.devlink || item.link", target="_blank") {{item.link}}
                      span.sitem.pwd(v-if="item.is_pwd")
                        span.sname 密码:
                        span.text {{item.password}}
                      span.copybtn(@click="copyShare(item)") 分享
            Nodata(v-else)
          Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>

<script>
import { Lodash, CopyToClipboard, Utils } from '@public/utils'
import { LOCAL_DEPLOY } from '@api/visualscreen.js'
import { GET_RELEASE, DELETE_RELEASE } from '@api/visualrelated.js'
export default {
  data () {
    return {
      exporting: false,
      // 所有发布的大屏列表
      releaseList: [],
      loading: true,
      pageSize: 20,
      total: 0,
      currentPage: 1,
      searchWord: '',
      order: 'sname',
      checkedAll: false,
      sortoptions: [
        {
          name: '按名称排序',
          value: 'sname'
        },
        {
          name: '按创建时间排序',
          value: 'createtime'
        }
      ]
    }
  },
  created () {
    this.getReleaseList()
  },
  activated () {
    this.$route.meta.isActive && this.getReleaseList()
    this.$route.meta.isActive = true
  },
  computed: {
    // 全选的数据项
    checkedList () {
      return this.releaseList.filter(item => {
        return item.checked
      }).map(item => {
        return item.scid
      }) || []
    }
  },
  methods: {
    // 现在本地部署的静态文件
    downLocalDep () {
      this.exporting = true
      LOCAL_DEPLOY().then(res => {
        this.exporting = false
        if (res.err) return
        Utils.openURL(res.data, '_self')
      })
    },
    // 全选状态
    changeAllchecked () {
      this.checkedAll = !this.checkedAll
      this.releaseList.forEach(item => {
        item.checked = this.checkedAll
      })
    },
    changeChecked (item) {
      item.checked = !item.checked
      for (let item of this.releaseList) {
        if (!item.checked) {
          this.checkedAll = false
          break
        } else {
          this.releaseList.length > 1 && (this.checkedAll = true)
        }
      }
    },
    selectItem (item) {
      item.checked = !item.checked
    },
    // 获取数据列表
    getReleaseList () {
      let params = {
        currentPage: this.currentPage,
        searchword: this.searchWord,
        order: this.order
      }
      GET_RELEASE(params).then((value) => {
        if (value.err) return
        this.releaseList = value.data.map(item => {
          item.checked = false
          const isproduction = process.env.NODE_ENV === 'production'
          if (!isproduction) item.devlink = '/' + new URL(item.link).hash
          return item
        })
        this.total = value.total
        this.loading = false
      })
    },
    // 排序
    orderSortList (val) {
      this.order = val
      this.getReleaseList()
    },
    // 取消发布
    cancelShare () {
      if (!this.checkedList.length) return
      this.$alert({type: 'warning', msg: '确定要取消发布吗'}, () => {
        this.checkedAll = false
        DELETE_RELEASE({pid: this.checkedList.toString()}).then((value) => {
          if (!value.err) {
            this.$toasting({
              type: 'success',
              title: '成功',
              message: '取消成功！'
            })
            this.getReleaseList()
          }
        })
      })
    },
    pageChange (page) {
      this.currentPage = page
      this.getReleaseList()
    },
    // 复制
    copyShare (item) {
      let name = '北京格胜数维可视化\n'
      let link = `链接: \n${item.link}\n`
      let pwd = ''
      if (item.password) {
        pwd = `密码：\n${item.password}\n`
      }
      let share = name + link + pwd
      CopyToClipboard(share)
      this.$toasting({
        type: 'success',
        title: '提示',
        message: '复制成功！'
      })
    },
    watchSearchword: Lodash.debounce(function () {
      this.getReleaseList()
    }, 600, {leading: false})
  },
  watch: {
    searchWord: {
      handler (n, o) {
        this.watchSearchword()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .flex(@justify) {
    display: flex;
    align-items: center;
    justify-content: @justify;
  }
  .myrelease {
    position: relative;
    height: 100%;
  }
  .content-box {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    overflow: hidden;
    .content-wp {
      overflow: auto;
      height: calc(100% - 70px);
    }
  }
  .option-header{
    height: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
    .button-group {
      float: left;
      .flex(flex-start);
    }
    .btn {
      padding: 0 10px;
      height:30px;
      line-height: 30px;
      text-align: center;
      background:rgba(24,145,255,0.5);
      border:1px solid rgba(0, 174, 255, 1);
      font-size:14px;
      font-weight:400;
      color:rgba(255,255,255,.8);
      cursor: pointer;
    }
    .cancel-button {
      margin-left: 20px;
    }
    .export-button {
      .flex(flex-start);
      &.disabled {
        background: rgba(153, 153, 153, .2);
        cursor: not-allowed;
      }
      .fa-spinner {
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 22px;
        color: #219af2;
      }
    }
    .options {
      float: right;
      .flex(flex-end);
      .search-box {
        border-bottom:1px solid #203355;
        &:focus-within {
          border-bottom:1px solid rgba(24,144,255,1);
        }
      }
    }
  }
  .table-box {
    position: relative;
    .check {
      width: 100px;
    }
    .link-wp {
      cursor: pointer;
      .name {
        position: relative;
        .is-pwd {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-100%, -50%);
          width: 22px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          color: #1891ff;
        }
      }
    }
    .sharelink {
      display: flex;
      align-items: center;
      width: 100%;
      .copybtn {
        margin-left: 20px;
        cursor: pointer;
        user-select: none;
        font-size: 12px;
        color: rgba(24, 144, 255, 0.6);
        text-align: center;
      }
      .sitem {
        font-size: 12px;
        .sname {
          margin-right: 10px;
        }
        .text {
          color: #258AD7;
        }
        &.pwd {
          margin-left: 10px;
        }
        &.link .text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .page-box {
    position: absolute;
    bottom: 20px;
    right: 0;
  }
</style>
