import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入icon图标
import './assets/fonts/iconfont.css'
import TreeTable  from 'vue-table-with-tree-grid'
import axios from 'axios'

import VueQuillEditor from 'vue-quill-editor' //富文本框插件
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme



Vue.use(VueQuillEditor)
Vue.prototype.$http = axios
Vue.component('tree-table',TreeTable)
//配置请求根路径
axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// axios.defaults.baseURL ='https://www.liulongbin.top:8888/api/private/v1/'
//axios 添加请求拦截器
axios.interceptors.request.use(config => {
	config.headers.Authorization = window.sessionStorage.getItem('token');
	return config;
});
//vue进入页面自动获取input框焦点
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.querySelector('input').focus()
  }
})
Vue.filter('formDate',function(val){
	const date = new Date(val);
	const y = date.getFullYear();
	const m = (date.getMonth()).toString().padStart(2,'0');
	const d = (date.getDate()).toString().padStart(2,'0');
	const hh = (date.getHours()).toString().padStart(2,'0');
	const mm = (date.getMinutes()).toString().padStart(2,'0');
	const ss = (date.getSeconds()).toString().padStart(2,'0');
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
