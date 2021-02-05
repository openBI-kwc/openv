<template lang="pug">
  .columnar-trend
    .bar-increase
      .increaseValue(:style="valueStyles") {{value.chartData.value}}
      .increasePercentage(:style="percentStyles") {{value.chartData.percent}}
    .bar-container
      .bar-inner-left(:style="{backgroundColor: value.chartData.innerStyle.leftbg, boxShadow: '0 0 15px ' + value.chartData.innerStyle.shadowColor}")
      .bar-inner-top(:style="{backgroundColor: value.chartData.innerStyle.topbg, boxShadow: '0 0 15px ' + value.chartData.innerStyle.shadowColor}")
      .bar-inner-right(:style="{backgroundColor: value.chartData.innerStyle.rightbg, boxShadow: '0 0 15px ' + value.chartData.innerStyle.shadowColor}")
      .bar-out(:style="baroutStyle")
    .bar-title(:style="titleStyles") {{value.chartData.title}}
</template>
<script>
export default {
  props: ['value'],
  computed: {
    titleStyles () {
      return {
        fontSize: this.value.chartData.titleStyle.fontSize + 'px',
        color: this.value.chartData.titleStyle.color,
        fontFamily: this.value.chartData.titleStyle.fontFamily,
        fontWeight: this.value.chartData.titleStyle.fontWeight
      }
    },
    percentStyles () {
      return {
        fontSize: this.value.chartData.percentStyle.fontSize + 'px',
        color: this.value.chartData.percentStyle.color,
        fontFamily: this.value.chartData.percentStyle.fontFamily,
        fontWeight: this.value.chartData.percentStyle.fontWeight
      }
    },
    valueStyles () {
      return {
        fontSize: this.value.chartData.valueStyle.fontSize + 'px',
        color: this.value.chartData.valueStyle.color,
        fontFamily: this.value.chartData.valueStyle.fontFamily,
        fontWeight: this.value.chartData.valueStyle.fontWeight
      }
    },
    baroutStyle () {
      return {
        height: 87 * this.value.chartData.standard / this.value.chartData.value + '%'
        // backgroundColor: this.value.chartData.baroutStyle.backgroundColor,
        // ':before': {
        //   backgroundColor: this.value.chartData.baroutStyle.backgroundColor
        // },
        // ':after': {
        //   backgroundColor: this.value.chartData.baroutStyle.backgroundColor
        // }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.columnar-trend {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
}
.bar-increase {
  width: 105%;
  display: flex;
  align-items: center;
  justify-content: center;
  .increaseValue {
    margin-right: 20px;
  }
}
.bar-title {
  margin: 0 auto;
  font-size: 24px;
}
.bar-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.bar-inner-left {
  position: absolute;
  width: 12%;
  height: 87%;
  z-index: 2;
  bottom: 8%;
  color: rgba(0,0,0,0);
  left: 45%;
  -webkit-transition: height 0.8s ease-out, bottom 0.8s ease-out;
  -moz-transition: height 0.8s ease-out, bottom 0.8s ease-out;
  -o-transition: height 0.8s ease-out, bottom 0.8s ease-out;
  -ms-transition: height 0.8s ease-out, bottom 0.8s ease-out;
  transition: height 0.8s ease-out, bottom 0.8s ease-out;
}

.bar-inner-right {
  position: absolute;
  left: 57%;
  bottom: 10.3%;
  width: 4%;
  height: 87%;
  -webkit-transform: skew(0deg, -45deg);
  -moz-transform: skew(0deg, -45deg);
  -o-transform: skew(0deg, -45deg);
  -ms-transform: skew(0deg, -45deg);
  transform: skew(0deg, -45deg);
}
.bar-inner-top {
  position: absolute;
  width: 12%;
  top: 0;
  left: 47%;
  height: 5%;
  -webkit-transform: skew(-45deg);
  -moz-transform: skew(-45deg);
  -o-transform: skew(-45deg);
  -ms-transform: skew(-45deg);
  transform: skew(-45deg);
}

.bar-out {
  position: absolute;
  width: 20%;
  bottom: 5%;
  left: 40%;
  z-index: 2;
  background-color: rgba(160, 160, 160, .1);
  color: rgba(0,0,0,0);
  -webkit-transition: height 0.8s ease-out, bottom 0.8s ease-out;
  -moz-transition: height 0.8s ease-out, bottom 0.8s ease-out;
  -o-transition: height 0.8s ease-out, bottom 0.8s ease-out;
  -ms-transition: height 0.8s ease-out, bottom 0.8s ease-out;
  transition: height 0.8s ease-out, bottom 0.8s ease-out;
}
.bar-out:before,
.bar-out:after{
  content: "";
  position: absolute;
}

.bar-out:before {
  right: -21%;
  width: 21%;
  height: 100%;
  bottom: 4%;
  background-color: rgba(160, 160, 160, .1);
  -webkit-transform: skew(0deg, -45deg);
  -moz-transform: skew(0deg, -45deg);
  -o-transform: skew(0deg, -45deg);
  -ms-transform: skew(0deg, -45deg);
  transform: skew(0deg, -45deg);
}

.bar-out:after {
  top: -10%;
  right: -13%;
  width: 100%;
  height: 9%;
  border: 2px solid rgba(255,83,83,1);
  background-color: rgba(160, 160, 160, .1);
  -webkit-transform: skew(-45deg);
  -moz-transform: skew(-45deg);
  -o-transform: skew(-45deg);
  -ms-transform: skew(-45deg);
  transform: skew(-45deg);
}
</style>
