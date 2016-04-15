#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var mime = require('mime');
var server = http.createServer(function(req, res){
    res.setHeader('content-type', mime.lookup(req.url) + ';charset=utf-8');
        fs.readFile('.' + req.url , function(err, data){
            res.write(data);
            res.end();
        });
    });

server.listen(9001);