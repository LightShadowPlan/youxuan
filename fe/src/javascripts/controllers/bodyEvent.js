/**
 * Created by qiangxl on 2019/3/4.
 */
//
//------------------------------------------------------------


import {bus, toast} from '../util'
import lookPic from './lookPic'

import swiper_push_item from '../views/swiper-push-item.html'

function trigger(selector1, selector2, className) {
  if (selector1.attr('index') === '1') {
    selector2.removeClass(className)
    selector1.attr('index', '0')
  } else {
    selector2.addClass(className)
    selector1.attr('index', '1')
  }
}

//头部菜单按钮，判断是否隐藏或显示侧边栏
const headEvent = async () => {
  $(".header-switch-button").on("click", function () {
    trigger($(this), $(".left-sidebar"), "hide-sidebar")
  })
  let showTime = () => {
    let week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let now = new Date();
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let weekDay = now.getDay()
    let hours = now.getHours()
    let minutes = now.getMinutes()
    hours = hours >= 10 ? hours : '0' + hours
    minutes = minutes >= 10 ? minutes : '0' + minutes
    $(".time-show").html(year + "年" + month + "月" + day + "日" + "&nbsp;&nbsp;" + hours + ':' + minutes + "&nbsp;&nbsp;" + week[weekDay]);
  }
  showTime()
  setInterval(showTime, 60000)
  $('.exit').on('click', function () {
    localStorage.accountToken = ''
    sessionStorage.account = ''
    bus.emit('go', '/login')
  })

}
//侧边栏子目录显示与隐藏
const sidebarEvent = () => {
  $(".nav-list-little").on("click", function () {
    let that = $(this).parent()
    trigger(that, that, "show-more")
  })
}

//----------------------------------------------------------------
//侧边栏个人中心状态
const show_admin = () => {
  let account = JSON.parse(sessionStorage.account)
  $('.admin-photo').attr('src', account.headPortrait)
  $('.admin-nickname').html(account.nickname)
  if (account.message.length > 0) {
    $('.message').html(account.message.length)
    $('.message').addClass('show')
  }
  //判断location.hash中是否有'?',取出'?'前的hash值
  let url = location.hash.indexOf('?') > 0 ? location.hash.slice(0, location.hash.indexOf('?')) : location.hash
  url = `'${url}'`
  let active = $(`.sidebar-list a[href=${url}]`)
  $(`.sidebar-list .active`).removeClass('active')
  active.addClass('active')
  active.parent().parent().find('p').addClass('active')
}

//首页
const homePush = async (req, res) => {
  //编辑
  $('.change-url').on('click', async function () {
    let _index = $(this).attr('_index')
    $(this).parent().parent().addClass('active')
    $(`form[_index=${_index}] .input`).removeAttr('disabled')
    let file = $(`form[_index=${_index}] .url-file`)
    let photo = $(`form[_index=${_index}] .swiper-item-img`)
    lookPic(file, photo)

  })
  //保存
  $('.submit-url').on('click', async function () {
    let _index = $(this).attr('_index')
    $(this).parent().parent().removeClass('active')
    $(`form[_index=${_index}] .input`).attr({'disabled': ''})
  })
  //添加
  $('.plus-one-box').on('click', function () {
    let length = $('.swiper-item').length - 1
    let swiper_push_html = template.render(swiper_push_item, {
      data: length
    })
    $(this).before(swiper_push_html)
    if (length >= 5) {
      $(this).css({display: 'none'})
    }
    //删除
    $('.times').on('click', function () {
      $(this).parent().parent().remove()
    })
  })
  //删除
  $('.times').on('click', function () {
    $(this).parent().parent().remove()
  })
}


//页面状态
const large = () => {
  $("body").addClass("large")
}
const little = () => {
  $("body").removeClass("large")
}

export default {
  headEvent,
  sidebarEvent,
  show_admin,
  large,
  little,
  homePush
}