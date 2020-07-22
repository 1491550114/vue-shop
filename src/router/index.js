import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import List from '../components/goods/List'
import Add from '../components/goods/Add'
import Params from '../components/goods/Params'
import Order from '../components/order/Order'
import Report from '../components/report/Report'
Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/home',
		component: Home,
		redirect: '/welcome',
		children: [{
				path: '/welcome',
				component: Welcome
			},
			{
				path: '/users',
				component: Users
			},
			{
				path: '/rights',
				component: Rights
			},
			{
				path: '/roles',
				component: Roles
			}, {
				path: '/categories',
				component: Cate
			}, {
				path: '/goods',
				component: List
			}, {
				path: '/goods/add',
				component: Add
			}, {
				path: '/params',
				component: Params
			},{
				path: '/orders',
				component: Order
			},{
				path: '/reports',
				component: Report
			},
		]
	}
]
// 导入nprogress进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
	mode: 'history',
	routes
})

//路由导航守卫
router.beforeEach((to, from, next) => {
	/**
	 * to将要访问的路径
	 * from从那个路径跳转而来的
	 * next()  表示饭放行
	 * next()放行   next('/login') 强制跳转
	 * */
	 NProgress.start();
	if (to.path === '/login') return next();
	const tokenStr = window.sessionStorage.getItem('token');
	if (!tokenStr) return next('/login');
	next();
})
router.afterEach(() => {
	NProgress.done()
})
export default router
