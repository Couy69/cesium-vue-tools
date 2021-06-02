<template>
  <div>
    <div id="footer">
      <div id="level"><span>地图层级：</span>{{ level || 0 }}</div>
      <div id="cameraHeight"><span>视距：</span>{{ cameraHeight || 0 }}m</div>
      <div id="lonLatHeight"><span>经度：</span>{{ lonLatAlt[0] || 0 }}°</div>
      <div id="cameraHeight"><span>纬度：</span>{{ lonLatAlt[1] || 0 }}°</div>
      <div>{{ lonLatAlt[0] }},{{ lonLatAlt[1] }}</div>
    </div>
    <div class="sysInfo">
      <div id="sysInfo">
        <div
          class="info warning"
          :class="{ warning: v.type == 'warning', battle: v.type == 'battle', win: v.type == 'win', trophy: v.type == 'trophy' }"
          v-for="(v, k) in sysInfo"
          :key="k"
        >
          提示<i style="font-size:.12rem" v-if="v.time">({{ v.time }})</i>：
          <span>{{ v.msg }}</span>
        </div>
      </div>  
    </div>
    
  </div>
</template>
<script>
import HelperUtils from "../assets/js/utils";
import * as Cesium from "cesium/Cesium";
export default {
  name: "info",
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
#footer {
  position: fixed;
  bottom: 0;
  left: 450px;
  width: auto;
  height: 20px;
  padding: 10px 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  * {
    color: #fff;
  }
  &>div{
    margin:0 10px;
    text-shadow: 1px 1px 2px #000;
  }
}
.sysInfo{
  border-top-right-radius: 10px;
  box-shadow: 0 0 10px 1px rgba($color: #000000, $alpha: 0.5);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 450px;
  height: 500px;
  padding: 10px;
  z-index: 10;
  background: rgba($color: #000000, $alpha: 0.6);
}
#sysInfo {
  width:100%;
  height: 100%;
  overflow-y: auto;
  transition: 0.2s;
  display: flex;
  
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  *{
    color:#fff;
  }
  span{
    color:rgb(197, 197, 197);
    text-shadow: 0px 0px 1px #fff;
    font-size: 13px;
    line-height: 22px;
    height:22px;
  }
  .info {
    margin: 3px 0;
    line-height: 22px;
  }
  .warning > span {
    color: #ff6a6a;
  }
  .info > span {
    color: #f5f5f5;
  }
  .success > span {
    color: #70f358;
  }
}
</style>
