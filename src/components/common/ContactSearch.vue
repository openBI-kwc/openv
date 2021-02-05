<template lang="pug">
  .contact-search
    .search-btn.icon &#xe659;
    ElAutocomplete.input-box(v-model="currentValue",
      :trigger-on-focus="false"
      :suffix-icon="'&#xe659;'"
      :fetch-suggestions="onQuerySearch"
      :placeholder="placeholder",
      :value-key="valueKey",
      :debounce="debounce",
      :placement="placement",
      :popper-append-to-body="false",
      @select="handleSelect")
      template(slot-scope="{ item }") {{item[valueKey]}}
  </template>
</template>
<script>
import Utils from '@public/utils'
const { setProperty } = Utils
export default {
  props: {
    width: {
      type: Number,
      default: 200
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    debounce: {
      type: Number,
      default: 300
    },
    placement: {
      type: String,
      default: 'bottom-start'
    }
  },
  data () {
    return {
      currentValue: ''
    }
  },
  created () {
    this.currentValue = this.value
  },
  mounted () {
    setProperty('searchinputwidth', this.width + 'px', this.$el)
  },
  methods: {
    onQuerySearch (queryString, callback) {
      this.$emit('onQuerySearch', queryString, callback)
    },
    handleSelect (item) {
      this.$emit('onSelectItem', item)
    }
  },
  watch: {
    currentValue: {
      handler (n, o) {
        this.$emit('input', this.currentValue, this.$el)
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

<style lang="less" scoped>
.reset {
  border: 0;
  border-radius: 0;
  padding: 0;
  margin: 0;
  background: none;
  box-shadow: none;
}
.contact-search {
  width: 210px;
  height: 30px;
  position: relative;
  border-bottom: 1px solid rgba(24,144,255,.5);
  &:focus-within {
    border-bottom: 1px solid rgba(24,144,255,1);
  }
  .search-btn {
    position: absolute;
    left:0;
    top: 0;
    width: 30px;
    font-size: 12px;
    color: #1890FF;
    line-height: 30px;
    text-align: center;
    background: rgba(0,0,0,0);
  }
  .input-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 30px;
    /deep/ .el-autocomplete-suggestion {
      .reset;
      left: 0!important;
      border: 1px solid rgba(24,144,255,1);
      border-top: 0;
      .popper__arrow {
        display: none;
      }
      .el-autocomplete-suggestion__wrap {
        padding: 0;
        li {
          padding: 0;
          text-indent: 30px;
          border-bottom: 1px solid rgba(24,144,255,1);
          box-sizing: border-box;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          color:rgba(255,255,255,.8);
          padding-right: 5px;
          background:rgba(19, 36, 57, .8);
          text-align: left;
          &:last-child {
            border-bottom: 0;
          }
        }
      }
    }
    /deep/ .el-input__suffix {
      display: none;
    }
    /deep/ .el-input__inner {
      .reset;
      text-indent: 30px;
      background: rgba(0,0,0,0);
      display: block;
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color:rgba(255,255,255,.8);
      padding-right: 5px;
      &::-webkit-input-placeholder {
        color:rgba(255,255,255,.5);
      }
      &:-moz-placeholder {
        color:rgba(255,255,255,.5);
      }
      &:-ms-input-placeholder {
        color:rgba(255,255,255,.5);
      }
    }
  }
}
</style>
