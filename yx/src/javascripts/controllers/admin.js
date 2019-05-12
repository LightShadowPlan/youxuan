import {bus, toast} from '../util'
import checkState from './checkState'
import lookPic from './lookPic'
import bodyEvent from './bodyEvent'
import userState from './webSocket'
// model
import admin_model from '../models/admin'
import position_model from '../models/position'

import sell_html from '../views/sell-box.html'
import purchaser_html from '../views/purchase-box.html'
import account_html from '../views/account-box.html'

//解析路径
import qs from 'querystring'
//我的信息更新信息
const show_user = async () => {
  //获取本地数据----------------------------------------------------------------------------
  let user, userToken
  user = JSON.parse(sessionStorage.user)
  userToken = localStorage.userToken
  //消息
  await bodyEvent.messageHomeShow(user, userToken)
  //将数据导入表单
  $('.mail-box p').html(user.mailbox)
  user.gender === 'male' ? maleSelect() : femaleSelect()
  $('.nickname input').val(user.nickname)
  $('.user-token').val(userToken)
  $('.user-id').val(user._id)
  $('.user-old-headPortrait').val(user.headPortrait)
  $('.contact-way input').eq(0).val(user.contactWay.qq)
  $('.contact-way input').eq(1).val(user.contactWay.wechat)
  $('.contact-way input').eq(2).val(user.contactWay.phoneNumber)
  $('.photo-box img').attr({'src': '../' + user.headPortrait})
  await bodyEvent.messageHomeShow(user, userToken)
  userState()
}

function maleSelect() {
  $('#male').addClass('active')
  $('#male + lable').addClass('active')
  $('#female').removeClass('active')
  $('#female + lable').removeClass('active')
}

function femaleSelect() {
  $('#female').addClass('active')
  $('#female + lable').addClass('active')
  $('#male').removeClass('active')
  $('#male + lable').removeClass('active')
}

const loginEvent = async () => {

  //判断登录
  if (sessionStorage.user) {  //检查sessionStorage是否有数据
    go_mine_show()          //有，不用更新
  } else {
    let state = await checkState()  //没有，检查token有效，有效会更新数据
    if (state) {
      let user = JSON.parse(sessionStorage.user)
      go_mine_show()  //有效，进入我的信息
    } else {
      go_default()   //进入登录页面
    }
  }
  //--------------------------------------------------------------------------------------------

  //默认页/登录页/注册页
  let flag = true
  //跳转注册页
  $(".go-sign-up").on("click", () => {
    go_sign_up()
  })
  //跳转登录页
  $(".go-login").on("click", () => {
    go_login()
  })

  $('.account-box').height($('.account-box .show-box').height())

  //----------------------------------------------------------------------------------------------
  //跳转到登录页面
  function go_login() {
    $('.account-box > div').removeClass("show-box")
    $(".login-show").addClass("show-box")
  }

  //登录页
  let LoginSubmitFlag = 0
  $('.login-show').on('submit', '#login-form', async function (e) {
    //阻止浏览器默认事
    e.preventDefault() ? e.preventDefault() : e.returnValue = false
    //邮箱格式验证
    LoginSubmitFlag ? '' : !/[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-z]+/.test($('.login-mailbox').val()) ? LoginSubmitFlag = 1 : ''
    //密码格式验证
    LoginSubmitFlag ? '' : !/[a-zA-Z0-9]{8,16}/.test($('.login-password').val()) ? LoginSubmitFlag = 2 : ''
    switch (LoginSubmitFlag) {
      case 1 :
        toast('邮箱格式错误', 'error', 1500);
        break;
      case 2 :
        toast('密码格式错误', 'error', 1500);
        break;
      case 3 :
        toast('请求未处理完，请勿频繁操作', 'error', 1500);
        break;
      default:
        LoginSubmitFlag = 3
        setTimeout(function () {
          LoginSubmitFlag = 0
        }, 3000)
        //获取表单内容
        let _params = $('#login-form').serialize()
        //解析，发送请求
        let _result = await admin_model.loginUser(qs.parse(_params))
        LoginSubmitFlag = 0
        switch (_result.status) {
          case 200:
            //登录成功，存入数据，包括token
            localStorage.userToken = _result.data.token
            delete _result.data.token
            sessionStorage.user = JSON.stringify(_result.data)
            $('.login-show .input').val("")
            go_mine_show();break;
          case 500:toast('操作失败，服务器出现问题', 'error');break;
          case 204:toast('账号或密码错误', 'error', 1500);break;
          default:toast('未知错误', 'error');break;
        }
        break;
    }

  })


  //-----------------------------------------------------------------------------------------------
  //跳转到注册页面
  function go_sign_up() {
    $('.account-box > div').removeClass("show-box")
    $(".sign-up-show").addClass("show-box")
  }

  //注册页
  let signUpSubmitFlag = 0
  $('.sign-up-show').on('submit', '#sign-up-form', async function (e) {
    //阻止浏览器默认事
    e.preventDefault() ? e.preventDefault() : e.returnValue = false
    //邮箱格式验证
    signUpSubmitFlag ? '' : !/[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-z]+/.test($('.sign-up-mailbox').val()) ? signUpSubmitFlag = 1 : ''
    //验证码格式验证
    signUpSubmitFlag ? '' : !/[0-9]{6}/.test($('.verification').val()) ? signUpSubmitFlag = 2 : ''
    //密码格式验证
    signUpSubmitFlag ? '' : !/[a-zA-Z0-9]{8,16}/.test($('.sign-up-password').val()) ? signUpSubmitFlag = 3 : ''
    //两次密码相等验证
    signUpSubmitFlag ? '' : $('.sign-up-password').val() !== $('.r-sign-up-password').val() ? signUpSubmitFlag = 4 : ''
    //用户协议勾选
    signUpSubmitFlag ? '' : !$('.sign-up-agree').prop("checked") ? signUpSubmitFlag = 5 : ''
    switch (signUpSubmitFlag) {
      case 1 :
        toast('邮箱格式错误', 'error', 1500);
        break;
      case 2 :
        toast('验证码格式错误', 'error', 1500);
        break;
      case 3 :
        toast('密码格式错误', 'error', 1500);
        break;
      case 4 :
        toast('两次密码不相同', 'error', 1500);
        break;
      case 5 :
        toast('用户协议未勾选', 'error', 1500);
        break;
      case 6 :
        toast('请求未处理完，请勿频繁操作', 'error', 1500);
        break;
      default:
        signUpSubmitFlag = 6
        //获取表单内容
        let _params = $('#sign-up-form').serialize()
        //解析，发送请求
        let _result = await admin_model.addUser(qs.parse(_params))
        signUpSubmitFlag = 0
        switch (_result.status) {
          case 200:
            toast('注册成功', 'success');
            $('#sign-up-form input').val("")
            go_login()
            break;
          case 500:toast('操作失败，服务器出现问题', 'error');break;
          case 201:toast('用户已存在', 'error');break;
          case 202:toast('验证码错误', 'error');break;
          case 203:toast('验证码过期', 'error');break;
          default:toast('未知错误', 'error');break;
        }
        break;
    }

  })
  //获取验证码
  let codeFlag = true, time1
  $('#get-verification-code').on('click', async function (e) {
    //邮箱格式验证
    let submitFlag = 0
    submitFlag ? '' : !/[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-z]+/.test($('.sign-up-mailbox').val()) ? submitFlag = 1 : ''
    if (!submitFlag) {
      //判断是否可以发送请求，发送一次请求后隔60秒后才能再次发送
      if (codeFlag) {
        codeFlag = false
        //记录当前时间
        time1 = new Date()
        //60秒后可再次发送请求
        setTimeout(function () {
          codeFlag = true
        }, 60000)
        //获取邮箱
        let body = {'mailbox': $('.sign-up-mailbox').val(), 'type': 'user'}
        let _result = await admin_model.addSignUp(body)
        switch (_result.status) {
          case 500:
            toast('操作失败，服务器出现问题', 'error');
            break;
          case 201:
            toast('用户已存在', 'error');
            break;
          default:
            toast('操作成功，请前往邮箱获取验证码', 'success', 2000);
            break;
        }
      } else {
        //获取当前时间
        //计算距离下一次发送的时间
        let times = checkTime(time1, 60)
        toast(`请${times}秒后在获取`, 'success', 1500)
      }
    } else {
      toast('邮箱格式错误', 'error', 1500);
    }
  })

  //输入旧的时间点（oldTime），相隔时间（times/秒），返回剩余时间
  function checkTime(oldTime, times) {
    let d = new Date()
    oldTime = parseInt(oldTime.getTime() / 1000)
    let newTime = parseInt(d.getTime() / 1000)
    //计算距离下一次发送的时间
    return times - (newTime - oldTime)
  }

  //退出登录/跳转默认页面
  function go_default() {
    $('.account-box > div').removeClass("show-box")
    $(".default-show").addClass("show-box")
  }

  //--------------------------------------------------------------------------------------------

  //跳转个人信息页面------------------------------------------------------------------------------
  function go_mine_show() {
    //显示页面
    $('.account-box > div').removeClass("show-box")
    $(".mine-show").addClass("show-box")
    //刷新数据
    show_user()
    bodyEvent.showHeader()

  }

  //编辑信息
  let submitFlag = 0
  $('.user-submit').on('click', function (e) {
    //修改信息
    if (!submitFlag) {
      $('.user-submit').html('确认修改')
      $('.user-box .input-box').addClass('active')
      $('#user input').removeAttr('disabled')
      setTimeout(function () {
        $('.user-submit').attr({'type': 'submit'})
      }, 100)
      submitFlag = 1
    }
  })

  //表单图片预览
  lookPic($('.headPortrait-file'), $('.headPortrait'))

  //表单性别选择
  $('#male').on('click', function () {
    maleSelect()
  })
  $('#female').on('click', function () {
    femaleSelect()
  })


  //编辑信息表单提交
  $('#user').on('submit', async function (e) {
    e.preventDefault()
    let _result = await admin_model.updateUser()
    if (_result.status === 200) {
      submitFlag = 0
      $('.user-submit').html('编辑信息')
      $('.user-box .input-box').removeClass('active')
      $('#user input').attr(({'disabled': ''}))
      setTimeout(function () {
        $('.user-submit').attr({'type': 'button'})
      }, 100)
      //信息有改动，没改动不刷新数据
      if (_result.data._id) {
        sessionStorage.user = JSON.stringify(_result.data)
        localStorage.userToken = _result.data.token
        show_user()
      }
      toast('保存成功')
    } else if (_result.status === 205) {
      toast('token失效，请重新登录', 'error')
    } else {
      toast('保存失败，请重新再试', 'error')
    }
  })

  //更改密码
  $('.change-password').on('click', function (e) {
    let userToken = localStorage.userToken
    $('#changePassword input').val('')
    e.preventDefault()
    $('.change-password-toast').addClass('active')
    $('.changepw_token').val(userToken)
    $('.pw-cancel').on('click', function () {
      $('.change-password-toast').removeClass('active')
    })
  })
  //更改密码表单提交
  $('#changePassword').on('submit', async function (e) {
    e.preventDefault()
    //只能取出表单信息传送。不然表单本身传输时出现问题，后台接受不到数据，待以后处理。
    let body = qs.parse($('#changePassword').serialize())
    body._id = user._id
    let _result = await admin_model.changeUserPassword(body)
    switch (_result.status) {
      case 200 :
        toast('更改成功');
        break;
      case 204 :
        toast('密码错误，请重新再试', 'error');
        break;
      case 205 :
        toast('token失效，请重新登录', 'error');
        break;
      default :
        toast('未知错误，请重新再试', 'error');
        break;
    }
    $('.change-password-toast').removeClass('active')
    $('#changePassword input').val('')
  })

  //注销账号
  $('.remove-user').on('click', function () {
    //将弹窗的确定按钮的时间挂载到window上
    window.$.notarize = removeUser
    //调出弹窗
    $('.change-notarize-toast').addClass('active')
    $('.toast-title-text').html('注销账号')
    $('.toast-text').html('你确定要注销账号吗？此操作不可撤回，后果自负！')
  })
  //弹窗关闭
  $('.notarize-cancel').on('click', function () {
    $('.change-notarize-toast').removeClass('active')
  })
  $('.notarize-submit').on('click', function () {
    window.$.notarize()
  })

  const removeUser = async () => {
    let userToken = localStorage.userToken
    let user = JSON.parse(sessionStorage.user)
    let body = {'_id': user._id, 'userToken': userToken, headPortrait: user.headPortrait}
    let _result = await admin_model.removeUser(body)
    if (_result.status === 200 && _result.data.deletedCount === 1) {
      localStorage.userToken = ''
      sessionStorage.user = ''
      toast('注销成功')
      go_default()
    } else {
      toast('注销失败，请重新再试', 'error')
    }
    $('.change-notarize-toast').removeClass('active')
  }

  //退出登录
  $('.exit').on('click', () => {
    userState(true)
    sessionStorage.user = ''
    localStorage.userToken = ''
    go_default()

  })
  //---------------------------------------------------------------------------------------------------

}

const mineEvent = () => {
  //我的 出售/购买/我的信息 之间进行切换
  sell()
  $('.mine-nav-sell').on('click', function () {
    sell()
  })
  $('.mine-nav-purchaser').on('click', function () {
    purchase()
  })
  $('.mine-nav-account').on('click', function () {
    account()
  })
}

//出售
const sell = async () => {
  $('.mine-nav li').removeClass('show-box')
  $('.mine-nav-sell').addClass('show-box')
  //向模版添加的数据
  let sellData = {
    stateOne: [],
    stateTwo: [],
    stateThree: []
  }
  if (sessionStorage.user) {
    //取出本地物品的_id数组
    let user = JSON.parse(sessionStorage.user)
    let userToken = localStorage.userToken
    let sellGoods = user.sellGoods
    //消息
    await bodyEvent.messageHomeShow(user, userToken)
    let body = {
      query: JSON.stringify({_id: {$in: sellGoods}}),
      vernier: JSON.stringify({sort: {addTime: 1}})
    }
    //获取物品详细信息
    let _result = await position_model.selectGoods(body)

    //处理数据
    _result.data.forEach(item => {
      switch (item.state) {
        case 0 :
          sellData.stateOne.push(item);
          break;
        case 1 :
          sellData.stateTwo.push(item);
          break;
        case 2 :
          sellData.stateThree.push(item);
          break;
      }
    })

    let goods_html = template.render(sell_html, {
      data: sellData
    })
    $('.mine-box').html(goods_html)


    $('.plus-sell').on('click', function () {
      bus.emit('go', '/addGoods')
    })
    await bodyEvent.delectGoods('sell-box')
  }

}

//购买
const purchase = async () => {
  $('.mine-nav li').removeClass('show-box')
  $('.mine-nav-purchaser').addClass('show-box')
  //向模版添加的数据
  let purchaserData = {
    stateTwo: [],
    stateThree: []
  }
  if (sessionStorage.user) {
    //取出本地物品的_id数组
    let user = JSON.parse(sessionStorage.user)
    let userToken = localStorage.userToken
    //消息
    await bodyEvent.messageHomeShow(user, userToken)
    let purchaserGoods = user.purchaserGoods
    let body = {
      query: JSON.stringify({_id: {$in: purchaserGoods}}),
      vernier: JSON.stringify({sort: {addTime: 1}})
    }
    //获取物品详细信息
    let _result = await position_model.selectGoods(body)


    //处理数据
    _result.data.forEach(item => {
      switch (item.state) {
        case 1 :
          purchaserData.stateTwo.push(item);
          break;
        case 2 :
          purchaserData.stateThree.push(item);
          break;
      }
    })
    let goods_html = template.render(purchaser_html, {
      data: purchaserData
    })
    $('.mine-box').html(goods_html)
    bodyEvent.delectGoods('purchase-box')
    $('.transaction-over').on('click', async function () {
      let goods_id = $(this).attr('index')
      let transaction_id = $(this).attr('transaction')
      let seller_id = $(this).attr('seller')
      let body = {
        user_id: user._id,
        seller_id: seller_id,
        goods_id: goods_id,
        transaction_id: transaction_id,
        userToken: userToken
      }
      let _result = await admin_model.transactionOver(body)
      //消息
      await bodyEvent.messageHomeShow(_result.data[0], userToken, false)
      sessionStorage.user = JSON.stringify(_result.data[0])
      await purchase()
    })
  }


}

//我的信息
const account = async () => {
  $('.mine-nav li').removeClass('show-box')
  $('.mine-nav-account').addClass('show-box')
  $('.mine-box').html(account_html);
  loginEvent()
}


export default {
  mineEvent,
  sell
}