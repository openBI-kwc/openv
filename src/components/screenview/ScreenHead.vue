// 顶部工具栏
<template lang="pug">
#component-panel-wp
  Release(
    v-if="showShare",
    :shareScreen="screenData",
    @close="showShare = false"
  )
  .content-wrapper
    .back-group(@click="back")
      .back-btn.icon &#xe624;
      span.backtext 返回
    //- 顶部选项卡
    ul.components-panel.clearfloat
      //- 饼图-----------------------------------------------------------------------------------------------------------------------------------------------------------
      li.components-multi-menu
        .top-line
        .chart-icon.icon &#xe621;
        .text 饼状图
        .aui-dow-box
          ChartTool(
            v-for="(item, index) in piechart",
            :chartData="item",
            @onClick="addNewAssembly(item)",
            @onDragStart="dragstart(item)",
            :key="index"
          )
      //- 柱图----------------------------------------------------------------------------------------------------------------------------------------------------
      li.components-multi-menu
        .top-line
        .chart-icon.icon &#xe63c;
        .text 柱状图
        .aui-dow-box
          ChartTool(
            v-for="(item, index) in barchart",
            :chartData="item",
            @onClick="addNewAssembly(item)",
            @onDragStart="dragstart(item)",
            :key="index"
          )
      //- 折线图--------------------------------------------------------------------------------------------------------------------------------------------
      li.components-multi-menu
        .top-line
        .chart-icon.icon &#xe63a;
        .text 折线图
        .aui-dow-box
          ChartTool(
            v-for="(item, index) in linechart",
            :chartData="item",
            @onClick="addNewAssembly(item)",
            @onDragStart="dragstart(item)",
            :key="index"
          )
      //- 散点图---------------------------------------------------------------------------------------------------------------------------------------------
      li.components-multi-menu
        .top-line
        .chart-icon.icon &#xe630;
        .text 散点图
        .aui-dow-box
          ChartTool(
            v-for="(item, index) in scatterchart",
            :chartData="item",
            @onClick="addNewAssembly(item)",
            @onDragStart="dragstart(item)",
            :key="index"
          )
      //- 地图图表------------------------------------------------------------------------------------------------------------------------------------------
      li.components-multi-menu
        .top-line
        .chart-icon.icon &#xe626;
        .text 地图
        .aui-dow-box
          ChartTool(
            v-for="(item, index) in mapchart",
            :chartData="item",
            @onClick="addNewAssembly(item)",
            @onDragStart="dragstart(item)",
            :key="index"
          )
      //- 其他图表-----------------------------------------------------------------------------------------------------------------------------------------
      li.components-multi-menu
        .top-line
        .chart-icon.icon &#xe7eb;
        .text 更多图表
        .aui-dow-box
          ChartTool(
            v-for="(item, index) in otherchart",
            :chartData="item",
            @onClick="addNewAssembly(item)",
            @onDragStart="dragstart(item)",
            :key="index"
          )
      //- 常用工具------------------------------------------------------------------------------------------------------------------------------------------
      li.components-multi-menu
        .top-line
        .chart-icon.icon &#xe64a;
        .text 常用工具
        .aui-dow-box
          ChartTool(
            v-for="(item, index) in toolchart",
            :chartData="item",
            @onClick="addNewAssembly(item)",
            @onDragStart="dragstart(item)",
            :key="index"
          )
      //- 素材工具------------------------------------------------------------------------------------------------------------------------------------------
      li.components-multi-menu
        .top-line
        .chart-icon.icon &#xe60c;
        .text 常用素材
        .aui-dow-box
          ChartTool(
            v-for="(item, index) in materialchart",
            :chartData="item",
            @onClick="addNewAssembly(item)",
            @onDragStart="dragstart(item)",
            :key="index"
          )
      //- 线
      li.line
      //- 收藏--------------------------------------------------------------------------------------------------------------------------------------------------------
      li.components-multi-menu
        .chart-icon.icon &#xe657;
        .text 我的收藏
        .aui-dow-box
          template(v-if="collList.length > 0")
            ChartTool(
              v-for="(item, index) in collList",
              :chartData="item",
              @onClick="addNewAssembly(item)",
              @onDragStart="dragstart(item)",
              :key="index"
            )
          Nodata(v-else)
      li.line
      li.components-multi-menu
        .chart-icon.icon &#xe657;
        .text 云组件
        .aui-dow-box
          template(v-if="colundList.length > 0")
            ColundItem(
              v-for="(item, index) in colundList",
              :chartData="item",
              @onClick="addNewAssembly(item)",
              :key="item.chartData.id"
            )
          Nodata(v-else)
    //- 发布，预览----------------------------------------------------------------------------------------------------------------------------------------------
    .global-actions
      .downLoadData.header-button(@click.stop="saveChartFile")
        .icon &#xe68b;
        .text 离线部署
      .save-all.header-button(@click.stop="saveAllScreen")
        .icon &#xe63e;
        .text 保存
      .share-button.header-button(v-if="canShare", @click.stop="release")
        .icon &#xe603;
        .text 发布
      .preview-button.header-button(@click="openPreview")
        .icon &#xe63f;
        .text 预览
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex";
import { Utils, _ as Lodash } from "@public/utils";
import chartPublicMethod from "@public/chartPublicMethod";
import { GET_SCREENDATA } from "@api/visualedit.js";
import { GET_COLLEC } from "@api/visualrelated.js";
import {
  BIND_SCREEN,
  SAVE_ALL_CHARTS,
  Export_Large,
} from "@api/visualscreen.js";
import { GET_COUNLD_LIST } from "@api/colund.js";
// barchart
import barchart from "@assets/json/chart-types/barchart";
// linechart
import linechart from "@assets/json/chart-types/linechart";
// mapchart
import mapchart from "@assets/json/chart-types/mapchart";
// materialchart
import materialchart from "@assets/json/chart-types/materialchart";
// otherchart
import otherchart from "@assets/json/chart-types/otherchart";
// piechart
import piechart from "@assets/json/chart-types/piechart";
// scatterchart
import scatterchart from "@assets/json/chart-types/scatterchart";
// toolchart
import toolchart from "@assets/json/chart-types/toolchart";
const { deBase64, enBase64, loadData } = Utils;
const $ = window.$;
export default {
  computed: {
    ...mapState({
      position: (state) => state.position,
      screen: (state) => state.screenOption,
      layer: (state) => state.layer,
      system: (state) => state.system,
    }),
  },
  data() {
    return {
      // ------------------------- 图表列表------------------------
      barchart,
      linechart,
      mapchart,
      materialchart,
      otherchart,
      piechart,
      scatterchart,
      toolchart,
      // ------------------------------------------------------------
      // 触发方式
      // click drag
      trigger: "click",
      // 当前拖拽的图表
      dragItem: null,
      // 屏幕数据
      screenData: null,
      // 大屏id
      id: deBase64(this.$route.params.id),
      // 收藏的图表
      collList: [],
      // 显示发布
      showShare: false,
      // 是否可以发布
      canShare: true,
      // 拖动
      draging: false,
      // 云组件
      colundList: [],
    };
  },
  created() {
    let { name, params } = this.$route;
    this.canShare = name === "screenediting" && params.type === "screen";
    this.getScreenInfo();
    this.getCollection();
    this.getColundList();
    // 获取收藏
    this.$eventBus.$on("GET_CHART_COLLECT", () => {
      this.getCollection();
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.dragMonitor();
    });
  },
  methods: {
    enBase64: enBase64,
    // 云组件列表
    getColundList() {
      GET_COUNLD_LIST({ page: 1, limit: 999999 }).then((result) => {
        if (result.err) return;
        this.colundList = result.data.result.map((item) => {
          const map = [];
          const { info, pluginPath } = item;
          const {
            moduleDataSet,
            cssImport,
            javascriptImport,
            moduleClassRouter,
            moduleDesc,
            moduleId,
            moduleMethodName,
            moduleParam,
            modulePicture,
          } = info;
          for (const key in moduleDataSet) {
            const item = moduleDataSet[key];
            if (item.allowed === "false") continue;
            const arr = [key, "", item.description];
            map.push(arr);
          }
          const chartData = {
            pluginPath,
            cssImport: cssImport.src,
            javascriptImport: javascriptImport.src,
            moduleClassRouter,
            moduleDesc,
            moduleId,
            moduleMethodName,
            moduleParam: moduleParam.param,
            modulePicture,
            useData: {},
          };
          return {
            chartData,
            charttype: "cloudComponent",
            comkey: item.name,
            comtype: "cloud",
            height: 600,
            name: item.info.moduleDesc,
            width: 600,
            dataOpt: { map },
          };
        });
      });
    },
    saveChartFile() {
      let screenoption = {
        data: {
          position: this.position,
          layer: this.layer,
          screenOption: this.screen,
        },
      };
      Export_Large({ data: screenoption }).then((res) => {
        if (!res.err) {
          Utils.openURL(res.data, "_self");
        }
      });
    },
    saveAllScreen() {
      const position = Object.keys(this.position).map((key) => {
        const chartOpt = this.position[key];
        // 删除数据项 复制配置
        let cloneOpt = _.cloneDeep(chartOpt);
        chartPublicMethod.filterChartField(cloneOpt);
        return cloneOpt;
      });
      let params = {
        screenid: this.id,
        screenOption: this.screen,
        position,
        layer: this.layer,
      };
      SAVE_ALL_CHARTS(params).then((res) => {
        if (!res.err) {
          this.$toasting({
            type: "success",
            message: "保存成功",
          });
        }
      });
    },
    // 增加u3d场景
    addScene(item) {
      let params = {
        scenesId: item.chartData.id,
        screenId: this.id,
      };
      BIND_SCREEN(params).then((res) => {
        if (res.err) return;
        this.addNewAssembly(item);
      });
    },
    // 获取收藏
    getCollection() {
      GET_COLLEC().then((res) => {
        if (res.err) return;
        this.collList = res.data;
      });
    },
    // 返回界面
    back() {
      let type = this.$route.params.type;
      this.$router.push({ name: "visual" });
    },
    // 获取屏幕数据
    getScreenInfo() {
      return new Promise((resolve) => {
        GET_SCREENDATA({ id: this.id }).then((resData) => {
          if (!resData.err) {
            this.screenData = resData.data;
            resolve();
          }
        });
      });
    },
    // 拖拽监控
    dragMonitor() {
      // 放下目标节点时触发事件
      $("body").on("drag", (event) => {
        const { clientX, clientY } = event.originalEvent;
        this.trigger = "drag";
        $("#cusor").css({
          left: clientX - 25 + "px",
          top: clientY - 25 + "px",
        });
        event.preventDefault();
      });
      // 阻止默认动作
      $("body").on("dragover", (event) => {
        event.originalEvent.preventDefault();
      });
      $("body").on("drop", (event) => {
        const originalEvent = event.originalEvent;
        $("#cusor").remove();
        originalEvent.preventDefault();
        if (this.trigger === "drag") this.dropAddNewAssembly(originalEvent);
      });
    },
    // 转换坐标，添加图表
    dropAddNewAssembly(event) {
      // 计算坐标
      let pos = { x: 0, y: 0 };
      let movingbox = $("#canvas-panel-wrap").children()[0];
      let scale = this.screen.scale.toFixed(2) / 10;
      const { clientX, clientY } = event;
      const { offsetLeft, offsetTop } = movingbox;
      const left = $("#layer-panel-wp").width();
      const top = $("#component-panel-wp").height();
      pos.x = Math.round((clientX - offsetLeft - left) / scale);
      pos.y = Math.round((clientY - offsetTop - top) / scale);
      // 添加
      this.dragItem && this.addNewAssembly(this.dragItem, pos);
      this.dragItem = null;
    },
    // 拖拽事件
    dragstart(item) {
      this.dragItem = item;
      const src = "./static/assets/thumbnails/" + item.comkey + ".png";
      const scale = this.screen.scale.toFixed(2) / 10;
      const $cusor = $(`<div id="cusor"></div>`).css({
        background: `url(${src}) no-repeat 0 0 / 100% 100%`,
        transform: `scale(${scale})`,
      });
      $("body").append($cusor);
    },
    // 发布
    release() {
      if (this.screenData.publish) {
        this.$toasting({
          type: "warning",
          title: "警告",
          message: "屏幕已发布！",
        });
      } else {
        this.showShare = true;
      }
    },
    // 预览
    openPreview() {
      const { href } = this.$router.resolve({
        name: "preview",
        path: "/preview",
        params: {
          id: this.enBase64(this.id),
        },
      });
      Utils.openURL(href, "_blank");
    },
    // 退出全屏
    exitFullscreen(element) {
      if (element.exitFullscreen) {
        element.exitFullscreen();
      } else if (element.msExitFullscreen) {
        element.msExitFullscreen();
      } else if (element.mozCancelFullScreen) {
        element.mozCancelFullScreen();
      } else if (element.webkitCancelFullScreen) {
        element.webkitCancelFullScreen();
      }
    },
    // 添加组件到画布
    /**
     * @param chart 图表的原始数据
     * @param pos 把组件放在那个位置
     * @param data 额外的数据 默认不需要
     */
    createChartToCanvas (chart, pos, data)  {
      chartPublicMethod.createNewChartAssembly(chart, data, pos);
      this.trigger = "click";
    },
    // 增加组件
    async addNewAssembly(chart, dragPosition) {
      // 组件类型
      const ComType = {
        ECharts: "echarts",
        Cloud: "cloud",
      };
      // 新的组件配置
      const cutchart = _.cloneDeep(chart)
      // 组件位置
      const position = this.trigger === "click" ? "" : dragPosition

      const createChartToCanvas = this.createChartToCanvas
      
      // 收藏的图表
      if (chart.collection) {
        return createChartToCanvas(cutchart, position);
      }

      // Echarts的图表，需要请求数据了之后再创建
      if (chart.comtype === ComType.ECharts) {
        const url = `./static/assets/echartsChartJson/${chart.comkey}.json`;
        const chartConfig = await loadData(url)
        return createChartToCanvas(cutchart, position, chartConfig);
      }

      // 云组件增加
      if (chart.comtype === ComType.Cloud) {
        return createChartToCanvas(cutchart, position);
      }

      // 其他组件
      createChartToCanvas(cutchart, position);
    },
  },
  beforeDestroy() {
    $("body").off("drag");
    $("body").off("dragover");
    $("body").off("drop");
  },
};
</script>

<style lang="less" scoped>
@keyframes slide {
  0% {
    opacity: 0;
    top: 0;
    visibility: hidden;
  }
  100% {
    opacity: 1;
    top: 60px;
    visibility: visible;
  }
}
.line {
  width: 1px;
  height: 35px;
  background: #585555;
  margin: 0 10px;
}
.create {
  border: 1px solid #f5e46c;
  /deep/ .name {
    color: #f5e46c !important;
  }
}
.content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 1.2em;
  justify-content: flex-start;
  align-items: center;
  background: rgba(27, 31, 36, 0.2);
  color: #ffffff;
  flex: 1;
  .back-group {
    height: 60px;
    line-height: 60px;
    position: relative;
    left: 15px;
    top: 0;
    .back-btn {
      width: 30px;
      cursor: pointer;
      text-align: center;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
    }
    .backtext {
      font-size: 14px;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
  }
}
.components-panel {
  height: 100%;
  position: relative;
  left: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  .chart-icon {
    display: block;
    margin: 0 auto;
    margin-top: 8px;
    line-height: 20px;
  }
  .text {
    position: relative;
    height: 24px;
    width: 56px;
    margin: 0 auto;
    bottom: -5px;
    background: rgba(0, 0, 0, 0);
    border-radius: 2px;
    font-size: 12px;
    color: #e9e9e9;
    line-height: 24px;
    text-align: center;
    // &::after {
    //   display: block;
    //   content: "";
    //   position: absolute;
    //   border: 5px solid rgba(0,0,0,0);
    //   border-bottom-color: #000;
    //   transform: translate(-50%, -10px);
    //   left: 50%;
    //   top: 0;
    // }
  }
  .components-multi-menu {
    position: relative;
    display: block;
    width: 60px;
    height: 60px;
    float: left;
    user-select: none;
    text-align: center;
    cursor: pointer;
    .top-line {
      width: 60px;
      height: 4px;
      position: absolute;
      top: 0;
      left: 0;
      display: none;
      background: #1890ff;
    }
    &:hover {
      // border-top: 2px solid #1890FF;
      background: linear-gradient(
        180deg,
        rgba(24, 144, 255, 0.4) 0%,
        rgba(24, 144, 255, 0) 100%
      );
      z-index: 99;
      .aui-dow-box {
        top: 60px;
        opacity: 1;
        display: flex;
        visibility: visible;
      }
      .top-line {
        display: block;
      }
    }
  }
}
.global-actions {
  position: absolute;
  display: flex;
  align-items: center;
  right: 0px;
  top: 0px;
}
// 工具栏
.aui-dow-box {
  display: none;
  flex-wrap: wrap;
  align-content: flex-start;
  visibility: hidden;
  opacity: 0;
  position: absolute;
  left: 50%;
  top: 0;
  animation: slide 0.5s;
  transform: translateX(-30px);
  width: 337px;
  height: 440px;
  overflow: auto;
  background: #0e1a28;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5);
  z-index: -1;
  &::after {
    display: block;
    content: "";
    clear: both;
  }
}
.header-button {
  width: 60px;
  margin-top: 8px;
  height: 45px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  .icon {
    width: 16px;
    height: 16px;
    line-height: 16px;
    color: #009bf9;
    text-align: center;
    font-size: 16px;
  }
  .text {
    line-height: 20px;
    color: #ffffff;
    margin-top: 8px;
  }
}
#component-panel-wp {
  z-index: 9;
  width: 100%;
  height: 60px;
  line-height: 60px;
}
</style>
