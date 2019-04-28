/**
 * Created by qiangxl on 2019/3/16.
 */
const url = require('url')
const {handleData, sendMail, verificationMail, verificationCode} = require('../util')
const position = require('../models/position')
const admin = require('./admin')
const {token} = require('../util/token')
const fs = require('fs')
const Path = require('path')

/**
 *商城首页显示
 */
const homeShow = async (req, res) => {
  let skip = 0, limit = 16, state = {$in: [0]}
  let goodsArray = ["book", "dailyNecessities", "ball", "phone"]
  let body = {
    query: {goodsClass: {$in: goodsArray}, state: state},
    vernier: {skip: skip, limit: limit}
  }
  let _body = {
    query: {},
    vernier: {}
  }
  let data = {}
  let goods_data = await position.selectGoods(body)
  let home_data = await position.selectHomePush(_body)
  data = {
    goodsArray: goods_data,
    homeArray: home_data
  }
  handleData(data, res, 'position')
}


/**
 * 添加物品
 */
const addGoods = async (req, res) => {
  let user_id = req.body._id
  let user_data = await position.selectUser({_id: user_id})
  let state = user_data ? user_data[0].state : false
  let _token = await token.checkToken(req.body.userToken, state)
  console.log('req.body:', req.body);
  let seller = {
    _id: user_data[0]._id,
    gender: user_data[0].gender,
    nickname: user_data[0].nickname,
    headPortrait: user_data[0].headPortrait
  }
  console.log('seller:', seller);
  delete req.body._id
  delete req.body.userToken
  delete req.body.nickname
  delete req.body.headPortrait
  req.body.seller = seller
  if (_token) {
    let _data = await position.addGoods(req.body) || []
    if (_data) {
      let body = {
        _id: _token.data._id,
        content: {'$addToSet': {'sellGoods': _data._id}}
      }
      await position.updateUserContent(body)
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
  req.body.query = JSON.parse(req.body.query)
  req.body.vernier = JSON.parse(req.body.vernier)
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
  let body = {
    _id: {_id: {$in: [req.body._id]}},
    content: JSON.parse(req.body.content)
  }
  let _data = await position.updateGoods(body)
  let _body = {
    query: {_id: req.body._id},
    vernier: {}
  }
  let goods_data = await position.selectGoods(_body)
  console.log(_data);
  handleData(goods_data, res, 'position')
}

/**
 * 删除物品
 */
const removeGoods = async (req, res) => {
  let goodsArray = JSON.parse(req.body.goodsArray)//要删的
  let newSellGoods = JSON.parse(req.body.newSellGoods)//剩下的
  let transactionArray = JSON.parse(req.body.transactionArray)
  //判断删除操作由用户还是管理员触发
  if (req.body.accountToken) {
    let account_id = req.body._id
    let authority = await admin.powerChecked(req.accountToken, account_id)
    //判断权限
    if (authority <= 0) {
      handleData(205, res, 'position')
    } else if (authority === 1) {
      handleData(206, res, 'position')
    } else {

    }
  } else {
    let user_id = req.body._id
    let user_data = await position.selectUser({_id: user_id})
    let state = user_data ? user_data[0].state : false
    let _token = await token.checkToken(req.body.userToken, state)
    delete req.body.userToken
    if (_token) {
      //判断物品状态
      //未交易
      if (~~req.body.state === 0) {
        let body = {
          _id: user_id,
          content: {'sellGoods': newSellGoods}
        }
        //删除用户记录此物品的记录
        let delete_data = await position.updateUserContent(body)
        console.log(delete_data);
        //删除图片
        deletePhoto(goodsArray)
        //删除物品记录
        await position.removeGoods({'goodsArray': goodsArray})
        //查询用户数据
        let user_data = await position.selectUser({_id: user_id})
        handleData(user_data, res, 'position')
      } else if (~~req.body.state === 1) {  //交易中
        //将物品状态改为待出售 0
        let body = {
          _id: {_id: {$in: goodsArray}},
          content: {
            state: 0,
            purchaser: {}
          }
        }
        await position.updateGoods(body)

        //更改交易记录
        let transaction_data = await position.selectTransactions({_id: {$in: transactionArray}})
        transaction_data.forEach(async item => {
          //删除购买者购买记录
          let user_data = await position.selectUser({_id: item.purchaser})
          let newPurchaserGoods = []
          user_data[0].purchaserGoods.forEach(userItem => {
            if (item.goodsId !== userItem) {
              newPurchaserGoods.push(userItem)
            }
          })
          //向交易双方发送信息或邮件
          let message1_body = {
            sender: '商城系统',
            receiver: item.seller,
            content: '尊敬的用户，您所出售的部分物品已取消交易，所带来不便，希望谅解或反馈问题。'
          }
          let message2_body = {
            sender: '商城系统',
            receiver: item.purchaser,
            content: '尊敬的用户，您所购买的部分物品已取消交易，所带来不便，希望谅解或反馈问题。'
          }
          let message1_data = await position.addMessage(message1_body)
          let message2_data = await position.addMessage(message2_body)

          let body1 = {
            _id: item.seller,
            content: {$addToSet: {message: message1_data}}
          }
          let body2 = {
            _id: item.purchaser,
            content: {purchaserGoods: newPurchaserGoods, $addToSet: {message: message2_data}}
          }
          await position.updateUserContent(body1)
          await position.updateUserContent(body2)
        })
        //更新交易记录
        let _body = {
          query: {_id: {$in: transactionArray}},
          content: {state: 0}
        }
        await position.updateTransactions(_body)
        //返回用户信息
        let user_data = await position.selectUser({_id: user_id})
        handleData(user_data, res, 'position')

      }
    } else {
      handleData(205, res, 'position')
    }
  }
}
//删除物品图片

const deletePhoto = async (photoArray) => {
  let body = {
    query: {_id: {$in: photoArray}},
    vernier: {}
  }
  let _data = await position.selectGoods(body)
  _data.forEach(item => {
    let photoArray = item.goodsPhoto
    photoArray.forEach(item => {
      fs.unlink(Path.resolve(__dirname, '../../yx/' + item), (err) => {
      })
    })
  })
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

//系统首页添加轮播
const addHomePush = async (req, res) => {
  console.log('req.body:', req.body);
  let _data = await position.addHomePush(req.body)
  handleData(_data, res, 'position')
}

//系统首页更新轮播
const updateHomePush = async (req, res) => {
  console.log(req.body);
  let accountToken = req.body.accountToken
  let oldHomePhoto = req.body.oldHomePhoto

  let body = {
    _id: {_id: req.body._id},
    content: {
      content: req.body.content,
      url: req.body.url,
      homePhoto: req.body.homePhoto
    }
  }
  if ( !req.body.homePhoto || req.body.homePhoto === ('' || null)) {
    console.log('ok');
    delete body.content.homePhoto
  } else {
    fs.unlink(Path.resolve(__dirname, '../../fe/' + oldHomePhoto), (err) => {})
  }
  let _data = await position.updateHomePush(body)
  console.log(_data);
  handleData(_data, res, 'position')
}
//系统首页查询轮播
const selectHomePush = async (req, res) => {
  let body = {
    query: {},
    vernier: {}
  }
  let _data = await position.selectHomePush(body)
  handleData(_data, res, 'position')
}
//系统首页删除轮播
const removeHomePush = async (req, res) => {
  console.log('req.body:', req.body);
  let accountToken = req.body.accountToken
  delete accountToken
  let _data = await position.removeHomePush({_id: req.body._id})
  fs.unlink(Path.resolve(__dirname, '../../fe/' + req.body.oldHomePhoto), (err) => {})
  handleData(_data, res, 'position')
}


module.exports = {
  addGoods,
  selectGoods,
  updateGoods,
  removeGoods,
  addTransactions,
  selectTransactions,
  updateTransactions,
  removeTransactions,
  homeShow,
  addHomePush,
  updateHomePush,
  selectHomePush,
  removeHomePush,
}