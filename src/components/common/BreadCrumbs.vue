<template lang="pug">
  //- 面包屑组件
  .bread-crumbs
    .breadcrumb
      span.crumb-column {{column}}
      i.separator >
      span.crumb-page {{page}}
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      column: '',
      page: ''
    }
  },
  created () {
    const routeName = this.$route.name
    for (const menu of this.sysmenu) {
      for (const citem of menu.children) {
        if (routeName === citem.name) {
          this.column = menu.column
          this.page = citem.text
          return
        }
      }
    }
  },
  computed: {
    ...mapState(['sysmenu'])
  }
}
</script>
<style lang="less" scoped>
  .bread-crumbs {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 30px;
    .breadcrumb {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background:rgba(24, 144, 255, .08);
      color: #FFFFFF;
      font-size: 14px;
      padding-left:20px;
      font-weight:300;
      color:rgba(33,154,242,.6);
      .separator {
        color: rgba(33,154,242,.6);
        margin: 0 10px;
      }
      .crumb-page {
        font-weight:400;
        color:rgba(33,154,242,1);
      }
    }
  }
</style>
