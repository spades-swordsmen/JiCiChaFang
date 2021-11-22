const express = require("express");
const commentAdminCtl = require("../control/commentAdminCtl");
var commentRouter = express.Router();

//显示评论信息列表页面
commentRouter.get("/showCommentList", commentAdminCtl.showCommentList);
//删除评论
commentRouter.get("/doDeleteComment", commentAdminCtl.doDeleteComment);
//搜索评论信息
commentRouter.post("/doSearchComment", commentAdminCtl.doSearchComment);
//确认用户评论是否发表
commentRouter.get("/doPublish", commentAdminCtl.doPublish);



module.exports = commentRouter;