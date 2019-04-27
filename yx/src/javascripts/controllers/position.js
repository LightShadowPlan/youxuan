
// 闲置馆视图
import goodsAll_template from '../views/goodsAll.html'
// 我的视图
import mine_template from '../views/mine.html'
// 添加物品视图
import addGoods_template from '../views/addGoods.html'


// 活动详情
import active_template from '../views/active.html'
// 404视图
import fzf_template from '../views/404.html'

import bodyEvent from './bodyEvent'

//加载事件
//登录，注册
import adminEvent from './admin'

// 消息视图的控制器
const message = async (req, res, next) => {
  bodyEvent.message(req, res)
}

//用户信息
const user = async (req, res) => {
  bodyEvent.user(req, res)
}

// 首页视图的控制器
const home = async (req, res, next) => {
  bodyEvent.homeShow(res)
  bodyEvent.url()
}

// 闲置馆视图的控制器
const goodsAll = async (req, res, next) => {
  res.render(goodsAll_template)
  bodyEvent.url()
  bodyEvent.goodsAllSelect()

}

// 收藏夹视图的控制器
const favorite = async (req, res, next) => {
  bodyEvent.showFavorite(req,res)
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
  bodyEvent.goods(req,res)
}

// 404视图的控制器
const fzf = async (req, res, next) => {
  res.render(fzf_template)
}

// 活动页视图的控制器
const active = async (req, res, next) => {
  res.render(active_template)
  bodyEvent.url()
}

export default {
  home,
  goodsAll,
  mine,
  favorite,
  goods,
  fzf,
  addGoods,
  active,
  message,
  user
}