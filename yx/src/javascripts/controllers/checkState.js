/**
 * Created by qiangxl on 2019/4/13.
 */
import admin_model from '../models/admin'
import {bus, toast} from '../util'

const userState = async () => {
  if ((!sessionStorage.user) && sessionStorage !== '') {
    if (localStorage.userToken && localStorage.userToken !== '') {
      let _userToken = localStorage.userToken
      let body = {'token': _userToken, 'type': 'user'}
      let _result = await admin_model.getByToken(body)
      switch (_result.status) {
        case 200 :
          localStorage.userToken = _result.data.token
          delete _result.data.token
          sessionStorage.user = JSON.stringify(_result.data)
          toast(`欢迎回来，${_result.data.nickname}`);
          return true;
        case 205 :
          toast('Token失效', '请重新登录');
          return false;
        case 500 :
          toast('服务器错误', '请重试');
          return false;
        default :
          toast('未知错误', 'error');
          return false;
      }
    } else {
      return false
    }
  }
}

export default userState