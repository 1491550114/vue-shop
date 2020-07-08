import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

const routes = [
	{
		path:'/',
		redirect:'/login'
	},
	{
		path:'/login',
		component:Login
	},
	{
		path:'/home',
		component:Home
	}
]

const router = new VueRouter({
  mode:'history',
  routes
})

//路由导航守卫
router.beforeEach((to, from, next) =>{
	/**
	 * to将要访问的路径
	 * from从那个路径跳转而来的
	 * next()  表示饭放行
	 * next()放行   next('/login') 强制跳转
	 * */
	if(to.path === '/login')return next();
	const tokenStr = window.sessionStorage.getItem('token');
	console.log(tokenStr+">>>>>")
	if(!tokenStr)return next('/login');
	next();
})
export default router
