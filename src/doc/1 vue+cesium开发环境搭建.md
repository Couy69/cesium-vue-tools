# 1 vue+cesium开发环境搭建

对于网上现有的参考文章，我就做个搬运工。

遇到类似于：

``` js
"export 'default' (imported as 'Cesium') was not found in 'cesium/Cesium'
```

这种报错，可以参考

- [Cesium笔记 — Vue+Cesium开发环境搭建（基于Cesium1.69）](https://segmentfault.com/a/1190000022714154)

- [Cesium系列(1)--Vue-cli3 + Cesium 快速构建](https://jercky.top/2020/07/01/Cesium%E5%85%A5%E9%97%A8-1/)

 两位大佬已经写的很好了，都是由于cesium1.63版本的改动，AMD改成了ES6重构，所以引入方式也要做出变更
