/**
 * Created by qiangxl on 2019/4/23.
 */

const admin = require('./admin')
const position = require('./position')
const ws = require("nodejs-websocket");
var wsArray = []

const webSocket = async () => {
  let server2 = ws.createServer(function (conn) {
    conn.on("text", async function (code) {
      let data = JSON.parse(code)

      //将用户的登录状态改为在线
      if (~~data.state === 1) {

        if (data.userType === 'user') {
          let wsConn = {
            _id: data.user_id,
            conn: conn
          }
          wsArray.push(wsConn)
          conn.sendText('state: 1')
          await admin.userState(data.user_id, 1)
        } else {
          let wsConn = {
            _id: data.account_id,
            conn: conn
          }
          wsArray.push(wsConn)
          conn.sendText('state: 1')
          await admin.accountState(data.account_id, 1)
        }

      } else {
        if (data.userType === 'user') {
          wsArray.forEach(async (item, index) => {
            if (item._id === data.user_id) {
              wsArray.splice(index, 1)
              await admin.userState(data.user_id, 0)
            }
          })
        } else{
          wsArray.forEach(async (item, index) => {
            if (item._id === data.account_id) {
              wsArray.splice(index, 1)
              await admin.accountState(data.account_id, 0)
            }
          })
        }

      }

    })
    conn.on("close", async function (code, reason) {
      console.log("关闭连接:", code, reason)
    });
    conn.on("error", function (code, reason) {
      console.log("异常关闭")
    });
  }).listen(8001);
}

module.exports = webSocket;