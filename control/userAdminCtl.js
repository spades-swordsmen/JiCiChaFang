const dbUtil = require("../common/dbUtil");
const config = require("../config");

//显示用户信息列表
function showUserList(req, res) {
    var true_name = req.query.true_name;  //获取管理员的真实姓名
    var currentPage = 1;  //初始化当前页面，值为 1
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    //设置页面最大容许信息条数
    var pageSize = config.pageSize;
    var sql = "select * from t_user_info limit ?,?;" +
        "select count(*) as total from t_user_info;";
    var params = [(currentPage - 1) * pageSize, pageSize];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            //存储信息总条数
            var total = results[1][0].total;
            var pages = Math.ceil(total / pageSize);
            res.render("admin/userList", {
                true_name: true_name,  //管理员真实姓名
                data: results[0],  //所有用户信息
                currentPage: currentPage,  //当前页数
                total: total,  //用户信息总条数
                pages: pages  //总页数
            });
        }
    });
}

//显示要编辑的用户信息页面
function showUserOne(req, res) {
    var user_id = req.query.user_id;
    var true_name = req.query.true_name;
    var sql = "select * from t_user_info where user_id = ?;";
    dbUtil.query(sql, [user_id] , function (err, result) {
        if (err) {
            console.log(err.message);
        } else {
            res.render("admin/editUser", {
                data: result,
                true_name:true_name
            });
        }
    });
}

//修改用户信息
function doModifyUser(req, res) {
    var common = req.body;
    var user_id = common.user_id;
    var nickname = common.nickname;
    var true_name = common.true_name;
    var gender = common.gender;
    var id_card = common.id_card;
    var phone = common.phone;
    var account = common.account;
    var password = common.password;
    var sql = "update t_user_info set nickname = ?,true_name = ?,gender = ?,id_card = ?,phone = ?,account = ?,password = ?" +
        "where user_id = ?;";
    var params = [nickname,true_name,gender,id_card,phone,account,password,user_id];
    dbUtil.query(sql,params,function (err,results) {
        if (err){
            console.log(err.message);
            res.send(
                "<script>alert('修改失败！');" +
                "window.location.href='/adminUser/showUserOne'</script>"
            );
        }else{
            console.log(results);
            res.send(
                "<script>alert('修改成功！');" +
                "window.location.href='/adminUser/showUserList'</script>"
            );
        }
    });

}

//删除用户信息
function doDeleteUser(req, res) {
    var user_id = req.query.user_id;
    var sql = "delete from t_good_comment where user_id = ?;" +
        "delete from t_cart where user_id = ?;" +
        "delete from t_order_info where user_id = ?;" +
        "delete from t_good_collect where user_id = ?;" +
        "delete from t_good_comment where user_id = ?;" +
        "delete from t_user_info where user_id = ?;";
    dbUtil.query(sql,[user_id,user_id,user_id,user_id,user_id,user_id], function (err, result) {
        if (err) {
            res.send(
                "<script>alert('删除失败！');" +
                "window.location.href='/adminUser/showUserList'</script>"
            );
            console.log(err.message);
        } else {
            res.send(
                "<script>alert('删除成功！');" +
                "window.location.href='/adminUser/showUserList'</script>"
            );
            console.log(result);
        }
    });
}

//根据条件搜索用户信息
function doSearchUser(req,res) {
    var searchName = req.body.searchName;
    var true_name = req.query.true_name;
    var currentPage = 1;  //初始化当前页面，值为 1
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    //设置页面最大容许信息条数
    var pageSize = config.pageSize;
    var sql ="select * from t_user_info where true_name like '%"+searchName+"%' limit ?,?;"+
        "select count(*) as total from t_user_info;";
    var params = [(currentPage - 1) * pageSize, pageSize];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            if (results[0].length>0) {
                //存储信息总条数
                var total = results[1][0].total;
                var pages = Math.ceil(total / pageSize);
                res.render("admin/userList", {
                    true_name: true_name,  //管理员真实姓名
                    data: results[0],  //所有用户信息
                    currentPage: currentPage,  //当前页数
                    total: total,  //用户信息总条数
                    pages: pages  //总页数
                });
            } else {
                res.send(
                    "<script>alert('没有搜索到该用户呢，换一个用户名试试吧！');" +
                    "window.location.href='/adminUser/showUserList'</script>"
                );
            }
        }
    });

}

module.exports.showUserList = showUserList;
module.exports.showUserOne = showUserOne;
module.exports.doModifyUser = doModifyUser;
module.exports.doDeleteUser = doDeleteUser;
module.exports.doSearchUser = doSearchUser;
