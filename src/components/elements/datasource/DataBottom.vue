<template lang="pug">
  .data-bottom(v-if="params")
    ExcelData(v-if="params.datatype === 'excel/csv'", :editData="editData", :params="params")
    ApiData(v-if="params.datatype === 'api'", :editData="editData", :params="params")
    WebSocketData(v-if="params.datatype === 'websocket'", :editData="editData", :params="params")
    SqlData(v-if="params.datatype === 'sql'", :editData="editData", :params="params", @showPreview="showPreview")
    CustomData(v-if="params.datatype === '自定义视图'", :editData="editData", :params="params", @showPreview="showPreview")
</template>

<script>
export default {
  props: {
    editData: null,
    params: null
  },
  methods: {
    showPreview (data) {
      this.$emit('showPreview', data)
    }
  }
}
</script>
