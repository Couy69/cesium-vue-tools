/**
 * cesium 基础方法
 * @author couy
 */

 import * as Cesium from "cesium/Cesium";

export default {
  methods: {
    //经纬度转笛卡尔坐标
    positionToCartesian3(position) {
      // position  [纬度，经度，高度]
      var ellipsoid = viewer.scene.globe.ellipsoid;

      var cartographic = Cesium.Cartographic.fromDegrees(
        position[1],
        position[0],
        position[2]
      );

      var cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
      return cartesian3;
    },
    //笛卡尔坐标转纬经度
    Cartesian3ToPosition(c1, c2, c3) {
      var ellipsoid = viewer.scene.globe.ellipsoid;

      var cartesian3 = new Cesium.Cartesian3(c1, c2, c3);

      var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
      var lat = +Cesium.Math.toDegrees(cartographic.latitude).toFixed(6); //纬度

      var lng = +Cesium.Math.toDegrees(cartographic.longitude).toFixed(6); //经度
      var alt = +(cartographic.height.toFixed(1)); //高度
      return [lat, lng, alt];
    },
    //笛卡尔坐标转经纬度
    Cartesian3ToPosition1(c1, c2, c3) {
      var ellipsoid = viewer.scene.globe.ellipsoid;

      var cartesian3 = new Cesium.Cartesian3(c1, c2, c3);

      var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
      var lat = +Cesium.Math.toDegrees(cartographic.latitude).toFixed(6); //纬度

      var lng = +Cesium.Math.toDegrees(cartographic.longitude).toFixed(6); //经度
      var alt = +(cartographic.height.toFixed(1)); //高度
      return [lng, lat, alt];
    },
    //获取模型的Matrix4坐标
    modelMatrixToMatrix4(str) {
      var arr = str.split(",");
      arr.map(item => {
        item = item * 1;
      });
      var modelMatrix = new Cesium.Matrix4(
        arr[0] * 1,
        arr[1] * 1,
        arr[2] * 1,
        arr[3] * 1,
        arr[4] * 1,
        arr[5] * 1,
        arr[6] * 1,
        arr[7] * 1,
        arr[8] * 1,
        arr[9] * 1,
        arr[10] * 1,
        arr[11] * 1,
        arr[12] * 1,
        arr[13] * 1,
        arr[14] * 1,
        arr[15] * 1
      );
      return modelMatrix;
    },
    //Matrix4坐标获取经纬度
    modelMatrixToPosition(str) {
      var arr = str.split(",");
      var positon = this.Cartesian3ToPosition(arr[3], arr[7], arr[11]);
      return positon;
    },
    guideCom() {
      cameraLon = viewer.camera.positionCartographic.longitude * (180 / Math.PI) //摄像头当前经度
      cameraLat = viewer.camera.positionCartographic.latitude * (180 / Math.PI) //摄像头当前纬度
    },
    //entity 多边形坐标返回 
    getEntityPosition(e) {
      console.log(e)
      console.log(e.polygon.hierarchy._value.positions)
      var h = e.polygon.hierarchy._value.positions;
      console.log(h)
      return this.Cartesian3ToPosition1(h[0].x, h[0].y, h[0].z).join(',') + ',' + this.Cartesian3ToPosition1(h[1].x, h[1].y, h[1].z).join(',') + ',' + this.Cartesian3ToPosition1(h[2].x, h[2].y, h[2].z).join(',') + ',' + this.Cartesian3ToPosition1(h[3].x, h[3].y, h[3].z).join(',')
    },
    //两点的俯仰角度
    coursePitchAngle(lng_a, lat_a, alt_a, lng_b, lat_b, alt_b) {
      //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
      var localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3.fromDegrees(lng_a, lat_a));
      //求世界坐标到局部坐标的变换矩阵
      var worldToLocal_Matrix = Cesium.Matrix4.inverse(localToWorld_Matrix, new Cesium.Matrix4());
      //a点在局部坐标的位置，其实就是局部坐标原点
      var localPosition_A = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, new Cesium.Cartesian3.fromDegrees(lng_a, lat_a), new Cesium.Cartesian3());
      //B点在以A点为原点的局部的坐标位置
      var localPosition_B = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, new Cesium.Cartesian3.fromDegrees(lng_b, lat_b), new Cesium.Cartesian3());

      let distance = Math.sqrt(Math.pow((localPosition_B.x - localPosition_A.x), 2) + Math.pow((localPosition_B.y - localPosition_A.y), 2))
      let dz = alt_b - alt_a;
      var angle = 0;
      if (distance != 0) {
        angle = Math.tanh(dz / distance);
      }
      var theta = angle * (180 / Math.PI);
      return -theta;
    },
    // //两点的俯仰角度
    // coursePitchAngle(lng_a, lat_a, alt_a, lng_b, lat_b, alt_b) {
    //   //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
    //   var localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3.fromDegrees(lng_a, lat_a, alt_a));
    //   //求世界坐标到局部坐标的变换矩阵
    //   var worldToLocal_Matrix = Cesium.Matrix4.inverse(localToWorld_Matrix, new Cesium.Matrix4());
    //   //a点在局部坐标的位置，其实就是局部坐标原点
    //   var localPosition_A = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, new Cesium.Cartesian3.fromDegrees(lng_a, lat_a, alt_a), new Cesium.Cartesian3());
    //   //B点在以A点为原点的局部的坐标位置
    //   var localPosition_B = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, new Cesium.Cartesian3.fromDegrees(lng_b, lat_b, alt_b), new Cesium.Cartesian3());
    //   //弧度
    //   var angle = Math.atan2((localPosition_B.z - localPosition_A.z), (localPosition_B.x - localPosition_A.x))
    //   //角度
    //   var theta = angle * (180 / Math.PI);
    //   if (theta < 0) {
    //     theta = theta + 360;
    //   }
    //   return -theta;
    // },
    /**
     * 计算a点和b点的角度（偏行角）
     * @param lng_a a点经度
     * @param lat_a a点维度
     * @param lng_b b点经度
     * @param lat_b b点维度
     * @returns 角度
     */
    courseAngle(lng_a, lat_a, lng_b, lat_b) {
      //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
      var localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3.fromDegrees(lng_a, lat_a));
      //求世界坐标到局部坐标的变换矩阵
      var worldToLocal_Matrix = Cesium.Matrix4.inverse(localToWorld_Matrix, new Cesium.Matrix4());
      //a点在局部坐标的位置，其实就是局部坐标原点
      var localPosition_A = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, new Cesium.Cartesian3.fromDegrees(lng_a, lat_a), new Cesium.Cartesian3());
      //B点在以A点为原点的局部的坐标位置
      var localPosition_B = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, new Cesium.Cartesian3.fromDegrees(lng_b, lat_b), new Cesium.Cartesian3());
      //弧度
      var angle = Math.atan2((localPosition_B.y - localPosition_A.y), (localPosition_B.x - localPosition_A.x))
      //角度
      var theta = angle * (180 / Math.PI);
      if (theta < 0) {
        theta = theta + 360;
      }
      theta = -theta - 90
      if (theta < -360) {
        theta += 360
      }
      return theta;
    },
    positionGetDistance(lng_a, lat_a, alt_a, lng_b, lat_b, alt_b) {
      var startCartographic = Cesium.Cartographic.fromDegrees(lng_a, lat_a, alt_a);

      var endCartographic = Cesium.Cartographic.fromDegrees(lng_b, lat_b, alt_b);

      /**根据经纬度计算出距离**/
      var geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(startCartographic, endCartographic);

      var distance = geodesic.surfaceDistance;
      return distance
    }
  }
};
