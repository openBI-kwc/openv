<template lang="pug">
  //- 右键菜单
  //- 菜单的位置在极端临界值需要调整
  .chart-menu-box(v-if="menuInfo.chartKey", oncontextmenu="javascript: return false;")
    .mask
    .chart-menu#text-menu(v-show="menuInfo.coods" :style="menusty", tabindex="-1", v-focus="'自动聚焦'", @blur.stop="closeMenu")
      .menu-item.topping(@mousedown.click.stop="changeLayer('top')") 置顶( shift+cmd/ctrl + ↑ )
      .menu-item.ending(@mousedown.click.stop="changeLayer('end')") 置底( shift+cmd/ctrl + ↓ )
      .menu-item.toup(@mousedown.click.stop="changeLayer('up')") 上移一层( cmd/ctrl + ↑ )
      .menu-item.todown(@mousedown.click.stop="changeLayer('down')") 下移一层( cmd/ctrl + ↓ )
      .menu-line
      .menu-item.copy(@mousedown.click.stop="copyChart") 复制( cmd/ctrl + c )
      .menu-item.delete(@mousedown.click.stop="deleteChart") 删除( delete )
      .menu-item.lock(@mousedown.click.stop="lockChart") {{position[menuInfo.chartKey].islock ? '解锁' : '锁定'}}( cmd/ctrl + ; )
      .menu-item.hidden(@mousedown.click.stop="hiddenChart") {{position[menuInfo.chartKey].ishide ? '显示' : '隐藏'}}( cmd/ctrl + b )
      .menu-item.collection(@mousedown.click.stop="collectionChart('collect')") 收藏( cmd/ctrl + m )
</template>

<script>
import { mapState } from 'vuex'
import { Utils, Lodash } from '@public/utils'
import chartPublicMethod from '@public/chartPublicMethod'
import { COPY_CHART, DEL_CHART, LOCK_CHART, HIDDEN_CHART, SWAP_CHART, COLLECT_CHART } from '@api/visualscreen.js'
const { getChartPosition } = chartPublicMethod, chartwidth = 200, itemheight = 30
export default {
  data () {
    return {
      menuInfo: {
        chartKey: '',
        coods: null,
        // 置顶：top 置底: end 上移一层:up 下移一层:down 复制:copy 删除:del 解锁/锁定: islock 显示/隐藏:isdisplay 收藏:collect
        optType: ''
      }
    }
  },
  mounted () {
    this.$eventBus.$on('CHART_TEXT_MENU', (obj) => {
      this.menuInfo = Object.assign({}, this.menuInfo, obj)
      const { optType } = this.menuInfo
      this.optHandler(optType)
    })
  },
  computed: {
    ...mapState(['position', 'layer', 'index']),
    // 菜单样式
    menusty () {
      let coods = this.menuInfo.coods
      if (!coods) {
        return {
          display: 'none'
        }
      }
      let { innerHeight, innerWidth } = window
      let translateX = 0
      let translateY = 0
      // 最右端
      if (coods[0] + chartwidth > innerWidth) {
        translateX = -chartwidth + 'px'
      }
      // 最下端
      if (coods[1] + itemheight * 9 > innerHeight) {
        translateY = -itemheight * 9 + 'px'
      }
      return {
        left: coods[0] + 'px',
        top: coods[1] + 'px',
        width: chartwidth + 'px',
        height: itemheight * 9 + 'px',
        transform: `translate(${translateX}, ${translateY})`
      }
    }
  },
  methods: {
    // 执行操作
    optHandler: Lodash.debounce(function (optType) {
      switch (optType) {
        case 'top':
          this.changeLayer('top')
          break
        case 'end':
          this.changeLayer('end')
          break
        case 'up':
          this.changeLayer('up')
          break
        case 'down':
          this.changeLayer('down')
          break
        case 'copy':
          this.copyChart()
          break
        case 'del':
          this.deleteChart()
          break
        case 'islock':
          this.lockChart()
          break
        case 'isdisplay':
          this.hiddenChart()
          break
        case 'collect':
          this.collectionChart('collect')
          break
      }
    }, 600, {leading: false}),
    // 关闭菜单
    closeMenu (e) {
      this.menuInfo = {
        chartKey: null,
        coods: null
      }
    },
    // 图层操作 置顶 top 置底 end 上移 up 下移 down 任意 all 传一个数组
    changeLayer (type) {
      let cindex = this.menuInfo.chartKey
      let tid = this.position[cindex].tid
      this.closeMenu()
      this.$store.dispatch('SET_CHART_LOADING', true)
      SWAP_CHART({operating: type, tid}).then(res => {
        if (res.err) return
        this.$store.dispatch('SET_CONFIG', {layer: res.data, index: cindex})
        this.$store.dispatch('SET_CHART_LOADING', false)
        this.$toasting({
          title: '提示',
          type: 'success',
          message: '修改成功'
        })
      })
    },
    // 删除
    deleteChart () {
      let cindex = this.menuInfo.chartKey
      let chid = this.position[cindex].tid
      this.closeMenu()
      this.$store.dispatch('SET_CHART_LOADING', true)
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        DEL_CHART({chid}).then(res => {
          if (res.err) return
          this.$store.dispatch('REMOVE_POSITION', cindex)
          this.$store.dispatch('SET_CHART_LOADING', false)
          this.$toasting({
            title: '提示',
            type: 'success',
            message: res.data
          })
        })
      })
    },
    // 复制
    copyChart () {
      let cindex = this.menuInfo.chartKey
      let chartOpt = this.position[cindex]
      let tid = chartOpt.tid
      let key = Utils.unid()
      let coods = getChartPosition(chartOpt.width, chartOpt.height)
      this.closeMenu()
      this.$store.dispatch('SET_CHART_LOADING', true)
      COPY_CHART({tid, key}).then(res => {
        if (res.err) return
        let tid = res.data.tid
        this.$store.dispatch('COPY_POSITION', {key, tid, ...coods})
        this.$store.dispatch('SET_CHART_LOADING', false)
        this.$toasting({
          title: '提示',
          type: 'success',
          message: '复制成功'
        })
      })
    },
    // 锁定
    // 锁定 1 解锁 0
    lockChart () {
      let cindex = this.menuInfo.chartKey
      let chid = this.position[cindex].tid
      let islock = this.position[cindex].islock
      this.closeMenu()
      this.$store.dispatch('SET_CHART_LOADING', true)
      // status: 1 锁定 0 解锁
      LOCK_CHART({chid, status: Number(!islock)}).then(res => {
        if (res.err) return
        let newPosition = JSON.parse(JSON.stringify(this.position[cindex]))
        newPosition.islock = !islock
        this.$store.dispatch('UPDATE_POSITION', newPosition)
        this.$store.dispatch('SET_CHART_LOADING', false)
        this.$toasting({
          title: '提示',
          type: 'success',
          message: res.data
        })
      })
    },
    // 隐藏图表
    // 显示 0 隐藏 1
    hiddenChart () {
      let cindex = this.menuInfo.chartKey
      let chid = this.position[cindex].tid
      let ishide = this.position[cindex].ishide
      this.closeMenu()
      this.$store.dispatch('SET_CHART_LOADING', true)
      HIDDEN_CHART({chid, status: Number(!ishide)}).then(res => {
        if (res.err) return
        let newPosition = JSON.parse(JSON.stringify(this.position[cindex]))
        newPosition.ishide = !ishide
        this.$store.dispatch('UPDATE_POSITION', newPosition)
        this.$store.dispatch('SET_CHART_LOADING', false)
        this.$toasting({
          title: '提示',
          type: 'success',
          message: res.data
        })
      })
    },
    // 收藏
    // 0 取消收藏 1 收藏
    collectionChart (type) {
      let cindex = this.menuInfo.chartKey
      let tid = this.position[cindex].tid
      let collection = type === 'collect' ? 1 : 0
      this.closeMenu()
      this.$store.dispatch('SET_CHART_LOADING', true)
      COLLECT_CHART({tid, status: collection}).then(res => {
        if (res.err) return
        let newPosition = JSON.parse(JSON.stringify(this.position[cindex]))
        newPosition.collection = Boolean(collection)
        this.$store.dispatch('UPDATE_POSITION', newPosition)
        this.$store.dispatch('SET_CHART_LOADING', false)
        setTimeout(() => {
          // 更新收藏
          this.$eventBus.$emit('GET_CHART_COLLECT')
        }, 500)
        this.$toasting({
          title: '提示',
          type: 'success',
          message: res.data
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .mask {
    background: rgba(0,0,0,0);
    z-index: 9;
  }
  .chart-menu {
    z-index: 99;
    position: absolute;
    background: rgba(27, 31, 36, 1);
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.20);
    font-size: 12px;
    left: 0;
    top: 0;
    .menu-item {
      text-indent: 1em;
      color: #ffffff;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      &:hover {
        background: rgba(33, 154, 242, .6);
      }
    }
    .menu-line {
      height: 1px;
      background: rgba(33, 154, 242, .2);
    }
  }
</style>
