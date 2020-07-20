<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- card区域 -->
		<el-card >
			<!-- alert警告 -->
			<el-alert
			    title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false">
			</el-alert>
			<!-- 级联选择 -->
			<div class="card_opt">
				<span>
					选择商品分类：
				</span>
				<el-cascader
				    v-model="selectedKeys"
				    :options="tableDataList"
				    :props="cateProps"
				    @change="cateChanged" clearable ></el-cascader>
			</div>
			<!-- tab面板 -->
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<!-- 动态参数 -->
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini" :disabled="isDisabled" @click="showDialog">添加参数</el-button>
					<el-table :data="manyTableData" border stripe>
						<el-table-column type="expand">
							<template v-slot="scope">
								<el-tag
								   v-for="(item,index) in scope.row.attr_vals"
								  closable
								  :disable-transitions="false"
								  @close="handleClose(index,scope.row)" :key="index" >
								  {{item}}
								</el-tag>
								<el-input
								  v-if="scope.row.inputVisible"
								  v-model="scope.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(scope.row)"
								  @blur="handleInputConfirm(scope.row)"
								  class="inputLen"
								>
								</el-input>
								<el-button v-else  size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index" label="#"></el-table-column>
						<el-table-column prop="attr_name" label="参数名称"></el-table-column>
						<el-table-column>
							<template v-slot="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 静态属性 -->
				<el-tab-pane label="静态属性" name="only">
					<el-button type="primary" size="mini" :disabled="isDisabled"  @click="showDialog">添加属性</el-button>
					<el-table :data="onlyTableData" border stripe>
						<el-table-column type="expand">
							<template v-slot="scope">
								<el-tag
								   v-for="(item,index) in scope.row.attr_vals"
								  closable
								  :disable-transitions="false"
								  @close="handleClose(index,scope.row)" :key="index" >
								  {{item}}
								</el-tag>
								<el-input
								  v-if="scope.row.inputVisible"
								  v-model="scope.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(scope.row)"
								  @blur="handleInputConfirm(scope.row)"
								  class="inputLen"
								>
								</el-input>
								<el-button v-else  size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index" label="#"></el-table-column>
						<el-table-column prop="attr_name" label="属性名号"></el-table-column>
						<el-table-column>
							<template v-slot="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 添加参数对话框 -->
		<el-dialog
		  :title="'添加'+textTitle"
		  :visible.sync="dialogVisible"
		  width="50%%"
		  @close="handleDialogClose">
		  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
		    <el-form-item :label="textTitle" prop="attr_name">
		      <el-input v-model="addForm.attr_name"></el-input>
		    </el-form-item>
		 </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addCateSure">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 编辑参数对话框 -->
		<el-dialog
		  :title="'编辑'+textTitle"
		  :visible.sync="eidtDialogDisable"
		  width="50%%"
		  @close="eidtDialogClose">
		  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
		    <el-form-item :label="textTitle" prop="attr_name">
		      <el-input v-model="editForm.attr_name"></el-input>
		    </el-form-item>
		 </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="eidtDialogDisable = false">取 消</el-button>
		    <el-button type="primary" @click="editCateSure">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				tableDataList:[], //商品分类数据
				selectedKeys:[],
				cateProps:{
					expandTrigger:'hover',
					label:'cat_name',
					value:'cat_id',
					children:'children'
				},
				activeName:'many',
				onlyTableData:[],
				manyTableData:[],
				dialogVisible:false,
				eidtDialogDisable:false,
				addForm:{
					attr_name:''
				},
				editForm:{attr_name:''},
				addFormRules:{
					attr_name: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' },
					  ],
				},
				editFormRules:{
					attr_name: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' },
					  ],
				},
				edit_attr_id:0,
				inputVisible:false,
				inputValue:'',
			}
		},
		created(){
			this.getCateList();
		},
		computed:{
			isDisabled(){
				if(this.selectedKeys.length !== 3){
					return true
				}else{
					return false
				}
			},
			cateId(){
				if(this.selectedKeys.length === 3){
					return this.selectedKeys[2];
				}
				return null;
			},
			textTitle(){
				if(this.activeName === 'many'){
					return '动态参数'
				}else{
					return '静态属性'
				}
			}
		},
		methods:{
			async getCateList(){
				const {data:res} = await this.$http.get('categories');
				console.log(res)
				if(res.meta.status !== 200) return this.$message.error('列表数据获取失败')
				this.$message.success('参数列表获取成功！')
				this.tableDataList = res.data;
			},
			async cateChanged(){
				this.getParamsList();
			},
			handleTabClick(){
				this.getParamsList();
			},
			async getParamsList(){//获取参数列表数据
				if(this.selectedKeys.length !== 3){
					 this.selectedKeys.length=[];
					 this.onlyTableData =[];
					 this.manyTableData=[];
					 return
				};
				const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/`, {
					params:{sel:this.activeName},
				});
				res.data.forEach(item =>{
					
					item.attr_vals=  item.attr_vals ? item.attr_vals.split(' ') :[];
					item.inputValue ='';
					item.inputVisible = false;
					console.log(item)
				})
				console.log(res.data)
				if(res.meta.status !== 200) return this.$message.error('参数数据获取失败')
				// this.$message.success('参数数据获取成功！')
				if(this.activeName === 'only'){
					this.onlyTableData = res.data;
				}else{
					this.manyTableData = res.data;
				}
			},
			showDialog(){
				this.dialogVisible = true;
				
			},
			handleDialogClose(){
				this.dialogVisible = false;
				this.$refs.addFormRef.resetFields();
			},
			async addCateSure(){
				this.$refs.addFormRef.validate(async (valid) => {
					if(!valid)return;
					const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
						attr_name:this.addForm.attr_name,
						attr_sel:this.activeName
					});
					if(res.meta.status !== 201) return this.$message.error('数据添加失败')
					this.$message.success('数据添加成功！');
					this.getParamsList();
					this.dialogVisible = false;
				})
				
			},
			showEditDialog(row){
				this.eidtDialogDisable = true;
				this.editForm.attr_name = row.attr_name;
				this.edit_attr_id = row.attr_id;
			},
			eidtDialogClose(){
				this.eidtDialogDisable = false;
				this.$refs.editFormRef.resetFields();
			},
			async editCateSure(){
				this.$refs.editFormRef.validate(async (valid) => {
					if(!valid)return;
					const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.edit_attr_id}`,{
						attr_name:this.editForm.attr_name,
						attr_sel:this.activeName
					});
					console.log(res)
					if(res.meta.status !== 200) return this.$message.error('数据更新失败')
					this.$message.success('数据更新成功！');
					this.getParamsList();
					this.eidtDialogDisable = false;
				})
			},
			removeCate(id){
				this.$confirm('是否删除该信息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
				    this.$http.delete(`categories/${this.cateId}/attributes/`+id).then((res) => {
						console.log(res)
						this.getParamsList();
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
			handleClose(i,row){//删除参数
				console.log(i);
				row.attr_vals.splice(i,1);
				this.saveData(row);
			},
		    handleInputConfirm(row){
				if(row.inputValue.trim().length === 0){
					row.inputVisible = false;
					row.inputValue = '';
					return ;
				}
				//如果没有则保存填写的内容
				row.inputVisible = false;
				row.attr_vals.push(row.inputValue.trim());
				row.inputValue = '';
				//保存数据到数据库
				this.saveData(row)
			},
			showInput(row){
				row.inputVisible = true;
				this.$nextTick(()=>{
					this.$refs.saveTagInput.$refs.input.focus();
				});
				
			},
			async saveData(row){
				//保存数据到数据库
				const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
					attr_name:row.attr_name,
					attr_sel:row.attr_sel,
					attr_vals:row.attr_vals.join(' ')
				});
				console.log(res)
				if(res.meta.status !== 200) return this.$message.error('修改参数项失败')
				this.$message.success('修改参数项成功！');
			}
		}
	}
</script>

<style lang="less" scoped>
	.card_opt{margin:10px 0;}
	.el-tag{margin: 5px;}
	.inputLen{width:100px;}
</style>
