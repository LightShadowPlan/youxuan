/**
 * Created by qiangxl on 2019/4/23.
 */
  //webSocket
const userState = (bool) => {
    if (sessionStorage.user) {
      let user_id = JSON.parse(sessionStorage.user)._id
      if (window.WebSocket && !window.$.ws) {
        let ws = new WebSocket('ws://localhost:8001');
        window.$.ws = ws
        ws.onopen = function (e) {
          let data = {
            userType: 'user',
            sendType: 'state',
            state: 1,
            user_id: user_id
          }
          ws.send(JSON.stringify(data))
        }
        ws.onclose = function (e) {
          console.log("服务器关闭");
        }
        ws.onerror = function () {
          console.log("连接出错");
        }

        window.onbeforeunload = function () {
          let data = {
            userType: 'user',
            sendType: 'state',
            state: 0,
            user_id: user_id
          }
          ws.send(JSON.stringify(data))
          ws.close();
        }
      } else {
        if (bool) {
          let ws = window.$.ws
          let data = {
            userType: 'user',
            sendType: 'state',
            state: 0,
            user_id: user_id
          }
          ws.send(JSON.stringify(data))
          ws.close();
        }
      }
    }
  }

export default userState