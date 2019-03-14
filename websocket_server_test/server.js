
const http = require('http');
const ws = require("nodejs-websocket");

var user1 = null,user2 = null , user1Ready = false , user2Ready = false;
/**
 * websocket 测试
 */
let dataArr = {
    user1: [],
    user2: []
}

const server2 = ws.createServer(function(conn){
    console.log(conn);
    conn.on("text", function (str) {
        console.log("收到的信息为:"+str)
        let newStr = JSON.parse(str)
        if(newStr.user==="user1"){
            user1 = conn;
            user1Ready = true;
            conn.sendText(JSON.stringify({type: 'success',value: dataArr.user1}))
        }
        if(newStr.user==="user2"){
            user2 = conn;
            user2Ready = true;
            conn.sendText(JSON.stringify({type: 'success',value: dataArr.user2}))
        }

        if(user1Ready&&user2Ready){
            switch (newStr.touser){
                case 'user1': user1.sendText(JSON.stringify(newStr)); break;
                case 'user2':  user2.sendText(JSON.stringify(newStr)); break;
                default : break;
            }
        } else if(newStr.touser) {
            dataArr[newStr.touser].push(newStr.value)
            console.log(dataArr,'dataArr');
        }

    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8001);

