<template lang="pug">
  .data-base
    .content
      .required
        i.icon &#xe692;
        | 名称
      input.input-control(type="text", placeholder="自定义数据源名称", v-model="sendData.basename")
      .required
        i.icon &#xe692;
        | 选择数据行业分类
      Selection.select-by-bg(v-model="sendData.sid" :option="catelist")
      .required
        i.icon &#xe692;
        | 选择数据类型
      .radio-box
        .item(v-for="item in databases")
          CheckBox(type="radio", :radioActive="item.type", v-model="sendData.baseconfig.type", :disabled="!!editData")
          .label(:class="{'active': editData}", @click="sendData.baseconfig.type = item.type") {{item.databasesname}}
    .data-footer
      .bottom-button(@click="$emit('close')") 取消
      .bottom-button.confirm(@click="next") 下一步
</template>

<script>
export default {
  props: {
    editData: null,
    databases: {
      type: Array,
      default: () => []
    },
    cate: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      sendData: {
        basename: '',
        sid: 1,
        baseconfig: {
          type: 'mysql'
        }
      }
    }
  },
  created () {
    if (this.editData) {
      const {basename, sid, baseconfig} = this.editData
      this.sendData = {
        basename,
        sid,
        baseconfig
      }
    }
  },
  computed: {
    catelist () {
      return this.cate.map(item => {
        return {
          name: item.screenname,
          value: item.sid
        }
      })
    }
  },
  methods: {
    next () {
      const sendData = this.sendData
      if (!sendData.basename) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '名称没有设置!'
        })
        return
      }
      this.$emit('nextStep', this.sendData)
    }
  }
}
</script>

<style lang="less" scoped>
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
.data-base {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content {
  overflow: auto;
  overflow-x: hidden;
  flex: 1;
  /deep/ input, input {
    .placeholder-color(rgba(255,255,255,.3));
    font-weight: 400!important;
  }
  .radio-box {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    margin-bottom: 10px;
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
      }
    }
  }
}
</style>
