// 跑马灯配置
<template lang='pug'>
  .config
    ExpandList(title="全局配置")
      ControlItem(value="字体")
        Selection(v-model="chartData.style.fontFamily", :option="fontFamily")
      ControlItem(value="字号")
        NumInput(:min="0", v-model="chartData.style.fontSize")
      ControlItem(value="颜色")
        ColorPicker(v-model="chartData.style.color")
      ControlItem(value="字体粗细")
        Selection(v-model="chartData.style.fontWeight", :option="fontWeight")
      ControlItem(value="滚动速度")
        NumInput(:min="30", v-model="chartData.speed")
    ExpandList(title="超链接")
      ControlItem(value="开启超链接")
        SwitchBar(v-model="chartData.hexLink.open")
      template(chartData.hexLink.open)
        ControlItem(value="链接地址")
          AutoInput(v-model="chartData.hexLink.link")
        ControlItem(value="打开方式")
          .checks
            .item(v-for="item in linksType")
              CheckBox.check(type="radio", v-model="chartData.hexLink.target", :radioActive="item.value")
              span.name {{item.name}}
</template>
<script>
import multiplechoice from '@assets/json/multiplechoice'
import chartdata from '@public/mixin/chartdata'
const {fontFamily, fontWeight} = multiplechoice
export default {
  mixins: [chartdata],
  data () {
    return {
      fontFamily,
      fontWeight,
      linksType: [
        {name: '当前窗口', value: '_self'},
        {name: '新开窗口', value: '_blank'}
      ]
    }
  },
  watch: {
    'chartData.hexLink.open' (n, o) {
      this.changeHexLink(n)
    }
  },
  methods: {
    changeHexLink (value) {
      if (!value) {
        this.chartData.hexLink = {
          open: false,
          link: '',
          target: '_self'
        }
      }
    }
  }
}
</script>
<style lang="less" soped>
  .checks {
    width: 170px;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .item {
      width: 50%;
      display: flex;
      align-items: center;
      .name {
        margin:0 5px;
        color: rgba(255,255,255,.8)
      }
    }
  }
</style>
