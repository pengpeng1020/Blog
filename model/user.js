//引入mongoose第三方模块
const mongoose = require('mongoose');

//导入bcryptjs
const bcrypt = require('bcryptjs');

//引入joi模块
const Joi = require('joi');

//创建用户集合规则
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        unique: true,   //数据库中的唯一性 保证邮箱地址不重复
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // admin 超级管理员  normal 普通用户
    role: {
        type: String,
        required: true
    },
    state: {
        type: Number,
        //如果状态为0就是启用状态 如果状态为1就是禁用状态
        default: 0
    }
})

// 使用规则创建集合
const User = mongoose.model('User', userSchema);
// User.create({
//     username: 'pengpeng',
//     email: 'pengpeng@qq.com',
//     password: '987654',
//     role: 'admin',
//     state: 0
// }).then(() => {
//     console.log('用户创建成功')
// }).catch(() => {
//     console.log('用户创建失败')
// })

async function createUser() {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash('123456', salt);
    // console.log(pass);

    //初始化用户
    const user = await User.create({
        username: 'pengpeng',
        email: 'aishen@qq.com',
        password: pass,
        role: 'admin',
        state: 0
    });
}
// createUser();

//CSDN中对bcrypt的解决办法 https://blog.csdn.net/weixin_41258179/article/details/97013953
// bcrypt.genSalt(10, function (err, salt) {
//     bcrypt.hash('123456', salt, function (err, hash) {
//         User.create({
//             username: 'pengpeng',
//             email: 'pengpeng@njust.edu.cn',
//             password: hash,
//             role: 'admin',
//             state: 0
//         }).then(() => {
//             console.log('用户创建成功')
//         }).catch(() => {
//             console.log('用户创建失败')
//         })
//     })
// })

//验证用户信息
const validateUser = (user) => {
    //定义对象的验证规则
    const schema = {
        username: Joi.string().min(2).max(12).required().error(new Error('用户名不符合验证规则')),
        email: Joi.string().email().required().error(new Error('邮箱格式不符合要求')),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('密码格式不符合要求')),
        role: Joi.string().valid('normal', 'admin').required().error(new Error('角色值不符合规范')),
        state: Joi.number().valid(0, 1).error(new Error('状态值不符合规范'))
    };
    //实施验证
    return Joi.validate(user, schema);
}

//将用户集合作为模块成员进行导出
module.exports = {
    User,
    validateUser
}