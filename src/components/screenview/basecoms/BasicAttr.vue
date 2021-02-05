// 基础属性
<template lang="pug">
  //- 全局基础配置项
  .attr-item(v-if="position[index]")
    .item.size
      .name 图表尺寸
      .attr
        NumInput(v-model="position[index].width", :width="90", :min="1", :max="9999")
        .label 宽度
      .attr
        NumInput(v-model="position[index].height", :width="90", :min="1", :max="9999")
        .label 高度
    .item.size
      .name 图表位置
      .attr
        NumInput(v-model="position[index].x", :width="90", :min="-Infinity", :max="Infinity")
        .label 横坐标
      .attr
        NumInput(v-model="position[index].y", :width="90", :min="-Infinity", :max="Infinity")
        .label 纵坐标
    .item
      .name 显示边框
      .attr
        SwitchBar(v-model="position[index].showBorder")
    .item
      .name 图表名称
      .attr
        input.bdinput(v-model="position[index].name", :width="200")
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['position', 'index'])
  }
}
</script>
<style lang="less" scoped>
  .attr-item {
    width: 100%;
    .auto-input {
      width: 170px;
    }
    .item {
      padding: 5px 0;
      padding-left: 10px;
      display: flex;
      align-items: center;
      &.size .name {
        align-self: flex-start;
      }
      &.size .attr {
        margin-right: 15px;
      }
      .name {
        font-size: 12px;
        color: rgba(255,255,255,1);
        margin-right: 12px;
        height: 23px;
        line-height: 23px;
      }
      .attr .label {
        font-size: 12px;
        color: rgba(255,255,255,1);
        line-height: 20px;
        text-align: center;
      }
      .attr .bdinput {
        display: inline-block;
        width: 200px;
        text-indent: 12px;
        height: 30px;
        line-height: 30px;
        outline: none;
        background: rgba(0,0,0,0);
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
</style>
