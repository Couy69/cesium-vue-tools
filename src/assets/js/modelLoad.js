/**
 * cesium 模型加载
 * @author couy
 */
import * as Cesium from "cesium/Cesium";

export const modelLoad = {
  methods: {
    modelsLoad(){
      console.log(_Gconfig.modelBasedLightingFactor)
      // 模型加载
      var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(112.876542, 28.237326, 2.0));
      //gltf数据加载位置
      var model = viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
          id: "test_cube1",
          url: "./gltf/cube.gltf", //如果为bgltf则为.bgltf
          modelMatrix: modelMatrix,
          imageBasedLightingFactor: new Cesium.Cartesian2(
            _Gconfig.modelBasedLightingFactor,
            1.0
          ),
          scale: 2.0, //放大倍数
        })
      );
    }
  }
};