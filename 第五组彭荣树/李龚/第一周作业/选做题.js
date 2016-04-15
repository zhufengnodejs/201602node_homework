function transfer(char) {
    var unicode = char.charCodeAt(0),
        bin = unicode.toString(2);
    console.log(bin);
    var rStr = bin.substr(-6),
        mStr = bin.substr(-12, 6),
        index = bin.indexOf(mStr),
        lStr = bin.substring(0,index);
    console.log(lStr.length);
    if (lStr.length <= 4) {
        var temp_size = 4 - lStr.length;
        console.log(temp_size);
        for (var i = 0; i < temp_size; i++) {
            lStr = '0' + lStr;
            console.log(lStr);
        }
        result = "1110" + lStr + "10" + mStr + "10" + rStr;
    }
    console.log(result);
    return parseInt(result,2).toString(16);
}

var res = transfer('珠');
console.log(res);

//111 001111 100000
//1110xxxx 10xxxxxx 10xxxxxx
//11100111 10001111 10100000

