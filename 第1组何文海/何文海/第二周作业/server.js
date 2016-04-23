var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var db = require('./users.json');
var path = require('path');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/')));

app.get('/users/:name', function (req, res) {
    console.log("q")
    var id = req.params.name;
    var user = db.filter(function (user) {
        var newAry = user.name == id;
        return newAry;
    })[0];
    res.send(user);
});
app.get('/users/age/:age', function (req, res) {
    var age = req.params.age;

    var user = db.filter(function (user) {
        var newAry = user.age == age;
        return newAry;
    })[0];
    res.send(user);
});
app.get('/users/err/:err', function (req, res) {
    res.setHeader("Content-Type", "application/json;charset=uft-8")
    res.send({
        "name": "nothing",
        "age": "nothing"
    });
});

app.post('/users/:a', function (req, res) {
    var user = req.body;
    console.log(user);
    console.log(user.name);
    db.push(user)
    console.log(db)
    fs.writeFile('./users.json', JSON.stringify(db), function (err) {
        res.send(user)
    })

})
//app.delete('/users/:name', function (req, res) {
//    var id = req.params.name;
//    var users = require(db);
//    users = users.filter(function (user) {
//        return user.id != id;
//    });
//    fs.writeFile(db, JSON.stringify(users), function (err) {
//        if (!err) {
//            res.send(JSON.stringify({code: 1, message: 'ok'}));
//        }
//        else {
//            res.send(JSON.stringify({code: 0, message: err}));
//        }
//    })
//});



app.listen(8110);