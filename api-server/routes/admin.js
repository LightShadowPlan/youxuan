/**
 * Created by qiangxl on 2019/3/16.
 */
var express = require('express');
var router = express.Router();
var { fileUploadUser, fileUploadAccount, test } = require('../middlewares/fileUpload')
var admin_controller = require('../controllers/admin')

// 抽离响应头的设置 中间件
const resApplicationJson = (req, res, next) => {
    res.set('content-type', 'application/json; charset=utf8')
    next()
}
// 为/position中所有的路由都使用这个中间件
router.use(resApplicationJson)

router.post('/addSignUp', admin_controller.addSignUp)
router.post('/addAccount', admin_controller.addAccount)
router.post('/selectAccount', admin_controller.selectAccount)
router.post('/updateAccount', admin_controller.updateAccount)
router.post('/removeAccount', admin_controller.removeAccount)
router.post('/loginAccount', admin_controller.loginAccount)
router.post('/addUser', admin_controller.addUser)
router.post('/selectUser', admin_controller.selectUser)
router.post('/updateUser', fileUploadUser, admin_controller.updateUser)
router.post('/removeUser', admin_controller.removeUser)
router.post('/loginUser', admin_controller.loginUser)
router.post('/changeUserPassword', admin_controller.changeUserPassword)
router.post('/getByToken', admin_controller.getByToken)

module.exports = router;