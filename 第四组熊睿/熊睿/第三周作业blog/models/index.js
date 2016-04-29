var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;          //ObjectId类型
var config = require('../config');

mongoose.connect(config.dbURL);             //连接mongo数据库

exports.User = mongoose.model('user',new mongoose.Schema({      //定义一个user表的结构
    username:String,
    password:String,
    email:String,
    avatar:String
}));

exports.Article = mongoose.model('article',new mongoose.Schema({
    user:{type:ObjectId,ref:'user'},        //对象ID类型，引用用户模型
    title:String,
    content:String,
    pv:{type:Number,default:0},             //访问量
    poster:String,                          //增加一张图片
    comments:[{user:{type:ObjectId,ref:'user'},content:String,createAt:{type:Date,default:Date.now}}],//评论
    createAt:{type:Date,default:Date.now()}     //创建时间
}));