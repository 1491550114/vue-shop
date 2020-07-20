import Vue from 'vue'
import {
	Button,
	Form,
	FormItem,
	Input,
	Message,
	Container,
	Header,
	Aside,
	Main,
	Footer,
	Menu,
	Submenu,
	MenuItem,
	MenuItemGroup,
	Breadcrumb,
	BreadcrumbItem,
	Card,
	Row,
	Col,
	Table,
	TableColumn,
	Pagination,
	Switch,
	Tooltip,
	Dialog,
	MessageBox,
	Tag,
	Tree,
	Select,
	Option,
	Cascader
} from 'element-ui'
// Vue.component(Message.name, Message)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
//把message挂在到Vue中，全局可以使用
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
