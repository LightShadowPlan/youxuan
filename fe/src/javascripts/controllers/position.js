import {bus, toast} from '../util'
import bodyEvent from './bodyEvent'

// 登录视图
import login_template from '../views/login.html'
// 数据统计视图
import dataCount_template from '../views/dataCount.html'

// 用户账号管理视图
import user_template from '../views/user.html'
// 个人中心管理视图
import person_template from '../views/person.html'
// 404视图
import fzf_template from '../views/404.html'
// 权限申请视图
import powerRequire_template from '../views/powerRequire.html'

import Echarts from './echarts'
import accountState from './webSocket'


//解析路径
import qs from 'querystring'

//加载事件
//登录，注册
import loginEvent from './login'
import adminEvent from './admin'

// 首页视图的控制器
const home = async (req, res, next) => {
  await bodyEvent.show_admin()
  bodyEvent.little()
  await bodyEvent.homePush(req, res)
  await accountState()
  toast('加载完成')
}

// 物品视图的控制器
const goods = async (req, res, next) => {
  await bodyEvent.show_admin()
  await bodyEvent.goodsManage(req, res)
  accountState()
}

// 物品详情视图的控制器
const goodsContent = async (req, res, next) => {
  await bodyEvent.show_admin()
  await bodyEvent.goodsContent(req, res)
  accountState()
}

// 物品详情视图的控制器
const userContent = async (req, res, next) => {
  await bodyEvent.show_admin()
  await bodyEvent.userContent(req, res)
  accountState()
}

// 交易管理视图的控制器
const transactions = async (req, res, next) => {
  await bodyEvent.show_admin()
  await bodyEvent.transactions(req, res)
  accountState()
}

// 数据统计视图的控制器
const dataCount = async (req, res, next) => {
  await bodyEvent.show_admin()
  res.render(dataCount_template)
  Echarts.showData()
  accountState()
}

//权限管理视图的控制器
const superpowers = async (req, res, next) => {
  await bodyEvent.show_admin()
  bodyEvent.superpowers(req, res)
}

//权限申请管理视图的控制器
const powerApply = async (req, res, next) => {
  await bodyEvent.show_admin()
  accountState()
  bodyEvent.powerApply(req, res)
}

//个人中心
const person = async (req, res, next) => {
  await bodyEvent.show_admin()
  accountState()
  res.render(person_template)
  adminEvent()
}

// 用户账号管理视图的控制器
const user = async (req, res, next) => {
  await bodyEvent.show_admin()
  await bodyEvent.user(req, res)
  accountState()
}

// 登录视图的控制器
const login = async (req, res, next) => {
  res.render(login_template)
  loginEvent()
}

//权限申请页面
const powerRequire = async (req, res, next) => {
  await bodyEvent.show_admin()
  res.render(powerRequire_template)
  bodyEvent.large()
  $('.go-back-login').on('click', function () {
    localStorage.accountToken = ''
    bus.emit('go', '/login')
  })
}

//消息页面
const message = async (req, res, next) => {
  await bodyEvent.show_admin()
  bodyEvent.message(req, res)
}

// 404视图的控制器
const fzf = async (req, res, next) => {
  accountState()
  res.render(fzf_template)
  bodyEvent.large()

}


export default {
  home,
  login,
  fzf,
  goods,
  transactions,
  dataCount,
  superpowers,
  powerApply,
  user,
  person,
  powerRequire,
  message,
  goodsContent,
  userContent
}