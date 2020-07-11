<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 主体区域 -->
		<el-card>
			<el-button type="primary" @click="openRolesDialog">添加角色</el-button>
			<el-table :data="getRolesData" style="width: 100%;" border stripe>
				<!-- 展开列 -->
				<el-table-column type="expand" >
				      <template v-slot="props">
						  <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in props.row.children" :key="item1.id" >
							  <!-- 渲染一级权限 -->
							  <el-col :span="5">
								  <el-tag type="primary" closable @close="deleteSelefId(props.row,item1.id)">{{ item1.authName }}</el-tag>
								  <i class="el-icon-caret-right"></i>
							  </el-col>
							  <!-- 渲染二级、三级权限 -->
							  <el-col  :span="19" >
								  <el-row :class="[i2===0 ?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
									  <el-col :span="6">
										  <el-tag type="success" closable  @close="deleteSelefId(props.row,item2.id)">{{ item2.authName }}</el-tag>
										  <i class="el-icon-caret-right"></i>
									  </el-col>
									  <el-col :span="18">
										<el-tag v-for="(item3,i3) in item2.children" :key="item3.id" type="warning" closable @close="deleteSelefId(props.row,item3.id)" >{{ item3.authName }}</el-tag>
									  </el-col>
								  </el-row >
							  </el-col>
						  </el-row>
				      </template>
				    </el-table-column>
				<el-table-column type="index" label="序号">
				</el-table-column>
				<el-table-column label="角色名称" prop="roleName" ></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc" ></el-table-column>
				<el-table-column label="操作" width="300px">
					<template v-slot="data">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click='openEditDialog(data.row.id)'>编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(data.row.id)">删除</el-button>
						<el-button type="warning" icon="el-icon-setting" size="mini" @click="disRoles(data.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- dialog对话框 添加角色   -->
		<el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%" @close="closeDialog">
			<!-- 主体区域 -->
			<el-form :model="addRoles" label-width="80px" ref="addRolesRef" :rules="addRolesRules">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="addRoles.roleName" v-focus ></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="addRoles.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<!-- footer区域 -->
			<span slot="footer" >
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRolesSure">确 定</el-button>
			</span>
		</el-dialog>
		<!-- dialog对话框 编辑角色   -->
		<el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog">
			<!-- 主体区域 -->
			<el-form :model="editRoles" label-width="80px" ref="editRolesRef" :rules="editRolesRules">
				<el-form-item label="角色名称" prop="roleName">
					<el-input  v-focus  v-model="editRoles.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="editRoles.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<!-- footer区域 -->
			<span slot="footer" >
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editRolesSure">确 定</el-button>
			</span>
		</el-dialog>
		<!-- dialog对话框 分配权限   -->
		<el-dialog title="分配权限" :visible.sync="disDialogVisible" width="50%"  @close="closeDisDialog">
			<!-- 主体区域 -->
			<el-tree :data="rightsList"  ref="treeRef" node-key="id" :default-checked-keys="defKeys"  default-expand-all :props="treeProps" show-checkbox ></el-tree>
			<!-- <span>{{rightsList}}</span> -->
			<!-- footer区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="disDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="DisRolesSure">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				getRolesData:[], //获取角色所有数据
				rightsList:[],//获取分配权限数据
				dialogVisible:false,
				editDialogVisible:false,
				disDialogVisible:false,
				addRoles:{
					roleName:'',
					roleDesc:''
				},
				treeProps:{ //tree属性设置
					label:'authName',
					children: 'children'
				},
				defKeys:[], //默认展开的节点的数组
				roleId:'',
				editRoles:{
					roleName:'',
					roleDesc:''
				},
				addRolesRules:{
					roleName:[
						{required:true,message:'请输入角色名称',trigger:'blur'}
					],
					roleDesc:[
						{required:true,message:'请输入角色名称',trigger:'blur'}
					]
				},
				editRolesRules:{
					roleName:[
						{required:true,message:'请输入角色名称',trigger:'blur'}
					],
					roleDesc:[
						{required:true,message:'请输入角色名称',trigger:'blur'}
					]
				}
			}
		},
		created(){
			this.getRolesList();
		},
		methods:{
			async getRolesList(){ //获取角色列表数据
				const {data:res} = await this.$http.get('roles');
				if(res.meta.status !== 200)return this.$message.error('获取数据失败！');
				this.getRolesData = res.data;
				this.$message.success('数据获取成功！');
			},
			openRolesDialog(){ //打开添加角色对话框
				this.dialogVisible = true;
			},
			closeDialog(){ //关闭对话框并重置信息
				this.$refs.addRolesRef.resetFields();
			},
			 addRolesSure(){ //添加角色信息
			    this.$refs.addRolesRef.validate(async (valid) => {
					if(valid){
						const {data:res} = await this.$http.post('roles',this.addRoles);
						if(res.meta.status !== 201){
							return this.$message.error('角色添加失败！')
						}
						this.dialogVisible = false;
						this.$message.success('角色添加成功！');
						this.getRolesList();
						
					}
				})
			},
			//编辑信息
			async openEditDialog(id){ //打开编辑对话框
				this.editDialogVisible = true;
				const {data:res} =await this.$http.get('roles/'+id);
				if(res.meta.status !== 200)return this.$message.error('数据获取失败！');
				this.editRoles  = res.data;
			},
			closeEditDialog(){//关闭编辑对话框
				this.editDialogVisible = false;
				this.$refs.editRolesRef.resetFields();
			},
			editRolesSure(){//编辑信息
				this.$refs.editRolesRef.validate(async (valid) => {
					if(valid){
						const {data:res} =await this.$http.put('roles/'+this.editRoles.roleId,{
							roleName:this.editRoles.roleName,
							roleDesc:this.editRoles.roleDesc
							});
						if(res.meta.status !== 200)return this.$message.error('更新数据失败！');
						this.editDialogVisible = false;
						this.$message.success('更新数据成功！');
						this.getRolesList()
					}
				})
			},
			deleteRoles(id){ //删除数据
				
				this.$confirm('是否删除该信息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() =>{
					 this.$http.delete('roles/'+id).then(()=>{
						 this.getRolesList();
						 this.$message.success({
							 type:'success',
							 message:'删除成功！'
						 })
					 }).catch(()=>{
							this.$message.success({
								type:'info',
								 message:'删除失败！'
							})
						})
				}).catch(()=>{
					this.$message.info({
						type:'info',
						 message:'已取消删除！'
					})
				})
			},
			deleteSelefId(role,rightId){
				this.$confirm('是否删除该信息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then( async() =>{
					const {data:res} =await this.$http.delete('roles/'+role.id+'/rights/'+rightId);
					if(res.meta.status !== 200)return this.$message.info('删除失败！');
					this.$message.success('删除成功！');
					
					//展示最新的数据
					role.children = res.data;
				}).catch(()=>{
					this.$message.info({
						type:'info',
						 message:'已取消删除！'
					})
				})
			},
			//分配权限
			async disRoles(node){//展示分配权限对话框
				//获取分配权限的tree型数据
				this.roleId = node.id;
				const {data:res}  =await this.$http.get('rights/tree');
				if(res.meta.status !== 200) return this.$message.error('获取分配权限数据失败')
				this.rightsList = res.data;
				//获取三级节点id
				console.log(node.children)
				this.getThreeKeys(node,this.defKeys)
				this.disDialogVisible = true;
			},
			async DisRolesSure(){
				
				const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
				const keyStr = keys.join(',');
				const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:keyStr});
				console.log(res)
				if(res.meta.status !== 200)return this.$message.error('分配权限失败！');
				
				this.$message.success('分配权限成功！');
				this.disDialogVisible = false;
				this.getRolesList();
			},
			closeDisDialog(){//关闭分配权限对话框
				this.disDialogVisible = false;
				this.defKeys=[];
			},
			//通过递归方式获取三级权限的id，并保存到数组中
			getThreeKeys(node,arr){
				//如果当前node节点不包含children属性则是三级节点
				if(!node.children){
					return arr.push(node.id);
				}
				console.log('taotao')
				if(node.children !== undefined){
					node.children.filter(item =>{
						return  this.getThreeKeys(item,arr)
					})
				}
				
				
				
			}
		},
	}
</script>

<style lang="less" scoped="scoped">
	.el-tag{margin: 8px!important}
	.bdtop{border-top: 1px solid #EEEEEE;}
	.bdbottom{border-bottom: 1px solid #EEEEEE;}
	.vcenter{display: flex;align-items:center;}
</style>
