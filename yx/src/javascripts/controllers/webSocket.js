/**
 * Created by qiangxl on 2019/4/23.
 */
  //webSocket
const userState = (user_id) => {
    if (window.WebSocket) {
      let ws = new WebSocket('ws://localhost:8001');
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
    }

  }

export default userState