/**
 * Created by qiangxl on 2019/3/4.
 */

function trigger(selector1,selector2,className) {
    if (selector1.attr('index') === '1') {
      selector2.removeClass(className)
      selector1.attr('index', '0')
    } else {
      selector2.addClass(className)
      selector1.attr('index', '1')
    }
}
//头部菜单按钮，判断是否隐藏或显示侧边栏
const headerEvent = async () => {
  $(".header-switch-button").on("click",function(){
    trigger($(this),$(".left-sidebar"),"hide-sidebar")
  })
}
//侧边栏子目录显示与隐藏
const sidebarEvent = () => {
  $(".nav-list-little").on("click", function () {
    let that = $(this).parent()
    trigger(that,that,"show-more")
  })
}

export default {
  headerEvent,
  sidebarEvent
}