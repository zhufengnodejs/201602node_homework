#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var mime = require('mime');
var port = 8899;
var server = http.createServer(function (req, res) {
  if(req.url==='/'){
    fs.readFile('./index.html',function (err, data) {
      res.setHeader('Content-Type',mime.lookup(req.url)+',charset=utf-8;');
      res.end(data);
    });
  }else if(req.url==='/favicon.ico'){
    return;
  }else{
    fs.readFile('.'+req.url,function (err, data) {
      res.setHeader('Content-Type',mime.lookup(req.url)+',charset=utf-8;');
      res.end(data);
    });
  }
});

server.listen(port);
console.log('running in' + port);




