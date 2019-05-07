/**
 * Created by qiangxl on 2019/3/4.
 */
//
//------------------------------------------------------------


import {bus, toast} from '../util'
import lookPic from './lookPic'
import position_model from '../models/position'
import accountState from './webSocket'
import admin_model from '../models/admin'

import home_template from '../views/home.html'
import swiper_push_item from '../views/swiper-push-item.html'
import message_template from '../views/message.html'
import message_item_template from '../views/message-item.html'
import powerApply_template from '../views/powerApply.html'
import superpowers_template from '../views/superpowers.html'
import goods_template from '../views/goods.html'
import goods_item_template from '../views/goods-item.html'
import transactions_template from '../views/transactions.html'
import transactions_item_template from '../views/transactions-item.html'
import user_template from '../views/user.html'
import user_item_template from '../views/user-item.html'
import goodsContent_template from '../views/goodsContent.html'
import userContent_template from '../views/userContent.html'


function trigger(selector1, selector2, className) {
  if (selector1.attr('index') === '1') {
    selector2.removeClass(className)
    selector1.attr('index', '0')
  } else {
    selector2.addClass(className)
    selector1.attr('index', '1')
  }
}

//头部菜单按钮，判断是否隐藏或显示侧边栏------------------------------------------------------
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

//消息----------------------------------------------------------------------------
const message = (req, res) => {
  show_admin()
  if (sessionStorage.account) {
    let account = JSON.parse(sessionStorage.account)
    let accountToken = localStorage.accountToken
    let messageArray = JSON.parse(sessionStorage.message)
    // //senderArray为最终数组，senderName记录每个元素未读的属性名
    let senderArray = [], senderName = [], plus = 0
    messageArray.forEach(item => {
      let _index = senderName.indexOf(item.sender)
      if (_index < 0) {
        senderArray[plus] = []  //初始化数组的第n个元素为数组
        senderArray[plus].push(item)  //第n个元素添加数据
        senderName.push(item.sender)
        plus++
      } else {
        senderArray[_index].push(item)
      }
    })
    senderArray.forEach((item, index) => {
      let sum = 0
      item.forEach(_item => {
        if (_item.state === 0) {
          sum += 1
        }
      })
      senderName[index] = sum
      sum = 0
    })

    let data = {
      senderArray: senderArray,
      senderName: senderName
    }

    let message_html = template.render(message_template, {
      data: data
    })
    res.render(message_html)
    //显示详细消息
    $('.message-item').on('click', async function () {
      let that = $(this)
      let _index = $(this).index()
      let newData = senderArray[_index]
      let messageItemArray = []
      newData.forEach(item => {
        if (item.state === 0) {
          messageItemArray.push(item._id)
        }
      })
      let message_item_html = template.render(message_item_template, {
        data: newData.reverse()
      })
      $('.message-list-box').html(message_item_html)
      if (that.find('.read').length <= 0) {
        //消息已读
        let body = {
          allMessageArray: JSON.stringify(account.message),
          messageArray: JSON.stringify(messageItemArray)
        }
        let _result = await admin_model.updateMessage(body)

        if (_result.status === 200) {
          sessionStorage.message = JSON.stringify(_result.data)
          that.find('.no-read').addClass('read')
        } else {
          toast('未知错误', 'error')
        }
      }


    })
  } else {
    res.render('无消息')
  }
}


//侧边栏子目录显示与隐藏----------------------------------------------------------------
const sidebarEvent = () => {
  $(".nav-list-little").on("click", function () {
    let that = $(this).parent()
    trigger(that, that, "show-more")
  })
}

//----------------------------------------------------------------
//侧边栏个人中心状态
const show_admin = async (req, res) => {
  if (sessionStorage.account) {
    let account = JSON.parse(sessionStorage.account)
    let messageItemArray = JSON.parse(sessionStorage.message || '[]')
    let accountToken = localStorage.accountToken
    $('.admin-photo').attr('src', account.headPortrait)
    $('.admin-nickname').html(account.nickname)
    if (sessionStorage.message && messageItemArray.length === account.message.length) {
      let messageItemArray = JSON.parse(sessionStorage.message)
      showMessage(messageItemArray)
    } else {
      let body = {
        _id: account._id,
        accountToken: accountToken,
        messageArray: JSON.stringify(account.message)
      }
      let _result = await admin_model.getMessage(body)
      sessionStorage.message = JSON.stringify(_result.data)
      let messageItemArray = _result.data
      showMessage(messageItemArray)
    }

    function showMessage(messageItemArray) {
      let newMessageArray = 0
      messageItemArray.forEach(item => {
        if (item.state === 0) {
          newMessageArray += 1
        }
      })
      if (newMessageArray > 0) {
        $('.message-num').html(newMessageArray).addClass('show')
      } else {
        $('.message-num').removeClass('show')
      }
    }

    //判断location.hash中是否有'?',取出'?'前的hash值
    let url = location.hash.indexOf('?') > 0 ? location.hash.slice(0, location.hash.indexOf('?')) : location.hash
    url = `'${url}'`
    let active = $(`.sidebar-list a[href=${url}]`)
    $(`.sidebar-list .active`).removeClass('active')
    active.addClass('active')
    active.parent().parent().find('p').addClass('active')
  } else {
    bus.emit('go', '/powerRequire')
  }

}

//首页----------------------------------------------------------------
const homePush = async (req, res) => {
  let account = JSON.parse(sessionStorage.account)
  let accountToken = localStorage.accountToken
  let home_data = await position_model.selectHomePush({})
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
    let _result = await position_model.updateHomePush(_index)


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
      let _result = await position_model.addHomePush(_index)
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
    let _result = await position_model.removeHomePush(body)

    console.log(_result.data);


  })


  //消息推送
  $('#messagePush').on('submit', async function (e) {
    e.preventDefault()
    let _result = await position_model.messagePush()
    if (_result.status === 200) {
      sessionStorage.account = JSON.stringify(_result.data[0])
      $('#messagePush .input').val('')
      toast('消息推送成功')
    } else {
      toast('消息推送失败', 'error')
    }
  })
}

//物品管理
const goodsManage = async (req, res) => {
  let accountToken = localStorage.accountToken
  let account = JSON.parse(sessionStorage.account)
  let url = location.hash.indexOf('?') > 0 ? location.hash.slice(location.hash.indexOf('?') + 1) : "page=1&state=0"
  url = url.split('&')
  let page = ~~url[0].split('=')[1]
  let state = ~~url[1].split('=')[1]
  let _result_count = await
    position_model.selectGoodsCount({query: JSON.stringify({state: state})})
  let count = _result_count.data
  let allPage = count % 15 === 0 ? parseInt(count / 15) : parseInt(count / 15 + 1)
  let data = {
    allPage: allPage,
    page: page
  }
  let goods_state_html = template.render(goods_template, {
    data: data
  })
  res.render(goods_state_html)
  if (allPage !== 0) {
    let body = {
      query: JSON.stringify({state: state}),
      vernier: JSON.stringify({skip: 15 * (page - 1), limit: 15 * page, sort: {addTime: 1}})
    }
    let _result = await position_model.selectGoods(body)
    let goods_state_item_html = template.render(goods_item_template, {
      data: _result.data
    })
    $('.goods-list').html(goods_state_item_html)

    //查看详情
    $('.goods-item .look').on('click', function () {
      let _id = $(this).parent().attr('_id')
      bus.emit('go', `/goodsContent?_id=${_id}`)
    })

    //下架
    $('.goods-item .state-delete').on('click', async function () {
      let goods_id = $(this).parent().attr('_id')
      console.log(goods_id);
      let body = {
        accountToken: accountToken,
        account_id: account._id,
        goods_id: goods_id,
        content: JSON.stringify({state: -1})
      }
      let _result = await  position_model.deleteGoods(body)

      bus.emit('go', `/goods?page=0&state=-1`)
      bus.emit('go', `/goods?page=${page}&state=${state}`)
    })

    //删除
    $('.goods-item .state-remove').on('click', async function () {
      let goods_id = $(this).parent().attr('_id')
      let user_id = $(this).parent().attr('user_id')
      console.log(goods_id);
      let body = {
        accountToken: accountToken,
        account_id: account._id,
        goods_id: goods_id,
        user_id: user_id,
      }
      let _result = await  position_model.removeGoods(body)
      bus.emit('go', `/goods?page=0&state=-1`)
      bus.emit('go', `/goods?page=${page}&state=${state}`)
    })
  } else{
    $('.goods-list').html('无数据')
  }

  switch (state) {
    case 0:
      $('.state-zero').addClass('active');
      break;
    case 1:
      $('.state-one').addClass('active');
      break;
    case 2:
      $('.state-two').addClass('active');
      break;
    case -1:
      $('.state-no').addClass('active');
      $('.goods-item .state-delete').remove()
      break;
  }
  //点击跳转到点击显示的页码
  $('.page').on('click', function () {
    let _index = ~~$(this).html()
    bus.emit('go', `/goods?page=${_index}&state=${state}`)
  })
  //上一页
  $('.page-box .previous').on('click', function () {
    if (page > 1) {
      bus.emit('go', `/goods?page=${page - 1}&state=${state}`)
    }
  })
  //下一页
  $('.page-box .next').on('click', function () {
    if (page < allPage) {
      bus.emit('go', `/goods?page=${page + 1}&state=${state}`)
    }
  })
  //输入指定页
  $('.page-box .go-page').on('click', function () {
    let page_num = $('.page_index').val()
    if (page_num !== '' && page_num <= allPage) {
      bus.emit('go', `/goods?page=${page_num}&state=${state}`)
    }
  })
  //类别
  $('.goods-state p').on('click', function () {
    let state = ~~$(this).attr('_index')
    bus.emit('go', `/goods?page=1&state=${state}`)
  })

}

//交易管理
const transactions = async (req, res) => {
  let accountToken = localStorage.accountToken
  let account = JSON.parse(sessionStorage.account)
  let url = location.hash.indexOf('?') > 0 ? location.hash.slice(location.hash.indexOf('?') + 1) : "page=1&state=1"
  url = url.split('&')
  let page = ~~url[0].split('=')[1]
  let state = ~~url[1].split('=')[1]
  let _result_count = await position_model.selectTransactionsCount({query: JSON.stringify({state: state})})
  let count = _result_count.data
  let allPage = count % 10 === 0 ? parseInt(count / 10) : parseInt(count / 10 + 1)
  let data = {
    allPage: allPage,
    page: page
  }
  let transactions_state_html = template.render(transactions_template, {
    data: data
  })
  res.render(transactions_state_html)
  if (allPage !== 0) {
    let body = {
      query: JSON.stringify({state: state}),
      content: JSON.stringify({skip: 10 * (page - 1), limit: 10 * page, sort: {addTime: 1}})
    }
    let _result = await position_model.selectTransactions(body)
    console.log(_result.data);
    let transactions_state_item_html = template.render(transactions_item_template, {
      data: _result.data
    })
    $('.transactions-list').html(transactions_state_item_html)
    //删除
    $('.transactions-item .state-remove').on('click', async function () {
      let transactions_id = $(this).parent().attr('_id')
      let user_id = $(this).parent().attr('user_id')
      let body = {
        accountToken: accountToken,
        account_id: account._id,
        goods_id: transactions_id,
        user_id: user_id,
      }
      let _result = await  position_model.removeGoods(body)
      bus.emit('go', `/goods?page=0&state=-1`)
      bus.emit('go', `/goods?page=${page}&state=${state}`)
    })
  } else{
    $('.transactions-list').html('无数据')
  }

  switch (state) {
    case 0:
      $('.state-zero').addClass('active');
      break;
    case 1:
      $('.state-one').addClass('active');
      break;
    case 2:
      $('.state-two').addClass('active');
      break;
  }
  //点击跳转到点击显示的页码
  $('.page').on('click', function () {
    let _index = ~~$(this).html()
    bus.emit('go', `/transactions?page=${_index}&state=${state}`)
  })
  //上一页
  $('.page-box .previous').on('click', function () {
    if (page > 1) {
      bus.emit('go', `/transactions?page=${page - 1}&state=${state}`)
    }
  })
  //下一页
  $('.page-box .next').on('click', function () {
    if (page < allPage) {
      bus.emit('go', `/transactions?page=${page + 1}&state=${state}`)
    }
  })
  //输入指定页
  $('.page-box .go-page').on('click', function () {
    let page_num = $('.page_index').val()
    if (page_num !== '' && page_num <= allPage) {
      bus.emit('go', `/transactions?page=${page_num}&state=${state}`)
    }
  })
  //类别
  $('.transactions-state p').on('click', function () {
    let state = ~~$(this).attr('_index')
    bus.emit('go', `/transactions?page=1&state=${state}`)
  })


}

//用户管理
const user = async (req, res) => {
  let accountToken = localStorage.accountToken
  let account = JSON.parse(sessionStorage.account)
  let url = location.hash.indexOf('?') > 0 ? location.hash.slice(location.hash.indexOf('?') + 1) : "page=1&state=1"
  url = url.split('&')
  let page = ~~url[0].split('=')[1]
  let state = ~~url[1].split('=')[1]
  let _result_count = await admin_model.selectUserCount({query: JSON.stringify({state: state})})
  let count = _result_count.data
  console.log(count);
  let allPage = count % 10 === 0 ? parseInt(count / 10) : parseInt(count / 10 + 1)
  let data = {
    allPage: allPage,
    page: page
  }
  let user_html = template.render(user_template, {
    data: data
  })
  res.render(user_html)
  if (allPage !== 0) {
    let body = {
      query: JSON.stringify({state: state}),
      content: JSON.stringify({skip: 10 * (page - 1), limit: 10, sort: {addTime: 1}})
    }
    let _result = await admin_model.selectUserByState(body)
    console.log(_result.data);
    let user_item_html = template.render(user_item_template, {
      data: _result.data
    })
    $('.user-list').html(user_item_html)

    switch (state) {
      case 0:
        $('.state-zero').addClass('active');
        break;
      case 1:
        $('.state-one').addClass('active');
        break;
      case -1:
        $('.state-no').addClass('active');
        $('.user-item .state-delete').html('解封').addClass('deblocking')
        break;
    }

  } else {
    $('.user-list').html('无数据')
  }

  //点击跳转到点击显示的页码
  $('.page').on('click', function () {
    let _index = ~~$(this).html()
    bus.emit('go', `/user?page=${_index}&state=${state}`)
  })
  //上一页
  $('.page-box .previous').on('click', function () {
    if (page > 1) {
      bus.emit('go', `/user?page=${page - 1}&state=${state}`)
    }
  })
  //下一页
  $('.page-box .next').on('click', function () {
    if (page < allPage) {
      bus.emit('go', `/user?page=${page + 1}&state=${state}`)
    }
  })
  //输入指定页
  $('.page-box .go-page').on('click', function () {
    let page_num = $('.page_index').val()
    if (page_num !== '' && page_num <= allPage) {
      bus.emit('go', `/user?page=${page_num}&state=${state}`)
    }
  })
  //类别
  $('.user-state p').on('click', function () {
    let state = ~~$(this).attr('_index')
    bus.emit('go', `/user?page=1&state=${state}`)
  })
  $('.user-change .state-delete').on('click', async function() {
    let _id = $(this).parent().attr('_id')
    let body = {
      user_id: _id,
      account_id: account._id,
      accountToken: accountToken,
      state: -1
    }
    let _result = await admin_model.updateUserState(body)
    bus.emit('go', `/user?page=1&state=${-2}`)
    bus.emit('go', `/user?page=1&state=${state}`)
  })
  $('.user-change .deblocking').on('click', async function() {
    let _id = $(this).parent().attr('_id')
    let body = {
      user_id: _id,
      account_id: account._id,
      accountToken: accountToken,
      state: 0
    }
    let _result = await admin_model.updateUserState(body)
    bus.emit('go', `/user?page=1&state=${-2}`)
    bus.emit('go', `/user?page=1&state=${state}`)
  })

  $('.user-change .state-remove').on('click', async function() {
    let _id = $(this).parent().attr('_id')
    let headPortrait = $(this).parent().attr('headPortrait')
    let body = {
      user_id: _id,
      account_id: account._id,
      accountToken: accountToken,
      headPortrait: headPortrait,
    }
    let _result = await admin_model.removeUser(body)
    bus.emit('go', `/user?page=1&state=${-2}`)
    bus.emit('go', `/user?page=1&state=${state}`)
  })



}

//物品详情
const goodsContent = async (req, res) => {
  let url = location.hash.slice(location.hash.indexOf('?') + 1)
  let _id = url.split('=')[1]
  let body = {
    query: JSON.stringify({_id: _id}),
    vernier: JSON.stringify({})
  }
  let _result = await position_model.selectGoods(body)
  let data = _result.data[0]
  console.log(data);
  data.goodsComment.length > 0 ? data.goodsComment.reverse() : ''
  let goods_html = template.render(goodsContent_template, {
    data: data
  })
  res.render(goods_html)
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
//用户详情
const userContent = async (req, res) => {

  let url = location.hash.slice(location.hash.indexOf('?') + 1)
  let _id = url.split('=')[1]
  let body = {
    _id: _id
  }
  let _result = await admin_model.selectUser(body)
  if (_result.status = 200 && _result.data.length > 0) {
    let _body = {
      query: JSON.stringify({_id: {$in: _result.data[0].sellGoods}}),
      vernier: JSON.stringify({sort: {addTime: 1}})
    }
    //获取物品详细信息
    let goods_result = await position_model.selectGoods(_body)
    let seller = 0, selling = 0, selled = 0, deleted = 0
    //处理数据
    goods_result.data.forEach(item => {
      switch (item.state) {
        case 0 :
          seller++;
          break;
        case 1 :
          selling++;
          break;
        case 2 :
          selled++;
          break;
        case -1 :
          deleted++;
          break;
      }
    })
    let data = {
      user: _result.data[0],
      seller: seller,
      selling: selling,
      selled: selled,
      deleted: deleted
    }

    let user_html = template.render(userContent_template, {
      data: data
    })
    res.render(user_html)
  }
}

//权限申请
const powerApply = async (req, res) => {
  let body = {
    authority: 0
  }
  let _result = await admin_model.selectAccount(body)
  console.log(_result.data);
  let powerApply_html = 'null'
  if (_result.status === 200) {
    let data = _result.data
    data.filter(item => {
      return item.authority <= 0
    })
    powerApply_html = template.render(powerApply_template, {
      data: data
    })
  }
  res.render(powerApply_html)

  $('.powerApply-change-about .state-pass').on('click', async function () {
    let _id = $(this).attr('_id')
    let _authority = $(this).attr('_authority')
    let account = JSON.parse(sessionStorage.account)
    let accountToken = localStorage.accountToken
    let body = {
      _id: _id,
      type: 1,
      content: JSON.stringify({authority: 1 + ~~_authority}),
      account_id: account._id,
      accountToken: accountToken
    }
    console.log(body);
    let _result = await admin_model.updateAccountContent(body)
    console.log(_result.data);
    switch (_result.status) {
      case 200:
        toast('操作成功');
        await powerApply(req, res);
        break;
      case 205:
        toast('token 失效', 'error');
        break;
      case 206:
        toast('权限不够', 'error');
        break;
      case 500:
        toast('服务器错误，请重试', 'error');
        break;
    }
    console.log(_result.data);
  })
  $('.powerApply-change-about .state-delete').on('click', async function () {
    let _id = $(this).attr('_id')
    let account = JSON.parse(sessionStorage.account)
    let accountToken = localStorage.accountToken
    let body = {
      _id: _id,
      type: 0,
      account_id: account._id,
      accountToken: accountToken
    }
    console.log(body);
    let _result = await admin_model.removeAccount(body)
    console.log(_result.data);
    switch (_result.status) {
      case 200:
        toast('操作成功');
        await powerApply(req, res);
        break;
      case 205:
        toast('token 失效', 'error');
        break;
      case 206:
        toast('权限不够', 'error');
        break;
      case 500:
        toast('服务器错误，请重试', 'error');
        break;
    }
    console.log(_result.data);
  })


}

//权限管理
const superpowers = async (req, res) => {
  let body = {}, superPower = [], middlePower = [], lowPower = []
  let _result = await admin_model.selectAccount(body)
  console.log(_result.data);
  let powerApply_html = 'null'
  if (_result.status === 200) {
    let data = _result.data
    data.forEach(item => {
      switch (item.authority) {
        case 3 :
          superPower.push(item);
          break;
        case 2 :
          middlePower.push(item);
          break;
        case 1 :
          lowPower.push(item);
          break;
      }
    })
    data = {
      superPower: superPower,
      middlePower: middlePower,
      lowPower: lowPower
    }
    powerApply_html = template.render(superpowers_template, {
      data: data
    })
  }
  res.render(powerApply_html)
  $('.plus-power').on('click', async function () {
    let _id = $(this).attr('_id')
    let _authority = $(this).attr('_authority')
    let account = JSON.parse(sessionStorage.account)
    let accountToken = localStorage.accountToken
    let body = {
      _id: _id,
      type: 1,
      content: JSON.stringify({authority: 1 + ~~_authority}),
      account_id: account._id,
      accountToken: accountToken
    }
    let _result = await admin_model.updateAccountContent(body)
    console.log(_result.data);
    switch (_result.status) {
      case 200:
        toast('操作成功');
        await superpowers(req, res);
        break;
      case 205:
        toast('token 失效', 'error');
        break;
      case 206:
        toast('权限不够', 'error');
        break;
      case 500:
        toast('服务器错误，请重试', 'error');
        break;
    }
    console.log(_result.data);
  })
  $('.minus-power').on('click', async function () {
    let _id = $(this).attr('_id')
    let _authority = $(this).attr('_authority')
    let account = JSON.parse(sessionStorage.account)
    let accountToken = localStorage.accountToken
    let body = {
      _id: _id,
      type: -1,
      content: JSON.stringify({authority: -1 + ~~_authority}),
      account_id: account._id,
      accountToken: accountToken
    }
    let _result = await admin_model.updateAccountContent(body)
    console.log(_result.data);
    switch (_result.status) {
      case 200:
        toast('操作成功');
        await superpowers(req, res);
        break;
      case 205:
        toast('token 失效', 'error');
        break;
      case 206:
        toast('权限不够', 'error');
        break;
      case 500:
        toast('服务器错误，请重试', 'error');
        break;
    }
    console.log(_result.data);
  })

}


//页面状态----------------------------------------------------------------
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
  homePush,
  message,
  powerApply,
  superpowers,
  goodsManage,
  goodsContent,
  userContent,
  transactions,
  user

}