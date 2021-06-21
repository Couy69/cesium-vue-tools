/**
 * cesium entity加载
 * @author couy
 */
import * as Cesium from "cesium/Cesium";

export const entityLoad = {
  methods: {
    entitysLoad(){
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
        position: Cesium.Cartesian3.fromDegrees(112.871437, 28.234432, 5.1),
        id: "Billboard1",
        isTabDot: true,
        tabIndex: 0,
        parentEntityId: "test_entity",
        scale: false,
        billboard: {
          image: "./img/dot.png",
          width: 30,
          height: 30,
        },
      });
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(112.871442, 28.232811, 5.1),
        id: "Billboard2",
        isTabDot: true,
        tabIndex: 1,
        parentEntityId: "test_entity",
        scale: false,
        billboard: {
          image: "./img/dot.png",
          width: 30,
          height: 30,
        },
      });
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(112.874246, 28.232824, 5.1),
        id: "Billboard3",
        isTabDot: true,
        tabIndex: 2,
        parentEntityId: "test_entity",
        scale: false,
        billboard: {
          image: "./img/dot.png",
          width: 30,
          height: 30,
        },
      });
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(112.874237, 28.234428, 5.1),
        id: "Billboard4",
        isTabDot: true,
        tabIndex: 3,
        parentEntityId: "test_entity",
        scale: false,
        billboard: {
          image: "./img/dot.png",
          width: 30,
          height: 30,
        },
      });
    }
  }
};