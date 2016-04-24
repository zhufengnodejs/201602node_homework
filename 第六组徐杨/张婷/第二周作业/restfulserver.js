var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var app = express();
//中间件--请求体
app.use(bodyParser.urlencoded({extended:true}));
//访问根目录时，返回index.html页面
app.get("/", function (req, res) {
    fs.createReadStream("./index.html").pipe(res);
});
//访问favicon时的处理
app.get("/favicon", function (req, res) {
    res.send("404");
});
//查询数据库内容时的处理，根据前台要求提供数据库中所有数据json
app.get("/user", function (req, res) {
    var users = require("./user.json");
    res.send(JSON.stringify(users));
});
//将前台页面中新增的数据对象加入到数据库，并返回到页面中展现
app.post("/user", function (req, res) {
    var newUser = req.body;
    var users = require("./user.json");
    newUser.id = users.length+1;
    users.push(newUser);
    fs.writeFile("./user.json",JSON.stringify(users), function (error) {
        res.send(newUser);
    })
});
//访问其它资源时的返回处理
app.get("*", function (req, res) {
    fs.createReadStream("."+req.path).pipe(res);
});
app.listen(9090);