import {bus, toast} from '../util'

// model
import admin_model from '../models/admin'

import sell_html from '../views/sell-box.html'
import purchaser_html from '../views/purchase-box.html'
import account_html from '../views/account-box.html'

//解析路径
import qs from 'querystring'

const loginEvent = async () => {
  if (localStorage.user) {
    go_mine_show()
  } else {
    go_default()
  }
  let flag = true
  //默认页/登录页/注册页
  //跳转注册页
  $(".go-sign-up").on("click", () => {
    go_sign_up()
  })
  //跳转登录页
  $(".go-login").on("click", () => {
    go_login()
  })

  $('.account-box').height($('.account-box .show-box').height())

  //跳转到登录页面
  function go_login() {
    $('.account-box > div').removeClass("show-box")
    $(".login-show").addClass("show-box")

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
              localStorage.user = JSON.stringify(_result.data)

              $('.login-show .input').val("")
              go_mine_show()
              break;
            case 500:
              toast('操作失败，服务器出现问题', 'error');
              break;
            case 204:
              toast('账号或密码错误', 'error', 1500);
              break;
            default:
              toast('未知错误', 'error');
              break;
          }
          break;
      }

    })
  }

  //跳转到注册页面
  function go_sign_up() {
    $('.account-box > div').removeClass("show-box")
    $(".sign-up-show").addClass("show-box")

    //输入旧的时间点（oldTime），相隔时间（times/秒），返回剩余时间
    function checkTime(oldTime, times) {
      let d = new Date()
      oldTime = parseInt(oldTime.getTime() / 1000)
      let newTime = parseInt(d.getTime() / 1000)
      //计算距离下一次发送的时间
      return times - (newTime - oldTime)
    }

    //注册页
    let signUPSubmitFlag = 0
    $('.sign-up-show').on('submit', '#sign-up-form', async function (e) {
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
          let _result = await admin_model.addUser(qs.parse(_params))
          signUPSubmitFlag = 0
          switch (_result.status) {
            case 200:
              toast('注册成功', 'success');
              $('.sign-up-show .input').val("")
              go_login()
              break;
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
              toast('未知错误', 'error');
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
  }

  //退出登录/跳转默认页面
  function go_default() {
    $('.account-box > div').removeClass("show-box")
    $(".default-show").addClass("show-box")
  }

  //跳转个人信息页面
  function go_mine_show() {
    //显示页面
    $('.account-box > div').removeClass("show-box")
    $(".mine-show").addClass("show-box")

    //获取信息
    function show_user() {
      //获取本地数据
      let user = JSON.parse(localStorage.user)
      console.log('user:', user);
      let userToken = localStorage.userToken
      console.log('token:', userToken);
      //将数据导入表单
      $('.mail-box p').html(user.mailbox)
      user.gender === 'male' ? maleSelect() : femaleSelece()
      $('.nickname input').val(user.nickname)
      $('.user-token').val(userToken)
      $('.user-old-headPortrait').val(user.headPortrait)
      $('.contact-way input').eq(0).val(user.contactWay.qq)
      $('.contact-way input').eq(1).val(user.contactWay.wechat)
      $('.contact-way input').eq(2).val(user.contactWay.phoneNumber)
      $('.photo-box img').attr({'src': '../' + user.headPortrait})
    }

    show_user()

    //修改信息
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
        console.log('_result:', _result);
        if (Object.prototype.toString.call(_result.data) === '[object Array]') {
          console.log('Array');
          localStorage.user = JSON.stringify(_result.data[0])
          show_user()
        } else {
          console.log('Object');
        }
        toast('保存成功')
      } else if (_result.status === 205) {
          toast('token失效，请重新登录', 'error')
      } else {
        toast('保存失败，请重新再试', 'error')
      }
    })

    lookPic($('.headPortrait-file'), $('.headPortrait'))

    //图片预览
    function lookPic(options, imgOptions) {
      options.on('change', function () {
        previewImage(options[0])
      });

      function previewImage(file) {
        if (file.files && file.files[0]) {
          let reader = new FileReader()
          //读取为dataURL格式
          reader.readAsDataURL(file.files[0])
          //读取完成时
          reader.onload = function (evt) {
            imgOptions.attr({'src': evt.target.result})
          }
        }
      }
    }


    //性别选择
    $('#male').on('click', function () {
      maleSelect()
    })
    $('#female').on('click', function () {
      femaleSelece()
    })

    function maleSelect() {
      $('#male').addClass('active')
      $('#male + lable').addClass('active')
      $('#female').removeClass('active')
      $('#female + lable').removeClass('active')
    }

    function femaleSelece() {
      $('#female').addClass('active')
      $('#female + lable').addClass('active')
      $('#male').removeClass('active')
      $('#male + lable').removeClass('active')
    }

    //退出登录
    $('.exit').on('click', () => {
      localStorage.user = ''
      go_default()
    })
  }

}

const mineEvent = () => {
  //我的 出售/购买/我的信息 之间进行切换
  account()
  $('.mine-nav-sell').on('click', function () {
    sell()
  })
  $('.mine-nav-purchaser').on('click', function () {
    purchaser()
  })
  $('.mine-nav-account').on('click', function () {
    account()
  })

  //出售
  function sell() {
    $('.mine-nav li').removeClass('show-box')
    $('.mine-nav-sell').addClass('show-box')
    $('.mine-box').html(sell_html);
  }

  //购买
  function purchaser() {
    $('.mine-nav li').removeClass('show-box')
    $('.mine-nav-purchaser').addClass('show-box')
    $('.mine-box').html(purchaser_html);
  }

  //我的信息
  function account() {
    $('.mine-nav li').removeClass('show-box')
    $('.mine-nav-account').addClass('show-box')
    $('.mine-box').html(account_html);
    loginEvent()
  }
}


export default {
  mineEvent
}