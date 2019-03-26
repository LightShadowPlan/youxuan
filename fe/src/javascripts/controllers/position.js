import {bus, toast} from '../util'
import bodyEvent from './bodyEvent'
// 首页视图
import home_template from '../views/home.html'
// 物品信息视图
import goods_template from '../views/goods.html'
// 登陆视图
import login_template from '../views/login.html'
// 404视图
import fzf_template from '../views/404.html'

import Echarts from './echarts'
import position_model from '../models/position'
import admin_model from '../models/admin'

//解析路径
import qs from 'querystring'

//加载事件
//登录，注册
import adminEvent from './admin'

// 首页视图的控制器
const home = async (req, res, next) => {
  res.render(home_template)
  bodyEvent.little()
  bodyEvent.show_admin()
  Echarts.showData()
  toast('加载完成')
}

// 物品视图的控制器
const goods = async (req, res, next) => {
  res.render(goods_template)
  bodyEvent.show_admin()
}

// 登陆视图的控制器
const login = async (req, res, next) => {
  res.render(login_template)
  adminEvent.loginEvent()
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
}