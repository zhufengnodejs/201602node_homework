
var app = require('express')();
var fs = require('fs');
var bodyParser = require('body-parser');
var usersFile = './users.json';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
    fs.readFile('index.html','utf8', function(err, data){
        res.send(data);
    })
});

//GET
app.get('/users/',function(req, res){
    var users = require(usersFile);
    res.send(users);
});

app.get('/users/:id',function(req, res){

    var id = req.params.id;
    var users = require(usersFile);
    var user = users.filter(function(value){
        return value.id == id;
    });
    console.log(user);
    res.send(user.length ? user : '不存在');
});

//POST
app.post('/users',function(req, res){
    var user = req.body;
    var users = require(usersFile);
    user.id = users[users.length-1].id+1;
    users.push(user);
    fs.writeFile(usersFile,JSON.stringify(users),function(err){
        res.send(user);
    })

});

//PUT
app.put('/users',function(req,res){
    var user = req.body;
    var id = req.params.id;
    var users = require(usersFile);
    users = users.map(function(value){
        if(id == value.id){
            return user;
        } else {
            return value;
        }
    });
    fs.writeFile(usersFile,JSON.stringify(users),function(err){
        res.send(user);
    })

});

//PATCH
app.patch('/users/:id',function(req, res){
    var user = req.body;
    var id = req.params.id;
    var users = require(usersFile);
    users = users.map(function(value){
        if(id == value.id) {
            for(var attr in user){
                if(user.hasOwnProperty(attr)){
                    value[attr] = user[attr];
                }
            }
            //需要返回完整的资源对象，故更新之
            user = value;
        }
        return value;
    });

    fs.writeFile(usersFile, JSON.stringify(users), function(err){
        res.send(user);
    })
});

//DELETE
app.delete('/users/:id', function(req, res){
    var user = req.body;
    var id = req.params.id;
    var users = require(usersFile);
    users = users.filter(function(value){
        return value.id !== id;
    });

    fs.writeFile(usersFile, JSON.stringify(users), function(err){
        res.send();
    });

});

app.listen(3000);