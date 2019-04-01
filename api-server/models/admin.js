/**
 * Created by qiangxl on 2019/3/16.
 */
const mongoose = require('../util/mongoose')
const Moment = require('moment')
const fs = require('fs')
const Path = require('path')

//注册信息验证数据库
let VerificationModel = mongoose.model('verifications', new mongoose.Schema({
  mailbox: String,
  verification: String,
  addTime: Date
}));

//管理人员账号数据库
let AccountModel = mongoose.model('accounts', new mongoose.Schema({
  mailbox: String,
  password: String,
  nickname: String,
  headPortrait: String,
  authority: Number,
  state: String,
  message: Array,
  notification: [{
    sender: String,
    receiver: String,
    content: String,
    addTime: Date
  }],
  addTime: Date
}));

// 用户账号数据库
let UserModel = mongoose.model('users', new mongoose.Schema({
  mailbox: String,
  password: String,
  nickname: String,
  gender: String,
  headPortrait: String,
  contactWay: String,
  state: String,
  message: Array,
  notification: [{
    sender: String,
    receiver: String,
    content: String,
    addTime: Date
  }],
  sellGoods: Array,
  purchaserGoods: Array,
  favorite: Array,
  addTime: Date
}));

let defaultsNickname = '科院小院'
let defaultGender = 'male'
let defaultsPhoto = 'https://lightshadow.xyz/youxuan/index/static/images/photo.png'

/**
 * 添加注册信息
 */
const addSignUp = async (body) => {
  return VerificationModel({
    ...body,
    addTime: Date.now(),
  }).save(

  ).then((res) => {
    delete res.verification
    return res
  }).catch(() => {
    return false
  })
}
/**
 * 查询注册信息
 */
const selectSignUp = async (body) => {
  return VerificationModel.find(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 * 删除注册信息
 */
const removeSignUp = async (body) => {
  return VerificationModel.deleteOne(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}

/**
 * 添加管理人员
 */
const addAccount = async (body) => {
  body.authority = 0
  return AccountModel({
    ...body,
    headPortrait: defaultsPhoto,
    nickname: defaultsNickname,
    gender: defaultGender,
    addTime: Date.now(),
  }).save(

  ).then((res) => {
    return res.mailbox
  }).catch(() => {
    return false
  })
}
/**
 * 查询管理人员
 */
const selectAccount = async (body) => {
  return AccountModel.find(
    body,
    {
      'password': false
    }
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 *更新管理人员
 */
const updateAccount = async (body) => {
  return AccountModel.updateOne(
    {
      _id: body._id
    },
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}

/**
 * 删除管理人员
 */
const removeAccount = async (body) => {
  return AccountModel.deleteOne(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}


/**
 * 添加用户
 */
const addUser = async (body) => {
  body.authority = 0
  return UserModel({
    ...body,
    headPortrait: defaultsPhoto,
    nickname: defaultsNickname,
    gender: defaultGender,
    addTime: Date.now(),
  }).save(

  ).then((res) => {
    return res.mailbox
  }).catch(() => {
    return false
  })
}
/**
 * 查询用户
 */
const selectUser = async (body) => {
  return UserModel.find(
    body,
    {
      'password': false
    }
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}

/**
 *更新用户
 */
const updateUser = async (body) => {
  return AccountModel.update(
    {
      _id: body._id
    },
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}

/**
 * 删除用户
 */
const removeUser = async (body) => {
  return UserModel.deleteOne(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}



module.exports = {
  addSignUp,
  selectSignUp,
  removeSignUp,
  addAccount,
  selectAccount,
  updateAccount,
  removeAccount,
  addUser,
  selectUser,
  updateUser,
  removeUser
}