<template lang="pug">
  .data-base-content
    .required
      i.icon &#xe692;
      | 名称
    input.db-name(type="text", placeholder="数据源名称", v-model="sendData.dataname")
    .required
        i.icon &#xe692;
        | 行业分类
    Selection.select-by-bg(v-model="sendData.cid", :width="350" :option="catelist")
    .required
        i.icon &#xe692;
        | 数据源类型
    .radio-box
      .item(v-for="(item,index) in sourceList" :key="index")
        CheckBox.check(type="radio" v-model="sendData.datatype" :radioActive="item.type" :disabled="!!editData || !!sourceType")
        .label(:class="{'active': editData}", @click="changeDataType(item.type)") {{item.name}}
</template>

<script>
import { GET_DATA } from '@api/datasrc.js'
export default {
  props: {
    editData: null,
    sourceType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 数据类型
      sourceList: [],
      // 分类
      catelist: [],
      // 接口参数
      sendData: {
        dataname: '',
        cid: '',
        datatype: ''
      }
    }
  },
  async created () {
    await this.getCate()
    if (this.editData) {
      const {dataname, cid, datatype} = this.editData
      this.sendData = {dataname, cid, datatype}
    }
    this.updateParams()
  },
  methods: {
    // 通知底部
    updateParams () {
      this.$emit('updateParams', this.sendData)
    },
    // 获取分类
    getCate () {
      return new Promise(resolve => {
        GET_DATA().then((value) => {
          if (value.err) return
          this.catelist = value.cid.map(item => {
            return {
              name: item.screenname,
              value: item.screenname
            }
          })
          this.sourceList = value.datatype
          this.sendData.cid = this.catelist[0].value
          this.sendData.datatype = this.sourceList[0].type
          if (this.sourceType) {
            this.sendData.datatype = this.sourceType
          }
          resolve()
        })
      })
    },
    // 修改类型
    changeDataType (datatype) {
      this.sendData.datatype = datatype
    }
  },
  beforeUpdate () {
    this.updateParams()
  }
}
</script>

<style scoped lang="less">
.placeholder-color (@color) {
  &::-webkit-input-placeholder {
    color: @color;
  }
  &::-moz-placeholder {
    color: @color;
  }
  &:-ms-input-placeholder {
    color: @color;
  }
}
.db-name {
  height: 30px;
  background: #003567;
  border: 1px solid rgba(0, 71, 157, 0.7);
  text-indent: 12px;
  display: block;
  width: 100%;
  color: rgba(255,255,255,.8);
  margin-bottom: 20px;
  font-size:14px;
}
.select.kwc-control {
  width: 100%!important;
  margin-bottom: 20px;
}
.data-base-content {
  margin-top: 30px;
  /deep/ input, input {
    .placeholder-color(rgba(255,255,255,.3));
    font-weight: 400!important;
  }
  .radio-box {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    .item {
      width: 50%;
      display: flex;
      align-items: center;
      height: 30px;
      cursor: pointer;
      margin-bottom: 20px;
      .active {
        pointer-events: none;
      }
      .label {
        cursor: pointer;
        margin-left: 5px;
        color:rgba(255,255,255,.8);
        font-size:14px;
        min-width: 100px!important;
      }
    }
  }
}
</style>
