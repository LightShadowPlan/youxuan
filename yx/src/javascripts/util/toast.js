//text 提示文字
//options 提示类型 成功/success， 失败/error 默认成功
//time 窗口停留时间 单位秒 默认1秒
const toast = (text, options = 'success', time = 1000) => {
    $('.toast-top').text(text)
    $('.toast-top').addClass(options)
    setTimeout(function(){
      $('.toast-top').removeClass(options)
    },time)
}

export default toast