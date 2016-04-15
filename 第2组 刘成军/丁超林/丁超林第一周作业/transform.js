/**
 * Created by Administrator on 2016/4/12 0012.
 */
function transfer( char ){
    var str = char;
    var code10 = str.charCodeAt( 0 );
    var codebin = (code10).toString( 2 );
    console.log( codebin );
    var ucode = '';//1110xxxx 10xxxxxx 10xxxxxx
    var curIndex = codebin.length;
    var sixbinR6 = codebin.slice( curIndex - 6, curIndex );
    curIndex -= 6;
    var sixbin6 = codebin.slice( curIndex - 6, curIndex )
    curIndex -= 6;
    var sinbinL = codebin.slice( 0, curIndex );
    var ext = '';
    for( var i = 0, len = sinbinL.length; i < 4 - len; i++ ){
        ext += '0';
    }
    sinbinL = '1110' + ext + sinbinL;
    sixbinR6 = '10' + sixbinR6;
    sixbin6 = '10' + sixbin6;
    ucode = sinbinL + sixbin6 + sixbinR6;
    var ucode10 = parseInt( ucode, 2 );
    console.log( (ucode10).toString( 16 ) );

}

transfer('严');//e4b8a5
