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

//更新管理员账号信息
const updateAccount = () => {
  return new Promise((resolve) => {
    $('#person').ajaxSubmit({
      url: 'http://localhost:3000/api/admin/updateAccount',
      type: 'post',
      success: (results) => {
        resolve(results)
      }
    })
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
const changeAccountPassword = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/changeAccountPassword',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

//注销用户账号
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
//注销管理员账号
const removeAccount = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/admin/removeAccount',
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
  loginAccount,
  updateAccount,
  removeAccount,
  getByToken,
  changeAccountPassword,
  removeUser,

}