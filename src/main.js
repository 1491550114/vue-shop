import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入icon图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
Vue.prototype.$http = axios
//配置请求根路径
axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
