var fs = require('fs');
var path = require('path');
var app = require('express')();
var cwd = process.cwd();
var sep = path.sep;
app.get('/', function (req, res) {          //访问根路径
    fs.createReadStream(cwd + sep + 'client' + sep + 'index.html').pipe(res);   //读取文件写入响应
});
app.get('/users', function (req, res) {
    fs.readFile(cwd + sep + 'db' + sep + 'userinfo.json', function (err, data) {    //直接相应文件内容
        res.end(data);
    })
});
app.get('/users/:id', function (req, res) {
    console.log('/users/:id');
    fs.readFile(cwd + sep + 'db' + sep + 'userinfo.json',function(err,data){
        var result = new Function('return '+data)();    //获取数据转成数组
        var id = req.params.id;                         //获取id
        result = result.filter(function(user){          //过滤数据
            return user.id == id;
        })
        res.send(result[0]);                            //响应
    })
});
app.post('/users', function (req, res) {
    console.log(req.id);
    console.log(req.body)
    res.end('post');
});
app.put('/users/:id', function (req, res) {
    res.end('put');
});
app.patch('/users/:id', function (req, res) {
    res.end('patch');
});
app.delete('/users', function (req, res) {
    ren.end('delete');
});
app.all('*', function (req, res) {
    res.end('not found');
})

app.listen(8888);