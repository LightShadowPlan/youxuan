### webpack配置
* 域名： localhost
* 端口： 9000
* 跨域代理：http://localhost:3000

### 静态资源
* 字体：6种
* 图标：fontawesome 4.7.0
* 图片：背景图
* javascript：
> jquery.form.mini/jquery.min
> sme-router 路由
> template 模板引擎
* stylesheet: app.css 全局css样式

### src目录
* index.html 主页
* app.scss 全局样式
* app.js 引入路由，引入头部与侧边栏及其事件，启动路由

#### 自定义工具
* bus
> 利用events模块创建可以定义事件和触发事件的bus对象，用来实现多模块件的通信 （观察者模式）
* toast
> 消息弹出框口 设置弹窗文字，类型，时间

#### router 路由
* 通过hash值进行匹配，为空重定向到login，匹配不到重定向到404
* 在控制器中无法使用到router，所以给bus绑定事件，在其他模块中触发bus的事件

#### 控制层
* admin 登陆页面事件
 * 注册页面 / 获取验证码
 * 点击获取按钮，检查邮箱格式，记录当前时间，发送请求，设置定时器60秒后才能再次发送请求
 * 接口函数 admin_model.addSignUpList(body)
 * 收到数据，检查返回值
 > 500 ： 失败
 > 201 ： 用户已存在
 > 200（默认）：成功
 * 通知前往浏览器获取验证码
 *
 * 注册页面 / 注册
 * 表单提交，阻止浏览器默认事件，进行邮箱，验证码，密码格式验证
 * 接口函数 admin_model.addAccountList(qs.parse(_params))
 * 检查返回值
 > 500 ： 失败
 > 201 ： 用户已存在
 > 202 ： 验证码错误
 > 200（默认）：成功
 *
 * 登陆页面
 *  检查邮箱密码格式，发送请求
 * 接口函数 admin_model.AccountLogin(qs.parse(_params))
 * 检查返回值
 > 500 ： 失败
 > 203 ： 账号或密码错误
 > 200（默认）： 成功
 * 将返回的token存入localStorage , 跳转首页

* bodyEvent 主页事件
 * 侧边栏隐藏与出现
 * 侧边栏子页面隐藏与出现

* position 视图控制器
 * 路由匹配之后，加载当前页面，加载当前页面事件

#### 数据层
* admin 登陆数据接口
 * 注册账号（邮箱验证） 函数名：addSignUpList 路径：/api/v1/position/addSignUpList 方式：post
 * 注册内部账号 函数名：addAccountList 路径：/api/v1/position/addAccountList 方式：post
 * 查询内部账号 函数名：AccountLogin 路径：/api/v1/position/AccountLogin 方式：post
* position 各页面接口

#### 视图层
* 404
* header 头部 显示时间与通知
* left-sideabr 侧边栏 各种功能显示
* login 登录，注册
 * filter 背景层 注册时背景虚化
 * 登录页面
 * 注册页面
* home 主页
