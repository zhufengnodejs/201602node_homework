/**
 * Created by gnoix on 2016/4/15.
 */
var fs = require('fs');
var  handleDir = function(dir,res){
    fs.readdir(dir, function (err, files) {
        res.end(files.toString());
    })
}
module.exports = handleDir;