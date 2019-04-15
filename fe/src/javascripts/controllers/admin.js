import {bus, toast} from '../util'
import checkState from './checkState'
import bodyEvent from './bodyEvent'
import lookPic from './lookPic'
// model
import admin_model from '../models/admin'

//解析路径
import qs from 'querystring'

const adminEvent = async () => {

  //获取本地数据----------------------------------------------------------------------------
  let account, accountToken

  //我的信息更新信息
  function show_account() {
    //更新本地数据
    account = JSON.parse(sessionStorage.account)
    accountToken = localStorage.accountToken
    console.log(account);
    let _authority = account.authority, authorityName
    _authority > 2 ? authorityName = '高级管理员' : _authority > 1 ? authorityName = '中级管理员' : authorityName = '低级管理员'
    //将数据导入表单
    $('.person-mailbox').html('邮箱：&nbsp;' + account.mailbox)
    $('.person-authority').html('权限：&nbsp;' + authorityName)
    $('.nickname').val(account.nickname)
    $('.account-token').val(accountToken)
    $('.account-old-headPortrait').val(account.headPortrait)
    $('.person-photo').attr({'src': '../' + account.headPortrait})
  }

  show_account()

  //表单图片预览
  lookPic($('.headPortrait-file'), $('.person-photo'))

  //修改信息
  //编辑信息表单提交
  $('#person').on('submit', async function (e) {
    e.preventDefault()
    let _result = await admin_model.updateAccount()
    console.log('_result:', _result);
    if (_result.status === 200) {
      //信息有改动，没改动不刷新数据
      if (_result.data._id) {
        console.log('res:', _result);
        sessionStorage.account = JSON.stringify(_result.data)
        localStorage.accountToken = _result.data.token
        show_account()
        bodyEvent.show_admin()
      }
      toast('保存成功')
    } else if (_result.status === 205) {
      toast('token失效，请重新登录', 'error')
    } else {
      toast('保存失败，请重新再试', 'error')
    }
  })

  //修改密码
  let changePasswordFlag = 0, changeSubmitFlag = 0
  $('.change-password').on('click', async function () {
      if (!changePasswordFlag) {
        //开始修改密码
        $('.old-password').addClass('active')
        $('.new-password').addClass('active')
        $('.change-password').val('保存密码')
        $('.getup').addClass('active')
        changePasswordFlag = 1
      } else {
        //修改完成，保存
        let body = {
          oldPassword: $('.oldPassword').val(),
          newPassword: $('.oldPassword').val(),
          accountToken: $('.account-token').val()
        }
        //旧密码格式验证
        changeSubmitFlag ? '' : !/[a-zA-Z0-9]{8,16}/.test($('.oldPassword').val()) ? changeSubmitFlag = 1 : ''
        //新密码格式验证
        changeSubmitFlag ? '' : !/[a-zA-Z0-9]{8,16}/.test($('.newPassword').val()) ? changeSubmitFlag = 2 : ''
        //两次密码相等验证
        changeSubmitFlag ? '' : $('.oldPassword').val() === $('.newPassword').val() ? changeSubmitFlag = 3 : ''
        switch (changeSubmitFlag) {
          case 1 :
            toast('旧格式错误', 'error', 1500);
            break;
          case 2 :
            toast('新密码格式错误', 'error', 1500);
            break;
          case 3 :
            toast('两次密码相等', 'error', 1500);
            break;
          default :
            let _result = await admin_model.changeAccountPassword(body)
            switch (_result.status) {
              case 200 :
                toast('更改成功');
                $('.old-password').removeClass('active').val('')
                $('.new-password').removeClass('active').val('')
                $('.change-password').val('修改密码')
                changePasswordFlag = 0
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
            changeSubmitFlag = 0
            break;
        }


      }
    }
  )

  //取消更改密码
  $('.getup').on('click', function () {
    $('.old-password').removeClass('active').val('')
    $('.new-password').removeClass('active').val('')
    $('.change-password').val('修改密码')
    $('.getup').removeClass('active')
    changePasswordFlag = 0
  })


}

export default adminEvent