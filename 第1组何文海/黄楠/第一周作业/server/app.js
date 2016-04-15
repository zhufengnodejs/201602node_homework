#!/usr/bin/env node
var http = require('http');
var mime = require('mime');
var path = require('path');
var fs = require('fs');
var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Title</title></head><body><div></div></body></html>';
http.createServer(function (req, res) {
    if (req.url !== "/favicon.ico") {
        if (req.url == '/') {
            var str = '<ul>';
            fs.readdir('.', function (err, files) {
                files.forEach(function (file) {
                    str += '<li><a href="/' + file + '">' + file + '</a></li>';
                })
                str += '</ul>';
                if(html.indexOf("<ul>")>-1)
                {
                    html = html.replace(/<ul>.*ul>/,str);
                }
                else
                {
                    html = html.replace('<div></div>', str);
                }
                res.end(html);
            })
        }
        else {
            fs.exists(req.url.slice(1), function (exists) {
                if (exists) {
                    fs.stat(req.url.slice(1), function (err, stat) {
                        if (stat.isFile()) {
                            res.setHeader('Content-Type', mime.lookup(req.url) + ';charset=utf-8');
                            fs.readFile(req.url.slice(1), function (err, data) {
                                res.end(data);
                            })
                        } else {//如果说这是一个目录的话
                            fs.readdir(req.url.slice(1), function (err, subfiles) {
                                var str = '<ul>';
                                subfiles.forEach(function (file) {
                                    str += '<li><a href="' + path.join(req.url, file) + '">' + file + '</a></li>';
                                })
                                str += '</ul>';
                                html = html.replace(/<ul>.*ul>/,str);
                                res.end(html);
                            })
                        }
                    })
                } else {
                    res.end('文件找不到');
                }
            })
        }
    }

}).listen(1314, function () {
    console.log('server start');
});