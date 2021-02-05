// 图表数据映射
import {GET_DATA_TYPES, GET_MAP_DATA, GET_RESULT} from '@api/visualscreen.js'
import { mapState } from 'vuex'
import { Lodash } from '@public/utils'
export default {
  data() {
    return {
      dataUsed: []
    }
  },
  computed: {
    ...mapState(['position', 'index'])
  },
  methods: {
    // 获取参数
    getParams() {
      if (!this.index) return
      let chartOpt = this.position[this.index]
      let dataOpt = chartOpt.dataOpt
      if (!dataOpt) return
      let source = dataOpt.source
      let params = Lodash.cloneDeep({
        ...source,
        map: dataOpt.map,
        tid: chartOpt.tid,
        sdata: ''
      })
      // 静态数据来源传静态数据
      if (dataOpt.tdata && params.type === 'STATIC') {
        params.sdata = dataOpt.tdata
      }
      return params
    },
    // 查看响应结果
    queryResult() {
      return new Promise(resolve => {
        let params = this.getParams()
        GET_RESULT(params).then(res => {
          if (res.err) return
          resolve(res.data)
        })
      })
    },
    // 数据关系映射
    getMapData() {
      return new Promise((resolve, reject) => {
        let params = this.getParams()
        let emptyUrl = {
          'API': 'apiURL',
          'WebSocket': 'socketURL',
          'SQL': 'sqlstr'
        }
        // 没有选择
        let notSelected = params.selectDaid === 'Not selected'
        if (notSelected && !params[emptyUrl[params.type]]) {
          return resolve(null)
        }
        GET_MAP_DATA(params).then(res => {
          if (res.err) return
          resolve(res.data)
        })
      })
    },
    // 获取数据类型
    getDataTypes() {
      GET_DATA_TYPES().then(res => {
        if (res.err) return
        res.data.forEach(item => {
          this.dataTypes.push({
            name: item,
            value: item
          })
        })
      })
    }
  }
}
