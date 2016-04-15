/**

 * Created by tanxu on 2016/4/11 0011.

 */

function transfer(str){

  var val = new Buffer(str);

  var js = JSON.parse(JSON.stringify(val));

  var str='';

  js.data.forEach(function (item, i) {

    str+=item.toString(16);

  });

  return str;

}

var res = transfer('严');

console.log(res); // 要求输出结果e4b8a5