#!/usr/bin/env node
var fs = require('fs');
var http = require('http');
var mime = require('mime');
var path = require('path');
var port = "9999";


var server = http.createServer(function (req, res) {
    var pathname = req.url;

    if (pathname === '/') {
        pathname = '/index.html';
    }
    if (req.url === "/favicon.ico") {
        return;
    }

    fs.exists('.' + pathname, function (exists) {
        if (!exists) {
            fs.readFile(__dirname + '/404.html', function (err, data) {
                if (err) {
                    return;
                } else {
                    res.setHeader('Content-Type', 'text/html' + ';charset=utf-8');
                    res.write(data);
                    res.end();
                }
            });
        } else {
            fs.readFile('.' + pathname, function (err, data) {
                if (err) {
                    return;
                } else {
                    res.setHeader('Content-Type', mime.lookup(pathname) + ';charset=utf-8');
                    res.write(data);
                    res.end();
                }
            });
        }
    });


});
server.listen(port);
console.log("Server runing at port: " + port);