#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var mine = require('mime');
var handleFile = require('./util/handleFile');
var handleDir = require('./util/handleDir');
var server = http.createServer(function (req, res) {
    res.setHeader('Content-Type', mine.lookup(req.url)+';charset=utf8;');
    //var cwd = __dirname;
    var cwd = process.cwd();
    if (req.url !== '/favicon.ico') {
        console.log('server started at http://localhost:8000... please enter ctrl+c stop');
        var url = req.url.replace(/\//g, '\\');
        url = cwd + url;
        console.log(url);
        fs.stat(url, function (err, stats) {
            if (err) {
                res.end('文件或目录不存在！');
                return;
            }
            if (stats.isDirectory()) {
                res.setHeader('Content-Type','text/html;charset=utf8;');
                handleDir(url, res);
            } else if (stats.isFile()) {
                handleFile(url, res);
            }
        })
    }
});
server.listen(8000);
