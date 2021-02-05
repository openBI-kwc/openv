<template lang="pug">
  .kwc-customscolor-select.control-input
    .colorTitle
      .leftitle 颜色
      .rightitle 操作
    .colorList(v-for="(color, index) in colorList" :key="index")
      ColorPicker(:value="colorList[index]" @input="changeColor($event, index)")
      .icon.delbtn(@click="delColors(index)") &#xe69a;
    .addColor
      .icon.addbtn(@click="addColors") &#xe637;
</template>
<script>
import chartdata from '@public/mixin/chartdata'
export default {
  mixins: [chartdata],
  props: {
    colors: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      colorList: []
    }
  },
  created () {
    this.colorList = [...this.colorList, ...this.colors]
  },
  methods: {
    // rgb颜色随机
    rgbRandom () {
      let r = Math.floor(Math.random() * 256)
      let g = Math.floor(Math.random() * 256)
      let b = Math.floor(Math.random() * 256)
      let a = Math.random().toFixed(1)
      return `rgba(${r},${g},${b},${a})`
    },
    // 添加颜色
    addColors () {
      this.colorList.push(this.rgbRandom())
      this.$emit('sendColorList', this.colorList)
    },
    // 删除颜色
    delColors (index) {
      let nIndex = index
      let copyColorList = JSON.parse(JSON.stringify(this.colorList))
      copyColorList.splice(nIndex, 1)
      this.$emit('sendColorList', copyColorList)
      this.colorList = copyColorList
    },
    // 变化颜色
    changeColor (colorValue, index) {
      this.$set(this.colorList, index, colorValue)
      this.$emit('sendColorList', this.colorList)
    }
  }
}
</script>
<style lang="less" scoped>
  .kwc-customscolor-select {
    width: 100%;
    padding-left: 22px;
    padding-right: 22px;
    .colorTitle {
      width: 100%;
      height: 30px;
      line-height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .leftitle {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
      .rightitle {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
    .colorList {
      width: 100%;
      height: 30px;
      line-height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
      .kwc-color-picker-input {
        height: 30px;
        line-height: 30px;
      }
      .delbtn {
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
      }
    }
    .addColor {
      width: 100%;
      height: 30px;
      line-height: 30px;
      color: rgba(255, 255, 255, 0.8);
      .addbtn {
        width: 100%;
        text-align: center;
        cursor: pointer;
      }
    }
  }
</style>
