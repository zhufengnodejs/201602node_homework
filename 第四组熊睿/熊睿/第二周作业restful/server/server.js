var http = require('http');             //http模块负责创建服务器/发送请求/接收消息
var fs = require('fs');                 //fs模块负责读写文件及创建文件流

var server = http.createServer(function (req, res) {        //创建服务器，返回实例
    /*`````获取请求行`````*/
    var _url = req.url,                                          //获取请求路径
        _method = req.method,                                    //获取请求方法
        _httpVersion = req.httpVersion;                          //http版本
    var id = _url.substr(_url.lastIndexOf('/') + 1, _url.indexOf('?') === -1 ? _url.length : _url.indexOf('?')); //restful设计的id
    //console.log(_url,_method,_httpVersion);
//-------------------------------------------------------------------------------------------------------------------------//
    /*`````获取请求体`````*/
    var _host = req.headers['host'],                    //请求主机
        _connection = req.headers['connection'],        //连接状态
        _accept = req.headers.accept,                   //接收类型
        _user_agent = req.headers['users-agent'];        //用户代理...
    //console.log(_host,_connection,_accept,_user_agent);
//-------------------------------------------------------------------------------------------------------------------------//
    switch (_method) {                      //根据请求方法名调用相应的方法
        case 'POST':
            if (_url === '/users') {           //表示增加一个用户
                var _user = '';
                req.on('data', function (data) {       //接收请求体
                    _user += data;
                })
                req.on('end', function () {
                    _user = queryStringToObject(_user);
                    var nuser = {
                        id: 0,
                        name: _user.uname,
                        pwd: _user.upwd
                    };
                    fs.readFile(__dirname + '\\..\\db\\users.json', function (err, data) {
                        if (err) {
                            throw Error('读取文件失败');
                        } else {
                            data = JSON.parse(data);
                            var exsited = data.filter(function (item) {
                                return item.id.toString() === _user.id;
                            });
                            if (exsited.length > 0) {
                                res.end();
                            } else {
                                data.sort(function (obj1, obj2) {
                                    return obj1.id - obj2.id;
                                });
                                var _id = _user.id || data[data.length - 1].id + 1;         //生成id
                                nuser.id = parseInt(_id);
                                data.push(nuser);
                                fs.writeFileSync(__dirname + '\\..\\db\\users.json', JSON.stringify(data), {encoding: 'utf-8'});
                                res.end(JSON.stringify(nuser));
                            }
                        }
                    })
                });
                req.on('error', function (err) {
                    console.log(err);
                })
            }
            break;
        case 'PUT':             //更新全部资源(对象覆盖)
            if (_url === "/users/" + id) {
                var _user = '';
                req.on('data', function (data) {
                    _user += data;
                });
                req.on('end', function () {
                    _user = queryStringToObject(_user);
                    _user['id'] = +_user['id'];
                    fs.readFile(__dirname + '\\..\\db\\users.json', function (err, data) {
                        if (err) {
                            throw Error('读取文件失败');
                        } else {
                            data = JSON.parse(data);
                            data = data.map(function (item) {
                                if (item.id === _user.id) {
                                    return _user;
                                } else {
                                    return item;
                                }
                            });
                            var ws = fs.createWriteStream(__dirname + '\\..\\db\\users.json', {
                                flags: 'w',
                                start: 0,
                                highWaterMark: 100
                            })
                           ws.write(JSON.stringify(data));
                            ws.end();
                            ws.on('error',function(err){
                                throw Error(err)
                            })
                            ws.end();
                            res.end(JSON.stringify(_user));
                        }
                    })
                });
                req.on('err', function () {
                    throw Error('PUT参数错误');
                });
            }
            break;
        case 'PATCH':           //更新局部资源(属性覆盖,多余的属性将不会生效)
            if (_url === "/users/" + id) {
                var _user = '';
                req.on('data', function (data) {
                    _user += data;
                });
                req.on('end', function () {
                    _user = queryStringToObject(_user);
                    fs.readFile(__dirname + '\\..\\db\\users.json', function (err, data) {
                        data = JSON.parse(data);
                        data.map(function (item) {
                            if (item.id.toString() === id) {
                                for (var attr in item) {              //如果要增加属性的话则in _user
                                    if (_user.hasOwnProperty(attr) && _user[attr] !== '' && _user[attr] !== null) {
                                        item[attr] = _user[attr];
                                    }
                                }
                                return item;
                            }
                        })
                        var ws = fs.createWriteStream(__dirname + '\\..\\db\\users.json', {
                            flag: 'w',               //read  write  append
                            start: 0,                //从第一个直接开始写
                            highWaterMark: 100       //最高水位线
                        });
                        /*ws.on('drain', function () {
                            ws.write(JSON.stringify(data));     //这里表示解除阻塞后可以继续执行写入操作的
                        });*/
                        ws.write(JSON.stringify(data));         //返回布尔值
                        res.end(JSON.stringify(data[id]));
                    });
                })
                req.on('error', function () {
                    throw Error('接收参数出错！');
                })
            }


            break;
        case 'DELETE':
            if (_url === "/users/" + id) {
                var rf = fs.readFileSync(__dirname + '\\..\\db\\users.json', {encoding: 'utf-8'});
                rf = JSON.parse(rf);
                rf.forEach(function (item, index) {
                    if (item.id.toString() === id) {
                        var rm = rf.splice(index, 1);
                        fs.writeFile(__dirname + '\\..\\db\\users.json', JSON.stringify(rf), {encoding: 'utf-8'}, function (err) {
                            if (err) {
                                throw Error('写入文件失败！');
                            }
                            res.end(JSON.stringify(rm));
                        })
                    }
                });
            }
            break;
        default:
            if (_url === "/favicon.ico") {
                res.end();
            }
            if (_url === "/") {
                /*`````文件读取方式一:文件API异步/同步读取`````*/
                var str = __dirname + '\\..\\client\\index.html';         //获取主页路径
                fs.readFile(str, function (err, data) {                   //异步读取首页文件，同步方法readFileSync();
                    if (err) {                                            //出错抛出异常,一般异步方法利用回调，同步方法直接返回来得到结果
                        console.log(err);
                    } else {                                             //异步返回文件内容
                        res.end(data);
                    }
                });
            } else if (_url === "/main.css") {
                /*`````文件读取方式二：流读``````*/
                var rs = fs.createReadStream(__dirname + '\\..\\client\\main.css', {
                    flags: 'r',
                    start: 1,
                    //encoding:'utf-8',
                    //end:文件.length
                    highWaterMark: 100
                });   //创建可读流
                rs.setEncoding('utf8');             //创建后指定
                //rs.pause();           //暂停触发
                //rs.resume();          //恢复执行
                var _data = '';
                rs.on('data', function (data) {         //监听读到的数据并累积
                    _data += data;
                })
                rs.on('end', function () {              //监听文件读取完毕的事件
                    res.setHeader('Content-Type', 'text/css');
                    res.end(_data);
                })
                rs.on('error', function (err) {         //文件读取错误的事件
                    console.log(err);
                })
            } else if (_url === "/main.js") {
                /*`````文件读取方式三：管道读取`````*/
                res.setHeader('Content-Type', 'text/javascript');
                fs.createReadStream(__dirname + '\\..\\client\\main.js').pipe(res); //从可读流直接连接管道到可写流
            } else if (_url === "/users") {
                fs.createReadStream(__dirname + '\\..\\db\\users.json').pipe(res);
            } else if (_url === "/users/" + id) {
                var rs = fs.createReadStream(__dirname + '\\..\\db\\users.json');
                var _data = '';
                rs.on('data', function (data) {
                    _data += data;
                })
                rs.on('end', function () {
                    _data = JSON.parse(_data);
                    for (var i = 0; i < _data.length; i++) {
                        if (_data[i].id.toString() === id) {
                            res.end(JSON.stringify(_data[i]));
                        }
                    }
                    res.end();
                })
                rs.on('error', function () {
                    throw Error('读取文件失败');
                })
            }
    }
//-------------------------------------------------------------------------------------------------------------------------//
});


server.listen('8900', 'localhost', 511, function () {      //监听端口，主机，连接数，回调
    console.log('server started at port 8900');
})

//将一个查询字符串转成对象
function queryStringToObject(str) {
    if (typeof str !== 'string') {
        throw Error("不是字符串类型");
    }
    var obj = {};
    var strs;
    if (str.startsWith('?')) {
        strs = str.slice(1);
    } else {
        strs = str.slice(0);
    }

    strs = strs.split('&');
    for (var i = 0; i < strs.length; i++) {
        var temp = strs[i].split('=');
        obj[temp[0]] = temp[1];
    }
    return obj;
}