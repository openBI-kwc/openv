<template lang='pug'>
  //- 中文分词的搜索框
  .search-box
    AutoInput(v-model="currentValue", :placeholder="placeholder", :width="width")
    .icon &#xe659;
</template>

<script>
export default {
  props: ['value', 'placeholder', 'width'],
  data () {
    return {
      currentValue: ''
    }
  },
  created () {
    this.currentValue = this.value
  },
  watch: {
    currentValue: {
      handler (n, o) {
        this.$emit('input', this.currentValue)
        this.$emit('onSearch', this.currentValue)      
      },
      deep: true
    },
    value: {
      handler (n, o) {
        this.currentValue = this.value
      },
      deep: true
    }
  }
}
</script>

<style scoped lang='less'>
.search-box{
  display: flex;
  align-items: center;
  position: relative;
}
.search-content {
  width: 200px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  text-indent: 10px;
  font-size: 12px;
  background: #ffffff;
  padding-right: 20px;
  &:hover,
  &:focus {
    border: 1px solid #1890ff;
    border-radius: 2px;
  }
}
.icon {
  width: 30px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  color: #9A9A9A;
  position: absolute;
  right: 0;
  top: 0;
  text-align: center;
}
</style>
