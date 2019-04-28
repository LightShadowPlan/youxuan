// 这个中间件的任务：1. 接收图片，保存图片 2. 将图片的路径交给下一个中间件 注意：如果用户上传的不是图片，需要拦截

var PATH = require('path')
var multer = require('multer')

function filehandle(req, res, next, name, filename, url, type) {
  let photoArray = []
  // 控制文件存储位置和名字
  let storage = multer.diskStorage({
    // 存储位置
    destination: function (req, file, cb) {
      cb(null, PATH.resolve(__dirname, '../../'+ filename +'/static/image/' + url))
    },
    // 文件名字
    filename: function (req, file, cb) {
      let _originalName = file.originalname // 原名
      let _extName = PATH.extname(_originalName); // 后缀名
      let _baseName = PATH.basename(_originalName, _extName); // 文件名
      let _filename = _baseName + '_' + Date.now() + _extName // 最终的名字，拼上时间戳，防止覆盖
      // 将图片的路径放入到req.body中的，下个中间件就可以取用了
      if(type === 'single') {
        req.body[name] = 'static/image/' + url + _filename
      } else{
        photoArray.push('static/image/' + url + _filename)
        req.body[name] = photoArray
      }
      cb(null, _filename)
    }
  })

  // 过滤文件类型
  function fileFilter(req, file, cb) {
    let _flag = file.mimetype.startsWith('image')
    cb(_flag ? null : new Error('请上传正确格式的图片'), _flag)
  }
  let upload
  if(type === 'single') {
    upload = multer({storage, fileFilter}).single(name)
  } else{
    upload = multer({storage, fileFilter}).array(name, 3)
  }

  upload(req, res, function (err) {
    if (err) {
      res.render('position', {
        code: 501,
        data: JSON.stringify({msg: '请上传正确格式的图片'})
      })
    } else {
      // 一切都好
      next()
    }
  })
}

// 在upload中间件外面套上一个空壳中间件，目的是为了让upload处理错误后选择是否继续向下执行
const fileUploadUser = function (req, res, next) {
  filehandle(req, res, next, 'headPortrait', 'yx','user/', 'single')
}

const fileUploadAccount = function (req, res, next) {
  filehandle(req, res, next, 'headPortrait', 'fe','account/','single')
}

const fileUploadAddGoods = function (req, res, next) {
  filehandle(req, res, next, 'goodsPhoto', 'yx','goods/','array')
}

const fileUploadHomePush = function (req, res, next) {
  filehandle(req, res, next, 'homePhoto', 'fe','swiper/','single')
}

module.exports = {
  fileUploadUser,
  fileUploadAccount,
  fileUploadAddGoods,
  fileUploadHomePush
}