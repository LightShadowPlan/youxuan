/**
 * Created by qiangxl on 2019/3/16.
 */
const url = require('url')
const {handleData, sendMail, verificationMail, verificationCode} = require('../util')
const admin = require('../models/admin')
const {hash, token} = require('../util/token')
const fs = require('fs')
const Path = require('path')
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
  if (type === 'account') {
    await selectAccount(_req, res, selectWay)
  } else {
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
  if (callback.name !== 'next') {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }
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
            req.body.headPortrait = 'https://lightshadow.xyz/CDN/file/images/photo.png'
            req.body.nickname = '优选管理'
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
  let _data = await admin.updateAccount(req.body)
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
      }, 7200)
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
  let _data = await admin.selectUser(req.body)
  if (callback.name !== 'next') {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }
}


/**
 * 更新用户个人信息
 */
const updateUser = async (req, res) => {

  let _token = await token.checkToken(req.body.userToken)
  delete req.body.userToken
  if (_token) {
    req.body._id = _token.data._id
    //联系方式
    req.body.contactWay = {
      qq: req.body.qq,
      wechat: req.body.wechat,
      phoneNumber: req.body.phoneNumber
    }
    delete req.body.qq
    delete req.body.wechat
    delete req.body.phoneNumber
    //判断是否更新图片
    if (req.body.headPortrait === '' || req.body.old_headPortrait === 'static/images/photo.png') {
      delete req.body.headPortrait
    } else {
      fs.unlink(Path.resolve(__dirname, '../../yx/' + req.body.old_headPortrait), (err) => {
      })
    }
    delete req.body.old_headPortrait
    //查询最新数据，并返回
    let _data = await admin.updateUser(req.body)
    if (_data.nModified > 0) {
      returnData(req, res, 'user')
    } else {
      handleData(_data, res, 'position')
    }
  } else {
    handleData(205, res, 'position')
  }


}

/**
 * 删除用户
 */
const removeUser = async (req, res) => {
  if (req.body.accountToken && req.body._id) {
    let _accountToken = await token.checkToken(req.body.accountToken)
    if (_accountToken) {
      let user_id = req.body._id
      let account_id = _accountToken._id
      let account_data = await admin.selectAccount({'_id': account_id})
      if (account_data.length > 0 && account_data[0].authority >= 2) {
        let user_data = await admin.removeUser({'_id': user_id})
        console.log('user_data:',user_data);
        handleData(user_data, res, 'position')
      } else{
        handleData(206, res, 'position')
      }
    } else {
      handleData(205, res, 'position')
    }
  } else {
    let _userToken = await token.checkToken(req.body.userToken)
    if (_userToken) {
      let user_id = _userToken.data._id
      let user_data = await admin.removeUser({'_id': user_id})
      console.log('_data:', user_data);
      handleData(user_data, res, 'position')
    } else {
      handleData(205, res, 'position')
    }
  }

}

/**
 * 更改用户密码
 */

const changeUserPassword = async (req, res) => {
  let _token = await token.checkToken(req.body.userToken)

  delete req.body.userToken
  if (_token) {
    let _body = req.body
    req.body = {}
    req.body._id = _token.data._id
    req.body.password = hash(_body.oldPassword, 'hex')
    await selectUser(req, res, async function (data) {
      if (data.length > 0) {
        req.body.password = hash(_body.newPassword, 'hex')
        let _data = await admin.updateUser(req.body)
        let newToken = token.createToken({
          '_id': _token.data._id
        }, 7200)
        _data.token = newToken
        handleData(_data, res, 'position')
      } else {
        console.log('204');
        handleData(204, res, 'position')
      }
    })
  } else {
    handleData(205, res, 'position')
  }
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
        '_id': _data._id
      }, 7200)
      _data.token = _token
      handleData(_data, res, 'position')
    } else {
      handleData(204, res, 'position')
    }
  })
}


// 验证token,获取信息
const getByToken = async (req, res) => {
  let _token = await token.checkToken(req.body.token)
  let _type = req.body.type
  if (_token) {
    req.body._id = _token.data._id
    delete req.body.token
    delete req.body.type
    returnData(req, res, _type)
  } else {
    handleData(205, res, 'position')
  }
}

//获取信息
const returnData = async (req, res, _type) => {
  if (_type === 'user') {
    await selectUser(req, res, async function (data) {
      let _data = JSON.parse(JSON.stringify(data[0]))
      //更新Token
      let newToken = await token.createToken({
        '_id': _data._id
      }, 7200)
      _data.token = newToken
      handleData(_data, res, 'position')
    })
  } else {
    await selectAccount(req, res, async function (data) {
      let _data = JSON.parse(JSON.stringify(data[0]))
      //更新Token
      let newToken = await token.createToken({
        '_id': _data._id
      }, 7200)
      _data.token = newToken
      handleData(_data, res, 'position')
    })
  }
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
  loginUser,
  changeUserPassword,
  getByToken,
}