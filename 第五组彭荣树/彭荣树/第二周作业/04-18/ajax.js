(function () {
    this.http = function (settings) {
        //设置默认的参数
        var defaultOption = {
            'method': 'get',//默认走Get
            'cache': false,//是否走缓存
            'url': '',
            'data': {},//需要发送的数据
            'dataType': 'text',//服务端返回的数据格式
            'status': {},//不同的状态码执行不同的方法
            'contentType': 'application/x-www-form-urlencoded',//规定发送给服务端的是什么类型的数据格式 uri查询字符串还是json 默认uri
            'header': {},//向服务端发送的头信息
            'success': function () {
            },//成功执行的函数
            'error': function () {
            },//失败执行的函数
            'async': true,//规定是否异步
            'complete': function () {
            },//无论成功失败都执行的函数
            'mimeType': '',//向服务端设置mime类型
            'beforeSend': function () {
            },//在发送前执行的函数
            'time': 0,//设置超时时间
            'context': window,//设置回调执行的this的指向
            'userName': undefined,
            'passWord': undefined
        }, tempEle;
        util.iteral(defaultOption, function (item, key) {
            settings[key] = settings[key] || item;
        });
        //console.log(settings);
        //请求的方式
        var methodReg = /^(get|post|delete|put|head)$/g;
        if (methodReg.test(settings.method) == false) {
            return new Error('method is wrong');
        }
        //get系的请求方式
        var getMethodReg = /^(get|head)$/g;
        //如果是get系的请求
        tempEle = [];
        if (util.isObject(settings.data)) {
            util.iteral(settings.data, function (item, i) {
                tempEle.push(i + '=' + item);
            });
            tempEle = tempEle.join('&');
            settings.data = tempEle;
        }
        if (getMethodReg.test(settings.method)) {
            settings.url = util.hasMark(settings.url, tempEle);
            settings.data = void 0;
        }
        //是否走缓存
        if (settings.cache == false) {
            settings.url = util.hasMark(settings.url, '_=' + (Math.random() * 0xffffff | 0))
        }
        var xhr = util.getXhr();
        xhr.open(settings.method, settings.url, settings.async, settings.name, settings.passWord);

        //重写mimeType 即文件的 类型
        settings.mimeType && xhr.overrideMimeType(settings.mimeType);

        settings.contentType && (settings.header['content-type'] = settings.contentType);
        //设置返回给服务端的都信息
        util.iteral(settings.header, function (value, key) {
            xhr.setRequestHeader && xhr.setRequestHeader(key, value);
        });

        //提供链式调用
        var deferred = new Deferred();
        //统一处理成功失败
        settings.success = util.bind(settings.success, settings.context);
        settings.error = util.bind(settings.error, settings.context);
        settings.complete = util.bind(settings.error, settings.context);
        var success = function (context, header) {
            settings.success(context, header);
            settings.complete(context, header);
            deferred.promise.onSuccess(context,header);
        };
        var error = function (status, header) {
            settings.error(status, header);
            settings.complete(status, header);
            deferred.promise.onError(status,header);
        };

        //ajax四部曲 获得xhr对象

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                // 一旦ajax完成 无论状态码是多少,就可以执行 不同状态码对应的函数
                tempEle = settings.status[xhr.status];
                util.isFunction(tempEle) && tempEle();
                if (/^2\d{2}/g.test(xhr.status)) {
                    tempEle = xhr.responseText;
                    if (settings.dataType.toLocaleLowerCase() == 'json') {
                        tempEle = JSON.parse(tempEle);
                    }
                    //处理成功逻辑
                    success(tempEle, xhr.getAllResponseHeaders());
                }
                //处理失败逻辑
                if (/^(4|5)\\d{2}/g.test((xhr.status))) {
                    error(xhr.status, xhr.getAllResponseHeaders());
                }
            }
        };
        //在发送前执行的函数
        settings.beforeSend();
        xhr.send(settings.data);
        return deferred;
    }
})();
//Promise 链式调用
var Promise = function () {
    this.onSuccess = this.onError = new Function;
    this.promise = true;
};
Promise.prototype.success = function (suc) {
    if (util.isFunction(suc)) {
        this.onSuccess = suc;
    }
};
Promise.prototype.error = function (err) {
    if (util.isFunction(err)) {
        this.onError = err;
    }
};
var Deferred = function(){
    this.status = 'init';
    this.promise = new Promise();
};
Deferred.prototype.fail = function(fn){
    this.promise.error(fn);
    this.status ="fail";
    return this;
};
Deferred.prototype.done = function(fn){
    this.promise.success(fn);
    this.status = 'done';
    return this;
};
var util = {
    bind: (function () {
        if (Function.prototype.bind) {
            return function (fn, context) {
                return fn.bind(context)
            }
        }
        return function (fn, context) {
            return function () {
                fn.apply(context, arguments);
            }
        }
    })(),
    parse: function (data) {
        if (window.JSON) {
            return JSON.parse(data);
        }
        return new (Function('return ' + data))();
    },
    hasMark: function (url, data) {
        var str = '';
        if (/\?/.test(url)) {
            str = '&';
        } else {
            str = '?';
        }
        return url + str + data

    },
    getXhr: (function () {
        var list = [function () {
            return new XMLHttpRequest();
        }, function () {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }, function () {
            return new ActiveXObject('MsXML2.XMLHTTP');
        }, function () {
            return new ActiveXObject('MsXML3.XMLHTTP');
        }];
        for (var i = 0, len = list.length; i < len; i++) {
            try {
                return list[i];
            } catch (e) {
                continue;
            }
        }
        return new Error('not support xhr');
    })(),
    //兼容数组遍历方法
    each: (function () {
        if ([].forEach) {
            return function (item, fn) {
                item.forEach(fn, arguments[2]);
            }
        } else {
            return function (item, fn) {
                for (var i; i < item.length; i++) {
                    fn.call(arguments[2], item[i], i, item);
                }
            }
        }
    })(),
    //forIn方法
    forIn: function (item, fn) {
        for (var key in item) {
            fn.call(arguments[2], item[key], key, item);
        }
    }
    ,
    iteral: function (list) {
        if (util.isArray(list)) {
            util.each.apply(null, arguments);
        }
        if (util.isObject(list)) {
            util.forIn.apply(null, arguments);
        }
    }
    ,
    isType: function (type) {
        return function (list) {
            return Object.prototype.toString.call(list) == '[object ' + type + ']';
        }
    }
    ,
//init
    init: function () {
        this.each(['Array', 'Object', 'String', 'Number', 'Boolean', 'Function'], function (item) {
            this['is' + item] = this.isType(item)
        }, this)
    }
};
util.init();

