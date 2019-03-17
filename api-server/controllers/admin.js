/**
 * Created by qiangxl on 2019/3/16.
 */
const url = require('url')
const {handleData, sendMail, verificationMail, verificationCode} = require('../util')
const admin = require('../models/admin')
const {hash, token} = require('../util/token')

/**
 * 添加注册信息
 */
const addSignUp = async (req, res) => {
  //先去内部账号数据库里查询用户是否已经注册
  //如果已有账号 handleData(201, res, 'position')
  //如果没有账号，继续执行req.body
  //在注册数据库里查询是否有过注册记录
  //如果有，删除原来的
  let _req = {'body': {'mailbox': req.body.mailbox}}
  //判断是哪种账户注册
  let type = req.body.type
  delete req.body.type
  //回调函数
  let selectWay = async (data) => {
    if (data.length > 0) {
      handleData(201, res, 'position')
    } else {
      await selectSignUp(_req, res, function (data) {
        //有记录，删除原来的
        if (data.length > 0) {
          _req = {'body': data[0]}
          removeSignUp(_req, res)
        }
      })
      //获取一个随机验证码，存入
      let Code = verificationCode()
      req.body.verification = Code
      let _data = await admin.addSignUp(req.body)
      handleData(_data, res, 'position')
      verificationMail(req.body.mailbox, Code)
    }
  }
  if(type === 'account') {
    await selectAccount(_req, res, selectWay)
  } else{
    await selectUser(_req, res, selectWay)
  }
}

/**
 * 删除注册信息
 */
const removeSignUp = async (req, res) => {
  let _data = await admin.removeSignUp(req.body)
}
/**
 * 查询注册信息
 */
const selectSignUp = async (req, res, callback) => {
  let _data = await admin.selectSignUp(req.body)
  callback(_data)
}

/**
 * 添加管理人员
 */
const addAccount = async (req, res) => {
  //避免对原来的req造成改变
  let _req = {'body': {'mailbox': req.body.mailbox}}
  //再次查绚账号是否已注册
  await selectAccount(_req, res, async function (data) {
    if (data.length > 0) {
      //返回账号已注册
      handleData(201, res, 'position')
    } else {
      let _req = {'body': {'mailbox': req.body.mailbox, 'verification': req.body.verification}}
      //与注册数据库里的邮箱与验证码进行匹配
      await selectSignUp(_req, res, async function (data) {
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
            let _data = await admin.addAccount(req.body)
            //移除注册数据库里的记录
            removeSignUp(_req, res)
            //返回数据
            handleData(_data, res, 'position')
          } else {
            //验证码失效
            handleData(203, res, 'position')
          }
        }
      })
    }
  })


}

/**
 * 查询管理人员
 */
const selectAccount = async (req, res, callback) => {
  let _data = await admin.selectAccount(req.body)
  if (callback.name !== 'next') {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }
}

/**
 * 更新管理人员
 */
const updateAccount = async (req, res) => {
  let _data = await admin.updateAccount(req.query)
  handleData(_data, res, 'position')
}

/**
 * 删除管理人员
 */
const removeAccount = async (req, res) => {
  let _data = await admin.removeAccount(req.body)
  handleData(_data, res, 'position')
}

/**
 * 管理人员登陆验证
 */
const loginAccount = async (req, res) => {
  //将密码加密
  req.body.password = hash(req.body.password, 'hex')
  await selectAccount(req, res, async function (data) {
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


/**
 * 添加用户
 */
const addUser = async (req, res) => {
  //避免对原来的req造成改变
  let _req = {'body': {'mailbox': req.body.mailbox}}
  //再次查绚账号是否已注册
  await selectUser(_req, res, async function (data) {
    if (data.length > 0) {
      //返回账号已注册
      handleData(201, res, 'position')
    } else {
      let _req = {'body': {'mailbox': req.body.mailbox, 'verification': req.body.verification}}
      //与注册数据库里的邮箱与验证码进行匹配
      await selectSignUp(_req, res, async function (data) {
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
            let _data = await admin.addUser(req.body)
            //移除注册数据库里的记录
            removeSignUp(_req, res)
            //返回数据
            handleData(_data, res, 'position')
          } else {
            //验证码失效
            handleData(203, res, 'position')
          }
        }
      })
    }
  })


}

/**
 * 查询用户
 */
const selectUser = async (req, res, callback) => {
  let _data = await admin.selectUser(req.query)
  if (callback.name !== 'next') {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }
}

/**
 * 更新用户
 */
const updateUser = async (req, res) => {
  let _data = await admin.updateUser(req.body)
  handleData(_data, res, 'position')
}

/**
 * 删除用户
 */
const removeUser = async (req, res) => {
  let _data = await admin.removeUser(req.body)
  handleData(_data, res, 'position')
}


/**
 * 用户登陆验证
 */
const loginUser = async (req, res) => {
  //将密码加密
  req.body.password = hash(req.body.password, 'hex')
  await selectUser(req, res, async function (data) {
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
  addSignUp,
  addAccount,
  selectAccount,
  updateAccount,
  removeAccount,
  addUser,
  selectUser,
  updateUser,
  removeUser,
  loginAccount,
  loginUser
}