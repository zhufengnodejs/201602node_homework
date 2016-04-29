var express = require('express');
var util = require('../util');
var models = require('../models');                 //数据模型模块
var auth = require('../middleware/auth');         //导入权限认证

var router = express.Router();                    //路由实例

//router.use(auth.beforeLogin); //--到退出的时候会被拦截
//点击首页登录链接跳转到登录界面
router.get('/login', auth.beforeLogin, function (req, res, next) {
    res.render('users/login', {
        title: '登录'
    })
});
router.post('/login', auth.beforeLogin, function (req, res, next) {
    var user = req.body;
    if (user.username == '' || user.password == '') {
        res.redirect('back');
    } else {
        user.password = util.md5(user.password);
        //查找
        models.User.findOne(user, function (err, doc) {
            if (err) {
                req.flash('error', '用户登录失败');
                res.redirect('back');
            } else {
                if (doc) {
                    req.session.user = doc;             //查到了设置session
                    req.flash('success', '用户登录成功');
                    res.redirect('/');
                } else {
                    req.flash('error', '用户登录失败');
                    res.redirect('back');
                }
            }
        })
    }
})


//点击注册链接跳转到注册页面
router.get('/regist', auth.beforeLogin, function (req, res, next) {
    res.render('users/regist', {
        title: '登录'
    })
});
//注册按钮注册
router.post('/regist', auth.beforeLogin, function (req, res, next) {
    var user = req.body;
    if (user.username == '' || user.password == '' || user.repassword == '' || user.email == '' || user.password != user.repassword) {
        req.flash('error', '输入不合法')
        res.redirect('back');
    } else {
        user.password = util.md5(user.password);
        user.avatar = 'https://secure.gravatar.com/avatar/' + util.md5(user.email) + '?s=48';
        //插入数据
        models.User.create(user, function (err, doc) {
            if (err) {
                req.flash('error', '用户注册失败');
            } else {
                req.flash('success', '用户注册成功');
                res.redirect('/users/login');
            }
        })
    }
})

//router.use(auth.aferLogin);
//点击退出跳到首页
router.get('/logout', auth.aferLogin, function (req, res, next) {
    req.session.user = null;
    req.flash('success', '用户注销成功');
    res.redirect('/');
});

module.exports = router;
