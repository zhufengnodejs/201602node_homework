/*var http = require('http');
var fs = require('fs');
var mime = require('mime');
var path = require('path');

var server = http.createServer(function(req, res) {
    //res.setHeader('Content-Type', mime.lookup(req.url) + ';charset=utf-8');
    console.log(req.url);
    if(req.url == '/'){
        res.setHeader('Content-Type','text/html;charset=utf-8');
        fs.readFile('./index.html', function (err, data) {
            res.write(data);
            res.end();
        })
    }else{
        res.setHeader('Content-Type',+ mime.lookup(req.url) +';charset=utf-8');
        if(req.url != '/favicon.ico'){
            fs.readFile('.' + req.url, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.write(data);
                    res.end();
                }
            });
        }
    }
});
server.listen(8888);*/


//resful有个特点，url都是users，操作是通过app.post/app.get体现
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var db = './users.json';
var app = express();
app.use(bodyParser.urlencoded({extended: true}));   //获取请求体

app.get('/', function(req, res){
    res.redirect('/index.html');
});

//获取所有对象
app.get('/users', function(req, res){
    fs.createReadStream(db).pipe(res);
});

//获取单个对象
app.get('/users/:id', function(req, res){ // :id ==> 路径参数
    var id = req.params.id;                 // 获取id
    var users = require(db);                //获取users
    //不能用require，因为有缓存问题
    var user = users.filter(function(user){ //过滤
        return user.id == id;               //filter返回值是数组，长度为0/1
    })[0];                                   //找不到是undefined
    if(user){
        res.send(user);
    }
});

//增加一个用户
app.post('/users', function(req, res){
    //参数怎么传呢，是选择form-data, x-www-form-rulencoded（表单序列化）呢
    //这里选择x-www-form-rulencoded  ==> name="lixia"的形式
    //参数放在请求体中，在express里面怎么得到请求体呢
    //req.body 获得请求体
    var user = req.body;
    console.log(user);
    var arr = [];
    var users = fs.readFile(db, "utf-8", function(err, data){
        arr = JSON.parse(data);
        user.id = Number( arr[arr.length-1].id ) + 1;
        arr.push(user);
        fs.writeFile(db, JSON.stringify(arr), function(err){
            //res.setHeader('Content-Type', 'application/json;charset=utf-8');
            if(err){
                res.send(JSON.stringify({code: 1, msg: '新增失败'}));
            }else{
                res.send(JSON.stringify({code: 0, data: [user]}));
            }
        });
    });
});


//删除
app.delete('/users/:id', function (req,res) {
    var id=req.params.id;
    var users=JSON.parse(fs.readFileSync(db,'utf8'));
    fs.readFile(db, function (err,data) {
        users=data;
    });
    var newUsers=users.filter(function (user) {
        return user.id != id;
    });
    fs.writeFile(db,JSON.stringify(newUsers),function(){
        res.send(newUsers);
    })
});

//完整更新，请求体里的对象是完成的对象，会整体覆盖原来的对象
app.put('/users/:id', function(req, res){
    var newUser = req.body;
    console.log(newUser);
    var id = req.params.id;
    //var users = fs.readFile(db, 'utf-8', function(err, data){
    var users=JSON.parse(fs.readFileSync(db,'utf8'));   //注意这里
    users=users.map(function (user) {
        if(user.id==id){
            return newUser;
        }else {
            return user;
        }
    });
    fs.writeFile(db, JSON.stringify(users), function(err){
        if(err){
            res.send(JSON.stringify({code: 1, msg: '更新失败'}));
        }else{
            res.send(JSON.stringify({code: 0, data: newUser}));
        }
    });
});







app.get('*', function(req, res){
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    fs.createReadStream('./'+ req.url).pipe(res);
});

app.listen(8080);


/*     有问题
*      arr = JSON.parse(data);
*
*
* */





























