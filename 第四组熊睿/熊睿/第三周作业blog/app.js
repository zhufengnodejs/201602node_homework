/** -x:导入相应模块*/
var express = require('express');             // -x:引入express模块
var path = require('path');                   // -x:引入path模块，处理路径.join/resolve
var favicon = require('serve-favicon');       // -x:引入serve-favicon模块，处理favicon图标
var logger = require('morgan');               // -x:引入morgan模块，第三方提供，用于日志处理
var cookieParser = require('cookie-parser');  // -x:引入cookie-parser模块，第三方提供，处理cookie
var bodyParser = require('body-parser');      // -x:引入body-parser模块，第三方提供，处理请求体

var session = require('express-session');     // -x:引入express-session模块，处理session
var mongoStore = require('connect-mongo')(session);    // -x:引入connect-mongo模块，连接mongo
var flash = require('connect-flash');         // -x:引入connect-flash模块，用于显示提示一次性提示


/** -x:导入路由*/
var routes = require('./routes/index');       // -x:主页路由
var users = require('./routes/users');        // -x:用户管理路由
var article = require('./routes/article');


/** -x:生成app实例 */
var app = express();
app.set('env', process.env.ENV);     // -x:设置环境变量
var config = require('./config');   // -x:获取配置信息（可以是数据url等信息）

/** -x:设置模板引擎 */
app.set('views', path.join(__dirname, 'views'));  // -x:设置模板存放路径
app.set('view engine', 'ejs');                    // -x:设置模板引擎
// app.set('view engine', 'type')
//app.engine('type',require('ejs').__express)     // -x:设置一type结尾的模板渲染方法,该例子以ejs方式渲染

// 把favicon图标放置在public目录之后取消注释
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));             // -x:日志记录中间件
app.use(bodyParser.json());         // -x：处理JSON请求体
app.use(bodyParser.urlencoded({extended: false}));    // -x:处理查询字符串请求体，并用自带解析器，true时为使用querystring来解析
app.use(cookieParser());            // -x:cookie处理中间件
app.use(flash());                 // -x:处理一次性提示中间件
app.use(session({                   // -x:自定义session处理中间件
    secret: 'blog',
    resave: true,              // -x:每次响应结束后都保存一下session，不管是否改变
    saveUninitialized: true,   // -x:保存新创建但未初始化的session
    store: new mongoStore({    // -x:存储session到数据库
        url: config.dbURL
    })
}));
app.use(function (req, res, next) { // -x:自定义模板数据设计中间件
    res.locals.user = req.session.user;         // -x:res.locals是真正要渲染的模板对象
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    res.locals.keyword = req.session.keyword;
    next();             // -x:继续执行
})
app.use(express.static(path.join(__dirname, 'public')));    // -x:静态文件中间件

/** -x:处理路由 */
app.use('/', routes);              // -x:根目录
app.use('/users', users);          // -x:用户管理
app.use('/article',article);       // -X:文章管理


app.use(function (req, res, next) {     // -x:捕获404错误并转发错误处理中间件
    var err = new Error('Not Found');      // -x:生成错误对象
    err.status = 404;                      // -x:设置错误状态
    next(err);                             // -x:转发下一级处理
});


if (app.get('env') === 'development') {     // -x:开发环境错误处理
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);      // -x:设置状态码，如果没有设置为500
        res.render('error', {               // -x:渲染error页面
            message: err.message,           // -x:错误消息
            error: err                      // -x:错误堆栈，没有next()，终止
        });
    });
}
app.use(function (err, req, res, next) {    // -x:生产环境错误处理
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;                       // -x:对外暴露接口
