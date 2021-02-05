// Icon配置
<template lang='pug'>
  .icon-config
    Modal.icon-modal(:show="expandModal", @close="expandModal = false" text="图标总览" @confrim="selectIcon(activeFa); activeFa = '';")
      .icon-selector
        .icon-selector__header
          label 请选择图标
        .icon-selector__body
          .icon-item(@click="activeFa = fa" :class="{'active': fa === activeFa}" v-for="(fa, index) in awesomeList" :key="index")
            i.fa(:class="fa")
    ExpandList(title="图标配置")
      .icon-selector
        .icon-selector__header
          label 请选择图标
          i.fa(:class="expandModal ? 'fa-close' : 'fa-expand'", @click="expandModal = !expandModal; activeFa = chartData.iconObj.iconClass;")
        .icon-selector__body
          .icon-item(@click="selectIcon(fa)" :class="{'active': fa === chartData.iconObj.iconClass}" v-for="(fa, index) in awesomeList" :key="index")
            i.fa(:class="fa")
      ControlItem(value="图标大小")
        NumInput(v-model="chartData.iconObj.style.fontSize" :min="9" :max="150")
      ControlItem(value="图标颜色")
        ColorPicker(v-model="chartData.iconObj.style.color")
      ControlItem(value="图标动画")
        SwitchBar(v-model="chartData.iconObj.animation")
      ControlItem(value="动画类型" v-if="chartData.iconObj.animation")
        .checks
          .item(v-for="item in anTypes")
            CheckBox.check(type="radio", v-model="chartData.iconObj.animationType", :radioActive="item.value")
            span.name {{item.name}}
    ExpandList(title="图标功能")
      ControlItem(value="图标旋转")
        Selection(v-model="chartData.rotate" :option="rotateOption")
      ControlItem(value="图标说明")
        AutoInput(v-model="chartData.hoverText")
      ControlItem(value="文本位置")
        Selection(v-model="chartData.textPos", :option="posList")
      ControlItem(value="开启链接")
        SwitchBar(:value="chartData.openURL" @onChange="changeURL")
      template(v-if="chartData.openURL")
        ControlItem(value="图标超链接")
          AutoInput(v-model="chartData.link")
        ControlItem(value="跳转方式")
          .checks
            .item(v-for="item in linksType")
              CheckBox.check(type="radio", v-model="chartData.target", :radioActive="item.value")
              span.name {{item.name}}
</template>
<script>
import Utils from '@public/utils'
import chartdata from '@public/mixin/chartdata'
import { UPLOAD_ICON } from '@api/upload.js'
import { GET_ICON, DELECT_ICON } from '@api/visualscreen.js'
import awesome from '@assets/json/awesome'
const { formParams } = Utils
export default {
  mixins: [chartdata],
  data () {
    return {
      awesomeList: awesome,
      // 窗口展示
      expandModal: false,
      activeFa: '',
      iconTypes: [
        {name: '字体', value: 'font'},
        {name: '图片', value: 'image'}
      ],
      linksType: [
        {name: '当前窗口', value: '_self'},
        {name: '新开窗口', value: '_blank'}
      ],
      anTypes: [
        {name: 'linear', value: 'linear'},
        {name: 'steps', value: 'steps(8)'}
      ],
      posList: [
        {name: '上', value: 'top'},
        {name: '右', value: 'right'},
        {name: '下', value: 'bottom'},
        {name: '左', value: 'left'}
      ],
      rotateOption: [
        {name: '不旋转', value: 'fa-rotate-normal'},
        {name: '90度', value: 'fa-rotate-90'},
        {name: '180度', value: 'fa-rotate-180'},
        {name: '270度', value: 'fa-rotate-270'}
      ]
    }
  },
  created () {
    this.chartData = this.position[this.index].chartData
  },
  methods: {
    changeURL (flag) {
      this.chartData.openURL = flag
      if (!flag) {
        this.chartData.link = ''
        this.chartData.target = '_self'
      }
    },
    // 选择图表
    selectIcon (item) {
      this.expandModal = false
      this.chartData.iconObj.iconClass = item
    }
  }
}
</script>
<style lang="less" scoped>
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
  .icon-selector {
    padding-right: 5px;
    padding-left: 20px;
  }
  .icon-selector__header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    font-size: 12px;
    i {
      display: block;
      width: 20px;
      height: 20px;
      cursor: pointer;
      line-height: 20px;
    }
  }
  .icon-selector__body {
    height: 300px;
    overflow: hidden;
    overflow-y: auto;
    width: 100%;
    padding: 10px;
    border: 1px solid #e9e9e9;
    .icon-item {
      color: #2496d8;
      float: left;
      padding: 5px;
      width: 40px;
      line-height: 30px;
      font-size: 20px;
      text-align: center;
      cursor: pointer;
      &.active, &:hover{
        color: #fff;
      }
    }
  }
  .icon-modal /deep/ .modal-box {
    width: 800px;
    .icon-selector {
      padding: 0;
    }
  }
</style>
