/**
 * Created by Administrator on 2016/4/18.
 */
var express = require( 'express' );
var bodyParser = require( 'body-parser' );
//var hotRequire = require( 'hotrequire' );
var db = './users.json';
var fs = require( 'fs' );
var app = express();

//app.use( bodyParser.urlencoded( {extended:true} ) ) ;
app.use( bodyParser.json() ) ;

app.get( '/', function( req, res ) {
    fs.createReadStream( './home.html' ).pipe( res );
});

app.get( '/users', function( req, res ) {
    var users = fs.readFileSync( db, 'utf8' );
    res.send( JSON.parse( users ) );
});
/*
 C:\Users\Administrator.admin1509202209>curl -d "name=dcl&age=12"  "http://localhost:8080/users"

 [{"name":"dcl1","age":1},{"name":"dcl2","age":2},{"name":"dcl3","age":3},{"name"

 :"dcl4","age":4},{"age":5},{"age":6},{"name":"dcl","age":7}]

 C:\Users\Administrator.admin1509202209>
 */
//获取某个对象详情
app.get('/users/:id', function(req, res ){

    var id = req.params.id;
    console.log( 'get:' + id );
    var users = [];
    users = JSON.parse( fs.readFileSync( db, 'utf8' ) ) ;
    if( 1 == users.length ){
        if( id == users[0].id ){
            res.send( users[0] );
        }
    }
    else {
        for( var i = 0, len = users.length; i < len; i ++){
            if( id == users[i].id ){
                res.send( users[i] );
            }
        }

    }

})
//完整更新 请求体里的对象是完整的对象，会整体覆盖原来的对象
app.put('/users/:id', function(req, res ){

    var id = req.params.id;
    //console.log( id );
    var user = req.body ;
    //console.log( user );

    var users = [];
    users = JSON.parse( fs.readFileSync( db, 'utf8' ) ) ;
    if( 1 == users.length ){
        if( user.id = id ){
            fs.writeFile( db, JSON.stringify( user ), function( err ){
                console.log( err );
            });
        }
        res.send( user );
    }
    else {
        for( var i = 0, len = users.length; i < len; i ++){
            if( users[i].id = id ){
                if( user.name ){
                    users[i].name = user.name;
                }
                if( user.age ){
                    users[i].age = user.age;
                }

                fs.writeFile( db, JSON.stringify( users ), function( err ){
                    console.log( err );
                });

            }
            res.send( user );
        }

    }

});
//新增一个用户
app.post( '/users', function( req, res ){
/*var user = req.body ;

    var users = fs.readFileSync( db, 'utf8' );
    if( users ){
        users = JSON.parse( fs.readFileSync( db, 'utf8' ) ) ;
    }
    //console.log( users );
    if( users ){
        user.id = users[ users.length -1].id + 1;
        console.log( JSON.stringify( users ) );
        users.push( user );
        console.log ("allUser:" + JSON.stringify( users ) );
        fs.writeFile( db, JSON.stringify( users ), function( err ){
            console.log( err );
        });
        res.send( users );
    }
    else {
        res.send( user );
    }
    */

    var user = req.body ;
    fs.stat(db,function(err,stat){
        if( 0 == stat.size ){

            fs.writeFile( db, JSON.stringify( user ), function( err ){
                console.log( err );
            });
            res.send( user );

        }else{
            var users = [];
            users = JSON.parse( fs.readFileSync( db, 'utf8' ) ) ;
            if( 1 == users.length ){
                user.id = users[0].id + 1;
                users.push( user );
            }
            else {
                user.id = users[ users.length -1].id + 1;
                users.push( user );
            }
            fs.writeFile( db, JSON.stringify( users ), function( err ){
                console.log( err );
            });

            res.send( user );
        }
    })

})

//更新某个对象 请求体只要传入更新后的字段就可以
//1.查找到要修改的用户对象
//2.修改这个对象
//3.写入文件
//4.把修改后的对象发送给客户端
//patch修改的客户信息 会增加用户的新属性

app.patch( '/users/:id',function( req, res ){
    var id = req.params.id;
    //console.log( id );
    var user = req.body ;
    //console.log( user );

    var users = [];
    users = JSON.parse( fs.readFileSync( db, 'utf8' ) ) ;
    if( 1 == users.length ){
        if( user.id = id ){
            fs.writeFile( db, JSON.stringify( user ), function( err ){
                console.log( err );
            });
        }
        res.send( user );
    }
    else {
        for( var i = 0, len = users.length; i < len; i ++){
            if( users[i].id = id ){
                if( user.name ){
                    users[i].name = user.name;
                }
                if( user.age ){
                    users[i].age = user.age;
                }

                fs.writeFile( db, JSON.stringify( users ), function( err ){
                    console.log( err );
                });

            }
            res.send( user );
        }

    }


} )

//删除用户信息  返回一个空对象
app.delete('/users/:id', function( req, res ){

    var id = req.params.id;
    console.log( id );
    var users = JSON.parse( fs.readFileSync( db, 'utf8' ) ) ;
    users = users.filter( function( user ){
        return user.id != id;
    })
    fs.writeFile( db, JSON.stringify( users ), function( err ){
        console.log( 'delete Error:' + err );
    });

    res.send( {} );

})
app.listen( 8080 );