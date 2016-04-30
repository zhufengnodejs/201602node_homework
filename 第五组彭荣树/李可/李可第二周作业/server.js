var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
app.set('view engine','ejs');
app.set('views',__dirname);
app.use(express.static(path.join(__dirname,'public')));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
var db = './users.json';
var userslist = JSON.stringify(require(db));

app.get('/',function(req, res) {
    res.render('index',{
        users:userslist
    });
});
app.post('/users',function(req, res) {
    var user = req.body;
    var users = require(db);
    user.id = users[users.length-1].id+1;
    users.push(user);
    console.log(users);
    fs.writeFile(users,JSON.stringify(users),function(err){
        res.send(user);
    });
});
app.listen(8080);
