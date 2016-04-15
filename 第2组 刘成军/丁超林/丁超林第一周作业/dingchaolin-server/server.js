#!/usr/bin/env node
var http = require('http');
//创建一个http服务器
// ip port
//处理客户端请求
// req  客户端的请求
// res 服务器端的响应
var fs = require('fs');
var mime = require('mime');
var server = http.createServer( function( req, res ){
    res.setHeader('content-type',mime.lookup( req.url ) + ';charset=utf-8');
        fs.readFile( '.' + req.url , function( err, data ){
            res.write( data );
            res.end();//结束响应
        });
    });

server.listen( 8080 );