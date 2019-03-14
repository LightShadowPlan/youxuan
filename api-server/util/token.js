/**
 * Created by qiangxl on 2019/3/11.
 */
const crypto = require('crypto');
//首先引入crypto模块进项目中；

//随手写一段明文字符串，保存到常量secret中。
//我们首先调用crypto模块中的createHmac()方法，通过sha256算法对明文进行哈希化。
//在这段哈希值的基础之上，我们添加明文qixuan。
//content 明文，codeType 编码格式
const hash = (content, codeType) => {
  let secret = 'qixuan';
  let ciphertext = crypto.createHmac('sha256', secret)
    .update(content)
    .digest(codeType);
  return ciphertext

}
//WT标准的Tokens由三部分组成  header payload signature 中间使用 " . " 分隔开，并且都会使用Base64编码方式编码,如下
//eyJhbGc6IkpXVCJ9.eyJpc3MiOiJCIsImVzg5NTU0NDUiLCJuYW1lnVlfQ.SwyHTf8AqKYMAJc

const token = {
  //生成token
  createToken: function (obj, timeout) {
    let obj1 = {
      typ: "JWT",
      alg: "HS256"
    }
    let obj2 = {
      data: obj,
      created: parseInt(Date.now() / 1000),//token生成的时间的，单位秒
      exp: parseInt(timeout) || 1800//token有效期
    };
    //header + payload信息
    let header = Buffer.from(JSON.stringify(obj1), "utf8").toString("base64");
    let payload = Buffer.from(JSON.stringify(obj2), "utf8").toString("base64");
    let signature = hash(payload, 'base64')
    //JWT 的最后一部分是 Signature ，这部分内容有三个部分，先是拼接 Base64 编码的 header.payload
    //再用不可逆的Hamc加密算法加密，加密时使用一个密钥，这个密钥服务端保存，生成signature。
    return header + '.' + payload + "." + signature;
  }
  ,
  //检查token
  decodeToken: function (token) {
    let decArr = token.split(".");
    if (decArr.length <= 2) {
      //token不合法
      return false;
    }
    let payload = {};
    try {
      payload = JSON.parse(Buffer.from(decArr[1], "base64").toString("utf8"));
    } catch (e) {
      return false;
    }

    let checkSignature = hash(decArr[1], 'base64')

    return {
      payload: payload,
      signature: decArr[2],
      checkSignature: checkSignature
    }
  }
  ,
  checkToken: function (token) {
    let resDecode = this.decodeToken(token);
    if (!resDecode) {
      return false;
    }
    //是否过期
    let expState = (parseInt(Date.now() / 1000) - parseInt(resDecode.payload.created)) > parseInt(resDecode.payload.exp) ? false : true;
    //比较传过来的 signature 与 通过传过来的 payload 变成的 signature 进行比较
    if (resDecode.signature === resDecode.checkSignature && expState) {
      //验证完成返回数据
      return resDecode.payload;
    }
    return false;
  }
}
module.exports = {
  hash,
  token
}