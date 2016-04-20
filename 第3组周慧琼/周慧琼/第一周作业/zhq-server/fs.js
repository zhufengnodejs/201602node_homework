/**
 * Created by HOME on 2016/4/14.
 */
var fs = require('fs'),
    http = require('http'),
    mime = require('mime');
//var port = process.argv[0] ? process.argv[2] : 8900;
//http.createServer(function(request,response){
//    response.setHeader('Content-type',mime.lookup(request.url));
//    fs.readFile('.' + request.url,function(err,data){
//        response.write(data,'utf-8');
//        response.end();
//    });
//}).listen(8900,function(){
//    console.log(port + '¶Ë¿ÚÆô¶¯ÁË£¡');
//});
fs.stat('main.txt',function())