/**
 * Created by wenner1122 on 2016/4/22.
 */
//引进可用模块
var express = require("express");
var fs = require("fs");
var app = express();
//引入中间件
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
//访问根目录
app.get("/",function(req,res){
    fs.createReadStream('./girlsList.html').pipe(res);
})
//创建一个查询路由
app.get('/girls',function(req,res){
    fs.createReadStream('./girls.json').pipe(res);
});
//查询路由
app.get("/girls/:id",function(req,res){
    var id = req.params.id;
    var girls = require("./girls.json");
    var girl = girls.filter(function(girl){
        return girl.id == id;
    })[0];
    res.send(girl);
});
//增加一个用户路由
app.post('/girls',function(req,res){
    var girl = req.body;
    var girls = JSON.parse(fs.readFileSync('./girls.json','utf8'));
    girl.id = girls[girls.length-1].id+1;
    girls.push(girl);
    fs.writeFile('./girls.json',JSON.stringify(girls),function(err){
        res.send(girl);
    })
});
//删除的路由
app.delete('/girls/:id',function(req,res){
    var id = req.params.id;
    var girls = JSON.parse(fs.readFileSync('./girls.json','utf8'));
    var girls = girls.filter(function(girl){
        return girl.id != id;
    });
    fs.writeFile('./girls.json',JSON.stringify(girls),function(err){
        res.send({});
    })
});
//监听端口
app.listen(9090);