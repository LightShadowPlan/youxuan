/**
 * Created by qiangxl on 2019/3/23.
 */
import position_model from '../models/position'
import goods_item_template from '../views/goods-item.html'
import {bus, toast} from '../util'
import lookPic from './lookPic'
import admin from './admin'

//导航栏
const url = () => {
  let url = location.hash.indexOf('?') > 0 ? location.hash.slice(0, location.hash.indexOf('?')) : location.hash
  url = `'${url}'`
  let active = $(`.nva-box a[href=${url}]`)
  $('.nva-box a').removeClass('active')
  active.addClass('active')
}
//隐藏头部，点击返回
const defaultEvent = () => {
  $('#header').css({display: 'none'})
  $('.nav').css({display: 'none'})
  $('.go-back').on('click', () => {
    $('#header').css({display: 'flex'})
    $('.nav').css({display: 'block'})
    bus.emit('back')
  })
}
//商品详情
const goods = () => {
  defaultEvent()
}
const swiper = () => {
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

//添加商品
const addGoods = () => {
  let userToken = localStorage.userToken
  defaultEvent()
  let imgArr = [$('.img-box img').eq(0), $('.img-box img').eq(1), $('.img-box img').eq(2)]
  //图片处理
  lookPic($('.goodsPhoto'), imgArr, true);
  //token
  $('.userToken').val(userToken)

  $('#addGoods').on('submit', async function (e) {
    e.preventDefault()
    let _result = await position_model.addGoods()
    switch (_result.status) {
      case 200 :
        toast('上传成功');
        sessionStorage.user = JSON.stringify(_result.data[0]);
        bus.emit('back')
        break;
      case 205 :
        toast('token过期，请重新登录', 'error');
        break;
      case 500 :
        toast('上传失败，请重新再试', 'error');
        break;
    }
  })
}

//闲置馆
const goodsAllSelect = () => {
  $('.search-goods-box').on('click', 'li', function () {
    $(this).addClass('active').siblings().removeClass('active')
    let type = $(this).attr('type')
    let _result = position_model.selectGoods({type: type})
    let goodsAll_html = template.render(goods_item_template, {
      data: _result.data
    })
    $('.goodsAll-container').html(goodsAll_html)
  })
}

//物品管理
const delectGoods = () => {
  let userToken = localStorage.userToken
  //选择元素删除
  $('.goods-select').on('click', function () {
    if ($(this).attr('select') === 'true') {
      $(this).attr({'select': 'false', 'class': 'goods-select fa fa-circle-o'})
    } else {
      $(this).attr({'select': 'true', 'class': 'goods-select fa fa-circle'})
    }
  })
  //全选
  $('.goods-select-all').on('click', function () {
    let _index = $(this).attr('index')
    if ($(this).attr('select') === 'true') {
      $(this).html('全选')
      $(this).attr({'select': 'false'})
      $('.sell-box ul').eq(_index).find('.goods-select').attr({'select': 'false', 'class': 'goods-select fa fa-circle-o'})
    } else {
      $(this).html('全不选')
      $(this).attr({'select': 'true'})
      $('.sell-box ul').eq(_index).find('.goods-select').attr({'select': 'true', 'class': 'goods-select fa fa-circle'})
    }
  })
  //删除
  $('.goods-delete').on('click', async function () {
    let goodsArray = []
    let _index = $(this).attr('index')
    let selectArray = $('.sell-box ul').eq(_index).find('.goods-select[select=true]')
    for(let i = 0; i<selectArray.length; i++) {
      goodsArray.push(selectArray.eq(i).attr('index'))
    }
    console.log(goodsArray);
    let body = {'goodsArray': JSON.stringify(goodsArray),'userToken': userToken, 'state': _index}
    //删除物品
    let _result = await position_model.removeGoods(body)
    switch (_result.status) {
      case 200 : toast('删除成功');sessionStorage.user = JSON.stringify(_result.data[0]); admin.sell(); break;
      case 205: toast('登录过期，请重新登录','error'); break;
      case 500: toast('服务器错误,请重新再试','error'); break;
    }

  })
}


export default {
  url,
  goods,
  goodsAllSelect,
  delectGoods,
  swiper,
  addGoods
}