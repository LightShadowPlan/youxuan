import {bus, toast} from '../util'

// model
import admin_model from '../models/admin'

//解析路径
import qs from 'querystring'

const loginEvent = async () => {

  let flag = true
  //让父元素的高度等于最高子元素的高度
  $('.mine-box').height($('.mine-box .show-box').height())
  //
  let _index = 0
  //我的 出售/购买/我的信息 之间进行切换
  $('.mine-nav').on('click', 'li', function () {
    $('.mine-nav li').removeClass('show-box')
    $(this).addClass('show-box')
    _index = $(this).index()
    $('.mine-box > div').removeClass('show-box')
    $('.mine-box > div').eq(_index).addClass('show-box')
    $('.mine-box').height($('.mine-box .show-box').height())
  })
  if (localStorage.user) {
    go_mine_show()
  } else{
    go_default()
  }

  //默认页/登录页/注册页
  //跳转注册页
  $(".go-sign-up").on("click", () => {
    go_sign_up()
  })
  //跳转登录页
  $(".go-login").on("click", () => {
    go_login()
  })


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
            case 500:
              toast('操作失败，服务器出现问题', 'error');
              break;
            case 204:
              toast('账号或密码错误', 'error', 1500);
              break;
            default:
              //登录成功，存入token
              localStorage.user = JSON.stringify(_result.data)
              $('.login-show .input').val("")
              go_mine_show()
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
              $('.sign-up-show .input').val("")
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
    let user = JSON.parse(localStorage.user)
    console.log(user);
    //修改信息
    $('.user-submit[type=button]').on('click', function () {
      $(this).html('确认更改')
      $('.user-box .input-box').addClass('active')
      $('.user-box .input-box input').removeAttr('disabled')
      setTimeout(function(){
        $(this).attr({'type': 'submit'})
      },100)
    })
    //确认更改信息
    $('.user-submit[type=submit]').on('click', function () {
      $(this).html('编辑信息')
      $(this).attr({'type': 'button'})
      $('.user-box .input-box').removeClass('active')
      $('.user-box .input-box input').attr(({'disabled': ''}))

    })

    $('#male').on('click', function () {
      console.log('ok');
      $(this).addClass('active')
      $('#male + lable').addClass('active')
      $('#female').removeClass('active')
      $('#female + lable').removeClass('active')
    })
    $('#female').on('click', function () {
      $(this).addClass('active')
      $('#female + lable').addClass('active')
      $('#male').removeClass('active')
      $('#male + lable').removeClass('active')
    })

    //退出登录
    $('.exit').on('click', () => {
      localStorage.user = ''
      go_default()
    })
  }


}


export default {
  loginEvent
}