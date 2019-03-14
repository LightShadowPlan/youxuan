// 引入样式
import '../stylesheets/app.scss'

// 引入路由
import router from './router'
//引入事件
import bodyEvent from './controllers/bodyEvent'

//头部与侧边栏
import header_template from './views/header.html'
import left_sidebar from './views/left-sidebar.html'

$("#header").html(header_template)
$(".left-sidebar").html(left_sidebar)
bodyEvent.headerEvent()
bodyEvent.sidebarEvent()

// 启动路由
router.init()
