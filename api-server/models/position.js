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
  state: Number,
  message: Array,
  addTime: Date,
  formatTime: String
}));

// 用户账号数据库
let UserModel = mongoose.model('users', new mongoose.Schema({
  mailbox: String,
  password: String,
  nickname: String,
  gender: String,
  headPortrait: String,
  contactWay: {
    qq: String,
    wechat: String,
    phoneNumber: String
  },
  state: Number,
  message: Array,
  sellGoods: Array,
  purchaserGoods: Array,
  favorite: Array,
  addTime: Date,
  formatTime: String
}));

//消息数据库
let MessageModel = mongoose.model('messages', new mongoose.Schema({
  sender: String,
  receiver: String,
  title: String,
  content: String,
  state: Number,
  addTime: Date,
  formatTime: String
}));

//物品数据库
let GoodsModel = mongoose.model('goods', new mongoose.Schema({
  goodsName: String,
  goodsPrice: Number,
  goodsContent: String,
  goodsPhoto: Array,
  goodsClass: String,
  goodsComment: [{
    _id: String,
    nickname: String,
    headPortrait: String,
    comment: String,
    addTime: String
  }],
  state: Number,
  seller: Object,
  purchaser: Object,
  transaction: String,
  addTime: Date,
  formatTime: String
}));

// 交易信息数据库
let TransactionsModel = mongoose.model('transactions', new mongoose.Schema({
  seller: String,
  purchaser: String,
  state: Number,
  goodsId: String,
  addTime: Date,
  content: Object,
  formatTime: String
}));

// 首页推送数据库
let HomePushModel = mongoose.model('homePushes', new mongoose.Schema({
  homePhoto: String,
  content: String,
  url: String,
  addTime: Date,
  formatTime: String
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
  goodsClass: String,
  supplyDemand: [{
    goodsClass: String,
    supply: Number,
    demand: Number
  }],
  transactions: [{
    time: String,
    number: Number
  }],
  addTime: Date,
  formatTime: String
}));

let defaultsNickname = '还没有名字呢'
let defaultGender = 'male'
let defaultsPhoto = 'static/images/photo.jpeg'

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
  let _timestamp = Date.now()
  let moment = Moment(_timestamp)
  return AccountModel({
    ...body,
    headPortrait: defaultsPhoto,
    nickname: defaultsNickname,
    gender: defaultGender,
    addTime: _timestamp,
    formatTime: moment.format("YYYY-MM-DD  hh:mm")
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
//更新管理人员其他信息
const updateAccountContent = async (body) => {
  let {_id, content} = body
  return AccountModel.updateOne(
    {
      _id: _id
    },
    content
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
  let _timestamp = Date.now()
  let moment = Moment(_timestamp)
  return UserModel({
    ...body,
    headPortrait: defaultsPhoto,
    nickname: defaultsNickname,
    gender: defaultGender,
    contactWay: {
      qq: '无',
      wechat: '无',
      phoneNumber: '无'
    },
    state: 0,
    addTime: _timestamp,
    formatTime: moment.format("YYYY-MM-DD  hh:mm")
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
      'password': false,
    }
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}

/**
 * 查询用户
 */
const selectUserByState = async (body) => {
  return UserModel.find(
    body.query,
     null,
    body.content
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}

/**
 * 查询用户总数
 */
const selectUserCount = async (body) => {
  return UserModel.find(
    body.query,
    null,
    null
  ).count()
    .then((res) => {
      return res
    }).catch(() => {
      return false
    })
}


/**
 *更新用户基本信息
 */
const updateUser = async (body) => {
  return UserModel.updateOne(
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
//更新用户其他信息
const updateUserContent = async (body) => {
  let {_id, content} = body
  return UserModel.updateOne(
    {
      _id: _id
    },
    content
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
/**
 * 添加消息
 */
const addMessage = async (body) => {
  let _timestamp = Date.now()
  let moment = Moment(_timestamp)
  return MessageModel({
    ...body,
    state: 0,
    addTime: _timestamp,
    formatTime: moment.format("YYYY-MM-DD  hh:mm")
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
    body.query,
    null,
    body.content
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
//更新消息
const updateMessage = async (body) => {
  return MessageModel.updateMany(
    body._id,
    body.content
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
  return MessageModel.delete(
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
  let _timestamp = Date.now()
  let moment = Moment(_timestamp)
  return GoodsModel({
    ...body,
    state: 0,
    addTime: _timestamp,
    formatTime: moment.format("YYYY-MM-DD  hh:mm")
  }).save(

  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 * 查询物品
 */
const selectGoods = async (body) => {
  return GoodsModel.find(
    body.query,
    null,
    body.vernier
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}

/**
 * 查询物品总数
 */
const selectGoodsCount = async (body) => {
  return GoodsModel.find(
    body.query,
    null,
    null
  ).count()
    .then((res) => {
      return res
    }).catch(() => {
      return false
    })
}
/**
 *更新物品
 */
const updateGoods = async (body) => {
  return GoodsModel.updateMany(
    body._id,
    body.content
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
  let {goodsArray} = body
  return GoodsModel.deleteMany(
    {_id: {$in: goodsArray}}
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
  let _timestamp = Date.now()
  let moment = Moment(_timestamp)
  return TransactionsModel({
    ...body,
    addTime: _timestamp,
    formatTime: moment.format("YYYY-MM-DD  hh:mm")
  }).save(

  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 * 查询交易
 */
const selectTransactions = async (body) => {
  return TransactionsModel.find(
    body.query,
    null,
    body.content
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}

/**
 * 查询物品总数
 */
const selectTransactionsCount = async (body) => {
  return TransactionsModel.find(
    body.query,
    null,
    null
  ).count()
    .then((res) => {
      return res
    }).catch(() => {
      return false
    })
}
/**
 *更新交易
 */
const updateTransactions = async (body) => {
  return TransactionsModel.updateMany(
    body.query,
    body.content
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
 * 添加首页推送
 */
const addHomePush = async (body) => {
  let _timestamp = Date.now()
  let moment = Moment(_timestamp)
  return HomePushModel({
    ...body,
    addTime: _timestamp,
    formatTime: moment.format("YYYY-MM-DD  hh:mm")
  }).save(

  ).then((res) => {
    return res.mailbox
  }).catch(() => {
    return false
  })
}
/**
 * 查询首页推送
 */
const selectHomePush = async (body) => {
  return HomePushModel.find(
    body.query,
    null,
    body.vernier
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}
/**
 *更新首页推送
 */
const updateHomePush = async (body) => {
  return HomePushModel.updateMany(
    body._id,
    body.content
  ).then((res) => {
    return res
  }).catch(() => {
    return false
  })
}

/**
 * 删除首页推送
 */
const removeHomePush = async (body) => {
  return HomePushModel.deleteMany(
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
  let _timestamp = Date.now()
  let moment = Moment(_timestamp)
  return DataStatisticsModel({
    ...body,
    addTime: _timestamp,
    formatTime: moment.format("YYYY-MM-DD  hh:mm")
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
  addSignUp,
  selectSignUp,
  removeSignUp,
  addAccount,
  selectAccount,
  updateAccount,
  removeAccount,
  addUser,
  selectUser,
  selectUserCount,
  selectUserByState,
  updateUser,
  updateUserContent,
  updateAccountContent,
  removeUser,
  addMessage,
  updateMessage,
  selectMessage,
  removeMessage,
  addGoods,
  selectGoods,
  selectGoodsCount,
  updateGoods,
  removeGoods,
  addTransactions,
  selectTransactions,
  selectTransactionsCount,
  updateTransactions,
  removeTransactions,
  addDataStatistics,
  selectDataStatistics,
  updateDataStatistics,
  removeDataStatistics,
  addHomePush,
  selectHomePush,
  updateHomePush,
  removeHomePush,

}