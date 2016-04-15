#! /usr/bin/  node
var http = require('http');
//创建一个HTTP服务器
//IP 端口
//处理客户端的请求
/**
 * req 客户端的请求
 * res 服务器端的响应
 */
var mime = {
    ".css": "text/css",
    ".js": "text/javascript",
    ".jpg": "image/jpg",
    ".html": "text/html"
}
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var server = http.createServer(function (req, res) {
    //设置响应的类型 设置到响应头中
    if (req.url == '/clock') {
        res.end(new Date().toLocaleString());
    }else if(req.url == '/favicon.ico'){
        res.end();
    } else {
        res.setHeader('Content-Type',mime.lookup(req.url)+';charset=utf-8');
        fs.readFile('.' + req.url, function (err, data) {
            res.write(data);//向客户端发响应体
            res.end();//结束响应 挂掉电话
        })
    }
});
//在本机监听8080端口
server.listen(8080);