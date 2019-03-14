#### 路由
* 匹配接口，调用响应函数
#### 控制层
* 引用 数据处理函数(hanledata)，邮箱发送验证码函数(verificationMail),获取验证码函数(verificationCode)
* 引用hash数据加密，token验证

* 添加注册用户 addSignUpList
 * 调用 查询注册用户函数selectAccountList() 查看用户是否已注册
 * 是 则在hanledata()函数中传入201 （返回用户已注册）
 * 否 则在注册邮箱数据库里查询是否有记录
 * 有 removeSignUpList()函数删除原纪录
 * 调用 verificationCode()函数获取一个验证码，与原数据一起存入，调用hanledata()函数处理数据
 * 调用邮箱发送验证码函数(verificationMail)，传入刚才的验证码

* 删除注册用户 removeSignUpList

* 查询注册用户 有回调函数 selectSignUpList

* 添加内部账号 addAccountList
 * 调用 查询内部函数selectAccountList() 再次查看用户是否已注册
 * 是 则在hanledata()函数中传入201
 * 否 调用 查询注册用户函数selectSignUpList() ，将传入的邮箱，验证码与注册用户数据库里的邮箱，验证码相比较是否相同
 * 否 调用hanledata()函数，传入202（返回验证码错误）
 * 先加密密码，再将账号密码存入数据库
 * 移除此账号在注册用户数据库里的记录
 * 调用hanledata()函数处理数据

* 查询内部账号 selectAccountList
 * 有回调函数，执行回调函数，否则调用hanledata()函数处理数据

* 登陆验证 AccountLogin
 * 先加密传入的密码，调用selectAccountList()函数查找（进行邮箱与密码的匹配）
 * 是 则生成一个token加入到数据中，调用hanledata()函数处理数据
 * 否 调用hanledata()函数，传入203（返回账号或密码错误）

 #### 数据层
 * 注册用户数据库
  * mailbox: String
  * verification: String
  * addTime: Date
 * 内部账号数据库
  * mailbox: String
  * assword: String
  * headPortrait: String
  * authority: Number
  * news: Number
  * addTime: Date

 #### 工具
 * email.js 邮箱发送消息
  * verificationMail 函数
  * from：2103875834@qq.com  // 发送者
  * to：传入的邮箱  // 接受者,可以同时发送多个,以逗号隔开
  * subject: 优选商城管理系统账号注册验证 // 标题
  * text: 点击验证 // 文本
  * html: 一个HTML模板
  * attachments: content.attachments//附件

  * sendMail 函数
  * from: "2103875834@qq.com" // 发送者
  * to: 传入的邮箱 // 接受者,可以同时发送多个,以逗号隔开
  * subject: content.title // 标题
  * text: content.text // 文本
  * html: content.html //传入的html
  * attachments: content.attachments//附件

  * verificationCode 函数

* mongoose.js 链接数据库
 * 路径：mongodb://localhost
 * 端口：27017
 * 数据库：youxuan

* index.js 数据处理函数
 * 通过传入的data，处理相应的数据
 > 201 : 用户已存在 返回201
 > 202 : 验证码错误 返回202
 > 203 : 账号或密码错误 返回203
 > true : 成功 返回200
 > false : 失败 返回500

* token.js 加密
 * hash 明文加密
  * secret 明文密钥
  * 加密方式 Hmac sha256

 * token
  *  createToken 生成token token由三部分组成
   * header typ: JWT alg: HS256
   * payload data: 传入的数据 created：token生成时间 exp：token有效期
   * signature hash(payload,'base64') 加密 payload
  * decodeToken 检查 token
   * 分割token为三部分，转换payload为正常类型，加密此payload生成新的signature
   * 检查此token的有效期，检查新的signature与分割的三部分中的signature比较是否相同
   * token有效则返回payload中的数据