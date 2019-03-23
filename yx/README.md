### webpack配置
* 域名： localhost
* 端口： 9191

### 静态资源

> flexible

> sme-router 路由

> template 模板引擎

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

#### 数据层

#### 视图层
