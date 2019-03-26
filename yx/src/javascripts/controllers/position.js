import {bus, toast} from '../util'
// 首页视图
import home_template from '../views/home.html'
// 闲置馆视图
import goodsAll_template from '../views/goodsAll.html'
// 收藏夹视图
import favorite_template from '../views/favorite.html'
// 我的视图
import mine_template from '../views/mine.html'
// 404视图
import fzf_template from '../views/404.html'

import bodyEvent  from './bodyEvent'
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
  goodsAll,
  mine,
  favorite,
  fzf,
}