const http = require('http');
const ws = require("nodejs-websocket");
let wsArray = []

const server2 = ws.createServer(function (conn) {
  conn.on("text", function (code) {
    let data = JSON.parse(code)
    let wsConn = {
      _id: data.user_id,
      conn: conn
    }
    wsArray.push(wsConn)
    if (data.sendType === 'state') {
      //将用户的登录状态改为在线
      conn.sendText('state')
    } else { //发消息
      //记录消息双方id，存入消息
      //实时发送消息
      wsArray.forEach(item => {
        console.log(item._id);
        if (data.touser_id.indexOf(item._id) >= 0) {
          item.conn.sendText(data.content)
          conn.sendText('发送成功')
        } else {
          conn.sendText('用户未在线')
        }
      })
    }

  })
  conn.on("close", function (code, reason) {
    console.log("关闭连接:", code, reason)
  });
  conn.on("error", function (code, reason) {
    console.log("异常关闭")
  });
}).listen(8001);

