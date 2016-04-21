var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var db = './user.json';
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function (req, res) {
    res.redirect('/index.html');
})
app.get('/index.html', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    fs.createReadStream('./index.html').pipe(res);
})
app.get('/bootstrap.min.css', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'});
    fs.createReadStream('./bootstrap.min.css').pipe(res);
})
app.get('/users', function (req, res) {
    fs.createReadStream('./user.json').pipe(res);
})
app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var users = require(db);
    var user = users.filter(function (user) {
        return user.id == id;
    })[0];
    if (user) {
        res.send(user);
    }
})
app.post('/add', function (req, res) {
    var ary, obj;
    fs.readFile('./user.json', "utf-8", function (err, data) {
        ary = eval(data.toString());
        obj = req.body;
        obj.id = ary.length > 0 ? Number(ary[ary.length - 1].id) + 1 : 1;
        ary.push(obj);
        fs.writeFile('./user.json', JSON.stringify(ary), 'utf-8', function (err) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            if (!err) {
                res.send(JSON.stringify({code: 1, message: 'ok'}));
            }
            else {
                res.send(JSON.stringify({code: 0, message: err}));
            }
        })
    })
})
app.post('/update', function (req, res) {
    var obj;
    obj = req.body;
    var users = require(db);
    users.forEach(function (item) {
        if (item.id == obj.id) {
            item.userName = obj.userName, item.age = obj.age;
        }
    });
    fs.writeFile(db, JSON.stringify(users), 'utf-8', function (err) {
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        if (!err) {
            res.send(JSON.stringify({code: 1, message: 'ok'}));
        }
        else {
            res.send(JSON.stringify({code: 0, message: err}));
        }
    })

})
app.delete('/users/:id', function (req, res) {
    var id = req.params.id;
    var users = require(db);
    users = users.filter(function (user) {
        return user.id != id;
    });
    fs.writeFile(db, JSON.stringify(users), function (err) {
        if (!err) {
            res.send(JSON.stringify({code: 1, message: 'ok'}));
        }
        else {
            res.send(JSON.stringify({code: 0, message: err}));
        }
    })
});
app.listen(9090, function () {
    console.log('Listening on 9090');
});