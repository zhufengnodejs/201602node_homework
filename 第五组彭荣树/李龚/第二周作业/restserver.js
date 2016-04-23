var http = require('http');
var fs= require('fs');
var mime = require('mime');
var path = require('path');
var url = require('url');

var express= require('express');
var app = express();
var usersPath='./users.json';
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    fs.createReadStream('./list.html').pipe(res);
});

//获取所有的对象列表
app.get('/users',function(req,res){
    fs.createReadStream(usersPath).pipe(res);
});
//获取某个对象详情
app.get('/users/:id',function(req,res){
    var id = req.params.id;
    var users = JSON.parse(fs.readFileSync('./users.json','utf8'));
    var user = users.filter(function(user){  //filter过滤
        return user.id == id;
    })[0];
    if(user){
        res.send(user);
    }else{
        res.send('此用户不存在')
    }
});

//增加一个用户
app.post('/users',function(req,res){
    console.log(req);
    var user = req.body;
    var users = JSON.parse(fs.readFileSync('./users.json','utf8'));
    user.id = users[users.length-1].id+1;
    users.push(user);
    fs.writeFile(usersPath,JSON.stringify(users),function(err){
        res.send(user);
    })
});

//完整更新 请求体力的对象是完整的对象，会整体覆盖原来的对象
app.put('/users/:id',function(req,res){
    var newUser = req.body;
    var users = JSON.parse(fs.readFileSync('./users.json','utf8'));
    users = users.map(function(user){
        if(user.id == req.params.id){
            return newUser;
        }else{
            return user;
        }
    });
    fs.writeFile(usersPath,JSON.stringify(users),function(err){
        res.send(newUser);
    })
});

//更新某个对象，请求体只要传入更新后的字段就可以了
//1.查找到要修改的用户对象
//2.修改这个对象
//3.写入文件
//4.把修改后的对象发送给客户端
app.patch('/users/:id',function(req,res){
    var users = require(usersPath);
    var newUser = req.body;
    users = users.map(function(user){
        if(user.id == req.params.id){
            for(var attr in newUser){
                if(newUser.hasOwnProperty(attr)){
                    user[attr] = newUser[attr];
                }
            }
            newUser = user;
            return newUser;
        }else{
            return user;
        }
    });
    fs.writeFile(usersPath,JSON.stringify(users),function(err){
        res.send(newUser);
    })
});

app.delete('/users/:id',function(req,res){
    var id = req.params.id;
    var users = JSON.parse(fs.readFileSync('./users.json','utf8'));
    var users = users.filter(function(user){  //filter过滤
        return user.id != id;
    });
    fs.writeFile('./users.json',JSON.stringify(users),function(err){
        res.send({});
    })
});

app.listen(8888);
