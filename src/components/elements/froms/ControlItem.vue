<template lang="pug">
  .control-entry
    //- 标签显示
    .label.control-label(@click="$emit('onClick')") {{value}}
    .control-filed
      slot
</template>
<script>
export default {
  props: {
    value: String
  }
}
</script>
<style lang="less" scoped>
  .label {
    font-size: 12px;
    color: rgba(255,255,255,1);
    min-height: 30px;
    line-height: 30px;
    width: 72px;
    max-width: 72px;
    word-break: break-all;
  }
  .control-filed {
    display: flex;
    flex-flow: column nowrap;
    position: relative;
    .kwc-control {
      margin-bottom: 5px;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
</style>
