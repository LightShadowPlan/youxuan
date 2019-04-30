/**
 * Created by qiangxl on 2019/3/4.
 */
//
//------------------------------------------------------------


import {bus, toast} from '../util'
import lookPic from './lookPic'
import position from '../models/position'
import accountState from './webSocket'

import home_template from '../views/home.html'
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
    accountState(1)
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
  let account = JSON.parse(sessionStorage.account)
  let accountToken = localStorage.accountToken
  let home_data = await position.selectHomePush({})
  console.log(home_data.data);
  let home_html = template.render(home_template, {
    data: home_data.data
  })
  res.render(home_html)

  $('.message-token').val(accountToken)
  $('.message-_id').val(account._id)
  //编辑
  $('.change-url').on('click', async function () {
    //获取当前表单编号
    let _index = $(this).attr('_index')
    //input表单出现下划线，可以填写内容
    $(this).parent().parent().addClass('active')
    $(`form[_index=${_index}] .input`).removeAttr('disabled')
    //file图片可视化
    let file = $(`form[_index=${_index}] .url-file`)
    let photo = $(`form[_index=${_index}] .swiper-item-img`)
    lookPic(file, photo)
    //附带一个token
    $('.swiper-accountToken').val(accountToken)

  })
  //保存
  $('.swiper-item form').on('submit', async function (e) {
    e.preventDefault()
    let _index = e.target.attributes['_index'].value
    $(this).find('.url-content').removeClass('active')
    $(`form[_index=${_index}] .input`).attr({'disabled': ''})
    let _result = await position.updateHomePush(_index)


  })
  //添加
  $('.plus-one-box').on('click', async function () {
    let length = $('.swiper-item').length - 1
    let swiper_push_html = template.render(swiper_push_item, {
      data: length
    })
    //插入一个li
    $(this).before(swiper_push_html)
    if (length >= 5) {
      $(this).addClass('hide')
    }
    //图片上传可视化
    let file = $(`form[_index=${length}] .url-file`)
    let photo = $(`form[_index=${length}] .swiper-item-img`)
    lookPic(file, photo)

    //删除
    $('.times').on('click', function () {
      $(this).parent().parent().remove()
      let length = $('.swiper-moban').length
      if (length <= 1) {
        $('.plus-one-box').removeClass('hide')
      }
    })
    //删除
    $('.change-url').on('click', function () {
      let _index = $(this).attr('_index')
      $(`.swiper-item[_index=${_index}]`).remove()
      let length = $('.swiper-moban').length
      if (length <= 1) {
        $('.plus-one-box').removeClass('hide')
      }
    })
    //上传新的推荐
    $('.swiper-item form').on('submit', async function (e) {
      e.preventDefault()
      let _index = e.target.attributes['_index'].value
      let _result = await position.addHomePush(_index)
      console.log(_result);
    })

  })
  //删除
  $('.times').on('click', async function () {
    let _id = $(this).attr('_id')
    let oldHomePhoto = $('.swiper-oldHomePhoto').val()
    let length = $('.swiper-item').length
    if (length <= 1) {
      $('.plus-one-box').addClass('hide')
    }
    $(this).parent().parent().remove()

    let body = {
      accountToken: accountToken,
      _id: _id,
      oldHomePhoto: oldHomePhoto
    }
    let _result = await position.removeHomePush(body)

    console.log(_result.data);


  })


  //消息推送
  $('#messagePush').on('submit', async function(e) {
    e.preventDefault()
    let _result = await position.messagePush()
    console.log(_result.data);
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