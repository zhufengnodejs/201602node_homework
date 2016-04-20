/**
 * Created by XIATIAN on 2016/4/15.
 */
function transfer(char){
    var iUniode = char.charCodeAt(0);
    var hexUnicode = iUniode.toString(16);
    return hexUnicode;
}

/*var res = transfer('李');
 console.log(res);//26446*/

exports.transfer = transfer;