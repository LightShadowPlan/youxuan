##后台控制

#### 路由
* 在app.js中添加两个路由文件，实现接口的合理划分
  * router/admin.js
  > 实现对帐号的登陆注册以及增删改查的接口
  >> /api/admin/ + 具体接口名

  * router/position
  > 实现对消息，物品，交易等的增删改查的接口
  >> /api/position/ + 具体接口名

#### 跨域
* 设置cors跨域，使用 cors 模块,将前端跨域域名加入白名单

#### 工具
* util/email.js  邮箱发送消息
  * verificationMail 函数
  > 向指定邮箱发送验证码

  * sendMail 函数
  > 向指定邮箱发送邮件
  
  * verificationCode 函数
  > 产生一个六位数的随机验证码

* util/mongoose.js 链接数据库
  > 路径：mongodb://localhost
  
  > 端口：27017
  
  > 数据库：youxuan

* util/index.js 数据处理函数
  * 通过传入的data，处理相应的数据
  > 201 : 用户已存在 返回201
  
  > 202 : 验证码错误 返回202
  
  > 203 : 验证码过期 返回203
  
  > 204 : 账号或密码错误 返回204
  
  > 205 : token失效 返回205
  
  > true : 成功 返回200
  
  > false : 失败 返回500

* token.js 加密
  * hash 明文加密
  > secret 明文密钥
  
  > Hmac sha256 加密方式 

  * token
  >  createToken 生成token token由三部分组成
  >> header typ: JWT alg: HS256
  >> payload data: 传入的数据 created：token生成时间 exp：token有效期
  >> signature hash(payload,'base64') 加密 payload
  
  > decodeToken 检查 token
  >> 分割token为三部分，转换payload为正常类型，加密此payload生成新的signature
  >> 检查此token的有效期，检查新的signature与分割的三部分中的signature比较是否相同
  >> token有效则返回payload中的数据

#### 控制层
##### 帐号的登陆注册以及增删改查
* 引用 数据处理函数(hanledata)，邮箱发送验证码函数(verificationMail),获取验证码函数(verificationCode),hash数据加密，token验证

* 添加注册用户 addSignUpList
  * 判断是哪种账号类型，调用相应的查询函数（selectAccount || selectUser），查看用户是否已注册
  * 账号已注册 则在hanledata()函数中传入201 （返回用户已注册）
  * 否则在注册邮箱数据库里查询是否有记录
  * 有记录 调用 removeSignUpList()函数删除原记录
  * 调用 verificationCode()函数获取一个验证码，与原数据一起存入，调用hanledata()函数处理数据
  * 调用邮箱发送验证码函数(verificationMail)，传入邮箱以及验证码

* 删除注册用户 removeSignUpList

* 查询注册用户 有回调函数 selectSignUpList

* 添加内部账号 addAccountList
  * 调用 查询内部函数selectAccountList() 再次查看账号是否已注册
  * 账号已注册 则在hanledata()函数中传入201
  * 否 调用 查询注册用户函数selectSignUpList() ，将传入的邮箱，验证码与注册用户数据库里的邮箱，验证码相比较是否相同
  * 不相同 则调用hanledata()函数，传入202（返回验证码错误）
  * 先加密密码，再调用 addAccount() 函数将账号密码存入数据库
  * 移除此账号在注册用户数据库里的记录
  * 调用hanledata()函数处理数据

* 查询内部账号 selectAccountList
  * 判断是否有回调函数（callback.name !== 'next'）
  * 有回调函数，执行回调函数，否则调用hanledata()函数处理数据

* 登陆验证 AccountLogin
  * 先加密传入的密码，调用selectAccountList()函数查找（进行邮箱与密码的匹配）
  * 相同 则生成一个token加入到数据中，调用hanledata()函数处理数据
  * 否则 调用hanledata()函数，传入203（返回账号或密码错误）

##### 消息，物品信息，交易增删改查


