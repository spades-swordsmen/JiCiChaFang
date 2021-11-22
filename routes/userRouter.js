const express = require("express");
const userRouter = express.Router();
const userCtl = require("../control/userCtl");

userRouter.get("/",userCtl.showIndex);
//1.登录操作
userRouter.post("/doLogin", userCtl.doLogin);
//显示登录页面
userRouter.get("/login", function (req, res) {
    res.render("login",{});
});
//2.注册操作
userRouter.post("/doRegister", userCtl.doRegister);
//显示注册页面
userRouter.get("/register", function (req, res) {
    res.render("register",{});
});
//3.收藏商品
userRouter.get("/doCollectGood", userCtl.doCollectGood);
//4.商品加入购物车操作
userRouter.get("/doAddByCart", userCtl.doAddByCart);
//5.增加 减少购物车商品数量操作(修改购物车商品数量)
userRouter.get("/doModifyByCart", userCtl.doModifyByCart);
//6.删除购物车商品操作
userRouter.get("/doDeleteByCart", userCtl.doDeleteByCart);
//7.商品评价操作
userRouter.post("/doCommentGood", userCtl.doCommentGood);

//显示个人中心页面
userRouter.get("/showPersonal",userCtl.showPersonal);
//8.修改个人信息
userRouter.post("/doModifyPersonalInfo", userCtl.doModifyPersonalInfo);
//9.查看个人订单
//userRouter.get("/showViewOrder", userCtl.showViewOrder);
//10.商品结算
userRouter.get("/doClearingAccount", userCtl.doClearingAccount);
//11.查看个人评论
//userRouter.get("/doViewComment", userCtl.doViewComment);
//12.删除个人评论
userRouter.get("/doDelComment", userCtl.doDelComment);
//13.搜索商品
userRouter.post("/doSearchGoods", userCtl.doSearchGoods);
//14.退出
userRouter.get("/signOut",function(req,res){
    req.session.destroy(function (err) {
        console.log(err);
        res.send("<script>alert('已成功退出！');window.location.href='/login';</script>");
    });
});

//显示商品列表页面
userRouter.get("/showGoodList", userCtl.showGoodList);
//显示收藏页面
userRouter.get("/showCollectGood", userCtl.showCollectGood);
//显示商品详情页面（包括商品评价）
userRouter.get("/showGoodDetail", userCtl.showGoodDetail);
//显示购物车页面
userRouter.get("/showCart", userCtl.showCart);
//订单确认
userRouter.post("/doClearing", userCtl.doClearing);

module.exports = userRouter;