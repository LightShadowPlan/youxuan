const mongoose = require('../util/mongoose')
const Moment = require('moment')
const fs = require('fs')
const Path = require('path')

//注册账号数据库
let SignUpModel = mongoose.model('signups', new mongoose.Schema({
  mailbox: String,
  verification: String,
  addTime: Date
}));
//正式账号数据库
let AccountModel = mongoose.model('accounts', new mongoose.Schema({
  mailbox: String,
  password: String,
  headPortrait: String,
  authority: Number,
  news: Number,
  addTime: Date
}));

/**
 * 添加注册用户
 */
const addSignUpList = async (body) => {
  return SignUpModel({
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
 * 删除注册用户
 */
const removeSignUpList = async (body) => {
  return SignUpModel.deleteOne(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 * 查询注册用户
 */
const selectSignUpList = async (body) => {
  return SignUpModel.find(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 * 添加正式用户
 */
const addAccountList = async (body) => {
  body.authority = 0
  return AccountModel({
    ...body,
    addTime: Date.now(),
  }).save(

  ).then((res) => {
    return res.mailbox
  }).catch(() => {
    return false
  })
}
/**
 * 查询正式用户
 */
const selectAccountList = async (body) => {
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

module.exports = {
  addSignUpList,
  removeSignUpList,
  selectSignUpList,
  addAccountList,
  selectAccountList,
}