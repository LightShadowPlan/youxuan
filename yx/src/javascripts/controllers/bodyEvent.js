/**
 * Created by qiangxl on 2019/3/23.
 */
import position_model from '../models/position'
import admin_model from '../models/admin'
import {bus, toast} from '../util'
import lookPic from './lookPic'
import admin from './admin'

import goods_item_template from '../views/goods-item.html'
import goods_template from '../views/goods.html'
import home_template from '../views/home.html'
import favorite_template from '../views/favorite.html'
import message_template from '../views/message.html'
import message_item_template from '../views/message-item.html'
import user_template from '../views/user.html'
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
const goods = async (req, res) => {
  let url = location.hash.slice(location.hash.indexOf('?') + 1)
  let _id = url.split('=')[1]
  let body = {
    query: JSON.stringify({_id: _id}),
    vernier: JSON.stringify({})
  }
  let _result = await position_model.selectGoods(body)
  console.log(_result);
  goodsHtml(_result.data[0])

  function goodsHtml(data) {
    data.goodsComment.reverse()
    let goods_html = template.render(goods_template, {
      data: data
    })
    res.render(goods_html)
    defaultEvent()
    swiper()
    //购买，收藏，评论操作
    let flag = 1
    if (data.state > 0) {
      flag = 0
      $('.goods-state').addClass('selled').find('.to-purchase').html('已售出')
    }

    //评论
    $('.addComment').on('click', async function () {
      if (flag) {
        if (sessionStorage.user) {
          let user = JSON.parse(sessionStorage.user)
          let d = new Date()
          let year = d.getFullYear()
          let month = d.getMonth() + 1
          let day = d.getDate()
          let hour = d.getHours()
          let minutes = d.getMinutes()
          d = year + '-' + month + '-' + day + " " + hour + ':' + minutes
          let commentText = $('.addComment-textarea').val()
          let comment = {
            _id: user._id,
            headPortrait: user.headPortrait,
            nickname: user.nickname,
            addTime: d,
            comment: commentText
          }
          console.log($('.addComment-textarea').val());
          let body = {
            '_id': _id,
            'content': JSON.stringify({'$addToSet': {'goodsComment': comment}})
          }
          let _result = await position_model.updateGoods(body)
          console.log('_result:', _result);
          goodsHtml(_result.data[0])
        } else {
          toast('未登录用户不能评论', 'error')
        }
      } else {
        toast('物品已售出', 'error')
      }
    })
    //收藏
    $('.to-favorite').on('click', async function () {
      if (flag) {
        if (sessionStorage.user) {
          let user = JSON.parse(sessionStorage.user)
          let userToken = localStorage.userToken
          let body = {
            _id: user._id,
            userToken: userToken,
            content: JSON.stringify({'$addToSet': {'favorite': _id}})
          }
          let _result = await admin_model.updateUserGoods(body)
          sessionStorage.user = JSON.stringify(_result.data[0])
          toast('收藏成功')
        } else {
          toast('未登录用户不能加入购物车', 'error')
        }
      } else {
        toast('物品已售出', 'error')
      }
    })

    //购买
    $('.to-purchase').on('click', function () {
      if (flag) {
        window.$.notarize = purchase
        //调出弹窗
        $('.change-notarize-toast').addClass('active')
        $('.toast-title-text').html('购买物品')
        $('.toast-text').html('你确定要购买此物品？请完善个人联系方式，方便沟通！')
      } else {
        toast('物品已售出', 'error')
      }
    })
    //弹窗关闭
    $('.notarize-cancel').on('click', function () {
      $('.change-notarize-toast').removeClass('active')
    })
    $('.notarize-submit').on('click', function () {
      window.$.notarize()
    })
    const purchase = async () => {
      if (sessionStorage.user) {
        let user = JSON.parse(sessionStorage.user)
        let userToken = localStorage.userToken
        let body = {
          seller_id: data.seller._id,
          purchaser_id: user._id,
          userToken: userToken,
          content: JSON.stringify({'$addToSet': {'purchaserGoods': _id}})
        }
        let _result = await admin_model.purchaseGoods(body)
        goodsHtml(_result.data[0])
        sessionStorage.user = JSON.stringify(_result.data[0])
        toast('购买成功')
        $('.change-notarize-toast').removeClass('active');

      } else {
        toast('未登录用户不能购买物品', 'error')
      }
    }
  }


}

//用户信息
const user = async (req, res) => {
  let url = location.hash.slice(location.hash.indexOf('?') + 1)
  let _id = url.split('=')[1]
  let body = {
    _id: _id
  }
  let _result = await admin_model.selectUser(body)
  if(_result.status = 200 && _result.data.length > 0) {
    let user_html = template.render(user_template, {
      data: _result.data[0]
    })
    res.render(user_html)
    defaultEvent()
  } else{
    res.render('<div class="user"><div class="user-box">用户不存在或已注销</div><p class="go-back">返回</p></div>')
  }
  console.log(_result);
}

//商品轮播
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

//添加出售商品
const addGoods = () => {
  let userToken = localStorage.userToken
  let user = JSON.parse(sessionStorage.user)
  console.log('user:', user);
  defaultEvent()
  let imgArr = [$('.img-box img').eq(0), $('.img-box img').eq(1), $('.img-box img').eq(2)]
  lookPic($('.goodsPhoto'), imgArr, true);  //图片处理
  $('.userToken').val(userToken)
  $('.addGoods_user_id').val(user._id)
  $('#addGoods').on('submit', async function (e) {
    e.preventDefault()
    let _result = await position_model.addGoods()
    switch (_result.status) {
      case 200 :
        toast('上传成功，请确保联系方式有效，方便沟通！', 'success', 2000);
        sessionStorage.user = JSON.stringify(_result.data[0]);
        bus.emit('back');
        break;
      case 205 :
        toast('token过期，请重新登录', 'error');
        break;
      case 500 :
        toast('上传失败，请重新再试', 'error');
        break;
    }
    return false
  })
}
//首页
const homeShow = async (res) => {

  let _result = await position_model.homeShow()
  console.log(_result);
  let home_html = template.render(home_template, {
    data: _result.data
  })
  res.render(home_html)
  swiper()
  //消息
  if (sessionStorage.user) {
    let user = JSON.parse(sessionStorage.user)
    let userToken = localStorage.userToken
    messageHomeShow(user, userToken)
  }
}

//闲置馆
const goodsAllSelect = async () => {
  let goodsClass = {$nin: ['nice']}, skip = 0, limit = 16, state = {$in: [0]}
  showGoods(goodsClass, skip, limit, state)

  //消息

  if (sessionStorage.user) {
    let user = JSON.parse(sessionStorage.user)
    let userToken = localStorage.userToken
    await messageHomeShow(user, userToken)
  }

  //点击头部筛选
  $('.search-goods-box').on('click', 'li', async function () {
    $(this).addClass('active').siblings().removeClass('active')
    goodsClass = $(this).attr('goodsClass')
    await showGoods(goodsClass, skip, limit, state)
  })
  $('.resetGoodsClass').on('click', async function () {
    goodsClass = {$nin: ['nice']}
    await showGoods(goodsClass, skip, limit, state)
    $('.search-goods-box li').removeClass('active')
  })
  //滚动页面刷新
}
//获取数据
const showGoods = async (goodsClass, skip, limit, state) => {
  let body = {
    query: JSON.stringify({state: state, goodsClass: goodsClass}),
    vernier: JSON.stringify({skip: skip, limit: limit, sort: {addTime: 1}})
  }
  let _result = await position_model.selectGoods(body)
  console.log(_result);
  if (_result.status === 200) {
    let goodsAll_html = template.render(goods_item_template, {
      data: _result.data
    })
    $('.goodsAll-container').html(goodsAll_html)
  } else {
    $('.goodsAll-container').html('服务器出差了')
  }
}

//收藏夹
const showFavorite = async (req, res) => {
  url()
  if (sessionStorage.user) {
    newFavorite(req, res)
  }
  else {
    res.render('<p style="width: 100%;height: 100px; line-height: 100px;text-align: center;">请登录后查看</p>')
  }
}
const newFavorite = async (req, res) => {
  let user = JSON.parse(sessionStorage.user)
  let userToken = localStorage.userToken
  //消息
  messageHomeShow(user, userToken)
  let favorite = user.favorite
  let body = {
    query: JSON.stringify({_id: {$in: favorite}}),
    vernier: JSON.stringify({sort: {addTime: 1}})
  }
  let _result = await position_model.selectGoods(body)
  console.log(_result);
  if (_result.data.length > 0) {
    let favorite_html = template.render(favorite_template, {
      data: _result.data
    })
    res.render(favorite_html)
  } else {
    res.render('<p style="width: 100%;height: 100px; line-height: 100px;text-align: center;">暂无数据</p>')
  }
  selectOptions('favorite-box')
  //删除
  $('.goods-delete').on('click', async function () {
    let goodsArray = []
    let _index = $(this).attr('index')
    let selectArray = $('.favorite-box ul').find('.goods-select[select=true]')
    for (let i = 0; i < selectArray.length; i++) {
      goodsArray.push(selectArray.eq(i).attr('index'))
    }
    if (goodsArray.length > 0) {

      let newFavoriteGoods = []
      favorite.forEach(item => {
        console.log(goodsArray.indexOf(item))
        if (goodsArray.indexOf(item) === -1 && item !== null) {
          console.log('ok');
          newFavoriteGoods.push(item)
        }
      })

      let body = {
        _id: user._id,
        userToken: userToken,
        content: JSON.stringify({'favorite': newFavoriteGoods})
      }

      //删除收藏夹物品
      let _result = await admin_model.updateUserGoods(body)
      if (_result.status === 200) {
        toast('删除成功');
        sessionStorage.user = JSON.stringify(_result.data[0]);
        newFavorite(req, res)
      } else {
        toast('删除失败', 'error');
      }
    }
  })
}

//选择器
const selectOptions = (options) => {
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
      $(`.${options} ul`).eq(_index).find('.goods-select').attr({
        'select': 'false',
        'class': 'goods-select fa fa-circle-o'
      })
    } else {
      $(this).html('全不选')
      $(this).attr({'select': 'true'})
      $(`.${options} ul`).eq(_index).find('.goods-select').attr({
        'select': 'true',
        'class': 'goods-select fa fa-circle'
      })
    }
  })
}

//头部消息
const messageHomeShow = async (user, userToken, bool) => {
  if (sessionStorage.message && bool) {
    let messageItemArray = JSON.parse(sessionStorage.message)
    showMessage(messageItemArray)
  } else {
    let body = {
      _id: user._id,
      userToken: userToken,
      messageArray: JSON.stringify(user.message)
    }
    let _result = await admin_model.getMessage(body)
    if (_result.data.length > 0) {
      let messageItemArray = _result.data
      sessionStorage.message = JSON.stringify(_result.data)
      showMessage(messageItemArray)
    }
  }

  function showMessage(messageItemArray) {
    let newMessageArray = 0
    messageItemArray.forEach(item => {
      if (item.state === 0) {
        newMessageArray += 1
      }
    })
    if (newMessageArray > 0) {

      $('.message-header-number').html(newMessageArray).addClass('active')
    } else {
      $('.message-header-number').removeClass('active')
    }
  }


}
const message = (req, res) => {
  if (sessionStorage.user) {
    let user = JSON.parse(sessionStorage.user)
    let userToken = localStorage.userToken
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
    defaultEvent()
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
          allMessageArray: JSON.stringify(user.message),
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
    res.render('<div class="message"><div class="message-title">消息</div><p class="go-back">返回</p></div>')
  }
}

//出售物品删除
const delectGoods = async (options) => {
  let userToken = localStorage.userToken
  let user = JSON.parse(sessionStorage.user)
  selectOptions(options)
  //删除
  $('.goods-delete').on('click', async function () {
    //获取要删除的物品的_id、交易记录、物品购买人的数组
    let goodsArray = [], transactionArray = []
    let _index = $(this).attr('index')
    let _state = $(this).attr('state')
    $('.no-read').addClass('read')
    console.log(_state);
    let selectArray = $(`.${options} ul`).eq(_index).find('.goods-select[select=true]')
    for (let i = 0; i < selectArray.length; i++) {
      goodsArray.push(selectArray.eq(i).attr('index'))
      transactionArray.push(selectArray.eq(i).attr('transaction'))
    }

    if (goodsArray.length > 0) {
      let sellGoods = user.sellGoods
      let newSellGoods = []
      sellGoods.forEach(item => {
        if (goodsArray.indexOf(item) < 0 && item !== null) {
          newSellGoods.push(item)
        }
      })
      let body = {
        'newSellGoods': JSON.stringify(newSellGoods),
        'goodsArray': JSON.stringify(goodsArray),
        'transactionArray': JSON.stringify(transactionArray),
        'userToken': userToken,
        '_id': user._id,
        'state': _state,
        'goodsPhotoArray': []
      }
      //删除物品
      let _result = await position_model.removeGoods(body)
      console.log(_result);
      switch (_result.status) {
        case 200 :
          toast('删除成功');
          sessionStorage.user = JSON.stringify(_result.data[0]);
          messageHomeShow(_result.data[0], userToken, false)
          admin.sell();
          break;
        case 205:
          toast('登录过期，请重新登录', 'error');
          break;
        case 500:
          toast('服务器错误,请重新再试', 'error');
          break;
      }
    } else {
      toast('选择为空', 'error')
    }


  })
}


export default {
  url,
  goods,
  goodsAllSelect,
  delectGoods,
  addGoods,
  homeShow,
  messageHomeShow,
  showFavorite,
  message,
  user
}