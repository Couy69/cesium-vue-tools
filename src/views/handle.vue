<template>
  <div>
    <div id="handle">
      <!-- <div class="cate">
        <div class="title">地图相关</div>
        <div class="btn">模型加载</div>
        <div class="btn">设置entitys</div>
      </div> -->
    </div>
  </div>
</template>
<script>
import HelperUtils from "../assets/js/utils";
import * as Cesium from "cesium/Cesium";
export default {
  name: "handle",
  props: {
  },
  data() {
    return {
    };
  },
  methods: {
    OnInit() {
    },
  },
  watch: {
  },
  mounted() {
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
