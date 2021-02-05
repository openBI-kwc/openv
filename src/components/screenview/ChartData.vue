<template lang="pug">
  .panel-items(v-if="position[index]")
    //- 响应结果
    Modal.repones(:show="!!resData", @close="resData = null", @confrim="", text="响应结果", :showFooter="false")
      MonacoEditer(v-model="resData", :editorOptions="{ language: 'json', readOnly: true }")
    //- 新建数据
    DataPopup(v-if="showAddPopup", :sourceType="sourceType" @close="showAddPopup = false")
    .conf-panel
      .chart-name
        .text {{position[index].name}}
        .match(:class="{'success' : mappingData && mappingData.ismatch}")
          .ball
          |{{`数据映射${mappingData && mappingData.ismatch ? '成功' : '失败'}`}}
      //- 图表映射
      .data-mapping
        //- 映射字段
        .conf-item
          .fileid-content
            .fileid.name 字段
            .fileid.val 映射值
            .fileid.fg 状态
          //- 字段列表
          .fileid-desc(v-for="(item, index) in dataOpt.map", :key="index")
            TooltipBox(:content="item[2]", :placement="'left'")
              .fileid.name {{item[0]}}
            .fileid.val
              input.input(v-model="item[1]", :placeholder="item[2]", :readonly="filedDisable")
            .fileid.fg
              .match.success(v-if="item[3] && item[3] === 'optional'")
                .ball
                |可选字段
              .match(v-else, :class="{'success' : fileIdSuccess(item[0])}")
                .ball
                |{{`映射${fileIdSuccess(item[0]) ? '' : '未'}完成`}}
      //- 数据源类型
      .data-source-types(v-if="dataTypes.length > 1")
        .conf-item
          .fileid-content 数据源类型
          .fileid-desc
            Selection.data-src(v-model="dataOpt.source.type", :option="dataTypes", :width="260", @onChange="changeDataSourceType")
        //- 不同的类型展示的数据不一样---------------------------------------------------
        StaticMapping(v-if="showType('STATIC')", v-model="dataOpt", @mapping="mapping")
        CsvMapping(v-if="showType('Excel/Csv')", v-model="dataOpt", @create="showCreate")
        ApiMapping(v-if="showType('API')", v-model="dataOpt", @create="showCreate")
        WebSocketMapping(v-if="showType('WebSocket')", v-model="dataOpt", @create="showCreate")
        SqlMapping(v-if="showType('SQL')", v-model="dataOpt", @create="showCreate")
        CustomMapping(v-if="showType('自定义视图')", v-model="dataOpt", @create="showCreate")
      //- 自动更新
      .data-update-clock
        .conf-item
          .fileid-desc(v-if="showType('API')")
            .numinput-text 离线部署API轮询
            NumInput.time(v-model="dataOpt.source.qtime", :max="9999", :min="100", :step="100", :width="120")
            |毫秒一次
          .fileid-content 实时数据
          .fileid-desc
            SwitchBar(v-model="dataOpt.autoUpdate", @onChange="addClockStart")
            .switch-text 开启
          .fileid-desc.req-time(v-if="dataOpt.autoUpdate") 自动更新请求
            NumInput.time(v-model="dataOpt.timeClock", :max="1000", :min="1", :step="1", :width="120")
            |秒一次
    //- 底部按钮
    .conf-button
      .query-rep(v-if="dataOpt.source.type !== 'STATIC'")
        .query-button(@click="getResult") 查看数据响应结果
      .query-rep
        .query-button(@click="mapping") 刷新数据
</template>
<script>
import chartPublicMethod from '@public/chartPublicMethod'
import { Lodash } from '@public/utils'
import { mapState } from 'vuex'
import chartmapping from '@public/mixin/chartmapping'
export default {
  mixins: [chartmapping],
  data () {
    return {
      // 响应结果的editer的配置
      resEditerConf: {
        lang: 'json',
        width: '100%',
        height: '100%',
        readOnly: true
      },
      // 整个图表的对象
      chartOpt: null,
      // 修改的类型
      sourceType: 'api',
      // 显示新增的框
      showAddPopup: false,
      // 响应结果的数据
      resData: null,
      // 图表数据配置
      dataOpt: null,
      // mapping
      mappingData: null,
      // 数据类型
      dataTypes: [{
        name: 'STATIC',
        value: 'STATIC'
      }],
      // 资源类型 切换类型是自动填充
      srcList: {
        STATIC: {},
        'Excel/Csv': {
          selectDaid: 'Not selected'
        },
        API: {
          selectDaid: 'Not selected',
          qtime: 3000,
          apiURL: ''
        },
        SQL: {
          dbLinkId: 'Not selected',
          selectDaid: 'Not selected',
          sqlstr: ''
        },
        '自定义视图': {
          dbLinkId: 'Not selected',
          selectDaid: 'Not selected'
        },
        WebSocket: {
          selectDaid: 'Not selected',
          socketURL: ''
        }
      }
    }
  },
  created () {
    this.chartOpt = this.position[this.index]
    this.dataOpt = this.chartOpt.dataOpt
    this.getDataTypes()
    this.mapping()
  },
  computed: {
    ...mapState(['position', 'index']),
    filedDisable () {
      let disableList = ['fuwenben']
      let charttype = this.chartOpt.charttype
      return disableList.includes(charttype)
    }
  },
  mounted () {
    // 关闭Popup
    this.$eventBus.$on('CLOSE_DATAPOPUP', (val) => {
      this.showAddPopup = val
    })
  },
  methods: {
    // 在配置中增加定时器开启时刻 秒级时间戳
    addClockStart (flag) {
      if (!flag) return
      let now = +new Date()
      this.dataOpt['clockStart'] = now / 1000
    },
    // 显示新增
    showCreate (obj) {
      this.sourceType = obj.type.toLowerCase()
      this.showAddPopup = true
    },
    // 显示type不同的组件
    showType (type) {
      return this.dataOpt.source.type === type
    },
    // 字段映射是否完成
    fileIdSuccess (fileId) {
      if (!this.mappingData) return false
      return this.mappingData.success && this.mappingData.success.includes(fileId)
    },
    // 查看响应结果
    getResult () {
      this.queryResult().then(data => {
        this.resData = data
      })
    },
    // 更改数据源类型
    changeDataSourceType (type) {
      let source = { type }
      this.dataOpt.source = Object.assign(source, this.srcList[type])
      if (type !== 'STATIC') {
        this.dataOpt.tdata = null
        delete this.dataOpt.tdata
      }
    },
    // 映射
    mapping () {
      this.getMapData().then(result => {
        if (!result) return
        this.mappingData = result
        // 匹配成功才会请求图表的数据
        if (this.mappingData && this.mappingData.ismatch) {
          // 刷新图表的数据
          chartPublicMethod.updateChartConfigAndData()
        }
      })
    },
    watchDataSource: Lodash.debounce(function (n) {
      // 数据映射
      this.mapping()
    }, 600, {leading: false})
  },
  watch: {
    'chartOpt.dataOpt': {
      handler (n, o) {
        if (!o) return
        console.log('数据配置变化')
        this.watchDataSource(n)
      },
      deep: true,
      immediate: false
    },
    index: {
      handler (n, o) {
        this.chartOpt = this.position[this.index]
        this.dataOpt = this.chartOpt.dataOpt
      },
      deep: true,
      immediate: false
    }
  }
}
</script>
<style lang="less" scoped>
  .repones /deep/ .popup-content-box{
    width: 80vw;
    height: 80vh;

  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .panel-items {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
    overflow-x: hidden;
  }
  .conf-panel {
    width: 100%;
    height: calc(100% - 100px);
    position: absolute;
    left: 0;
    top: 0;
    overflow: auto;
    overflow-x: hidden;
  }
  // 字段
  .data-mapping {
    .conf-item {
      width: 100%;
      height: auto;
      .fileid-content {
        background: rgba(0, 0, 0, 0.85);
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        padding-left: 20px;
        overflow: hidden;
      }
      .fileid-desc {
        .fileid-content;
        background: rgba(0, 0, 0, 0.85);
      }
      .fileid {
        float: left;
        width: 80px;
        line-height: 40px;
        user-select: none;
      }
      .val {
        margin: 0 5px;
        width: 90px;
        .input {
          text-indent: 12px;
          width: 80px;
          height: 25px;
          line-height: 25px;
          background: rgba(0, 0, 0, 0.85);
          border: none;
          border-bottom: 1px solid #2E3E50;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          &:focus {
            border-bottom: 1px solid #219AF2;
          }
        }
      }
    }
  }
  // 数据源
  .data-source-types {
    background: rgba(0, 0, 0, 0.85);
    .conf-item {
      padding-left: 20px;
      .fileid-content {
        line-height: 40px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
      .fileid-desc {
        .fileid-content;
      }
    }
  }
  // 自动更新
  .data-update-clock {
    .conf-item {
      padding-left: 20px;
      .fileid-content {
        line-height: 40px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
      .fileid-desc {
        .fileid-content;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .switch-text {
          font-size: 15px;
          color: #ffffff;
          margin-left: 20px;
        }
        .numinput-text {
          font-size: 12px;
          color: #ffffff;
        }
      }
      .req-time {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 12px;
        color: #ffffff;
        .time {
          margin: 0 5px;
        }
      }
    }
  }
  // 按钮
  .conf-button {
    width: 100%;
    height: 100px;
    position: absolute;
    left: 0;
    bottom: 0;
    overflow: hidden;
    .query-rep {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 50px;
      .query-button {
        width: 160px;
        height: 30px;
        border-radius: 2px;
        font-size: 14px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        background: rgba(24, 145, 255, 0.5);
        border: 1px solid #00aeff;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  .chart-name {
    width: 100%;
    height: 39px;
    line-height: 40px;
    text-indent: 10px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .match {
    width: 100px;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    &.success {
      .ball {
        background: #3de7c9;
      }
    }
    .ball {
      width: 8px;
      height: 8px;
      background: #F84602;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
</style>
