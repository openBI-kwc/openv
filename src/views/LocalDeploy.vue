<template lang="pug">
  .local-deploy
    .screen-card(v-for="(item, index) in deployScreen" :key="index")
      a.thumbnails-box(:href="item.link", target="_blank")
        img.thumbnails(v-if="item.img", :src="'./static' + item.img")
        img.thumbnails(v-else, :src="img404")
      .card-tool
        span.text {{item.name}}
</template>
<script>
import img404 from '@assets/img/datav.png'
import Utils from '@public/utils'
import { mapState } from 'vuex'
const { loadData } = Utils
export default {
  data () {
    return {
      deployScreen: [],
      img404
    }
  },
  computed: {
    ...mapState(['setting'])
  },
  created () {
    loadData('./static/data/deployScreen.json').then(res => {
      this.deployScreen = res
    })
  }
}
</script>

<style lang="less" scoped>
  .local-deploy {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: auto;
  }
  .screen-card {
    position: relative;
    font-size: 1rem;
    transition: all .3s;
    width: 300px;
    height: 200px;
    overflow: hidden;
    margin: 20px;
    color: #410090;
    background: #FFFFFF;
    box-shadow: 0 2px 10px 0 rgba(235,235,235,0.50);
    .text {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #666666;
    }
  }
  .thumbnails-box {
    display: block;
    height: 160px;
    background: #061521;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    box-shadow: 0px 0px 1px 0 #C6CBD4;
    .thumbnails {
      object-fit: cover;
      height: 160px;
      width: 100%;
    }
  }
  .card-tool {
    position: relative;
    height: 40px;
    line-height: 40px;
    display: flex;
    overflow: hidden;
    margin: 0 10px;
    font-size: 14px;
  }
</style>
