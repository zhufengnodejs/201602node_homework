var crypto = require('crypto');
var md5 =function(input){
    return crypto.createHash('md5').update(input).digest('hex');  //16进制输出
}
exports.md5 = md5;