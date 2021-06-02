import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sysInfo: [{
      type: '',
      msg: "这是一个基于vue的cesium工具集,项目地址：https://github.com/Couy69/cesium-vue-tools.git"
    },{
      type: '',
      msg: "有偿解决问题请发邮件至couy69@gmail.com"
    },],
  },
  mutations: {
    set_sys_info(state, data) {
      this.state.sysInfo.push(data);
      var time = +new Date()
      var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
      this.state.sysInfo[this.state.sysInfo.length - 1].time = date.toJSON().substr(11, 8).replace('T', ' ')
      if (this.state.sysInfo.length > 50) {
        this.state.sysInfo.shift()
      }
    },
  },
  actions: {
  },
  modules: {
  }
})
