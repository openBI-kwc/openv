<template lang="pug">
  //- 表单输入时的必填项提示组件
  .label
    .important.icon &#xe69b;
    .text {{text}}
</template>

<script>
export default {
  props: {
    text: String
  }
}
</script>

<style lang="less" scoped>
  .label {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #666666;
    height: 20px;
    line-height: 20px;
    margin: 0 45px;
  }
  .important {
    text-align: center;
    color: #ff0000;
    width: 5px;
    height: 5px;
    line-height: 5px;
    margin-right: 10px;
    font-size: 10px;
    transform: scale(0.7);
  }
</style>
