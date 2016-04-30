var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var app = express();
var users = JSON.parse(fs.readFileSync("./user.json",'utf8'));
//中间件--请求体
app.use(bodyParser.urlencoded({extended:true}));
//访问根目录时，返回index.html页面
app.get("/", function (req, res) {
    fs.createReadStream("./index.html").pipe(res);
});
//访问favicon时的处理
app.get("/favicon.ico", function (req, res) {
    fs.createReadStream("./favicon.html").pipe(res);
});
//查询数据库内容时的处理，根据前台要求提供数据库中所有数据json
app.get("/user", function (req, res) {
    //var users = require("./user.json");
    res.send(users);
});
//将前台页面中新增的数据对象加入到数据库，并返回到页面中展现
app.post("/user", function (req, res) {
    var newUser = req.body;
    //var users = require("./user.json");
    newUser.id = users.length+1;
    users.push(newUser);
    fs.writeFile("./user.json",JSON.stringify(users), function (error) {
        res.send(newUser);
    })
});
//在数据库中删除数据,并返回空对象
app.delete("/user", function (req, res) {
    var id = req.body;
    //var users = require("./user.json");
    users = users.filter(function (item) {
        return item.id != id.id;
    });
    fs.writeFile("./user.json", JSON.stringify(users),function (error) {
        res.send({});
    })
});
//编辑数据的提交
app.put("/user", function (req, res) {
    var reqBody = req.body;
    //var users = require("./user.json");
    users = users.map(function (item) {
        if(item.id == reqBody.id){
            return reqBody;
        }else{
            return item;
        }
    });
    fs.writeFile("./user.json",JSON.stringify(users), function (error) {
        res.send(reqBody);
    })
});
//访问其它资源时的返回处理
app.get("*", function (req, res) {
    fs.createReadStream("."+req.path).pipe(res);
});
app.listen(9090);