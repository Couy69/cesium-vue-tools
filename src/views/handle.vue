<template>
  <div>
    <div id="handle">
      <div class="cate">
        <div class="title">地图相关</div>
        <div class="btn">模型加载</div>
        <div class="btn">设置entitys</div>
      </div>
    </div>
  </div>
</template>
<script>
import HelperUtils from "../assets/js/utils";
import * as Cesium from "cesium/Cesium";
export default {
  name: "handle",
  props: {
    cesiumViewer: {},
    polylineNode: {
      default: false,
    },
    polygonNode: {
      default: true,
    },
    
  },
  data() {
    return {
      sysInfo: {},
      level: 0, // 地图层级
      cameraHeight: 0, // 相机高度
      lonLatAlt: 0, // 经纬高度
    };
  },
  methods: {
    OnInit() {
      viewer = window.viewer;
      // 显示地图层级及相机高度
      viewer.scene.postRender.addEventListener(() => {
        // 要判断是否定义，不然会有渲染BUG
        if (!Cesium.defined(viewer.scene.globe._surface._tilesToRender[0])) return;
        // 获取层级
        this.level = viewer.scene.globe._surface._tilesToRender[0].level;
        // 获取相机高度
        this.cameraHeight = viewer.camera.positionCartographic.height.toFixed(1);
      });

      // 鼠标移动显示经纬高度
      viewer.cesiumWidget.screenSpaceEventHandler.setInputAction((e) => {
        let ray = viewer.camera.getPickRay(e.endPosition);
        let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        // 计算经纬高度
        if (Cesium.defined(cartesian)) {
          this.lonLatAlt = HelperUtils.getLonLatAlt(cartesian);
        } else {
          this.lonLatAlt = [];
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
  },
  watch: {
    sysInfo() {
      var element = document.getElementById('sysInfo')
      //渲染完成后滚至最下端
      this.$nextTick(() => {
        element.scrollTop = element.scrollHeight + 20
      })
    },
  },
  mounted() {
    this.sysInfo = this.$store.state.sysInfo
    // this.OnInit();
  },
};
</script>

<style lang="scss" scoped>
#handle {
  position: fixed;
  top: 0;
  right:0;
  width: 200px;
  padding: 20px 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: rgba($color: #000000, $alpha: 0.6);
  * {
    color: #fff;
  }
  &>div{
    margin:0 10px;
    text-shadow: 1px 1px 2px #000;
  }
}


</style>
