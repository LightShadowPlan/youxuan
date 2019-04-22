
const http = require('http');
const ws = require("nodejs-websocket");

const server2 = ws.createServer(function(conn){
    conn.on('connect', function(code) {
        console.log('开启连接', code)
      })
    conn.on("text", function (code) {
        console.log("收到的信息为:"+code)
        conn.sendText('success')
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8001);

