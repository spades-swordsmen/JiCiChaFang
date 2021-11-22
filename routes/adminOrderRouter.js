const express = require("express");
const orderAdminCtl = require("../control/orderAdminCtl");
const orderRouter = express.Router();

//显示订单信息列表页面
orderRouter.get("/showOrderList", orderAdminCtl.showOrderList);
//显示要编辑的订单信息页面
orderRouter.get("/showOrderOne", orderAdminCtl.showOrderOne);
//删除订单
orderRouter.get("/doDeleteOrder", orderAdminCtl.doDeleteOrder);
//修改订单信息
orderRouter.post("/doModifyOrder", orderAdminCtl.doModifyOrder);
//搜索订单信息
orderRouter.post("/doSearchOrder", orderAdminCtl.doSearchOrder);
//发货
orderRouter.get("/doShipment", orderAdminCtl.doShipment);


module.exports = orderRouter;