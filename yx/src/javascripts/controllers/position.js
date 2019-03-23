import {bus, toast} from '../util'
// 首页视图
import home_template from '../views/home.html'
// 学习用品视图
import study_template from '../views/study.html'
// 生活产品视图
import left_template from '../views/left.html'
// 数码产品视图
import digital_template from '../views/digital.html'
// 我的视图
import mine_template from '../views/mine.html'

import bodyEvent  from './bodyEvent'
// 404视图
import fzf_template from '../views/404.html'

import position_model from '../models/position'
import admin_model from '../models/admin'

//解析路径
import qs from 'querystring'

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
  let mySwiper = new Swiper('.swiper-container', {
    loop: true, // 循环模式选项
    speed: 500,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
    },

    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
}
// 学习用品视图的控制器
const study = async (req, res, next) => {
  res.render(study_template)
  bindStudyEvent()// 给添加按钮绑定事件
  bodyEvent.url()
}
const bindStudyEvent = async () => {

}
// 生活用品视图的控制器
const left = async (req, res, next) => {
  res.render(left_template)
  bindeLeftEvent()// 给添加按钮绑定事件
  bodyEvent.url()
}
const bindeLeftEvent = async () => {

}
// 数码用品视图的控制器
const digital = async (req, res, next) => {
  res.render(digital_template)
  bindDigitalEvent()// 给添加按钮绑定事件
  bodyEvent.url()
}
const bindDigitalEvent = async () => {

}

// 我的视图的控制器
const mine = async (req, res, next) => {
  res.render(mine_template)
  adminEvent.loginEvent()
  adminEvent.navEvent()
  bodyEvent.url()
}

// 404视图的控制器
const fzf = async (req, res, next) => {
  res.render(fzf_template)
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
  study,
  left,
  digital,
  mine,
  fzf,
}