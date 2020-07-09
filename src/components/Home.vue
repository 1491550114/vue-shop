<template>
	<!-- 主体内容 -->
	<el-container class="home_container">
		<!-- 头部内容 -->
		<el-header>
			<div class="logo_header">
				<img src="../assets/heima.png" alt="">
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logout">退出</el-button>
		</el-header>
		<el-container>
			<!-- 左边栏 -->
			<el-aside :width="collapseFlag ? '64px' : '200px'">
				<div class="collapse" @click="collapseToggle">|||</div>
				<el-menu  background-color="#333744"
				 text-color="#fff" active-text-color="#409EFF"  unique-opened :collapse="collapseFlag" :collapse-transition="false" :router="true"
				 :default-active="activePath">
				 <!-- 一级菜单 -->
					<el-submenu :index="item.id+''" v-for="item in menuList" :key='item.id'>
						<template slot="title">
							<i  :class="iconObj[item.id]"></i>
							<span>{{item.authName}}</span>
						</template>
						<!-- 二级菜单 -->
						<el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key='subItem.id'  @click="saveActivePath('/'+subItem.path)">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{subItem.authName}}</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<!-- 主体区域 -->
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		data() {
			return {
				menuList:[],
				iconObj: { 
					"125": "iconfont icon-users",
					"103":"iconfont icon-tijikongjian",
					"101":"iconfont icon-shangpin",
					"102":"iconfont icon-danju",
					"145":"iconfont icon-baobiao"
					},
				collapseFlag:false,
				activePath:''
			}
		},
		created(){
			this.getMenuList();
			this.activePath = window.sessionStorage.getItem('activePath')
		},
		methods: {
			logout() { //退出功能
				//清除token
				window.sessionStorage.clear();
				//跳转至登录页面
				this.$router.push('./login')
			},
			//获取侧边栏数据方法1
			// getMenuList(){
			// 	this.$http.get('menus').then((res) => {
			// 		this.menuList = res.data.data
			// 		console.log(this.menuList)
			// 	}).catch((err) =>{
			// 		this.$message.error(res.data.msg)
			// 	})
			// },
			//获取侧边栏数据方法2
			async getMenuList(){
				const {data:res} =  await this.$http.get('menus');
				if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
				this.menuList = res.data
			},
			//点击展开收缩侧边栏
			collapseToggle(){
				this.collapseFlag = !this.collapseFlag;
			},
			//点击二级页面保存它的链接
			saveActivePath(activePath){
				 window.sessionStorage.setItem('activePath',activePath)
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.home_container {
		height: 100%;

		.el-header {
			background-color: #373d41;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-left: 0;
			color: white;
			font-size: 20px;

			.logo_header {
				display: flex;
				align-items: center;
				img{width:50px;height: 50px;}
				span {
					margin-left: 20px;
				}
			}
		}

		.el-aside {
			background-color: #333744;
			.collapse{
				background-color: #4a5064;
				line-height: 24px;
				text-align: center;
				color: white;
				letter-spacing: 0.1em;
			}
			.el-menu{
				border-right: none;
				.el-submenu{
					i.iconfont{
						margin-right: 10px;
					}
				}
			}
		}

		.el-main {
			background-color: #eaedf1;
		}
	}
</style>
