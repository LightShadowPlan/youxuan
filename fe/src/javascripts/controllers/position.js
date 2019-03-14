import {bus, toast} from '../util'

// 首页视图
import home_template from '../views/home.html'
// 登陆视图
import login_template from '../views/login.html'
// 404视图
import fzf_template from '../views/404.html'

// model
import position_model from '../models/position'

//解析路径
import qs from 'querystring'

//加载事件
//登录，注册
import adminEvent from './admin'

// 首页视图的控制器
const home = async (req, res, next) => {

  res.render(home_template)
  bindHomeEvent()// 给添加按钮绑定事件
}
const bindHomeEvent = async () => {
  $("body").removeClass("large")
  toast('加载完成')
  // let query = {}
  // let _res = await position_model.listall()
  // $('.musicAll').html(_res.data)
}
// 登陆视图的控制器
const login = async (req, res, next) => {

  res.render(login_template)
  adminEvent.loginEvent()
}


// 404视图的控制器
const fzf = async (req, res, next) => {

  res.render(fzf_template)
  bindFzfEvent()// 给添加按钮绑定事件
}
const bindFzfEvent = async () => {
  $("body").addClass("large")
}



// //个人信息的控制器
// const personal_center = async (req, res, next) => {
//     let username = localStorage.username
//     let _res = await admin.queryAccount({username: username})
//     let music_html = template.render(position_personal_template,{
//         data: _res.data[0]
//     })
//     res.render(music_html)
//     lookPic($('#picture'))
//
//     bindPersonalEvent()// 给添加按钮绑定事件
// }
// const bindPersonalEvent = async () => {
//     $('#Account_center').submit(async function (e) {
//         e.preventDefault()
//         let _result = await admin.saveAccount()
//         alertSomeThing(_result.status === 200,'保存成功','保存失败',()=>{})
//
//     })
//     $('.goBackHome').on('click',function(){
//         bus.emit('go','/home')
//     })
// }
//
// //列表视图排序选择
// let selectFlag = true
// function isSelect(options,bool){
//     if(selectFlag){
//         $('.sort').addClass('toup')
//         selectFlag = false
//     } else{
//         bool ? $('.sort-selected span').html(options.html()) : ''
//         $('.sort').removeClass('toup')
//         selectFlag = true
//     }
// }
//
// //音乐列表视图的控制器
// //控制页数
// const music =  async  (req, res, naex) => {
//     let pages = req.query || {pages: '1', sort: 'createTime',search: ''};  //取出当前页码
//     let query = {}
//     query.pages = pages.pages
//     query.sort =  pages.sort  //排序条件
//     query.search =  pages.search  //排序条件
//     let _res = (await position_model.musicList(query)).data
//
//     let _count = _res.count
//     _res.count = Math.ceil(_count / 10)
//
//     let music_html = template.render(position_music_template,{
//         data: _res
//     })
//     res.render(music_html)
//     $('.musicList li').eq(~~pages.pages).addClass('thisPages')
//     bindMusicEvent(pages,_res.count,_count)  //当前页码，所有页，所有数据条数
// }
// const bindMusicEvent =  (pages,count,_count) => {
//     let _page = ~~pages.pages
//     let _sort = pages.sort
//     let sortHtml = $('.sort-list li').filter(function(index){
//         return $(this).attr('data-sort') === _sort
//     }).html()
//     $('.sort-selected span').html(sortHtml)
//
//     $('#musicSearch').val(pages.search).focus()
//     $('.sort-selected').on('click',function(){
//         isSelect($(this),false)
//     })
//     $('.sort-list li').on('click',function(){
//         isSelect($(this),true)
//         let _sort = $(this).attr('data-sort')
//         bus.emit('go','/music?pages='+_page+'&sort='+_sort)
//     })
//     $('.addMusic').on('click',function(){
//         bus.emit('go','/addMusic')
//     })
//     //搜索
//     $('#musicSearch').on('keyup',function(event){
//         if(event.keyCode === 13){
//             searchMusic($(this).val())
//         }
//     })
//     $('.musicSearchBtn').on('click',function(){
//         searchMusic($('#musicSearch').val())
//     })
//     $('.updateMusic').on('click',function(){
//         let musicListId = { _id: $(this).parent().attr('data-id') };
//         bus.emit('go','/updateMusic?_id=' + musicListId._id)
//     })
//     $('.removeMusic').one('click', async function(){
//         let musicListId = { _id: $(this).parent().attr('data-id') };
//         let _res = await position_model.removeMusic(musicListId)
//         alertSomeThing(_res.data._id,'删除成功','删除失败',function(){
//             //前面有page检查,所以加上page，id的唯一性让URL不会重复
//             bus.emit('go','/music?pages='+ (_count%10===1 ? (_page-1>0 ? _page-1 : _page) : _page) +'&_id='+ _res.data._id)
//         })
//     })
//     $('.musicList li').on('click',function(){
//         if($(this).attr('class') === 'prePage'){
//             bus.emit( 'go','/music?pages='+ (_page-1>0 ? _page-1 : _page) )
//         } else if($(this).attr('class') === 'nextPage'){
//             bus.emit( 'go','/music?pages='+ (_page+1<=count ? _page+1 : count) )
//         } else{
//             bus.emit( 'go','/music?pages='+ $(this).html() )
//         }
//     })
//     function searchMusic(keywords){
//         bus.emit('go','/music?pages='+_page+'&sort='+_sort+'&search='+(keywords?keywords:''))
//     }
// }
// //添加音乐
// const addMusic = async (req, res, naex) => {
//     res.render(position_addMusic_template)
//     bindAddMusicEvent()
// }
// const bindAddMusicEvent = (req, res, naex) => {
//     $('#addMusic').on('submit',async function(e){
//         e.preventDefault()
//         let _params = $('#addMusic').serialize()
//         let _result = await position_model.addMusic(qs.parse(_params))
//         let _res = _result.data
//         alertSomeThing(_res.createTime,'添加成功','添加失败',()=>{})
//     })
//     $('.goBackMusic').on('click',function(){
//         bus.emit('go','/music')
//     })
//
//     //图片预览
//     lookPic($('#doc-form-file'))
// }
// //编辑音乐
// const updateMusic = async (req, res, naex) => {
//     let musicListId = req.query
//     let _res = await position_model.listone(musicListId)
//     _res.data._id = musicListId._id
//     let music_html = template.render(position_updateMusic_template,{
//         data: _res.data
//     })
//     res.render(music_html)
//     bindUpdateMusic(musicListId)
// }
// const bindUpdateMusic = (musicListId) => {
//     $('#addMusic').on('submit',async function(e){
//         e.preventDefault()
//         let _result = await position_model.updateMusic()
//         let _res = _result.data
//         alertSomeThing(_res.n,'编辑成功','编辑失败',()=>{})
//     })
//     $('.goBackMusic').on('click',function(){
//         bus.emit('go','/music')
//     })
//     lookPic($('#doc-form-file'))
// }
//
// //歌单列表视图的控制器
// const music_menu = async (req, res, naex) => {
//     res.render(position_music_menu_template)
//     bindMusicMenuEvent()
// }
// const bindMusicMenuEvent = () => {
//     $('.sort-selected').on('click',function(){
//         isSelect($(this))
//     })
//
// }
//
//
//
// //图片预览
// function lookPic(options){
//     let File = function(){
//         let file = {};
//         file.previewImage = function(file){
//             let div = file.parentNode.children[0];
//             if (file.files && file.files[0])
//             {
//                 let img = div.children[0];
//                 let reader = new FileReader();
//                 reader.onload = function(evt){img.src = evt.target.result;}
//                 reader.readAsDataURL(file.files[0]);
//             }
//         }
//         return file;
//     }();
//     function initActions() {
//         options.on('change', function() {
//             File.previewImage(options[0]);
//         });
//     }
//     initActions()
// }


export default {
  home,
  login,
  fzf,
  // music,
  // addMusic,
  // updateMusic,
}