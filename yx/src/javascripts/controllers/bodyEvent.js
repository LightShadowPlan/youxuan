/**
 * Created by qiangxl on 2019/3/23.
 */
import position_model from '../models/position'
import goods_item_template from '../views/goods-item.html'
import {bus, toast} from '../util'

const url = () => {
  let url = location.hash.indexOf('?') > 0 ? location.hash.slice(0, location.hash.indexOf('?')) : location.hash
  url = `'${url}'`
  let active = $(`.nva-box a[href=${url}]`)
  $('.nva-box a').removeClass('active')
  active.addClass('active')
}
const goods = () => {
  $('#header').css({display: 'none'})
  $('.nav').css({display: 'none'})

  $('.go-back').on('click', () => {
    $('#header').css({display: 'flex'})
    $('.nav').css({display: 'block'})
    bus.emit('back')
  })
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

const delectGoods = () => {

  //选择元素删除
  $('.goods-select').on('click', function () {
    if ($(this).attr('select') === 'true') {
      $(this).attr({'select': 'false', 'class': 'goods-select fa fa-circle-o'})
    } else {
      $(this).attr({'select': 'true', 'class': 'goods-select fa fa-circle'})
    }
  })
}


export default {
  url,
  goods,
  goodsAllSelect,
  delectGoods,
  swiper
}