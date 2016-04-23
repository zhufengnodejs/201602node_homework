/**
 * Created by BJF on 2016/3/14.
 */
var path = require('path');
var url = require('url');
var fs= require('fs');
var express = require('express');   //加载express模块
var app=express();                  //获取配置对象

// 存放所有用户信息的数组
var users=[];
// 提供用户方法的对象；
var user={};
//用户id
var id=0;

app.listen("9090");


app.get('/', function(req,res){
    if(users.length==0){
        var rs = fs.createReadStream('index.html');
    }else{
        var rs = fs.createReadStream('login.html');
    }
    rs.setEncoding('utf8');
    var html ='';
    rs.on('data',function(data){
        html+=data;
    });
    rs.on('end',function(){
        res.send(html);
    });
    rs.on('error',function(){
        res.send('访问成功，但是文件读取失败！');
    });
});


app.get('/register', function(req,res){
    var rs = fs.createReadStream('register.html');
    rs.setEncoding('utf8');
    var html ='';
    rs.on('data',function(data){
        html+=data;
    });
    rs.on('end',function(){
        res.send(html);
    })
    rs.on('error',function(){
        res.send('访问成功，但是文件读取失败！');
    });
});


app.get('/login', function(req,res){
    var rs = fs.createReadStream('login.html');
    rs.setEncoding('utf8');
    var html ='';
    rs.on('data',function(data){
        html+=data;
    });
    rs.on('end',function(){
        res.send(html);
    })
    rs.on('error',function(){
        res.send('访问成功，但是文件读取失败！');
    });
});

app.get('/welcome', function(req,res){
    var rs = fs.createReadStream('welcome.html');
    rs.setEncoding('utf8');
    var html ='';
    rs.on('data',function(data){
        html+=data;
    });
    rs.on('end',function(){
        res.send(html);
    })
    rs.on('error',function(){
        res.send('访问成功，但是文件读取失败！');
    });
});




//add someone information
app.post('/user/:type',function(req,res){
    user.add(req,res);
});
//search all user information
app.get('/user/:username/:password',function(req,res){
    user.list(req,res)
});
//delete someone user
app.delete('/user/:id',function(req,res){
    user.delete(req,res)
});
//edit someone information
app.put('/user',function(req,res){
    user.put(req,res)
});

user={
    add:function(req,res){
        console.log('进入添加');
        var type= req.params.type;
        var str = '';
        req.on('data',function(data){
            str+=data.toString();
        });
        req.on('end',function(){
            id+=1;
            str='{"id":"'+id+'",'+str.substring(1);
            users.push(JSON.parse(str));
            console.log(str);
            if(req.params.type){
                switch (type){
                    case "reg":
                        // 如何实现服务器端重定向网页跳转
                        //res.redirect('login.html');  这个似乎是重定向请求
                        //var rs = fs.createReadStream('login.html');
                        //rs.setEncoding('utf8');
                        //var html ='';
                        //rs.on('data',function(data){
                        //    html+=data;
                        //});
                        //rs.on('end',function(){
                        //    res.send(html);
                        //});
                        res.send({message:"succ"});
                        break;
                    case "new":
                        res.end(str);
                }
            }else{
                res.end(str);
            }
        });
    },
    list:function(req,res){
        console.log('进入查询');
        var str = req.params.username;
        var password= req.params.password;
        for(var i = 0 ; i<users.length;i++){
            if(users[i].username == str){
                if(password != ""){
                    switch (password){
                        case "none":
                            res.send(JSON.stringify(users[i]));
                            break;
                        case users[i].age:
                            res.send({message:"succ"});
                            break;
                    }
                }
                else {
                    res.send("");
                }
                return false;
            }
        }
    },
    delete:function(req,res){
        console.log('进入删除');
        var str = req.params.id;
        for(var i = 0 ; i<users.length;i++){
            if(users[i].id == str){
                users.splice(i);
                res.send("success");
                return false;
            }
        }
    },
    put:function(req,res){

    }
}
