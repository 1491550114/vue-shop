<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item >订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- card区域 -->
		<el-card>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model.trim="queryInfo.query" @clear="getOrderList()">
					    <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
					  </el-input>
				</el-col>
			</el-row>
			<el-table border stripe :data="tableOrderData">
				<el-table-column type="index"></el-table-column>
				<el-table-column label="订单编号" prop="order_number"></el-table-column>
				<el-table-column label="订单价格" prop="order_price"></el-table-column>
				<el-table-column label="是否付款" prop="order_pay">
					<template v-slot="scope">
						<el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
						<el-tag type="success" v-else="scope.row.order_pay === '1'">已付款</el-tag>
					</template>
					
				</el-table-column>
			    <el-table-column label="是否发货" prop="is_send"></el-table-column>
				<el-table-column label="下单时间" prop="create_time">
					<template v-slot="scope">
						{{scope.row.create_time | formDate}}
					</template>
				</el-table-column>
			    <el-table-column label="操作">
					<template v-slot="scope">
						<el-button type="primary" icon="el-icon-edit" size="small" @click="showAddress"></el-button>
						<el-button type="success" icon="el-icon-location" size="small" @click="showLoction()"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页效果 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryInfo.pagenum"
			      :page-sizes="[5, 10, 15, 20]"
			      :page-size="queryInfo.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total" background>
			    </el-pagination>
		</el-card>
		<!-- 修改地址对话框 -->
		<el-dialog
		  title="修改地址"
		  :visible.sync="addressVisible"
		  width="50%" @close="closeAddressDialog">
		  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
		  		<el-form-item label="省市区/县" prop="cityInfo">
					<!-- <el-input v-model="addForm.cityInfo"></el-input> -->
					<el-cascader
					    v-model="addForm.cityInfo"
					    :options="cityDate"
					    :props="{ expandTrigger: 'hover' }"
					    ></el-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="adderssInfo">
					<el-input v-model="addForm.adderssInfo"></el-input>
				</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addressVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 物流对话框 -->
		<el-dialog
		  title="物流信息"
		  :visible.sync="locationVisible"
		  width="50%">
		  <!-- 时间线 -->
			<el-timeline >
		     <el-timeline-item
		       v-for="(activity, index) in activities"
		       :key="index"
		       :timestamp="activity.ftime">
		       {{activity.context}}
		     </el-timeline-item>
		   </el-timeline>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="locationVisible = false">取 消</el-button>
		    <el-button type="primary" @click="locationVisible = false">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	// 导入省市区县插件
	import cityDate from '../../assets/js/citydata.js'
	export default {
		data(){
			return{
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:5
				},
				tableOrderData:[],
				total:0,
				addressVisible:false,
				locationVisible:false,
				addForm:{
					cityInfo:'',
					adderssInfo:''
				},
				addFormRules:{
					cityInfo:[
						{required:true,message:'请选择省市区县',trigger:'blur'}
					],adderssInfo:[
						{required:true,message:'请输入详细地址',trigger:'blur'}
					]
				},
				cityDate,
				activities:[]
			}
		},
		created(){
			this.getOrderList()
		},
		methods:{
			async getOrderList(){
				const {data:res} = await this.$http.get('orders',{params:this.queryInfo});
				if(res.meta.status !== 200) return this.$message.error('订单数据获取失败');
				this.tableOrderData = res.data.goods;
				this.total = res.data.total;
			},
			handleSizeChange(newsize){
				this.queryInfo.pagenum = newsize;
				this.getOrderList();
			},
			handleCurrentChange(newpage){
				this.queryInfo.pagenum = newpage;
				this.getOrderList();
			},
			 async showLoction(){
				this.locationVisible = true;
				const {data:res} = await this.$http.get('kuaidi/1106975712662');
				// this.$http.jsonp('../../../public/static/location.json').then((res) => {
				// 	console.log(res)
				// })
				this.activities = res.data;
				console.log(res)
			},
			showAddress(){
				this.addressVisible =  true;
			},
			closeAddressDialog(){
				this.addressVisible =  false;
				this.$refs.addFormRef.resetFields();
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.el-cascader{width: 100%;}
</style>
