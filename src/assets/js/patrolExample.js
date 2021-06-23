/**
 * cesium 巡逻示例相关代码
 * @author couy
 */
import * as Cesium from "cesium/Cesium";

export const patrolExample = {
  methods: {
    patrolExample(){
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
            Cesium.Cartesian3.fromDegrees(112.88643456899663, 28.237171411168728, 2.5),
            Cesium.Cartesian3.fromDegrees(112.8866341287232, 28.23717404979647, 2.5),
            Cesium.Cartesian3.fromDegrees(112.8868128388637, 28.237179325835005, 2.5),
            Cesium.Cartesian3.fromDegrees(112.88698857013732, 28.237176688325775, 2.5),
            Cesium.Cartesian3.fromDegrees(112.88712855940223, 28.237160861729745, 2.5),
            Cesium.Cartesian3.fromDegrees(112.88714643047875, 28.237023697574656, 2.5),
            Cesium.Cartesian3.fromDegrees(112.887140473631, 28.236873344725467, 2.5),
            Cesium.Cartesian3.fromDegrees(112.88714643070237, 28.236728267521638, 2.5),
            Cesium.Cartesian3.fromDegrees(112.88714156363174, 28.236609664551338, 9.7),
            Cesium.Cartesian3.fromDegrees(112.88713962197423, 28.23651226651333, 15.9),
            Cesium.Cartesian3.fromDegrees(112.88714305029052, 28.236412385805668, 21.9),
            Cesium.Cartesian3.fromDegrees(112.88714343972848, 28.23627804598346, 21.9),
            Cesium.Cartesian3.fromDegrees(112.88714057997099, 28.236184335957958, 21.9),
            Cesium.Cartesian3.fromDegrees(112.88714058008242, 28.236057700892992, 21.9),
            Cesium.Cartesian3.fromDegrees(112.88721493558508, 28.23596905647566, 21.9),
            Cesium.Cartesian3.fromDegrees(112.88736650618804, 28.235948794978185, 21.9),
            Cesium.Cartesian3.fromDegrees(112.88755525409455, 28.23595639289226, 21.9),
            Cesium.Cartesian3.fromDegrees(112.88769538479933, 28.235958925302636, 21.9),
            Cesium.Cartesian3.fromDegrees(112.88784981442811, 28.23595385946068, 21.9),
          ],
          width: 10,
          material: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.DEEPSKYBLUE,
            glowPower: 0.25,
          }),
        },
      });

      var myPositions = [
        [112.88643456899663, 28.237171411168728, 4.5],
        [112.8866341287232, 28.23717404979647, 4.5],
        [112.8868128388637, 28.237179325835005, 4.5],
        [112.88698857013732, 28.237176688325775, 4.5],
        [112.88712855940223, 28.237160861729745, 4.5],
        [112.88714643047875, 28.237023697574656, 4.5],
        [112.887140473631, 28.236873344725467, 4.5],
        [112.88714643070237, 28.236728267521638, 4.5],
        [112.88714156363174, 28.236609664551338, 11.7],
        [112.88713962197423, 28.23651226651333, 17.9],
        [112.88714305029052, 28.236412385805668, 23.9],
        [112.88714343972848, 28.23627804598346, 23.9],
        [112.88714057997099, 28.236184335957958, 23.9],
        [112.88714058008242, 28.236057700892992, 23.9],
        [112.88721493558508, 28.23596905647566, 23.9],
        [112.88736650618804, 28.235948794978185, 23.9],
        [112.88755525409455, 28.23595639289226, 23.9],
        [112.88769538479933, 28.235958925302636, 23.9],
        [112.88784981442811, 28.23595385946068, 23.9],
      ];
      function trackView() {
        //Set bounds of our simulation time
        var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
        var stop = Cesium.JulianDate.addSeconds(start, myPositions.length - 1, new Cesium.JulianDate());

        //Make sure viewer is at the desired time.
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
        viewer.clock.multiplier = 0.8;

        //Set timeline to simulation bounds
        viewer.timeline.zoomTo(start, stop);

        //Generate a random circular pattern with varying heights.
        function computeCirclularFlight() {
          var property = new Cesium.SampledPositionProperty();
          //设置插入选项
          property.setInterpolationOptions({
            // interpolationDegree: 2,
            // interpolationAlgorithm: Cesium.LinearApproximation,

            //interpolationDegree: 2,
            //interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,

            interpolationDegree: 3,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
          });
          for (var i = 0; i < myPositions.length; i++) {
            var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
            var position = Cesium.Cartesian3.fromDegrees(myPositions[i][0], myPositions[i][1], myPositions[i][2]);
            property.addSample(time, position);
          }
          return property;
        }

        var position = computeCirclularFlight();

        //Actually create the entity
        var entity = viewer.entities.add({
          //Set the entity availability to the same interval as the simulation time.
          availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
              start: start,
              stop: stop,
            }),
          ]),
          //Use our computed positions
          position: position,
          //Automatically compute orientation based on position movement.
          orientation: new Cesium.VelocityOrientationProperty(position),
          model: {
            uri: "./gltf/man.glb",
            scale: 1,
          },
          //Show the path as a pink line sampled in 1 second increments.

          path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.1,
              color: Cesium.Color.YELLOW,
            }),
            width: 12,
          },
        });
        viewer.trackedEntity = entity;
      }

      //视角变换
      var matrix3Scratch = new Cesium.Matrix3();
      function getModelMatrix(entity, time, result) {
        var position = Cesium.Property.getValueOrUndefined(entity.position, time, new Cesium.Cartesian3());
        if (!Cesium.defined(position)) {
          return undefined;
        }
        var orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, new Cesium.Quaternion());
        if (!Cesium.defined(orientation)) {
          result = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, result);
        } else {
          result = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch), position, result);
        }
        return result;
      }
      var scratch = new Cesium.Matrix4();
      var renderListener = function(e) {
        //viewer.camera.positionCartographic.height = 2000 + $this.limitCamera(f_property);
        if (viewer.trackedEntity) {
          getModelMatrix(viewer.trackedEntity, viewer.clock.currentTime, scratch);

          var transformX = 1; //距离运动点的距离（后方）
          var transformZ = 0; //距离运动点的高度（上方）
          var transformY = 0; //距离运动点的高度（侧方）
          viewer.scene.camera.lookAtTransform(scratch, new Cesium.Cartesian3(-transformX, transformY, transformZ));
        }
      };

      // 设置视角跟随（第一人称视角）
      // viewer.scene.preRender.addEventListener(renderListener);

      // 开始巡逻
      setTimeout(() => {
        trackView()
      }, 1000);
    }
  }
};