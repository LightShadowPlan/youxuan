var express = require('express');
var router = express.Router();
var fileUpload = require('../middlewares/fileUpload')
var position_controller = require('../controllers/position')

// 抽离响应头的设置 中间件
const resApplicationJson = (req, res, next) => {
    res.set('content-type', 'application/json; charset=utf8')
    next()
}
// 为/position中所有的路由都使用这个中间件
router.use(resApplicationJson)

router.post('/addSignUpList', position_controller.addSignUpList)
router.post('/addAccountList', position_controller.addAccountList)
router.post('/selectAccountList', position_controller.selectAccountList)
router.post('/AccountLogin', position_controller.AccountLogin)


module.exports = router; 
