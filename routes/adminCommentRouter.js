const express = require("express");
const commentAdminCtl = require("../control/commentAdminCtl");
var commentRouter = express.Router();

//��ʾ������Ϣ�б�ҳ��
commentRouter.get("/showCommentList", commentAdminCtl.showCommentList);
//ɾ������
commentRouter.get("/doDeleteComment", commentAdminCtl.doDeleteComment);
//����������Ϣ
commentRouter.post("/doSearchComment", commentAdminCtl.doSearchComment);
//ȷ���û������Ƿ񷢱�
commentRouter.get("/doPublish", commentAdminCtl.doPublish);



module.exports = commentRouter;