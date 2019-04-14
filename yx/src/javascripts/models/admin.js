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

//查询用户账号
const selectUser = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/selectUser',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

//更新用户账号信息
const updateUser = () => {
  return new Promise((resolve) => {
    $('#user').ajaxSubmit({
      url: 'http://localhost:3000/api/admin/updateUser',
      type: 'post',
      success: (results) => {
        resolve(results)
      }
    })
  })
}

//token获取数据
const getByToken = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/getByToken',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

//更改用户密码
const changeUserPassword = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/changeUserPassword',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

//注销用户
const removeUser = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/removeUser',
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
  loginUser,
  updateUser,
  selectUser,
  changeUserPassword,
  getByToken,
  removeUser

}