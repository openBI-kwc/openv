<template lang="pug">
  //- 下拉展开模块
  .expand-box
    .expand-header(@click.stop="expand = !expand", :class="{'unfold': expand}")
      .expand-icon.icon &#xe672;
      .title {{title}}
    .expand-list(v-show="expand")
      slot
</template>
<script>
export default {
  props: {
    title: String
  },
  data () {
    return {
      expand: false
    }
  }
}
</script>
<style scoped lang="less">
  .auto-expand {
    visibility: hidden;
  }
  .expand-box {
    width: 100%;
    position: relative;
    .expand-header {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      color: rgba(255, 255, 255, 1);
      height: 40px;
      padding-left: 10px;
      font-size: 12px;
      cursor: pointer;
      &.unfold .expand-icon {
        transform: rotate(0deg);
      }
      .expand-icon {
        transition: transform .3s;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        transform: rotate(-90deg);
      }
    }
  }
  .expand-list {
    position: relative;
   /deep/ .control-entry .expand-box .expand-header {
      border-bottom: none;
      padding-left: 0;
    }
  }
</style>
