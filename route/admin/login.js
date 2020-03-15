//导入用户集合构造函数
const { User } = require('../../model/user');
//导入bcryptjs
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    //接收请求参数 
    //接下来进行请求参数的二次验证 因为客户端的验证并不安全 某些客户端可能禁用JavaScript某些功能
    const { email, password } = req.body;
    // console.log({email, password});
    
    //如果用户没有输入邮件地址
    if (email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).render('admin/error', { msg: '请输入邮箱地址或者密码' });
    }
    //根据邮箱地址查询用户信息
    //如果查询到了用户user变量的值是对象类型 对象中存储的是用户信息
    //如果没有查询到用户 user变量为空
    let user = await User.findOne({ email });
    if (user) {
        //将客户端传递过来的密码和用户信息中的密码进行比对
        //true 比对成功  false 比对失败
        let isValue = await bcrypt.compare(password, user.password);
        if (isValue) {
            //登录成功
            // res.send('登录成功')
            //将用户名存储在请求对象中
            //将用户角色存储在session对象中
            req.session.role = user.role;
            // res.send('登录成功');
            //重定向到用户列表页面
            req.app.locals.userInfo = user;  //将查询到的user放在公共locals中的userInfo中供使用
            //对用户的角色进行判断
            if (user.role == 'admin') {
                //重定向到用户列表页面
                 res.redirect('/admin/user');
            } else {
                //重定向回博客首页
                res.redirect('/home/')
            }


           
        } else {
            //登录失败
            res.status(400).render('admin/error', { msg: '邮箱地址或者密码错误' })
        }
    } else {
        //如果没有查询到用户
        res.status(400).render('admin/error', { msg: '没有查询到该用户' });
    }
}

