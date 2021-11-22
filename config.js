const path=require("path");
module.exports={
    mysql: {
        host: "localhost",   //服务器
        port: "3306",        //端口号
        user: "root",        //用户名
        password: "root",    //密码
        database: "jicichafang_db",   //数据库名称
        multipleStatements:true //允许执行多条语句
    },
    server:{
        host:"localhost",
        port:4000
    },
    curDir:__dirname,
    viewsPath:path.join(__dirname,"views"),
    publicPath:__dirname,
    pageSize:5
};
