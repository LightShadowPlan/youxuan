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

//注册用户账号
const addUser = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/addUser',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}
//登录查询用户账号
const loginUser = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/loginUser',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

export default {
  addSignUp,
  addUser,
  loginUser

}