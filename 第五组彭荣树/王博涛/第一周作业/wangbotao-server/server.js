#!/usr/bin/env node
var http = require("http");
var mime = require("mime");
var fs = require("fs");
http.createServer(function (req, res) {
    var reqUrl = req.url;
    if (reqUrl == "/favicon.ico") {
        res.end();
    } else if (reqUrl == "/") {
        res.end("<html>Enter <a href='/index.html'>index.html</a></html>");
    } else {
        res.setHeader("Content-Type", mime.lookup(reqUrl) + ";charset=utf8");
        fs.readFile("." + reqUrl, function (err, data) {
            res.end(data);
        })
    }
}).listen(8888, function () {
    console.log("已启用8888端口!请访问localhost:8888/index.html");
});