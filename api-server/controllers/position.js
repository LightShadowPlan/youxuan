const url = require('url')
const {handleData, sendMail, verificationMail, verificationCode} = require('../util')
const position = require('../models/position')
const {hash, token} = require('../util/token')

/**
 * 添加注册用户
 */
const addSignUpList = async (req, res) => {
  //先去内部账号数据库里查询用户是否已经注册
  //如果已有账号 handleData(201, res, 'position')
  //如果没有账号，继续执行req.body
  //在注册数据库里查询是否有过注册记录
  //如果有，删除原来的
  let _req = {'body': {'mailbox': req.body.mailbox}}
  await selectAccountList(_req, res, async function (data) {
    if (data.length > 0) {
      handleData(201, res, 'position')
    } else {
      await selectSignUpList(_req, res, function (data) {
        //有记录，删除原来的
        if (data.length > 0) {
          _req = {'body': data[0]}
          removeSignUpList(_req, res)
        }
      })
      //获取一个随机验证码，存入
      let Code = verificationCode()
      req.body.verification = Code
      let _data = await position.addSignUpList(req.body)
      handleData(_data, res, 'position')
      verificationMail(req.body.mailbox, Code)
    }

  })
}

/**
 * 删除注册用户
 */
const removeSignUpList = async (req, res) => {
  let _data = await position.removeSignUpList(req.body)
}
/**
 * 查询注册用户
 */
const selectSignUpList = async (req, res, callback) => {
  let _data = await position.selectSignUpList(req.body)
  callback(_data)
}
/**
 * 添加正式用户
 */
const addAccountList = async (req, res) => {
  //避免对原来的req造成改变
  let _req = {'body': {'mailbox': req.body.mailbox}}
  //再次查绚账号是否已注册
  await selectAccountList(_req, res, async function (data) {
    if (data.length > 0) {
      //返回账号已注册
      handleData(201, res, 'position')
    } else {
      let _req = {'body': {'mailbox': req.body.mailbox, 'verification': req.body.verification}}
      //与注册数据库里的邮箱与验证码进行匹配
      await selectSignUpList(_req, res, async function (data) {
        //邮箱与验证码相同
        if (data.length <= 0) {
          //返回验证码错误
          handleData(202, res, 'position')
        } else {
          let newTime = new Date()
          let Time = parseInt((newTime - data[0].addTime) / 60000);
          if (Time < 720) {
//先加密密码，再将账号密码存入数据库
            req.body.password = hash(req.body.password, 'hex')
            let _data = await position.addAccountList(req.body)
            //移除注册数据库里的记录
            removeSignUpList(_req, res)
            //返回数据
            handleData(_data, res, 'position')
          } else {
            handleData(203, res, 'position')
          }
        }
      })
    }
  })


}

/**
 * 查询正式用户
 */
const selectAccountList = async (req, res, callback) => {
  let _data = await position.selectAccountList(req.body)
  if (callback) {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }
}
/**
 * 登陆验证
 */
const AccountLogin = async (req, res) => {
  //将密码加密
  req.body.password = hash(req.body.password, 'hex')
  await selectAccountList(req, res, async function (data) {
    if (data.length > 0) {
      let _data = JSON.parse(JSON.stringify(data[0]))
      //生成token存入要发送的数据中
      let _token = token.createToken({
        'mailbox': _data.mailbox
      }, 3600)
      _data.token = _token
      handleData(_data, res, 'position')
    } else {
      handleData(204, res, 'position')
    }
  })
}


module.exports = {
  addSignUpList,
  addAccountList,
  selectAccountList,
  AccountLogin
}