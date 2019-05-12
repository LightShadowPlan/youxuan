/**
 * Created by qiangxl on 2019/4/13.
 */
import admin_model from '../models/admin'
import { toast} from '../util'

const checkState = async () => {
  if (localStorage.accountToken) {
    let _accountToken = localStorage.accountToken
    let body = {'token': _accountToken, 'type': 'account'}
    let _result = await admin_model.getByToken(body)
    console.log('result:',_result);
    switch (_result.status) {
      case 200 :
        localStorage.accountToken = _result.data.token
        delete _result.data.token
        sessionStorage.account = JSON.stringify(_result.data)
        toast(`欢迎回来，${_result.data.nickname}`);
        return 200;
      case 205 :
        toast('Token失效，请重新登录', 'error');
        return 205;
      case 206 :
        toast('权限过低，请申请权限', 'error');
        return 206;
      case 500 :
        toast('服务器错误', '请重试');
        return 500;

    }
  } else {
    return false
  }
}

export default checkState