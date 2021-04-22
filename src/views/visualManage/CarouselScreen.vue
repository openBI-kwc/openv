<template lang="pug">
  .carousel
    //- 锁定
    Modal.carousel-modal(:show="showcarousel", @close="closeCarousel", @confrim="confrim", :text="isEdit ? '修改轮播大屏' : '添加轮播大屏'")
      .carousel-content
        .required
            i.icon &#xe692;
            | 名称
        input.input-control(v-model="sendData.cname" placeholder="请输入分类名称")
        .required
          i.icon &#xe692;
          | 备注
        textarea.input-remarks(v-model="sendData.remarks" placeholder="请输入备注信息")
        .required
          i.icon &#xe692;
          | 添加大屏
        .screen-group
          .screen(v-for="(screen, index) in sendData.screens" :key="index")
            Selection.select.select-by-bg(v-model="sendData.screens[index]" :option="shareScreen")
            .opts
              .icon.up(@click="up(index)") &#xe674;
              .icon.down(@click="down(index)") &#xe671;
              .icon.del(@click="del(index)") &#xe600;
          .add(@click="add") 新增
        .required
          i.icon &#xe692;
          | 切换效果
        Selection.select.select-by-bg(v-model="sendData.animation" :option="animationOptions")
        .required
          i.icon &#xe692;
          | 每页停留时间(s)
        Selection.select.select-by-bg(v-model="sendData.time" :option="timeOptions")
        .required
          i.icon &#xe692;
          | 播放控件位置
        Selection.select.select-by-bg(v-model="sendData.controlPos" :option="posOptions")
    Loading(v-if="loading")
    template(v-else)
      BreadCrumbs
      .main-container
        .option-header
          .button-group
            .btn.create-button(@click="beforeAddCarousel") 添加
            .btn.cancel-button(v-if="checkedList.length > 0", @click="deleteCarousel()") 批量删除
          .options
            .search-box
              .search-icon.icon &#xe643;
              input.search-input(placeholder="请输入搜索内容" v-model="searchWord")
            Selection.order-menu(v-model="order" :option="sortoptions", @onChange="orderSortList")
        .content-box
          .content-wp
            table.table-box.table-list(v-if="carouselList.length")
              thead.list-header
                tr
                  td.check
                    CheckBox(:size="12", :value="checkedAll", @input="changeAllchecked")
                  td.name 轮播组名称
                  td.remarks 备注
                  td.links 链接
                  td.option 操作
              tbody.list-body
                tr(v-for="(item, index) in carouselList", :key="index")
                  td.check
                    CheckBox(:size="12", :value="item.checked", @input="changeChecked(item)")
                  td.name {{item.cname}}
                  td.remarks {{item.remarks}}
                  td.links
                    .link
                      a.url(:href="item.devlink || item.crLink" target="_blank") {{item.crLink}}
                      .copy(@click="copy(item)") 复制链接
                  td.option
                    .opt
                      .opt-button(@click="beforeEditCarousel(item)") 编辑
                      .opt-button(@click="deleteCarousel(item.crid)") 删除
            Nodata(v-else)
          Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>
<script>
import { Lodash, CopyToClipboard, Utils } from '@public/utils'
import { mapState } from 'vuex'
import { LOCAL_DEPLOY } from '@api/visualscreen.js'
import { GET_RELEASE, ADD_CAROUSEL_SCREEN, GET_CAROUSEL, DEL_CAROUSEL, UPDATE_CAROUSEL_SCREEN } from '@api/visualrelated.js'
export default {
  data () {
    return {
      isEdit: false,
      showcarousel: false,
      carouselList: [],
      shareScreen: [],
      loading: false,
      pageSize: 20,
      total: 0,
      currentPage: 1,
      searchWord: '',
      order: 'cname',
      checkedAll: false,
      sendData: {
        screens: [null],
        cname: '',
        remarks: '',
        animation: 'slide',
        time: 5,
        controlPos: 'left'
      },
      animationOptions: [{
        name: '位移切换',
        value: 'slide'
      },
      {
        name: '淡入',
        value: 'fade'
      },
      {
        name: '方块',
        value: 'cube'
      },
      {
        name: '3d流',
        value: 'coverflow'
      },
      {
        name: '3d翻转',
        value: 'flip'
      }],
      posOptions: [{
        name: '屏幕左下',
        value: 'left'
      },
      {
        name: '屏幕中下',
        value: 'center'
      },
      {
        name: '屏幕右下',
        value: 'right'
      }],
      timeOptions: [{
        name: 5,
        value: 5
      },
      {
        name: 15,
        value: 15
      },
      {
        name: 30,
        value: 30
      },
      {
        name: 60,
        value: 60
      }],
      sortoptions: [
        {
          name: '按名称排序',
          value: 'cname'
        },
        {
          name: '按创建时间排序',
          value: 'createtime'
        },
        {
          name: '按修改时间排序',
          value: 'updatetime'
        }
      ]
    }
  },
  created () {
    this.getCarouselList()
  },
  activated () {
    this.$route.meta.isActive && this.getCarouselList()
    this.$route.meta.isActive = true
  },
  computed: {
    ...mapState(['setting']),
    // 全选的数据项
    checkedList () {
      return this.carouselList.filter(item => {
        return item.checked
      }).map(item => {
        return item.crid
      }) || []
    }
  },
  methods: {
    // 排序
    orderSortList (val) {
      this.order = val
      this.getCarouselList()
    },
    confrim () {
      this.isEdit ? this.editCarousel() : this.addCarousel()
    },
    add () {
      let lastindex = this.sendData.screens.length
      this.$set(this.sendData.screens, lastindex, null)
    },
    del (index) {
      this.sendData.screens.splice(index, 1)
    },
    up (i) {
      if (i === 0) return
      let tempOption = this.sendData.screens[i - 1]
      this.$set(this.sendData.screens, i - 1, this.sendData.screens[i])
      this.$set(this.sendData.screens, i, tempOption)
    },
    down (i) {
      let lastindex = this.sendData.screens.length - 1
      if (i === lastindex) return
      let tempOption = this.sendData.screens[i + 1]
      this.$set(this.sendData.screens, i + 1, this.sendData.screens[i])
      this.$set(this.sendData.screens, i, tempOption)
    },
    closeCarousel () {
      this.isEdit = false
      this.showcarousel = false
      this.sendData = {
        screens: [null],
        cname: '',
        remarks: '',
        animation: 'slide',
        time: 5,
        controlPos: 'left'
      }
    },
    beforeEditCarousel (item) {
      this.getReleaseScreen().then(() => {
        this.isEdit = true
        this.showcarousel = true
        this.sendData = Lodash.cloneDeep(item)
      })
    },
    editCarousel () {
      if (!this.validParams()) return
      let params = Lodash.cloneDeep(this.sendData)
      delete params.devlink
      UPDATE_CAROUSEL_SCREEN(params).then(result => {
        if (result.err) return
        this.closeCarousel()
        this.getCarouselList()
        this.$toasting({
          type: 'success',
          message: '修改成功'
        })
      })
    },
    beforeAddCarousel () {
      this.getReleaseScreen().then(() => {
        this.showcarousel = true
      })
    },
    validParams () {
      for (const key in this.sendData) {
        if (this.sendData.hasOwnProperty(key)) {
          switch (key) {
            case 'cname':
              if (!this.sendData[key].trim()) {
                this.$toasting({
                  type: 'warning',
                  message: '名字不能全为空字符'
                })
                return false
              }
              break
            case 'remarks':
              if (!this.sendData[key].trim()) {
                this.$toasting({
                  type: 'warning',
                  message: '备注不能全为空字符'
                })
                return false
              }
              break
            case 'screens':
              const selectScreens = this.sendData[key].length > 1 && this.sendData[key].every(item => { return item })
              if (!selectScreens) {
                this.$toasting({
                  type: 'warning',
                  message: '发布大屏少于两个或者存在空的大屏'
                })
                return false
              }
              break
          }
        }
      }
      return true
    },
    getcrLink (crIdent) {
      // 参数
      const { href } = this.$router.resolve({
        name: 'carousel',
        path: '/carousel',
        params: {
          crIdent
        }
      })
      return this.setting.server + '/' + href
    },
    addCarousel () {
      if (!this.validParams()) return
      let crIdent = Utils.unid('c') + Utils.unid('r')
      let crLink = this.getcrLink(crIdent)
      let params = {
        ...this.sendData,
        crIdent,
        crLink
      }
      ADD_CAROUSEL_SCREEN(params).then(result => {
        if (result.err) return
        this.closeCarousel()
        this.getCarouselList()
      })
    },
    // 全选状态
    changeAllchecked () {
      this.checkedAll = !this.checkedAll
      this.carouselList.forEach(item => {
        item.checked = this.checkedAll
      })
    },
    // check 选择
    changeChecked (item) {
      item.checked = !item.checked
      for (let item of this.carouselList) {
        if (!item.checked) {
          this.checkedAll = false
          break
        } else {
          this.carouselList.length > 1 && (this.checkedAll = true)
        }
      }
    },
    getReleaseScreen () {
      return new Promise(resolve => {
        GET_RELEASE({currentPage: 1, pageSize: 99999}).then((value) => {
          if (value.err) return
          this.shareScreen = value.data.map(item => {
            return {
              name: item.sname,
              value: item.link
            }
          })
          resolve()
        })
      })
    },
    // 获取数据列表
    getCarouselList () {
      let params = {
        currentPage: this.currentPage,
        searchword: this.searchWord,
        order: this.order
      }
      GET_CAROUSEL(params).then((value) => {
        if (value.err) return
        this.carouselList = value.data.list.map(item => {
          item.checked = false
          const isproduction = process.env.NODE_ENV === 'production'
          if (!isproduction) item.devlink = '/' + new URL('http://localhost' + item.link).hash
          return item
        })
        this.total = value.data.total
        this.loading = false
      })
    },
    // 批量删除
    deleteCarousel (crid) {
      let params = {}
      if (crid) {
        params = {crid: [crid].toString()}
      } else {
        if (!this.checkedList.length) return
        params = {crid: this.checkedList.toString()}
      }
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        DEL_CAROUSEL(params).then((value) => {
          if (!value.err) {
            this.$toasting({
              type: 'success',
              title: '成功',
              message: '删除成功！'
            })
            this.getCarouselList()
          }
        })
      })
    },
    pageChange (page) {
      this.currentPage = page
      this.getCarouselList()
    },
    // 复制
    copy (item) {
      CopyToClipboard(item.crLink)
      this.$toasting({
        type: 'success',
        title: '提示',
        message: '复制成功！'
      })
    },
    watchSearchword: Lodash.debounce(function () {
      this.getCarouselList()
    }, 600, {leading: false})
  },
  watch: {
    searchWord: {
      handler (n, o) {
        this.searchWord = n
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
  .carousel {
    position: relative;
    height: 100%;
    /deep/ .carousel-modal {
      .popup-content-box {
        height: 700px;
        width: 600px;
      }
      .carousel-content {
        padding-top: 20px;
      }
      .screen-group {
        margin-bottom: 20px;
        .add {
          font-size:14px;
          color:rgba(24,145,255,1);
          line-height:20px;
          cursor: pointer;
          width: 50px;
        }
        .screen {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          .select, &:last-child {
            margin-bottom: 0!important;
          }
          .opts {
            width: 100px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            .icon {
              width:30px;
              height:30px;
              line-height: 30px;
              text-align: center;
              color: rgba(24,145,255,1);
              font-size: 12px;
              cursor: pointer;
              &.change {
                transform: rotate(90deg);
              }
            }
          }
        }
      }
      .input-remarks {
        margin-bottom: 20px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        text-indent: 10px;
        width: 100%;
        height: 90px;
        line-height: 30px;
        background: #003567;
        border: 1px solid rgba(0, 71, 157, 0.7);
        resize: none;
      }
    }
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
    .create-button {
      .flex(flex-start);
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
    .link {
      display: flex;
      align-items: center;
      .url {
        margin-right: 10px;
        font-size: 12px;
        font-weight: 400;
        color: #258AD7;
      }
      .copy {
        cursor: pointer;
        user-select: none;
        font-size: 12px;
        color: rgba(24, 144, 255, 0.6);
        text-align: center;
      }
    }
    .option {
      width: 100px;
      .opt {
        line-height: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        & > div:first-child .opt-button{
          margin-left: 0;
        }
      }
      .opt-button {
        cursor: pointer;
        height: 20px;
        width: 30px;
        line-height: 20px;
        user-select: none;
        font-size: 12px;
        margin-left: 10px;
        color: rgba(24, 144, 255, 0.6);
        text-align: center;
        &:hover, &.active {
          color:rgba(24,144,255,1);
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
