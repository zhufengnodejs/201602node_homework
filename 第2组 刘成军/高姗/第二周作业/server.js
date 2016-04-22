/**
 * Created by xue on 2016-4-18.
 */
var express=require('express');
var app =express();
var fs=require('fs');
var bodyParser=require('body-parser');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.get('/',function(req,res){
	fs.createReadStream('./index.html').pipe(res);
})
app.get('/users',function(req,res){
	var users = JSON.parse(fs.readFileSync('./users.json','utf8'));
	res.send(users)
})
app.post('/users',function(req,res){
	var users = require('./users.json');
	var newUser=req.body;
	newUser.id=users[users.length-1].id+1
	users.push(newUser);
	console.log(users);
	fs.writeFile('./users.json',JSON.stringify(users),function(err){
		if(err){
			console.log(err)
		}
	})
	res.send(req.body)
})
app.patch('/users/:id',function(req,res){
	var newUser=req.body;
	var id=req.params.id;
	var users = require('./users.json');
	users=users.map(function(user){
		if(id==user.id){
			for(var attr in newUser){
				user[attr]=newUser[attr]
			}
			//让更新的对象=数据里更新好的内一项 让newUser有user的id
			newUser=user
			//返回更新好的newUser
			return newUser
		}else{
			//否则把源对象返回
			return user
		}
	})
    //把改好的数据整体从新写入数据
	fs.writeFile('./users.json',JSON.stringify(users),function(err){
		if(err){
			console.log(err)
		}
	})
	res.send(req.body)
})
app.delete('/users/:id',function(req,res){
	var id=req.params.id;
	var users = require('./users.json');
	users=users.filter(function(user){
		return id!=user.id
	})
	console.log(users)
	//把改好的数据整体从新写入数据
	fs.writeFile('./users.json',JSON.stringify(users),function(err){
		if(err){
			console.log(err)
		}
	})
	res.send(req.body)
})
app.listen(8080)

