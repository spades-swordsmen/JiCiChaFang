const dbUtil = require("../common/dbUtil");
const config = require("../config");

//显示评论信息列表
function showCommentList(req, res) {
    var true_name = req.query.true_name;  //获取管理员的真实姓名
    var currentPage = 1;  //初始化当前页面，值为 1
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    //设置页面最大容许信息条数
    var pageSize = config.pageSize;
    var sql = "select * from t_good_comment limit ?,?;" +
        "select count(*) as total from t_good_comment;";
    var params = [(currentPage - 1) * pageSize, pageSize];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            //存储信息总条数
            var total = results[1][0].total;
            var pages = Math.ceil(total / pageSize);
            res.render("admin/commentList", {
                true_name: true_name,  //管理员真实姓名
                data: results[0],  //所有评论信息
                currentPage: currentPage,  //当前页数
                total: total,  //评论信息总条数
                pages: pages  //总页数
            });
        }
    });
}

//删除评论信息
function doDeleteComment(req, res) {
    var comment_id = req.query.comment_id;
    console.log("comment_id:"+comment_id);
    var sql = "delete from t_good_comment where comment_id = ?;";
    dbUtil.query(sql, [comment_id], function (err, result) {
        if (err) {
            res.send(
                "<script>alert('删除失败！');" +
                "window.location.href='/adminComment/showCommentList'</script>"
            );
            console.log(err.message);
        } else {
            res.send(
                "<script>alert('删除成功！');" +
                "window.location.href='/adminComment/showCommentList'</script>"
            );
            console.log(result);
        }
    });
}

//根据用户昵称条件搜索评论信息
function doSearchComment(req, res) {
    var searchName = req.body.searchName;
    var true_name = req.query.true_name;//管理员真实姓名
    var currentPage = 1;  //初始化当前页面，值为 1
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    //设置页面最大容许信息条数
    var pageSize = config.pageSize;
    var sql = "select * from t_good_comment a,t_user_info b " +
        "where a.user_id = b.user_id and b.nickname like '%" + searchName + "%' limit ?,?;" +
        "select count(*) as total from t_good_comment;";
    var params = [(currentPage - 1) * pageSize, pageSize];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            if (results) {
                //存储信息总条数
                var total = results[1][0].total;
                var pages = Math.ceil(total / pageSize);
                res.render("admin/commentList", {
                    true_name: true_name,  //管理员真实姓名
                    data: results[0],  //所有评论信息
                    currentPage: currentPage,  //当前页数
                    total: total,  //评论信息总条数
                    pages: pages  //总页数
                });
            } else {
                res.send("<script>document.write('没有查到任何东西哦！');</script>");
            }
        }
    });
}

//确认用户评论是否发表
function doPublish(req, res) {
    var true_name = req.query.true_name;
    var comment_id = req.query.comment_id;
    var comment_status = req.query.comment_status;
    var sql = "update t_good_comment set comment_status = ? where comment_id = ?;";
    var params = [comment_status, comment_id];
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    if (Number(comment_status) == 0) {
        dbUtil.query(sql, params, function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                //res.redirect("admin/commentList");
                res.send("<script>alert('已经完成审核！允许发表了');" +
                    "window.location.href='/adminComment/showCommentList'</script>"
                );
            }
        });
    } else {
        dbUtil.query(sql, params, function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                //res.redirect("admin/commentList");
                res.send("<script>alert('已经完成审核！不允许发表');" +
                    "window.location.href='/adminComment/showCommentList'</script>"
                );
            }
        });
    }
}

/*方法暴露*/
//显示评论信息列表页面
module.exports.showCommentList = showCommentList;
//删除评论信息
module.exports.doDeleteComment = doDeleteComment;
//搜索评论信息
module.exports.doSearchComment = doSearchComment;
//确认用户评论是否发表
module.exports.doPublish = doPublish;


