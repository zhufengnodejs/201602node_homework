# NODEJS_RESTFUL_ORIGIN
node原生模块的restful应用

#总结的几个小问题
1.typeof req  -->object，但它不是json格式，不能用JSON.stringify()方法/       其表现为 IncomingMessage {}形式
2.获取__dirname的上一级别目录是 __dirname+'\\..\\XXX';
3.获取请求行req.url/req.method/req.httpVersion
4.req.params.id需要express模块(不需要body-parser)
5.fs.writeFileSync没有返回值，异步方法也是
6.res是一个可写流，res.end（）如果还有逻辑的话，不会终止，会继续执行
7.PATCH方式，PATCH必须大写
8.arr.map一般用来对元素进行操作,arr.filter一般用来根据条件返回数据,两个方法均返回一个新数组，原数组不变
9.fs.createWriteStrem的on('drain')表示只写数据流已将缓存里的数据写入目标，要确定好终止条件，否则可能出现内存爆仓的情况

#访问方式：
    1.node server.js
    2.http://localhost:8900