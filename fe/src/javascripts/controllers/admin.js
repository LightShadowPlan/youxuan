import {bus, toast} from '../util'
import bodyEvent from './bodyEvent'

// model
import admin_model from '../models/admin'

//解析路径
import qs from 'querystring'

const loginEvent = async () => {
  //进入登录页面，隐藏头部与侧边栏
  bodyEvent.large()
  //清除token
  localStorage.token = ''
  //登录页跳转注册页
  $(".go-sign-up").on("click", () => {
    go_sign_up()
  })
  //注册页跳转登录页
  $(".go-login").on("click", () => {
    go_login()
  })

  function go_login() {
    $(".login").addClass("showing")
    $(".sign-up").removeClass("showing")
    $(".filter").removeClass("filter-o")
  }

  function go_sign_up() {
    $(".login").removeClass("showing")
    $(".sign-up").addClass("showing")
    $(".filter").addClass("filter-o")
  }

  //登录页
  let LoginSubmitFlag = 0
  $('.login-box').on('submit', '#login-form', async function (e) {
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
        let _result = await admin_model.loginAccount(qs.parse(_params))
        LoginSubmitFlag = 0
        switch (_result.status) {
          case 500:
            toast('操作失败，服务器出现问题', 'error');
            break;
          case 204:
            toast('账号或密码错误', 'error', 1500);
            break;
          default:
            //登录成功，存入token
            localStorage.admin = JSON.stringify(_result.data)
            bus.emit('go', '/home')
            break;
        }
        break;
    }

  })
  //注册页
  let signUPSubmitFlag = 0
  $('.login-box').on('submit', '#sign-up-form', async function (e) {
    //阻止浏览器默认事
    e.preventDefault() ? e.preventDefault() : e.returnValue = false
    //邮箱格式验证
    signUPSubmitFlag ? '' : !/[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-z]+/.test($('.sign-up-mailbox').val()) ? signUPSubmitFlag = 1 : ''
    //验证码格式验证
    signUPSubmitFlag ? '' : !/[0-9]{6}/.test($('.verification').val()) ? signUPSubmitFlag = 2 : ''
    //密码格式验证
    signUPSubmitFlag ? '' : !/[a-zA-Z0-9]{8,16}/.test($('.sign-up-password').val()) ? signUPSubmitFlag = 3 : ''
    //两次密码相等验证
    signUPSubmitFlag ? '' : $('.sign-up-password').val() !== $('.r-sign-up-password').val() ? signUPSubmitFlag = 4 : ''
    //用户协议勾选
    signUPSubmitFlag ? '' : !$('.sign-up-agree').prop("checked") ? signUPSubmitFlag = 5 : ''
    switch (signUPSubmitFlag) {
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
        signUPSubmitFlag = 6
        //获取表单内容
        let _params = $('#sign-up-form').serialize()
        //解析，发送请求
        let _result = await admin_model.addAccount(qs.parse(_params))
        signUPSubmitFlag = 0
        switch (_result.status) {
          case 500:
            toast('操作失败，服务器出现问题', 'error');
            break;
          case 201:
            toast('用户已存在', 'error');
            break;
          case 202:
            toast('验证码错误', 'error');
            break;
          case 203:
            toast('验证码过期', 'error');
            break;
          default:
            toast('注册成功', 'success');
            go_login()
            break;
        }
        break;
    }

  })
  //获取验证码
  let codeFlag = true, time1
  $('#get-verification-code').on('click', async function (e) {
    //邮箱格式验证
    let submitFlag = 0
    signUPSubmitFlag ? '' : !/[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-z]+/.test($('.sign-up-mailbox').val()) ? signUPSubmitFlag = 1 : ''
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
        let body = {'mailbox': $('.sign-up-mailbox').val(), 'type': 'account'}
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
        let d = new Date()
        let oldTime = parseInt(time1.getTime() / 1000)
        let newTime = parseInt(d.getTime() / 1000)
        //计算距离下一次发送的时间
        let times = 60 - (newTime - oldTime)
        toast(`请${times}秒后在获取`, 'success', 1500)
      }
    } else {
      toast('邮箱格式错误', 'error', 1500);
    }
  })
}

export default {
  loginEvent,
}