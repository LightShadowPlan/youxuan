//添加首页轮播
const addHomePush = (_index) => {
  return new Promise((resolve) => {
    $(`#swiper-form-${_index}`).ajaxSubmit({
      url: 'http://localhost:3000/api/position/addHomePush',
      type: 'post',
      success: (results) => {
        resolve(results)
      }
    })
  })
}

//更新首页轮播
const updateHomePush = (_index) => {
  return new Promise((resolve) => {
    $(`#swiper-form-${_index}`).ajaxSubmit({
      url: 'http://localhost:3000/api/position/updateHomePush',
      type: 'post',
      success: (results) => {
        resolve(results)
      }
    })
  })
}


//查询首页轮播
const selectHomePush = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/position/selectHomePush',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

//删除首页轮播
const removeHomePush = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/position/removeHomePush',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}
//首页消息推送
const messagePush = () => {
  return new Promise((resolve) => {
    $('#messagePush').ajaxSubmit({
      url: 'http://localhost:3000/api/position/messagePush',
      type: 'post',
      success: (results) => {
        resolve(results)
      }
    })
  })
}

// 搜索物品
const selectGoods = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/position/selectGoods',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

// 搜索物品
const selectGoodsCount = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/position/selectGoodsCount',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}


// 删除物品
const removeGoods = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/position/removeGoods',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

//下架物品
const deleteGoods = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/position/deleteGoods',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

// 搜索交易
const selectTransactions = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/position/selectTransactions',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

// 搜索交易
const selectTransactionsCount = (data) => {
  return $.ajax({
    url: 'http://localhost:3000/api/position/selectTransactionsCount',
    type: 'post',
    data,
    success: (results) => {
      return results
    }
  })
}

export default {
  addHomePush,
  updateHomePush,
  selectHomePush,
  removeHomePush,
  messagePush,
  selectGoods,
  removeGoods,
  deleteGoods,
  selectGoodsCount,
  selectTransactions,
selectTransactionsCount
}


