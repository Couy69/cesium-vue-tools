# 4 gltf模型处理与加载

Cesium所支持的模型数据类型目前所知的有gltf、glb、bgltf等格式的模型数据，但是这些仍然还算不上是很好找的模型，一般都需要由别的格式处理得到gltf或者glb

## 模型处理

建议加载模型前，使用[gltf-viewer](https://gltf-viewer.donmccurdy.com/),验证模型可用性。

另外模型文件不能含有中文命名，贴图mtl文件也不能有中文命名

1. 建议直接使用软件导出为gltf格式

1. 如果建模文件为obj，fbx等，可以利用[obj2gltf](https://github.com/AnalyticalGraphicsInc/obj2gltf)或者[objTo3d-tiles](https://github.com/PrincessGod/objTo3d-tiles)转为gltf或者glb

### objTo3d-tiles使用

我这里用的是objTo3d-tiles，使用方式如下，将对应的obj与mtl复制到objTo3d-tiles对应文件夹转换即可。

* Convert `.obj` to `.gltf`

``` sh
obj23dtiles -i ./bin/barrel/barrel.obj
// Export barrel.gltf at obj folder.
```

* Convert `.obj` to `.glb`

``` sh
obj23dtiles -i ./bin/barrel/barrel.obj -b
// Export barrel.glb at obj folder.
```

## 模型加载

下面的代码是示例，详细参数请翻阅官方文档

``` js
// 模型加载
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(115.876542, 28.237326, 2.0));
//gltf数据加载位置
var model = viewer.scene.primitives.add(
  Cesium.Model.fromGltf({
    id:'test_cube1',
    url: "./gltf/cube.gltf", //如果为bgltf则为.bgltf
    modelMatrix: modelMatrix,
    scale: 1.0, //放大倍数
  })
);
```