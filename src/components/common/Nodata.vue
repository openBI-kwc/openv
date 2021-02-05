<template lang="pug">
  .no-data
    img(src="~@assets/img/nodata.png")
    p 暂无数据
</template>
<style lang="less" scoped>
  .no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    min-height: 150px;
    height: fit-content;
    img {
      object-fit: cover;
    }
    p {
      line-height: 20px;
      font-size: 14px;
      text-align: center;
      color: #cccccc;
    }
  }
</style>
