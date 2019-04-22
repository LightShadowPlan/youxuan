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

// 添加物品
const addGoods = () => {
  return new Promise((resolve) => {
    $('#addGoods').ajaxSubmit({
      url: 'http://localhost:3000/api/position/addGoods',
      type: 'post',
      success: (results) => {
        resolve(results)
      }
    })
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



//显示用户出售的物品的信息

export default {
  selectGoods,
  addGoods,
  removeGoods
}


