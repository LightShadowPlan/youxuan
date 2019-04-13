

// 提供闲置馆列表数据
const selectGoods = (data) => {
    return $.ajax({
        url: 'http://localhost:3000/api/position/selectGoods',
        type: 'post',
        data,
        success:(results) => {
           return results
        }
    })
}



export default {
    selectGoods,
}


