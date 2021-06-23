/**
 * cesium 巡逻示例相关代码
 * @author couy
 */
import * as Cesium from "cesium/Cesium";

export const patrolExample2 = {
  data(){
    return {
      xlLineStep: 0,
      xlLine: [
        [112.886434, 28.237180, 4.5],
        [112.887151, 28.237167, 4.5],
        [112.887149, 28.236722, 4.5],
        [112.887146, 28.236410, 23.5],
        [112.887154, 28.235970, 23.5],
        [112.887855, 28.235964, 23.5],
      ],
    }
  },
  methods: {
    patrolExample2(){
      var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(112.886735, 28.237171, 2.0));
      //gltf数据加载位置
      var model = viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
          id: "dixing",
          url: "./gltf/l.gltf", //如果为bgltf则为.bgltf
          modelMatrix: modelMatrix,
          imageBasedLightingFactor: new Cesium.Cartesian2(
            0.7,
            1.0
          ),
          scale: 2.0, //放大倍数
        })
      );

      var glowingLine = viewer.entities.add({
        name: "Glowing blue line on the surface",
        polyline: {
          positions: [
            Cesium.Cartesian3.fromDegrees(112.886434, 28.237180, 2.5),
            Cesium.Cartesian3.fromDegrees(112.887151, 28.237167, 2.5),
            Cesium.Cartesian3.fromDegrees(112.887149, 28.236722, 2.5),
            Cesium.Cartesian3.fromDegrees(112.887146, 28.236410, 22.5),
            Cesium.Cartesian3.fromDegrees(112.887154, 28.235970, 22.5),
            Cesium.Cartesian3.fromDegrees(112.887855, 28.235964, 22.5),
          ],
          width: 10,
          material: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.DEEPSKYBLUE,
            glowPower: 0.25,
          }),
        },
      });
      setTimeout(()=>{
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(112.886434, 28.237180, 4.5),
          orientation: {
            heading: Cesium.Math.toRadians(92.0),
            pitch: Cesium.Math.toRadians(0),
            roll: 0.0,
          },
          duration: 1,
        });
      },3500)
      setTimeout(()=>{
        this.cameraMoveForward = true
      },5000)
      var ellipsoid = viewer.scene.globe.ellipsoid;
      viewer.clock.onTick.addEventListener(clock => {
        var camera = viewer.camera;
        var flags = {
          looking: false,
          moveForward: false,
          moveBackward: false,
          moveUp: false,
          moveDown: false,
          moveLeft: false,
          moveRight: false
        };
        var heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(2)
        // console.log(clock)
        // if (flags.looking) {
        //   var width = canvas.clientWidth;
        //   var height = canvas.clientHeight;

        //   // Coordinate (0.0, 0.0) will be where the mouse was clicked.
        //   var x = (mousePosition.x - startMousePosition.x) / width;
        //   var y = -(mousePosition.y - startMousePosition.y) / height;

        //   var lookFactor = 0.05;
        //   camera.lookRight(x * lookFactor);
        //   camera.lookUp(y * lookFactor);
        // }

        // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
        var cameraHeight = ellipsoid.cartesianToCartographic(camera.position)
          .height;
        // console.log(this.Cartesian3ToPosition(camera.position.x,camera.position.y,camera.position.z))
        var p = this.Cartesian3ToPosition(camera.position.x, camera.position.y, camera.position.z)

        // var moveRate = cameraHeight / 100.0;
        var moveRate = 0.2;
        // console.log(moveRate)
        if (this.cameraMoveForward) {
          var a = this.xlLine[this.xlLineStep], b = this.xlLine[this.xlLineStep + 1];
          camera.moveForward(0.2);
          var dis = this.positionGetDistance(p[1], p[0], p[2], b[0], b[1], b[2])
          // 距离转向点2时 转向
          if (dis > 5) {
            this.nextPointDistance = dis
          } else {
            if (this.xlLineStep >= this.xlLine.length - 2) {
              this.cameraMoveForward = false
              return
            }
            this.xlLineStep++;
            var a = this.xlLine[this.xlLineStep], b = this.xlLine[this.xlLineStep + 1];
            var deg = this.courseAngle(b[0], b[1], a[0], a[1]), pitch = 0

            if (a[2] != b[2]) {
              pitch = this.coursePitchAngle(b[0], b[1], b[2], a[0], a[1], a[2])
            }
            console.log(this.xlLineStep)
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(a[0], a[1], a[2] + 1.5),
              orientation: {
                heading: Cesium.Math.toRadians(deg),
                pitch: Cesium.Math.toRadians(pitch || 0),
                roll: 0

              },
              easingFunction:Cesium.EasingFunction.SINUSOIDAL_IN_OUT,
              duration: 0.9
            });
          }
        }

        if (flags.moveForward) {
          // this.positionCom()
          camera.moveForward(moveRate);
        }
        if (flags.moveBackward) {
          // this.positionCom()
          camera.moveBackward(moveRate);
        }
        if (flags.moveLeft) {
          // this.positionCom()
          camera.moveLeft(moveRate);
        }
        if (flags.moveRight) {
          // this.positionCom()
          camera.moveRight(moveRate);
        }
        if (flags.moveUp) {
          camera.moveUp(moveRate);
        }
        if (flags.moveDown) {
          camera.moveDown(moveRate);
        }
        if (flags.lookLeft) {
          camera.lookRight(-0.04);
        }
        if (flags.lookRight) {
          camera.lookRight(0.04);
        }
        if (flags.lookUp) {
          camera.lookUp(0.01);
        }
        if (flags.lookDown) {
          camera.lookUp(-0.01);
        }
      });
    }
  }
};