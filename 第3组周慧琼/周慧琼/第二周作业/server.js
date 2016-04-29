/**
 * Created by HOME on 2016/4/20.
 */
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    http = require('http'),
    db = './public/js/data.json';
    //queryString = require('query');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname+'/public')));
app.use(function(req,res,next){
    next();
});
app.get('/',function(req,res){
    res.setHeader('Content-Type','text/html;charset=utf-8');
    fs.createReadStream('./index.html').pipe(res);
});
// app.get('/public/minCss/main.css',function(req,res){
//     fs.createReadStream('.'+req.url).pipe(res);
// });
// app.get('/public/js/main.js',function(req,res){
//     res.setHeader('Content-Type','text/html;charset=utf-8');
//     fs.createReadStream('.'+req.url).pipe(res);
// });
app.get('/get',function(req,res){
    //fs.readFile(db,function(err,data){
    //    res.send(data.toString());
    //});
    res.send(JSON.parse(fs.readFileSync(db,'utf8')));
    //res.setHeader('Content-Type','application/json;charset=utf-8');
    //fs.createReadStream('./public/js/data.json').pipe(res);
    //res.end();
    //
});

app.post('/delete',function(req,res){
    var dbDate = JSON.parse(fs.readFileSync(db,'utf8'));
    req.on('data',function(data){
       var id = JSON.parse(data.toString()).id;
        dbDate.forEach(function(item,index){
            if(item.id == id){
                dbDate.splice(index,1);
            }
        });
        res.send(JSON.stringify(dbDate));
        fs.writeFileSync('./public/js/data.json',JSON.stringify(dbDate));
    });
});
app.put('/edit/:id/:name/:age',function(req,res){
    var dbDate = JSON.parse(fs.readFileSync(db,'utf8'));
    var id = req.params.id;
    dbDate.forEach(function(item,index){
        if(item.id == id){
            dbDate[index].name = req.params.name;
            dbDate[index].age = req.params.age;
        };
    });
    res.send(JSON.stringify(dbDate));
    fs.writeFileSync('./public/js/data.json',JSON.stringify(dbDate));
});
app.post('/add',function(req,res){
    var dbDate = JSON.parse(fs.readFileSync(db,'utf8'));
    var allDate = "";
    req.on('data',function(data){
        allDate += data.toString();
    });
    req.on("end",function(){
        var dataObj = JSON.parse(allDate);
        var obj = {
            "id":  dbDate.length + 1,
            "name": dataObj.name,
            "age": dataObj.age
        };
        dbDate.push(obj);
        res.send(JSON.stringify(dbDate));
        fs.writeFileSync('./public/js/data.json',JSON.stringify(dbDate));
    });
});
app.listen(8081);
