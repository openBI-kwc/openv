// 图片配置
<template lang='pug'>
  .image-config
    Modal.tool-box(:show="useLocalImg", :showFooter="false", @close="useLocalImg = false" text="图片列表")
      .img-list(v-if="bgimglist.length > 0")
        .img-box(v-for="item in bgimglist", @click="addNewImg(item)", :key="item.id")
          img.img(:src="setting.server + item.url")
      Nodata(v-else)
      Paging.page-box(slot="footer" :page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
    ExpandList(title="图片配置")
      ControlItem(value="在线地址")
        AutoInput(v-model="chartData.url")
      .control-entry
        Dropzone.upload-pane(type="file", @getFile="uploadBackground", accept="image/jpeg,image/png,image/bmp,image/gif,image/svg+xml")
          .show-image(v-if="chartData.url")
            img.images(:src="chartData.url")
          template(v-else)
            .icon &#xe61e;
            .text 点击或拖拽文件到这里选择
      ControlItem(value="使用本地素材")
        .local-button(@click="useLocalImg = true; getImgList()") 点击选择
      ControlItem(value="旋转角度")
        Selection(v-model="chartData.style.rotate", :option="rotate")
      ControlItem(value="展示方式")
        Selection(v-model="chartData.style.backgroundSize", :option="backgroundSize")
      ControlItem(value="透明度(1-10)")
        NumInput(:max="10", :step="1", :precision="1", v-model="chartData.style.opacity")
</template>
<script>
import { GET_ATTLIST } from '@api/system.js'
import { UPLOAD_IMG } from '@api/upload.js'
import chartdata from '@public/mixin/chartdata'
import Utils from '@public/utils'
import { mapState } from 'vuex'
const Dropzone = () => import('dropzone-puge')
const { formParams } = Utils
export default {
  mixins: [chartdata],
  components: {
    Dropzone
  },
  data () {
    return {
      useLocalImg: false,
      bgimglist: [],
      backgroundSize: [
        {
          name: '全屏铺满',
          value: '100% 100%'
        },
        {
          name: '适应内容区域',
          value: 'contain'
        }
      ],
      rotate: [
        {
          name: '0度',
          value: '0deg'
        },
        {
          name: '90度',
          value: '90deg'
        },
        {
          name: '180度',
          value: '180deg'
        },
        {
          name: '270度',
          value: '270deg'
        }
      ],
      currentPage: 1,
      total: 0,
      pageSize: 20
    }
  },
  created () {
    this.chartData = this.position[this.index].chartData
  },
  computed: {
    ...mapState(['setting'])
  },
  methods: {
    // 分页
    pageChange (page) {
      this.currentPage = parseFloat(page)
      this.getImgList()
    },
    // 上传图片
    uploadBackground (e) {
      let params = formParams(e, 'image')
      UPLOAD_IMG(params).then(response => {
        if (response.err) return
        this.chartData.url = this.setting.server + response.data.url
      })
      e.target.value = ''
    },
    // 增加图片组件方法
    addNewImg (item) {
      this.chartData.url = this.setting.server + item.url
      this.useLocalImg = false
    },
    getImgList () {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      } 
      // 获取自定义图片列表
      GET_ATTLIST(params).then((responseData) => {
        if (responseData.err) return
        let res = responseData.data
        this.bgimglist = res.list
        this.total = res.total
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .img-list {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .img-box .img {
      cursor: pointer;
      margin: 10px;
      height: 150px;
      width: 150px;
      object-fit: cover;
    }
  }
  .local-button {
    cursor: pointer;
    width: 170px;
    height: 30px;
    line-height: 30px;
    color: #1890FF;
    text-align: center;
    font-weight: 400;
    background: rgba(0,0,0,0);
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
  }
  .page-box {
    width: 100%;
    justify-content: center;
  }
  .show-image, .images {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .image-config /deep/ .upload-pane {
    height: 130px;
    width: 100%;
    margin: 10px 0;
    background: #131212;
    border: 1px solid #e9e9e9;
    cursor: pointer;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .icon {
      color: #219af2;
      font-size: 2rem;
      width: 24px;
      height: 28px;
      text-align: center;
      margin: 0 auto;;
    }
    .text {
      font-size: 12px;
      height: 20px;
      color: #ffffff;
      text-align: center;
      margin-top: 15px;
    }
  }
</style>
