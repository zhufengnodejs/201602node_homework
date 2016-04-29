var express = require('express');
var models = require('../models');
var markdown = require('markdown').markdown;

var router = express.Router();

router.get('/', function (req, res) {

    var keyword = req.query.keyword || '';                    //查询关键字
    var search = req.query.search;                      //时候是通过查询按钮进来的

    var pageNum = parseInt(req.query.pageNum || 1);     //当前页码
    var pageSize = parseInt(req.query.pageSize || 2);   //每页的数据量

    var queryObj = {};
    if(search){                         //如果是查询按钮过来的
        req.session.keyword = search;
        keyword = req.session.keyword || '';
    }

    var reg = new RegExp(keyword,'i');                  //会把undefined转化为 /(?:)/i

    queryObj = {$or:[{title:reg},{content:reg}]};       //查询条件：标题包含或内容包含

    models.Article.find(queryObj).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
       /* articles.forEach(function(article){
            article.content = markdown.toHTML(article.content);
        });*/
        models.Article.count(queryObj,function(err,count){          //获取符合条件的数据条数
            res.render('index',{
                title:'首页',
                articles:articles,
                totalPage:Math.ceil(count/pageSize),
                keyword:keyword,
                pageNum:pageNum,
                pageSize:pageSize
            })
        })
    });
})

module.exports = router;