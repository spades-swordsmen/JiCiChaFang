const dbUtil = require("../common/dbUtil");
const config = require("../config");

//显示商品信息列表页面
function showGoodList(req, res) {
    var true_name = req.query.true_name;  //获取管理员的真实姓名
    var currentPage = 1;  //初始化当前页面，值为 1
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    //设置页面最大容许信息条数
    var pageSize = config.pageSize;
    var sql = "select * from t_good_info limit ?,?;" +
        "select count(*) as total from t_good_info;";
    var params = [(currentPage - 1) * pageSize, pageSize];

    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            //存储信息总条数
            var total = results[1][0].total;
            var pages = Math.ceil(total / pageSize);
            res.render("admin/goodList", {
                true_name: true_name,  //管理员真实姓名
                data: results[0],  //所有订单信息
                currentPage: currentPage,  //当前页数
                total: total,  //订单信息总条数
                pages: pages  //总页数
            });
        }
    });
}

//显示要编辑的商品信息页面
function showGoodOne(req, res) {
    var goods_id = req.query.goods_id;
    var true_name = req.query.true_name;
    var sql = "select * from t_good_info where goods_id = ?;";
    //var sql = sql+"select  current_date(pro_date),current_date(ex_date) from t_good_info where goods_id = ?;";
    dbUtil.query(sql, [goods_id], function (err, result) {
        if (err) {
            console.log(err.message);
        } else {
            res.render("admin/editGood", {
                data: result,
                true_name: true_name
            });
            console.log(result);

        }
    });
}

//修改商品信息
function doModifyGood(req, res) {
    var common = req.body;
    var goods_name = common.goods_name;
    var specification = common.specification;
    var recommended = common.recommended;
    var price = common.price;
    var goods_words = common.goods_words;
    var goods_title = common.goods_title;
    var goods_category = common.goods_category;

    var scenario = common.scenario;
    var stock_quantity = common.stock_quantity;
    var sales_quantity = common.sales_quantity;
    var good_status = common.good_status;
    var goods_id = common.goods_id;
    //图片
    var pic1 = req.body.pic1;
    var pic2 = req.body.pic2;
    var pic3 = req.body.pic3;
    var pic4 = req.body.pic4;
    //获取新上传的文件数目
    var allFlie = req.files;
    var flieNum = [];
    var arr = []
    for (var i in allFlie) {
        flieNum.push(allFlie[i]); //属性
    }
    if (req.files) {
        for(var i = 1 ;i <= flieNum.length;i++){
            if(typeof (req.files.pic1New) != "undefined"){pic1 = req.files.pic1New[0].filename;}
            if(typeof (req.files.pic2New) != "undefined"){pic2 = req.files.pic2New[0].filename;}
            if(typeof (req.files.pic3New) != "undefined"){pic3 = req.files.pic3New[0].filename;}
            if(typeof (req.files.pic4New) != "undefined"){pic3 = req.files.pic4New[0].filename;}
        }
    } else {
    }
    var sql = "update t_good_info set goods_name=?,specification=?,recommended=?,price=?,goods_words=?," +
        "goods_title=?,goods_category=?,scenario=?,stock_quantity=?,sales_quantity=?," +
        "good_status=?,pic1=?,pic2=?,pic3=?,pic4=? where goods_id=?";

    var params = [
        goods_name, specification, recommended, price, goods_words, goods_title, goods_category,
        scenario, stock_quantity, sales_quantity, good_status, pic1,pic2,pic3,pic4,goods_id
    ];
    console.log("goods_id:"+goods_id);
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
            res.send(
                "<script>alert('修改失败！');" +
                "window.location.href='/adminGood/showGoodOne'</script>"
            );
        } else {
            //console.log(results);
            res.send(
                "<script>alert('修改成功！');" +
                "window.location.href='/adminGood/showGoodList'</script>"
            );
        }
    });
}

//删除商品信息
function doDeleteGood(req, res) {
    var goods_id = req.query.goods_id;
    var sql = "delete from t_good_info where goods_id = ?;";
    dbUtil.query(sql, [goods_id], function (err, result) {
        if (err) {
            res.send(
                "<script>alert('删除失败！');" +
                "window.location.href='/adminGood/showGoodList'</script>"
            );
            console.log(err.message);
        } else {
            res.send(
                "<script>alert('删除成功！');" +
                "window.location.href='/adminGood/showGoodList'</script>"
            );
            console.log(result);
        }
    });
}

//根据条件搜索商品信息
function doSearchGood(req, res) {
    var searchName = req.body.searchName;
    var true_name = req.query.true_name;//管理员真实姓名
    var currentPage = 1;  //初始化当前页面，值为 1
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    //设置页面最大容许信息条数
    var pageSize = config.pageSize;
    var sql = "select * from t_good_info " +
        "where goods_name like '%" + searchName + "%' limit ?,?;" +
        "select count(*) as total from t_good_info;";
    var params = [(currentPage - 1) * pageSize, pageSize];
    dbUtil.query(sql, params, function (err, results) {
        console.log("doSearchGood sql"+sql);
        if (err) {
            console.log(err.message);
        } else {
            if (results[0].length>0) {
                console.log("doSearchGood");
                console.log(results[0]);
                //存储信息总条数
                var total = results[1][0].total;
                var pages = Math.ceil(total / pageSize);
                res.render("admin/goodList", {
                    true_name: true_name,  //管理员真实姓名
                    data: results[0],  //所有商品信息
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

//添加商品
function doAddGood(req, res) {
    var common = req.body;
    var goods_name = common.goods_name;
    var specification = common.specification;
    var recommended = common.recommended;
    var price = common.price;
    var goods_words = common.goods_words;
    var goods_title = common.goods_title;
    var goods_category = common.goods_category;

    var scenario = common.scenario;
    var pro_date = common.pro_date;
    var ex_date = common.ex_date;
    var stock_quantity = common.stock_quantity;
    var sales_quantity = common.sales_quantity;
    var good_status = common.good_status;
    //图片
    var pic1;
    var pic2;
    var pic3;
    var pic4;
    if (req.files) {
        pic1 = req.files.pic1[0].filename;
        pic2 = req.files.pic2[0].filename;
        pic3 = req.files.pic3[0].filename;
        pic4 = req.files.pic4[0].filename;
    } else {
        pic1 = req.body.pic1;
        pic2 = req.body.pic2;
        pic3 = req.body.pic3;
        pic4 = req.body.pic4;
    }
    var sql = "insert into t_good_info value(null,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var params = [
        goods_name, specification, recommended, price, goods_words, goods_title, goods_category,
        scenario, pro_date, ex_date, stock_quantity, sales_quantity, good_status, pic1, pic2,pic3,pic4
    ];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
            res.send(
                "<script>alert('添加失败！');" +
                "window.location.href='/adminGood/showGoodOne'</script>"
            );
        } else {
            console.log(results);
            res.send(
                "<script>alert('添加成功！');" +
                "window.location.href='/adminGood/showGoodList'</script>"
            );
        }
    });
}

//上架
function doOpen(req, res) {
    var goods_id = req.query.goods_id;
    var good_status = req.query.good_status;
    var sql = "update t_good_info set good_status = ? where goods_id = ?;";
    var params = [good_status, goods_id];
    dbUtil.query(sql, params, function (err, result) {
        if (err) {
            console.log(err.message);
        } else {
            res.redirect("/adminGood/showGoodList");
        }
    });
}

//下架
function doOff(req, res) {
    var goods_id = req.query.goods_id;
    var good_status = req.query.good_status;
    var sql = "update t_good_info set good_status = ? where goods_id = ?;";
    var params = [good_status, goods_id];

    dbUtil.query(sql, params, function (err, result) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(result);
            res.redirect("/adminGood/showGoodList");
        }
    });
}

//显示商品信息列表页面
module.exports.showGoodList = showGoodList;
//显示要编辑的商品信息页面
module.exports.showGoodOne = showGoodOne;
//修改商品信息
module.exports.doModifyGood = doModifyGood;
//删除商品
module.exports.doDeleteGood = doDeleteGood;
//搜索商品信息
module.exports.doSearchGood = doSearchGood;
//添加商品
module.exports.doAddGood = doAddGood;
//上架
module.exports.doOpen = doOpen;
//下架
module.exports.doOff = doOff;

