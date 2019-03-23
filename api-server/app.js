const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser'); // 解析cookie
const logger = require('morgan');

// 路由工具
const indexRouter = require('./routes/index');
const positionRouter = require('./routes/position');
const adminRouter = require('./routes/admin');

// 应用程序
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 使用各种中间件
app.use(logger('dev'));
// body-parser 处理form-data和request payload数据
// express 4.X 内部集成了body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());// 解析cookie
app.use(cors({
    origin:['http://localhost:9000','http://localhost:9191'],
    methods:['GET','POST'],
    optionsSuccessStatus: 200,
    alloweHeaders:['Conten-Type', 'Authorization']
}));

// 启用路由工具
app.use('/', indexRouter);
app.use('/api/position', positionRouter);
app.use('/api/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
