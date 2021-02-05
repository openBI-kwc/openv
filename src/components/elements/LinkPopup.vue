<template lang="pug">
  //- 数据库连接组件新建
  .link-popup
    Popup(@close="closePopup", :text="editData ? '修改数据库连接' : '新建数据库连接'")
      .data-wrapper
        .step-box
          .step(:class="{'active': currentStep === 1}")
            .name 基本属性
          .step(:class="{'active': currentStep === 2}")
            .name 测试连接
          .step(:class="{'active': currentStep === 3}")
            .name 完成
        KeepAlive
          FirstStep(v-if="currentStep === 1" :cate="cate" :editData="editData" :databases="databases" @close="closePopup" @nextStep="nextStep")
          SecondStep(v-if="currentStep === 2" :cate="cate" :editData="editData" :sendData="sendData" @prevStep="prevStep" @nextStep="nextStep")
          ThirdStep(v-if="currentStep === 3", @close="closePopup")
</template>

<script>
import { GET_DATABASE } from '@api/datasrc.js'
export default {
  props: {
    editData: null
  },
  data () {
    return {
      currentStep: 1,
      cate: [],
      databases: [],
      sendData: null
    }
  },
  created () {
    this.getData()
  },
  methods: {
    nextStep (data) {
      this.currentStep += 1
      if (this.currentStep === 2) this.sendData = data
      if (this.currentStep === 3) this.getData()
    },
    prevStep () {
      this.currentStep -= 1
    },
    closePopup () {
      this.$emit('close')
      this.currentStep = 1
    },
    // 获取数据列表
    getData () {
      GET_DATABASE().then((data) => {
        if (!data.err) {
          this.cate = data.cate
          this.databases = data.databases
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .link-popup /deep/ .popup-content-box {
    width: 600px;
    height: 600px;
  }
  .data-wrapper {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .step-box {
    margin-top: 25px;
    margin-bottom: 50px;
    width: 100%;
    padding: 0 23px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    .step {
      position: relative;
      width:8px;
      height:8px;
      background:rgba(24,144,255,0.5);
      border-radius:50%; 
      margin-top: 15px;
      .name {
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translate(-23px, 27px);
        width:56px;
        height:20px;
        line-height: 20px;
        font-size:14px;
        color:rgba(255,255,255,0.6);
        text-align: center;
      }
      &:not(:first-child)::after {
        display: block;
        content: '';
        position: absolute;
        top: 2px;
        width: 200px;
        height: 4px;
        background: rgba(24,144,255,0.2);
        right: 12px;
        border-radius: 2px;
      }
      &.active {
        background:rgba(24,144,255,1);
        &:not(:first-child)::after {
          background:rgba(24,144,255,1);
        }
        &::before {
          display: block;
          content: '';
          position: absolute;
          left: -3px;
          top: -3px;
          border: 1px solid #1890ff;
          border-radius: 50%;
          width: 12px;
          height: 12px;
        }
        .name {
          color:rgba(255,255,255,1);
        }
      }
    }
  }
</style>
