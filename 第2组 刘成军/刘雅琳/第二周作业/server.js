var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var users = [];
var id = 0;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',function(req,res){
    fs.createReadStream('./index.html').pipe(res);
});

app.get('/server',function(req,res) {
    fs.readFile('./user.json','utf8', function (err, data) {
        if (!err) {
            res.end(data);
        } else {
            res.end('查询失败!')
        }
    });
});
app.get('/server/:id',function(req,res) {
    var param = req.params;
    var id = parseInt(param.id);
    fs.readFile('./user.json','utf8', function (err, data) {
        if (!err) {
            var users = JSON.parse(data);
            for(var i = 0,len = users.length;i < len;i++) {
                if(users[i].id == id) {
                    res.end(JSON.stringify(users[i]));
                }
            }
        } else {
            res.end('查询失败!')
        }
    });
});
app.post('/server',function(req,res) {
    var user = req.body;
    user.id = id++;
    fs.readFile('./user.json','utf8',function(err,data){
        users = JSON.parse(data);
        users.push(user);
        fs.writeFile('./user.json',JSON.stringify(users), {encoding: 'utf8',flag: 'w'},function (err) {
            if (err) {
                res.send('{"status":"error"}');
            } else {
                res.end(JSON.stringify(users));
            }
        });
    });
});

app.delete('/server/:id',function(req,res) {
    var param = req.params;
    var id = parseInt(param.id);
    fs.readFile('./user.json','utf8',function (err, data) {
        if (!err) {
            var users = JSON.parse(data);
            for(var i = 0,len = users.length;i < len;i++) {
                if(users[i].id == id) {
                    users.splice(i,1);
                }
            }
            fs.writeFile('./user.json',JSON.stringify(users),'utf8',function (err) {
                if(!err) {
                    res.end('{"status":"success"}');
                } else {
                    res.send('{"status":"error"}');
                }
            });
        } else {
            res.end('删除失败!');
        }
    });
});

app.put('/server/:id',function(req,res) {
    var param = req.params;
    var id = parseInt(param.id);
    var user = req.body;
    fs.readFile('./user.json','utf8',function (err,data) {
       if(!err) {
           var users = JSON.parse(data);
           var eUser = [];
           for (var i = 0,len = users.length;i < len;i++) {
               if (users[i].id == id) {
                   for(var j in users[i]) {
                       users[i][j]= user[j];
                   }
                   eUser.push(users[i]);
               }
           }
           fs.writeFile('./user.json',JSON.stringify(users),{encoding: 'utf8',flag: 'w'},function (err) {
               if (err) {
                   res.send('{"status":"error"}');
               } else {
                   res.end(JSON.stringify(eUser));
               }
           });
       }
    });
});
app.listen(9091);