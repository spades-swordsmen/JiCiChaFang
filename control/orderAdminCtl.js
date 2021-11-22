const dbUtil = require("../common/dbUtil");
const config = require("../config");

//显示订单信息列表
function showOrderList(req, res) {
    var true_name = req.query.true_name;  //获取管理员的真实姓名
    var currentPage = 1;  //初始化当前页面，值为 1
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    //设置页面最大容许信息条数
    var pageSize = config.pageSize;
    var sql = "select * from t_order_info limit ?,?;" +
        "select count(*) as total from t_order_info;";
    var params = [(currentPage - 1) * pageSize, pageSize];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            //存储信息总条数
            var total = results[1][0].total;
            var pages = Math.ceil(total / pageSize);
            res.render("admin/orderList", {
                true_name: true_name,  //管理员真实姓名
                data: results[0],  //所有订单信息
                currentPage: currentPage,  //当前页数
                total: total,  //订单信息总条数
                pages: pages  //总页数
            });
        }
    });
}

//显示要编辑的订单信息页面
function showOrderOne(req, res) {
    var order_id = req.query.order_id;
    var true_name = req.query.true_name;
    var sql = "select * from t_order_info where order_id = ?;";
    dbUtil.query(sql, [order_id] , function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(results);
            res.render("admin/editOrder", {
                data: results,
                true_name:true_name
            });
        }
    });
}

//修改订单信息
function doModifyOrder(req, res) {
    var common = req.body;
    var order_id = common.order_id;
    var user_id = common.user_id;
    var goods_price = common.goods_price;
    var addressee = common.addressee;
    var addressee_phone = common.addressee_phone;
    var order_address = common.order_address;
    var sql = "update t_order_info set goods_price = ?,addressee = ?,addressee_phone = ?,order_address = ? " +
        "where order_id =? and user_id = ?;";
    var params = [goods_price,addressee,addressee_phone,order_address,order_id,user_id];
    dbUtil.query(sql,params,function (err,results) {
        if (err){
            res.send(
                "<script>alert('修改失败！');" +
                "window.location.href='/orderAdmin/showOrderOne'</script>"
            );
            console.log(err.message);
        }else{
            if(results){
                res.send(
                    "<script>alert('修改成功！');" +
                    "window.location.href='/adminOrder/showOrderList'</script>"
                );
            }else{
                res.send(
                    "<script>alert('修改失败！');" +
                    "window.location.href='/adminOrder/showOrderOne'</script>"
                );
            }

        }
    });

}

//删除订单信息
function doDeleteOrder(req, res) {
    var order_id = req.query.order_id;
    var sql = "delete from t_order_info where order_id = ?;";
    dbUtil.query(sql, [order_id], function (err, result) {
        if (err) {
            res.send(
                "<script>alert('删除失败！');" +
                "window.location.href='/adminOrder/showOrderList'</script>"
            );
            console.log(err.message);
        } else {
            res.send(
                "<script>alert('删除成功！');" +
                "window.location.href='/adminOrder/showOrderList'</script>"
            );
            console.log(result);
        }
    });
}

//根据条件搜索订单信息
function doSearchOrder(req,res) {
    var searchName = req.body.searchName;
    var true_name = req.query.true_name;
    var currentPage = 1;  //初始化当前页面，值为 1
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    //设置页面最大容许信息条数
    var pageSize = config.pageSize;
    var sql ="select * from t_order_info a,t_user_info b " +
        "where a.user_id = b.user_id and b.true_name like '%"+searchName+"%' limit ?,?;"+
        "select count(*) as total from t_order_info;";
    var params = [(currentPage - 1) * pageSize, pageSize];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            if (results) {
                //存储信息总条数
                var total = results[1][0].total;
                var pages = Math.ceil(total / pageSize);
                res.render("admin/orderList", {
                    true_name: true_name,  //管理员真实姓名
                    data: results[0],  //所有订单信息
                    currentPage: currentPage,  //当前页数
                    total: total,  //订单信息总条数
                    pages: pages  //总页数
                });
            } else {
                res.send("<script>document.write('没有查到任何东西哦！');</script>");
            }
        }
    });
}

//发货
function doShipment(req,res) {
    var order_id = req.query.order_id;
    var sql = "update t_order_info set order_status = '1' where order_id = ?;";
    dbUtil.query(sql,[order_id],function (err,result) {
        if(err){
            console.log(err.message);
        }else{
            res.send("<script>alert('已发货！');location.href='/adminOrder/showOrderList'</script>");
        }
    });
}

/*方法暴露*/
//显示订单信息列表页面
module.exports.showOrderList = showOrderList;
//显示要编辑的订单信息页面
module.exports.showOrderOne = showOrderOne;
//修改订单信息
module.exports.doModifyOrder = doModifyOrder;
//删除订单信息
module.exports.doDeleteOrder = doDeleteOrder;
//搜索订单信息
module.exports.doSearchOrder = doSearchOrder;
//发货
module.exports.doShipment = doShipment;

