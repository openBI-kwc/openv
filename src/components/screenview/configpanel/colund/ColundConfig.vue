<template lang="pug">
  .clound-config
    .item-list
      .item(v-for="item in chartData.moduleParam" :key="item.id")
        .desc {{item.desc}}
        .remark {{item.remark}}
        //- 文本输入
        .value(v-if="item.inputType === 'textbox'")
          el-input(v-model="item.defaultValue" size="mini")
        //- 开关
        .value(v-if="item.inputType === 'switchbox'")
          el-switch(v-model="item.defaultValue" active-value="1" inactive-value="0" size="mini")
        //- 下拉框
        .value(v-if="item.inputType === 'listbox'")
          el-select(v-model="item.defaultValue" size="mini")
            el-option(v-for="o in item.listValue.split(';')" :key="o" :label="o" :value="o" size="mini")
</template>
<script>
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [chartdata]
}
</script>
<style lang="less" scoped>
  .item-list {
    padding: 20px;
  }
  .item {
    width: 100%;
    margin-top: 10px;
  }
  .desc {
    color: #1890FF;
    line-height: 30px;
    font-weight: 600;
    font-size: 14px;
  }
  .remark {
    color: #eeeeee;
    line-height: 30px;
    font-size: 12px;
  }
  .value {
    margin-top: 10px;
    /deep/ .el-input .el-input__inner {
      background-color: #2e3e50;
      border: 1px solid #1890FF;
      color: #ffffff;
    }
  }
</style>
