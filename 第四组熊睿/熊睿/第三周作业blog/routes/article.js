var express = require('express');
var models = require('../models');
var auth = require('../middleware/auth');
var multer = require('multer');
var markdown = require('markdown').markdown;


var router = express.Router();          //router是个对象

var storage = multer.diskStorage({          //存储路径
    destination:function(req,file,cb){
        cb(null,'../public/upload');
    },
    filename:function(req,file,cb){        //存储文件名
        cb(null,Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1));  //--image/jpg
    }
});

var upload = multer({storage:storage});

router.use(auth.aferLogin);                 //登录后才能访问

//发表文章导航栏跳转发表页面
router.get('/post',function(req,res,next){
    res.render('article/post',{
        title:'发表文章',
        article:{}                          //发表文章的时候设置article对象为空
    })
});
//发表文章
router.use(upload.single('poster'));                    //poster是文件上传控件的name属性
router.post('/post',function(req,res,next){
    var article = req.body;
    if(article.title == '' || article.content == ''){
        req.flash('error','请完善内容');
        res.redirect('back');
        return;                         //一定要return
    }
    var id = article._id;
    if(id){                //修改
        var updateObj = {title:article.title,content:article.content};
        if(req.file){
            article.poster = '/upload/'+req.file.filename;
        }
        models.Article.update({_id:id},{$set:updateObj},function(err,result){
            if(err){
                req.flash('error','文章更新失败');
                res.redirect('back');
            }else{
                req.flash('success','文章更新成功');
                res.redirect('/');
            }
        })
    }else{                  //添加
        //console.log(req.file);
        if(req.file){    //如果上传了图片
            article.poster = '/upload/'+req.file.filename;
        }
        article.user = req.session.user._id;        //user的_id属性
        models.Article.create(article,function(err,doc){
            if(err){
                req.flash('error','文章发表失败');
                res.redirect('back');
            }else{
                req.flash('success','文章发标成功');
                res.redirect('/');
            }
        })

    }
});

router.get('/detail/:_id',function(req,res){
    var id = req.params._id;
    models.Article.update({_id:id},{$inc:{pv:1}},function(err,result){
        models.Article.findById(id).populate('user').populate('comments.user').exec(function(err,article){
            res.render('article/detail',{
                title:'文章详情',
                article:article
            })
        })
    })
});

router.post('/comment',function(req,res){
    var user = req.session.user;
    models.Article.update({_id:req.body._id},{$push:{comments:{user:user._id,content:req.body.content}}},function(err,result){
        if(err){
            req.flash('error','评论出错');
            return res.redirect('back');
        }else{
            req.flash('success','评论成功');
            res.redirect('back');
        }
    })
});

router.get('/delete/:_id',function(req,res){
    var id = req.params._id;
    models.Article.remove({_id:id},function(err,result){
        if(err){
            req.flash('error','删除失败');
            res.redirect('back');
        }else{
            req.flash('success','删除成功');
            res.redirect('/');
        }
    })
});

router.get('/edit/:_id',function(req,res){
    var id = req.params._id;
    models.Article.findById(id,function(err,article){
        res.render('article/post',{
            title:'修改文章',
            article:article
        })
    })
})


module.exports = router;