<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- card区域 -->
		<el-card>
			<!-- 警告区域 -->
			<el-alert type="info" title="添加商品信息"  center show-icon :closable="false"></el-alert>
			<!-- 步骤条 -->
			
			<el-steps  :active="Number(activeIndex)" align-center finish-status="success">
			  <el-step title="基本信息"></el-step>
			  <el-step title="商品参数"></el-step>
			  <el-step title="商品属性"></el-step>
			  <el-step title="商品图片"></el-step>
			  <el-step title="商品内容"></el-step>
			  <el-step title="完成"></el-step>
			</el-steps>
			<!-- tab选择 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" > 
				<el-tabs :tab-position="'left'" v-model="activeIndex" @tab-click="handleClick" :before-leave="beforeTabLeave">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格"  prop="goods_price">
							<el-input v-model="addForm.goods_price" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addForm.goods_weight" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model="addForm.goods_number" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<el-cascader
							    v-model="addForm.goods_cat"
							    :options="tableDataList"
							    :props="cateProps"
							    @change="cateChanged" clearable  ></el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
							 <el-checkbox-group v-model="item.attr_vals" >
							    <el-checkbox border :label="cb" v-for="(cb,a) in item.attr_vals" :key='a'></el-checkbox>
							  </el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-form-item  :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
							<el-checkbox-group v-model="item.attr_vals" >
							   <el-checkbox border :label="cb" v-for="(cb,a) in item.attr_vals" :key='a'></el-checkbox>
							 </el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<!-- 上传图片 -->
						<el-upload
						  :action="uploadUrl"
						  :on-preview="handlePreview"
						  :on-remove="handleRemove"
						  :on-success="handleSuccess"
						  list-type="picture" :headers="hearders">
						  <el-button size="small" type="primary">点击上传</el-button>
						  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
						</el-upload>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
						<quill-editor v-model="addForm.goods_introduce"></quill-editor>
						<el-button type="primary" @click="addShop" class="btnT">添加商品</el-button>
					</el-tab-pane>
				</el-tabs>
				
			</el-form>
			
		</el-card>
		<!-- preview图片预览 -->
		<el-dialog
		  title="图片预览"
		  :visible.sync="dialogPicVisible"
		  width="50%">
		  <img :src="imgPath" alt="" class="imgWh">
		 
		</el-dialog>
		
	</div>
</template>

<script>
	import _ from 'lodash'
	export default {
		data(){
			return {
				tableDataList:[],
				activeIndex:'0',
				addForm:{
					goods_name:'',
					goods_price:0,
					goods_weight:0,
					goods_number:0,
					goods_cat:[],//商品所属的分类数组
					pics:[],
					goods_introduce:'',//富文本框内容
					attrs:[]
				},
				addFormRules:{
					goods_name:[
						{required:true,message:'请输入商品名称',trigger:'blur'}
					],
					goods_price:[
						{required:true,message:'请输入商品价格',trigger:'blur'}
					],
					goods_weight:[
						{required:true,message:'请输入商品重量',trigger:'blur'}
					],
					goods_number:[
						{required:true,message:'请输入商品数量',trigger:'blur'}
					],
					goods_number:[
						{required:true,message:'请选择商品分类',trigger:'blur'}
					],
					goods_introduce:[
						{required:true,message:'请填写文本内容',trigger:'blur'}
					],
				},
				selectedKeys:[],
				cateProps:{
					label:'cat_name',
					value:'cat_id',
					children:'children',
					expandTrigger:'hover'
				},
				onlyTableData:[],
				manyTableData:[],
				uploadUrl:'http://47.115.124.102:8888/api/private/v1/upload',
				hearders:{
					Authorization:window.sessionStorage.getItem('token')
				}, //Hearders请求头设置 ,从cookie里获取token，并赋值  Authorization
				dialogPicVisible:false,
				imgPath:''
			}
		},
		created(){
			this.getCateList();
		},
		methods:{
			async getCateList(){
				const {data:res} = await this.$http.get('categories');
				if(res.meta.status !== 200) return this.$message.error('列表数据获取失败')
				// this.$message.success('参数列表获取成功！')
				this.tableDataList = res.data;
			},
			cateChanged(){
				console.log(this.addForm.goods_cat)
				if(this.addForm.goods_cat.length !== 3){
					this.addForm.goods_cat.length=[];
					this.onlyTableData =[];
					this.manyTableData=[];
					return
				}

				
			},
			beforeTabLeave(activeName,oldActiveName){
				if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
					this.$message.error('请先选择商品分类')
					return false;
				}
			},
			async handleClick(){
				if(this.activeIndex === '1'){ //动态参数面板
					const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
						params:{sel:'many'},
					});
					if(res.meta.status !== 200) return this.$message.error('参数数据获取失败')
					res.data.forEach(item =>{
						item.attr_vals=  item.attr_vals.length !== 0 ? item.attr_vals.split(' ') :[];
					});
					this.manyTableData = res.data;
				}else if(this.activeIndex === '2'){
					const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
						params:{sel:'only'},
					});
					if(res.meta.status !== 200) return this.$message.error('参数数据获取失败')
					res.data.forEach(item =>{
						item.attr_vals=  item.attr_vals.length !== 0 ? item.attr_vals.split(' ') :[];
					});
					this.onlyTableData = res.data;
				}
			},
			//上传图片
			handleSuccess(response){
				//监听图片上传成功事件
				console.log(response);
				const fileInfo = {pic:response.data.tmp_path};
				this.addForm.pics.push(fileInfo)
			},
			handlePreview(file){//预览事件
				console.log(file);
				this.dialogPicVisible = true;
				const filePath = file.response.data.url;
				this.imgPath = filePath;
				console.log(filePath)
			},
			handleRemove(file){//移除文件时
				console.log(file);
				//1.获取删除图片的路径
				const filePath = file.response.data.tmp_path;
				//2.从pics数据中，找到这个图片对应的索引
				const index = this.addForm.pics.findIndex(x => x.pic === filePath)
				console.log(index)
				//3.调用splice方法，删除图片信息
				this.addForm.pics.splice(index,1);
				console.log(this.addForm)
			},
			addShop(){
				this.$refs.addFormRef.validate(async valid => {
					if(!valid)return this.$message.error('请填写必要的表单项')
					console.log(this.addForm)
					const form = _.cloneDeep(this.addForm);
					form.goods_cat = form.goods_cat.join(',')
					//处理动态参数
					this.manyTableData.forEach(item => {
						const newInfo ={
							attr_id:item.attr_id,
							attr_value:item.attr_vals.join(' ')
						}
						this.addForm.attrs.push(newInfo)
					})
					//处理静态属性
					this.onlyTableData.forEach(item => {
						const newInfo ={
							attr_id:item.attr_id,
							attr_value:item.attr_vals
						}
						this.addForm.attrs.push(newInfo)
					})
					
					form.attrs = this.addForm.attrs
					//发起请求
					const {data:res} = await this.$http.post('goods',form);
					console.log(res)
					if(res.meta.status !== 201) return this.$message.error('数据添加失败')
					this.$message.success('数据添加成功');
					this.$router.push('/goods');
				})
			}

		},
		computed:{
			cateId(){
				if(this.addForm.goods_cat.length === 3){
					return this.addForm.goods_cat[2];
				}
				return null;
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-steps{
		margin: 15px 0;
	}
	.el-cascader{ width: 280px;}
	.el-checkbox{margin:0 5px 0 0}
	.imgWh{width: 100%;}
	.btnT{margin-top:10px;}
</style>
