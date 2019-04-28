import {bus, toast} from '../util'
import bodyEvent from './bodyEvent'
// 首页视图
import home_template from '../views/home.html'
// 登录视图
import login_template from '../views/login.html'
// 物品管理视图
import goods_template from '../views/goods.html'
// 交易管理视图
import transactions_template from '../views/transactions.html'
// 数据统计视图
import dataCount_template from '../views/dataCount.html'
// 权限管理视图
import superpowers_template from '../views/superpowers.html'
// 权限申请管理视图
import powerApply_template from '../views/powerApply.html'
// 管理员账号管理视图
import account_template from '../views/account.html'
// 用户账号管理视图
import user_template from '../views/user.html'
// 个人中心管理视图
import person_template from '../views/person.html'
// 404视图
import fzf_template from '../views/404.html'
// 权限申请视图
import powerRequire_template from '../views/powerRequire.html'

import Echarts from './echarts'
import position_model from '../models/position'
import admin_model from '../models/admin'

//解析路径
import qs from 'querystring'

//加载事件
//登录，注册
import loginEvent from './login'
import adminEvent from './admin'

// 首页视图的控制器
const home = async (req, res, next) => {
  bodyEvent.little()
  bodyEvent.show_admin()
  await bodyEvent.homePush(req, res)
  toast('加载完成')
}

// 物品视图的控制器
const goods = async (req, res, next) => {
  res.render(goods_template)
  bodyEvent.show_admin()
}

// 交易管理视图的控制器
const transactions = async (req, res, next) => {
  res.render(transactions_template)
  bodyEvent.show_admin()
}

// 数据统计视图的控制器
const dataCount = async (req, res, next) => {
  res.render(dataCount_template)
  bodyEvent.show_admin()
  Echarts.showData()
}

//权限管理视图的控制器
const superpowers = async (req, res, next) => {
  res.render(superpowers_template)
  bodyEvent.show_admin()
}

//权限申请管理视图的控制器
const powerApply = async (req, res, next) => {
  res.render(powerApply_template)
  bodyEvent.show_admin()
}

//管理员账号管理视图的控制器
const account = async (req, res, next) => {
  res.render(account_template)
  bodyEvent.show_admin()
}

//个人中心
const person = async (req, res, next) => {
  res.render(person_template)
  bodyEvent.show_admin()
  adminEvent()
}

// 用户账号管理视图的控制器
const user = async (req, res, next) => {
  res.render(user_template)
  bodyEvent.show_admin()
}

// 登录视图的控制器
const login = async (req, res, next) => {
  res.render(login_template)
  loginEvent()
}

//权限申请页面
const powerRequire = async (req, res, next) => {
  res.render(powerRequire_template)
  bodyEvent.large()
  $('.go-back-login').on('click', function() {
    localStorage.accountToken = ''
    bus.emit('go', '/login')
  })
}

// 404视图的控制器
const fzf = async (req, res, next) => {
  res.render(fzf_template)
  bodyEvent.large()
}


//
// //图片预览
// function lookPic(options){
//     let File = function(){
//         let file = {};
//         file.previewImage = function(file){
//             let div = file.parentNode.children[0];
//             if (file.files && file.files[0])
//             {
//                 let img = div.children[0];
//                 let reader = new FileReader();
//                 reader.onload = function(evt){img.src = evt.target.result;}
//                 reader.readAsDataURL(file.files[0]);
//             }
//         }
//         return file;
//     }();
//     function initActions() {
//         options.on('change', function() {
//             File.previewImage(options[0]);
//         });
//     }
//     initActions()
// }


export default {
  home,
  login,
  fzf,
  goods,
  transactions,
  dataCount,
  superpowers,
  powerApply,
  account,
  user,
  person,
  powerRequire
}