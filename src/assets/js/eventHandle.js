/**
 * cesium 事件处理
 * @author couy
 */
import * as Cesium from "cesium/Cesium";

export const eventHandle = {
  methods: {
    setDialogInfo(e,type,id,uniqueInfo) {
      // 设置点击弹出框相关代码
      // start
      this.clickObjInfo = {
        type:type,
        id:id,
        uniqueInfo:uniqueInfo
      }
      var scene = viewer.scene,
        camera = viewer.camera
      this.dialogshow = true

      // var position = scene.pickPosition(e.position); //单击位置
      // var positionObj = scene.pick(e.position); //选中的对象
      // this.cartesian = scene.globe.pick(camera.getPickRay(e.position), scene);
      // var picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, this.cartesian);
      
      var pick = viewer.scene.pickPosition(e.position);
      var height = Cesium.Cartographic.fromCartesian(pick).height;
      var lat = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(pick).latitude);
      var lng = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(pick).longitude);
      this.cartesian = Cesium.Cartesian3.fromDegrees(lng, lat, height)
      var picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, this.cartesian);
      console.log(`Cesium.Cartesian3.fromDegrees(${lng}, ${lat}, ${height}),`);

      this.initialPosition = {
        x: picks.x,
        y: picks.y
      }
      var bubble = document.getElementById("dialog");
      //设置弹出框位置
      bubble.style.left = e.position.x - 140 + "px";
      var divheight = bubble.offsetHeight;
      var divy = e.position.y - divheight - 50;
      bubble.style.top = divy + "px";
      // end
    },
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
        if (pickedFeature.primitive.constructor.name == "Model") {
          console.log("当前点击为Model", pickedFeature.primitive);
          this.$store.commit("set_sys_info", {
            type: "info",
            msg: `
              当前鼠标点击对象为Model,id : ${pickedFeature.primitive.id}
            `,
          });
          this.setDialogInfo(e,'Model',pickedFeature.primitive.id)

          var pick = viewer.scene.pickPosition(e.position);
          var pickModel = viewer.scene.pick(e.position);
          if (pickModel && pick && pickModel.id) {
            var height = Cesium.Cartographic.fromCartesian(pick).height;
            var lat = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(pick).latitude);
            var lng = Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(pick).longitude);
            console.log(lng, lat, height)
            // console.log(`Cesium.Cartesian3.fromDegrees(${lng}, ${lat}, ${height}),`);
            return;
            // let cartesian = Cesium.Cartesian3.fromDegrees(lng, lat, height);
            // console.log("模型高度点", cartesian);
          }

          
        } else if (pickedFeature.primitive.constructor.name == "Primitive") {
          console.log("当前点击为Primitive", pickedFeature.primitive._instanceIds);
          this.$store.commit("set_sys_info", {
            type: "info",
            msg: `
              当前鼠标点击对象为Entity,id : ${pickedFeature.primitive._instanceIds[0].id}
            `,
          });
          this.setDialogInfo(e,"Primitive",pickedFeature.primitive._instanceIds[0].id)
        } else if (pickedFeature.primitive.constructor.name == "Billboard") {
          this.$store.commit("set_sys_info", {
            type: "info",
            msg: `
              当前鼠标点击对象为Billboard,id : ${pickedFeature.primitive._id.id}
            `,
          });
          this.setDialogInfo(e,"Billboard",pickedFeature.primitive._id.id)
        }
      } catch (error) {
        console.log(error);
      }
    },
    leftDown(e) {
      try {
        var pickedFeature = null;
        pickedFeature = viewer.scene.pick(e.position);
        if (!pickedFeature) {
          return;
        }
        if (pickedFeature.primitive.constructor.name == "Billboard") {
          console.log(pickedFeature.primitive._id);
          // 判断是否为可以拖动的点
          if (pickedFeature.primitive._id.isTabDot) {
            viewer.scene.screenSpaceCameraController.enableTranslate = false;
            viewer.scene.screenSpaceCameraController.enableZoom = false;
            viewer.scene.screenSpaceCameraController.enableTilt = false;
            viewer.scene.screenSpaceCameraController.enableRotate = false;

            window.tabDot = pickedFeature.primitive._id;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    leftUp(e) {
      if (window.tabDot) {
        window.tabDot = null;
        viewer.scene.screenSpaceCameraController.enableTranslate = true;
        viewer.scene.screenSpaceCameraController.enableZoom = true;
        viewer.scene.screenSpaceCameraController.enableTilt = true;
        viewer.scene.screenSpaceCameraController.enableRotate = true;
      }
    },
  }
};