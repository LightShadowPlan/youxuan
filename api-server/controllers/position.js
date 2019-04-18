/**
 * Created by qiangxl on 2019/3/16.
 */
const url = require('url')
const {handleData, sendMail, verificationMail, verificationCode} = require('../util')
const position = require('../models/position')
const admin = require('./admin')
const {token} = require('../util/token')
/**
 * 添加消息
 */
const addMessage = async (req, res) => {
  let _data = await position.selectUser(req.query)
  if (callback.name !== 'next') {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }

}

/**
 * 查询消息
 */
const selectMessage = async (req, res, callback) => {
  let _data = await position.selectUser(req.query)
  if (callback.name !== 'next') {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }
}

/**
 * 删除消息
 */
const removeMessage = async (req, res) => {
  let _data = await position.updateUser(req.body)
  handleData(_data, res, 'position')
}

/**
 * 添加物品
 */
const addGoods = async (req, res) => {
  let _token = await token.checkToken(req.body.userToken)
  delete req.body.userToken
  if (_token) {
    let _data = await position.addGoods(req.body) || []
    if (_data) {
      req.body = {
        _id: _token.data._id,
        sellGoods: _data._id
      }
      await position.updateUserSellGoods(req.body)
      let user_data = await position.selectUser({_id: _token.data._id})
      handleData(user_data, res, 'position')
    } else {
      handleData(_data, res, 'position')
    }

  } else {
    handleData(205, res, 'position')
  }
}

/**
 * 查询物品
 */
const selectGoods = async (req, res, callback) => {
  let goods = JSON.parse(req.body.goods)
  let _data = await position.selectGoods(goods)
  console.log('_data:',_data);
  if (callback.name !== 'next') {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }
}

/**
 * 更新物品
 */
const updateGoods = async (req, res) => {
  let _data = await position.updateUser(req.body)
  handleData(_data, res, 'position')
}

/**
 * 删除物品
 */
const removeGoods = async (req, res) => {
  let _data = await position.removeUser(req.body)
  handleData(_data, res, 'position')
}

/**
 * 添加交易
 */
const addTransactions = async (req, res) => {
  let _data = await position.selectUser(req.query)
  if (callback.name !== 'next') {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }

}

/**
 * 查询交易
 */
const selectTransactions = async (req, res, callback) => {
  let _data = await position.selectUser(req.query)
  if (callback.name !== 'next') {
    callback(_data)
  } else {
    handleData(_data, res, 'position')
  }
}

/**
 * 更新交易
 */
const updateTransactions = async (req, res) => {
  let _data = await position.updateUser(req.body)
  handleData(_data, res, 'position')
}

/**
 * 删除交易
 */
const removeTransactions = async (req, res) => {
  let _data = await position.removeUser(req.body)
  handleData(_data, res, 'position')
}


module.exports = {
  addMessage,
  selectMessage,
  removeMessage,
  addGoods,
  selectGoods,
  updateGoods,
  removeGoods,
  addTransactions,
  selectTransactions,
  updateTransactions,
  removeTransactions
}