const express = require("express");
const multer = require("multer");
const goodRouter = express.Router();
const goodAdminCtl = require("../control/goodAdminCtl");
const config = require("../config");

//图片上传设置①
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //设置保存的路径，需要自己先创建upload文件夹
        cb(null, config.publicPath + "/public/img/product");
    },
    filename: function (req, file, cb) {
        var fname = file.originalname.split(".")[0];
        var ext = "." + file.originalname.split(".")[1];
        // 将文件名设置为 字段名+时间戳
        cb(null, fname + "-" + Date.now() + ext);
    }
});
//图片上传设置②
var upload = multer({storage: storage});
// app.post("/uploadSigle",upload.array("picname",3),function (req,res) {
//     res.send("上传成功");
//     var file=req.file;
//     console.log("文件类型："+file.mimeType);
//     console.log("原始文件名："+file.originalname);
//     console.log("文件大小："+file.size);
//     console.log("文件保存路径："+file.path);
// });

//显示商品信息列表页面
goodRouter.get("/showGoodList", goodAdminCtl.showGoodList);
//显示要编辑的商品信息页面
goodRouter.get("/showGoodOne", goodAdminCtl.showGoodOne);
//删除商品
goodRouter.get("/doDeleteGood", goodAdminCtl.doDeleteGood);
//上架
goodRouter.get("/doOpen", goodAdminCtl.doOpen);
//下架
goodRouter.get("/doOff", goodAdminCtl.doOff);
//修改商品信息
goodRouter.post("/doModifyGood",upload.fields([{name:"pic1New"},{name:"pic2New"},{name:"pic3New"},{name:"pic4New"}]), goodAdminCtl.doModifyGood);
//搜索商品信息
goodRouter.post("/doSearchGood", goodAdminCtl.doSearchGood);

//显示添加商品页面
goodRouter.get("/addGood",function(req,res){res.render("admin/addGood");});
//添加商品
goodRouter.post("/doAddGood", upload.fields([{name:"pic1"},{name:"pic2"},{name:"pic3"},{name:"pic4"}]), goodAdminCtl.doAddGood);


module.exports = goodRouter;