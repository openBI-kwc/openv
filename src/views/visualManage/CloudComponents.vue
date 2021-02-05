// 云组件中心
<template lang="pug">
  .clound-component
    Loading(v-if="loading")
    template(v-else)
      BreadCrumbs
      .main-container
        .header
          .btn
            span 上传
            input(type="file" @change="uploadFile")
          .tool-box
            .search-box
              .search-icon.icon &#xe643;
              input.search-input(placeholder="搜索" v-model="searchWd")
            Selection(v-model="order", :width="200", :option="sortoptions", @onChange="chageOrder")
        .content-box
          .content-wp
            table.table-box.table-list(v-if="pluginList && pluginList.length")
              thead.list-header
                tr
                  td 组件ID
                  td 上传时间
                  td 开发时间
                  td 版本号
                  td 初始化方法
                  td 组件描述
                  td.option 操作
              tbody.list-body
                tr(v-for="(item, index) in pluginList" :key="item.id")
                  td {{item.name}}
                  td {{item.create_time}}
                  td {{item.info.moduleTime}}
                  td {{item.info.moduleVersion}}
                  td {{item.info.moduleMethodName}}
                  td {{item.info.moduleDesc}}
                  td.option
                    .operate
                      .operate-item(@click="download(item)") 下载
                      .operate-item(@click="preview(item)") 预览
                      .operate-item(@click="deleteItem(item)") 删除
            Nodata(v-else)
          Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>
<script>
import { UPLOAD_COUNLD, GET_COUNLD_LIST, UPDATE_PLUGIN, DEL_PLUGIN, LOAD_PLUGIN } from '@api/colund'
import { Utils, Lodash as _ } from '@public/utils'
import { mapState } from 'vuex'
const { openURL, formParams } = Utils
export default {
  data () {
    return {
      // 插件列表
      pluginList: [],
      // 分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 加载
      loading: true,
      searchWd: '',
      // 排序
      order: 'name',
      sortoptions: [
        {
          name: '按名称排序',
          value: 'name'
        },
        {
          name: '按创建时间排序',
          value: 'create_time'
        }
      ]
    }
  },
  created () {
    this.getPlugs()
  },
  activated () {
    this.$route.meta.isActive && this.getPlugs()
    this.$route.meta.isActive = true
  },
  computed: {
    ...mapState(['setting'])
  },
  watch: {
    searchWd: {
      handler (n, o) {
        if (n === o) return
        this.searchWd = n
        this.watchSwd()
      }
    }
  },
  methods: {
    // 搜索词改变
    watchSwd: _.debounce(function () {
      this.getPlugs()
    }, 1000),
    // 排序切换
    chageOrder (val) {
      this.order = val
      this.getPlugs()
    },
    // 翻页
    pageChange (page) {
      this.currentPage = parseFloat(page)
      this.getPlugs()
    },
    // 上传
    uploadFile (event) {
      let params = formParams(event, 'file')
      // 发送请求
      UPLOAD_COUNLD(params).then((res) => {
        if (!res.err) {
          this.$toasting({
            type: 'success',
            title: '提示',
            message: '云组件上传成功'
          })
          this.getPlugs()
        }
      })
    },
    // 下载
    download (item) {
      LOAD_PLUGIN({id: item.id}).then(res => {
        // if (res.err) return
      })
    },
    // 预览
    preview (item) {
      const { pluginPath, info } = item
      if (!info.modulePreview) return
      let url = this.setting.server + pluginPath + '/' + info.modulePreview
      openURL(url, '_blank')
    },
    // 删除
    deleteItem (item) {
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        DEL_PLUGIN({pluginIds: [item.id]}).then(res => {
          if (res.err) return
          this.getPlugs()
        })
      })
    },
    // 获取插件列表
    getPlugs () {
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        name: this.searchWd,
        sortField: this.order
      }
      GET_COUNLD_LIST(params).then(res => {
        if (res.err) return
        const { result, sum_count } = res.data
        this.pluginList = result
        this.total = sum_count
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .clound-component {
    position: relative;
    height: 100%;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height:30px;
    margin-top: 20px;
    margin-bottom: 20px;
    .tool-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height:30px;
      .search-box {
        border-bottom: 1px solid #2e3e50;
      }
    }
    .btn {
      position: relative;
      width:80px;
      height:30px;
      line-height:30px;
      background:rgba(24,145,255,0.5);
      border:1px solid rgba(0, 174, 255, 1);
      text-align: center;
      user-select: none;
      cursor: pointer;
      font-size:14px;
      color:rgba(255,255,255,0.8);
      input {
        cursor: pointer;
        display: block;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 9;
        position: absolute;
        left: 0;
        top: 0;
      }
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
