#!/usr/bin/env node
(function() {
    var http = require('http');
    var fs = require('fs');
    var mime = require('mime');
    var path = require('path');
    var server = http.createServer(function (request, response) {
        var url = request.url;
        if (url == '/favicon.ico') {
            return response.end('404');
        }
        if (url == '/') {
            url = '/index.html';
        }
        console.log(url);
        response.setHeader('Content-Type', mime.lookup(url) + ';charset=utf-8');
        fs.exists('.' + url, function (exists) {
            if (exists) {
                fs.readFile('.' + url, function (err, data) {
                    console.error(url, err, data);
                    if (err) {
                        response.statusCode = 404;
                        response.end();
                    } else {
                        response.statusCode = 200;
                        response.write(data);
                        response.end();
                    }

                })
            } else {
                response.statusCode = 404;
                response.end();
            }

        })

    });
// 0 - 65535
// ps -ef | grep node
    server.listen(8080, 'localhost');
})()
