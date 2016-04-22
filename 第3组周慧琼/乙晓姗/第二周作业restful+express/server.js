/**
 * Created by shan on 4/20/16.
 */
var fs= require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended:true}));


app.get('/',function(req,res){
    fs.createReadStream('./index.html').pipe(res);
});

app.get('/users',function(req,res){
    fs.readFile('./user.json','utf8', function (err, data){
        if(!err){
            var result = data.toString() == '' ? '[]' : data.toString();
            res.send({status:"success",value:JSON.parse(result)});
        }else{
            res.send({status:"fail"})
        }
    });
});

app.post('/users',function(req,res){
    var user = req.body;
    var users = JSON.parse(fs.readFileSync('./user.json','utf8'));
    user.id = users[users.length-1].id+1;
    users.push(user);
    var result = JSON.stringify(users);
    fs.writeFile('./user.json',result,function(err){
        res.send({status:"success",value:users});
    })
});

app.put('/users',function(req,res){
    var newUser = req.body;
    var updateId = newUser.updateId;
    newUser.id = parseInt(updateId);
    var users = JSON.parse(fs.readFileSync('./user.json','utf8'));
    users = users.map(function(user){
        if(user.id == updateId){
            return newUser;
        }else{
            return user;
        }
    });
    var result = JSON.stringify(users);

    fs.writeFile('./user.json',result,function(err){
        res.send({status:"success",value:newUser});
    })
});

app.delete('/users',function(req,res){
    var user = req.body;
    var id = user.deleteId;
    var users = JSON.parse(fs.readFileSync('./user.json','utf8'));
    var users = users.filter(function(user){
        return user.id != id;
    });
    var result = JSON.stringify(users);

    fs.writeFile('./user.json',result,function(err){
        res.send({status:"success",value:users});
    })
});

app.listen(9090);
