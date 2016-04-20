#!/usr/bin/env node
var http = require('http');
var mime = require('mime');
var path = require('path');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    if(req.url == '/'){
        var str = '<ul>';
        fs.readdir('.', function(err,files) {
            files.forEach(function(file) {
                str += '<li><a href="/'+file+'">'+file+'</a></li>';
            })
            str += '</ul>';
            fs.readFile('./index.html','utf8', function(err, data) {
                data = data.replace('<div></div>',str);
                res.end(data);
            })
        })
    }else{
        fs.exists(req.url.slice(1), function(exist) {
            if(exist){
                fs.stat(req.url.slice(1),function(err,stat) {
                    if(stat.isFile()) {
                        res.setHeader('Content-Type',mime.lookup(req.url)+';charset=utf-8');
                        fs.readFile(req.url.slice(1), function(err, data) {
                            res.end(data);
                        });
                    }else{//如果读取的是一个文件夹
                        fs.readdir(req.url.slice(1),function(err,subfiles) {
                            var str = '<ul>';
                            subfiles.forEach(function(file) {
                                str += '<li><a href="'+path.join(req.url,file)+'">'+file+'</a></li>';
                            })
                            str += '</ul>';
                            fs.readFile('./index.html','utf8', function(err, data) {
                                data = data.replace('<div></div>',str);
                                res.end(data);
                            })
                        })
                    }
                })

            }else{
                res.end();
            }
        })
    }

});
server.listen(8080);