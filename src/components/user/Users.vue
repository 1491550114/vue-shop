<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- card区域 -->
		<el-card class="box-card">
			<el-row :gutter="20">
				<!-- 搜索框 -->
				<el-col :span="7">
					<el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable @clear="getUserList()">
						<el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
					</el-input>
				</el-col>
				<el-col :span="2">
					<el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
				</el-col>
			</el-row>
			<!-- table表格数据展示 -->
			<el-table :data="userList" style="width: 100%" border stripe>
				<el-table-column label="序号" type="index">
				</el-table-column>
				<el-table-column prop="username" label="姓名">
				</el-table-column>
				<el-table-column prop="email" label="邮箱">
				</el-table-column>
				<el-table-column prop="mobile" label="电话">
				</el-table-column>
				<el-table-column prop="role_name" label="角色">
				</el-table-column>
				<el-table-column prop="mg_state" label="状态">
					<template v-slot="data">
						<el-switch v-model="data.row.mg_state" @change="switchChange(data.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="" label="操作" width="180px">
					<template v-slot="data">
						<!-- 编辑 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(data.row.id)"></el-button>
						<!-- 删除 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(data.row.id)"></el-button>
						<!-- 角色分配 -->
						<el-tooltip effect="dark" content="角色分配" placement="top" :enterable="false">
							<el-button type="warning" icon="el-icon-setting" size="mini" @click="roleAssignment(data.row)"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页功能 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[1,3,5,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
			<!-- dialog对话框 添加用户   -->
			<el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeDialog">
				<!-- 主体区域 -->
				<el-form :model="addUser" label-width="80px" ref="addUserRef" :rules="addUserRules">
					<el-form-item label="用户名" prop="username">
						<el-input v-model="addUser.username"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="addUser.password"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="addUser.email"></el-input>
					</el-form-item>
					<el-form-item label="手机" prop="mobile">
						<el-input v-model="addUser.mobile"></el-input>
					</el-form-item>
				</el-form>
				<!-- footer区域 -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="addUserSure">确 定</el-button>
				</span>
			</el-dialog>

			<!-- dialog对话框 编辑用户   -->
			<el-dialog title="编辑用户" :visible.sync="EditdialogVisible" width="50%" @close="closeEditDialog">
				<!-- 主体区域 -->
				<el-form :model="editUser" label-width="80px" ref="editUserRef" :rules="editUserRules">
					<el-form-item label="用户名">
						<el-input v-model="editUser.username" disabled></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="editUser.email"></el-input>
					</el-form-item>
					<el-form-item label="手机" prop="mobile">
						<el-input v-model="editUser.mobile"></el-input>
					</el-form-item>
				</el-form>
				<!-- footer区域 -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="EditdialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="editUserSure">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 角色分配 -->
			<el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="50%">
				<!-- 主体区域 -->
				<div class="setRole">
					<p>当前用户：{{roleInfo.username}}</p>
					<p>当前角色：{{roleInfo.role_name}}</p>
					<p>分配新角色：<template>
							  <el-select v-model="selectRoleId" placeholder="请选择">
							    <el-option
							      v-for="item in getRoleList"
							      :key="item.id"
							      :label="item.roleName"
							      :value="item.id">
							    </el-option>
							  </el-select>
							</template></p>
				</div>
				<!-- footer区域 -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="roleDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="setRoleSave">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			const checkEmail = (rule, value, cb) => {
				const regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
				if (regEmail.test(value)) {
					cb();
				} else {
					cb(new Error('请输入正确的邮箱'))
				}
			};
			const checkMobile = (rule, value, cb) => {
				const regMobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (regMobile.test(value)) {
					cb();
				} else {
					cb(new Error('请输入正确的手机号'))
				}
			}
			return {
				userList: [],
				queryInfo: {
					query: '',
					pagenum: 1, //当前页数
					pagesize: 3 //每页显示条目个数
				},
				total: 0,
				dialogVisible: false,
				EditdialogVisible: false,
				roleDialogVisible:false,
				roleUserName:'',
				getRoleList:[],
				selectRoleId:'', //已选中的角色ID值
				addUser: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				roleInfo:{
					role_name:'',
					username:''
				},
				editUser: {
					username: '',
					email: '',
					mobile: ''
				},
				//添加表单用户规则验证
				addUserRules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}, {
						min: 3,
						max: 10,
						message: '请输入3~10个字符',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, {
						min: 3,
						max: 10,
						message: '请输入3~10个字符',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: checkEmail,
						trigger: 'blur'
					}],
					mobile: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}, {
						validator: checkMobile,
						trigger: 'blur'
					}],
				},
				//编辑用户规则
				editUserRules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}, {
						min: 3,
						max: 10,
						message: '请输入3~10个字符',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, {
						min: 3,
						max: 10,
						message: '请输入3~10个字符',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: checkEmail,
						trigger: 'blur'
					}],
					mobile: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}, {
						validator: checkMobile,
						trigger: 'blur'
					}],
				}
			}
		},
		created() {
			this.getUserList();
		},
		methods: {
			//获取用户列表数据  方法1
			// getUserList(){
			// 	this.$http.get('users',{params:this.queryInfo}).then((res) => {
			// 		this.userList = res.data.data.users;
			// 		this.total = res.data.data.total;
			// 	}).catch((err) => {
			// 		this.$message.error(err.meta.msg);
			// 	})
			// },
			//获取用户列表数据  方法2
			async getUserList() {
				const {
					data: res
				} = await this.$http.get('users', {
					params: this.queryInfo
				});
				if (res.meta.status !== 200) {
					return this.$message.error('获取数据失败')
				}
				this.userList = res.data.users;
				this.total = res.data.total;
			},
			handleSizeChange(size) { //每页多少条数据
				console.log(`每页 ${size} 条`);
				this.queryInfo.pagesize = size;
				this.getUserList();
			},
			handleCurrentChange(page) { //当前页
				console.log(`当前页: ${page}`);
				this.queryInfo.pagenum = page;
				this.getUserList();
			},
			//switch开关切换状态 方法1
			// async switchChange(status){
			// 	console.log(status)
			// 	//修改用户状态
			// 	const {data:res} = await this.$http.put(`users/${status.id}/state/${status.mg_state}`)
			// 	console.log(JSON.stringify(res.meta.status)+">>>")
			// 	if(res.meta.status !== 200){
			// 		status.mg_state =!status.mg_state;
			// 	    this.$message.error("用户状态更新失败！")
			// 	}
			// 	this.$message.success("用户状态更新成功！")
			// },
			//switch开关切换状态 方法2
			switchChange(status) {
				console.log(status)
				//修改用户状态
				this.$http.put(`users/${status.id}/state/${status.mg_state}`).then((res) => {
					this.$message.success("用户状态更新成功！")
				}).catch((err) => {
					status.mg_state = !status.mg_state;
					this.$message.error("用户状态更新失败！")
				})
			},
			closeDialog() { //关闭dialog
				this.$refs.addUserRef.resetFields();
			},
			//添加用户
			addUserSure() {
				this.$refs.addUserRef.validate((valid) => {
					if (!valid) return;
					this.$http.post('users', this.addUser).then((res) => {
						console.log(res)
						this.$message.success('添加用户成功！');
						this.getUserList();
						this.dialogVisible = false;
					}).catch((err) => {
						this.$message.error('用户添加失败！')
					})
				})
			},
			// 开打编辑对话框
			async editDialog(id) {
				const {
					data: res
				} = await this.$http.get('users/' + id);
				this.editUser = res.data
				this.EditdialogVisible = true;
				
			},
			closeEditDialog() { // 关闭编辑对话框
				this.$refs.editUserRef.resetFields();
			},
			editUserSure() { //修改用户并提交
				this.$refs.editUserRef.validate((valid) => {
					if (!valid) return;
					this.$http.put('users/' + this.editUser.id, {
						email: this.editUser.email,
						mobile: this.editUser.mobile
					}).then((res) => {
						this.$message.success('用户更新成功！');
						this.getUserList()
						this.EditdialogVisible = false;
					}).catch((err) => {
						this.$message.error('用户更新失败！')
					})
				})
			},
		// 	open() {
		// 		this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		// 			confirmButtonText: '确定',
		// 			cancelButtonText: '取消',
		// 			type: 'warning'
		// 		}).then(() => {
		// 			this.$message({
		// 				type: 'success',
		// 				message: '删除成功!'
		// 			});
		// 		}).catch(() => {
		// 			this.$message({
		// 				type: 'info',
		// 				message: '已取消删除'
		// 			});
		// 		});
		// 	}
		// },
		async	deleteUser(id) { //删除用户
			this.$confirm('是否删除该信息?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
			    this.$http.delete('users/'+id).then((res) => {
					this.getUserList();
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch((err) => {
					this.$message({
						type: 'info',
						message: '删除失败!'
					});
				})
				
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		//分配角色
		async roleAssignment(roleInfo){
			//获取当前用户数据
			this.roleInfo = roleInfo;
			//获取所有角色数据
			const {data:res} = await this.$http.get('roles');
			if (res.meta.status !== 200) {
				return this.$message.error('获取角色列表失败')
			}
			this.getRoleList =res.data;
			this.roleDialogVisible = true;
		},
		async setRoleSave(){
			if(!this.selectRoleId){
				this.$message.error('请选择分配的角色')
			}
			console.log(this.roleInfo.id+">>"+this.selectRoleId)
			// const  {data:res}  = await this.$http.put(`users/${this.roleInfo.id}/role/rid/${this.selectRoleId}`);
			const {data:res} = await this.$http.put(`users/${this.roleInfo.id}/role/rid/${this.selectRoleId}`);
			if(res.meta.status !== 200) return this.$message.error('分配角色失败');
			this.$message.success('分配角色成功');
			this.getUserList();
			this.roleDialogVisible = false;
		}
			
	}
}
</script>

<style lang="less" scoped="scoped">
	.setRole p{
		margin-bottom: 5px;
	}
</style>
