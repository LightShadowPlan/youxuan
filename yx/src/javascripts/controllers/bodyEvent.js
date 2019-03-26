/**
 * Created by qiangxl on 2019/3/23.
 */
  const url = () => {
    let url = location.hash.indexOf('?') > 0 ? location.hash.slice(0, location.hash.indexOf('?')) : location.hash
    url = `'${url}'`
    let active = $(`.nva-box a[href=${url}]`)
    $('.nva-box a').removeClass('active')
    active.addClass('active')
  }
  const goGoods = () => {

  }

  const goodsAllSelect = () => {
    $('.search-goods-box').on('click', 'li', function() {
        $(this).addClass('active').siblings().removeClass('active')
    })
  }


  export default {
    url,
    goGoods,
    goodsAllSelect
  }