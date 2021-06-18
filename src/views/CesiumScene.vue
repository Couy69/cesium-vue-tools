<template>
  <div class="full">
    <handle></handle>
    <info></info>
    <div id="cesiumContainer"></div>
    <div id="dialog" class="bubble" v-show="dialogshow">
      <!--class="bubble"-->
      <div id="tools" style="text-align : right">
        <span style="color: rgb(95, 74, 121);padding: 5px;position: absolute;left: 10px;top: 4px;">对象属性</span>
        <span class="fui-export" id="bubblePosition" style="color: darkgrey; padding:5px" title="停靠"></span>
        <span class="fui-cross" title="关闭" id="close" style="color: darkgrey;padding:5px"></span>
      </div>
      <div style="overflow-y:scroll;height:190px" id="tableContainer">
        <table id="tab">
          test
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import info from "./info.vue";
import handle from "./handle.vue";
import { assist } from "@/assets/js/assist";
import { eventHandle } from "@/assets/js/eventHandle";
import { entityLoad } from "@/assets/js/entityLoad";
import { modelLoad } from "@/assets/js/modelLoad";
import { patrolExample } from "@/assets/js/patrolExample";
export default {
  name: "CesiumScene",
  data() {
    return {
      dialogshow: false,
      initialPosition: {},
      movePosition: {},
      cartesian:{},
    };
  },
  mixins: [assist, eventHandle, modelLoad, entityLoad, patrolExample],
  mounted() {
    this.init();
  },
  components: { info, handle },
  beforeDestroy() {},
  methods: {
    init() {
      // 初始化CISIUM实列
      this.viewerDefaultProperty = {
        requestRenderMode: true,
        animation: false, // 控制场景动画的播放速度控件
        timeline: false, // 时间滚动条控件
        geocoder: false, //是否显示geocoder小器件，右上角查询按钮
        homeButton: false, // 默认相机位置控件
        navigationHelpButton: false, // 默认的相机控制提示控件
        baseLayerPicker: false, // 底图切换控件
        fullscreenElement: "cesiumContainer",
        fullscreenButton: false,
        shouldAnimate: true,
        timeline: true,
        // shouldAnimate: false,
        // clockViewModel: new Cesium.ClockViewModel(clockT),
        infoBox: false,
        selectionIndicator: false,
        sceneModePicker: false,
        shadows: false,
        // maximumRenderTimeChange:0.5,
        //去黑色背景
        // skyAtmosphere: false,
        contextOptions: this.dropBackground
          ? {
              webgl: {
                alpha: true,
              },
            }
          : {},
        //地图图层
        //线上地图
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        }),

        // 使用离线地图
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //   url: 'http://localhost:233/{z}/{x}/{reverseY}.png',
        //   fileExtension: "png"
        // })
      };

      //设置Veiwer属性
      for (let property in this.viewerProperty) {
        this.viewerDefaultProperty[property] = this.viewerProperty[property];
      }
      // https://cesium.com/ion/tokens 注册账号自己申请
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YmM5NzUzMC1kZDU4LTQ0ZDAtYmJiZC1kZjVjZDI5NjI2ZjIiLCJpZCI6MTM1MTQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjM0MTU0ODZ9.EvJQ4fnRJn98ZRo6bG-ThXouP72id7nR7jP-_yIpOOg";

      // 将viewer挂载至window对象，如果放入data中，会占用大量内存，而且帧率降低
      window.viewer = new Cesium.Viewer("cesiumContainer", this.viewerDefaultProperty);

      viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权

      viewer.enableLighting = true;

      if (!_Gconfig.needDirectionalLight) {
        // DirectionalLight 表示 从无限远的地方向单一方向发射的光。
        viewer.scene.light = new Cesium.DirectionalLight({
          direction: new Cesium.Cartesian3(0.354925, -0.890918, -0.283358),
        });
      }

      // cesium实例加载完成，添加底部经纬度检测
      this.footerViewer = this.findComponentDownward(this, "info");
      this.footerViewer.OnInit();

      // 视角飞入
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(112.876542, 28.237326, 1800),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0,
        },
        duration: 1.5,
      });

      // 鼠标左键单击
      viewer.screenSpaceEventHandler.setInputAction((e) => {
        this.leftClick(e);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //鼠标左键按下
      viewer.screenSpaceEventHandler.setInputAction((e) => {
        this.leftDown(e);
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      //鼠标左键按下
      viewer.screenSpaceEventHandler.setInputAction((e) => {
        this.leftUp(e);
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      viewer.scene.globe.enableLighting = false; //关闭光照
      viewer.shadows = false; //关闭阴影

      this.entitysLoad(); //加载所有entitys
      this.modelsLoad(); //加载所有模型

      this.patrolExample(); // 巡逻示例

      //每帧渲染结束监听
      viewer.scene.postRender.addEventListener((e) =>{
        if (this.initialPosition != this.movePosition) {
          this.movePosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, this.cartesian);
          var popw = document.getElementById("dialog").offsetWidth;
          var poph = document.getElementById("dialog").offsetHeight;

          var trackPopUpContent_ = document.getElementById("dialog");
          //trackPopUpContent_.style.visibility = "visible";
          trackPopUpContent_.style.left = this.movePosition.x - (popw + 50) + "px";
          trackPopUpContent_.style.top = this.movePosition.y - (poph + 50) + "px";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.full {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#testVideo {
  width: 320px;
  height: 200px;
  position: fixed;
  z-index: 11;
  top: 0;
  transform: rotate3d(2, -1, -1, -0.2turn);
}

#dialog {
  top: 0;
  left: 82%;
  display: block;
  width: 400px;
  position: absolute;
  background: #fff;
}
</style>
