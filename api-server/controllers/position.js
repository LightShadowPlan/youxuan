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
        goods: {'$addToSet': {'sellGoods': _data._id}}
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
  req.body.goodsArray = JSON.parse(req.body.goodsArray)
  req.body.state = JSON.parse(req.body.state)
  let _data = await position.selectGoods(req.body)
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
  let goodsArray = JSON.parse(req.body.goodsArray)
  //判断删除操作由用户还是管理员触发
  if (req.body.accountToken) {
    let authority = await admin.powerChecked(req.accountToken)
    //判断权限
    if (authority <= 0) {
      handleData(205, res, 'position')
    } else if (authority === 1) {
      handleData(206, res, 'position')
    } else {

    }
  } else {
    let _token = await token.checkToken(req.body.userToken)
    delete req.body.userToken
    if (_token) {
      //判断物品状态
      let user_id = _token.data._id
      //未交易
      if (~~req.body.state === 0) {
        body = {
          _id: user_id,
          goods: {'$pull': {'sellGoods': {'$each': goodsArray}}}

        }
        //删除用户记录此物品的记录
        await position.updateUserSellGoods(body)
        //删除物品记录
        await removeGoodsItem(goodsArray)
        //查询用户数据
        let user_data = await position.selectUser({_id: user_id})
        handleData(user_data, res, 'position')
      } else if(req.body.state === 1){  //交易中

      } else if(req.body.state === 2){ //交易完成

      }

    } else {
      handleData(205, res, 'position')
    }
  }
}

const removeGoodsItem = async (goods) => {
  await position.removeGoods({'goodsArray': goods})
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