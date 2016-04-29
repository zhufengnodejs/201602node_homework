/** 登录权限认证 */

//必须是登录之前才能访问
var afterLogin = function(req,res,next){
    if(req.session.user){                   //如果session有值，则进入下一步
        next();
    }else{                                  //如果没有session值
        req.flash('error','必须登录才能访问');  //设置一次性错误提示
        res.redirect('/users/login');           //跳到登录页面
    }
}

//必须登录前才能访问
var beforeLogin = function(req,res,next){
    if(req.session.user){                           //session有值，说明已经登录
        req.flash('error','必须登录前才能访问');         //设置回显消息
        res.redirect('/')                                //跳到首页
    }else{
        next();                                    //继续下一步
    }
}

exports.aferLogin = afterLogin;
exports.beforeLogin = beforeLogin;
