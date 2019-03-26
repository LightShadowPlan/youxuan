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
  goodsType: String,
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


//数据统计数据库
let DataStatisticsModel = mongoose.model('data_statistics', new mongoose.Schema({
  pageView: [{
    time: String,
    number: Number
  }],
  user: [{
    time: String,
    number: Number
  }],
  goods: [{
    time: String,
    number: Number
  }],
  userClass: {
    user: Number,
    seller: Number,
    purchaser: Number,
    sellerPurchaser: Number
  },
  goodsClass: {
    book: Number,
    penOrTool: Number,
    cosmetics: Number,
    dailyNecessities: Number,
    ball: Number,
    bicycle: Number,
    phone: Number,
    electronics: Number
  },
  supplyDemand: [{
    goodsClass: String,
    supply: Number,
    demand: Number
  }],
  transactions: [{
    time: String,
    number: Number
  }],
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

/**
 * 添加数据分析
 */
const addDataStatistics = async (body) => {
  return DataStatisticsModel({
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
 * 查询数据分析
 */
const selectDataStatistics = async (body) => {
  return DataStatisticsModel.find(
    body
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 *更新数据分析
 */
const updateDataStatistics = async (body) => {
  return DataStatisticsModel.updateOne(
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
 * 删除数据分析
 */
const removeDataStatistics = async (body) => {
  return DataStatisticsModel.deleteOne(
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
  removeTransactions,
  addDataStatistics,
  selectDataStatistics,
  updateDataStatistics,
  removeDataStatistics
}