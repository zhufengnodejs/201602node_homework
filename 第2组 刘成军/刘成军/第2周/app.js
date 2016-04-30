
var http = require('http');
var fs= require('fs');
var mime = require('mime');
var path = require('path');
var url = require('url');
var users = [];
var server = http.createServer(function(request,response){
    var urlObj = url.parse(request.url,true);
    var pathname = urlObj.pathname;
    if(pathname == '/'){
        pathname = '/index.html';
    }
    if(pathname == '/favicon.ico'){
        response.end('404');
    }
    if(pathname == '/'){
        response.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
        fs.readFile('./index.html', function(err, data){
            response.end(data);
        })
    }else if(pathname == '/users'){
        var method = request.method.toLowerCase();
        switch(method){
            case 'post':
                post();
                break;
            case 'put':
                put();
                break;
            case 'delete':
                remove();
                break;
            case 'get':
                get();
                break;
        }
    }else{
        fs.exists('.'+pathname, function(exists){
            if(exists){
                fs.readFile('.'+pathname,function(err,data){
                    if(err){
                        response.end();
                    }else{
                        response.write(data);
                        response.end();
                    }

                })
            }else{
                response.end();
            }
        });
    }

    function get(){
        fs.readFile('./user.json','utf8', function (err, data){
            if(!err){
                var result = data.toString() == '' ? '[]' : data.toString();
                response.end('{"status":"success", "value":' + result + '}');
            }else{
                response.end('Query failed!')
            }
        });
    }
    function remove(){
        var idstr = '';
        request.on('data', function(data){
            idstr = data.toString();
        });
        request.on('end', function(){
            fs.readFile('./user.json', function(err, data){
                if(!err){
                    fs.readFile('./user.json', function(err,data){
                        if(!err){
                            if (data.toString() != '') {
                                users = JSON.parse(data);
                            }
                            for(var i=0; i<users.length; i++){
                                if(users[i].id == idstr){
                                    users.splice(i,1);
                                }
                            }
                            response.end('{"status":"success", "value":' + JSON.stringify(users) + '}');
                        }
                        fs.writeFile('./user.json',JSON.stringify(users),'utf8', function(err){
                            if(err){
                                response.end('{"status":"error"}');
                            }else{
                                response.end('{"status":"success"}');
                            }
                        })

                    })

                }
            })
        })
    }

    function put(){
        var str = '';
        var strObj = {};
        request.on('data', function(data){
            str = data.toString();
        })
        request.on('end', function(){
            fs.readFile('./user.json', function(err, data){
                if(!err){
                    strObj = JSON.parse(str);
                    strObj.id = parseInt(strObj.id);
                    if (data.toString() != '') {
                        users = JSON.parse(data);
                    }
                    for(var i =0 ; i < users.length; i++){
                        if(users[i].id == strObj.id){
                            users[i] = strObj;
                        }
                    }
                    response.end('{"status":"success", "value":' + JSON.stringify(users) + '}');
                }
                fs.writeFile('./user.json',JSON.stringify(users),'utf8', function(err){
                    if(err){
                        response.end('{"status":"error"}');
                    }else{
                        response.end('{"status":"success"}');
                    }
                })
            })
        })
    }
    
    function post(){
        var str = '';
        var obj = {};
        request.on('data', function(data){
            str += data.toString();
            obj = JSON.parse(str);
        });

        request.on('end', function(){
            fs.readFile('./user.json', function(err,data){
                if (data.toString() != '') {
                    users = JSON.parse(data);
                }
                if (users.length == 0) {
                    obj.id = 1;
                } else {
                    obj.id = users[users.length - 1].id + 1;
                }
                users.push(obj);
                response.end('{"status":"success", "value":' + str + '}');

                fs.writeFile('./user.json',JSON.stringify(users),'utf-8', function(err){
                    if(err){
                        response.end('{"status":"error"}');
                    }else{
                        response.end('{"status":"success"}');
                    }
                })
            })
        });
    }
});

server.listen(9009);
