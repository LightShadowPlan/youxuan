

// 提供音乐列表数据
const musicList = (data) => {
    return $.ajax({
        url: 'http://lightshadow.xyz:3000/api/v1/position/musicList',
        type: 'get',
        data,
        success:(results) => {
           return results
        }
    })
}

// 提供保存音乐数据
const addMusic = () => {
    return new Promise((resolve) => {
        $('#addMusic').ajaxSubmit({
            url: 'http://lightshadow.xyz:3000/api/v1/position/addMusic',
            type: 'POST',
            success: (results) => {
                resolve(results)
            }
        })
    })
}

// 删除音乐
const removeMusic = (data) => {
    return $.ajax({
        url: 'http://lightshadow.xyz:3000/api/v1/position/removeMusic',
        type: 'post',
        data,
        success:(results) => {
           return results
        }
    })
}

// 提供某条数据
const listone = (data) => {
    return $.ajax({
        url: 'http://lightshadow.xyz:3000/api/v1/position/listone',
        data,
        success:(results) => {
           return results
        }
    })
}
// 提供所有数据总计
const listall = (data) => {
    return $.ajax({
        url: 'http://lightshadow.xyz:3000/api/v1/position/listall',
        data,
        success:(results) => {
            return results
        }
    })
}


// 编辑更新音乐数据
const updateMusic = (data) => {
    return new Promise((resolve) => {
        $('#addMusic').ajaxSubmit({
            url: 'http://lightshadow.xyz:3000/api/v1/position/updateMusic',
            type: 'POST',
            success: (results) => {
                resolve(results)
            }
        })
    })
}

export default {
    musicList,
    addMusic,
    removeMusic,
    listone,
    listall,
    updateMusic
}


