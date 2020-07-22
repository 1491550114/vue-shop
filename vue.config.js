module.exports = {
	lintOnSave: false, //是否在保存的时候使用‘eslint-loader’进行检查
	chainWebpack: config => {
		// 发布模式
		config.when(process.env.NODE_ENV === 'production', config => {
			config.entry('app').clear().add('./src/main-prod.js')
			config.set('externals', {
				vue: 'Vue',
				 // 'vue-router': 'VueRouter',
				axios: 'axios',
				lodash: '_',
				echarts: 'echarts',
				nprogress: 'NProgress',
				'vue-quill-editor': 'VueQuillEditor'
			})
			//首页内容title名称判断
			config.plugin('html').tap(args => {
				args[0].title = true
				return args
			})
			
		})
		//开发模式
		config.when(process.env.NODE_ENV === 'development', config => {
			config.entry('app').clear().add('./src/main-dev.js')
			config.set('externals', {
				vue: 'Vue',
				axios: 'axios',
				lodash: '_',
				echarts: 'echarts',
				nprogress: 'NProgress',
				'vue-quill-editor': 'VueQuillEditor'
			})
			config.plugin('html').tap(args => {
				args[0].title = false
				return args
			})
		})
	}
}
