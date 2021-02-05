<template lang="pug">
  .data-pupup
    Popup.data-wp(v-show="!showPreview" @close="closePopup", :text="editData ? '修改数据源' : '新建数据源'")
      .data-wrapper
        DataContent(:editData="editData",:sourceType="sourceType" @updateParams="updateParams")
        DataBottom(:editData="editData", :params="params", @showPreview="setPreview")
    Popup.data-view-wp(v-if="showPreview && previewParams" @close="closePopup", :text="previewTitle[previewParams.datatype]")
      .data-wrapper
        //- sql的预览
        SqlPreview(v-if="previewParams.datatype === 'sql'", :isEditView="isEditView" :previewParams="previewParams" @goPrevStep="goPrevStep")
        //- 自定义视图预览
        CusPreview(v-if="previewParams.datatype === '自定义视图'", :isEditView="isEditView" :previewParams="previewParams" @goPrevStep="goPrevStep")
</template>

<script>
export default {
  props: {
    // 修改的数据
    editData: null,
    // 数据源类型
    sourceType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 参数数据
      params: null,
      // 预览的参数
      previewParams: null,
      showPreview: false,
      isEditView: false,
      previewTitle: {
        'sql': 'SQL数据源',
        '自定义视图': '自定义数据源'
      }
    }
  },
  methods: {
    // 回到上一步
    goPrevStep () {
      this.previewParams = null
      this.showPreview = false
    },
    closePopup () {
      this.$emit('close')
    },
    // 设置数据
    updateParams (data) {
      this.params = data
    },
    // 显示预览
    setPreview (data) {
      this.previewParams = data.paramsData
      this.showPreview = data.showPreview
      this.isEditView = data.isEditView
    }
  }
}
</script>
<style lang="less" scoped>
  .data-view-wp /deep/ .popup-content-box {
    width: 80vw;
    height: 80vh;
    max-width: 80vw;
    max-height: 80vw;
  }
  .data-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }
</style>
