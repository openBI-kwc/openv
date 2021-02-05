<template lang="pug">
  .button-70-26
    .add(@click="$emit('onClick')") + {{text}}
</template>

<script>
export default {
  props: {
    text: String
  }
}
</script>

<style lang="less" scoped>
  .button-70-26 {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .add {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #219af2;
      border-radius: 2px;
      color: #fff;
      cursor: pointer;
      height: 26px;
      line-height: 20px;
      text-align: center;
      user-select: none;
      font-size: 14px;
      width: 70px;
    }
  }
</style>
