<template>
  <div>
    <div id="handle">
      <div class="cate">
        <div class="title">巡逻示例</div>
        <div class="item">
          <div class="label">巡逻速度</div>
          <div class="input">
            <input v-model="moveRate" type="range" min="1" step="0.1" max="5"> 1~5m/s
          </div>
        </div>
        <div class="item">
          <div class="label">巡逻点位</div>
          <div class="input">
            <div class="btn-group">
              <div class="btn" @click="patrolPoint(0)">起始点</div>
              <div class="btn" @click="patrolPoint(1)">梯下拐点</div>
              <div class="btn" @click="patrolPoint(2)">梯下</div>
              <div class="btn" @click="patrolPoint(3)">梯上</div>
              <div class="btn" @click="patrolPoint(4)">梯上拐点</div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="label">操作</div>
          <div class="input">
            <div class="btn-group">
              <div class="btn"  @click="patrolPause()">暂停巡逻</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { assist } from "@/assets/js/assist";
import HelperUtils from "../assets/js/utils";
import * as Cesium from "cesium/Cesium";
export default {
  name: "handle",
  props: {
  },
  mixins:[assist],
  data() {
    return {
      moveRate:2
    };
  },
  watch:{
    moveRate(){
      this.findComponentUpward(this,'CesiumScene').moveRate = this.moveRate
    }
  },
  methods: {
    patrolPoint(index) {
      this.findComponentUpward(this,'CesiumScene').patrolPoint(index)
    },
    patrolPause(){
      this.findComponentUpward(this,'CesiumScene').patrolPause()
    }
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
  width: 300px;
  padding: 20px 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: rgba($color: #000000, $alpha: 0.6);
  .cate{
    .title{
      font-size: 14px;
    }
    .item{
      margin: 10px;
      display: flex;
      .label{
        width: 80px;
      }
      .input{
        input{
          width: 120px;
          color:#222;
        }
        flex: 1;
        display: flex;
      }
    }
  }
}
.btn{
  margin-bottom:10px;
  padding: 6px 16px;
  cursor: pointer;
  border-radius: 4px;
  border:1px solid #ccc;
  text-align: center;
}


</style>
