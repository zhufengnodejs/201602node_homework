var express = require('express');
var app = express();
var fs = require('fs');
var mime = require('mime');
var bodyParser = require('body-parser')
function readFile(fn) {
    var info = '';
    var list = fs.createReadStream('./data.json');
    list.on('data', function (data) {
        info += data;
    });
    list.on('end', function () {
        info = JSON.parse(info);
        fn(info)
    });
};
function writeFile(info,res) {
    fs.writeFile('./data.json', JSON.stringify(info), function (err) {
        readFile(function (info) {
            res.send(info);
        })
    });
}
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.get('/', function (req, res) {
    //fs.createReadStream('./login.html').pipe(res);
    //fs.createReadStream('./ajax.js').pipe(res);
    readFile(function () {
        res.render('index', {
            title: {
                title: "RESTful",
                nav: "注册用户列表"
            },
            userList: arguments[0]
        })
    })
});
app.get('/getlist', function (req, res) {
    var keyWord = req.query.keyWord;
    var sortBy = req.query.sortBy || 1;
    readFile(function (info) {
        var sendData = info.filter(function (iterm) {
            return (iterm.name.indexOf(keyWord) != -1 || iterm.sex.indexOf(keyWord) != -1 || iterm.age == keyWord);
        }).sort(function (a, b) {
            return (a.id - b.id) * Number(sortBy);
        });
        res.send(sendData);
    })
});
app.post('/register', function (req, res) {
    var getInfo = req.body;
    readFile(function (info) {
        getInfo = {
            name: getInfo.name,
            age: getInfo.age,
            sex: getInfo.sex
        };
        getInfo.id = info.length;
        info.push(getInfo);
        writeFile(info,res);
    });
});
app.delete('/delete/:id', function (req, res) {
    var choose = req.body;
    console.log(choose);
    readFile(function (info) {
        var newInfo = info.filter(function (item) {
            return item.id != choose.keyWord;
        });
        console.log(newInfo);
        writeFile(newInfo,res);
    })
});
app.put('/upData/:id', function (req, res) {
    var choose = req.params;
    var newUser = req.body;
    readFile(function (info) {
        var newInfo = info.map(function (item) {
            if (item.id == choose.id) {
                for (var key in newUser) {
                    if (item.hasOwnProperty(key)) {
                        item[key] = newUser[key];
                    }
                }
                newUser = item;
                return newUser;
            } else {
                return item;
            }
        });
        writeFile(newInfo,res);
    })
});
app.listen(8880);