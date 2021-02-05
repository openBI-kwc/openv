<template lang="pug">
  <!-- 进度条形码 -->
  .barcode-circle
    .title(:style="titleStyles") {{value.chartData.title}}
    .codemain
      .bartext(:style="nameStyles" v-if="value.chartData.nameStyle.vertical === 'top'") {{value.chartData.name}}
      .barNum(:style="valueStyles" style="top:0" v-if="value.chartData.nameStyle.vertical === 'top'") {{value.chartData.value}}
      .barBottom(:style="{color: value.chartData.iconStyle.bottomColor}")
        .icon(v-for="item in items") &#xe68a;
      .barLeft(:style="{color: value.chartData.iconStyle.leftColor, width: value.chartData.value}")
        .icon(v-for="item in items") &#xe68a;
      .bartext(:style="nameStyles" v-if="value.chartData.nameStyle.vertical === 'bottom'") {{value.chartData.name}}
      .barNum(:style="valueStyles" style="bottom:0" v-if="value.chartData.nameStyle.vertical === 'bottom'") {{value.chartData.value}}
</template>

<script>
export default {
  props: {
    value: null
  },
  data () {
    return {
      items: ['icon1', 'icon2', 'icon3', 'icon4', 'icon5', 'icon6', 'icon7', 'icon8']
    }
  },
  computed: {
    titleStyles () {
      return {
        fontSize: this.value.chartData.titleStyle.fontSize + 'px',
        lineHeight: this.value.chartData.titleStyle.height + 'px',
        color: this.value.chartData.titleStyle.color,
        fontFamily: this.value.chartData.titleStyle.fontFamily,
        fontWeight: this.value.chartData.titleStyle.fontWeight
      }
    },
    nameStyles () {
      return {
        fontSize: this.value.chartData.nameStyle.fontSize + 'px',
        lineHeight: this.value.chartData.nameStyle.height + 'px',
        color: this.value.chartData.nameStyle.color,
        fontFamily: this.value.chartData.nameStyle.fontFamily,
        fontWeight: this.value.chartData.nameStyle.fontWeight
      }
    },
    valueStyles () {
      return {
        fontSize: this.value.chartData.valueStyle.fontSize + 'px',
        lineHeight: this.value.chartData.valueStyle.height + 'px',
        color: this.value.chartData.valueStyle.color,
        fontFamily: this.value.chartData.valueStyle.fontFamily,
        fontWeight: this.value.chartData.valueStyle.fontWeight
      }
    }
    // iconStyle () {
    //   return {
    //     fontSize: this.value.chartData.iconStyle.fontSize + 'px'
    //   }
    // }
  }
}
</script>
<style lang="less" scoped>
.barcode-circle{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  .title {
    text-align: center;
  }
  .codemain {
    width: 100%;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    .bartext {
      position: relative;
    }
    .barNum {
      position: absolute;
      right: 0;
    }
    .barBottom {
      width: 100%;
      height: 50px;
      position: absolute;
      overflow: hidden;
      display: flex;
    }
    .icon {
      font-size: 60px;
    }
    .barLeft {
      height: 50px;
      position: relative;
      left: 0;
      overflow: hidden;
      display: flex;
    }
  }
}
</style>
