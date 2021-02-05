<template lang="pug">
  //- 分页栏组件
  .paging-wrap(v-if='totalPages > 1')
      ul.page-list
        //- first
        li(:class="['paging-item', 'paging-item--first', {'paging-item--disabled' : index === 1}]" @click="first") <<
        //- prev
        li(:class="['paging-item', 'paging-item--pev', {'paging-item--disabled' : index === 1}]", @click='prev') <
        li(:class="['paging-item', 'paging-item--more']", v-if='showPrevMore') ...    
        li(:class="['paging-item', {'paging-item--current' : index === pager}]", v-for='(pager, pindex) in pagers', :key='pindex', @click='go(pager)') {{ pager }} 
        li(:class="['paging-item', 'paging-item--more']", v-if='showNextMore') ...
        //- next
        li(:class="['paging-item', 'paging-item--next', {'paging-item--disabled' : index === pages}]", @click='next') >
        //- last
        li(:class="['paging-item', 'paging-item--last', {'paging-item--disabled' : index === pages}]" @click="last") >>
      .page-jump
        span.text 跳至
        input.jump-input(type='number', @blur="toPage", :value="toPageNum", @input="checkPageNum" @keyup.enter="toPage")    
        span.text 页
</template>
<script>
export default {
  data () {
    return {
      index: this.pageIndex, // 当前页码
      limit: this.pageSize, // 每页显示条数
      size: this.total || 0, // 总记录数
      showPrevMore: false,
      showNextMore: false,
      toPageNum: '',
      totalPages: Math.ceil(this.total / this.pageSize)
    }
  },
  // 通过props来接受从父组件传递过来的值
  props: {
    // 页面中的可见页码，其他的以...替代, 必须是奇数
    perPages: {
      type: Number,
      default: 3
    },
    // 当前页码
    pageIndex: {
      type: Number,
      default: 1
    },
    // 每页显示条数
    pageSize: {
      type: Number,
      default: 5
    },
    // 总记录数
    total: {
      type: Number,
      default: 5
    }
  },
  computed: {
    // 计算总页码
    pages () {
      return Math.ceil(this.size / this.limit)
    },
    // 计算页码，当count等变化时自动计算
    pagers () {
      let array = []
      let perPages = this.perPages
      let pageCount = this.pages
      let current = this.index
      let _offset = (perPages - 1) / 2
      let offset = {
        start: current - _offset,
        end: current + _offset
      }
      if (offset.start < 1) {
        offset.end = offset.end + (1 - offset.start)
        offset.start = 1
      }
      if (offset.end > pageCount) {
        offset.start = offset.start - (offset.end - pageCount)
        offset.end = pageCount
      }
      if (offset.start < 1) offset.start = 1
      /* eslint-disable vue/no-side-effects-in-computed-properties */
      this.showPrevMore = (offset.start > 1)
      this.showNextMore = (offset.end < pageCount)
      for (let i = offset.start; i <= offset.end; i++) {
        array.push(i)
      }
      return array
    }
  },
  methods: {
    prev () {
      if (this.index > 1) {
        this.go(this.index - 1)
      }
    },
    next () {
      if (this.index < this.pages) {
        this.go(this.index + 1)
      }
    },
    first () {
      if (this.index !== 1) {
        this.go(1)
      }
    },
    last () {
      if (this.index !== this.pages) {
        this.go(this.pages)
      }
    },
    go (page) {
      if (this.index !== page) {
        this.index = page
        // 父组件通过change方法来接受当前的页码
        this.$emit('change', this.index)
      }
    },
    // 手动跳转
    toPage (e) {
      let numreg = /^[0-9]+.?[0-9]*$/
      if (!numreg.test(this.toPageNum)) return
      let page = parseInt(this.toPageNum)
      this.go(page)
    },
    checkPageNum (e) {
      let val = e.target.value
      const regex = /^[0-9]*[1-9][0-9]*$/
      let f = regex.test(val)
      if (!regex.test(val)) {
        e.target.value = ''
      } else {
        this.toPageNum = val
        let page = parseInt(this.toPageNum)
        if (parseInt(this.toPageNum) >= this.totalPages) {
          this.toPageNum = this.totalPages + ''
          e.target.value = this.totalPages + ''
        }
      }
    }
  },
  watch: {
    pageIndex (val) {
      this.index = val || 1
    },
    pageSize (val) {
      this.limit = val || 10
    },
    total (val) {
      this.size = val || 1
      this.totalPages = Math.ceil(this.total / this.pageSize)
    }
  }
}
</script>

<style lang="less" scoped>
  .paging-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 300px;
    height: 33px;
    line-height: 33px;
  }
  .page-jump {
    display: flex;
    align-items: center;
    margin-left: 20px;
    .text {
      font-size:14px;
      color: #ffffff;
      font-weight: 300;
    }
    .jump-input {
      margin: 0 10px;
      width: 33px;
      height: 33px;
      background: #192A42;
      border: 1px solid #214A88;
      text-align: center;
      line-height: 33px;
      -moz-appearance: textfield;
      color: #ffffff;
      font-size:14px;
      &:focus {
        border: 1px solid #1890FF;
      }
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
    }
  }
  .page-list {
    display: flex;
    font-size: 12px;
    user-select: none;
    list-style: none;
    .paging-item {
      width: 33px;
      height: 33px;
      line-height: 33px;
      text-align: center;
      background: #192A42;
      border: 1px solid #214A88;
      cursor: pointer;
      font-size: 12px;
      color: #8C96A1;
      user-select: none;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      // 更多和禁用
      &.paging-item--disabled {
        color: rgba(102, 102, 102, .75);
        &:hover {
          cursor: not-allowed;
        }
      }
      &.paging-item--more{
        color: #FFFFFF;
        cursor: default;
        &:hover {
          cursor: not-allowed;
        }
      }
      //选中和悬浮
      &.paging-item--current {
        cursor: default;
        background: #52A8F8;
        color: #FFFFFF;
      }
    }
  }
</style>
