<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-row>
				<el-col>
					<el-button type="primary" @click="addCate">添加分类</el-button>
				</el-col>
				<el-col>
					
				</el-col>
			</el-row>
			<!-- 主体区域 -->
			<tree-table :data="cateDate"   show-index border stripe 
			 :columns="columns" :selection-type="false" :expand-type="false"
			>
				<template v-slot:isok="scope">
					<span v-if="!scope.row.cat_deleted">
						<i class="el-icon-success" type="primary"></i>
					</span>
					<span v-else-if="scope.row.cat_deleted">
						<i class="el-icon-error"></i>
					</span>
				</template>
				<template v-slot:level="scope">
						<el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
						<el-tag v-else-if="scope.row.cat_level == '1'">二级</el-tag>
						<el-tag v-else ="scope.row.cat_level == '2'">三级</el-tag>
				</template>
				<template v-slot:edit="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini"  @click="editCateDialog(scope.row)">编辑</el-button>
					<el-button type="danger"icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
				</template>
			</tree-table>
			<!-- 分页 -->
			<el-pagination
			  @size-change="handleSizeChange"
			  @current-change="handleCurrentChange"
			  :current-page="cateInfo.pagenum"
			  :page-sizes="[1, 3, 5, 10]"
			  :page-size="cateInfo.pagesize"
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="total">
			</el-pagination>
		</el-card>
		
		<!-- 添加分类对话框 -->
		<el-dialog title="添加分类" :visible.sync="dialogVisible" width="50%"  @close="closeDialog">
			<!-- 主体区域 -->
			<el-form :model="addCateForm" label-width="80px" ref="addCateRef" :rules="addCateRules">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="addCateForm.cat_name" v-focus ></el-input>
				</el-form-item>
				<el-form-item label="父类名称">
					
					<el-cascader
					    v-model="selectedKeys"
					    :options="ParentCateList"
					    :props="parentProps"
					    @change="parentChanged" clearable change-on-select></el-cascader>
				</el-form-item>
			</el-form>
			<!-- footer区域 -->
			<span slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="CateSure">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑分类对话框 -->
		<el-dialog title="编辑分类" :visible.sync="dialogEditVisible" width="50%"  @close="closeEditDialog">
			<!-- 主体区域 -->
			<el-form :model="editCateForm" label-width="80px" ref="editCateRef" :rules="addCateRules">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="editCateForm.cat_name" v-focus ></el-input>
				</el-form-item>
			</el-form>
			<!-- footer区域 -->
			<span slot="footer">
				<el-button @click="dialogEditVisible = false">取 消</el-button>
				<el-button type="primary" @click="cateEditSure">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				dialogVisible:false,
				dialogEditVisible:false,
				cateInfo:{
					type:3,
					pagenum:1,
					pagesize:5
				},
				addCateForm:{
					cat_pid:0,
					cat_name:'',
					cat_level:0 //`0`表示一级分类；`1`表示二级分类；`2`表示三级分类 
				},
				editCateForm:{
					cat_name:''
				},
				addCateRules:{
					cat_name:[
						{
							required:true,message:'请输入分类名称',trigger:'blur'
						}
					]
				},
				
				columns:[//table数据
					{
						label:'分类名称',
						prop:'cat_name',
					},
					{
						label:'是否有效',
						prop:'cat_deleted',
						type:'template',
						template:'isok'//模板名称
					},
					{
						label:'排序',
						prop:'cat_level',
						type:'template',
						template:'level'//模板名称
					},{
						label:'操作',
						type:'template',
						template:'edit'//模板名称
					}
				],
				cateDate:[],
				total:0,
				ParentCateList:[],//父类数据列表
				parentProps:{//可选项数据源，键名可通过 Props 属性配置
					value:'cat_id',
					label:'cat_name',
					children:'children',
					 expandTrigger: 'hover'
				},
				selectedKeys:[],
				edit_cat_pid:0
			}
		},
		created(){
			this.getCateList();
		},
		methods:{
			async getCateList(){ //获取商品分类数据
				const {data:res} = await this.$http.get('categories',{params: this.cateInfo});
				if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败');
				// this.$message.success('获取商品分类数据成功');
				this.cateDate = res.data.result;
				this.total = res.data.total;
				console.log(res.data)
			},
			async getParentCateList(){ //获取父类数据列表
				const {data:res} = await this.$http.get('categories',{params: {type:2}});
				if(res.meta.status !== 200) return this.$message.error('获取商品父类数据失败');
				// this.$message.success('获取父类数据列表');
				this.ParentCateList = res.data;
				console.log(this.ParentCateList)
			},
			handleSizeChange(size){ //每页条数
				this.cateInfo.pagesize = size;
				console.log(`每页 ${size} 条`);
				this.getCateList();
			},
			handleCurrentChange(page){//当前页
				console.log(`当前页: ${page}`);
				this.cateInfo.pagenum = page;
				this.getCateList();
			},
			addCate(){ //展示添加分类对话框
				this.dialogVisible = true;
				this.getParentCateList();
			},
			parentChanged(){
				
				if(this.selectedKeys.length > 0){
					//父类分类的id
					this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
					//当前分类的等级赋值
					this.addCateForm.cat_level = this.selectedKeys.length;
				}else{
					this.addCateForm.cat_id = 0;
					this.addCateForm.cat_level = 0;
				}
			},
			closeDialog(){
				this.$refs.addCateRef.resetFields();
				this.addCateForm.cat_id = 0;
				this.addCateForm.cat_level = 0;
				this.selectedKeys=[]
			},
			CateSure(){
				console.log(this.addCateForm)
				this.$refs.addCateRef.validate( async (valid)=>{
					if(!valid) return 
					const {data:res} =await this.$http.post('categories',
						this.addCateForm
					);
					if(res.meta.status !== 201) return this.$message.error('添加数据失败')
					this.$message.success('添加数据成功');
					this.getCateList();
					this.dialogVisible = false;
					
				})
			},
			//编辑对话框
			editCateDialog(row){
				console.log(row.cat_id)
				this.editCateForm.cat_name = row.cat_name;
				this.edit_cat_pid = row.cat_id;
				this.dialogEditVisible = true;
			},
			cateEditSure(){
				this.$refs.editCateRef.validate(  (valid)=>{
					if(!valid) return 
					const {data:res} =await this.$http.put(`categories/${this.edit_cat_pid}/${this.editCateForm.cat_name}`);
					// this.$http.put('categories/'+this.edit_cat_pid+'/'+this.editCateForm.cat_name).then((res)=>{
					// 	console.log(res);
					// })
					console.log(res);
					if(res.meta.status !== 200) return this.$message.error('更新数据失败')
					this.$message.success('更新数据成功');
					this.getCateList();
					this.dialogVisible = false;
					
				})
			},
			closeEditDialog(){
				this.dialogEditVisible = false;
			},
			removeCate(id){
				this.$confirm('是否删除该信息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
				    this.$http.delete('categories/'+id).then((res) => {
						this.getCateList();
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
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.el-icon-success{color: lightgreen;}
	.el-icon-error{color: lightcoral}
	.zk-table{margin: 10px 0;}
	.el-cascader{width: 100%;}
	
</style>
