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

export default {
  addHomePush,
  updateHomePush,
  selectHomePush,
  removeHomePush
}


