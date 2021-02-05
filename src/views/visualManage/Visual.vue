<template lang="pug">
  .my-visual
    //- 锁定
    Modal.lockmodal(:show="lockshow", @close="closeLock", @confrim="toggleLock", text="输入密码")
      .lock-input
        .required
          i.icon &#xe692;
          | 请输入密码
        input(type="text" style="display:none;")
        input.screen-password.input-control(type="password", v-model="password" autocomplete="off")
    Modal.show-all-class(:show="fitcontent", @close="fitcontent = false", @confrim="confrimClass", text="全部分类")
      .more-class
        .type-item(:class="{active: expendClass === 0}", @click="expendClass = 0") 全部
        .type-item(v-for="(item,index) in cateList" :key="index" :class="{'active': expendClass === item.sid}" @click="expendClass = item.sid") {{item.screenname}}
    //- 发布
    Release(v-if="shareshow", :shareScreen="shareScreen", @close="shareshow=false")
    Loading(v-if="loading")
    template(v-else)
      BreadCrumbs
      .main-container
        .page-header
          .classification
            .name 分类:
            .class-items
              .items#classItems
                .type-item(:class="{active: cateType === 0}", @click="chageCate()") 全部
                .type-item(v-for="(item,index) in cateList" :key="index" :class="{'active': cateType === item.sid}" @click="chageCate(item.sid)") {{item.screenname}}
            .expend.icon(v-if="showExpend" @click="fitcontent = true; expendClass = cateType") &#xe683;
          .line
          .tool-box
            .search-box
              .search-icon.icon &#xe643;
              input.search-input(placeholder="请输入屏幕名称" v-model="searchWord")
            Selection(v-model="order", :width="200", :option="sortoptions", @onChange="chageOrdSort")
            .view-tabs
              .icon.card(:class="{'active': viewMode === 'card'}" @click="viewMode = 'card'") &#xe616;
              .icon.list(:class="{'active': viewMode === 'list'}" @click="viewMode = 'list'") &#xe601;
        .content-box
          .screen-card-list(v-show="viewMode === 'card'")
            .create-screen(@click="creatNewScreen")
              .icon.create &#xe637;
              .text 新建可视化
            template(v-if="screenSummary.length > 0")
              .screen-card(v-for="item in screenSummary" :key="item.id")
                .thumbnails-box
                  img.thumbnails(v-lazy="setting.server + item.imgdata")
                  .hover-mask
                    .card-tool-top
                      .screen-password {{getPwd(item) ? `密码：${getPwd(item)}` : ''}}
                      .card-screen-option
                        .fa.topbtn(@click="showLockModal(item)" :class="item.lock ? 'fa-unlock' : 'fa-lock'" v-tooltip="item.lock ? '解锁' : '锁定'")
                        .icon.topbtn(@click="releaseScreen(item)" v-tooltip="'发布'") &#xe613;
                        .icon.topbtn(@click="openPreview(item)" v-tooltip="'预览'") &#xe615;
                        .icon.topbtn(@click="copyScreen(item.id)" v-tooltip="'复制'") &#xe634;
                        .icon.topbtn(@click="showDelateBox(item.id)" v-tooltip="'删除'") &#xe61c;
                    .edit-button(@click="openScreen(item)")
                      .lock.icon(v-if="item.lock") &#xe60d;
                      |编辑
                    .screen-times
                      .create 创建时间：{{item.createtime}}
                      .update 修改时间：{{item.updatetime}}
                .card-tool-bottom
                  .edit-icon.icon &#xe633;
                  input.text(type="text" v-model="item.name" @blur="changeName(item)" @focus="setcopyName(item)")
                  .isrelease(:class="{'release': item.publish}")
                    .point
                    .status {{item.publish ? '已发布' : '未发布'}}
          .screen-list-list(v-show="viewMode === 'list'")
            .create-screen(@click="creatNewScreen") 添加
            table.screen-list.table-list(v-if="screenSummary.length > 0")
              thead.list-header
                tr
                  td.screen-name 大屏名称
                  td 发布状态
                  td 创建时间
                  td 修改时间
                  td 密码
                  td.table-screen-option 操作
              tbody.list-body
                tr(v-for="(item, index) in screenSummary" :key="index")
                  td.screen-name
                    .name
                      .fa.lock(:class="{'fa-lock':item.lock}")
                      input.text(type="text" v-model="item.name" @blur="changeName(item)" @focus="setcopyName(item)")
                  td
                    .isrelease(:class="{'release': item.publish}")
                      .point
                      .status {{item.publish ? '已发布' : '未发布'}}
                  td {{item.createtime}}
                  td {{item.updatetime}}
                  td {{getPwd(item) || '-'}}
                  td.table-screen-option
                    .option
                      .opt-button(@click="openScreen(item)") 编辑
                      .opt-button(@click="showLockModal(item)") {{item.lock ? '解锁' : '锁定'}}
                      .opt-button(@click="releaseScreen(item)") 发布
                      .opt-button(@click="openPreview(item)") 预览
                      .opt-button(@click="copyScreen(item.id)") 复制
                      .opt-button(@click="showDelateBox(item.id)") 删除
            Nodata(v-else)
          Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>

<script>
import { mapState } from 'vuex'
import { Utils, Lodash } from '@public/utils'
import {
  GET_SCREEN,
  DELETE_SCREEN,
  COPY_SCREEN,
  LOCK_SCREEN,
  UNLOCK_SCREEN,
  GET_CATE_LIST,
  RENAME_SCRREN
} from '@api/visualrelated.js'
import {
  TEST_PASSWORD
} from '@api/visualedit.js'
const $ = window.$
export default {
  data () {
    return {
      // 复制的名字
      copyName: '',
      // 视图类型
      viewMode: 'card',
      // 分页参数
      currentPage: 1,
      total: 0,
      pageSize: 20,
      // 显示全部分类
      showExpend: false,
      // 展开后选择的分类
      expendClass: '',
      // 显示更多的分类
      fitcontent: false,
      // 锁定类型
      locktype: 'lockscreen',
      // 显示发布
      shareshow: false,
      // 显示锁定
      lockshow: false,
      // 加载中
      loading: true,
      // 搜索词
      searchWord: '',
      // 锁定的密码
      password: '',
      // 排序
      order: 'name',
      // 分类 0 全部
      cateType: 0,
      // 锁定参数
      locksend: null,
      // f发布大屏
      shareScreen: {},
      // 大屏或模板列表数据
      screenSummary: [],
      // 分类
      cateList: [],
      // 排序选项
      sortoptions: [
        {
          name: '按名称排序',
          value: 'name'
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
    this.getScreenSummary()
    this.getCateList()
  },
  computed: {
    ...mapState(['setting', 'user'])
  },
  activated () {
    this.$route.meta.isActive && this.getScreenSummary()
    this.$route.meta.isActive = true
  },
  methods: {
    confrimClass () {
      this.fitcontent = false
      if (this.expendClass === this.cateType) return
      this.chageCate(this.expendClass)
      this.expendClass = ''
    },
    setcopyName (item) {
      this.copyName = item.name
    },
    // 重命名
    changeName (item) {
      const params = {
        id: item.id, 
        name: item.name
      }
      if (this.copyName === item.name) return
      RENAME_SCRREN(params).then((responseData) => {
        if (responseData.err) {
          item.name = this.copyName
          this.copyName = ''
          return
        }
        this.copyName = ''
        this.$toasting({
          type: 'success',
          title: '提示',
          message: '修改成功'
        })
      })
    },
    // 发布
    releaseScreen (item) {
      if (item.publish) {
        this.$toasting({
          type: 'success',
          title: '提示',
          message: '屏幕已发布！'
        })
      } else {
        this.showShare(item)
      }
    },
    // 预览
    openPreview (item) {
      const { href } = this.$router.resolve({
        name: 'preview',
        path: '/preview',
        params: {
          id: this.enBase64(item.id)
        }
      })
      Utils.openURL(href, '_blank')
    },
    // 获取密码
    getPwd (item) {
      return this.showPwd(item) && item.lock ? Utils.deBase64(item.password) : ''
    },
    // 显示密码
    showPwd (item) {
      let isown = !!item.publishuser
      if (isown || this.user.role === 1) return true
      return false
    },
    // 分页
    pageChange (page) {
      this.currentPage = parseFloat(page)
      this.getScreenSummary()
    },
    watchSearchword: Lodash.debounce(function () {
      this.getScreenSummary()
    }, 600, {leading: false}),
    enBase64: Utils.enBase64,
    // 进入大屏验证密码
    testPassword () {
      let params = {
        password: Utils.enBase64(this.password),
        cid: this.locksend.id
      }
      let pattern = /^[^\u4e00-\u9fa5]{0,}$/
      if (!this.password || !pattern.test(this.password)) {
        return this.$toasting({
          type: 'error',
          title: '警告',
          message: '密码为空或存在中文字符'
        })
      }
      TEST_PASSWORD(params).then((val) => {
        if (val.err) return
        this.openNewEdit()
        this.closeLock()
      })
    },
    // 关闭锁定
    closeLock () {
      this.locksend = null
      this.lockshow = false
      this.password = ''
      this.locktype = 'lockscreen'
    },
    // 显示锁定
    showLockModal (item) {
      this.locksend = item
      this.lockshow = true
    },
    // 锁定和解锁
    toggleLock (item = this.locksend) {
      if (this.locktype === 'lockscreen') {
        if (item.lock) {
          this.unlockingScreen(item)
        } else {
          this.lockingScreen(item)
        }
      } else if (this.locktype === 'enterpage') {
        // 这里完成后要回到 lockscreen
        this.testPassword()
      }
    },
    // 向服务器获取大屏列表
    getScreenSummary () {
      // 向服务器获取大屏列表
      let params = {
        sid: this.cateType,
        order: this.order,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.searchWord && (params.searchword = this.searchWord)
      GET_SCREEN(params).then((result) => {
        this.loading = false
        if (result.err) return
        let resData = result.data
        this.screenSummary = resData.list
        this.total = resData.total
      })
    },
    // 获取分类
    getCateList () {
      GET_CATE_LIST().then(result => {
        this.cateList = result
        this.$nextTick(() => {
          setTimeout(() => {
            let cwidth = $('#classItems').width()
            let pwidth = $('#classItems').parent().width()
            if (cwidth === pwidth) this.showExpend = true
          }, 16.7)
        })
      })
    },
    // 切换分类
    chageCate (val = 0) {
      this.cateType = val
      this.getScreenSummary()
    },
    // 排序切换
    chageOrdSort (val) {
      this.order = val
      this.getScreenSummary()
    },
    // 新建大屏
    creatNewScreen () {
      const { href } = this.$router.resolve({
        name: 'screencreate',
        path: '/screencreate'
      })
      Utils.openURL(href, '_blank')
    },
    // 新开编辑页面
    openNewEdit (item = this.locksend) {
      const { href } = this.$router.resolve({
        name: 'screenediting',
        path: '/screenediting',
        params: {
          type: 'screen',
          id: this.enBase64(item.id)
        }
      })
      Utils.openURL(href, '_blank')
    },
    // 打开编辑
    openScreen (item) {
      if (item.lock) {
        this.showLockModal(item)
        this.locktype = 'enterpage'
      } else {
        this.openNewEdit(item)
      }
    },
    // 显示发布
    showShare (item) {
      this.shareshow = true
      this.shareScreen = item
    },
    // 显示删除屏幕提示框
    showDelateBox (id) {
      this.$alert({type: 'warning', msg: '确定要删除大屏吗?'}, () => {
        DELETE_SCREEN({id}).then((response) => {
          if (!response.err) {
            this.$toasting({
              type: 'success',
              title: '成功',
              message: '删除成功'
            })
            this.getScreenSummary()
          }
        })
      })
    },
    // 复制大屏
    copyScreen (id) {
      COPY_SCREEN({id}).then((response) => {
        if (!response.err) {
          this.$toasting({
            type: 'success',
            title: '成功',
            message: '复制成功!'
          })
          this.getScreenSummary()
          // 将剩余的屏幕显示出来
          // this.screenSummary = response.data
        }
      })
    },
    // 锁定
    lockingScreen (item) {
      let params = {
        cid: item.id,
        password: Utils.enBase64(this.password)
      }
      let pattern = /^[^\u4e00-\u9fa5]{0,}$/
      if (!this.password || !pattern.test(this.password)) {
        return this.$toasting({
          type: 'error',
          title: '警告',
          message: '密码为空或存在中文字符'
        })
      }
      LOCK_SCREEN(params).then((resData) => {
        if (!resData.err) {
          this.$toasting({
            type: 'success',
            title: '成功',
            message: '锁定成功！'
          })
          this.closeLock()
          this.getScreenSummary()
        }
      })
    },
    // 解锁
    unlockingScreen (item) {
      let params = {
        cid: item.id,
        password: Utils.enBase64(this.password)
      }
      let pattern = /^[^\u4e00-\u9fa5]{0,}$/
      if (!this.password || !pattern.test(this.password)) {
        return this.$toasting({
          type: 'error',
          title: '警告',
          message: '密码为空或存在中文字符'
        })
      }
      UNLOCK_SCREEN(params).then((resData) => {
        if (!resData.err) {
          this.$toasting({
            type: 'success',
            title: '成功',
            message: '解锁成功！'
          })
          this.closeLock()
          this.getScreenSummary()
        }
      })
    }
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
  .type-item {
    margin: 4.5px 0;
    height: 24px;
    line-height: 24px;
    font-size:14px;
    font-weight:400;
    color:#FFFFFF;
    padding: 0 15px;
    margin-left: 20px;
    cursor: pointer;
    &.active {
      color:rgba(24,144,255,1);
      background: url('~@assets/img/class-active.png') center center no-repeat;
      background-size: 100% 24px;
    }
  }
  .my-visual {
    position: relative;
    height: 100%;
    .lockmodal /deep/ .popup-content-box {
      height: 250px;
      min-height: 250px;
      .lock-input {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
    .show-all-class /deep/ .popup-content-box {
      height: 500px;
      width: 500px;
      .more-class {
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 30px 0;
        .type-item {
          float: left;
          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
    .content-box {
      display: flex;
      flex-direction: column;
      flex: 1;
      position: relative;
    }
  }
  .table-screen-option {
    width: 260px;
    .option {
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
  .screen-card-list {
    position: absolute;
    width: 100%;
    height: 100%;
    padding-bottom: 20px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    // 大屏管理的卡片
    .create-screen {
      cursor: pointer;
      width:300px;
      height:225px;
      margin-right: 30px;
      margin-bottom: 30px;
      background:linear-gradient(-90deg,rgba(24,144,255,0.23) 0%,rgba(24,144,255,0.03) 100%);
      border:1px solid rgba(24, 144, 255, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 14px;
      user-select: none;
      .icon.create {
        color: #FFFFFF;
      }
    }
    .card-tool-top .icon {
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
  .screen-list-list {
    position: absolute;
    width: 100%;
    height: 100%;
    padding-bottom: 20px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .create-screen {
      width:80px;
      height:32px;
      line-height: 32px;
      text-align: center;
      background:rgba(24,145,255,0.5);
      border:1px solid rgba(0, 174, 255, 1);
      font-size:14px;
      font-weight:400;
      color:rgba(255,255,255,.8);
      cursor: pointer;
      margin-bottom: 20px;
    }
    .screen-name {
      width: 300px;
      .name {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .lock {
        position: absolute;
        top: 50%;
        left:0;
        transform: translate(-100%, -50%);
        width: 22px;
        height: 22px;
        text-align: center;
        line-height: 22px;
        color: rgba(24,145,255,1);
      }
      .text {
        width: 300px;
        background: none;
        height:32px;
        line-height: 32px;
        overflow:hidden; 
        text-overflow:ellipsis;
        white-space:nowrap;
        border: 0;
        outline: none;
        color:rgba(255,255,255,.8);
      }
    }
    .isrelease {
      width: 80px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height:32px;
      font-weight: 300;
      line-height: 32px;
      font-weight:400;
      &.release .point {
        background: #00a0e9 !important;
      }
      .point {
        width:6px;
        height:6px;
        background:rgba(160,160,160,1);
        border-radius:50%;
        margin-right: 5px;
      }
      .status {
        flex: 1;
      }
    }
  }
  .page-box {
    position: absolute;
    bottom: 20px;
    right: 0;
  }
</style>
