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

router.post('/addMessage', position_controller.addMessage)
router.post('/selectMessage', position_controller.selectMessage)
router.post('/removeMessage', position_controller.removeMessage)
router.post('/addGoods', position_controller.addGoods)
router.post('/selectGoods', position_controller.selectGoods)
router.post('/updateGoods', position_controller.updateGoods)
router.post('/removeGoods', position_controller.removeGoods)
router.post('/addTransactions', position_controller.addTransactions)
router.post('/selectTransactions', position_controller.selectTransactions)
router.post('/updateTransactions', position_controller.updateTransactions)
router.post('/removeTransactions', position_controller.removeTransactions)

module.exports = router; 
