//引用express框架
const express = require('express');
//引用path模块
const path = require('path');
//引入express-session模块
const session = require('express-session');
//导入art-template模板引擎
const template = require('art-template');
//导入dateformate第三方模块
const dateFormat = require('dateformat');
//导入morgan第三方模块
const morgan = require('morgan');

const config = require('config');

//创建网站服务器
const app = express();
//引入body-parser模块 用来处理post请求参数
const bodyParser = require('body-parser');

//数据库连接
require('./model/connect.js');

// require('./model/user.js');

//处理post请求参数
app.use(bodyParser.urlencoded({ extended: false }));
//配置session 当用户没登录时 不保存cookie
app.use(session({
    secret: 'secret key',
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000    //设置cookie的过期时间 为24小时 默认单位为毫秒
    }

}));


//告诉express框架模板所在的位置
app.set('views', path.join(__dirname, 'views'));
//告诉express框架模板的默认后缀是什么
app.set('view engine', 'art');
//当渲染后缀为art的模板时 所使用的模板引擎是什么
app.engine('art', require('express-art-template'));

//向模板内部导入dateFormate变量
template.defaults.imports.dateFormat = dateFormat;

//开放静态资源文件
app.use(express.static(path.join(__dirname, 'public')))
//
console.log(config.get('title'));


//获取系统环境变量 返回值是对象
if (process.env.NODE_ENV == 'development') {
    //当前是开发环境
    console.log('当前是开发环境');
    //在开发环境中 将客户端发送到服务器端的请求信息打印到控制台中
    app.use(morgan('dev'));
} else {
    //当前是生产环境
    console.log('当前是生产环境');

}

const home = require('./route/home');
const admin = require('./route/admin');

//拦截请求 判断用户登录状态
app.use('/admin', require('./middleware/loginGuard'))



//为路由匹配请求路径
app.use('/home', home);
app.use('/admin', admin);

app.use((err, req, res, next) => {
    //next()里的参数就是err 
    //将字符串类型转换为对象类型
    //JSON.parse()
    
    const result = JSON.parse(err);
    //重定向 并传递错误信息
    //{path: '/admin/user-edit', message: '密码比对失败，不能进行用户信息的修改', id: id};

    let params = [];
    for (let attr in result) {
        if (attr != 'path') {
            params.push(attr + '=' + result[attr]);
            
        }
    }
    res.redirect(`${result.path}?${params.join('&')}`);
})


//监听端口
app.listen(80);
console.log('服务器启动完成，请访问localhost');
