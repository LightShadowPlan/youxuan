/**
 * Created by qiangxl on 2019/3/16.
 */
const mongoose = require('../util/mongoose')
const Moment = require('moment')
const fs = require('fs')
const Path = require('path')

//消息数据库
let MessageModel = mongoose.model('messages', new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String,
  start: String,
  addTime: Date
}));

//物品数据库
let GoodsModel = mongoose.model('goods', new mongoose.Schema({
  goodsName: String,
  goodsPrice: Number,
  goodsContent: String,
  goodsPhoto: Array,
  goodsState: Number,
  goodComment: [{
    userId: String,
    nickname: String,
    headPortrait: String,
    comment: String,
    addTime: Date
  }],
  goodsAuction: [{
    purchaser: String,
    headPortrait: String
  }],
  seller: String,
  transaction: String,
  addTime: Date
}));

// 交易信息数据库
let TransactionsModel = mongoose.model('transactions', new mongoose.Schema({
  seller: String,
  purchaser: String,
  addTime: Date
}));


/**
 * 添加消息
 */
const addMessage = async (body) => {
  return MessageModel({
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
 * 查询消息
 */
const selectMessage = async (body) => {
  return MessageModel.find(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 * 删除消息
 */
const removeMessage = async (body) => {
  return MessageModel.deleteOne(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}


/**
 * 添加物品
 */
const addGoods = async (body) => {
  return GoodsModel({
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
 * 查询物品
 */
const selectGoods = async (body) => {
  return GoodsModel.find(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 *更新物品
 */
const updateGoods = async (body) => {
  return GoodsModel.updateOne(
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
 * 删除物品
 */
const removeGoods = async (body) => {
  return GoodsModel.deleteOne(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}

/**
 * 添加交易
 */
const addTransactions = async (body) => {
  return TransactionsModel({
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
 * 查询交易
 */
const selectTransactions = async (body) => {
  return TransactionsModel.find(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 *更新交易
 */
const updateTransactions = async (body) => {
  return TransactionsModel.updateOne(
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
 * 删除交易
 */
const removeTransactions = async (body) => {
  return TransactionsModel.deleteOne(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
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