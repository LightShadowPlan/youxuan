/**
 * Created by qiangxl on 2019/3/16.
 */
const url = require('url')
const {handleData, verificationMail, verificationCode} = require('../util')
const position = require('../models/position')
const {hash, token} = require('../util/token')
const fs = require('fs')
const Path = require('path')
const Moment = require('moment')


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
      let _data = await position.addSignUp(req.body)
      handleData(_data, res, 'position')
      console.log(req.body.mailbox,Code);
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
  let _data = await position.removeSignUp(req.body)
}
/**
 * 查询注册信息
 */
const selectSignUp = async (req, res, callback) => {
  let _data = await position.selectSignUp(req.body)
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
            let _data = await position.addAccount(req.body)
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
  let _data = await position.selectAccount(req.body)
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
  let account_id = req.body._id
  delete req.body.oldPassword
  delete req.body.newPassword
  let account_data = await position.selectAccount({_id: account_id})
  console.log(account_data);
  let _token = await token.checkToken(req.body.accountToken)
  delete req.body.accountToken
  if (_token) {
    //判断是否更新图片
    if (req.body.headPortrait === '') {
      delete req.body.headPortrait
    } else {
      if (req.body.old_headPortrait !== 'static/images/photo.png') {
        fs.unlink(Path.resolve(__dirname, '../../fe/' + req.body.old_headPortrait), (err) => {
        })
      }

    }
    delete req.body.old_headPortrait
    //查询最新数据，并返回
    console.log('req.body:', req.body);
    let _data = await position.updateAccount(req.body)
    if (_data.nModified > 0) {
      returnData(req, res, 'account')
    } else {
      handleData(_data, res, 'position')
    }
  } else {
    handleData(205, res, 'position')
  }
}


// 更新管理员账号
const updateAccountContent = async (req, res) => {
  let accountToken = req.body.accountToken
  //判断删除操作由用户还是管理员触发
  let _id = req.body._id
  let account_id = req.body.account_id
  let type = req.body.type
  let content = JSON.parse(req.body.content)
  let authority = await powerChecked(accountToken, account_id)
  //判断权限
  if (authority >= 2) {
    let account_data = await position.selectAccount({_id: _id})
    let sum = 0
    switch (~~type) {
      case 1:
        sum = 1;
        break;
      case 0:
        sum = 0;
        break;
      case -1:
        sum = 0;
        break;
    }
    console.log(sum);
    console.log(content);
    if (authority > account_data[0].authority + sum) {
      let _data = await position.updateAccountContent({_id: _id, content: content})
      console.log(_data);
      handleData(_data, res, 'position')
    } else {
      handleData(206, res, 'position')
    }
  } else if (authority >= 1) {
    handleData(206, res, 'position')
  } else {
    handleData(205, res, 'position')
  }
}

/**
 * 删除管理人员
 */
const removeAccount = async (req, res) => {
  let accountToken = req.body.accountToken
  //判断删除操作由用户还是管理员触发
  let _id = req.body._id
  let account_id = req.body.account_id
  let authority = await powerChecked(accountToken, account_id)
  //判断权限
  if (authority >= 2) {
    let account_data = await position.selectAccount({_id: _id})
    if (authority > account_data[0].authority) {
      let _data = await position.removeAccount({_id: _id})
      console.log(_data);
      handleData(_data, res, 'position')
    } else {
      handleData(206, res, 'position')
    }
  } else if (authority >= 1) {
    handleData(206, res, 'position')
  } else {
    handleData(205, res, 'position')
  }
}

//查询消息
const getMessage = async (req, res) => {
  let _id = req.body._id
  let messageArray = JSON.parse(req.body.messageArray)
  let _token
  if (req.body.userToken) {
    let user_data = await position.selectUser({_id: _id})
    let state = user_data ? user_data[0].state : false
    _token = await token.checkToken(req.body.userToken, state)
    delete req.body.userToken
  } else {
    let user_data = await position.selectAccount({_id: _id})
    let state = user_data ? user_data[0].state : false
    _token = await token.checkToken(req.body.accountToken, state)
    delete req.body.accountToken
  }

  if (_token) {
    let body = {
      query: {_id: {$in: messageArray}},
      content: {}
    }
    let message_data = await position.selectMessage(body)
    handleData(message_data, res, 'position')
  } else {
    handleData(205, res, 'position')
  }
}

//更新消息状态

const updateMessage = async (req, res) => {
  let messageArray = JSON.parse(req.body.messageArray)
  let allMessageArray = JSON.parse(req.body.allMessageArray)
  let body = {
    _id: {_id: {$in: messageArray}},
    content: {state: 1}
  }
  console.log(messageArray);
  let new_data = await position.updateMessage(body)
  console.log(new_data);
  let message_data = await position.selectMessage({query: {_id: {$in: allMessageArray}}, content: {}})
  handleData(message_data, res, 'position')
}


/**
 * 更改管理人员密码
 */

const changeAccountPassword = async (req, res) => {
  let _token = await token.checkToken(req.body.accountToken)
  delete req.body.accountToken
  if (_token) {
    let _body = req.body
    req.body = {}
    req.body._id = _token.data._id
    req.body.password = hash(_body.oldPassword, 'hex')
    await selectAccount(req, res, async function (data) {
      if (data.length > 0) {
        req.body.password = hash(_body.newPassword, 'hex')
        let _data = await position.updateAccount(req.body)
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
        '_id': _data._id
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
            let _data = await position.addUser(req.body)
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
  let _data = await position.selectUser(req.body)
  if (callback.name !== 'next') {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }
}

/**
 * 通过状态查询用户
 */
const selectUserByState = async (req, res, callback) => {
  req.body.query = JSON.parse(req.body.query)
  req.body.content = JSON.parse(req.body.content)
  let _data = await position.selectUserByState(req.body)
  handleData(_data, res, 'position')
}

/**
 * 查询用户总数
 */
const selectUserCount = async (req, res, callback) => {
  req.body.query = JSON.parse(req.body.query)
  let _data = await position.selectUserCount(req.body)
  console.log(_data);
  handleData(_data, res, 'position')
}

/**
 * 更新用户个人信息
 */
const updateUser = async (req, res) => {
  let user_id = req.body._id
  let user_data = await position.selectUser({_id: user_id})
  let state = user_data ? user_data[0].state : false
  let _token = await token.checkToken(req.body.userToken, state)
  delete req.body.userToken
  if (_token) {
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
    if (req.body.headPortrait === '') {
      delete req.body.headPortrait
    } else {
      if (req.body.old_headPortrait !== 'static/images/photo.png') {
        fs.unlink(Path.resolve(__dirname, '../../yx/' + req.body.old_headPortrait), (err) => {
        })
      }

    }
    delete req.body.old_headPortrait
    //查询最新数据，并返回
    let _data = await position.updateUser(req.body)
    if (_data.nModified > 0) {
      returnData(req, res, 'user')
    } else {
      handleData(_data, res, 'position')
    }
  } else {
    handleData(205, res, 'position')
  }

}


//更新用户物品信息
const updateUserGoods = async (req, res) => {
  let user_id = req.body._id
  let user_data = await position.selectUser({_id: user_id})
  let state = user_data ? user_data[0].state : false
  let _token = await token.checkToken(req.body.userToken, state)
  delete req.body.userToken
  if (_token) {
    let content = JSON.parse(req.body.content)
    let body = {
      _id: req.body._id,
      content: content
    }
    await position.updateUserContent(body)
    let _data = await position.selectUser({_id: body._id})
    console.log(_data);
    handleData(_data, res, 'position')
  } else {
    handleData(205, res, 'position')
  }

}

//购买物品
const purchaseGoods = async (req, res) => {
  let seller_id = req.body.purchaser_id //出售人ID
  let purchaser_id = req.body.purchaser_id //购买人ID
  let user_data = await position.selectUser({_id: purchaser_id})
  let state = user_data ? user_data[0].state : false
  let _token = await token.checkToken(req.body.userToken, state)
  delete req.body.userToken
  if (_token) {

    //更新购买人购买信息
    let content = JSON.parse(req.body.content)
    let body = {
      _id: req.body.purchaser_id,
      content: content
    }
    await position.updateUserContent(body)

    //更新交易状态
    let _body = {
      seller: seller_id,
      purchaser: req.body.purchaser_id,
      state: 1,
      goodsId: content.$addToSet.purchaserGoods,
    }
    let transactions_data = await position.addTransactions(_body)

    //更新物品状态
    let _timestamp = Date.now()
    let moment = Moment(_timestamp).format("YYYY-MM-DD  hh:mm")
    let __body = {
      _id: {_id: {$in: [content.$addToSet.purchaserGoods]}},
      content: {
        state: 1,
        purchaser: {
          _id: _token.data._id,
          headPortrait: user_data[0].headPortrait,
          nickname: user_data[0].nickname,
          time: moment
        },
        transaction: transactions_data._id
      }
    }
    await position.updateGoods(__body)

    //返回购买人新的信息
    let _data = await position.selectUser({_id: body._id})

    handleData(_data, res, 'position')
  } else {
    handleData(205, res, 'position')
  }
}

//交易完成

const transactionOver = async (req, res) => {
  let user_id = req.body.user_id
  let seller_id = req.body.seller_id
  let goods_id = req.body.goods_id
  let transaction_id = req.body.transaction_id
  let user_data = await position.selectUser({_id: user_id})
  let state = user_data ? user_data[0].state : false
  let _token = await token.checkToken(req.body.userToken, state)
  delete req.body.userToken
  if (_token) {
    //更改物品状态
    let body = {
      _id: {_id: goods_id},
      content: {state: 2}
    }
    await position.updateGoods(body)
    //更改交易状态
    let _body = {
      query: {_id: transaction_id},
      content: {state: 2}
    }
    await position.updateTransactions(body)

    let message1_body = {
      sender: '商城系统',
      receiver: seller_id,
      content: '尊敬的用户，您所出售的部分物品已完成交易，谢谢你的使用。'
    }
    let message2_body = {
      sender: '商城系统',
      receiver: user_id,
      content: '尊敬的用户，您所购买的部分物品已完成交易，谢谢你的使用。'
    }
    let message1_data = await position.addMessage(message1_body)
    let message2_data = await position.addMessage(message2_body)
    let body1 = {
      _id: seller_id,
      content: {$addToSet: {message: message1_data._id}}
    }
    console.log(message2_data);
    let body2 = {
      _id: user_id,
      content: {$addToSet: {message: message2_data._id}}
    }
    await position.updateUserContent(body1)
    await position.updateUserContent(body2)

    let user_data = await position.selectUser({_id: user_id})
    handleData(user_data, res, 'position')
  } else {
    handleData(205, res, 'position')
  }
}


/**
 * 删除用户
 */
const removeUser = async (req, res) => {
  if (req.body.accountToken && req.body.user_id && req.body.account_id) {
    let user_id = req.body.user_id
    let account_id = req.body.account_id
    let authority = await powerChecked(req.body.accountToken, account_id)
    if (authority <= 0) {
      handleData(205, res, 'position')
    } else if (authority === 1) {
      handleData(206, res, 'position')
    } else {
      let user_data = await position.removeUser({'_id': user_id})
      fs.unlink(Path.resolve(__dirname, '../../yx/' + req.body.headPortrait), (err) => {
      })
      handleData(user_data, res, 'position')
    }
  } else {
    let user_id = req.body._id
    let user_data = await position.selectUser({_id: user_id})
    let state = user_data ? user_data[0].state : false
    let _userToken = await token.checkToken(req.body.userToken, state)
    if (_userToken) {
      let user_id = _userToken.data._id
      let user_data = await position.removeUser({'_id': user_id})
      fs.unlink(Path.resolve(__dirname, '../../yx/' + req.body.headPortrait), (err) => {
      })
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
  let user_id = req.body._id
  let user_data = await position.selectUser({_id: user_id})
  let state = user_data ? user_data[0].state : false
  let _token = await token.checkToken(req.body.userToken, state)

  delete req.body.userToken
  if (_token) {
    let _body = req.body
    req.body = {}
    req.body._id = _token.data._id
    req.body.password = hash(_body.oldPassword, 'hex')
    await selectUser(req, res, async function (data) {
      if (data.length > 0) {
        req.body.password = hash(_body.newPassword, 'hex')
        let _data = await position.updateUser(req.body)
        let newToken = token.createToken({
          '_id': _token.data._id
        }, 7200)
        _data.token = newToken
        handleData(_data, res, 'position')
      } else {
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
//用户在线状态 0,下线, 1,在线, 2,封禁,
const userState = async (_id, state) => {
  let _data = await position.updateUserContent({_id: _id, content: {state: state}})
  console.log('state:', _data);
}

//用户在线状态 0,下线, 1,在线, 2,封禁,
const accountState = async (_id, state) => {
  let _data = await position.updateAccountContent({_id: _id, content: {state: state}})
  console.log('state:', _data);
}

// 用户封禁,
const updateUserState = async (req, res) => {
  let account_id = req.body.account_id
  let user_id = req.body.user_id
  let authority = await powerChecked(req.body.accountToken, account_id)
  //判断权限
  if (authority <= 0) {
    handleData(205, res, 'position')
  } else if (authority === 1) {
    handleData(206, res, 'position')
  } else {
    let state = req.body.state
    let _data = await position.updateUserContent({_id: user_id, content: {state: state}})
    handleData(_data, res, 'position')
  }
}

//------------------------------------------------------------------------------

// 验证token,获取信息，常用于页面加载后检测token，然后再加信息，避免重复登陆
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
      if (_data.authority >= 1) {
        //更新Token
        let newToken = await token.createToken({
          '_id': _data._id
        }, 7200)
        _data.token = newToken
        handleData(_data, res, 'position')
      } else {
        handleData(206, res, 'position')
      }
    })
  }
}

//权限检查，返回权限,token失效返回-1
const powerChecked = async (Token, _id) => {
  let account_data = await position.selectAccount({_id: _id})
  let state = account_data ? account_data[0].state : false
  let _token = await token.checkToken(Token, state)
  if (_token) {
    return account_data[0].authority
  } else {
    return -1
  }
}


module.exports = {
  addSignUp,
  addAccount,
  selectAccount,
  updateAccount,
  removeAccount,
  changeAccountPassword,
  addUser,
  selectUser,
  selectUserCount,
  selectUserByState,
  updateUser,
  purchaseGoods,
  updateUserGoods,
  removeUser,
  loginAccount,
  loginUser,
  transactionOver,
  changeUserPassword,
  getByToken,
  powerChecked,
  userState,
  updateUserState,
  accountState,
  getMessage,
  updateMessage,
  updateAccountContent
}