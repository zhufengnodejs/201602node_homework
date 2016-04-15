#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res) {
    console.log(req.url)

    if(req.url == '/'){
        res.end("<html>plese enter from  <a href='/index.html'>here</a></html>");
    }else if(req.url == '/clock'){
        res.end(new Date().toLocaleString());
    }else if(req.url == '/favicon.ico'){
        res.end();
    }else{
        fs.readFile('.'+req.url, function (err, data) {
            res.write(data);//向客户端发响应体
            res.end();//结束响应 挂掉电话
        })
    }
});
server.listen(1234);
