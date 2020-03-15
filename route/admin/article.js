//将文章集合的构造函数导入到当前文件中
const { Article } = require('../../model/article');

const pagination = require('mongoose-sex-page');
module.exports = async (req, res) => {

    //接收客户端传递过来的页码
    const page = req.query.page;
    //标识  表示当前访问的是文章管理页面
    req.app.locals.currentLink = 'article';
    //查询所有文章数据 多集合联合查询
    //page() 指定当前页
    //size() 指定每页显示的数据条数
    //display() 指定客户端要显示的页码数量
    //exec() 向数据库中发送查询请求
    let articles = await pagination(Article).page(page).size(2).display(3).populate('author').exec();
    // let articles = await Article.find().populate('author');
    // res.send(articles);


    res.render('admin/article.art', {
        articles: articles
    });
}