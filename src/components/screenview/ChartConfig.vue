// 图表配置栏
<template lang="pug">
  #config-panel-wp
    .config-manager(v-if="showView")
      //- 图表配置
      .chart-configs-manager(v-if="index")
        .config-manager-head
          .switch-item(@click="configdata = false", :class="{'active': !configdata}") 配置
          .switch-item(@click="configdata = true", :class="{'active': configdata}") 数据
        .config-manager-body
          //- 样式配置
          ChartStyle(v-if="!configdata")
          template(v-else)
            ChartData(v-if="position[index].dataOpt")
            NotConfData(v-else)
      //- 多选图表布局
      .charts-layout(v-if="indexList.length > 1")
        .layout-item
          span.layout-title 对齐
          .iconbox(v-for="(item, index) in alignment" @click="getCoords(item.method)")
            .icon.layout-icon(v-html="item.icon" v-tooltip.bottom-start="item.name")
        .layout-item
          span.layout-title 分布
          .iconbox(v-for="(item, index) in distribution" @click="getCoords(item.method)")
            .icon(v-html="item.icon" :class="indexList.length > 2 ? 'layout-icon' : 'layout-icon-blank' " v-tooltip.bottom-start="item.name")
      //- 屏幕配置
      ScreenPanel(v-else)
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      configdata: false,
      showView: true,
      allLtCoords: [],
      allRbCoords: [],
      allCenterCoords: [],
      alignment: [
        {
          name: '水平左对齐',
          icon: '&#xe685;',
          method: 'alignleft'
        },
        {
          name: '垂直顶对齐',
          icon: '&#xe67c;',
          method: 'verticaltop'
        },
        {
          name: '水平右对齐',
          icon: '&#xe67a;',
          method: 'alignright'
        },
        {
          name: '垂直底对齐',
          icon: '&#xe679;',
          method: 'verticalbottom'
        },
        {
          name: '垂直居中对齐',
          icon: '&#xe678;',
          method: 'verticalcenter'
        },
        {
          name: '水平居中对齐',
          icon: '&#xe677;',
          method: 'aligncenter'
        }
      ],
      distribution: [
        {
          name: '水平分布',
          icon: '&#xe684;',
          method: 'alicentlayer'
        },
        {
          name: '垂直分布',
          icon: '&#xe67d;',
          method: 'verticentlayer'
        }
      ]
    }
  },
  computed: {
    ...mapState(['position', 'index', 'indexList'])
  },
  methods: {
    refreshView() {
      this.showView = false
      this.$nextTick(() => {
        window.requestAnimationFrame(() => {
          this.showView = true
        })
      })
    },
    getCoords(type) {
      // 重置数组 避免方法重复调用,数据污染
      this.allLtCoords = []
      this.allRbCoords = []
      this.indexList.map(item => {
        let itemLtCoord = []
        let itemRbCoord = []
        itemLtCoord = [this.position[item].x, this.position[item].y]
        itemRbCoord = [this.position[item].x + this.position[item].width, this.position[item].y + this.position[item].height]
        this.allLtCoords.push(itemLtCoord)
        this.allRbCoords.push(itemRbCoord)
      })
      switch (type) {
        case 'alignleft':
          this.alignleft()
          break
        case 'verticaltop':
          this.verticaltop()
          break
        case 'alignright':
          this.alignright()
          break
        case 'verticalbottom':
          this.verticalbottom()
          break
        case 'verticalcenter':
          this.verticalcenter()
          break
        case 'aligncenter':
          this.aligncenter()
          break
        case 'alicentlayer':
          this.alicentlayer()
          break
        case 'verticentlayer':
          this.verticentlayer()
      }
    },
    // 水平左对齐
    alignleft() {
      let minXs = this.allLtCoords.map(item => {
        return item[0]
      })
      let minX = Math.min.apply(Math, minXs)
      this.indexList.map(item => {
        let key = item
        let option = {
          key,
          x: minX,
          y: this.position[item].y
        }
        this.$store.dispatch('UPDATE_POSITION', option)
      })
    },
    // 垂直顶对齐
    verticaltop() {
      let minTs = this.allLtCoords.map(item => {
        return item[1]
      })
      let minT = Math.min.apply(Math, minTs)
      this.indexList.map(item => {
        let key = item
        let option = {
          key,
          x: this.position[key].x,
          y: minT
        }
        this.$store.dispatch('UPDATE_POSITION', option)
      })
    },
    // 水平右对齐
    alignright() {
      let maxXs = this.allRbCoords.map(item => {
        return item[0]
      })
      let maxX = Math.max.apply(Math, maxXs)
      this.indexList.map(item => {
        let key = item
        let option = {
          key,
          x: maxX - this.position[item].width,
          y: this.position[item].y
        }
        this.$store.dispatch('UPDATE_POSITION', option)
      })
    },
    // 垂直底对齐
    verticalbottom() {
      let maxTs = this.allRbCoords.map(item => {
        return item[1]
      })
      let maxT = Math.max.apply(Math, maxTs)
      this.indexList.map(item => {
        let key = item
        let option = {
          key,
          x: this.position[item].x,
          y: maxT - this.position[item].height
        }
        this.$store.dispatch('UPDATE_POSITION', option)
      })
    },
    // 垂直居中对齐
    verticalcenter() {
      let minXs = this.allLtCoords.map(item => {
        return item[0]
      })
      let minX = Math.min.apply(Math, minXs)
      let maxXs = this.allRbCoords.map(item => {
        return item[0]
      })
      let maxX = Math.max.apply(Math, maxXs)
      this.indexList.map(item => {
        let key = item
        let option = {
          key,
          x: (maxX - minX - this.position[item].width) / 2,
          y: this.position[item].y
        }
        this.$store.dispatch('UPDATE_POSITION', option)
      })
    },
    // 水平居中对齐
    aligncenter() {
      let minTs = this.allLtCoords.map(item => {
        return item[1]
      })
      let minT = Math.min.apply(Math, minTs)
      let maxTs = this.allRbCoords.map(item => {
        return item[1]
      })
      let maxT = Math.max.apply(Math, maxTs)
      this.indexList.map(item => {
        let key = item
        let option = {
          key,
          x: this.position[item].x,
          y: (maxT - minT - this.position[item].height) / 2
        }
        this.$store.dispatch('UPDATE_POSITION', option)
      })
    },
    // 水平分布
    alicentlayer() {
      // 重置数组
      this.allCenterCoords = []
      this.indexList.map(item => {
        let itemCenterCoord = []
        itemCenterCoord = [this.position[item].x + this.position[item].width/2, this.position[item].y + this.position[item].height/2]
        this.allCenterCoords.push({id: item, cood: itemCenterCoord[0]})
      })
      this.allCenterCoords.sort((x, y) => {
        return x.cood - y.cood
      })
      // 中心点数组长度 - 1
      let arrIndex = this.allCenterCoords.length - 1
      // 偏移量
      let deviation = (this.allCenterCoords[arrIndex].cood - this.allCenterCoords[0].cood) / arrIndex
      // 保存数据坐标
      this.allCenterCoords.map((k, i) => {
        if (i === 0 || i === arrIndex) return
        let key = k.id
        let option = {
          key,
          x: this.allCenterCoords[0].cood + parseInt(deviation * i) - (this.position[k.id].width / 2),
          y: this.position[k.id].y
        }
        this.$store.dispatch('UPDATE_POSITION', option)
      })
    },
    // 垂直分布
    verticentlayer() {
      // 重置数组
      this.allCenterCoords = []
      this.indexList.map(item => {
        let itemCenterCoord = []
        itemCenterCoord = [this.position[item].x + this.position[item].width/2, this.position[item].y + this.position[item].height/2]
        this.allCenterCoords.push({id: item, cood: itemCenterCoord[1]})
      })
      this.allCenterCoords.sort((x, y) => {
        return x.cood - y.cood
      })
      // 中心点数组长度 - 1
      let arrIndex = this.allCenterCoords.length - 1
      // 偏移量
      let deviation = (this.allCenterCoords[arrIndex].cood - this.allCenterCoords[0].cood) / arrIndex
      // 保存数据坐标
      this.allCenterCoords.map((k, i) => {
        if (i === 0 || i === arrIndex) return
        let key = k.id
        let option = {
          key,
          x: this.position[k.id].x,
          y: this.allCenterCoords[0].cood + parseInt(deviation * i) - (this.position[k.id].height / 2)
        }
        this.$store.dispatch('UPDATE_POSITION', option)
      })
    }
  },
  watch: {
    index(o, n) {
      this.refreshView()
    }
  }
}
</script>

<style lang="less" scoped>
#config-panel-wp {
  width: 300px;
  height: 100%;
  z-index: 9;
  position: relative;
  transition: width 0.25s ease-in-out;
  overflow: hidden;
  .config-manager {
    position: relative;
    width: 300px;
    height: 100%;
    background: rgba(0,0,0,.2);
    transition: 0.25s ease-in-out;
    // 配置面板
    .chart-configs-manager {
      width: 100%;
      height: 100%;
    }
    .charts-layout {
      width: 100%;
      height: 100%;
      padding: 10px 20px;
      .layout-item {
        width: 100%;
        display: flex;
        line-height: 30px;
        margin-bottom: 20px;
        .layout-title {
          display: inline-block;
          width: 50px;
          font-size: 12px;
          color: rgba(255, 255, 255, .8);
        }
        .iconbox {
          width: 30px;
          margin-right: 5px;
          position: relative;
          &:hover .layoption {
            display: inline-block;
          }
          &:hover .layout-icon {
            background: #009bf9;
          }
          .layout-icon {
            position: relative;
            z-index: 3;
            font-size: 20px;
            width: 30px;
            height: 30px;
            text-align: center;
            background: rgba(0,0,0,0);
            color: rgba(255, 255, 255, .8);
          }
          .layout-icon-blank {
            position: relative;
            z-index: 3;
            font-size: 20px;
            width: 30px;
            height: 30px;
            text-align: center;
            background: rgba(0,0,0,0);
            color: rgba(255, 255, 255, .2);
          }
          .layoption {
            display: none;
            width: 90px;
            height: 30px;
            z-index: 2;
            background: rgba(0,0,0,0);
            color: rgba(255, 255, 255, .8);
            position: absolute;
            top: 25px;
            left: 0;
            font-size: 12px;
          }
        }
      }
    }
  }
  &.--hide {
    width: 0;
    .config-manager {
      transform: translateX(100%);
    }
  }
}
// 面板头部
.config-manager-head {
  height: 39px;
  line-height: 40px;
  font-size: 1.4em;
  text-align: center;
  display: flex;
  position: relative;
  .switch-item {
    width: 50%;
    cursor: pointer;
    font-size: 16px;
    color: #ffffff;
    background: rgba(0,0,0,.3);
    border-top: 2px solid rgba(0,0,0,0);
    &.active {
      border-top: 2px solid #1890FF;
      background:linear-gradient(0deg,rgba(9,22,34,0.5) 0%,rgba(33,142,251,.3) 100%);
    }
  }
}
// 配置面板
.config-manager-body {
  position: relative;
  left: 0;
  width: 100%;
  height: calc(100% - 40px);
  overflow: hidden;
}
.addGroup-button {
  line-height: 45px;
  height: 45px;
  text-align: center;
  background-color: #009bf9;
  position: absolute;
  bottom: 0;
  width: 50%;
  cursor: pointer;
  color: white;
  font-size: 16px;
}
</style>
