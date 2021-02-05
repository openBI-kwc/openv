<template lang="pug">
  .picture-box
    Loading(v-if="loading")
    template(v-else)
      BreadCrumbs
      .main-container
        template(v-if="imgList.length > 0")
          .tool-bar
            template(v-if="isBatch")
              .p-btn(@click="canIsBatch(false)") 取消
              .p-btn(@click="delMoreImg") 批量删除
              .check-box
                CheckBox.chjeck(:value="isCheckAll", @input="checkAll" :size="15")
                .text 全选
            .p-btn(v-else, @click="isBatch = true") 批量删除
          .img-box(ref="ImgBox")
            .img-item(v-for="(item, ind) in imgList", :key="ind")
              .mask(v-if="isBatch")
              img.view-img(:img-url="setting.server + item.url" :src="setting.server + item.waterurl" v-imgerror="'imgerror'")
              CheckBox.check-icon(:value="item.isCheck", :size="12", @input="selectItem(item)" v-if="isBatch")
              .icon.del-button(@click="deleteItem([item.upid])" v-if="!isBatch") &#xe69a;
        Nodata(v-else)
        Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>

<script>
import { mapState } from 'vuex'
import 'viewerjs/dist/viewer.css'
import Viewer from 'viewerjs'
import {
  GET_ATTLIST,
  DEL_ATTLIST
} from '@api/system.js'
export default {
  data () {
    return {
      loading: true,
      isCheckAll: false,
      isBatch: false,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      imgList: [],
      Vieweror: null
    }
  },
  created () {
    this.getAttList()
  },
  activated () {
    this.$route.meta.isActive && this.getAttList()
    this.$route.meta.isActive = true
  },
  deactivated () {
    if (this.Vieweror && this.Vieweror.destroy) {
      this.Vieweror.destroy()
      this.Vieweror = null
    }
  },
  computed: {
    ...mapState({
      setting: state => state.setting
    }),
    checkedImgs () {
      return this.imgList.filter(item => {
        if (item.isCheck) return item
      }).map(item => {
        return item.upid
      })
    }
  },
  methods: {
    canIsBatch (type = true) {
      this.isBatch = type
      if (!type) {
        this.imgList = this.imgList.map(item => { 
          item.isCheck = false
          return item
        })
      }
    },
    initViewer () {
      if (this.Vieweror && this.Vieweror.destroy) {
        this.Vieweror.destroy()
      }
      const ViewerDom = this.$refs['ImgBox']
      if (!ViewerDom) return
      this.Vieweror = new Viewer(ViewerDom, {url: 'img-url'})
    },
    getAttList () {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      GET_ATTLIST(params).then((result) => {
        if (result.err) return
        this.loading = false
        this.imgList = result.data.list.map(item => {
          item.isCheck = false
          return item
        })
        this.total = result.data.total
        this.$nextTick(() => {
          this.initViewer()
        })
      })
    },
    delMoreImg () {
      if (!(this.checkedImgs.length > 0)) {
        return this.$toasting({
          type: 'info',
          message: '请选择要删除的附件'
        })
      }
      this.deleteItem(this.checkedImgs)
    },
    checkAll (isCheck) {
      this.isCheckAll = isCheck
      this.imgList = this.imgList.map(item => { 
        item.isCheck = isCheck
        return item
      })
    },
    selectItem (item) {
      item.isCheck = !item.isCheck
    },
    deleteItem (upid) {
      this.$alert({type: 'warning', msg: '确定要删除吗!'}, () => {
        this.isBatch = false
        DEL_ATTLIST({ upid }).then((res) => {
          this.currentPage = 1
          this.getAttList()
        })
      })
    },
    pageChange (page) {
      this.currentPage = parseFloat(page)
      this.getAttList()
    }
  }
}
</script>

<style lang="less" scoped>
  .picture-box {
    height: 100%;
    width: 100%;
    position: relative;
  }
  .img-box {
    margin-top: 20px;
    height: calc(100% - 120px);
    overflow: auto;
  }
  .img-item {
    float: left;
    margin-bottom: 20px;
    margin-right: 20px;
    position: relative;
    overflow: auto;
    border: 1px solid #2e3e50;
    z-index: 10;
    .view-img {
      cursor: zoom-in;
      width:  300px;
      height: 170px;
    }
    .mask {
      position:absolute;
      top: 0;
      left: 0;
      z-index: 20;
    }
    .mask:hover .del-button {
      display: none;
    }
    .del-button {
      display: none;
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 2px;
      text-align: center;
      margin: 5px;
      background:rgba(24,145,255,0.5);
      border: 1px solid rgba(0, 174, 255, 1);
      user-select: none;
      cursor: pointer;
      color:rgba(255,255,255,0.8);
    }
  }
  .check-icon {
    cursor: pointer;
    color: #219AF2;
    font-size: 20px;
    bottom: 15px;
    right: 15px;
    position: absolute;
    z-index: 30;
  }
  .img-item:hover .del-button {
    display: block;
  }
  .page-box {
    position: absolute;
    bottom: 20px;
    right: 30px;
  }
  .p-btn {
    z-index: 10;
    padding: 0 10px;
    cursor: pointer;
    border-radius: 2px;
    text-align: center;
    margin-right: 20px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    background:rgba(24,145,255,0.5);
    border: 1px solid rgba(0, 174, 255, 1);
    user-select: none;
    cursor: pointer;
    font-size: 14px;
    color:rgba(255,255,255,0.8);
  }
  .tool-bar {
    display: flex;
    align-items: center;
    line-height: 30px;
    padding-top: 20px;
    .check-box {
      height: 26px;
      line-height: 26px;
      display: flex;
      align-items: center;
      .chjeck {
        margin-right: 10px;
        z-index: 5;
      }
      .text {
        color: #ffffff;
      }
    }
  }
</style>
