const express = require("express");
const userRouter = express.Router();
const userAdminCtl = require("../control/userAdminCtl");

//显示用户信息列表页面
userRouter.get("/showUserList", userAdminCtl.showUserList);
//显示要编辑的用户信息页面
userRouter.get("/showUserOne", userAdminCtl.showUserOne);
//删除用户
userRouter.get("/doDeleteUser", userAdminCtl.doDeleteUser);
//修改用户信息
userRouter.post("/doModifyUser", userAdminCtl.doModifyUser);
//搜索用户信息
userRouter.post("/doSearchUser", userAdminCtl.doSearchUser);


module.exports = userRouter;