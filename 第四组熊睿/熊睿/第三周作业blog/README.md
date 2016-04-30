## 02_NODE_EXPRESS_BLOG
运用express搭建的博客

##初始化
    npm install express-generator -g
    mkdir 02_NODE_EXPRESS_BLOC && cd 02_NODE_EXPRESS_BLOC
    npm install
    SET DEBUG=02_NODE_EXPRESS_BLOG:* & npm start

    npm install bower --save
    在public文件夹下新建lib文件夹，表示bower下载文件的存放路径
    在项目根目录下新建.bowerrc文件并写入引用路径 {"directory":"./public/lib"}  //表示以此为引用的根
    bower install bootstrap (用git bash执行)

    npm install express-session --save              //处理session
    npm install connect-mongo --save                //存储session信息到mongo
    npm install connect-flash --save                //提示信息
    npm install mongoose --save                     //链接mongo
    npm install multer --save                       //处理文件
    npm install markdown --save                     //编辑效果

    cd mongo/bin && mongod --dbpath=./data
    新的cmd cd mongo/bin  mongo

##项目开发
    1.创建头部和尾部公共模板
    2.在需要的地方引入 <%- include xxx.ejs %>


##问题
1.enctype=multiparty/form-data  req.body接收不到其他字段的值需要借助multer模块
2.res.redirect()，其后面的代码还会执行，next()后边的代码不会执行
3.populate('user')  ?
4.router.get()记得加/开头



