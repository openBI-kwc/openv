<template lang="pug">
  .data-base
    .content
      .icon &#xe619;
      .text 操作成功
    .data-footer
      .bottom-button.confirm(@click="success") 完成
</template>

<script>
export default {
  methods: {
    success () {
      this.$eventBus.$emit('CREATED_DBLINK')
      setTimeout(() => { this.$emit('close') }, 16.7)
    }
  }
}
</script>

<style scoped lang='less'>
.data-base {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
}
.icon {
  font-size: 100px;
  color: #71C240;
  text-align: center;
  width: 100%;
  margin-bottom: 10px;
}
.text {
  font-size: 20px;
  color: #ffffff;
  line-height: 32px;
  text-align: center;
}

</style>
