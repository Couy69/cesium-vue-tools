<template>
  <div class="full">
    <info></info>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import info from "./info.vue";
import { assist } from "@/assets/js/assist";
export default {
  name: "CesiumScene",
  data() {
    return {};
  },
  mixins: [assist],
  mounted() {
    this.init();
  },
  components: { info },
  beforeDestroy() {},
  methods: {
    init() {
      // let viewerOption = {
      //   geocoder: false, // 地理位置查询定位控件
      //   homeButton: false, // 默认相机位置控件
      //   timeline: false, // 时间滚动条控件
      //   navigationHelpButton: false, // 默认的相机控制提示控件
      //   fullscreenButton: false, // 全屏控件
      //   scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
      //   baseLayerPicker: false, // 底图切换控件
      //   animation: false // 控制场景动画的播放速度控件
      // };
      // let viewer = new Cesium.Viewer(this.$el, viewerOption);

      this.viewerDefaultProperty = {
        requestRenderMode: true,
        animation: false,
        timeline: false,
        geocoder: false, //是否显示geocoder小器件，右上角查询按钮
        homeButton: false,
        navigationHelpButton: false,
        baseLayerPicker: false,
        fullscreenElement: "cesiumContainer",
        fullscreenButton: false,
        shouldAnimate: true,

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

        //
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

      window.viewer = new Cesium.Viewer("cesiumContainer", this.viewerDefaultProperty);
      // let viewer = new Cesium.Viewer(this.$el, viewerOption);

      viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权

      this.footerViewer = this.findComponentDownward(this, "info");
      this.footerViewer.OnInit();
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(112.876542, 28.237326, 1800),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0,
        },
        duration: 1.5,
      });


      var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(112.876542,28.237326, 2.0)); 
      //gltf数据加载位置
      var model = viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
          url: "./gltf/cube.gltf", //如果为bgltf则为.bgltf
          modelMatrix: modelMatrix,
          scale: 1.0, //放大倍数
        })
      );

      // 112.876542,28.237326
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
</style>
