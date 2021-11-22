const mysql=require("mysql");
const config=require("../config");

var pool=mysql.createPool(config.mysql);

module.exports.query=function (sql,params,callback) {
    pool.getConnection(function (err,conn) {
        if(err){
            console.log("DB connection error!");
            callback(err,null,null);
        }else{
            conn.query(sql,params,function (err,results) {
                conn.release(); //释放连接
                callback(err,results);
            })
        }
    });
}

