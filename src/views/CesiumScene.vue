<template>
  <div class="full">
    <handle></handle>
    <info></info>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import "cesium/Widgets/widgets.css";
import * as Cesium from "cesium/Cesium";
import info from "./info.vue";
import handle from "./handle.vue";
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
  components: { info, handle },
  beforeDestroy() {},
  methods: {
    leftClick(e) {
      try {
        // 获取经纬度信息
        this.footerViewer = this.findComponentDownward(this, "info");
        var lonLatAlt = this.footerViewer.lonLatAlt;

        this.$store.commit("set_sys_info", {
          type: "info",
          msg: `
          当前点击位置经纬度为：${this.footerViewer.lonLatAlt[0]},${this.footerViewer.lonLatAlt[1]}
        `,
        });

        var pickedFeature = null;
        pickedFeature = viewer.scene.pick(e.position);
        if (!pickedFeature) {
          return;
        }
        console.log(pickedFeature.primitive);
        console.log(pickedFeature.primitive.constructor.name);
        if (pickedFeature.primitive.constructor.name == "Model") {
          console.log("当前点击为Model", pickedFeature.primitive);
          this.$store.commit("set_sys_info", {
            type: "info",
            msg: `
              当前鼠标点击对象为Model,id : ${pickedFeature.primitive.id}
            `,
          });
        } else if (pickedFeature.primitive.constructor.name == "Primitive") {
          console.log("当前点击为Primitive", pickedFeature.primitive._instanceIds);
          this.$store.commit("set_sys_info", {
            type: "info",
            msg: `
              当前鼠标点击对象为Entity,id : ${pickedFeature.primitive._instanceIds[0].id}
            `,
          });
        } else if(pickedFeature.primitive.constructor.name == "Billboard") {
          this.$store.commit("set_sys_info", {
            type: "info",
            msg: `
              当前鼠标点击对象为Billboard,id : ${pickedFeature.primitive._id.id}
            `,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    leftDown(e){
      try {

        var pickedFeature = null;
        pickedFeature = viewer.scene.pick(e.position);
        if (!pickedFeature) {
          return;
        }
        if(pickedFeature.primitive.constructor.name == "Billboard") {
          console.log(pickedFeature.primitive._id);
          // 判断是否为可以拖动的点
          if(pickedFeature.primitive._id.isTabDot){
            viewer.scene.screenSpaceCameraController.enableTranslate = false;
            viewer.scene.screenSpaceCameraController.enableZoom = false;
            viewer.scene.screenSpaceCameraController.enableTilt = false;
            viewer.scene.screenSpaceCameraController.enableRotate = false;
            
            window.tabDot = pickedFeature.primitive._id  
          }
          
        }
      } catch (error) {
        console.log(error);
      }
    },
    leftUp(e){
      if(window.tabDot){
        window.tabDot = null
        viewer.scene.screenSpaceCameraController.enableTranslate = true;
          viewer.scene.screenSpaceCameraController.enableZoom = true;
          viewer.scene.screenSpaceCameraController.enableTilt = true;
          viewer.scene.screenSpaceCameraController.enableRotate = true;
      }
    },
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

      // 模型加载
      var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(112.876542, 28.237326, 2.0));
      //gltf数据加载位置
      var model = viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
          id: "test_cube1",
          url: "./gltf/cube.gltf", //如果为bgltf则为.bgltf
          modelMatrix: modelMatrix,
          scale: 2.0, //放大倍数
        })
      );

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(112.872422, 28.241525, 35),
        label: {
          text: "地图标记相关：",
          font: "16pt Source Han Sans CN", //字体样式
          fillColor: Cesium.Color.WHITE, //字体颜色
          style: Cesium.LabelStyle.FILL_AND_OUTLINE, //label样式
          outlineWidth: 4.5,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, 0),
        },
      });

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(112.87235, 28.240632, 60),
        scale: false,
        billboard: {
          image: "./img/mark-warning.png",
          width: 50,
          height: 50,
        },
        label: {
          text: "warning",
          font: "16pt Source Han Sans CN", //字体样式
          fillColor: Cesium.Color.WHITE, //字体颜色
          style: Cesium.LabelStyle.FILL_AND_OUTLINE, //label样式
          outlineWidth: 4.5,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(5, -50),
        },
      });

      // 动态立体墙
      var positions = [
        112.873067,
        28.240122,
        2,
        112.875045,
        28.240116,
        2,
        112.87507,
        28.241169,
        2,
        112.873067,
        28.241157,
        2,
        112.873067,
        28.240122,
        2,
      ];
      var p = new Cesium.Cartesian3.fromDegreesArrayHeights(positions);
      var minimumHeights = new Array(positions.length).fill(42.0);
      var num = 0,
        alp = 1;
      viewer.entities.add({
        name: "动态立体墙",
        wall: {
          show: true,
          positions: p,
          minimumHeights: minimumHeights, //设置地面高度
          material: new Cesium.ImageMaterialProperty({
            image: "./img/jianbianwall.png",
            transparent: true,
            color: new Cesium.CallbackProperty(function() {
              if (num % 2 === 0) {
                alp -= 0.005;
              } else {
                alp += 0.005;
              }
              if (alp <= 0.7) {
                num++;
              } else if (alp >= 1) {
                num++;
              }
              return Cesium.Color.WHITE.withAlpha(alp);
              //entity的颜色透明 并不影响材质，并且 entity也会透明
            }, false),
          }),
        },
      });

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(112.872439, 28.234732, 35),
        // },
        label: {
          text: "视频作为贴图：",
          font: "16pt Source Han Sans CN", //字体样式
          fillColor: Cesium.Color.WHITE, //字体颜色
          style: Cesium.LabelStyle.FILL_AND_OUTLINE, //label样式
          outlineWidth: 4.5,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, 0),
        },
      });

      // 视频贴图entity
      var videoElement = document.createElement("video");
      videoElement.src = "./1.mp4";
      videoElement.loop = true;
      videoElement.muted = true;
      videoElement.className = "tempVideo";
      videoElement.style.opacity = 0.1;
      videoElement.play();
      console.log(videoElement);
      var cyanPolygon = viewer.entities.add({
        name: "Cyan vertical polygon with per-position heights and outline",
        id: "test_entity",
        name: "cameraEntity",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
            112.871437,
            28.234432,
            5,
            112.871442,
            28.232811,
            5,
            112.874246,
            28.232824,
            5,
            112.874237,
            28.234428,
            5,
          ]),
          perPositionHeight: true,
          alpha: 0.2,
          material: videoElement,
          // material: new Cesium.ImageMaterialProperty({
          //   image: videoElement,
          //   transparent: true,
          //   alpha: 0.2,
          // }),
          stRotation: Cesium.Math.toRadians(0),
        },
      });
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(112.874237, 28.234428, 5.1),
        id:'Billboard3',
        isTabDot:true,
        tabIndex:3,
        parentEntityId: "test_entity",
        scale: false,
        billboard: {
          image: "./img/dot.png",
          width: 30,
          height: 30,
        },
      });

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

#testVideo {
  width: 320px;
  height: 200px;
  position: fixed;
  z-index: 11;
  top: 0;
  transform: rotate3d(2, -1, -1, -0.2turn);
}
</style>
