/**
 * Created by Tonny1 on 16/4/23.
 */
var fs = require("fs");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//如果访问的是根路径
app.get("/", function (req, res) {
    fs.createReadStream('./index.html').pipe(res);
});

app.get('/users', function (req, res) {
    fs.createReadStream('./userInfo.json').pipe(res);
});

app.get("/users/:id",function(req,res){
    var id = req.params.id;
    var users = require("./userInfo.json");
    var user = users.filter(function(user){
        return user.id == id;
    })[0];
    res.send(user);
});

app.listen(8080);