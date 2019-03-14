/*
验证服务器
 */
//注册账号，临时存放
const addSignUpList = (data) => {
  return $.ajax({
    url: '/api/v1/position/addSignUpList',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

//注册内部账号
const addAccountList = (data) => {
  return $.ajax({
    url: '/api/v1/position/addAccountList',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}
//查询内部账号
const AccountLogin = (data) => {
  return $.ajax({
    url: '/api/v1/position/AccountLogin',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

export default {
  addSignUpList,
  addAccountList,
  AccountLogin

}