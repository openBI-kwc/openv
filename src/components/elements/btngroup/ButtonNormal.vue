<template lang="pug">
  .button(@click="$emit('onClick')") {{text}}
</template>
<script>
export default {
  props: {
    text: String
  }
}
</script>

<style lang="less" scoped>
  .button {
    cursor: pointer;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    color: #ffffff;
    text-align: center;
    border-radius: 2px;
    background: #219af2;
    border-radius: 2px;
    font-size: 14px;
  }
</style>
