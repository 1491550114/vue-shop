<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 主体区域 -->
		<el-card>
			<el-table :data='rightsList' border stripe>
				<el-table-column type="index" label="序号">	
				</el-table-column>
				<el-table-column label="权限名称" prop="authName">
				</el-table-column>
				<el-table-column label="路径" prop="path">
				</el-table-column>
				<el-table-column label="权限等级" >
					<template v-slot="data">
						<el-tag v-if="data.row.level =='0'" type="primary">一级</el-tag>
						<el-tag v-if="data.row.level =='1'" type="success">二级</el-tag>
						<el-tag v-if="data.row.level =='2'" type="warning">三级</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				rightsList:[],
			}
		},
		created(){
			this.getRightsList()
		},
		methods:{
			//获取权限列表数据
			async getRightsList(){
				const {data:res}  = await this.$http.get('rights/list');
				if(res.meta.status !== 200){return this.$message.error('获取权限列表失败')}
				this.rightsList = res.data;
				this.$message.success('获取权限列表成功')
				// console.log(res)
			},
			//权限等级转化处理
			formatterLevel(row){
				switch(row.level){
					case "0":return '一级';break;
					case "1":return '二级';break;
					case "2":return '三级';break;
				}
			}
		}
	}
</script>

<style>
</style>
