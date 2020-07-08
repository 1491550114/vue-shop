<template>
	<div class="login_warp">
		<div class="login_box">
			<!-- 头像区域 -->
			<div class="logo_box">
				<img src="../assets/logo.png" alt="">
			</div>
			<!-- 登录表单 -->
			<el-form ref="loginFromRef" v-bind:model="loginForm" v-bind:rules="loginFormRules" class="login_form"  label-width="0px">
			  <el-form-item prop="username">
			    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
			  </el-form-item>
			  <el-form-item prop="password">
			    <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
			  </el-form-item>
			  <el-form-item class="btns">
				  <el-button type="primary" @click="login">登录</el-button>
				  <el-button type="info" @click="resetLoginForm">重置</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				//表单数据绑定对象
				loginForm:{
					username:'',
					password:''
				},
				getToken:'',
				//数据验证规则
				loginFormRules:{
					username:[
						 {
							 required:true,message:'请输入用户名称',trigger:'blur'
						 },
						 {
						 	 min:3,max:10,message:'长度在 3 到 10 个字符',trigger:'blur'
						 }
					],
					password:[
						{
							required:true,message:'请输入用户密码',trigger:'blur'
						},
						{
							min:6,max:10,message:'长度在 6 到 10 个字符',trigger:'blur'
						}
					]
				}
			}
		},
		methods:{
			//重置表单数据
			resetLoginForm(){
				this.$refs.loginFromRef.resetFields();
			},
			//登陆验证
			login(){
				this.$refs.loginFromRef.validate(async valid=>{
					console.log(valid)
					if(!valid)return;
					const {data : res} = await this.$http.post("login",this.loginForm)
					console.log(res.data.token)
					this.getToken = res.data.token
					if(res.meta.status !== 200){
						return this.$message.error('登陆失败！')
					}else{
						 this.$message.success('登陆成功！');
					}
					
					//1.将登陆之后的token保存在客户端中
					window.sessionStorage.setItem("token", res.data.token)
					
					//2.跳转到home页面
					this.$router.push('/home')
					
				})
			}
		},
		beforeUpdate(){
			window.sessionStorage.setItem("token", this.getToken)
		}
	}
</script>

<style lang="less" scoped>
	.login_warp{
		background-color: #2b4b6b;
		height: 100%;
		.login_box{
			width: 450px;
			height: 300px;
			background-color: white;
			border-radius: 3px;
			position: absolute;
			top:50%;
			left:50%;
			transform: translate(-50%,-50%);
			.logo_box{
				width: 130px;
				height: 130px;
				border: 1px solid #EEEEEE;
				border-radius: 50%;
				padding:10px;
				box-shadow: 0 0 10px #EEEEEE;
				position: absolute;
				left:50%;
				transform: translate(-50%,-50%);
				background-color: white;
			    img{
					width:100%;
					height:100%;
					border-radius: 50%;
					border: 1px solid #EEEEEE;
					background-color: #EEEEEE;
				}
			}
			.login_form{
				position: absolute;
				bottom:30px;
				width:100%;
				padding:0 10px;
				box-sizing: border-box;
				.btns{
					display:flex;
					justify-content:center;
				}
			}
		}
	}
</style>
