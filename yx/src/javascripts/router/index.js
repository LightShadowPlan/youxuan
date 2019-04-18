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
  // 首页
  router.route('/home', position_controller.home)
  //闲置馆
  router.route('/goodsAll', position_controller.goodsAll)
  //闲置馆
  router.route('/favorite', position_controller.favorite)
  // 我的
  router.route('/mine', position_controller.mine)
  //物品详情
  router.route('/goods', position_controller.goods)
  //添加物品
  router.route('/addGoods', position_controller.addGoods)
  // 404路由
  router.route('/404', position_controller.fzf)


  //上面的没有匹配到就会跳转404路由或者首页
  router.route('*', (req, res, next) => {
    if (req.url === '') { // 刚进入项目，没有hash值，重定向到login
      res.redirect('/home')
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

