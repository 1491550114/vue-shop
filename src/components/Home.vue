<template>
	<div>
		<el-button type="info" @click="logout">退出</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			logout() { //退出功能
				//清除token
				window.sessionStorage.clear();
				//跳转至登录页面
				this.$router.push('./login')
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
</style>
