<template lang="pug">
  //- 通用的地图组件
  <div class="map-box">
    //- <Map :width="position.width" :height="position.height" :layer="position.layer" :customid="position.customid" :center="[39.917034, 116.392312]" :zoomControl="false" :zoom="13"></Map>
  </div>
</template>
<style lang="less" scoped>
  .map-box {
    height: 100%;
    width: 100%;
    position: relative;
  }
</style>
