
// 首页视图
import home_template from '../views/home.html'
// 闲置馆视图
import goodsAll_template from '../views/goodsAll.html'
// 收藏夹视图
import favorite_template from '../views/favorite.html'
// 我的视图
import mine_template from '../views/mine.html'
// 添加物品视图
import addGoods_template from '../views/addGoods.html'
// 物品详情
import goods_template from '../views/goods.html'
// 404视图
import fzf_template from '../views/404.html'

import bodyEvent from './bodyEvent'

//加载事件
//登录，注册
import adminEvent from './admin'

// 首页视图的控制器
const home = async (req, res, next) => {
  // let home_html = template.render(home_template,{
  //     data: _res.data[0]
  // })
  // res.render(home_html)
  res.render(home_template)
  bindHomeEvent()// 给添加按钮绑定事件
  bodyEvent.url()
}
const bindHomeEvent = async (req, res, next) => {
  bodyEvent.swiper()
}

// 闲置馆视图的控制器
const goodsAll = async (req, res, next) => {
  res.render(goodsAll_template)
  bodyEvent.url()
  bodyEvent.goodsAllSelect()

}

// 收藏夹视图的控制器
const favorite = async (req, res, next) => {
  res.render(favorite_template)
  bodyEvent.url()
  bodyEvent.delectGoods()
}

// 我的视图的控制器
const mine = async (req, res, next) => {
  res.render(mine_template)
  adminEvent.mineEvent()
  bodyEvent.url()
}

// 添加物品视图的控制器
const addGoods = async (req, res, next) => {
  res.render(addGoods_template)
  bodyEvent.addGoods()
}

// 物品详情的控制器
const goods = async (req, res, next) => {
  res.render(goods_template)
  bodyEvent.goods()
  bodyEvent.swiper()
}

// 404视图的控制器
const fzf = async (req, res, next) => {
  res.render(fzf_template)
}



export default {
  home,
  goodsAll,
  mine,
  favorite,
  goods,
  fzf,
  addGoods
}