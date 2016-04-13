
var http = require('http');
var fs = require('fs');
var mime = require('mime');
http.createServer(function(req,res){
    var url = req.url;
    if(url == '/'){
        url = '/index.html'
    }
    res.setHeader('Content-Type',mime.lookup(url)+';charset=utf-8');
    fs.exists('.'+url, function(exist){
        if(exist){
            fs.readFile('.'+url,function(err,data){
                if(err){
                    res.statusCode = 404;
                    res.end();
                } else {
                    res.statusCode = 200;
                    res.end(data);
                }
            })
        } else {
            res.statusCode = 404;
            res.end();
        }
    })
}).listen(8888);