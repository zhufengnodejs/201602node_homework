var http = require('http');
var fs = require('fs');
var mime = require('mime');
var path = require('path');

var server = http.createServer(function(req, res){
    res.setHeader('Content-Type', mime.lookup(req.url) + ';charset=utf-8');
    console.log(req.url);
    if(req.url == '/favicon.ico'){
        res.end();
    }else {
        fs.readFile(__dirname + req.url, function (err, data) {
            if(err){
                console.log(err);
            }else {
                res.write(data);
                res.end();
            }
        });
    }
});
server.listen(4444);



//var express = require('express');
//var app = express();
//var db = './db.json';
//var bodyParser = require('body-parser');    //解析请求体
//
//app.get('./queryList', function(req, res){
//    var list = JSON.parse(fs.readFileSync(db,'utf8'));
//    res.send(list);
//});
//
////获取所有列表
//app.get('./queryList', function(req, res){
//    var list = JSON.parse(fs.readFileSync(db,'utf8'));
//    res.send(list);
//});
//
//app.listen(3333);




// var querystring = require('querystring');

// http.createServer(function(req,res){
//     req.setEncoding('utf8');
//     if(req.url == '/'){
//         fs.createReadStream('./index.html').pipe(res);
//     }else if(req.url == '/queryList'){
//         //请求头都放在req.headers对象里，取的时候全部用小写
//         var contentType= req.headers['content-type'];
//         req.on('data',function(data){
//             if(contentType == 'application/x-www-form-urlencoded'){
//                 // username=zfpx&age=6
//                 var user = querystring.parse(data);
//                 console.log(user);
//             }else if(contentType == 'application/json'){
//                 var user = JSON.parse(data);
//                 console.log(user);
//             }
//             res.setHeader('Content-Type','application/json');
//             res.end(JSON.stringify(user));
//         });
//     }
// }).listen(8080);
