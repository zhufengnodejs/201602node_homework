var express=require('express');
var fs=require('fs');
var bodyParse=require('body-parser');
var db='./users.json';
var app=express();
app.use(express.static(__dirname));
app.use(bodyParse.urlencoded({extended:true}));
app.get('/', function (req,res) {
    fs.createReadStream('./index.html').pipe(res);
});
app.get('/users', function (req,res) {
    fs.createReadStream('./users.json').pipe(res);
});
app.get('/users/:movie', function (req,res) {
    var arr=[];
    var movie=req.params.movie;
    //var results=require(db);
    var results=JSON.parse(fs.readFileSync(db,'utf8'));
    var result=results.filter(function(result){
        return result.movie==movie;
    })[0];
    arr.push(result);
    res.send(arr);
});
app.post('/users', function (req,res) {
    var user=req.body;
    var users=JSON.parse(fs.readFileSync(db,'utf8'));
    if(users.length==0){
        user.id=1;
    }else {
        user.id=users[users.length-1].id+1;
    }
    users.push(user);
    fs.writeFile(db,JSON.stringify(users), function (err) {
       res.send(user);
    })
});
app.delete('/users/:id', function (req,res) {
    var id=req.params.id;
    var users=JSON.parse(fs.readFileSync(db,'utf8'));
    fs.readFile(db, function (err,data) {
        users=data;
        console.log(users);
    });
    var newUsers=users.filter(function (user) {
        return user.id != id;
    });
    fs.writeFile(db,JSON.stringify(newUsers),function(){
        res.send(newUsers);
    })
});
app.put('/users/:id', function (req,res) {
    var newMovie=req.body;
    var users=JSON.parse(fs.readFileSync(db,'utf8'));
    users=users.map(function (user) {
        if(user.id==req.params.id){
            return newMovie;
        }else {
            return user;
        }
    });
    fs.writeFile(db,JSON.stringify(users),function(){
        res.send(newMovie);
    })
});
app.listen(9090);