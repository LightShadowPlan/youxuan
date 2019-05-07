import SMERouter from 'sme-router'
// bus工具
import bus from '../util/bus'

// position 控制器
import position_controller from '../controllers/position'

var router = null


// 启动路由的方法
const _init = () => {
  // 实例化路由工具
  router = new SMERouter('router-view')

  // 开始匹配各个路由
  // 登录
  router.route('/login', position_controller.login)
  // 首页
  router.route('/home', position_controller.home)
  // 物品
  router.route('/goods', position_controller.goods)
  //交易管理
  router.route('/transactions', position_controller.transactions)
  //数据统计
  router.route('/dataCount', position_controller.dataCount)
  //权限管理
  router.route('/superpowers', position_controller.superpowers)
  //权限申请管理
  router.route('/powerApply', position_controller.powerApply)
  //用户账号管理
  router.route('/user', position_controller.user)
  //个人中心管理
  router.route('/person', position_controller.person)
  //权限申请
  router.route('/powerRequire', position_controller.powerRequire)
  //消息
  router.route('/message', position_controller.message)
  //物品详情
  router.route('/goodsContent', position_controller.goodsContent)
    //用户详情
  router.route('/userContent', position_controller.userContent)
  // 404路由
  router.route('/404', position_controller.fzf)

  //上面的没有匹配到就会跳转404路由或者首页
  router.route('*', (req, res, next) => {
    if (req.url === '') { // 刚进入项目，没有hash值，重定向到login
      res.redirect('/login')
    } else { // 如果路径匹配不到，导向404
      res.redirect('/404')
    }
  })

  // 因为在控制器中无法使用到router，所以给bus绑定事件，在其他模块中触发bus的事件
  bus.on('go', (path, body = {}) => router.go(path, body))
  bus.on('back', () => router.back())

}


export default {
  init: _init
}

