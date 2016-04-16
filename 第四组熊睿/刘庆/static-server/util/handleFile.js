var fs = require('fs');
var handleFile = function(filename,res){
    fs.readFile(filename,'utf8',function(err,data){
        if(err){
            console.log('读取文件错误！');
            return;
        }
        res.end(data);
    })
}
module.exports = handleFile;