//引入mongoose第三方模块
const mongoose = require('mongoose')
//引入config第三方模块 获取到配置信息
const config = require('config');
console.log(config.get('db.host'));
mongoose.set('useCreateIndex', true);  //解决MongoDB的一个弃用警告
//连接数据库
mongoose.connect(`mongodb://${config.get('db.user')}:${config.get('db.pwd')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.name')}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('数据库连接成功'))
    .catch(() => console.log('数据库连接失败'))

