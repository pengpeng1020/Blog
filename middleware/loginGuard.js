const guard = (req, res, next) => {
    //判断用户访问的是否是登录状态
    //判断用户的登录状态
    //如果用户是登录的 将请求放行
    //如果用户不是登录的 将请求重定向到登录页面
    if (req.url != '/login' && !req.session.username) {
        //如果当前页面不是登录页面 并且 session中也没有username这个属性 说明不是登录状态
        res.redirect('/admin/login');
    } else {
        //如果用户是登录状态 并且是普通用户 则跳转到首页 阻止程序的向下执行
        if (req.session.role == 'normal') {
            return res.redirect('/home/');
        }
        //用户是登录状态 将请求放行
        next();
    }
}

module.exports = guard;