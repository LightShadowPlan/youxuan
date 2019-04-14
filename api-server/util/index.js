const {sendMail, verificationMail, verificationCode} = require('./email')
const none = () => {
}

// 返回错误代码
const handleData = (data, res, template, callbacks = {}) => {
  let {success, fail} = {
    success: callbacks.success || none,
    fail: callbacks.fail || none
  }
  if (!data) {
    fail()
    response.call(res, {template, code: 500, data: '发生了不可预知的错误'})

  } else {
    success()
    switch (data) {
      //用户已存在
      case 201 : response.call(res, {template, code: 201, data: JSON.stringify(data)}); break;
      //验证码错误
      case 202 : response.call(res, {template, code: 202, data: JSON.stringify(data)}); break;
      //验证码过期
      case 203 : response.call(res, {template, code: 203, data: JSON.stringify(data)}); break;
      //账号或密码错误
      case 204 : response.call(res, {template, code: 204, data: JSON.stringify(data)}); break;
      //token过期
      case 205 : response.call(res, {template, code: 205, data: JSON.stringify(data)}); break;
      //管理员权限不够
      case 206 : response.call(res, {template, code: 206, data: JSON.stringify(data)}); break;
      //默认
      default: response.call(res, {template, code: 200, data: JSON.stringify(data)}); break;
    }

  }
}
// 响应
const response = function ({template, code, data}) {
  this.render(template, {
    code: code,
    data: data
  })
}


module.exports = {
  handleData,
  sendMail,
  verificationMail,
  verificationCode
}