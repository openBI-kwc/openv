<template>
  <!-- 不用配置数据 -->
  <div class="empty-panel">
    <i class="icon icon-completed">&#xe65c;</i>
    <p>该组件不需要配置数据</p>
  </div>
</template>
<style scoped>
.empty-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #209af2;
  padding: 0 16px;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 30px;
  padding-top: 40%;
  user-select: none;
}
.icon-completed {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
