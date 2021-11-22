const dbUtil = require("../common/dbUtil");
const config = require("../config");

//显示首页
function showIndex(req, res) {
    var sql = "select * from t_good_info where good_status=2;;";
    var currUser = req.session.currUser;
    if (currUser) {  //用户登录后渲染的首页
        dbUtil.query(sql, null, function (err, results) {
            if (err) {
                res.render("404", {data: err.message});
            } else {
                res.render("index", {
                    goodInfo: results,
                    true_name: currUser.true_name,
                    account: currUser.account,
                    user_id: currUser.user_id
                });
            }
        });
    } else {//用户未登录渲染的首页
        dbUtil.query(sql, null, function (err, results) {
            if (err) {
                res.render("404", {data: err.message});
            } else {
                res.render("index", {
                    goodInfo: results,
                    true_name: req.session.true_name,
                    account: req.session.account,
                    user_id: req.session.user_id
                });
            }
        });
    }
}

/*判断账号是否存在*/
function accountIsExist(account, callback) {
    var sql = "select * from t_user_info where account = ?;";
    var params = [account];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            if (results.length > 0) {
                callback(err, true);
            } else {
                callback(err, false);
            }
        }
    });
}

//登录
function doLogin(req, res) {
    var account = req.body.account;
    var password = req.body.password;
    var sql = "select * from t_user_info where account = ? and password = ?";
    var params = [account, password];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            res.render("404", {data: err.message});
            res.send("<script>alert('账号不存在！请检查后再次登录或进行注册。');window.location.href='/login';</script>");
        } else {
            if (results.length > 0) {
                //保存用户名信息
                req.session.currUser = results[0];
                if (results[0].rank == 1) {// 1 代表管理员
                    res.render("admin/default", {true_name: req.session.currUser.true_name});
                } else {//普通用户
                    res.send("<script>alert('登录成功！');window.location.href='/';</script>");
                }
            } else {
                res.send("<script>alert('账号或密码错误！请重新登录。');window.location='/login'</script>");
            }
        }
    });
}

//注册
function doRegister(req, res) {
    var common = req.body;
    var nickname = common.nickname;
    var true_name = common.true_name;
    var phone = common.phone;
    var account = common.account;
    var password1 = common.password1;
    var password2 = common.password2;
    accountIsExist(account, function (err, flag) {
        if (flag) {
            res.send("<script>alert('账号已存在，请重新输入！');window.location.href='/register'</script>")
        } else {
            var sql = "insert into t_user_info values (null,?,?,null,null,?,?,?,null,null,null,0);";
            var params = [nickname, true_name, phone, account, password1];
            console.log(params);
            //判断两次密码输入是否相同
            if (password1 == password2) {
                dbUtil.query(sql, params, function (err, results) {
                    if (err) {
                        res.send(err.message);
                    } else {
                        res.send("<script>alert('注册成功!马上去登录吧！');window.location.href='/login'</script>")
                    }
                })
            } else {
                res.send("<script>alert('两次密码不相同，请重新密码！');window.location.href='/register'</script>")
            }
        }
    });
}


//显示个人中心
function showPersonal(req, res) {
    var currUser = req.session.currUser;
    //判断该用户是否登录
    if (currUser) {
        var user_id = currUser.user_id;
        var true_name = currUser.true_name;
        var account = currUser.account;
        var sql = "select * from t_user_info where user_id = ? and account = ?;" +
            "select * from t_order_info where user_id = ?;" +
            "select * from t_good_comment where user_id = ?;";
        var params = [user_id, account, user_id, user_id];
        dbUtil.query(sql, params, function (err, results) {
            if (err) {
                res.render("404", {data: err.message});
            } else {
                console.log(results[1]);
                res.render("user/personal", {
                    user_info: results[0],
                    order_info: results[1],
                    comment_info: results[2],
                    user_id: user_id,
                    true_name: true_name,
                    account: account
                });
            }
        });
    } else {
        res.send("<script>alert('请先登录！');window.location.href='/login'</script>");
    }
}

//修改个人信息
function doModifyPersonalInfo(req, res) {
    var user_id = req.query.user_id;
    var id = req.query.id;
    var params;
    var sql;
    var consignee;
    var consignee_phone;
    var consign_address;
    /*id 为1则是修改用户主要信息，为2则是修改用户收件信息*/
    if (id == 1) {
        var true_name = req.body.true_name;
        var gender = req.body.gender;
        var id_card = req.body.id_card;
        var phone = req.body.phone;
        var password = req.body.password;
        params = [true_name, gender, id_card, phone, password, user_id];
        console.log(params);
        sql = "update t_user_info set true_name = ?,gender = ?,id_card = ?,phone = ?,password = ? where user_id = ?;";
        dbUtil.query(sql, params, function (err, result) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(result);
                //res.redirect("/showPersonal");
                res.send("<script>alert('修改成功！');window.location.href='/showPersonal'</script>");
            }
        });
    } else if (id == 2) {
        consignee = req.body.consignee;
        consignee_phone = req.body.consignee_phone;
        consign_address = req.body.consign_address;
        params = [consignee, consignee_phone, consign_address, user_id];
        sql = "update t_user_info set consignee = ?,consignee_phone = ?,consign_address = ? where user_id = ?;";
        dbUtil.query(sql, params, function (err, result) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(result);
                //res.redirect("/showPersonal");
                res.send("<script>alert('修改成功！');window.location.href='/showPersonal'</script>");
            }
        });
    } else {
        consignee = req.body.consignee;
        consignee_phone = req.body.consignee_phone;
        consign_address = req.body.consign_address;
        params = [consignee, consignee_phone, consign_address, user_id];
        sql = "update t_user_info set consignee = ?,consignee_phone = ?,consign_address = ? where user_id = ?;";
        dbUtil.query(sql, params, function (err, result) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(result);
                res.send("<script>alert('修改成功！');window.location.href='/showViewOrder'</script>");
            }
        });
    }
}

//结算
function doClearingAccount(req, res) {
    var user_id = req.session.currUser.user_id;
    var true_name = req.session.currUser.true_name;
    var goods_id = req.query.goods_id;
    var totals = req.query.totals;
    var quantity = req.query.quantity;
    console.log("goods_id:", goods_id);
    var flag = typeof (goods_id);
    if (flag == 'string') {
        var goods_idArray = [];
        goods_id.split("");
        console.log("length:", goods_id.length);
        for (var i = 0; i < goods_id.length; i++) {
            if (i == 0 || i % 2 !== 0) {
                var num = Number(goods_id[i]);
                goods_idArray.push(num);
            }
        }
        console.log("1:",goods_idArray);
    }
    //为1，则表示是从购物车进入的订单页面;为2，则表示是从其他页面进入的订单页面;为3，则表示是从商品详情页面进入的订单页面
    var path = req.query.path;
    var sql;
    var params;
    var good_info;
    var user_info;
    if (path == 1) {
        if (goods_idArray.length > 1) {
            var goods_id1 = goods_idArray[0];
            var goods_id2 = goods_idArray[1];
            sql = "select * from t_good_info where goods_id = ?;" +
                "select * from t_good_info where goods_id = ?;" +
                "select * from t_user_info where user_id = ?;";
            params = [goods_id1,goods_id2,user_id];

        } else {
            sql = "select * from t_good_info where goods_id = ?;" +
                "select * from t_user_info where user_id = ?;";
            params = [goods_id,user_id];
        }
        dbUtil.query(sql, params, function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                //console.log(results[0]);
                res.render("user/order", {
                    good_info: results[0],
                    user_info: results[1],
                    quantity: quantity,
                    totals: totals,
                    user_id: user_id,
                    true_name: true_name,
                    path: path
                });
            }
        });
    } else if (path == 2) {
        if (req.session.currUser) {
            sql = "select * from t_good_info where goods_id = ?;" +
                "select * from t_user_info where user_id = ?;";
            dbUtil.query(sql, [goods_id, user_id], function (err, results) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(results[1]);
                    res.render("user/order", {
                        good_info: results[0],
                        user_info: results[1],
                        quantity: quantity,
                        totals: totals,
                        user_id: user_id,
                        true_name: true_name,
                        path: path
                    });
                }
            });
        } else {
            res.send("<script>alert('请先登录！');window.location.href='/login'</script>");
        }

    } else {
        if (req.session.currUser) {
            sql = "select * from t_good_info where goods_id = ?;" +
                "select * from t_user_info where user_id = ?;";
            dbUtil.query(sql, [goods_id, user_id], function (err, results) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(results[1]);
                    res.render("user/order", {
                        good_info: results[0],
                        user_info: results[1],
                        quantity: quantity,
                        totals: totals,
                        user_id: user_id,
                        true_name: true_name,
                        path: path
                    });
                }
            });
        } else {
            res.send("<script>alert('请先登录！');window.location.href='/login'</script>");
        }

    }

}

function doClearing(req, res) {
    var user_id = req.session.currUser.user_id;
    var goods_id = req.body.goods_id;
    var goods_name = req.body.goods_name;
    var goods_number = req.body.goods_number;
    var goods_price = req.body.goods_price;
    var total_price = req.body.total_price;
    var goods_version = req.body.goods_version;
    var note = req.body.note;
    var addressee = req.body.addressee;
    var addressee_phone = req.body.addressee_phone;
    var order_address = req.body.order_address;
    var params = [user_id, goods_id, goods_name, goods_number, goods_price, total_price, goods_version, 0];
    console.log(params);
    var sql = "insert into t_order_info (user_id,goods_id,goods_name,goods_number,goods_price,total_price,goods_version,order_status) values (?,?,?,?,?,?,?,?);";
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(results[1]);
            res.send("<script>alert('订单已提交，静等货品的到来哦！');window.location.href='/'</script>");

        }
    });
}


//查看个人订单（未测试）
//function showViewOrder(req, res) {
//    var user_id = req.session.currUser.user_id;
//    var true_name = req.session.currUser.true_name;
//    var order_id = req.query.order_id;
//    var path = req.query.path;  //为1，则表示是从个人中心进入的订单页面
//    var sql = "select * from t_order_info where user_id = ? and order_id = ?;" +
//        "select * from t_user_info where user_id = ?;";
//    dbUtil.query(sql, [user_id, order_id, user_id], function (err, results) {
//        if (err) {
//            console.log(err.message);
//        } else {
//            console.log(results[1]);
//            res.render("user/order", {
//                order_info: results[0],
//                user_info: results[1],
//                user_id: user_id,
//                true_name: true_name,
//                path: path
//            });
//        }
//    });
//}

//删除个人评论
function doDelComment(req, res) {
    var comment_id = req.query.comment_id;
    var sql = "delete from t_good_comment where comment_id = ?;";
    dbUtil.query(sql, [comment_id], function (err, result) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(result);
            res.send("<script>alert('删除成功！');window.location.href='/showPersonal';</script>");
        }
    });
}

//搜索商品
function doSearchGoods(req, res) {
    var goods_name = req.body.goods_name;
    var currentPage = 1;  //初始化当前页面，值为 1
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    //设置页面最大容许信息条数
    var pageSize = config.pageSize;
    //查询已“上架”的商品信息进行渲染
    var sql = "select * from t_good_info where goods_name like '%" + [goods_name] + "%' and good_status = '2' limit ?,?;" +
        "select count(*) as total from t_good_info where goods_name like '%" + [goods_name] + "%' and good_status = '2';";
    var params = [(currentPage - 1) * pageSize, pageSize];
    //判断搜索框是否有内容
    if (goods_name) {
        dbUtil.query(sql, params, function (err, result) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(result);
                //存储信息总条数
                var total = result[1][0].total;
                var pages = Math.ceil(total / pageSize);
                res.render("goodList", {
                    goodInfo: result[0],
                    currentPage: currentPage,  //当前页数
                    total: total,  //商品信息总条数
                    pages: pages,  //总页数
                    status: '1'//搜索出商品的结果
                });
            }
        });
    } else {
        res.send("<script>alert('默认显示以下内容');location.href='/showGoodList'</script>");
    }
}

//显示商品列表页面（用户未登录可以查看）
function showGoodList(req, res) {
    var currUser = req.session.currUser;
    var currentPage = 1;  //初始化当前页面，值为 1
    //判断当前页面是否在首页
    if (req.query.currentPage) {
        currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
    }
    //设置页面最大容许信息条数
    var pageSize = config.pageSize;
    //查询已“上架”的商品信息进行渲染
    var sql = "select * from t_good_info where good_status = '2' limit ?,?;" +
        "select count(*) as total from t_good_info;";
    var params = [(currentPage - 1) * pageSize, pageSize];
    if (currUser) {  //已登录渲染的商品页面
        dbUtil.query(sql, params, function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                //存储信息总条数
                var total = results[1][0].total;
                var pages = Math.ceil(total / pageSize);
                res.render("goodList", {
                    goodInfo: results[0],
                    currentPage: currentPage,  //当前页数
                    total: total,  //订单信息总条数
                    pages: pages,  //总页数
                    status: '0',  //所有商品
                    true_name: currUser.true_name,
                    account: currUser.account,
                    user_id: currUser.user_id
                });
            }
        });
    } else {  //未登录渲染的商品页面
        dbUtil.query(sql, params, function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                //存储信息总条数
                var total = results[1][0].total;
                var pages = Math.ceil(total / pageSize);
                res.render("goodList", {
                    goodInfo: results[0],
                    currentPage: currentPage,  //当前页数
                    total: total,  //订单信息总条数
                    pages: pages,  //总页数
                    status: '0',  //所有商品
                    true_name: req.session.true_name,
                    account: req.session.account,
                    user_id: req.session.user_id
                });
            }
        });
    }
}

//显示商品详情页面(用户未登录可以查看该页面，但不能进行加入购物车、立即购买、评论操作)
function showGoodDetail(req, res) {
    var currUser = req.session.currUser;
    var goods_id = req.query.goods_id;
    var sql;
    if (currUser) {  //用户登录后显示的商品详情页面
        var user_id = currUser.user_id;
        var true_name = currUser.true_name;
        sql = "select * from t_good_info where goods_id = ?;" +
            "select * from t_good_comment where goods_id = ?;" +
            "select * from t_order_info where goods_id = ? and user_id = ?;" +
            "select * from t_good_collect where goods_id = ? and user_id = ?;";
        dbUtil.query(sql, [goods_id, goods_id, goods_id, user_id, goods_id, user_id], function (err, results) {
            if (err) {
                res.render("404", {data: err.message});
            } else {
                var order_status;
                var collect_status;
                //console.log(results[2]===[]);
                if (results[2].length > 0) {
                    //results[2] 为空数组，则用户未购买此商品
                    if (results[2][0].order_status == "0") {
                        order_status = "0";
                    } else if (results[2][0].order_status == "1") {
                        order_status = "1";
                    } else {
                        order_status = "3";
                    }
                } else {
                    order_status = "3";
                }
                if (results[3].length > 0) {
                    //results[3] 为空数组，则用户未收藏此商品
                    if (results[3][0].collect_status == 1) {
                        collect_status = 1;
                    } else {
                        collect_status = 2;
                    }
                } else {
                    collect_status = 2;
                }

                console.log(order_status);
                console.log(collect_status);
                console.log(results[3]);
                res.render("goodDetail", {
                    goodInfo: results[0],  //商品信息
                    commentInfo: results[1],  //评价信息
                    order_status: order_status,  //订单状态，用来判断用户是否可以评论的标准('0'表示未发货，'1'表示发货)
                    collect_status: collect_status,  //商品收藏与否：1表示已收藏
                    user_id: user_id,  //用户ID，用于评论
                    true_name: true_name
                });
            }
        });
    } else {  //用户未登录显示的商品详情页面
        sql = "select * from t_good_info where goods_id = ?;" +
            "select * from t_good_comment where goods_id = ?;";
        dbUtil.query(sql, [goods_id, goods_id, goods_id], function (err, results) {
            if (err) {
                res.render("404", {data: err.message});
            } else {
                console.log(results[1]);
                res.render("goodDetail", {
                    goodInfo: results[0],  //商品信息
                    commentInfo: results[1],  //评价信息
                    order_status: '2',  //2表示用户未登录，不能进行评价
                    collect_status: {collect_status: 2},
                    user_id: req.session.user_id,
                    true_name: req.session.true_name
                });
            }
        });
    }
}

//商品评价操作
function doCommentGood(req, res) {
    var goods_id = req.query.goods_id;
    var goods_name = req.query.goods_name;
    var user_id = req.session.currUser.user_id;
    var true_name = req.session.currUser.true_name;
    var content = req.body.content;
    var sql = "insert into t_good_comment values(null,?,?,?,?,?,1);";
    var params = [user_id, goods_id, true_name, goods_name, content];
    dbUtil.query(sql, params, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send("<script>alert('评价已提交，请等待管理员审核！');window.location.href='/showGoodDetail?goods_id=" + goods_id + "';</script>");
        }
    });
}

//显示收藏页面
function showCollectGood(req, res) {
    //用户登录则不能进入“我的收藏”页面
    if (req.session.currUser) {
        var user_id = req.session.currUser.user_id;
        var true_name = req.session.currUser.true_name;
        //分页
        var currentPage = 1;  //初始化当前页面，值为 1
        //判断当前页面是否在首页
        if (req.query.currentPage) {
            currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
        }
        //设置页面最大容许信息条数
        var pageSize = config.pageSize;
        //查询已“上架”的商品信息进行渲染
        var sql =
            "select * from t_good_collect where user_id = ? limit ?,?;" +
            "select count(*) as total from t_good_collect where user_id = ?;" +
            "select b.good_status from t_good_collect a,t_good_info b " +
            "where a.goods_id = b.goods_id and a.user_id = ?;";
        var params = [user_id, (currentPage - 1) * pageSize, pageSize, user_id, user_id];
        dbUtil.query(sql, params, function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                //存储信息总条数
                var total = results[1][0].total;
                var pages = Math.ceil(total / pageSize);
                console.log(results[2][0]);
                if (results[2] == null) {
                    res.render("user/collectGood", {
                        collectInfo: results[0],
                        currentPage: currentPage,  //当前页数
                        total: total,  //订单信息总条数
                        pages: pages,  //总页数
                        user_id: user_id,
                        true_name: true_name
                    });
                } else {
                    res.render("user/collectGood", {
                        collectInfo: results[0],
                        currentPage: currentPage,  //当前页数
                        total: total,  //订单信息总条数
                        pages: pages,  //总页数
                        good_status: results[2][0].good_status,  //收藏页面商品的状态：‘2’为上架
                        user_id: user_id,
                        true_name: true_name
                    });
                }
            }
        });
    } else {
        res.send("<script>alert('请先登录！');window.location.href='/login'</script>");
    }

}

/*查询商品是否存在收藏表中*/
function goodIsExist(goods_id, user_id, callback) {
    //定义sql语句
    var sql = "select * from t_good_collect where goods_id = ? and user_id = ?;";
    var params = [goods_id, user_id];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0) {
                callback(err, true);  //存在
            } else {
                callback(err, false);  //不存在
            }
        }
    });
}

//收藏商品
function doCollectGood(req, res) {
    var goods_id = req.query.goods_id;
    var goods_name = req.query.goods_name;
    var price = req.query.price;
    var pic = req.query.pic;
    var sql;
    /*用户登录后，才能进行商品的收藏与取消*/
    if (req.session.currUser) {
        var user_id = req.session.currUser.user_id;
        /*判断用户收藏表中是否有该商品，若有，再次点击收藏则会取消该商品的收藏；若冇，则会收藏该商品。*/
        goodIsExist(goods_id, user_id, function (err, flag) {
            if (flag == true) {
                sql = "delete from t_good_collect where goods_id = ? and user_id = ?;";
                dbUtil.query(sql, [goods_id, user_id], function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                        res.send("<script>alert('取消收藏成功！');window.location.href='/showCollectGood';</script>");
                    }
                });
            } else {
                sql = "insert into t_good_collect values(null,?,?,?,?,2,?,1);";
                var params = [user_id, goods_id, goods_name, price, pic];
                console.log(params);
                dbUtil.query(sql, params, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                        res.send("<script>alert('收藏成功！');window.location.href='/showCollectGood';</script>");
                    }
                });
            }
        });
    } else {
        res.send("<script>alert('您还未登录，不能收藏商品。请先登录！');window.location.href='/login'</script>");
    }

}


/*查询购物车表中的商品状态（未测试）*/
//function queryAllCart(user_id, callback) {
//    var sql = "select b.good_status from t_cart a,t_good_info b where a.goods_id = b.goods_id and a.user_id = ?";
//    dbUtil.query(sql, [user_id], function (err, results) {
//        if (err) {
//            res.render("404", {data: err.message});
//        } else {
//            var status = results[0].good_status;
//            var flag;
//            if (status == '0') {//商品状态：新增
//                flag = '0';
//                callback(err, flag);
//            } else if (status == '1') {//商品状态：下架
//                flag = '1';
//                callback(err, flag);
//            } else {//商品状态：上架
//                flag = '2';
//                callback(err, flag);
//            }
//        }
//    });
//}

//显示购物车页面
function showCart(req, res) {
    var currUser = req.session.currUser;
    if (currUser) {  //判断用户是否已登录
        var user_id = currUser.user_id;
        //分页
        var currentPage = 1;  //初始化当前页面，值为 1
        //判断当前页面是否在首页
        if (req.query.currentPage) {
            currentPage = Number(req.query.currentPage);  //将页数强制转换为数值类型
        }
        //设置页面最大容许信息条数
        var pageSize = config.pageSize;
        //查询已“上架”的商品信息进行渲染
        var sql =
            "select * from t_good_info a,t_cart b where a.goods_id = b.goods_id and b.user_id = ? limit ?,?;" +
            "select count(*) as total from t_cart where user_id = ?;";
        var params = [user_id, (currentPage - 1) * pageSize, pageSize, user_id, user_id];
        dbUtil.query(sql, params, function (err, results) {
            if (err) {
                console.log(err.message);
            } else {
                //存储信息总条数
                var total = results[1][0].total;
                var pages = Math.ceil(total / pageSize);
                res.render("user/cart", {
                    cartInfo: results[0],
                    currentPage: currentPage,  //当前页数
                    total: total,  //订单信息总条数
                    pages: pages,  //总页数
                    true_name: currUser.true_name,
                    user_id: currUser.user_id
                });
            }

        });
    } else {
        res.send("<script>alert('请先登录！');window.location.href='/login'</script>");
    }
}

/*查询商品是否存在购物车表中（未测试）*/
function IsExist(goods_id, user_id, callback) {
    var sql = "select * from t_cart where goods_id = ? and user_id = ?;";
    var params = [goods_id, user_id];
    dbUtil.query(sql, params, function (err, results) {
        if (err) {
            res.render("404", {data: err.message});
        } else {
            if (results.length > 0) {
                callback(err, true);//表示购物车中存在该商品
            } else {
                callback(err, false);//表示购物车中不存在该商品
            }
        }
    })
}

//商品加入购物车操作（未完成）
function doAddByCart(req, res) {
    if (req.session.currUser) {
        //获取商品id
        var goods_id = req.query.goods_id;
        //获取用户id
        var user_id = req.session.currUser.user_id;
        //获取商品数量
        var quantity = req.query.quantity;
        //获取商品价格
        var price = req.query.price;
        //声明共同变量
        var sql;
        var params;
        console.log(quantity);
        IsExist(goods_id, user_id, function (err, flag) {
            console.log("flag:" + flag);
            if (flag == true) {//若存在，则数量在原基础上加上要添加的数量,总价重新计算
                sql = "update t_cart set count = count+" + quantity + ",final_price = price*count where goods_id = ? and user_id = ?;";
                params = [goods_id, user_id];
                dbUtil.query(sql, params, function (err, results) {
                    if (err) {
                        res.render("404", {data: err.message});
                    } else {
                        console.log(results);
                        //渲染购物车页面
                        res.send("<script>alert('添加成功！可以继续添加其他商品哦！');location.href='/showGoodList'</script>");
                    }
                });
            } else {//若不存在，则插入到购物车表中
                //最终价格
                var final_price = price * quantity;
                sql = "insert into t_cart values(?,?,?,?,?,?,?)";
                params = [null, user_id, goods_id, quantity, final_price, price, "2"];
                //console.log(params);
                //console.log(sql);
                dbUtil.query(sql, params, function (err, results) {
                    if (err) {
                        res.render("404", {data: err.message});
                    } else {
                        console.log(results);
                        res.send("<script>alert('添加成功！可以继续添加其他商品哦！');location.href='/showGoodList'</script>");
                    }
                })
            }
        })
    } else {
        res.send("<script>alert('请先登录！');location.href='/login'</script>")
    }
}

//购物车商品数量操作（增加、减少）
function doModifyByCart(req, res) {
    var goods_id = req.query.goods_id;
    var count = req.query.count;
    var user_id = req.session.currUser.user_id;
    var sql = "update t_cart set count = ?,final_price = count*price where goods_id = ? and user_id = ?;";
    var params = [count, goods_id, user_id];
    dbUtil.query(sql, params, function (err, resluts) {
        if (err) {
            res.render("404", {data: err.message});
        } else {
            console.log("操作成功：" + resluts);
            console.log("modify success！");
        }
    })
}

//删除购物车商品操作
function doDeleteByCart(req, res) {
    var goods_id = req.query.goods_id;
    var user_id = req.session.currUser.user_id;
    var sql = "delete from t_cart where goods_id = ? and user_id = ?;";
    dbUtil.query(sql, [goods_id, user_id], function (err, results) {
        if (err) {
            res.render("404", {data: err.message});
        } else {
            console.log("delete success!" + results[0]);
        }
    })
}


module.exports.showIndex = showIndex;
module.exports.doLogin = doLogin;
module.exports.doRegister = doRegister;
//显示个人中心页面
module.exports.showPersonal = showPersonal;
//修改个人信息
module.exports.doModifyPersonalInfo = doModifyPersonalInfo;
//显示商品列表页面
module.exports.showGoodList = showGoodList;
//搜索商品
module.exports.doSearchGoods = doSearchGoods;
//显示商品详情页面（包括商品评价）
module.exports.showGoodDetail = showGoodDetail;
//商品加入购物车操作
module.exports.doAddByCart = doAddByCart;
//显示购物车页面
module.exports.showCart = showCart;
//修改购物车商品数量
module.exports.doModifyByCart = doModifyByCart;
module.exports.doDeleteByCart = doDeleteByCart;
module.exports.doCollectGood = doCollectGood;

//删除个人评论
module.exports.doDelComment = doDelComment;
//显示收藏页面
module.exports.showCollectGood = showCollectGood;
//商品评价
module.exports.doCommentGood = doCommentGood;
//查看个人订单
//module.exports.showViewOrder = showViewOrder;
module.exports.doClearingAccount = doClearingAccount;
//确认订单
module.exports.doClearing = doClearing;


