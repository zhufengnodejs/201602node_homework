var http = require("http");
/**
 * 1. 能在特定的IP 特定端口上监听 客户端的请求
 * 2. 当请求到来的时候能执行监听函数，并返回响应
 *
 * 创建一个服务器
 * 指定监听函数 每当有客户端请求到来的时候执行的函数
 * request 代表客户端的请求，可以从中获取请求过来的信息
 * response 代表向客户端发的响应，可以通过它向客户端发响应
 *
 */
var fs = require('fs');
var mime = require('mime');//第三方模块
var path = require('path');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());



app.delete('/zhangyan',function(req,res){
    var reqbody = req.body;
    var users = require("./express.json");
    var users = users.filter(function(user){
        return user.name != reqbody.name && user.age != reqbody.age;
    });
    fs.writeFile("./express.json",JSON.stringify(users),function(err){
        res.send(users);
    })

});

app.get("/zhangyan", function (req,res) {
    fs.readFile("./express.json",function(err,data){
        if(!err){
            if( data.toString() == '' ){
                var result = '[]';
            }else{
                var result = data.toString();console.log(result)
            }
            res.end('{"status":"success","value":'+ result +'}');
        }else{
            console.log("查询出错");
        };
    })
    /*var users = require("./express.json");console.log(JSON.stringify(users))
    fs.writeFile("./express.json",JSON.stringify(users),function(err){
        res.send(JSON.stringify(users));
    })*/
});

app.post('/zhangyan',function(req,res){
    var user = req.body;
    var users = require("./express.json");
    if( users.length == 0 ){
        user.id = 1;
    }else{
        user.id = users[users.length - 1].id + 1;
    }
    users.push(user);
    fs.writeFile("./express.json",JSON.stringify(users),function(err){
        res.send(user);
    })
});



app.all("*",function(req,res){
    var urlObj = url.parse(req.url,true);
    fs.exists("."+urlObj.pathname,function(exists){
        if( urlObj.pathname =="/" ){
            fs.readFile("./zhangyan.html",function(err,data){
                res.end(data);
            });
        }else{
            if(exists){
                fs.readFile("."+urlObj.pathname,function(err,data){
                    if(err){
                        res.end();
                    }else {
                        res.end(data);
                    }
                });
            }
        }
    })
});
app.listen(1010);
