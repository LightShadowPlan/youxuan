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
router.post('/updateAccount', fileUploadAccount, admin_controller.updateAccount)
router.post('/removeAccount', admin_controller.removeAccount)
router.post('/updateAccountContent', admin_controller.updateAccountContent)
router.post('/loginAccount', admin_controller.loginAccount)
router.post('/changeAccountPassword', admin_controller.changeAccountPassword)
router.post('/addUser', admin_controller.addUser)
router.post('/selectUser', admin_controller.selectUser)
router.post('/selectUserByState', admin_controller.selectUserByState)
router.post('/selectUserCount', admin_controller.selectUserCount)
router.post('/updateUser', fileUploadUser, admin_controller.updateUser)
router.post('/purchaseGoods', admin_controller.purchaseGoods)
router.post('/removeUser', admin_controller.removeUser)
router.post('/updateUserGoods', admin_controller.updateUserGoods)
router.post('/loginUser', admin_controller.loginUser)
router.post('/changeUserPassword', admin_controller.changeUserPassword)
router.post('/getByToken', admin_controller.getByToken)
router.post('/transactionOver', admin_controller.transactionOver)
router.post('/getMessage', admin_controller.getMessage)
router.post('/updateUserState', admin_controller.updateUserState)
router.post('/updateMessage', admin_controller.updateMessage)

module.exports = router;