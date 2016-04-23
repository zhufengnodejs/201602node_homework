var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
http.createServer(function(req,res){
    req.setEncoding('utf8');
    if(req.url == '/'){
        fs.createReadStream('./index.html').pipe(res);
    }else if(req.url == '/ajax'){
        var contentType= req.headers['content-type'];
        req.on('data',function(data){
            if(contentType == 'application/x-www-form-urlencoded'){
                var user = querystring.parse(data);
                console.log(user);
            }else if(contentType == 'application/json'){
                var user = JSON.parse(data);
                console.log(user);
            }
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify(user));
        });
    }
}).listen(8081);