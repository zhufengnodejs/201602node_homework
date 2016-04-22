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

var users = [];
var server = http.createServer(function(req,res){
    //把url转成url对象
    var urlObj = url.parse(req.url,true);

    if(urlObj.pathname == '/favicon.ico'){
        res.end('404');
    }

    if(urlObj.pathname == '/'){
        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
        fs.readFile('./users.html', function(err, data){
            res.end(data);
        })
    }else if(urlObj.pathname == '/users'){
        if( req.method == "POST" ){
            post();
        }else if( req.method == "GET" ){
            get();
        }else if( req.method == "DELETE" ){
            deleteDom();
        }else if( req.method == "PUT" ){
            put();
        }
    }else{
        fs.exists("."+urlObj.pathname,function(exists){
            if(exists){
                fs.readFile("."+urlObj.pathname,function(err,data){
                    if(err){
                        res.end();
                    }else {
                        res.end(data);
                    }
                });
            }else{
               // res.end(data);
            }
        })
    }


    function post(){
        var str = "";
        var obj = {};
        req.on("data", function (data) {
            str += data.toString();
            obj = JSON.parse(str);
        });
        req.on("end",function(){
            fs.readFile("./zhangyan.json",function(err,data){
                if(data.toString() !=''){
                    users = JSON.parse(data);
                }
                if( users.length == 0 ){
                    obj.id = 1;
                }else{
                    obj.id = users[users.length - 1].id + 1;
                }
                users.push(obj);
                res.end('{"status":"success","value":'+ str +'}');
                fs.writeFile("./zhangyan.json",JSON.stringify(users),"utf-8",function(err){
                    if(err){
                        res.end('{"status":"error"}');
                    }else{
                        res.end('{"status":"success"}');
                    }
                });
            })
        });
    };

    function get(){
        fs.readFile("./zhangyan.json","utf-8",function(err,data){
           if(err){
               console.log("查询出错");
           } else {
               if( data.toString() == '' ){
                   var result = '[]';
               }else{
                   var result = data.toString();
               }console.log(result)
               res.end('{"status":"success","value":'+ result +'}');
           }
        });
    };

    function deleteDom(){
        var idstr = '';
        req.on('data', function(data){
            idstr = data.toString();
        });

        req.on('end', function(){
            fs.readFile('./zhangyan.json', function(err, data){
                if(!err){
                    fs.readFile('./zhangyan.json', function(err,data){
                        if(!err){
                            if (data.toString() != '') {
                                users = JSON.parse(data);
                            }
                            for(var i=0; i<users.length; i++){
                                if(users[i].id == idstr){
                                    users.splice(i,1);
                                }
                            }
                            res.end('{"status":"success", "value":' + JSON.stringify(users) + '}');
                        }
                        fs.writeFile('./zhangyan.json',JSON.stringify(users),'utf8', function(err){
                            if(err){
                                res.end('{"status":"error"}');
                            }else{
                                res.end('{"status":"success"}');
                            }
                        })
                    })
                };
            });
        });
    };

    function put(){
        var str = "";
        var obj = {};
        req.on("data",function(data){
            str = data.toString();
        });
        req.on("end",function(){
            fs.readFile('./zhangyan.json','utf-8',function(err,data){
                if( !err ){
                    obj = JSON.parse(str);
                    obj.id = parseInt(obj.id);
                    if (data.toString() != '') {
                        users = JSON.parse(data);
                    }
                    for(var i=0; i<users.length; i++){
                        if(users[i].id == obj.id){
                            users[i] = obj;
                        }
                    }
                    res.end('{"status":"success", "value":' + JSON.stringify(users) + '}');
                }
                fs.writeFile('./zhangyan.json',JSON.stringify(users),'utf8', function(err){
                    if(err){
                        res.end('{"status":"error"}');
                    }else{
                        res.end('{"status":"success"}');
                    }
                })
            });
        });
    };
});
server.listen(8080);