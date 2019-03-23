/*
验证服务器
 */
//注册账号，临时存放
const addSignUp = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/addSignUp',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

//注册内部账号
const addAccount = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/addAccount',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}
//查询内部账号
const loginAccount = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/loginAccount',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

export default {
  addSignUp,
  addAccount,
  loginAccount

}