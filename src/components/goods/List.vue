<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- card区域 -->
		<el-card>
			<!-- 搜索框 -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input clearable  placeholder="请输入内容"
					v-model="queryInfo.query"  @clear="getGoodsList()">
						<el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addShop">添加商品</el-button>
				</el-col>
			</el-row>
			<!-- table数据 -->
			<el-table border stripe :data="tableDataList">
				<el-table-column type="index" label="序号" ></el-table-column>
				<el-table-column  label="商品名称" prop="goods_name" ></el-table-column>
				<el-table-column  label="商品价格(元)" prop="goods_price" width="80px"></el-table-column>
				<el-table-column  label="商品重量" prop="goods_weight" width="80px"></el-table-column>
				<el-table-column  label="创建时间" prop="add_time ">
					<template v-slot="scope">
						{{scope.row.add_time | formDate}}
					</template>
				</el-table-column>
				<el-table-column  label="操作">
					<template v-slot="scope">
						<el-button type="primary" icon="el-icon-edit" size="small"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="small" @click="removeById(scope.row.goods_id)"></el-button>
					</template>
					
				</el-table-column>
			</el-table>
			<!-- 分页功能 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryInfo.pagenum"
			      :page-sizes="[100, 200, 300, 400]"
			      :page-size="queryInfo.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
		</el-card>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				tableDataList:[],
				queryInfo: {
					query: '',
					pagenum: 1, //当前页数
					pagesize: 10 //每页显示条目个数
				},
				total:0
			}
		},
		created(){
			// this.getCateList();
			this.getGoodsList();
		},
		methods:{
			async getCateList(){
				const {data:res} = await this.$http.get('categories');
				console.log(res)
				if(res.meta.status !== 200) return this.$message.error('列表数据获取失败')
				this.$message.success('参数列表获取成功！')
			},
			async getGoodsList(){
				const {data:res} = await this.$http.get('goods',{params:this.queryInfo});
				console.log(res.data)
				if(res.meta.status !== 200) return this.$message.error('列表数据获取失败')
				// this.$message.success('参数列表获取成功！')
				this.tableDataList = res.data.goods;
				this.total = res.data.total;
			},
			handleSizeChange(pagesize){
				console.log('每页数据'+pagesize)
				this.queryInfo.pagesize = pagesize;
				this.getGoodsList();
			},
			handleCurrentChange(pagenum){
				this.queryInfo.pagenum = pagenum;
				this.getGoodsList();
				console.log('当前页'+pagenum)
			},
			removeById(id){
				this.$confirm('是否删除该信息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
				    this.$http.delete(`goods/`+id).then((res) => {
						console.log(res)
						this.getGoodsList();
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
			addShop(){
				this.$router.push('/goods/add')
			}
		},
		computed:{
			
		}
	}
</script>

<style>
</style>
